import { ReactNode } from 'react';
import {  } from 'lucide-react';

interface GuestLayoutProps {
  children: ReactNode;
  title?: string;
}

const GuestLayout = ({ children,  }: GuestLayoutProps) => {
  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
};

export default GuestLayout;
