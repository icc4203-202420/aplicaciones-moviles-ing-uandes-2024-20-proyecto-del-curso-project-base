import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useProtectedRoute() {
  const { isAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuth && !inAuthGroup) {
      console.log(isAuth, inAuthGroup);
      router.replace('/login');
    } else if (isAuth && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuth, segments]);
}