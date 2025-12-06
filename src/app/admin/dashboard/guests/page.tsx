'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns'; // Make sure to npm i date-fns

// --- Types based on your current Entity ---
interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  fraudScore: number;
  guest: {
    name: string;
    email: string;
    // We don't have phone/avatar, so we'll fallback gracefully
  };
  room: {
    number: string;
    type: string;
  };
}

export default function GuestDirectory() {
  const [guests, setGuests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State (Client-side for simplicity in hackathon)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      try {
        // We fetch ALL bookings and filter/paginate on client to save backend work
        const res = await fetch(
          'https://api-staging.medicate.health/api/v1/bookings'
        );
        const data = await res.json();
        setGuests(data);
      } catch (err) {
        console.error('Failed to load guests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  // --- Filtering Logic ---
  const filteredGuests = guests.filter((g) => {
    // Only show active guests if you want? Or all. Let's do search.
    const searchLower = searchTerm.toLowerCase();
    return (
      g.guest?.name?.toLowerCase().includes(searchLower) ||
      g.room?.number?.toString().includes(searchLower) ||
      g.guest?.email?.toLowerCase().includes(searchLower)
    );
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGuests = filteredGuests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // --- Helper: Initials for Avatar ---
  const getInitials = (name: string) =>
    (name || 'G')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  // --- Helper: Status Style ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CHECKED_IN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CHECKED_OUT':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 text-slate-900">
      {/* HEADER */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Guest Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {guests.length} total records found
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, room, or email..."
            className="border-slate-200 bg-white pl-9 focus-visible:ring-slate-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b-slate-100 hover:bg-slate-50/80">
                  <TableHead className="h-12 w-[300px] pl-6 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Guest
                  </TableHead>
                  <TableHead className="h-12 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Room Info
                  </TableHead>
                  <TableHead className="h-12 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Stay Duration
                  </TableHead>
                  <TableHead className="h-12 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGuests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-slate-400"
                    >
                      No guests found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentGuests.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="group border-b-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      {/* Guest Profile */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-100 bg-white">
                            <AvatarFallback className="bg-indigo-50 text-xs font-bold text-indigo-600">
                              {getInitials(booking.guest?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {booking.guest?.name || 'Unknown Guest'}
                            </span>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail className="h-3 w-3" />
                              <span className="max-w-[140px] truncate">
                                {booking.guest?.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Room Info */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            Room {booking.room?.number}
                          </div>
                          <span className="pl-5 text-xs text-slate-400">
                            {booking.room?.type}
                          </span>
                        </div>
                      </TableCell>

                      {/* Dates */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                              {format(
                                new Date(booking.checkOutDate),
                                'MMM d, yyyy'
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${getStatusBadge(booking.status)}`}
                        >
                          {booking.status.replace('_', ' ')}
                        </Badge>
                        {/* Fraud Warning (Optional Bonus) */}
                        {booking.fraudScore > 50 && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500">
                            ⚠️ High Risk
                          </div>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer">
                              View Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Check In/Out
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                              Cancel Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/30 px-6 py-3">
            <p className="text-xs font-medium text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="h-8 w-8 border-slate-200 bg-white p-0 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || loading}
                className="h-8 w-8 border-slate-200 bg-white p-0 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
