import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      autoComplete="off"
      className={cn(
        'text-body-text-2 h-12 w-full rounded-[0.5rem] bg-[#F5F6F8] text-sm font-normal text-ellipsis',
        'file:text-body-text-2 placeholder:text-body-text-1 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-w-0 border px-3 py-2.5 shadow-xs transition-[color,box-shadow] outline-none placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border focus-visible:border-black',
        'aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
