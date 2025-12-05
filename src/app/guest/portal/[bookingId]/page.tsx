'use client';
import { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Wrench,
  Phone,
  Clock,
  Check,
  Loader2,
  ChefHat,
  Truck,
  Plus,
  Bot,
  User,
  Send,
} from 'lucide-react';
import GuestLayout from '@/components/layout/GuestLayout';
import {
  MOCK_CURRENT_BOOKING,
  MOCK_MENU_ITEMS,
  HOUSEKEEPING_ITEMS,
  MAINTENANCE_ITEMS,
  CONCIERGE_ITEMS,
  hotelEventEmitter,
  MenuItem,
  ActiveOrder,
  OrderStatus,
  getTimeGreeting,
  getAIRecommendation,
} from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] =
  [
    { status: 'RECEIVED', label: 'Received', icon: Check },
    { status: 'IN_PROGRESS', label: 'In Progress', icon: ChefHat },
    { status: 'ON_WAY', label: 'On the Way', icon: Truck },
    { status: 'COMPLETED', label: 'Completed', icon: Check },
  ];

const serviceTypes = [
  {
    id: 'food',
    label: 'Food & Drinks',
    icon: UtensilsCrossed,
    color: 'bg-primary',
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: Sparkles,
    color: 'bg-success',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    color: 'bg-warning',
  },
  { id: 'concierge', label: 'Concierge', icon: Phone, color: 'bg-blue-500' },
];

const GuestPortal = () => {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [upsellItem, setUpsellItem] = useState<MenuItem | null>(null);
  const [pendingCartItem, setPendingCartItem] = useState<MenuItem | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>('now');
  const [aiRecommendation] = useState(getAIRecommendation());
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const booking = MOCK_CURRENT_BOOKING;

  // Listen for order status updates
  useEffect(() => {
    const handleOrderUpdate = (data: {
      orderId: string;
      status: OrderStatus;
    }) => {
      setActiveOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    };

    hotelEventEmitter.on('order-update', handleOrderUpdate);
    return () => {
      hotelEventEmitter.off('order-update', handleOrderUpdate);
    };
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    if (item.upsellItem && !cart.find((c) => c.id === item.upsellItem)) {
      const upsellMenuItem = MOCK_MENU_ITEMS.find(
        (m) => m.id === item.upsellItem
      );
      if (upsellMenuItem) {
        setPendingCartItem(item);
        setUpsellItem(upsellMenuItem);
        return;
      }
    }

    setCart((prev) => [...prev, item]);
    toast({ title: 'Added', description: item.name });
  };

  const handleUpsellAccept = () => {
    if (pendingCartItem && upsellItem) {
      setCart((prev) => [...prev, pendingCartItem, upsellItem]);
      toast({
        title: 'Items added',
        description: `${pendingCartItem.name} + ${upsellItem.name}`,
      });
    }
    setUpsellItem(null);
    setPendingCartItem(null);
  };

  const handleUpsellDecline = () => {
    if (pendingCartItem) {
      setCart((prev) => [...prev, pendingCartItem]);
      toast({ title: 'Added', description: pendingCartItem.name });
    }
    setUpsellItem(null);
    setPendingCartItem(null);
  };

  const handleServiceRequest = (type: string, items: string[]) => {
    const newOrder: ActiveOrder = {
      id: Date.now().toString(),
      roomNumber: booking.roomNumber,
      type: type as ActiveOrder['type'],
      items,
      status: 'RECEIVED',
      scheduledTime: scheduledTime === 'now' ? null : scheduledTime,
      createdAt: new Date().toISOString(),
    };

    setActiveOrders((prev) => [newOrder, ...prev]);
    setSelectedServiceType(null);
    setIsNewRequestOpen(false);
    setScheduledTime('now');

    toast({ title: 'Request Sent', description: `${type} request submitted` });

    hotelEventEmitter.emit('service-request', {
      ...newOrder,
      service: items.join(', '),
    });
  };

  const handleAIRecommendationAccept = () => {
    if (aiRecommendation?.item) {
      handleAddToCart(aiRecommendation.item);
      setIsFoodMenuOpen(true);
    } else if (aiRecommendation?.type === 'service') {
      setSelectedServiceType('housekeeping');
      setIsNewRequestOpen(true);
    }
  };
  const handlePlaceFoodOrder = () => {
    if (cart.length === 0) return;

    const newOrder: ActiveOrder = {
      id: Date.now().toString(),
      roomNumber: booking.roomNumber,
      type: 'food',
      items: cart.map((c) => c.name),
      status: 'RECEIVED',
      scheduledTime: scheduledTime === 'now' ? null : scheduledTime,
      createdAt: new Date().toISOString(),
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    setActiveOrders((prev) => [newOrder, ...prev]);
    setIsFoodMenuOpen(false);
    setCart([]);
    setScheduledTime('now');

    toast({
      title: 'Order Placed!',
      description: 'Your order is being prepared',
    });

    hotelEventEmitter.emit('food-order', newOrder);
  };

  const getStatusIndex = (status: OrderStatus) =>
    ORDER_STATUS_STEPS.findIndex((s) => s.status === status);

  const timeSlots = [
    { value: 'now', label: 'Now' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput('');

    // Mock AI reply
    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Thanks for your message! I'm here to help.",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };
  return (
    <GuestLayout title="Service Portal">
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="hotel-card">
          <p className="text-muted-foreground text-sm">{getTimeGreeting()},</p>
          <h2 className="text-foreground text-xl font-semibold">
            {booking.guestName}
          </h2>
          <p className="text-muted-foreground text-sm">
            Room {booking.roomNumber}
          </p>
        </div>

        {/* AI Recommendation */}
        {aiRecommendation && (
          <div className="hotel-card bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-foreground text-sm font-medium">
                  {aiRecommendation.message}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={handleAIRecommendationAccept}>
                    {aiRecommendation.item
                      ? `Add ${aiRecommendation.item.name}`
                      : 'Request Now'}
                  </Button>
                  <Button size="sm" variant="ghost">
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">Active Orders</h3>
            {activeOrders
              .filter((o) => o.status !== 'COMPLETED')
              .map((order) => {
                const statusIndex = getStatusIndex(order.status);
                const typeConfig = serviceTypes.find(
                  (s) => s.id === order.type
                );

                return (
                  <div key={order.id} className="hotel-card">
                    <div className="mb-4 flex items-center gap-3">
                      {typeConfig && (
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            typeConfig.color
                          )}
                        >
                          <typeConfig.icon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-foreground text-sm font-medium">
                          {order.items.join(', ')}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {order.scheduledTime
                            ? `Scheduled: ${order.scheduledTime}`
                            : 'Requested just now'}
                        </p>
                      </div>
                      {order.total && (
                        <span className="text-foreground text-sm font-medium">
                          ${order.total}
                        </span>
                      )}
                    </div>

                    {/* Domino's Style Tracker */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {ORDER_STATUS_STEPS.map((step, index) => {
                          const isCompleted = index <= statusIndex;
                          const isCurrent = index === statusIndex;
                          const Icon = step.icon;

                          return (
                            <div
                              key={step.status}
                              className="flex flex-1 flex-col items-center"
                            >
                              <div
                                className={cn(
                                  'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                                  isCompleted
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-muted-foreground',
                                  isCurrent &&
                                    'ring-primary ring-2 ring-offset-2'
                                )}
                              >
                                {isCompleted && index < statusIndex ? (
                                  <Check className="h-4 w-4" />
                                ) : isCurrent ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Icon className="h-4 w-4" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  'mt-1 text-center text-[10px]',
                                  isCompleted
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Progress Line */}
                      <div className="bg-secondary absolute top-4 right-0 left-0 -z-10 mx-4 h-0.5">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{
                            width: `${(statusIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Completed Orders */}
        {activeOrders.filter((o) => o.status === 'COMPLETED').length > 0 && (
          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Completed
            </h3>
            {activeOrders
              .filter((o) => o.status === 'COMPLETED')
              .map((order) => (
                <div key={order.id} className="hotel-card opacity-60">
                  <div className="flex items-center gap-3">
                    <Check className="text-success h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-foreground text-sm">
                        {order.items.join(', ')}
                      </p>
                      <p className="text-muted-foreground text-xs">Completed</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* New Request Button */}
        <Button
          onClick={() => setIsNewRequestOpen(true)}
          className="w-full py-6 text-base"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Request
        </Button>
      </div>

      {/* New Request Modal */}
      <Dialog
        open={isNewRequestOpen && !selectedServiceType}
        onOpenChange={setIsNewRequestOpen}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>What do you need?</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  if (service.id === 'food') {
                    setIsNewRequestOpen(false);
                    setIsFoodMenuOpen(true);
                  } else {
                    setSelectedServiceType(service.id);
                  }
                }}
                className="hotel-card-interactive flex flex-col items-center gap-2 p-4"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg',
                    service.color
                  )}
                >
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-foreground text-sm font-medium">
                  {service.label}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Selection Modal */}
      <Dialog
        open={!!selectedServiceType}
        onOpenChange={() => setSelectedServiceType(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedServiceType}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Time Selection */}
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                When?
              </label>
              <Select value={scheduledTime} onValueChange={setScheduledTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {slot.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Items */}
            <div className="space-y-2">
              {(selectedServiceType === 'housekeeping'
                ? HOUSEKEEPING_ITEMS
                : selectedServiceType === 'maintenance'
                  ? MAINTENANCE_ITEMS
                  : CONCIERGE_ITEMS
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    handleServiceRequest(selectedServiceType!, [item.name])
                  }
                  className="border-border hover:bg-secondary/50 w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <p className="text-foreground text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Food Menu Dialog */}

      <Dialog open={isFoodMenuOpen} onOpenChange={setIsFoodMenuOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-md flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ask our AI Assistant</DialogTitle>
          </DialogHeader>

          {/* SCROLL AREA — Only messages scroll */}
          <ScrollArea className="bg-muted/30 flex-1 rounded-md border p-4 pr-3">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="bg-primary/10 rounded-full p-2">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-xl p-3 text-sm shadow ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="bg-primary/10 rounded-full p-2">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* INPUT BAR — stays fixed */}
          <div className="mt-3 flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="icon">
              <Send size={16} />
            </Button>
          </div>

          {/* TOP SUGGESTIONS — now scrollable */}
          <ScrollArea className="mt-4 max-h-[200px] space-y-4 overflow-y-auto pr-2">
            <h6 className="font-medium">Our Top Suggestions</h6>

            {MOCK_MENU_ITEMS.map((item) => (
              <div
                key={item.id}
                className="border-border hover:bg-secondary/50 flex gap-4 rounded-lg border p-3 transition-colors"
              >
                <div className="bg-secondary h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-contain"
                    width={170}
                    height={170}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = 'none')
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground font-medium">{item.name}</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">
                      ${item.price}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(item)}
                      className="h-8"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <div className="border-border mt-4 space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Your Order ({cart.length})
                  </span>
                  <span className="text-foreground font-semibold">
                    ${cartTotal}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm">
                  {cart.map((item) => item.name).join(', ')}
                </p>

                <Button onClick={handlePlaceFoodOrder} className="w-full">
                  Place Order
                </Button>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Upsell Dialog */}
      <AlertDialog open={!!upsellItem} onOpenChange={() => setUpsellItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Hungry? 🍔</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {pendingCartItem?.upsellMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleUpsellDecline}
              className="w-full sm:w-auto"
            >
              No Thanks
            </Button>
            <Button onClick={handleUpsellAccept} className="w-full sm:w-auto">
              Add {upsellItem?.name}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GuestLayout>
  );
};

export default GuestPortal;
