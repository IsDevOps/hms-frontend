import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0px_-2px_0px_0px_rgba(255, 255, 255, 0.24)_inset] hover:bg-primary-hovered ',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-[#F5F6F8] text-header-text shadow-xs hover:bg-[#DBDCDE]',
        ghost:
          'h-auto !text-header-text hover:text-header-text hover:bg-[#F5F6F8]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2 rounded-[6.25rem] has-[>svg]:px-3',
        sm: 'h-8 rounded-[6.25rem] gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-[6.25rem] px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const showLoader = loading && !asChild;

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        showLoader && 'pointer-events-none opacity-[.8]'
      )}
      {...props}
    >
      <React.Fragment>
        {showLoader ? <Loader2 className="mr-2 animate-spin" /> : null}
        {props.children}
      </React.Fragment>
    </Comp>
  );
}

export { Button, buttonVariants };
