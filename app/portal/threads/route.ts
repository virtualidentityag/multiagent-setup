import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextAuthRequest } from 'next-auth';
import { redirect } from 'next/navigation';

export const GET = auth(async (request: NextAuthRequest) => {
  const session = request.auth;
  const userEmail = session?.user?.email;

  let latestThread = await prisma.thread.findFirst({
    where: { author: { email: userEmail || '' } },
    orderBy: { updatedAt: 'desc' },
  });
  console.log('Latest thread:', latestThread);
  if (!latestThread) {
    const user = await prisma.user.findFirst({
      where: { email: userEmail || '' },
    });
    if (!user) {
      console.error('User not found for email:', userEmail);
      redirect('/login');
    }
    latestThread = await prisma.thread.create({
      data: {
        name: 'New Thread',
        authorId: user.id || '',
      }
    })
  }
  redirect(`/portal/threads/${latestThread?.id}`);
})
