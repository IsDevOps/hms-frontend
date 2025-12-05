'use client';

import { useGetAllRoomsQuery } from '@/store/services/admin-dashboard';
import Image from 'next/image';
import React from 'react';

const ViewRooms = () => {
  const { data } = useGetAllRoomsQuery();

  if (!data || data.length === 0) {
    return (
      <p className="text-muted-foreground text-center">No rooms available</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((room: any) => (
        <div
          key={room.id}
          className="border-border rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          {room.imageUrl && (
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={room.imageUrl}
                alt={`${room.number}`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h3 className="text-foreground mb-1 text-lg font-semibold">
            Room {room.number} - {room.type}
          </h3>
          <p className="text-muted-foreground mb-2 text-sm">
            Price: ${room.price}
          </p>
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
              room.status === 'AVAILABLE'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {room.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ViewRooms;
