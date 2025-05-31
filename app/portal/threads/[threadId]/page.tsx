import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/ui/chat/chat-input'
import prisma from '@/lib/prisma'
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react'
import { sendChatMessage } from './actions'
import { MessageList } from '@/components/message-list'
import { auth } from '@/auth'


export default async function Portal({ params }: Readonly<{ params: Promise<{ threadId: string }> }>) {
  const session = await auth();
  const { threadId } = await params;
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email || '' },
  });
  const messages = await prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
  });

  console.log("Fetched messages:", messages);


  return (
    <div className="container w-full flex flex-col gap-4 p-4 items-center">
      <MessageList />
      <form
        className="w-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        action={sendChatMessage}
      >
        <input type="hidden" name="threadId" value={threadId} />
        <input type="hidden" name="authorId" value={user?.id} />
        <ChatInput
          placeholder="Type your message here..."
          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button variant="ghost" size="icon">
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Mic className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>

          <Button
            size="sm"
            className="ml-auto gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
