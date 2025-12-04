import Link from 'next/link';
import { ArrowRight, Star, Shield, Wifi, Coffee, Sparkles } from 'lucide-react';
import { MOCK_ROOMS } from '@/data/mockData';

const features = [
  {
    icon: Shield,
    title: 'Secure Digital Keys',
    description: 'Access your room with your smartphone',
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary throughout the hotel',
  },
  {
    icon: Coffee,
    title: '24/7 Room Service',
    description: 'Order anything, anytime',
  },
  {
    icon: Sparkles,
    title: 'Smart Controls',
    description: 'Lights, temperature, and more',
  },
];

export default function Home() {
  const featuredRooms = MOCK_ROOMS.filter(
    (room) => room.status === 'CLEAN'
  ).slice(0, 3);

  return (
    <div className="bg-background min-h-screen">
      {/* <TopHeader /> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="animate-slide-up max-w-3xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-warning text-warning h-4 w-4" />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                Luxury Hospitality
              </span>
            </div>

            <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Experience the Future of{' '}
              <span className="text-primary">Hotel Stays</span>
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
              Seamless digital check-in, smart room controls, and personalized
              service —
              <br className="hidden sm:block" />
              all at your fingertips. Where technology meets timeless elegance.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/book" className="hotel-btn-primary text-base">
                Book Your Stay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/guest/stay/b_12345"
                className="hotel-btn-secondary text-base"
              >
                Guest Portal Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-border border-t py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
              Smart Hotel Experience
            </h2>
            <p className="text-muted-foreground mt-3">
              Everything you need for a perfect stay
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="hotel-card animate-fade-in text-center"
                style={{ animationDelay: `${index * 100}ms` }}
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

      {/* Featured Rooms */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
                Featured Rooms
              </h2>
              <p className="text-muted-foreground mt-3">
                Handpicked accommodations for your comfort
              </p>
            </div>
            <Link
              href="/book"
              className="text-primary hidden items-center gap-2 text-sm font-medium hover:underline sm:flex"
            >
              View all rooms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* <RoomCard room={room} /> */}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/book" className="hotel-btn-secondary">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hotel-card bg-primary py-12 text-center lg:py-16">
            <h2 className="text-primary-foreground mb-4 text-2xl font-semibold sm:text-3xl">
              Ready to Experience Smart Hospitality?
            </h2>
            <p className="text-primary-foreground/80 mx-auto mb-8 max-w-xl">
              Join thousands of guests who have discovered a new way to travel.
            </p>
            <Link
              href="/book"
              className="hotel-btn bg-primary-foreground text-primary px-8 py-3 hover:opacity-90"
            >
              Start Booking
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2024 Grand Hotel. Smart Hotel Operating System.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Admin Portal
              </Link>
              <Link
                href="/guest/stay/b_12345"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Guest Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
