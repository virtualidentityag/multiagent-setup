import prisma from '@/lib/prisma';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = async (request: NextAuthRequest, { params }: { params: Promise<{ threadId: string }> }) => {
  const secret = request.headers.get('Secret');
  if (secret !== process.env.INCOMING_MESSAGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { threadId } = await params
  const { message } = await request.json();
  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }
  const newMessage = await prisma.message.create({
    data: {
      content: message,
      threadId: thread.id,
    }
  });
  global._io.to(thread.id).emit('message', newMessage);

  return NextResponse.json({}, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
