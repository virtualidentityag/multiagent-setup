import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextAuthRequest } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const GET = auth(async (request: NextAuthRequest, { params }: { params: Promise<{ threadId: string }> }) => {
  const session = request.auth;
  const userEmail = session?.user?.email;
  const { threadId } = await params
  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
      author: { email: userEmail || '' }
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    }
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }
  return NextResponse.json(thread.messages, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

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
  await prisma.message.create({
    data: {
      content: message,
      threadId: thread.id,
    }
  });
  revalidatePath(`/portal/threads/${threadId}`);
  return NextResponse.json({}, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
