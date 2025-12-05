'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Clock, ChefHat, BedSingle, ConciergeBell } from 'lucide-react';

const mockRequests = [
  {
    id: 1,
    room: '204',
    department: 'kitchen',
    item: 'Burger & Coke',
    priority: 'high',
    time: '5 mins ago',
    status: 'RECEIVED',
  },
  {
    id: 2,
    room: '118',
    department: 'housekeeping',
    item: 'Extra Towels',
    priority: 'low',
    time: '2 mins ago',
    status: 'RECEIVED',
  },
  {
    id: 3,
    room: '309',
    department: 'concierge',
    item: 'Taxi Request',
    priority: 'medium',
    time: 'Just now',
    status: 'RECEIVED',
  },
];

export default function RequestDashboard() {
  const [requests, setRequests] = useState(mockRequests);

  const updateStatus = (id: any, newStatus: any) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="mb-4 text-3xl font-bold">Manager Command Center</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat size={16} /> Kitchen
          </TabsTrigger>
          <TabsTrigger value="housekeeping" className="flex items-center gap-2">
            <BedSingle size={16} /> Housekeeping
          </TabsTrigger>
          <TabsTrigger value="concierge" className="flex items-center gap-2">
            <ConciergeBell size={16} /> Concierge
          </TabsTrigger>
        </TabsList>

        {['all', 'kitchen', 'housekeeping', 'concierge'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requests
                .filter((r) => (tab === 'all' ? true : r.department === tab))
                .map((req) => (
                  <Card key={req.id} className="rounded-2xl border shadow-md">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          Room {req.room}
                        </h3>
                        <Badge
                          variant={
                            req.priority === 'high'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {req.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700">{req.item}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} /> {req.time}
                      </div>

                      <div className="pt-3">
                        <Select
                          onValueChange={(value) => updateStatus(req.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={req.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RECEIVED">Received</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
