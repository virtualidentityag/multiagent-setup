'use client'
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useEffect } from 'react';

export default function Chat({ sessionKey }: { sessionKey: string }) {
  useEffect(() => {
    createChat({
      webhookUrl: process.env.N8N_CHAT_WEBHOOK_URL,
      mode: 'fullscreen',
      metadata: {
        sessionKey,
      },
    });
  }, []);

  return (
    <div>
    </div>
  );
}
