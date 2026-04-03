'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Clock,
  ChevronDown,
  Zap,
  Settings as SettingsIcon,
} from 'lucide-react';

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Employees',
    href: '/employees',
    icon: Users,
    subItems: [
      { label: 'List', href: '/employees' },
      { label: 'Create', href: '/employees/create' },
    ],
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: Clock,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <aside className='w-64 border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen backdrop-blur-xl shadow-2xl'>
      {/* Sidebar Header */}
      <div className='p-6 border-b border-slate-700/30'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg'>
            <Zap className='text-white' size={20} />
          </div>
          <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            HR Portal
          </h1>
        </div>
        <p className='text-xs text-slate-500'>Analytics & Management</p>
      </div>

      {/* Navigation */}
      <nav className='p-4 space-y-2'>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const Icon = item.icon;

          return (
            <div key={item.href}>
              {hasSubItems ? (
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === item.href ? null : item.href)
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-slate-300 hover:bg-slate-700/40 hover:text-slate-100 border border-transparent'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300')} />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-all duration-300',
                      openMenu === item.href ? 'rotate-180' : '',
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    )}
                  />
                </button>
              ) : (
                <Link href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group cursor-pointer',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'text-slate-300 hover:bg-slate-700/40 hover:text-slate-100 border border-transparent'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300')} />
                    {item.label}
                  </div>
                </Link>
              )}

              {hasSubItems && openMenu === item.href && (
                <div className='mt-2 ml-4 space-y-1 border-l-2 border-blue-500/30 pl-4 animate-in fade-in slide-in-from-top-2'>
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href}>
                      <div
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm transition-all duration-300 group cursor-pointer',
                          pathname === subItem.href
                            ? 'bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                        )}
                      >
                        {subItem.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='absolute bottom-0 w-64 p-4 border-t border-slate-700/30 bg-gradient-to-t from-slate-900/50 to-transparent'>
        <div className='p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 backdrop-blur-xl'>
          <p className='text-xs text-slate-500 mb-2'>Version</p>
          <p className='text-sm font-semibold text-slate-200'>HR System v1.0</p>
          <p className='text-xs text-slate-500 mt-1'>Industrial Edition</p>
        </div>
      </div>
    </aside>
  );
}
