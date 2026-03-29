'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

/** Fetch a single post with all its ratings (for the detail page) */
export async function getPostWithRatings(postId: string) {
  return await db.uiPost.findUnique({
    where: { id: postId },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

/** Submit or update a user's rating + suggestion for a post */
export async function submitRating(data: {
  postId: string;
  score: number;
  feedback?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('You must be signed in to rate a UI!');
  if (data.score < 1 || data.score > 10) throw new Error('Score must be between 1 and 10.');

  // Upsert — one rating per user per post (enforced by DB unique constraint too)
  await db.rating.upsert({
    where: {
      postId_userId: { postId: data.postId, userId },
    },
    update: {
      score: data.score,
      feedback: data.feedback,
    },
    create: {
      postId: data.postId,
      userId,
      score: data.score,
      feedback: data.feedback,
    },
  });

  revalidatePath(`/arena/${data.postId}`);
  return { success: true };
}
