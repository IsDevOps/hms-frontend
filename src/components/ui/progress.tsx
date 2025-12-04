'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  max,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const safeValue = value ?? 0;
  const percentage = Math.min(100, (safeValue / (max ?? 0)) * 100 || 0);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-[#EDEFF5]',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-secondary h-full w-full flex-1 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
