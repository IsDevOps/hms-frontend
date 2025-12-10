'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGetAllRoomsQuery } from '@/store/services/admin-dashboard';
import {
  MoreHorizontal,
  BedDouble,
  Users,
  Wifi,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// --- Constants ---
const ITEMS_PER_PAGE = 6;

const ViewRooms = () => {
  const { data: rooms = [], isLoading } = useGetAllRoomsQuery(); // Default to empty array
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filter Logic ---
  const filteredRooms = rooms.filter((room: any) => {
    if (statusFilter === 'ALL') return true;
    return room.status === statusFilter;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRooms = filteredRooms.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // --- Handlers ---
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top of grid
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Helper: Status Colors ---
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case 'OCCUPIED':
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
      case 'MAINTENANCE':
        return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Room Management
          </h2>
          <p className="text-sm text-slate-500">
            {filteredRooms.length} rooms found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Tabs (Visual) */}
          <div className="flex rounded-lg border bg-white p-1 shadow-sm">
            {['ALL', 'AVAILABLE', 'OCCUPIED'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setStatusFilter(filter);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  statusFilter === filter
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {filter === 'ALL'
                  ? 'All Rooms'
                  : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- ROOM GRID --- */}
      {currentRooms.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <BedDouble className="mb-2 h-10 w-10 opacity-20" />
          <p>No rooms match this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {currentRooms.map((room: any) => (
            <div
              key={room.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {room.imageUrl ? (
                  <Image
                    src={room.imageUrl}
                    alt={`Room ${room.number}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <BedDouble size={48} />
                  </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm ring-1 backdrop-blur-md ring-inset',
                      getStatusStyle(room.status)
                    )}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute right-3 bottom-3 rounded-lg bg-slate-900/90 px-3 py-1 text-white backdrop-blur-sm">
                  <p className="text-xs font-medium">
                    <span className="text-lg font-bold">
                      N{room.price * 1000}
                    </span>
                    <span className="text-slate-300">/night</span>
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Room {room.number}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {room.type} Suite
                    </p>
                  </div>

                  {/* Action Menu (Three dots) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Set Maintenance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Amenities / Features Mockup */}
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    <span>2 Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize size={14} />
                    <span>45m²</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={14} />
                    <span>Fast Wifi</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRooms;
