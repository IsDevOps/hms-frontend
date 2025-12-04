'use client';

import TopHeader from '@/components/TopHeader';
import React from 'react';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopHeader />
      {children}
    </>
  );
}
