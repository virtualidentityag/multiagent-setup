import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Copy, CornerDownLeft, Mic, Paperclip, RefreshCcw } from 'lucide-react'

type MessageMemory = {
  human: string;
  ai: string;
}

type MessageMemoryResponse = {
  messages: MessageMemory[];
}

type Message = {
  sender: 'user' | 'bot';
  message: string;
  id: string;
}

export default async function Portal() {
  const session = await auth()

  if (!session) {
    return <div>Not authenticated</div>
  }

  const URLS = {
    GET_MESSAGES_WEBHOOK_URL: process.env.GET_MESSAGES_WEBHOOK_URL || '',
    SEND_MESSAGE_WEBHOOK_URL: process.env.SEND_MESSAGE_WEBHOOK_URL || '',
  }

  if (Object.values(URLS).some(url => !url)) {
    return (
      <div className="container">
        <h1 className="text-2xl font-bold">Configuration Error</h1>
        <p className="text-red-500">Please ensure that the environment variables for webhook URLs are set correctly.</p>
      </div>
    )
  }

  const { messages }: MessageMemoryResponse = await fetch(URLS.GET_MESSAGES_WEBHOOK_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Session-Key': 'test',
    },
  }).then(res => res.json());

  const actionIcons = [
    { icon: Copy, type: 'Copy' },
    { icon: RefreshCcw, type: 'Regenerate' },
  ];

  const formattedMessages: Message[] = messages.reduce((acc: Message[], msg, index) => {
    if (msg.human) {
      acc.push({
        sender: 'user',
        message: msg.human,
        id: `user-${index}`,
      });
    }
    if (msg.ai) {
      acc.push({
        sender: 'bot',
        message: msg.ai,
        id: `bot-${index}`,
      });
    }
    return acc;
  }, []);

  console.log("Fetched messages:", messages);


  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <ChatMessageList>
        {formattedMessages.map((message) => {
          const variant = message.sender === 'user' ? 'sent' : 'received';
          return (
            <ChatBubble key={message.id} variant={variant}>
              <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
              <ChatBubbleMessage
                className={message.sender === "user" ? "bg-sky-400" : ""}
              >
                {message.message}

                {message.sender === 'bot' && (
                  <div>
                    {actionIcons.map(({ icon: Icon, type }) => (
                      <ChatBubbleAction
                        className="size-6"
                        key={type}
                        icon={<Icon className="size-3" />}
                      />
                    ))}
                  </div>
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          )
        })}
      </ChatMessageList>
      <form
        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        action={async (formData: FormData) => {
          "use server"

          const response = await fetch(URLS.SEND_MESSAGE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Session-Key': 'test',
            },
            body: JSON.stringify({
              message: formData.get('message'),
            }),
          })
          console.log("Response from AI:", await response.json());
        }}
      >
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
