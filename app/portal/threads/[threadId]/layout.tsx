'use server';

import { auth } from '@/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import prisma from '@/lib/prisma';
import MessageProvider from '@/provider/messages';
import ThreadProvider from '@/provider/threads';

export default async function PortalLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ threadId: string; }>
}>) {
  const session = await auth();
  const { threadId } = await params;
  const threads = await prisma.thread.findMany({
    where: { author: { email: session?.user?.email || '' } },
  });
  const messages = await prisma.message.findMany({
    where: { threadId: threadId },
    orderBy: { createdAt: 'asc' },
  });
  return (
    <ThreadProvider threads={threads} activeThreadId={threadId}>
      <MessageProvider messages={messages}>
        <SidebarProvider>
          <AppSidebar />
          <main className='w-full flex flex-col gap-4 p-4 items-center'>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </MessageProvider>
    </ThreadProvider>
  );
}
