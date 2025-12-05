import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'CLEAN' | 'OCCUPIED' | 'DIRTY';
  price: number;
  imageUrl?: string;
  guestName?: string;
  amenities?: string[];
  hasAnomaly?: boolean;
}

interface RoomCardProps {
  room: Room;
  compact?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  CLEAN: { label: 'Clean', className: 'status-clean' },
  OCCUPIED: { label: 'Occupied', className: 'status-occupied' },
  DIRTY: { label: 'Dirty', className: 'status-dirty' },
};

const RoomCard = ({ room, compact = false, onClick }: RoomCardProps) => {
  const status = statusConfig[room.status];
  const basePrice = room.price;
  const actualPrice = basePrice * 1000;
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(actualPrice);
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'hotel-card-interactive border-border min-w-[100px] rounded-xl border p-3 shadow-sm transition hover:shadow-md',
          onClick && 'cursor-pointer'
        )}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-foreground text-sm font-semibold">
            {room.number}
          </span>
          <div
            className={cn('h-2 w-2 rounded-full', {
              'bg-success': room.status === 'CLEAN',
              'bg-blue-500': room.status === 'OCCUPIED',
              'bg-warning': room.status === 'DIRTY',
            })}
          />
        </div>
        <p className="text-muted-foreground truncate text-xs">
          {room.guestName || room.type}
        </p>
        <span className={cn('status-badge mt-2 text-[10px]', status.className)}>
          {status.label}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'hotel-card-interactive overflow-hidden',
        onClick && 'cursor-pointer'
      )}
    >
      {room.imageUrl && (
        <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] overflow-hidden">
          <Image
            src={room.imageUrl ?? ''}
            alt={`Room ${room.number}`}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-foreground font-semibold">{room.type}</h3>
            <p className="text-muted-foreground text-sm">Room {room.number}</p>
          </div>
          <span className={cn('status-badge', room.status)}>{room.status}</span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="bg-secondary text-muted-foreground rounded px-2 py-0.5 text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="border-border flex items-center justify-between border-t pt-2">
          <span className="text-foreground text-2xl font-semibold">
            {formattedPrice}
          </span>
          <span className="text-muted-foreground text-sm">per night</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
