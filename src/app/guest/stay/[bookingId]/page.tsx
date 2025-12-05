// 'use client';
// import { useParams } from 'next/navigation';

// import GuestLayout from '@/components/layout/GuestLayout';
// import { MOCK_CURRENT_BOOKING } from '@/data/mockData';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { ArrowRight, QrCode } from 'lucide-react';

// const GuestStayPage = () => {
//   useParams();
//   const { bookingId } = useParams();
//   const router = useRouter();

//   const booking = MOCK_CURRENT_BOOKING;

//   return (
//     <GuestLayout title={`Room ${booking.roomNumber}`}>
//       <div className="animate-fade-in space-y-8">
//         {/* Welcome Card */}
//         <div className="hotel-card text-center">
//           <p className="text-muted-foreground mb-1 text-sm">Welcome back,</p>
//           <h2 className="text-foreground mb-2 text-2xl font-semibold">
//             {booking.guestName}
//           </h2>
//           <p className="text-muted-foreground text-sm">
//             {booking.roomType} • Check-out:{' '}
//             {new Date(booking.checkOut).toLocaleDateString()}
//           </p>
//         </div>

//         {/* Digital Key QR Code */}
//         <div className="hotel-card">
//           <h3 className="text-foreground mb-4 text-center font-semibold">
//             Digital Room Key
//           </h3>
//           <div className="bg-secondary flex flex-col items-center rounded-xl p-6">
//             <div className="bg-card border-border relative mb-4 flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border">
//               {/* Simulated QR Code Pattern */}
//               <div className="absolute inset-4 grid grid-cols-8 gap-0.5">
//                 {[...Array(64)].map((_, i) => (
//                   <div
//                     key={i}
//                     className={cn(
//                       'aspect-square rounded-sm',
//                       Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'
//                     )}
//                   />
//                 ))}
//               </div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <QrCode className="text-primary h-12 w-12 opacity-20" />
//               </div>
//             </div>
//             <p className="text-muted-foreground text-center text-sm">
//               Scan at door or use button below
//             </p>
//           </div>
//         </div>
//         <Button
//           onClick={() => router.push(`/guest/portal/${bookingId}`)}
//           className="w-full py-6 text-base font-medium"
//           size="lg"
//         >
//           Visit Service Portal
//           <ArrowRight className="ml-2 h-5 w-5" />
//         </Button>

//         {/* Room Info */}
//         <div className="text-muted-foreground text-center text-xs">
//           <p>Booking ID: {booking.id}</p>
//           <p className="mt-1">
//             {booking.checkIn} — {booking.checkOut}
//           </p>
//         </div>
//       </div>
//     </GuestLayout>
//   );
// };

// export default GuestStayPage;

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, DoorOpen, Wifi, Coffee } from 'lucide-react';

import GuestLayout from '@/components/layout/GuestLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Define strict types for better TS support (optional but good for hackathon safety)
interface BookingData {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  qrCodeSecret: string;
  status: string;
  guest: {
    name: string;
    email: string;
  };
  room: {
    number: string;
    type: string;
  };
}

const GuestStayPage = () => {
  const { bookingId } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;

      try {
        setLoading(true);
        // Direct Axios call to your NestJS Backend
        const response = await axios.get(
          `https://api-staging.medicate.health/api/v1/bookings/${bookingId}`
        );
        setBooking(response.data);
      } catch (err: any) {
        console.error('Failed to fetch booking:', err);
        setError('Could not find your booking information.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // 1. Loading State (Sleek Skeletons)
  if (loading) {
    return (
      <GuestLayout title="Loading Key...">
        <div className="animate-pulse space-y-6 p-4">
          <Skeleton className="h-32 w-full rounded-xl bg-slate-200" />
          <Skeleton className="h-64 w-full rounded-xl bg-slate-200" />
        </div>
      </GuestLayout>
    );
  }

  // 2. Error State
  if (error || !booking) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <DoorOpen className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Error</h2>
        <p className="mt-2 mb-6 text-slate-500">
          {error || 'Booking not found.'}
        </p>
        <Button onClick={() => router.push('/')} variant="outline">
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <GuestLayout title={`Room ${booking.room.number}`}>
      <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 pb-20 duration-700">
        {/* Welcome Header */}
        <div className="mt-4 space-y-1 text-center">
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Current Stay
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Hello, {booking.guest.name.split(' ')[0]}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {booking.room.type} Suite
            </span>
            <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
              Checked In
            </span>
          </div>
        </div>

        {/* 🔑 THE DIGITAL KEY CARD (Apple Wallet Style) */}
        <div className="relative transform overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          {/* Decorative background effects */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-200 uppercase">
              <DoorOpen className="h-4 w-4" /> Digital Access Key
            </div>

            {/* The Real QR Code */}
            <div className="rounded-2xl bg-white p-4 shadow-lg ring-4 ring-white/10">
              <QRCodeSVG
                value={booking.qrCodeSecret || 'ERROR'}
                size={180}
                level="Q" // High error correction
                bgColor="#ffffff"
                fgColor="#0f172a"
                includeMargin={false}
              />
            </div>

            <div className="text-center">
              <p className="mb-1 text-[10px] tracking-widest text-white/40 uppercase">
                Security Code
              </p>
              <p className="text-shadow-sm font-mono text-xl font-bold tracking-[0.2em] text-white">
                {booking.qrCodeSecret?.slice(0, 4)} -{' '}
                {booking.qrCodeSecret?.slice(4, 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-colors hover:border-blue-200">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Wifi className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              WiFi Access
            </span>
            <span className="rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-400">
              LUMEN_GUEST
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition-colors hover:border-emerald-200">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Coffee className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Breakfast
            </span>
            <span className="text-xs text-slate-400">7:00 - 10:30 AM</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={() => router.push(`/guest/portal/${bookingId}`)}
          className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-lg font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all hover:bg-emerald-700 active:scale-95"
        >
          Visit Service Portal
          <ArrowRight className="ml-1 h-5 w-5" />
        </Button>

        {/* Footer Info */}
        <div className="pb-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            Checkout by 11:00 AM on{' '}
            {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestStayPage;
