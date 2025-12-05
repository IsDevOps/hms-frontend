import * as React from 'react';
import { LucideProps } from 'lucide-react';

export const NairaIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20V4h3l6 16h3V4" />
      <path d="M4 12h14" />
      <path d="M4 8h14" />
    </svg>
  )
);

// give it a displayName so React DevTools shows it properly
NairaIcon.displayName = 'NairaIcon';
