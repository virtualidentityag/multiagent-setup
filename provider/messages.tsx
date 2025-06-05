"use client"

import { Message } from '@/lib/prisma';
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useThreads } from './threads';

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
  const { activeThreadId } = useThreads();

  const onReceiveMessage = (message: Message) => {
    console.log("Received message:", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      socket.emit("joinThread", activeThreadId);
      socket.on("message", onReceiveMessage);
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("message", onReceiveMessage);
      socket.emit("leaveThread", activeThreadId);
      socket.off("connect", onConnect);
    };
  }, [activeThreadId]);
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