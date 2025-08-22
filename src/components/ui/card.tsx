'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
};

export function Card({ children, className = '', asChild = false }: CardProps) {
  const Comp = asChild ? React.Fragment : 'div';
  return asChild ? (
    <Comp>{children}</Comp>
  ) : (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-2 transition-colors',
        className,
      )}
      role="group"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function CardContent({
  children,
  className = 'p-4',
  ...props
}: CardContentProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  );
}
