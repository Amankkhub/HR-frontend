'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { employeeAPIWithFallback } from '@/lib/apiWithFallback';
import { getUserRole } from '@/lib/roleGuard';
import { Plus, Search, Users, TrendingUp, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  locationId: string;
  createdAt: string;
  status?: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check role - only ADMIN and HR can view
    const userRole = getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'HR') {
      router.push('/dashboard');
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await employeeAPIWithFallback.getAll();
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error: any) {
        console.error('Failed to fetch employees:', error?.message);
        // Don't throw error - let page continue with fallback or empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  // Handle search filtering
  useEffect(() => {
    const filtered = employees.filter((emp) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.phone.includes(searchTerm)
      );
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const SkeletonLoader = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className='border-slate-700/20'>
          <TableCell>
            <Skeleton className='h-4 w-12 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-32 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20 bg-slate-700' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const getStatusColor = (status?: string) => {
    const statusStr = String(status || '').toLowerCase();
    switch(statusStr) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'inactive':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'on-leave':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <div className='flex items-center gap-3 mb-2'>
            <Users className='text-blue-400' size={32} />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              Employee Directory
            </h1>
          </div>
          <p className='text-slate-400'>Manage and organize employee records</p>
        </div>
        <Link href='/employees/create'>
          <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 text-white border-0 shadow-lg hover:shadow-xl transition-all'>
            <Plus className='w-4 h-4' />
            Add Employee
          </Button>
        </Link>
      </div>



      {/* Stats Cards */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div className='bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-1'>Total Employees</p>
          <p className='text-2xl font-bold text-blue-400'>{employees.length}</p>
        </div>
        <div className='bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-1'>Active Today</p>
          <p className='text-2xl font-bold text-emerald-400'>{employees.length}</p>
        </div>
        <div className='bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-1'>Showing</p>
          <p className='text-2xl font-bold text-purple-400'>{filteredEmployees.length}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className='bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-600/80 shadow-2xl'>
        
        {/* Search Bar */}
        <div className='p-6 border-b border-slate-700/30'>
          <div className='flex gap-3'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-3 h-5 w-5 text-slate-500' />
              <Input
                placeholder='Search by name, email, or phone...'
                className='pl-10 bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder-slate-500 hover:border-slate-600 focus:border-blue-500 transition-colors'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant='outline' className='border-slate-700/50 text-slate-300 hover:bg-slate-700/50'>
              <Filter className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-slate-700/30 hover:bg-transparent'>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>ID</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Name</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Email</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Phone</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Department</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Location</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Joined</TableHead>
                <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonLoader />
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className='border-slate-700/20 hover:bg-slate-700/20 transition-colors'>
                    <TableCell className='font-mono text-xs text-slate-400 py-3'>{String(employee.id).slice(0, 8)}</TableCell>
                    <TableCell className='font-semibold text-slate-100 py-3'>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell className='text-slate-300 py-3 text-sm'>{employee.email}</TableCell>
                    <TableCell className='text-slate-300 py-3 text-sm'>{employee.phone}</TableCell>
                    <TableCell className='text-slate-400 py-3 text-sm'>{employee.departmentId || '-'}</TableCell>
                    <TableCell className='text-slate-400 py-3 text-sm'>{employee.locationId || '-'}</TableCell>
                    <TableCell className='text-slate-400 py-3 text-sm'>
                      {format(new Date(employee.createdAt), 'MMM dd')}
                    </TableCell>
                    <TableCell className='py-3'>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusColor(employee.status)}`}>
                        {employee.status || 'Active'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className='border-slate-700/20'>
                  <TableCell colSpan={8} className='text-center py-12'>
                    <div className='flex flex-col items-center gap-2'>
                      <Users className='text-slate-500' size={32} />
                      <p className='text-slate-400'>No employees found</p>
                      <p className='text-slate-500 text-sm'>Try adjusting your search filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Stats */}
        <div className='border-t border-slate-700/30 px-6 py-4 bg-slate-900/20 flex items-center justify-between'>
          <p className='text-sm text-slate-400'>
            Showing <span className='text-slate-200 font-semibold'>{filteredEmployees.length}</span> of <span className='text-slate-200 font-semibold'>{employees.length}</span> employees
          </p>
          <div className='flex items-center gap-2 text-xs text-slate-500'>
            <TrendingUp size={16} />
            Real-time data
          </div>
        </div>
      </div>
    </div>
  );
}
