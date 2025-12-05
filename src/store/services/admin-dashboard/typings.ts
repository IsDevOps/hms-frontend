interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingReference: string;
  checkInDate: string;
  totalPrice: number;
}
interface CreateBookingPayload {
  guestName: string;
  guestEmail: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  file?: Blob;
}

export type { BookingResponse, CreateBookingPayload };
