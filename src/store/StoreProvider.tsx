'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  const [persistor, setPersistor] = useState<ReturnType<
    typeof persistStore
  > | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // `setupListeners` for refetchOnFocus/refetchOnReconnect behaviors
    setupListeners(storeRef.current.dispatch);
  }

  useEffect(() => {
    const _persistor = persistStore(storeRef.current!);
    setPersistor(_persistor);
  }, []);

  if (!persistor) return null;

  return (
    <Provider store={storeRef.current}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
