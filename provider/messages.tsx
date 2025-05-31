"use client"

import { Message } from '@/app/generated/prisma';
import { createContext, useContext, useState } from "react";

const MessageContext = createContext<{
  messages: Message[];
  sendMessage?: (message: Message) => void;
}>({
  messages: [],
  sendMessage: undefined,
})

export default function MessageProvider({ children, messages: initialMessages }: Readonly<{
  messages?: Message[];
  children: React.ReactNode;
}>) {
  const [messages, setMessages] = useState(initialMessages || []);
  return (
    <MessageContext.Provider value={{
      messages,
      sendMessage: (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    }}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
}