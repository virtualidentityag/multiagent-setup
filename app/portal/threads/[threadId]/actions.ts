'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const sendChatMessage = async (formData: FormData) => {
  const response = await fetch(process.env.SEND_MESSAGE_WEBHOOK_URL || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Session-Key': formData.get('threadId') as string,
    },
    body: JSON.stringify({
      message: formData.get('message'),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  const data = await response.json();
  console.log('Message sent successfully:', data);

  prisma.message.create({
    data: {
      threadId: formData.get('threadId') as string,
      content: formData.get('message') as string,
      authorId: formData.get('authorId') as string,
    }
  }).catch((error) => {
    console.error('Error saving message to database:', error);
    throw new Error('Failed to save message to database');
  });

  revalidatePath(`/portal/threads/${formData.get('threadId')}`);
}