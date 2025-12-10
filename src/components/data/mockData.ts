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
//     image: 'https://unsplash.com/photos/cooked-noodles-mIEGFvOdY0Y',
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
//     image: '/pizza.jpg',
//     description: 'Fresh fettuccine with black truffle',
//     category: 'food',
//   },
//   {
//     id: 'salad',
//     name: 'Garden Salad',
//     price: 12,
//     image: '/images/salad.jpg',
//     description: 'Mixed greens with citrus vinaigrette',
//     category: 'food',
//   },
// ];
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    price: 15,
    image: 'https://images.unsplash.com/photo-1605648916365-9231b6de53c6',
    description: 'Smoky party-style jollof rice served with fried plantain.',
    upsellItem: 'grilled-chicken',
    upsellMessage:
      'Most guests add Grilled Chicken to their Jollof Rice. Add for $3?',
    category: 'food',
  },
  {
    id: 'fried-rice',
    name: 'Nigerian Fried Rice',
    price: 16,
    image: 'https://images.unsplash.com/photo-1626074353765-c3a91dfc5d32',
    description: 'Stir-fried rice with vegetables, liver, and prawns.',
    upsellItem: 'moimoi',
    upsellMessage: 'Guests often pair Fried Rice with Moi-Moi. Add for $2?',
    category: 'food',
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    price: 20,
    image: 'https://images.unsplash.com/photo-1714157703540-5227f13213fa',
    description: 'Melon seed soup cooked with assorted meat and vegetables.',
    upsellItem: 'pounded-yam',
    upsellMessage: 'Enjoy Egusi best with hot Pounded Yam. Add for $2?',
    category: 'food',
  },
  {
    id: 'ogbono-soup',
    name: 'Ogbono Soup',
    price: 18,
    image: 'https://images.unsplash.com/photo-1711397164326-fc0c54b6e21e',
    description: 'Draw soup made with wild mango seeds and assorted meats.',
    upsellItem: 'eba',
    upsellMessage: 'Would you like to add Eba with your Ogbono Soup for $1?',
    category: 'food',
  },
  {
    id: 'suya',
    name: 'Suya',
    price: 10,
    image: 'https://images.unsplash.com/photo-1588167108379-3e3cdaf6e97c',
    description: 'Spicy grilled beef kebabs with yaji seasoning.',
    category: 'food',
  },
  {
    id: 'akara',
    name: 'Akara & Pap',
    price: 8,
    image: 'https://images.unsplash.com/photo-1576712173425-53b302f1679a',
    description: 'Crispy bean cakes served with warm pap.',
    category: 'food',
  },
  {
    id: 'yam-porridge',
    name: 'Yam Porridge',
    price: 14,
    image: 'https://images.unsplash.com/photo-1660404764781-163d52a8b5de',
    description: 'Soft yam cooked in palm oil sauce with vegetables.',
    category: 'food',
  },
  {
    id: 'pepper-soup',
    name: 'Pepper Soup',
    price: 12,
    image: 'https://images.unsplash.com/photo-1676300186398-9d3ce7b783ad',
    description: 'Hot and spicy broth made with catfish or goat meat.',
    upsellItem: 'chilled-water',
    upsellMessage:
      'Cool off with Chilled Water after your Pepper Soup. Add for $1?',
    category: 'food',
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
  {
    id: '7',
    number: '204',
    type: 'Deluxe Room',
    status: 'OCCUPIED',
    price: 320,
    guestName: 'Alex Martinez',
  },
  {
    id: '8',
    number: '205',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '9',
    number: '206',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'Lisa Park',
  },
  { id: '10', number: '301', type: 'Suite', status: 'CLEAN', price: 450 },
  {
    id: '11',
    number: '302',
    type: 'Standard Room',
    status: 'DIRTY',
    price: 180,
  },
  {
    id: '12',
    number: '303',
    type: 'Deluxe Room',
    status: 'OCCUPIED',
    price: 320,
    guestName: 'Tom Harris',
  },
  {
    id: '13',
    number: '304',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '14',
    number: '305',
    type: 'Executive Room',
    status: 'OCCUPIED',
    price: 280,
    guestName: 'Maria Garcia',
    hasAnomaly: true,
  },
  {
    id: '15',
    number: '306',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  { id: '16', number: '401', type: 'Penthouse', status: 'CLEAN', price: 1200 },
  {
    id: '17',
    number: '402',
    type: 'Suite',
    status: 'OCCUPIED',
    price: 450,
    guestName: 'David Kim',
  },
  { id: '18', number: '403', type: 'Deluxe Room', status: 'DIRTY', price: 320 },
  {
    id: '19',
    number: '404',
    type: 'Standard Room',
    status: 'CLEAN',
    price: 180,
  },
  {
    id: '20',
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
