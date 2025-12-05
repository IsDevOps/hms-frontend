// 'use client';
// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select';
// import { Clock, ChefHat, BedSingle, ConciergeBell } from 'lucide-react';

// const mockRequests = [
//   {
//     id: 1,
//     room: '204',
//     department: 'kitchen',
//     item: 'Burger & Coke',
//     priority: 'high',
//     time: '5 mins ago',
//     status: 'RECEIVED',
//   },
//   {
//     id: 2,
//     room: '118',
//     department: 'housekeeping',
//     item: 'Extra Towels',
//     priority: 'low',
//     time: '2 mins ago',
//     status: 'RECEIVED',
//   },
//   {
//     id: 3,
//     room: '309',
//     department: 'concierge',
//     item: 'Taxi Request',
//     priority: 'medium',
//     time: 'Just now',
//     status: 'RECEIVED',
//   },
// ];

// export default function RequestDashboard() {
//   const [requests, setRequests] = useState(mockRequests);

//   const updateStatus = (id: any, newStatus: any) => {
//     setRequests((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
//     );
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <h1 className="mb-4 text-3xl font-bold">Manager Command Center</h1>

//       <Tabs defaultValue="all" className="w-full">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="all">All</TabsTrigger>
//           <TabsTrigger value="kitchen" className="flex items-center gap-2">
//             <ChefHat size={16} /> Kitchen
//           </TabsTrigger>
//           <TabsTrigger value="housekeeping" className="flex items-center gap-2">
//             <BedSingle size={16} /> Housekeeping
//           </TabsTrigger>
//           <TabsTrigger value="concierge" className="flex items-center gap-2">
//             <ConciergeBell size={16} /> Concierge
//           </TabsTrigger>
//         </TabsList>

//         {['all', 'kitchen', 'housekeeping', 'concierge'].map((tab) => (
//           <TabsContent key={tab} value={tab} className="mt-6">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {requests
//                 .filter((r) => (tab === 'all' ? true : r.department === tab))
//                 .map((req) => (
//                   <Card key={req.id} className="rounded-2xl border shadow-md">
//                     <CardContent className="space-y-3 p-4">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-xl font-semibold">
//                           Room {req.room}
//                         </h3>
//                         <Badge
//                           variant={
//                             req.priority === 'high'
//                               ? 'destructive'
//                               : 'secondary'
//                           }
//                         >
//                           {req.priority.toUpperCase()}
//                         </Badge>
//                       </div>

//                       <p className="text-sm text-gray-700">{req.item}</p>

//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <Clock size={14} /> {req.time}
//                       </div>

//                       <div className="pt-3">
//                         <Select
//                           onValueChange={(value) => updateStatus(req.id, value)}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder={req.status} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="RECEIVED">Received</SelectItem>
//                             <SelectItem value="IN_PROGRESS">
//                               In Progress
//                             </SelectItem>
//                             <SelectItem value="DONE">Done</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }

// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select';
// import {
//   Clock,
//   ChefHat,
//   BedSingle,
//   ConciergeBell,
//   Zap,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   RefreshCcw,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { formatDistanceToNow } from 'date-fns'; // Run: npm install date-fns

// // Types based on your backend
// interface ServiceRequest {
//   id: string;
//   type: 'FOOD' | 'CLEANING' | 'CONCIERGE' | 'MAINTENANCE';
//   description: string;
//   priority: 'LOW' | 'NORMAL' | 'HIGH';
//   status: 'RECEIVED' | 'IN_PROGRESS' | 'ON_WAY' | 'COMPLETED' | 'CANCELLED';
//   createdAt: string;
//   booking: {
//     room: {
//       number: string;
//     };
//     guest: {
//       name: string;
//     };
//   };
// }

// export default function RequestDashboard() {
//   const [requests, setRequests] = useState<ServiceRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState('ALL');

//   // --- 1. FETCH DATA ---
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       // NOTE: User specified port 5000
//       const res = await fetch('https://api-staging.medicate.health/api/v1/service-requests');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setRequests(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     // Optional: Polling every 10 seconds for "Real-time" feel without WebSockets
//     const interval = setInterval(fetchRequests, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // --- 2. UPDATE STATUS ---
//   const handleStatusUpdate = async (id: string, newStatus: string) => {
//     // Optimistic UI Update
//     setRequests((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
//     );

//     try {
//       await fetch(
//         `https://api-staging.medicate.health/api/v1/service-requests/${id}/status`,
//         {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );
//       // Optionally re-fetch to ensure sync
//     } catch (error) {
//       console.error('Failed to update status', error);
//       // Revert if failed (omitted for hackathon speed)
//     }
//   };

//   // Helper for filtering
//   const filteredRequests = requests.filter((r) =>
//     filterType === 'ALL' ? true : r.type === filterType
//   );

//   // Helper for Status Colors
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'RECEIVED':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'IN_PROGRESS':
//         return 'bg-amber-100 text-amber-700 border-amber-200';
//       case 'ON_WAY':
//         return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'COMPLETED':
//         return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getPriorityStyle = (priority: string) => {
//     if (priority === 'HIGH')
//       return 'animate-pulse ring-2 ring-red-500/20 bg-red-50 border-red-200';
//     return 'bg-white';
//   };

//   return (
//     <div className="min-h-screen space-y-8 bg-slate-50/50 p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Live Operations
//           </h1>
//           <p className="mt-1 text-slate-500">
//             Real-time guest service monitoring
//           </p>
//         </div>
//         <button
//           onClick={fetchRequests}
//           className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50"
//         >
//           <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
//           Refresh
//         </button>
//       </div>

//       {/* TABS FILTER */}
//       <Tabs defaultValue="ALL" className="w-full" onValueChange={setFilterType}>
//         <TabsList className="h-auto gap-1 rounded-xl border bg-white p-1 shadow-sm">
//           <TabsTrigger
//             value="ALL"
//             className="rounded-lg px-4 py-2 transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
//           >
//             All Requests
//           </TabsTrigger>
//           <TabsTrigger
//             value="FOOD"
//             className="flex gap-2 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-orange-500 data-[state=active]:text-white"
//           >
//             <ChefHat size={16} /> Dining
//           </TabsTrigger>
//           <TabsTrigger
//             value="CLEANING"
//             className="flex gap-2 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//           >
//             <BedSingle size={16} /> Housekeeping
//           </TabsTrigger>
//           <TabsTrigger
//             value="CONCIERGE"
//             className="flex gap-2 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-purple-500 data-[state=active]:text-white"
//           >
//             <ConciergeBell size={16} /> Concierge
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {/* GRID */}
//       {loading && requests.length === 0 ? (
//         <div className="flex h-64 items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredRequests.map((req) => (
//             <Card
//               key={req.id}
//               className={cn(
//                 'overflow-hidden border-l-4 transition-all hover:shadow-lg',
//                 getPriorityStyle(req.priority),
//                 req.type === 'FOOD'
//                   ? 'border-l-orange-500'
//                   : req.type === 'CLEANING'
//                     ? 'border-l-blue-500'
//                     : req.type === 'CONCIERGE'
//                       ? 'border-l-purple-500'
//                       : 'border-l-slate-400'
//               )}
//             >
//               <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
//                 <div>
//                   <div className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
//                     Room {req.booking?.room?.number || '---'}
//                   </div>
//                   <CardTitle className="text-base font-bold text-slate-800">
//                     {req.booking?.guest?.name || 'Unknown Guest'}
//                   </CardTitle>
//                 </div>
//                 {req.priority === 'HIGH' && (
//                   <Badge
//                     variant="destructive"
//                     className="flex items-center gap-1 shadow-sm"
//                   >
//                     <Zap size={10} className="fill-current" />
//                     High
//                   </Badge>
//                 )}
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 {/* Description */}
//                 <div className="rounded-lg border border-slate-100 bg-slate-100/50 p-3">
//                   <p className="line-clamp-2 text-sm font-medium text-slate-700">
//                     {req.description}
//                   </p>
//                 </div>

//                 {/* Metadata */}
//                 <div className="flex items-center gap-3 text-xs text-slate-500">
//                   <div className="flex items-center gap-1">
//                     <Clock size={14} />
//                     {/* Requires: npm i date-fns */}
//                     {req.createdAt
//                       ? formatDistanceToNow(new Date(req.createdAt)) + ' ago'
//                       : 'Now'}
//                   </div>
//                   <div className="h-1 w-1 rounded-full bg-slate-300" />
//                   <span className="font-medium">{req.type}</span>
//                 </div>

//                 {/* Status Dropdown */}
//                 <div className="pt-2">
//                   <Select
//                     defaultValue={req.status}
//                     onValueChange={(val) => handleStatusUpdate(req.id, val)}
//                   >
//                     <SelectTrigger
//                       className={cn(
//                         'h-9 w-full border-0 text-xs font-medium shadow-sm ring-1 ring-inset',
//                         getStatusColor(req.status)
//                       )}
//                     >
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="RECEIVED">
//                         <div className="flex items-center gap-2">
//                           <AlertCircle size={14} /> Received
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="IN_PROGRESS">
//                         <div className="flex items-center gap-2">
//                           <Loader2 size={14} /> In Progress
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="ON_WAY">
//                         <div className="flex items-center gap-2">
//                           <Clock size={14} /> On The Way
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="COMPLETED">
//                         <div className="flex items-center gap-2">
//                           <CheckCircle2 size={14} /> Completed
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {filteredRequests.map((req) => {
//             // Helper to get color/icon based on type
//             const getCategoryDetails = (type: string) => {
//               switch (type) {
//                 case 'FOOD':
//                   return {
//                     color: 'bg-orange-500',
//                     text: 'text-orange-600',
//                     bg: 'bg-orange-50',
//                     icon: ChefHat,
//                   };
//                 case 'CLEANING':
//                   return {
//                     color: 'bg-blue-500',
//                     text: 'text-blue-600',
//                     bg: 'bg-blue-50',
//                     icon: BedSingle,
//                   };
//                 case 'CONCIERGE':
//                   return {
//                     color: 'bg-purple-500',
//                     text: 'text-purple-600',
//                     bg: 'bg-purple-50',
//                     icon: ConciergeBell,
//                   };
//                 default:
//                   return {
//                     color: 'bg-slate-500',
//                     text: 'text-slate-600',
//                     bg: 'bg-slate-50',
//                     icon: Zap,
//                   };
//               }
//             };

//             const cat = getCategoryDetails(req.type);
//             const CategoryIcon = cat.icon;

//             return (
//               <Card
//                 key={req.id}
//                 className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
//               >
//                 {/* 1. Subtle Color Strip at the top */}
//                 <div
//                   className={`absolute top-0 left-0 h-1 w-full ${cat.color}`}
//                 />

//                 <CardHeader className="pt-5 pb-3">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       {/* 2. Room Number is Big and Clear */}
//                       <h3 className="text-2xl font-bold text-slate-900">
//                         {req.booking?.room?.number || '---'}
//                       </h3>
//                       <p className="text-sm font-medium text-slate-500">
//                         {req.booking?.guest?.name || 'Guest'}
//                       </p>
//                     </div>

//                     {/* 3. Type Icon Badge */}
//                     <div
//                       className={`flex h-8 w-8 items-center justify-center rounded-full ${cat.bg} ${cat.text}`}
//                     >
//                       <CategoryIcon size={16} />
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="flex flex-1 flex-col justify-between gap-4">
//                   <div>
//                     {/* 4. Priority Badge (Only if High) */}
//                     {req.priority === 'HIGH' && (
//                       <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-600/10 ring-inset">
//                         <AlertCircle size={12} /> High Priority
//                       </div>
//                     )}

//                     {/* 5. Description - Readable */}
//                     <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
//                       {req.description}
//                     </p>
//                   </div>

//                   {/* 6. Footer: Time & Status */}
//                   <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
//                     <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
//                       <Clock size={12} />
//                       {req.createdAt
//                         ? formatDistanceToNow(new Date(req.createdAt)) + ' ago'
//                         : 'Just now'}
//                     </div>

//                     <Select
//                       defaultValue={req.status}
//                       onValueChange={(val) => handleStatusUpdate(req.id, val)}
//                     >
//                       <SelectTrigger className="h-9 w-full border-slate-200 bg-slate-50/50 text-xs font-medium hover:bg-slate-100 focus:ring-0">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="RECEIVED">Received</SelectItem>
//                         <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                         <SelectItem value="ON_WAY">On The Way</SelectItem>
//                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}

//           {filteredRequests.length === 0 && (
//             <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed text-slate-400">
//               <ChefHat size={48} className="mb-2 opacity-20" />
//               <p>No active requests in this category</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Clock,
  ChefHat,
  BedSingle,
  ConciergeBell,
  Zap,
  Loader2,
  RefreshCcw,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Types based on your backend
interface ServiceRequest {
  id: string;
  type: 'FOOD' | 'CLEANING' | 'CONCIERGE' | 'MAINTENANCE';
  description: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  status: 'RECEIVED' | 'IN_PROGRESS' | 'ON_WAY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  booking: {
    room: {
      number: string;
    };
    guest: {
      name: string;
    };
  };
}

export default function RequestDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://api-staging.medicate.health/api/v1/service-requests'
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
    );

    try {
      await fetch(
        `https://api-staging.medicate.health/api/v1/service-requests/${id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredRequests = requests.filter((r) =>
    filterType === 'ALL' ? true : r.type === filterType
  );

  // --- STYLING HELPERS ---

  // Get colors and icons based on Category
  const getCategoryTheme = (type: string) => {
    switch (type) {
      case 'FOOD':
        return {
          color: 'bg-orange-500',
          text: 'text-orange-600',
          bg: 'bg-orange-50',
          icon: ChefHat,
        };
      case 'CLEANING':
        return {
          color: 'bg-blue-500',
          text: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: BedSingle,
        };
      case 'CONCIERGE':
        return {
          color: 'bg-purple-500',
          text: 'text-purple-600',
          bg: 'bg-purple-50',
          icon: ConciergeBell,
        };
      default:
        return {
          color: 'bg-slate-500',
          text: 'text-slate-600',
          bg: 'bg-slate-50',
          icon: Zap,
        };
    }
  };

  // Status Badge Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'ON_WAY':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-[#F8F9FB] p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Concierge Desk
          </h1>
          <p className="mt-1 text-slate-500">
            {requests.length} active service requests
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ALL" className="w-full" onValueChange={setFilterType}>
        <TabsList className="h-12 gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <TabsTrigger
            value="ALL"
            className="rounded-full px-6 text-xs font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="FOOD"
            className="rounded-full px-6 text-xs font-medium data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
          >
            Dining
          </TabsTrigger>
          <TabsTrigger
            value="CLEANING"
            className="rounded-full px-6 text-xs font-medium data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
          >
            Housekeeping
          </TabsTrigger>
          <TabsTrigger
            value="CONCIERGE"
            className="rounded-full px-6 text-xs font-medium data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
          >
            Concierge
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      {loading && requests.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRequests.map((req) => {
            const theme = getCategoryTheme(req.type);
            const Icon = theme.icon;

            return (
              <Card
                key={req.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Top Color Strip */}
                <div
                  className={`absolute top-0 left-0 h-1 w-full ${theme.color}`}
                />

                <CardHeader className="pt-6 pb-2">
                  <div className="flex items-start justify-between">
                    {/* Room & Guest Info */}
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          {req.booking?.room?.number || '---'}
                        </span>
                        <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                          Room
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                        {req.booking?.guest?.name || 'Guest'}
                      </p>
                    </div>

                    {/* Category Icon Badge */}
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        theme.bg,
                        theme.text
                      )}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow py-2">
                  {/* Priority Tag (Static, Sleek) */}
                  {req.priority === 'HIGH' && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-red-600 uppercase ring-1 ring-red-600/10 ring-inset">
                      <Zap size={10} className="fill-current" />
                      Priority
                    </div>
                  )}

                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {req.description}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 border-t border-slate-50 bg-slate-50/30 p-4">
                  <div className="flex w-full items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {req.createdAt
                        ? formatDistanceToNow(new Date(req.createdAt))
                        : 'Just now'}
                    </div>
                    <MoreHorizontal size={14} />
                  </div>

                  <Select
                    defaultValue={req.status}
                    onValueChange={(val) => handleStatusUpdate(req.id, val)}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-9 w-full border text-xs font-semibold tracking-wide uppercase transition-colors focus:ring-0',
                        getStatusColor(req.status)
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RECEIVED">Received</SelectItem>
                      <SelectItem value="IN_PROGRESS">Processing</SelectItem>
                      <SelectItem value="ON_WAY">En Route</SelectItem>
                      <SelectItem value="COMPLETED">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </CardFooter>
              </Card>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <ChefHat size={48} className="mb-4 opacity-10" />
              <p className="text-sm font-medium">No active requests found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
