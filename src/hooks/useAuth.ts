import { useEffect, useState, useMemo } from 'react';
import { getUserSession } from '@/lib/utils/session';
import { useAppSelector } from './useStore';
import {
  selectAccessToken,
  selectPinSet,
  selectUser,
  selectUserId,
} from '@/store/reducers/auth/reducer';
import { getActiveTenant } from '@/lib/utils/RBAC';

const useAuth = () => {
  const [session, setSession] = useState(() => getUserSession());
  const accessToken = useAppSelector(selectAccessToken);
  const user = useAppSelector(selectUser);
  const pinSet = useAppSelector(selectPinSet);
  const userId = useAppSelector(selectUserId);

  useEffect(() => {
    const handleStorageChange = () => {
      setSession(getUserSession());
    };

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Polling if cookie changes happen in same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const refreshToken = session ?? '';
  const isAuth = !!user;
  const isNewUser = !!userId;
  const activeTenant = getActiveTenant(user);

  return useMemo(() => {
    return {
      accessToken,
      activeTenant,
      isAuth,
      isNewUser,
      pinSet,
      user,
      refreshToken,
    };
  }, [
    accessToken,
    activeTenant,
    isAuth,
    isNewUser,
    pinSet,
    user,
    refreshToken,
  ]);
};

export default useAuth;
