'use client';

import { useState } from 'react';
import { deleteUiPost } from '@/actions/admin';
import { Trash2 } from 'lucide-react';

export function DeletePostButton({ postId, title }: { postId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to completely DESTROY the UI Post: "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUiPost(postId);
      // The server action revalidates the cache automatically
    } catch (err) {
      console.error(err);
      alert("Failed to destroy post. Make sure you are authorized.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-all flex items-center gap-2 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Delete this record permanently"
    >
      <Trash2 className="h-4 w-4" />
      <span className="text-xs font-bold uppercase hidden sm:inline-block">Delete</span>
    </button>
  );
}
