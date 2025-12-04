'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  QrCode,
  DoorOpen,
  Lightbulb,
  BellOff,
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Phone,
  MessageSquare,
  Check,
  Loader2,
} from 'lucide-react';
import GuestLayout from '@/components/layout/GuestLayout';
import { MOCK_CURRENT_BOOKING } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const roomControls = [
  { id: 'door', icon: DoorOpen, label: 'Unlock Door', color: 'bg-primary' },
  { id: 'lights', icon: Lightbulb, label: 'Lights', color: 'bg-warning' },
  {
    id: 'dnd',
    icon: BellOff,
    label: 'Do Not Disturb',
    color: 'bg-destructive',
  },
];

const services = [
  {
    id: 'food',
    icon: UtensilsCrossed,
    label: 'Order Food',
    description: 'Room service menu',
  },
  {
    id: 'towels',
    icon: Shirt,
    label: 'Extra Towels',
    description: 'Request delivery',
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    label: 'Cleaning',
    description: 'Housekeeping',
  },
  {
    id: 'concierge',
    icon: Phone,
    label: 'Concierge',
    description: 'Call front desk',
  },
  {
    id: 'chat',
    icon: MessageSquare,
    label: 'Chat Support',
    description: '24/7 assistance',
  },
];

const GuestStayPage = () => {
  useParams();
  const [activeControls, setActiveControls] = useState<string[]>([]);
  const [loadingControl, setLoadingControl] = useState<string | null>(null);
  const [requestedServices, setRequestedServices] = useState<string[]>([]);

  const booking = MOCK_CURRENT_BOOKING;

  const handleControlToggle = async (controlId: string) => {
    setLoadingControl(controlId);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setActiveControls((prev) =>
      prev.includes(controlId)
        ? prev.filter((id) => id !== controlId)
        : [...prev, controlId]
    );
    setLoadingControl(null);

    const control = roomControls.find((c) => c.id === controlId);
    toast.success(control?.label, {
      description: activeControls.includes(controlId)
        ? 'Turned off'
        : 'Activated',
    });
  };

  const handleServiceRequest = async (serviceId: string) => {
    if (requestedServices.includes(serviceId)) return;

    setRequestedServices((prev) => [...prev, serviceId]);

    const service = services.find((s) => s.id === serviceId);
    toast.success('Request Sent', {
      description: `${service?.label} has been requested. We'll notify you when it's ready.`,
    });
  };

  return (
    <GuestLayout title={`Room ${booking.roomNumber}`}>
      <div className="animate-fade-in space-y-8">
        {/* Welcome Card */}
        <div className="hotel-card text-center">
          <p className="text-muted-foreground mb-1 text-sm">Welcome back,</p>
          <h2 className="text-foreground mb-2 text-2xl font-semibold">
            {booking.guestName}
          </h2>
          <p className="text-muted-foreground text-sm">
            {booking.roomType} • Check-out:{' '}
            {new Date(booking.checkOut).toLocaleDateString()}
          </p>
        </div>

        {/* Digital Key QR Code */}
        <div className="hotel-card">
          <h3 className="text-foreground mb-4 text-center font-semibold">
            Digital Room Key
          </h3>
          <div className="bg-secondary flex flex-col items-center rounded-xl p-6">
            <div className="bg-card border-border relative mb-4 flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border">
              {/* Simulated QR Code Pattern */}
              <div className="absolute inset-4 grid grid-cols-8 gap-0.5">
                {[...Array(64)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'aspect-square rounded-sm',
                      Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'
                    )}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="text-primary h-12 w-12 opacity-20" />
              </div>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              Scan at door or use button below
            </p>
          </div>
        </div>

        {/* Room Controls */}
        <div>
          <h3 className="text-foreground mb-4 font-semibold">Room Controls</h3>
          <div className="grid grid-cols-3 gap-3">
            {roomControls.map((control) => {
              const isActive = activeControls.includes(control.id);
              const isLoading = loadingControl === control.id;

              return (
                <button
                  key={control.id}
                  onClick={() => handleControlToggle(control.id)}
                  disabled={isLoading}
                  className={cn(
                    'hotel-card-interactive p-4 text-center transition-all duration-200',
                    isActive && 'ring-primary ring-2'
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                      isActive ? control.color : 'bg-secondary'
                    )}
                  >
                    {isLoading ? (
                      <Loader2
                        className={cn(
                          'h-6 w-6 animate-spin',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        )}
                      />
                    ) : (
                      <control.icon
                        className={cn(
                          'h-6 w-6',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        )}
                      />
                    )}
                  </div>
                  <p className="text-foreground text-xs font-medium">
                    {control.label}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">
                    {isActive ? 'ON' : 'OFF'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Requests */}
        <div>
          <h3 className="text-foreground mb-4 font-semibold">
            Service Requests
          </h3>
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {services.map((service) => {
              const isRequested = requestedServices.includes(service.id);

              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceRequest(service.id)}
                  disabled={isRequested}
                  className={cn(
                    'hotel-card-interactive w-28 flex-shrink-0 p-4 text-center',
                    isRequested && 'opacity-60'
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg',
                      isRequested ? 'bg-success' : 'bg-secondary'
                    )}
                  >
                    {isRequested ? (
                      <Check className="text-success-foreground h-5 w-5" />
                    ) : (
                      <service.icon className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                  <p className="text-foreground truncate text-xs font-medium">
                    {service.label}
                  </p>
                  <p className="text-muted-foreground truncate text-[10px]">
                    {service.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="hotel-btn-primary py-4">
            <DoorOpen className="mr-2 h-5 w-5" />
            Unlock Door
          </button>
          <button className="hotel-btn-secondary py-4">
            <Phone className="mr-2 h-5 w-5" />
            Call Front Desk
          </button>
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestStayPage;
