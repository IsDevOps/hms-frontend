"use client";

import { useGetAllRoomsQuery } from "@/store/services/admin-dashboard";
import Image from "next/image";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {displayRooms.map((room: any) => (
        <div
          key={room.id}
          className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
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

            <div className="mt-3 flex justify-between items-center">
             
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
