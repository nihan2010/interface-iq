'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UploadAreaProps {
  onUpload: (fileUrl: string) => void;
  isLoading?: boolean;
}

export function UploadArea({ onUpload, isLoading }: UploadAreaProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        onUpload(url);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ease-in-out',
        isDragActive ? 'border-foreground bg-accent/50' : 'border-border hover:border-muted-foreground/50 hover:bg-accent/20',
        isDragReject && 'border-destructive bg-destructive/10',
        isLoading && 'pointer-events-none opacity-50'
      )}
    >
      <input {...getInputProps()} />
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isDragActive ? 1.1 : 1 }}
        className="rounded-full bg-accent/50 p-4 mb-4 group-hover:bg-accent transition-colors"
      >
        <UploadCloud className="h-8 w-8 text-foreground" />
      </motion.div>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">
        {isDragActive ? 'Drop the UI here...' : 'Upload your UI'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drag & drop a screenshot, or click to browse.
      </p>
      <div className="mt-6 flex items-center space-x-2 text-xs text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
        <span>Supports PNG, JPG, WEBP</span>
      </div>
    </div>
  );
}
