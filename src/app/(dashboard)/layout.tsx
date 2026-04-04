'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Loader } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { initializeAuth } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setIsAuthenticated(false);
      router.replace('/login');
      return;
    }

    initializeAuth();
    setIsAuthenticated(true);
  }, [initializeAuth, router]);

  // While checking auth, show loading
  if (isAuthenticated === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center gap-2'>
          <Loader className='w-8 h-8 text-blue-600 animate-spin' />
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (router is redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render dashboard
  return (
    <>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 bg-gray-50 min-h-screen'>{children}</main>
      </div>
    </>
  );
}
