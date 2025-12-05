'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Bell,
  ArrowRight,
  RefreshCw,
  ChefHat,
  Check,
  Truck,
  Play,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import {
  MOCK_ROOMS,
  MOCK_LIVE_EVENTS,
  MOCK_DASHBOARD_STATS,
  MOCK_CHART_DATA,
  MOCK_ANOMALIES,
  LiveEvent,
  ActiveOrder,
  OrderStatus,
  hotelEventEmitter,
} from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import Link from 'next/link';
import { useGetadminDashboardQuery } from '@/store/services/admin-dashboard';
import { NairaIcon } from '@/components/ui/nairaicon';

const ORDER_STATUSES: {
  status: OrderStatus;
  label: string;
  icon: any;
  color: string;
}[] = [
  { status: 'RECEIVED', label: 'Received', icon: Check, color: 'bg-blue-500' },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    icon: ChefHat,
    color: 'bg-warning',
  },
  { status: 'ON_WAY', label: 'On the Way', icon: Truck, color: 'bg-primary' },
  { status: 'COMPLETED', label: 'Completed', icon: Check, color: 'bg-success' },
];

const eventTypeStyles = {
  service: 'bg-blue-50 border-blue-200 text-blue-700',
  booking: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  alert: 'bg-orange-50 border-orange-200 text-orange-700',
  system: 'bg-secondary border-border text-muted-foreground',
  'food-order': 'bg-primary/10 border-primary/30 text-primary',
};

const statusColors = {
  CLEAN: 'bg-success',
  OCCUPIED: 'bg-blue-500',
  DIRTY: 'bg-warning',
};

const AdminDashboard = () => {
  const [events, setEvents] = useState<LiveEvent[]>(MOCK_LIVE_EVENTS);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAnomalyRoom, setSelectedAnomalyRoom] = useState<string | null>(
    null
  );
  const { data } = useGetadminDashboardQuery();
  console.log('Admin Dashboard Data:', data);
  useEffect(() => {
    const handleFoodOrder = (data: ActiveOrder) => {
      setActiveOrders((prev) => [data, ...prev]);

      const newEvent: LiveEvent = {
        id: data.id,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        room: data.roomNumber,
        message: `🍔 New Order: ${data.items.join(' + ')}`,
        type: 'food-order',
        isNew: true,
        items: data.items,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
    };

    const handleServiceRequest = (data: any) => {
      const newOrder: ActiveOrder = {
        id: data.id,
        roomNumber: data.roomNumber,
        type: data.type || 'housekeeping',
        items: data.items || [data.service],
        status: 'RECEIVED',
        scheduledTime: data.scheduledTime || null,
        createdAt: new Date().toISOString(),
      };
      setActiveOrders((prev) => [newOrder, ...prev]);

      const newEvent: LiveEvent = {
        id: data.id,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        room: data.roomNumber,
        message: `${data.service || data.items?.join(', ')} Requested`,
        type: 'service',
        isNew: true,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
    };

    hotelEventEmitter.on('food-order', handleFoodOrder);
    hotelEventEmitter.on('service-request', handleServiceRequest);

    return () => {
      hotelEventEmitter.off('food-order', handleFoodOrder);
      hotelEventEmitter.off('service-request', handleServiceRequest);
    };
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
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
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Notify guest via WebSocket
    hotelEventEmitter.emit('order-update', {
      orderId,
      status: newStatus,
    });

    // toast({
    //   title: "Status Updated",
    //   description: `Order status changed to ${newStatus.replace("_", " ")}`,
    // });
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusOrder: OrderStatus[] = [
      'RECEIVED',
      'IN_PROGRESS',
      'ON_WAY',
      'COMPLETED',
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1
      ? statusOrder[currentIndex + 1]
      : null;
  };

  const handleRoomClick = (roomNumber: string, hasAnomaly: boolean) => {
    if (hasAnomaly) {
      setSelectedAnomalyRoom(roomNumber);
    }
  };

  const handleDispatchMaintenance = () => {
    // toast({
    //   title: "Maintenance Dispatched",
    //   description: `Team sent to Room ${selectedAnomalyRoom}`,
    // });
    setSelectedAnomalyRoom(null);
  };

  const anomalyData = MOCK_ANOMALIES.find(
    (a) => a.roomNumber === selectedAnomalyRoom
  );
  const pendingOrders = activeOrders.filter((o) => o.status !== 'COMPLETED');

  return (
    <>
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
            label="Occupancy Rate"
            value={data?.occupancyRate ?? 0}
            change={MOCK_DASHBOARD_STATS.occupancy.change}
            format="percent"
            icon={Users}
          />
          <StatCard
            label={MOCK_DASHBOARD_STATS.revenue.label}
            value={(data?.totalRevenue ?? 0) * 1000}
            change={MOCK_DASHBOARD_STATS.revenue.change ?? 0}
            format="currency"
            icon={NairaIcon}
          />
          <StatCard
            label="Active Guests"
            value={data?.activeGuests ?? 0}
            change={MOCK_DASHBOARD_STATS.issues.change}
            icon={AlertTriangle}
          />
          <StatCard
            label={MOCK_DASHBOARD_STATS.alerts.label}
            value={data?.totalRooms ?? 0}
            change={MOCK_DASHBOARD_STATS.alerts.change}
            icon={Bell}
          />
        </div>

        {/* Active Orders Section */}
        {pendingOrders.length > 0 && (
          <div className="hotel-card border-primary/30 bg-primary/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground flex items-center gap-2 font-semibold">
                <ChefHat className="text-primary h-5 w-5" />
                Active Orders
              </h2>
              <span className="text-primary bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                {pendingOrders.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {pendingOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const currentStatusConfig = ORDER_STATUSES.find(
                  (s) => s.status === order.status
                );

                return (
                  <div
                    key={order.id}
                    className="bg-card border-border animate-fade-in rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={cn(
                              'rounded px-2 py-0.5 text-xs font-medium text-white',
                              currentStatusConfig?.color
                            )}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className="text-muted-foreground text-xs capitalize">
                            {order.type}
                          </span>
                        </div>
                        <p className="text-foreground font-medium">
                          Room {order.roomNumber}: {order.items.join(' + ')}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {order.total ? `$${order.total} • ` : ''}
                          {order.scheduledTime
                            ? `Scheduled: ${order.scheduledTime}`
                            : new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, nextStatus)
                          }
                          className="shrink-0"
                        >
                          <Play className="mr-1 h-3 w-3" />
                          {nextStatus.replace('_', ' ')}
                        </Button>
                      )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-3 flex gap-1">
                      {ORDER_STATUSES.map((status, index) => {
                        const isCompleted =
                          ORDER_STATUSES.findIndex(
                            (s) => s.status === order.status
                          ) >= index;
                        return (
                          <div
                            key={status.status}
                            className={cn(
                              'h-1.5 flex-1 rounded-full transition-colors',
                              isCompleted ? status.color : 'bg-secondary'
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                    'rounded-lg border p-3 text-sm transition-all duration-300',
                    eventTypeStyles[event.type],
                    event.isNew && 'ring-primary ring-2 ring-offset-1'
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

          {/* Room Status Grid - 20 rooms */}
          <div className="hotel-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground font-semibold">Room Status</h2>
              <Link
                href="/admin/dashboard/rooms"
                className="text-primary flex items-center gap-1 text-sm hover:underline"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {MOCK_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() =>
                    handleRoomClick(room.number, !!room.hasAnomaly)
                  }
                  className={cn(
                    'rounded-lg border p-2 text-center transition-all duration-10 hover:scale-105',
                    room.hasAnomaly
                      ? 'border-destructive bg-destructive/10 animate-pulse cursor-pointer'
                      : 'border-border bg-card cursor-default'
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto mb-1 h-3 w-3 rounded-full',
                      room.hasAnomaly
                        ? 'bg-destructive'
                        : statusColors[room.status]
                    )}
                  />
                  <p className="text-foreground text-xs font-medium">
                    {room.number}
                  </p>
                  {room.guestName && (
                    <p className="text-muted-foreground truncate text-[8px]">
                      {room.guestName.split(' ')[0]}
                    </p>
                  )}
                </button>
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
              <div className="flex items-center gap-2">
                <span className="bg-destructive h-3 w-3 animate-pulse rounded-full" />
                <span className="text-muted-foreground">Anomaly</span>
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

      {/* Anomaly Dialog */}
      <Dialog
        open={!!selectedAnomalyRoom}
        onOpenChange={() => setSelectedAnomalyRoom(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="text-destructive h-5 w-5" />
              ⚠️ Anomaly Detected (High Confidence)
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
              <p className="text-foreground text-sm font-medium">
                Room {selectedAnomalyRoom}
              </p>
              <p className="text-muted-foreground text-xs">
                {anomalyData?.metric || 'Water Consumption'}
              </p>
            </div>

            {/* Chart */}
            <div className="bg-secondary h-48 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: 'hsl(var(--muted-foreground))',
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: 'hsl(var(--muted-foreground))',
                    }}
                  />
                  <Tooltip />
                  <ReferenceLine
                    y={200}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                    label={{ value: 'Threshold', fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload, index, key } = props;
                      const dotKey = key || `dot-${index}`;
                      if (payload.isAnomaly) {
                        return (
                          <circle
                            key={dotKey}
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="hsl(var(--destructive))"
                            stroke="white"
                            strokeWidth={2}
                          />
                        );
                      }
                      return (
                        <circle
                          key={dotKey}
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill="hsl(var(--primary))"
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Analysis */}
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">
                AI Analysis
              </p>
              <p className="text-foreground text-sm">
                {anomalyData?.analysis ||
                  'Water usage 500% above average at 3AM. Burst Pipe signature detected. Immediate inspection recommended.'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-destructive bg-destructive/10 rounded px-2 py-1 text-xs font-medium">
                  Severity: {anomalyData?.severity?.toUpperCase() || 'HIGH'}
                </span>
              </div>
            </div>

            <Button onClick={handleDispatchMaintenance} className="w-full">
              Dispatch Maintenance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
