import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = auth(async (request: NextAuthRequest) => {
  const session = request.auth;
  const userEmail = session?.user?.email;
  const threads = await prisma.thread.findMany({
    where: { author: { email: userEmail || '' } },
  });
  return NextResponse.json(threads, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
})
