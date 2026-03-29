import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  delay?: number;
}

export function ProgressBar({ value, max = 100, className, indicatorClassName, delay = 0 }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), max) / max;

  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <motion.div
        className={cn('h-full bg-primary', indicatorClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay }}
      />
    </div>
  );
}
