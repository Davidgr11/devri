/**
 * Loading Component
 * Spinner and loading states
 */

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className,
  ...props
}: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-accent border-t-transparent',
        sizes[size]
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center gap-3', className)}
      {...props}
    >
      {spinner}
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

/**
 * Skeleton loader for content placeholders
 */
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({
  width,
  height = '1rem',
  rounded = false,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}
