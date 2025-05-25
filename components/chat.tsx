'use client'
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useEffect } from 'react';

export default function Chat({ sessionKey }: { sessionKey: string }) {
  useEffect(() => {
    console.log('sessionKey', process.env.N8N_CHAT_WEBHOOK_URL);
    createChat({
      webhookUrl: "https://virtualidentity.app.n8n.cloud/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat",
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
