'use server';

import { db } from '@/lib/db';
import { checkIsAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all UI posts specifically for the admin panel
 */
export async function getAdminUiPosts() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Only Gods can view this data.');
  }

  return await db.uiPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Delete a specific UI post forever. God mode required.
 */
export async function deleteUiPost(postId: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Only Gods can destroy worlds.');
  }

  try {
    await db.uiPost.delete({
      where: { id: postId }
    });
    
    // Purge the caches
    revalidatePath('/admin');
    revalidatePath('/arena');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete UI post", error);
    throw new Error('Database deletion failed.');
  }
}
