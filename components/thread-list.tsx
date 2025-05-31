'use client'

import { useThreads } from '@/provider/threads';

export function ThreadList() {
  const { threads } = useThreads();
  return (
    <>
      {threads.map((thread) => (
        <div key={thread.id}>{thread.name}</div>
      ))}
    </>
  )
}
