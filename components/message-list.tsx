'use client'

import { useMessages } from '@/provider/messages';
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Message } from '@/app/generated/prisma';
import { Copy, RefreshCcw } from 'lucide-react';

export function MessageList() {
  const { messages } = useMessages();
  const checkIfUser = (message: Message) => message.authorId;

  const actionIcons = [
    { icon: Copy, type: 'Copy' },
    { icon: RefreshCcw, type: 'Regenerate' },
  ];
  return (
    <ChatMessageList>
      {messages.map((message) => {
        const isUser = checkIfUser(message);
        const variant = isUser ? 'sent' : 'received';
        return (
          <ChatBubble key={message.id} variant={variant}>
            <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
            <ChatBubbleMessage
              className={isUser ? "bg-sky-400" : ""}
            >
              {message.content}

              {!isUser && (
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
  )
}
