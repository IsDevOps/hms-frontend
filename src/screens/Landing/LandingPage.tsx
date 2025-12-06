'use client';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Star,
  Shield,
  Wifi,
  Coffee,
  Sparkles,
  Smartphone,
  House,
  TrendingUp,
  CalendarCheck,
} from 'lucide-react';
import Image from 'next/image';
import RoomsGrid from '../AllRooms/RoomGrid';

// import { MOCK_ROOMS } from '@/data/mockData';
// import RoomCard from '@/components/RoomCard';
// import HeroImageCarousel from '@/components/Carousel';
// import Rooms from '@/screens/Rooms';

const coreFeatures = [
  {
    icon: Shield,
    title: 'Secure Digital Keys',
    description: 'Access rooms with smartphone authentication.',
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Ultra-fast connectivity throughout the property.',
  },
  {
    icon: Coffee,
    title: '24/7 Room Service',
    description: 'On-demand meals and essentials anytime.',
  },
  {
    icon: Sparkles,
    title: 'Smart Controls',
    description: 'Lighting, AC, curtains — all automated.',
  },
  {
    icon: Smartphone,
    title: 'Self Check-In',
    description: 'No queues. Seamless arrival experience.',
  },
  {
    icon: CalendarCheck,
    title: 'Automated Bookings',
    description: 'Sync reservations across all channels.',
  },
  {
    icon: House,
    title: 'Housekeeping AI',
    description: 'Real-time room cleaning optimization.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Insights',
    description: 'Smart analytics for occupancy and yield.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  // const featuredRooms = MOCK_ROOMS.filter(
  //   (room) => room.status === 'CLEAN'
  // ).slice(0, 3);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury hotel lobby"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <div className="from-primary/10 absolute inset-0 bg-gradient-to-br to-transparent z-10" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="animate-slide-up max-w-3xl lg:col-span-1">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="fill-warning text-warning h-4 w-4"
                    />
                  ))}
                </div>
                <span className="text-white text-sm">
                  Smart Hospitality Platform
                </span>
              </div>

              <h1 className="text-white text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
                The Future of{' '}
                <span className="">Hotel Management</span>
              </h1>

              <p className="text-white mt-6 max-w-2xl text-lg leading-relaxed">
                An end-to-end Operating System for modern hotels. Manage rooms,
                guests, staff, and operations — all from a unified intelligent
                platform.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => router.push('/book')}
                  className="hotel-btn-primary text-base"
                >
                  Explore Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                
              </div>
            </div>

            {/* <div className="mt-12 flex justify-center lg:mt-0">
              <HeroImageCarousel />
            </div> */}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-border border-t py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
              Everything You Need to Run a Modern Hotel
            </h2>
            <p className="text-muted-foreground mt-3">
              Powerful tools to elevate operations & guest satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="hotel-card animate-fade-in text-center"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="bg-secondary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-2 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Management Section */}

      {/* Featured Rooms */}
      <section className="py-16 lg:py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
                Featured Rooms
              </h2>
              <p className="text-muted-foreground mt-3">
                Beautifully curated rooms for a premium stay.
              </p>
            </div>
            <button
              onClick={() => router.push('/book')}
              className="text-primary hidden items-center gap-2 text-sm font-medium hover:underline sm:flex"
            >
              View all rooms
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <Image
            src="/public/img.jpg"
            alt=""
            fill
            className="object-cover transition-opacity duration-1000"
          />

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => router.push('/book')}
              className="hotel-btn-secondary"
            >
              View All Rooms
            </button>
          </div>
          <RoomsGrid rooms={[]} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-semibold">
            Loved By Hotels & Guests Worldwide
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Emma Johnson',
                text: 'The check-in experience is unmatched. Digital keys made everything seamless.',
              },
              {
                name: 'Michael Rodriguez',
                text: 'Managing my boutique hotel has never been easier. The dashboard is brilliant!',
              },
              {
                name: 'Sophia Ade',
                text: 'Guests love the room controls feature — 5-star experience every time.',
              },
            ].map((t) => (
              <div className="hotel-card p-6" key={t.name}>
                <p className="text-muted-foreground mb-4">{t.text}</p>
                <p className="font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hotel-card bg-primary py-12 text-center">
            <h2 className="text-primary-foreground mb-4 text-3xl font-semibold">
              Upgrade to the Future of Hotel Operations
            </h2>
            <p className="text-primary-foreground/80 mx-auto mb-6 max-w-xl">
              Start delivering smarter, faster, and more personalized stays.
            </p>
            <button
              onClick={() => router.push('/book')}
              className="hotel-btn bg-primary-foreground text-primary px-8 py-3"
            >
              Start Booking
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2025 SmartHotel OS — All Rights Reserved
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Admin Portal
              </button>
              <button
                onClick={() => router.push('/guest/stay/b_12345')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Guest Demo
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
