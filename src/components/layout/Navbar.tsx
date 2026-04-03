'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Bell, Search } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleLogout = async () => {
    logoutUser();
    logout();
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <header className='border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-lg'>
      <div className='flex items-center justify-between px-8 py-4'>
        {/* Left Section */}
        <div className='flex items-center gap-6 flex-1'>
          <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap'>
            HR Management System
          </h1>
          
          {/* Search Bar */}
          <div className='hidden md:flex flex-1 max-w-xs relative'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
            <input
              type='text'
              placeholder='Search employees...'
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm'
            />
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-4'>
          {/* Notifications */}
          <Button 
            variant='ghost' 
            size='icon' 
            className='rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all'
          >
            <Bell size={20} />
            <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full'></span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-all border border-blue-400/30 hover:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white font-semibold text-sm' type='button'>
              AD
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align='end' 
              className='w-60 bg-slate-800/95 border border-slate-700/50 backdrop-blur-xl rounded-lg shadow-2xl'
            >
              <div className='px-4 py-3 border-b border-slate-700/30'>
                <p className='text-sm font-semibold text-slate-100'>Admin User</p>
                <p className='text-xs text-slate-400'>admin@example.com</p>
              </div>
              
              <DropdownMenuItem 
                onClick={handleSettings}
                className='text-slate-200 hover:bg-slate-700/50 hover:text-slate-100 cursor-pointer'
              >
                <Settings className='h-4 w-4 mr-2' />
                <span>Settings & Preferences</span>
              </DropdownMenuItem>

              <div className='border-t border-slate-700/30 my-1'></div>

              <DropdownMenuItem 
                onClick={handleLogout} 
                className='text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer'
              >
                <LogOut className='h-4 w-4 mr-2' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Bar */}
      <div className='hidden sm:block border-t border-slate-700/30 bg-slate-900/30 px-8 py-2'>
        <div className='flex items-center justify-between text-xs text-slate-400'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
              <span>System Status: Operational</span>
            </div>
          </div>
          <div className='text-slate-500'>
            Last sync: Just now
          </div>
        </div>
      </div>
    </header>
  );
}
