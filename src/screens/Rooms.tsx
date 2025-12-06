'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MoreHorizontal,
  BedDouble,
  Users,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useGetAllRoomsQuery } from '@/store/services/admin-dashboard';

const ITEMS_PER_PAGE = 6;

// Status pill styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'CLEAN':
      return 'bg-green-600/80 text-white ring-green-700/50';
    case 'DIRTY':
      return 'bg-yellow-500/80 text-white ring-yellow-600/50';
    case 'OCCUPIED':
      return 'bg-blue-600/80 text-white ring-blue-700/50';
    default:
      return 'bg-slate-400 text-white';
  }
};

const Rooms = () => {
  const { data, isLoading } = useGetAllRoomsQuery();
  const rooms = data?.bookings || [];

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);

  const currentRooms = rooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {currentRooms.map((room: any) => (
          <div
            key={room.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* ▸ Image Section */}
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

              {/* ▸ Status Badge */}
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

              {/* ▸ Price Tag */}
              <div className="absolute right-3 bottom-3 rounded-lg bg-slate-900/90 px-3 py-1 text-white backdrop-blur-sm">
                <p className="text-xs font-medium">
                  <span className="text-lg font-bold">${room.price}</span>
                  <span className="text-slate-300">/night</span>
                </p>
              </div>
            </div>

            {/* ▸ Content Section */}
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Room {room.number}
                  </h3>
                  <p className="text-sm text-slate-500">{room.type} Suite</p>
                </div>

                {/* ▸ Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-800"
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

              {/* ▸ Features */}
              <div className="flex items-center gap-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users size={14} /> <span>2 Guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize size={14} /> <span>45m²</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi size={14} /> <span>Fast Wifi</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ▸ Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
