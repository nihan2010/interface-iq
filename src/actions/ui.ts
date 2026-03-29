'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function submitUiPost(data: {
  title: string;
  description?: string;
  imageBase64: string;
  aiScore?: number;
  aiReadiness?: number;
  aiTags?: string[];
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to submit to the Arena!');
  }

  const post = await db.uiPost.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageBase64,
      aiScore: data.aiScore,
      aiReadiness: data.aiReadiness,
      aiTags: data.aiTags ?? [],
    },
  });

  revalidatePath('/arena');
  return { success: true, postId: post.id };
}
