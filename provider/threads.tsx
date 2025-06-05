"use client"

import { Thread } from '@/lib/prisma';
import { createContext, useContext, useState } from "react";

const ThreadContext = createContext<{
  threads: Thread[];
  activeThreadId?: string | null;
  setActiveThreadId?: (id: string) => void;
}>({
  threads: [],
  activeThreadId: null,
})

export default function ThreadProvider({ threads: initialThreads, activeThreadId: initialActiveThreadId, children }: Readonly<{
  threads: Thread[];
  activeThreadId: string;
  children: React.ReactNode;
}>) {
  const [threads] = useState(initialThreads || []);
  const [activeThreadId, setActiveThreadId] = useState<string>(initialActiveThreadId);
  return (
    <ThreadContext.Provider value={{
      threads,
      activeThreadId,
      setActiveThreadId,
    }}>
      {children}
    </ThreadContext.Provider>
  )
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
}