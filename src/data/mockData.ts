export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'CLEAN' | 'OCCUPIED' | 'DIRTY';
  price: number;
  image?: string;
  guestName?: string;
  amenities?: string[];
  hasAnomaly?: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
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
  type: 'service' | 'booking' | 'alert' | 'system' | 'food-order';
  isNew?: boolean;
  orderId?: string;
  items?: string[];
}

export interface Anomaly {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  analysis: string;
  roomNumber: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  upsellItem?: string;
  upsellMessage?: string;
  category: 'food' | 'beverage';
}

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  items: string[];
  status: 'pending' | 'preparing' | 'delivered';
  timestamp: string;
}

export type OrderStatus = 'RECEIVED' | 'IN_PROGRESS' | 'ON_WAY' | 'COMPLETED';

export interface ActiveOrder {
  id: string;
  roomNumber: string;
  type: 'food' | 'housekeeping' | 'maintenance' | 'concierge';
  items: string[];
  status: OrderStatus;
  scheduledTime: string | null;
  createdAt: string;
  total?: number;
}

export interface AIRecommendation {
  id: string;
  message: string;
  item: MenuItem | null;
  type: 'food' | 'service';
  timeRange: { start: number; end: number };
}

// export const MOCK_MENU_ITEMS: MenuItem[] = [
//   {
//     id: 'burger',
//     name: 'Gourmet Burger',
//     price: 18,
//     image: '/images/burger.jpg',
//     description: 'Wagyu beef with truffle aioli',
//     upsellItem: 'coke',
//     upsellMessage:
//       'Hungry? Guests who ordered Burger also loved Ice Cold Coke. Add for $2?',
//     category: 'food',
//   },
//   {
//     id: 'pasta',
//     name: 'Truffle Pasta',
//     price: 24,
//     image: '/images/pasta.jpg',
//     description: 'Fresh fettuccine with black truffle',
//     category: 'food',
//   },
// ];


export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'burger',
    name: 'Gourmet Burger',
    price: 18,
    image:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    description:
      'Wagyu beef patty, truffle aioli, aged cheddar on a brioche bun.',
    upsellItem: 'fries',
    upsellMessage:
      'Perfect pairing! Add a side of our Truffle Parmesan Fries for just $5?',
    category: 'food',
  },
  {
    id: 'pasta',
    name: 'Truffle Pasta',
    price: 24,
    image:
      'https://images.unsplash.com/photo-1621996346565-e326b20f5961?w=800&q=80',
    description:
      'Fresh fettuccine with black truffle cream sauce and shaved parmesan.',
    category: 'food',
  },
  {
    id: 'pizza',
    name: 'Margherita Pizza',
    price: 20,
    image:
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80',
    description:
      'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    category: 'food',
  },
  {
    id: 'steak',
    name: 'Ribeye Steak',
    price: 45,
    image:
      'https://images.unsplash.com/photo-1551028150-64b9f398f67b?w=800&q=80',
    description:
      '12oz prime ribeye, grilled to perfection, served with asparagus.',
    category: 'food',
  },
  {
    id: 'salad',
    name: 'Caesar Salad',
    price: 15,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
    description:
      'Crisp romaine lettuce, sourdough croutons, parmesan, and creamy Caesar dressing.',
    upsellItem: 'chicken',
    upsellMessage: 'Add grilled chicken for $6?',
    category: 'food',
  },
  {
    id: 'sandwich',
    name: 'Club Sandwich',
    price: 16,
    image:
      'https://images.unsplash.com/photo-1592415486689-125c9287278b?w=800&q=80',
    description:
      'Triple-decker with roasted turkey, bacon, lettuce, tomato, and mayo.',
    category: 'food',
  },
  {
    id: 'fries',
    name: 'Truffle Fries',
    price: 9,
    image:
      'https://images.unsplash.com/photo-1598679253544-2c9740f92b44?w=800&q=80',
    description:
      'Crispy fries tossed in truffle oil, parmesan, and fresh parsley.',
    category: 'food',
  },
  {
    id: 'coke',
    name: 'Coca-Cola',
    price: 4,
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f32a6444?w=800&q=80',
    description: 'Classic Coca-Cola, served chilled.',
    category: 'beverage',
  },
  {
    id: 'water',
    name: 'Mineral Water',
    price: 3,
    image:
      'https://images.unsplash.com/photo-1583122485042-3712a7a402a7?w=800&q=80',
    description: 'Still or sparkling mineral water.',
    category: 'beverage',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 6,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e234?w=800&q=80',
    description: 'Espresso with steamed milk foam.',
    category: 'beverage',
  },
  {
    id: 'juice',
    name: 'Orange Juice',
    price: 7,
    image:
      'https://images.unsplash.com/photo-1613482143818-0255919a3b1d?w=800&q=80',
    description: 'Freshly squeezed orange juice.',
    category: 'beverage',
  },
  {
    id: 'cocktail',
    name: 'Old Fashioned',
    price: 15,
    image:
      'https://images.unsplash.com/photo-1624523326088-dd4a21b3a60a?w=800&q=80',
    description: 'Bourbon, bitters, sugar, and a twist of orange.',
    category: 'beverage',
  },
];


// AI Recommendations based on time of day
export const getAIRecommendation = (): AIRecommendation | null => {
  const hour = new Date().getHours();

  // Morning (6-11): Coffee
  if (hour >= 6 && hour < 11) {
    return {
      id: 'morning-coffee',
      message: 'Good morning! ☕ Want your usual Cappuccino?',
      item: MOCK_MENU_ITEMS.find((m) => m.id === 'cappuccino') || null,
      type: 'food',
      timeRange: { start: 6, end: 11 },
    };
  }

  // Lunch (11-14): Food
  if (hour >= 11 && hour < 14) {
    return {
      id: 'lunch-special',
      message: 'Lunchtime! 🍔 Our Gourmet Burger is a guest favorite.',
      item: MOCK_MENU_ITEMS.find((m) => m.id === 'burger') || null,
      type: 'food',
      timeRange: { start: 11, end: 14 },
    };
  }

  // Afternoon (14-18): Refreshment
  if (hour >= 14 && hour < 18) {
    return {
      id: 'afternoon-refresh',
      message:
        'Afternoon refreshment? 💧 Stay hydrated with our mineral water.',
      item: MOCK_MENU_ITEMS.find((m) => m.id === 'water') || null,
      type: 'food',
      timeRange: { start: 14, end: 18 },
    };
  }

  // Evening (18-22): Dinner
  if (hour >= 18 && hour < 22) {
    return {
      id: 'dinner-suggestion',
      message: 'Time for dinner! 🍝 Our Truffle Pasta is exquisite tonight.',
      item: MOCK_MENU_ITEMS.find((m) => m.id === 'pasta') || null,
      type: 'food',
      timeRange: { start: 18, end: 22 },
    };
  }

  // Night (22-6): Towels/Service
  return {
    id: 'night-service',
    message: 'Need anything before bed? 🛏️ Extra towels or turndown service?',
    item: null,
    type: 'service',
    timeRange: { start: 22, end: 6 },
  };
};

export const SERVICE_TYPES = [
  { id: 'food', label: 'Food & Drinks', icon: 'UtensilsCrossed' },
  { id: 'housekeeping', label: 'Housekeeping', icon: 'Sparkles' },
  { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
  { id: 'concierge', label: 'Concierge', icon: 'Phone' },
];

export const HOUSEKEEPING_ITEMS = [
  { id: 'towels', name: 'Extra Towels', description: 'Fresh towels delivered' },
  { id: 'cleaning', name: 'Room Cleaning', description: 'Full room service' },
  {
    id: 'turndown',
    name: 'Turndown Service',
    description: 'Evening bed preparation',
  },
  {
    id: 'amenities',
    name: 'Toiletry Refill',
    description: 'Shampoo, soap, etc.',
  },
];

export const MAINTENANCE_ITEMS = [
  { id: 'ac', name: 'AC/Heating Issue', description: 'Temperature control' },
  { id: 'plumbing', name: 'Plumbing', description: 'Water/drain issues' },
  { id: 'electrical', name: 'Electrical', description: 'Lights/outlets' },
  { id: 'other', name: 'Other', description: 'General maintenance' },
];

export const CONCIERGE_ITEMS = [
  { id: 'taxi', name: 'Taxi/Transport', description: 'Arrange transportation' },
  {
    id: 'restaurant',
    name: 'Restaurant Booking',
    description: 'Reserve a table',
  },
  { id: 'tour', name: 'Tour Booking', description: 'Local experiences' },
  { id: 'other', name: 'Special Request', description: 'Anything else' },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8',
    number: '101',
    type: 'Deluxe Suite',
    status: 'CLEAN',
    price: 450,
    amenities: ['Ocean View', 'King Bed', 'Jacuzzi', 'Mini Bar'],
    image:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8f',
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
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8g',
    number: '103',
    type: 'Standard Room',
    status: 'DIRTY',
    price: 180,
    amenities: ['Garden View', 'Twin Beds'],
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8h',
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
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8i',
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
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8j',
    number: '203',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
    amenities: ['Courtyard View', 'Queen Bed'],
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8k',
    number: '204',
    type: 'Deluxe Room',
    status: 'OCCUPIED',
    price: 320,
    guestName: 'Alex Martinez',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8l',
    number: '205',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8m',
    number: '206',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'Lisa Park',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8n',
    number: '301',
    type: 'Suite',
    status: 'CLEAN',
    price: 450,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8o',
    number: '302',
    type: 'Standard Room',
    status: 'DIRTY',
    price: 180,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8p',
    number: '303',
    type: 'Deluxe Room',
    status: 'OCCUPIED',
    price: 320,
    guestName: 'Tom Harris',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8q',
    number: '304',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8r',
    number: '305',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'Maria Garcia',
    hasAnomaly: true,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8s',
    number: '306',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8t',
    number: '401',
    type: 'Penthouse',
    status: 'CLEAN',
    price: 1200,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8u',
    number: '402',
    type: 'Suite',
    status: 'OCCUPIED',
    price: 450,
    guestName: 'David Kim',
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8v',
    number: '403',
    type: 'Deluxe Room',
    status: 'DIRTY',
    price: 320,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8w',
    number: '404',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '17f2a7a8-a8e8-4b77-b8a7-8a8e8a8e8a8x',
    number: '405',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'Emma Thompson',
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
  guestEmail: 'john.anderson@email.com',
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
      'Water usage 500% above average at 3AM. Pattern suggests potential burst pipe or fixture malfunction. Immediate inspection recommended.',
    roomNumber: '305',
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
    roomNumber: '401',
  },
];

export const MOCK_CHART_DATA = [
  { time: '00:00', value: 45, baseline: 50 },
  { time: '02:00', value: 42, baseline: 48 },
  { time: '03:00', value: 450, baseline: 45, isAnomaly: true },
  { time: '04:00', value: 38, baseline: 45 },
  { time: '06:00', value: 55, baseline: 52 },
  { time: '08:00', value: 120, baseline: 60 },
  { time: '10:00', value: 85, baseline: 70 },
  { time: '12:00', value: 78, baseline: 72 },
];

export const MOCK_DASHBOARD_STATS = {
  occupancy: { value: 78, change: 5, label: 'Occupancy Rate' },
  revenue: { value: 24850, change: 12, label: "Today's Revenue" },
  issues: { value: 3, change: -2, label: 'Open Issues' },
  alerts: { value: 2, change: 1, label: 'Active Alerts' },
};

// Event emitter for mock WebSocket functionality
type EventCallback = (data: any) => void;

class MockEventEmitter {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

export const hotelEventEmitter = new MockEventEmitter();

// Helper to get time greeting
export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
