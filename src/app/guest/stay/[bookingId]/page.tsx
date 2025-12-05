'use client';
import { useParams } from 'next/navigation';

import GuestLayout from '@/components/layout/GuestLayout';
import { MOCK_CURRENT_BOOKING } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode } from 'lucide-react';

const GuestStayPage = () => {
  useParams();
  const { bookingId } = useParams();
  const router = useRouter();

  const booking = MOCK_CURRENT_BOOKING;

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
        <Button
          onClick={() => router.push(`/guest/portal/${bookingId}`)}
          className="w-full py-6 text-base font-medium"
          size="lg"
        >
          Visit Service Portal
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Room Info */}
        <div className="text-muted-foreground text-center text-xs">
          <p>Booking ID: {booking.id}</p>
          <p className="mt-1">
            {booking.checkIn} — {booking.checkOut}
          </p>
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestStayPage;
