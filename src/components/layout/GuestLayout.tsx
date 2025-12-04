import { ReactNode } from 'react';
import { Bell, Menu } from 'lucide-react';

interface GuestLayoutProps {
  children: ReactNode;
  title?: string;
}

const GuestLayout = ({ children, title }: GuestLayoutProps) => {
  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <header className="bg-card border-border sticky top-0 z-50 border-b">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <button className="hover:bg-secondary rounded-lg p-2 transition-colors">
            <Menu className="text-foreground h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-foreground text-lg font-semibold">{title}</h1>
          )}
          <button className="hover:bg-secondary relative rounded-lg p-2 transition-colors">
            <Bell className="text-foreground h-5 w-5" />
            <span className="bg-success absolute top-1 right-1 h-2 w-2 rounded-full" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
};

export default GuestLayout;
