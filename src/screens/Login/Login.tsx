'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, User } from 'lucide-react';
const Login = () => {
  const [, setAdminName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="hotel-card mx-auto max-w-md">
      <h2 className="text-foreground mb-6 text-center text-xl font-semibold">
        Your Details
      </h2>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="adminName"
            className="text-foreground text-sm font-medium"
          >
            Full Name
          </Label>
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="adminName"
              type="text"
              placeholder="John Anderson"
              //   value={admintName}
              onChange={(e) => setAdminName(e.target.value)}
              className="bg-secondary border-border h-12 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="guestEmail"
            className="text-foreground text-sm font-medium"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="guestEmail"
              type="email"
              placeholder="john@example.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="bg-secondary border-border h-12 pl-10"
            />
          </div>
          {guestEmail && !isValidEmail(guestEmail) && (
            <p className="text-destructive text-xs">
              Please enter a valid email
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
