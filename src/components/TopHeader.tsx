import { Bell, BedDouble } from 'lucide-react';
import Link from 'next/link';

interface TopHeaderProps {
  showNotifications?: boolean;
}

const TopHeader = ({ showNotifications = true }: TopHeaderProps) => {
  return (
    <header className="bg-card border-border sticky top-0 z-50 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <BedDouble className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-foreground text-xl font-semibold tracking-tight">
              Grand Hotel
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/book"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {showNotifications && (
              <button className="hover:bg-secondary relative rounded-lg p-2 transition-colors">
                <Bell className="text-muted-foreground h-5 w-5" />
                <span className="bg-success absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
              </button>
            )}
            <Link href="/book" className="hotel-btn-primary text-sm">
              Book a Room
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
