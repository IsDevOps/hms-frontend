'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  BedDouble,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
  { name: 'Rooms', href: '/admin/rooms', icon: BedDouble },
  { name: 'Guests', href: '/admin/guests', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="bg-sidebar-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <BedDouble className="text-sidebar-primary-foreground h-4 w-4" />
              </div>
              <span className="text-sidebar-foreground text-lg font-semibold">
                HotelOS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-1 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-sidebar-border border-t p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-sidebar-accent-foreground text-xs font-medium">
                  AM
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  Admin Manager
                </p>
                <p className="text-sidebar-foreground/60 truncate text-xs">
                  admin@hotel.com
                </p>
              </div>
              <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-1 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="bg-card border-border flex h-16 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-secondary rounded-lg p-2 transition-colors lg:hidden"
            >
              <Menu className="text-foreground h-5 w-5" />
            </button>
            <h1 className="text-foreground hidden text-lg font-semibold sm:block">
              Hotel Operations
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-secondary relative rounded-lg p-2 transition-colors">
              <Bell className="text-muted-foreground h-5 w-5" />
              <span className="bg-warning absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
