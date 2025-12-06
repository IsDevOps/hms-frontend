// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import {
//   UtensilsCrossed,
//   Sparkles,
//   Wrench,
//   Phone,
//   Check,
//   Loader2,
//   ChefHat,
//   Truck,
//   Plus,
//   Bot,
//   User,
//   Send,
//   X,
//   ArrowRight,
//   Clock,
//   Package,
//   CalendarDays,
// } from 'lucide-react';
// import GuestLayout from '@/components/layout/GuestLayout';
// import {
//   HOUSEKEEPING_ITEMS,
//   MAINTENANCE_ITEMS,
//   OrderStatus,
//   getTimeGreeting,
//   getAIRecommendation,
// } from '@/data/mockData';
// import { cn } from '@/lib/utils';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Input } from '@/components/ui/input';
// import { useCreateServiceMutation } from '@/store/services/admin-dashboard';
// import { useParams } from 'next/navigation';
// import { formatDistanceToNow } from 'date-fns';
// import { Skeleton } from '@/components/ui/skeleton';

// // --- TYPES ---
// interface ChatMessage {
//   id: number;
//   sender: 'user' | 'ai';
//   text: string;
// }

// interface AiSuggestion {
//   name: string;
//   description?: string;
//   price?: number;
//   type: string;
// }

// interface ActiveOrder {
//   id: string;
//   items: string[];
//   status: OrderStatus;
//   type: string;
//   createdAt: string;
//   total?: number;
//   scheduledTime?: string;
// }

// interface BookingDetails {
//   id: string;
//   checkInDate: string;
//   checkOutDate: string;
//   status: string;
//   guest: {
//     name: string;
//     email: string;
//   };
//   room: {
//     number: string;
//     type: string;
//   };
// }

// const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] =
//   [
//     { status: 'RECEIVED', label: 'Received', icon: Check },
//     { status: 'IN_PROGRESS', label: 'Processing', icon: ChefHat },
//     { status: 'ON_WAY', label: 'On the Way', icon: Truck },
//     { status: 'COMPLETED', label: 'Completed', icon: Check },
//   ];

// const serviceTypes = [
//   {
//     id: 'food',
//     label: 'Dining',
//     icon: UtensilsCrossed,
//     color: 'bg-orange-500/10 text-orange-600',
//   },
//   {
//     id: 'housekeeping',
//     label: 'Housekeeping',
//     icon: Sparkles,
//     color: 'bg-blue-500/10 text-blue-600',
//   },
//   {
//     id: 'maintenance',
//     label: 'Maintenance',
//     icon: Wrench,
//     color: 'bg-slate-500/10 text-slate-600',
//   },
//   {
//     id: 'concierge',
//     label: 'Concierge',
//     icon: Phone,
//     color: 'bg-emerald-500/10 text-emerald-600',
//   },
// ];

// const GuestPortal = () => {
//   const params = useParams();
//   const bookingId = Array.isArray(params.bookingId)
//     ? params.bookingId[0]
//     : params.bookingId;

//   const { toast } = useToast();

//   // State
//   const [booking, setBooking] = useState<BookingDetails | null>(null);
//   const [isBookingLoading, setIsBookingLoading] = useState(true);

//   const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
//   const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
//   const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
//     null
//   );

//   // Chat State
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: 1,
//       sender: 'ai',
//       text: 'Hello! I am your AI Concierge. How can I make your stay perfect?',
//     },
//   ]);
//   const [chatInput, setChatInput] = useState('');
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // API Hooks
//   const [createService, { isLoading: isSubmittingRequest }] =
//     useCreateServiceMutation();
//   const [aiRecommendation] = useState(getAIRecommendation());

//   // --- FETCH BOOKING DETAILS ---
//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       if (!bookingId) return;
//       try {
//         const res = await fetch(
//           `https://api-staging.medicate.health/api/v1/bookings/${bookingId}`
//         );
//         if (res.ok) {
//           const data = await res.json();
//           setBooking(data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch booking details', error);
//       } finally {
//         setIsBookingLoading(false);
//       }
//     };
//     fetchBookingDetails();
//   }, [bookingId]);

//   // --- POLLING FOR ORDERS ---
//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!bookingId) return;
//       try {
//         const res = await fetch(
//           'https://api-staging.medicate.health/api/v1/service-requests'
//         );
//         if (res.ok) {
//           const allRequests = await res.json();
//           const myRequests = allRequests.filter(
//             (req: any) => req.booking?.id === bookingId
//           );

//           const mappedOrders: ActiveOrder[] = myRequests.map((req: any) => ({
//             id: req.id,
//             items: [req.description],
//             status: req.status,
//             type: req.type.toLowerCase(),
//             createdAt: req.createdAt,
//             total: 0,
//           }));

//           mappedOrders.sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//           setActiveOrders(mappedOrders);
//         }
//       } catch (error) {
//         console.error('Failed to sync orders', error);
//       }
//     };

//     fetchOrders();
//     const interval = setInterval(fetchOrders, 3000);
//     return () => clearInterval(interval);
//   }, [bookingId]);

//   // Scroll chat to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, isSubmittingRequest, isChatLoading]);

//   // --- HANDLERS ---
//   const handleSendMessage = async () => {
//     if (!chatInput.trim()) return;

//     const userText = chatInput;
//     setChatInput('');
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), sender: 'user', text: userText },
//     ]);
//     setIsChatLoading(true);

//     try {
//       const response = await fetch(
//         'https://api-staging.medicate.health/api/v1/ai-test/chat',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ message: userText, context: 'GENERAL' }),
//         }
//       );

//       if (!response.ok) throw new Error('Failed to send message');

//       const data = await response.json();

//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, sender: 'ai', text: data.reply },
//       ]);

//       if (data.suggestions && data.suggestions.length > 0) {
//         setAiSuggestions(data.suggestions);
//       }
//     } catch (error) {
//       console.error('Chat Error:', error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           sender: 'ai',
//           text: "I'm having trouble connecting to the concierge. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   const handleSuggestionClick = (item: AiSuggestion) => {
//     const type = item.type.toUpperCase();
//     if (type === 'FOOD') {
//       handleServiceRequest('FOOD', [item.name]);
//     } else {
//       handleServiceRequest(type, [item.name]);
//     }
//   };

//   const handleServiceRequest = async (type: string, items: string[]) => {
//     try {
//       if (!bookingId) {
//         toast({
//           title: 'Error',
//           variant: 'destructive',
//           description: 'Booking ID not found. Please re-scan your QR code.',
//         });
//         return;
//       }

//       const payload = {
//         bookingId,
//         type: type.toUpperCase(),
//         description: items.join(', '),
//         quantity: 1,
//       };
//       await createService(payload).unwrap();

//       if (isChatOpen) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now(),
//             sender: 'ai',
//             text: `Confirmed! I've sent a request for "${items.join(', ')}". You can track it on your dashboard.`,
//           },
//         ]);
//       } else {
//         setIsNewRequestOpen(false);
//         setSelectedServiceType(null);
//         toast({
//           title: 'Request Sent',
//           description: `${items.join(', ')} requested successfully!`,
//           className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
//         });
//       }
//     } catch (err: any) {
//       console.error('Request failed', err);
//       toast({
//         title: 'Error',
//         variant: 'destructive',
//         description: 'Failed to submit request',
//       });
//     }
//   };

//   const getStatusIndex = (status: OrderStatus) =>
//     ORDER_STATUS_STEPS.findIndex((s) => s.status === status);

//   return (
//     <GuestLayout title="Service Portal">
//       <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-24 duration-500">
//         {/* Sleek Welcome Header */}
//         <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
//           {/* Decorative subtle background element */}
//           <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-slate-50 blur-2xl"></div>

//           <div className="relative z-10 flex items-center justify-between">
//             <div>
//               <p className="mb-1.5 flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
//                 {getTimeGreeting()}
//                 <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                 <span className="text-emerald-600">Active Stay</span>
//               </p>

//               {isBookingLoading ? (
//                 <div className="space-y-2">
//                   <Skeleton className="h-8 w-48" />
//                   <Skeleton className="h-4 w-32" />
//                 </div>
//               ) : (
//                 <>
//                   <h2 className="text-2xl font-bold tracking-tight text-slate-900">
//                     {booking?.guest?.name || 'Valued Guest'}
//                   </h2>
//                   <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
//                     <span className="flex items-center gap-1.5">
//                       <Clock className="h-3.5 w-3.5" />
//                       Check-out:{' '}
//                       {booking
//                         ? new Date(booking.checkOutDate).toLocaleDateString(
//                             undefined,
//                             { month: 'short', day: 'numeric' }
//                           )
//                         : '--'}
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex flex-col items-end gap-1">
//               {isBookingLoading ? (
//                 <Skeleton className="h-12 w-12 rounded-xl" />
//               ) : (
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-md shadow-slate-200">
//                   {booking?.room?.number || '--'}
//                 </div>
//               )}
//               <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
//                 Room
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* AI Recommendation Card */}
//         {aiRecommendation && (
//           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg shadow-indigo-200">
//             <div className="relative z-10 flex items-start gap-4">
//               <div className="rounded-xl bg-white/20 p-3 shadow-inner backdrop-blur-sm">
//                 <Sparkles className="h-6 w-6 fill-yellow-300/20 text-yellow-300" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm leading-relaxed font-medium text-white/95">
//                   {aiRecommendation.message}
//                 </p>
//                 <div className="mt-4 flex gap-3">
//                   <Button
//                     size="sm"
//                     className="border-0 bg-white font-semibold text-indigo-700 hover:bg-white/90"
//                     onClick={() => setIsChatOpen(true)}
//                   >
//                     View Suggestion
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="text-white/70 hover:bg-white/10 hover:text-white"
//                   >
//                     Dismiss
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-4">
//           {serviceTypes.map((service) => (
//             <button
//               key={service.id}
//               onClick={() => {
//                 if (service.id === 'food') setIsChatOpen(true);
//                 else {
//                   setSelectedServiceType(service.id);
//                   setIsNewRequestOpen(true);
//                 }
//               }}
//               className="group flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow-md active:scale-95"
//             >
//               <div
//                 className={cn(
//                   'rounded-full p-3 transition-transform duration-300 group-hover:scale-110',
//                   service.color
//                 )}
//               >
//                 <service.icon className="h-6 w-6" />
//               </div>
//               <span className="text-sm font-medium text-slate-700">
//                 {service.label}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Active Orders List */}
//         {activeOrders.length > 0 ? (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 px-1">
//               <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
//               <h3 className="text-lg font-bold text-slate-900">
//                 Live Requests
//               </h3>
//             </div>

//             {activeOrders
//               .filter((o) => o.status !== 'COMPLETED')
//               .map((order) => {
//                 const statusIndex = getStatusIndex(order.status);
//                 return (
//                   <div
//                     key={order.id}
//                     className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
//                   >
//                     {/* Order Header */}
//                     <div className="border-b border-slate-50 bg-slate-50/50 p-4">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h4 className="line-clamp-1 font-bold text-slate-900">
//                             {order.items.join(', ')}
//                           </h4>
//                           <div className="mt-1 flex items-center gap-2">
//                             <Clock className="h-3 w-3 text-slate-400" />
//                             <p className="text-xs font-medium text-slate-500">
//                               {formatDistanceToNow(new Date(order.createdAt))}{' '}
//                               ago
//                             </p>
//                           </div>
//                         </div>
//                         <div className="rounded-full border border-slate-100 bg-white px-2 py-1 text-xs font-bold tracking-wide text-slate-900 uppercase shadow-sm">
//                           {order.type}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Tracker Progress Bar */}
//                     <div className="p-5">
//                       <div className="relative mb-6">
//                         <div className="absolute top-1/2 right-0 left-0 -z-0 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
//                         <div
//                           className="absolute top-1/2 left-0 -z-0 h-1 -translate-y-1/2 rounded-full bg-emerald-500 transition-all duration-700 ease-out"
//                           style={{
//                             width: `${(statusIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
//                           }}
//                         />

//                         <div className="relative z-10 flex justify-between">
//                           {ORDER_STATUS_STEPS.map((step, idx) => {
//                             const isCompleted = idx <= statusIndex;
//                             const isCurrent = idx === statusIndex;
//                             const Icon = step.icon;

//                             return (
//                               <div
//                                 key={step.status}
//                                 className="flex flex-col items-center"
//                               >
//                                 <div
//                                   className={cn(
//                                     'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all duration-500',
//                                     isCompleted
//                                       ? 'border-emerald-500 text-emerald-600 shadow-sm'
//                                       : 'border-slate-200 text-slate-300',
//                                     isCurrent &&
//                                       'scale-110 ring-4 ring-emerald-100'
//                                   )}
//                                 >
//                                   {isCurrent && statusIndex !== 3 ? (
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                   ) : (
//                                     <Icon className="h-4 w-4" />
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>

//                       <div className="text-center">
//                         <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
//                           Current Status
//                         </p>
//                         <p className="animate-pulse text-sm font-bold text-emerald-600">
//                           {ORDER_STATUS_STEPS[statusIndex]?.label ||
//                             'Processing'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//             {/* Completed Orders */}
//             {activeOrders.filter((o) => o.status === 'COMPLETED').length >
//               0 && (
//               <div className="mt-6 border-t border-dashed border-slate-200 pt-4">
//                 <h4 className="mb-3 px-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
//                   Past Requests
//                 </h4>
//                 <div className="space-y-2">
//                   {activeOrders
//                     .filter((o) => o.status === 'COMPLETED')
//                     .map((order) => (
//                       <div
//                         key={order.id}
//                         className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 opacity-60 transition-opacity hover:opacity-100"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
//                             <Check className="h-4 w-4" />
//                           </div>
//                           <div>
//                             <p className="line-clamp-1 text-sm font-medium text-slate-700">
//                               {order.items.join(', ')}
//                             </p>
//                             <p className="text-xs text-slate-400">
//                               {formatDistanceToNow(new Date(order.createdAt))}{' '}
//                               ago
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
//             <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
//               <Package className="h-6 w-6 text-slate-300" />
//             </div>
//             <p className="text-sm font-medium text-slate-500">
//               No active requests
//             </p>
//             <p className="text-xs text-slate-400">Start a new request below</p>
//           </div>
//         )}

//         {/* Request Grid */}
//         {/* <div className="grid grid-cols-2 gap-4">
//           {serviceTypes.map((service) => (
//             <button
//               key={service.id}
//               onClick={() => {
//                 if (service.id === 'food') setIsChatOpen(true);
//                 else {
//                   setSelectedServiceType(service.id);
//                   setIsNewRequestOpen(true);
//                 }
//               }}
//               className="group flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow-md active:scale-95"
//             >
//               <div
//                 className={cn(
//                   'rounded-full p-3 transition-transform duration-300 group-hover:scale-110',
//                   service.color
//                 )}
//               >
//                 <service.icon className="h-6 w-6" />
//               </div>
//               <span className="text-sm font-medium text-slate-700">
//                 {service.label}
//               </span>
//             </button>
//           ))}
//         </div> */}
//       </div>

//       {/* Floating Chat Button */}
//       {!isChatOpen && (
//         <button
//           onClick={() => setIsChatOpen(true)}
//           className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all hover:scale-110 hover:bg-slate-800 hover:shadow-2xl active:scale-95"
//         >
//           <Sparkles className="h-6 w-6" />
//         </button>
//       )}

//       {/* AI Chat Modal */}
//       <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
//         <DialogContent className="flex h-[85vh] flex-col gap-0 overflow-hidden border-0 bg-slate-50 p-0 sm:max-w-md">
//           {/* Header */}
//           <div className="z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
//                 <Bot className="h-6 w-6" />
//               </div>
//               <div>
//                 <DialogTitle className="font-bold text-slate-900">
//                   Concierge AI
//                 </DialogTitle>
//                 <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
//                   <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
//                   Online
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Chat Content */}
//           <ScrollArea className="flex-1 bg-slate-50 p-4">
//             <div className="space-y-6">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={cn(
//                     'flex gap-3',
//                     msg.sender === 'user' ? 'justify-end' : 'justify-start'
//                   )}
//                 >
//                   {msg.sender === 'ai' && (
//                     <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
//                       <Bot className="h-4 w-4" />
//                     </div>
//                   )}
//                   <div
//                     className={cn(
//                       'max-w-[80%] rounded-2xl p-4 text-sm shadow-sm',
//                       msg.sender === 'user'
//                         ? 'rounded-tr-none bg-slate-900 text-white'
//                         : 'rounded-tl-none border border-slate-100 bg-white text-slate-700'
//                     )}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               {(isChatLoading || (isSubmittingRequest && isChatOpen)) && (
//                 <div className="flex gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   </div>
//                   <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 text-sm text-slate-400">
//                     {isSubmittingRequest ? (
//                       <span className="font-medium text-indigo-600">
//                         Processing request
//                       </span>
//                     ) : (
//                       'Thinking'
//                     )}
//                     <span className="animate-bounce">.</span>
//                     <span className="animate-bounce delay-100">.</span>
//                     <span className="animate-bounce delay-200">.</span>
//                   </div>
//                 </div>
//               )}
//               <div ref={scrollRef} />
//             </div>
//           </ScrollArea>

//           {/* Suggestions */}
//           {aiSuggestions.length > 0 && (
//             <div className="border-t border-slate-100 bg-white p-4">
//               <p className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
//                 Suggested for you
//               </p>
//               <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
//                 {aiSuggestions.map((item, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleSuggestionClick(item)}
//                     disabled={isSubmittingRequest}
//                     className="group min-w-[200px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/50 disabled:opacity-50"
//                   >
//                     <div className="mb-1 flex items-start justify-between">
//                       <h4 className="text-sm font-semibold text-slate-900">
//                         {item.name}
//                       </h4>
//                       {item.price && (
//                         <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-600">
//                           ${item.price}
//                         </span>
//                       )}
//                     </div>
//                     {item.description && (
//                       <p className="line-clamp-1 text-xs text-slate-500">
//                         {item.description}
//                       </p>
//                     )}
//                     <div className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
//                       Request Now <ArrowRight className="h-3 w-3" />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Input */}
//           <div className="border-t border-slate-100 bg-white p-4">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSendMessage();
//               }}
//               className="flex gap-2"
//             >
//               <Input
//                 placeholder="Type your request..."
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 className="flex-1 border-slate-200 bg-slate-50 focus-visible:ring-indigo-500"
//                 autoFocus
//               />
//               <Button
//                 type="submit"
//                 size="icon"
//                 className="bg-slate-900 text-white hover:bg-slate-800"
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </form>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Manual Request Dialog */}
//       <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Request {selectedServiceType}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-2 pt-4">
//             {(selectedServiceType === 'housekeeping'
//               ? HOUSEKEEPING_ITEMS
//               : MAINTENANCE_ITEMS
//             ).map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() =>
//                   handleServiceRequest(selectedServiceType!, [item.name])
//                 }
//                 disabled={isSubmittingRequest}
//                 className="group flex w-full items-center justify-between rounded-lg border border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 disabled:opacity-50"
//               >
//                 <span className="font-medium text-slate-700">{item.name}</span>
//                 {isSubmittingRequest ? (
//                   <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
//                 ) : (
//                   <Plus className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </GuestLayout>
//   );
// };

// export default GuestPortal;

'use client';
import { useState, useEffect, useRef } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Wrench,
  Phone,
  Check,
  Loader2,
  ChefHat,
  Truck,
  Plus,
  Bot,
  User,
  Send,
  X,
  ArrowRight,
  Clock,
  Package,
  CalendarDays,
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useCreateServiceMutation } from '@/store/services/admin-dashboard';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

// --- TYPES ---
interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

interface AiSuggestion {
  name: string;
  description?: string;
  price?: number;
  type: string;
}

interface ActiveOrder {
  id: string;
  items: string[];
  status: OrderStatus;
  type: string;
  createdAt: string;
  total?: number;
  scheduledTime?: string;
}

interface BookingDetails {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  guest: {
    name: string;
    email: string;
  };
  room: {
    number: string;
    type: string;
  };
}

const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] =
  [
    { status: 'RECEIVED', label: 'Received', icon: Check },
    { status: 'IN_PROGRESS', label: 'Processing', icon: ChefHat },
    { status: 'ON_WAY', label: 'On the Way', icon: Truck },
    { status: 'COMPLETED', label: 'Completed', icon: Check },
  ];

const serviceTypes = [
  {
    id: 'food',
    label: 'Dining',
    icon: UtensilsCrossed,
    color: 'bg-orange-500/10 text-orange-600',
    description: 'Room service & snacks',
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: Sparkles,
    color: 'bg-blue-500/10 text-blue-600',
    description: 'Towels, pillows, cleaning',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    color: 'bg-slate-500/10 text-slate-600',
    description: 'Repairs & fixes',
  },
  {
    id: 'concierge',
    label: 'Concierge',
    icon: Phone,
    color: 'bg-emerald-500/10 text-emerald-600',
    description: 'Bookings & transport',
  },
];

// --- IMAGE HELPER (For visual menu) ---
const getItemImage = (name: string, type: string) => {
  const n = name.toLowerCase();
  // Food
  if (n.includes('burger'))
    return 'https://unsplash.com/photos/burger-with-lettuce-and-tomato-E94j3rMcxlw';
  if (n.includes('pasta'))
    return 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=60';
  if (n.includes('salad'))
    return 'https://plus.unsplash.com/premium_photo-1723291306365-841e10185b6f?q=80&w=1272&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  if (n.includes('coke') || n.includes('drink'))
    return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60';
  if (type === 'food')
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60';

  // Housekeeping
  if (n.includes('towel'))
    return 'https://images.unsplash.com/photo-1616627547584-978bc120cf5b?auto=format&fit=crop&w=500&q=60';
  if (n.includes('clean') || n.includes('room'))
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=60';
  if (n.includes('pillow'))
    return 'https://images.unsplash.com/photo-1631049035182-249067d7433e?auto=format&fit=crop&w=500&q=60';
  if (type === 'housekeeping')
    return 'https://images.unsplash.com/photo-1581578731117-e0d1f24bd305?auto=format&fit=crop&w=500&q=60';

  // Concierge
  if (n.includes('taxi') || n.includes('transport'))
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=60';
  if (n.includes('wake'))
    return 'https://images.unsplash.com/photo-1563861826100-9cb8685067b8?auto=format&fit=crop&w=500&q=60';
  if (type === 'concierge')
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60';

  // Maintenance
  if (n.includes('ac') || n.includes('air'))
    return 'https://images.unsplash.com/photo-1614447386768-e4b441a2430b?auto=format&fit=crop&w=500&q=60';
  if (n.includes('plumb') || n.includes('water'))
    return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=60';
  return 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&w=500&q=60'; // Generic repair
};

const GuestPortal = () => {
  const params = useParams();
  const bookingId = Array.isArray(params.bookingId)
    ? params.bookingId[0]
    : params.bookingId;

  const { toast } = useToast();

  // State
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(true);

  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI Concierge. How can I make your stay perfect?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const [createService, { isLoading: isSubmittingRequest }] =
    useCreateServiceMutation();
  const [aiRecommendation] = useState(getAIRecommendation());

  // --- FETCH BOOKING DETAILS ---
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      try {
        const res = await fetch(
          `https://api-staging.medicate.health/api/v1/bookings/${bookingId}`
        );
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (error) {
        console.error('Failed to fetch booking details', error);
      } finally {
        setIsBookingLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  // --- POLLING FOR ORDERS ---
  useEffect(() => {
    const fetchOrders = async () => {
      if (!bookingId) return;
      try {
        const res = await fetch(
          'https://api-staging.medicate.health/api/v1/service-requests'
        );
        if (res.ok) {
          const allRequests = await res.json();
          const myRequests = allRequests.filter(
            (req: any) => req.booking?.id === bookingId
          );

          const mappedOrders: ActiveOrder[] = myRequests.map((req: any) => ({
            id: req.id,
            items: [req.description],
            status: req.status,
            type: req.type.toLowerCase(),
            createdAt: req.createdAt,
            total: 0,
          }));

          mappedOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setActiveOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Failed to sync orders', error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSubmittingRequest, isChatLoading]);

  // --- HANDLERS ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userText },
    ]);
    setIsChatLoading(true);

    try {
      const response = await fetch(
        'https://api-staging.medicate.health/api/v1/ai-test/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, context: 'GENERAL' }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: data.reply },
      ]);

      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I'm having trouble connecting to the concierge. Please try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSuggestionClick = (item: AiSuggestion) => {
    const type = item.type.toUpperCase();
    handleServiceRequest(type === 'FOOD' ? 'FOOD' : type, [item.name]);
  };

  const handleServiceRequest = async (type: string, items: string[]) => {
    try {
      if (!bookingId) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Booking ID not found. Please re-scan your QR code.',
        });
        return;
      }

      const payload = {
        bookingId,
        type: type.toUpperCase(),
        description: items.join(', '),
        quantity: 1,
      };
      await createService(payload).unwrap();

      if (isChatOpen) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'ai',
            text: `Confirmed! I've sent a request for "${items.join(', ')}".`,
          },
        ]);
      } else {
        setIsServiceMenuOpen(false);
        setSelectedServiceType(null);
        toast({
          title: 'Request Sent',
          description: `${items.join(', ')} requested successfully!`,
          className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        });
      }
    } catch (err: any) {
      console.error('Request failed', err);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Failed to submit request',
      });
    }
  };

  const getStatusIndex = (status: OrderStatus) =>
    ORDER_STATUS_STEPS.findIndex((s) => s.status === status);

  // Helper to get items for the selected menu
  const getMenuItems = (type: string | null) => {
    if (type === 'food') return MOCK_MENU_ITEMS;
    if (type === 'housekeeping') return HOUSEKEEPING_ITEMS;
    if (type === 'maintenance') return MAINTENANCE_ITEMS;
    if (type === 'concierge') return CONCIERGE_ITEMS;
    return [];
  };

  return (
    <GuestLayout title="Service Portal">
      <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-24 duration-500">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-slate-50 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="mb-1.5 flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                {getTimeGreeting()}
                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                <span className="text-emerald-600">Active Stay</span>
              </p>

              {isBookingLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {booking?.guest?.name || 'Valued Guest'}
                  </h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Check-out:{' '}
                      {booking
                        ? new Date(booking.checkOutDate).toLocaleDateString(
                            undefined,
                            { month: 'short', day: 'numeric' }
                          )
                        : '--'}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {isBookingLoading ? (
                <Skeleton className="h-12 w-12 rounded-xl" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-md shadow-slate-200">
                  {booking?.room?.number || '--'}
                </div>
              )}
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Room
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        {aiRecommendation && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg shadow-indigo-200">
            <div className="relative z-10 flex items-start gap-4">
              <div className="rounded-xl bg-white/20 p-3 shadow-inner backdrop-blur-sm">
                <Sparkles className="h-6 w-6 fill-yellow-300/20 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed font-medium text-white/95">
                  {aiRecommendation.message}
                </p>
                <div className="mt-4 flex gap-3">
                  <Button
                    size="sm"
                    className="border-0 bg-white font-semibold text-indigo-700 hover:bg-white/90"
                    onClick={() => setIsChatOpen(true)}
                  >
                    View Suggestion
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE MENU GRID (Updated Logic: Clicking ANY opens the rich menu) */}
        <div className="grid grid-cols-2 gap-4">
          {serviceTypes.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedServiceType(service.id);
                setIsServiceMenuOpen(true);
              }}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <div
                className={cn(
                  'absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-110 group-hover:opacity-10',
                  service.color
                )}
              >
                <service.icon className="h-24 w-24" />
              </div>

              <div
                className={cn(
                  'mb-4 inline-flex rounded-xl p-3 transition-colors',
                  service.color
                )}
              >
                <service.icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">{service.label}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {service.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Orders List */}
        {activeOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Live Requests
              </h3>
            </div>

            {activeOrders
              .filter((o) => o.status !== 'COMPLETED')
              .map((order) => {
                const statusIndex = getStatusIndex(order.status);
                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-50 bg-slate-50/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="line-clamp-1 font-bold text-slate-900">
                            {order.items.join(', ')}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <p className="text-xs font-medium text-slate-500">
                              {formatDistanceToNow(new Date(order.createdAt))}{' '}
                              ago
                            </p>
                          </div>
                        </div>
                        <div className="rounded-full border border-slate-100 bg-white px-2 py-1 text-xs font-bold tracking-wide text-slate-900 uppercase shadow-sm">
                          {order.type}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="relative mb-6">
                        <div className="absolute top-1/2 right-0 left-0 -z-0 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
                        <div
                          className="absolute top-1/2 left-0 -z-0 h-1 -translate-y-1/2 rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                          style={{
                            width: `${(statusIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />
                        <div className="relative z-10 flex justify-between">
                          {ORDER_STATUS_STEPS.map((step, idx) => {
                            const isCompleted = idx <= statusIndex;
                            const isCurrent = idx === statusIndex;
                            const Icon = step.icon;
                            return (
                              <div
                                key={step.status}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all duration-500',
                                    isCompleted
                                      ? 'border-emerald-500 text-emerald-600 shadow-sm'
                                      : 'border-slate-200 text-slate-300',
                                    isCurrent &&
                                      'scale-110 ring-4 ring-emerald-100'
                                  )}
                                >
                                  {isCurrent && statusIndex !== 3 ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Icon className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                          Current Status
                        </p>
                        <p className="animate-pulse text-sm font-bold text-emerald-600">
                          {ORDER_STATUS_STEPS[statusIndex]?.label ||
                            'Processing'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all hover:scale-110 hover:bg-slate-800 hover:shadow-2xl active:scale-95"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* AI Chat Modal (Same as before) */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="flex h-[85vh] flex-col gap-0 overflow-hidden border-0 bg-slate-50 p-0 sm:max-w-md">
          <div className="z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="font-bold text-slate-900">
                  Concierge AI
                </DialogTitle>
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ScrollArea className="flex-1 bg-slate-50 p-4">
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.sender === 'ai' && (
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl p-4 text-sm shadow-sm',
                      msg.sender === 'user'
                        ? 'rounded-tr-none bg-slate-900 text-white'
                        : 'rounded-tl-none border border-slate-100 bg-white text-slate-700'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {(isChatLoading || (isSubmittingRequest && isChatOpen)) && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 text-sm text-slate-400">
                    {isSubmittingRequest ? (
                      <span className="font-medium text-indigo-600">
                        Processing request
                      </span>
                    ) : (
                      'Thinking'
                    )}
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          {aiSuggestions.length > 0 && (
            <div className="border-t border-slate-100 bg-white p-4">
              <p className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Suggested for you
              </p>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                {aiSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    disabled={isSubmittingRequest}
                    className="group min-w-[200px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/50 disabled:opacity-50"
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </h4>
                      {item.price && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-600">
                          ${item.price}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Request Now <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-slate-100 bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type your request..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 border-slate-200 bg-slate-50 focus-visible:ring-indigo-500"
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* VISUAL SERVICE MENU DIALOG (New Rich UI) */}
      <Dialog open={isServiceMenuOpen} onOpenChange={setIsServiceMenuOpen}>
        <DialogContent className="flex h-[85vh] flex-col gap-0 overflow-hidden border-0 bg-slate-50 p-0 sm:max-w-md">
          {/* Menu Header */}
          <div className="z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
            <div>
              <DialogTitle className="font-bold text-slate-900 capitalize">
                {selectedServiceType}
              </DialogTitle>
              <p className="text-xs text-slate-500">Select an item to order</p>
            </div>
            <button
              onClick={() => setIsServiceMenuOpen(false)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Grid */}
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-1 gap-4">
              {getMenuItems(selectedServiceType).map((item: any) => (
                <button
                  key={item.id}
                  onClick={() =>
                    handleServiceRequest(selectedServiceType!, [item.name])
                  }
                  disabled={isSubmittingRequest}
                  className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md disabled:opacity-60"
                >
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={
                        item.image ||
                        getItemImage(item.name, selectedServiceType || '')
                      }
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex h-24 flex-1 flex-col justify-between py-1">
                    <div>
                      <h4 className="line-clamp-1 font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {item.price ? (
                        <span className="font-bold text-emerald-600">
                          ${item.price}
                        </span>
                      ) : (
                        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Free
                        </span>
                      )}
                      <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                        {isSubmittingRequest ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Order'
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </GuestLayout>
  );
};

export default GuestPortal;
