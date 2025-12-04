'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  AlertTriangle,
  Bell,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import RoomCard from '@/components/RoomCard';
import {
  MOCK_ROOMS,
  MOCK_LIVE_EVENTS,
  MOCK_DASHBOARD_STATS,
  LiveEvent,
} from '@/data/mockData';
import { cn } from '@/lib/utils';

const eventTypeStyles = {
  service: 'bg-blue-50 border-blue-200 text-blue-700',
  booking: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  alert: 'bg-orange-50 border-orange-200 text-orange-700',
  system: 'bg-secondary border-border text-muted-foreground',
};

const AdminDashboardPage = () => {
  const [events, setEvents] = useState<LiveEvent[]>(MOCK_LIVE_EVENTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new event occasionally
      if (Math.random() > 0.7) {
        const newEvent: LiveEvent = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          room: `${Math.floor(Math.random() * 4 + 1)}0${Math.floor(Math.random() * 6 + 1)}`,
          message: [
            'Guest requested wake-up call',
            'Mini bar restocked',
            'New reservation confirmed',
          ][Math.floor(Math.random() * 3)],
          type: ['service', 'booking', 'system'][
            Math.floor(Math.random() * 3)
          ] as LiveEvent['type'],
        };
        setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Mission Control
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time hotel operations overview
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hotel-btn-ghost"
        >
          <RefreshCw
            className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')}
          />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={MOCK_DASHBOARD_STATS.occupancy.label}
          value={MOCK_DASHBOARD_STATS.occupancy.value}
          change={MOCK_DASHBOARD_STATS.occupancy.change}
          format="percent"
          icon={Users}
        />
        <StatCard
          label={MOCK_DASHBOARD_STATS.revenue.label}
          value={MOCK_DASHBOARD_STATS.revenue.value}
          change={MOCK_DASHBOARD_STATS.revenue.change}
          format="currency"
          icon={DollarSign}
        />
        <StatCard
          label={MOCK_DASHBOARD_STATS.issues.label}
          value={MOCK_DASHBOARD_STATS.issues.value}
          change={MOCK_DASHBOARD_STATS.issues.change}
          icon={AlertTriangle}
        />
        <StatCard
          label={MOCK_DASHBOARD_STATS.alerts.label}
          value={MOCK_DASHBOARD_STATS.alerts.value}
          change={MOCK_DASHBOARD_STATS.alerts.change}
          icon={Bell}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live Events Feed */}
        <div className="hotel-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">Live Events</h2>
            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="bg-success animate-pulse-soft h-2 w-2 rounded-full" />
              Live
            </span>
          </div>
          <div className="max-h-[400px] space-y-3 overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  'animate-fade-in rounded-lg border p-3 text-sm',
                  eventTypeStyles[event.type]
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{event.message}</p>
                    <p className="mt-0.5 text-xs opacity-70">
                      Room {event.room}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap opacity-70">
                    {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status Grid */}
        <div className="hotel-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">Room Status</h2>
            <Link
              href="/admin/rooms"
              className="text-primary flex items-center gap-1 text-sm hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {MOCK_ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} compact />
            ))}
          </div>

          {/* Legend */}
          <div className="border-border mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-success h-3 w-3 rounded-full" />
              <span className="text-muted-foreground">Clean</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-warning h-3 w-3 rounded-full" />
              <span className="text-muted-foreground">Dirty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Banner */}
      <Link
        href="/admin/alerts"
        className="hotel-card bg-warning/5 border-warning/20 hover:bg-warning/10 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="bg-warning/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <AlertTriangle className="text-warning h-5 w-5" />
          </div>
          <div>
            <p className="text-foreground font-semibold">
              2 Active Anomalies Detected
            </p>
            <p className="text-muted-foreground text-sm">
              AI monitoring has flagged unusual patterns
            </p>
          </div>
        </div>
        <ArrowRight className="text-muted-foreground h-5 w-5" />
      </Link>
    </div>
  );
};

export default AdminDashboardPage;
