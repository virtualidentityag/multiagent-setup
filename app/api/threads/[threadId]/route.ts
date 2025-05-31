import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = auth(async (request: NextAuthRequest, { params }: { params: Promise<{ threadId: string }> }) => {
  const session = request.auth;
  const userEmail = session?.user?.email;
  const { threadId } = await params
  const user = await prisma.user.findUnique({
    where: { email: userEmail || '' },
  });
  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
      authorId: user?.id || '',
    },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }
  return NextResponse.json(thread, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
})
