'use client';

import { useGetAllRoomsQuery } from '@/store/services/admin-dashboard';
import Image from 'next/image';

interface Room {
  id: string;
  number: string;
  type: string;
  price: string;
  status: string;
  imageUrl: string;
  bookings: any[];
}

export default function RoomsGrid({ rooms: initialRooms }: { rooms: Room[] }) {
  const { data: roomsFromQuery } = useGetAllRoomsQuery();

  // ALWAYS show only first 6 rooms
  const displayRooms = (roomsFromQuery || initialRooms).slice(0, 6);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayRooms.map((room: any) => (
        <div
          key={room.id}
          className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
        >
          <div className="relative h-48 w-full">
            <Image
              src={room.imageUrl}
              alt={room.number}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold">Room {room.number}</h3>
            <p className="text-sm text-gray-500">{room.type}</p>

            <div className="mt-3 flex items-center justify-between"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
