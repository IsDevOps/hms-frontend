export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'CLEAN' | 'OCCUPIED' | 'DIRTY';
  price: number;
  image?: string;
  guestName?: string;
  amenities?: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT';
  roomNumber: string;
  roomType: string;
}

export interface LiveEvent {
  id: string;
  time: string;
  room: string;
  message: string;
  type: 'service' | 'booking' | 'alert' | 'system';
}

export interface Anomaly {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  analysis: string;
}

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Deluxe Suite',
    status: 'CLEAN',
    price: 450,
    amenities: ['Ocean View', 'King Bed', 'Jacuzzi', 'Mini Bar'],
    image:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
  },
  {
    id: '2',
    number: '102',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'James Wilson',
    amenities: ['City View', 'Queen Bed', 'Work Desk'],
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  },
  {
    id: '3',
    number: '103',
    type: 'Standard Room',
    status: 'DIRTY',
    price: 180,
    amenities: ['Garden View', 'Twin Beds'],
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  },
  {
    id: '4',
    number: '201',
    type: 'Presidential Suite',
    status: 'CLEAN',
    price: 850,
    amenities: [
      'Panoramic View',
      'Living Room',
      'Private Chef',
      'Butler Service',
    ],
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  },
  {
    id: '5',
    number: '202',
    type: 'Junior Suite',
    status: 'OCCUPIED',
    price: 320,
    guestName: 'Sarah Chen',
    amenities: ['Pool View', 'King Bed', 'Lounge Area'],
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
  },
  {
    id: '6',
    number: '203',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
    amenities: ['Courtyard View', 'Queen Bed'],
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  },
];

export const MOCK_BOOKING_RESPONSE = {
  success: true,
  fraudScore: 5,
  aiAnalysis:
    'ID verification complete. Document authenticity confirmed with 98.7% confidence. Hologram and security features detected. Name matches booking details.',
  bookingId: 'b_12345',
  extractedName: 'John Anderson',
};

export const MOCK_LIVE_EVENTS: LiveEvent[] = [
  {
    id: '1',
    time: '10:02 AM',
    room: '204',
    message: 'Ordered 2 Espressos via Room Service',
    type: 'service',
  },
  {
    id: '2',
    time: '09:58 AM',
    room: '102',
    message: 'Digital Key Access - Main Entrance',
    type: 'booking',
  },
  {
    id: '3',
    time: '09:45 AM',
    room: '101',
    message: 'Check-in Confirmed - VIP Guest',
    type: 'booking',
  },
  {
    id: '4',
    time: '09:30 AM',
    room: '305',
    message: '⚠️ Unusual Water Usage Detected',
    type: 'alert',
  },
  {
    id: '5',
    time: '09:15 AM',
    room: '201',
    message: 'Do Not Disturb Activated',
    type: 'system',
  },
  {
    id: '6',
    time: '09:00 AM',
    room: '103',
    message: 'Housekeeping Requested',
    type: 'service',
  },
  {
    id: '7',
    time: '08:45 AM',
    room: '202',
    message: 'Late Checkout Approved',
    type: 'system',
  },
  {
    id: '8',
    time: '08:30 AM',
    room: '401',
    message: '⚠️ Smoke Detector Alert - Cleared',
    type: 'alert',
  },
];

export const MOCK_CURRENT_BOOKING: Booking = {
  id: 'b_12345',
  roomId: '1',
  guestName: 'John Anderson',
  checkIn: '2024-01-15',
  checkOut: '2024-01-18',
  status: 'CHECKED_IN',
  roomNumber: '101',
  roomType: 'Deluxe Suite',
};

export const MOCK_ANOMALIES: Anomaly[] = [
  {
    id: '1',
    timestamp: '2024-01-15T09:30:00',
    metric: 'Water Consumption',
    value: 450,
    threshold: 200,
    severity: 'high',
    analysis:
      'Unusual spike detected in Room 305. Pattern suggests potential leak or fixture malfunction. Recommend immediate inspection of bathroom facilities.',
  },
  {
    id: '2',
    timestamp: '2024-01-15T08:30:00',
    metric: 'Energy Usage',
    value: 12.5,
    threshold: 8,
    severity: 'medium',
    analysis:
      'Elevated energy consumption in East Wing. Multiple HVAC units running at maximum capacity despite moderate outdoor temperature.',
  },
];

export const MOCK_CHART_DATA = [
  { time: '00:00', value: 45, baseline: 50 },
  { time: '02:00', value: 42, baseline: 48 },
  { time: '04:00', value: 38, baseline: 45 },
  { time: '06:00', value: 55, baseline: 52 },
  { time: '08:00', value: 120, baseline: 60 },
  { time: '09:30', value: 450, baseline: 65, isAnomaly: true },
  { time: '10:00', value: 85, baseline: 70 },
  { time: '12:00', value: 78, baseline: 72 },
];

export const MOCK_DASHBOARD_STATS = {
  occupancy: { value: 78, change: 5, label: 'Occupancy Rate' },
  revenue: { value: 24850, change: 12, label: "Today's Revenue" },
  issues: { value: 3, change: -2, label: 'Open Issues' },
  alerts: { value: 2, change: 1, label: 'Active Alerts' },
};
