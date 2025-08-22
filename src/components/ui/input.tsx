'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input universal y moderno: accesible, dark/light, validación y SSR-friendly.
 * - Compatible con thirdweb SDK v5 y sistemas de formularios modernos.
 * - Sin interfaces vacías ni redundancias.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none border-input dark:bg-input/30 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      aria-invalid={props['aria-invalid'] ?? false}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
