'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { attendanceAPIWithFallback } from '@/lib/apiWithFallback';
import { Plus, Clock, TrendingUp, Calendar } from 'lucide-react';
import AttendanceForm from '@/components/forms/AttendanceForm';
import CheckInOut from '@/components/attendance/CheckInOut';
import { DepartmentAttendanceChart, AttendanceTrendChart } from '@/components/charts/AttendanceStats';
import { format } from 'date-fns';

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPIWithFallback.getAll();
      setAttendance(response.data);
    } catch (error: any) {
      console.error('Failed to fetch attendance:', error?.message);
      // Don't throw error - let page continue with empty state or fallback data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchAttendance();
  }, [router]);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchAttendance();
  };

  const SkeletonLoader = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <TableRow key={i} className='border-slate-700/20'>
          <TableCell>
            <Skeleton className='h-4 w-12 bg-slate-700' />
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
          <TableCell>
            <Skeleton className='h-4 w-20 bg-slate-700' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20 bg-slate-700' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter(a => a.date.startsWith(today));
    return {
      total: todayRecords.length,
      checkedIn: todayRecords.filter(a => a.checkIn).length,
      checkedOut: todayRecords.filter(a => a.checkOut).length,
    };
  };

  const calculateAvgHours = () => {
    if (attendance.length === 0) return '0h 0m';
    
    let totalHours = 0;
    let recordsWithHours = 0;
    
    attendance.forEach(record => {
      if (record.checkIn && record.checkOut) {
        try {
          const [inHour, inMin] = record.checkIn.split(':').map(Number);
          const [outHour, outMin] = record.checkOut.split(':').map(Number);
          
          const inMinutes = inHour * 60 + inMin;
          const outMinutes = outHour * 60 + outMin;
          const hours = (outMinutes - inMinutes) / 60;
          
          totalHours += Math.max(0, hours);
          recordsWithHours++;
        } catch (e) {
          // Skip invalid time formats
        }
      }
    });
    
    const avgHours = recordsWithHours > 0 ? Math.floor(totalHours / recordsWithHours) : 0;
    const avgMinutes = recordsWithHours > 0 ? Math.round((totalHours / recordsWithHours - avgHours) * 60) : 0;
    
    return `${avgHours}h ${avgMinutes}m`;
  };

  const stats = getTodayStats();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <div className='flex items-center gap-3 mb-2'>
            <Clock className='text-emerald-400' size={32} />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
              Attendance Tracker
            </h1>
          </div>
          <p className='text-slate-400'>Real-time employee attendance and analytics</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className='bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 gap-2 text-white border-0 shadow-lg hover:shadow-xl transition-all'
        >
          <Plus className='w-4 h-4' />
          Record Attendance
        </Button>
      </div>



      {/* KPI Cards */}
      <div className='grid grid-cols-4 gap-4 mb-8'>
        <div className='bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-6 rounded-xl border border-emerald-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-2'>Today Checked In</p>
          <p className='text-3xl font-bold text-emerald-400'>{stats.checkedIn}</p>
          <p className='text-xs text-slate-500 mt-2'>Current session</p>
        </div>
        
        <div className='bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-xl border border-blue-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-2'>Total Records Today</p>
          <p className='text-3xl font-bold text-blue-400'>{stats.total}</p>
          <p className='text-xs text-slate-500 mt-2'>Updated now</p>
        </div>

        <div className='bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-xl border border-purple-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-2'>Checked Out</p>
          <p className='text-3xl font-bold text-purple-400'>{stats.checkedOut}</p>
          <p className='text-xs text-slate-500 mt-2'>End of shift</p>
        </div>

        <div className='bg-gradient-to-br from-amber-900/30 to-amber-800/30 p-6 rounded-xl border border-amber-700/50 backdrop-blur-xl'>
          <p className='text-slate-400 text-sm mb-2'>Avg. Hours</p>
          <p className='text-3xl font-bold text-amber-400'>{calculateAvgHours()}</p>
          <p className='text-xs text-slate-500 mt-2'>Per employee</p>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <AttendanceTrendChart />
        <DepartmentAttendanceChart />
      </div>

      {/* Quick Check In/Out */}
      <div className='mb-8'>
        <CheckInOut onCheckInSuccess={handleSuccess} onCheckOutSuccess={handleSuccess} />
      </div>

      {/* Tabs Section */}
      <div className='bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-xl overflow-hidden shadow-2xl'>
        <Tabs defaultValue='records' className='w-full'>
          <TabsList className='w-full bg-slate-900/50 border-b border-slate-700/30 rounded-none p-0'>
            <TabsTrigger value='records' className='rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-slate-800/50'>
              <Calendar className='w-4 h-4 mr-2' />
              Attendance Records
            </TabsTrigger>
            <TabsTrigger value='form' className='rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-slate-800/50'>
              <Plus className='w-4 h-4 mr-2' />
              Add Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value='records' className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-slate-700/30 hover:bg-transparent'>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>ID</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Employee</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Date</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Check In</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Check Out</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Duration</TableHead>
                    <TableHead className='font-semibold text-slate-300 bg-slate-900/30'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : attendance.length > 0 ? (
                    attendance.map((record) => {
                      const duration =
                        record.checkOut && record.checkIn
                          ? calculateDuration(record.checkIn, record.checkOut)
                          : '-';
                      
                      const isOnTime = record.checkIn && parseInt(record.checkIn) <= 9;

                      return (
                        <TableRow key={record.id} className='border-slate-700/20 hover:bg-slate-700/20 transition-colors'>
                          <TableCell className='font-mono text-xs text-slate-400 py-3'>
                            {String(record.id).slice(0, 8)}
                          </TableCell>
                          <TableCell className='font-semibold text-slate-100 py-3'>
                            {record.employeeId}
                          </TableCell>
                          <TableCell className='text-slate-300 py-3 text-sm'>
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className='text-slate-300 py-3 text-sm font-mono'>
                            {record.checkIn || '-'}
                          </TableCell>
                          <TableCell className='text-slate-300 py-3 text-sm font-mono'>
                            {record.checkOut || '-'}
                          </TableCell>
                          <TableCell className='py-3'>
                            <span className='inline-flex items-center rounded-full bg-cyan-500/20 text-cyan-300 px-3 py-1 text-xs font-medium border border-cyan-500/30'>
                              {duration}
                            </span>
                          </TableCell>
                          <TableCell className='py-3'>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                              isOnTime 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}>
                              {isOnTime ? 'On Time' : 'Late'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className='border-slate-700/20'>
                      <TableCell colSpan={7} className='text-center py-12'>
                        <div className='flex flex-col items-center gap-2'>
                          <Clock className='text-slate-500' size={32} />
                          <p className='text-slate-400'>No attendance records found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className='border-t border-slate-700/30 px-6 py-4 bg-slate-900/20 flex items-center justify-between text-sm'>
              <p className='text-slate-400'>
                Total records: <span className='text-slate-200 font-semibold'>{attendance.length}</span>
              </p>
              <div className='flex items-center gap-2 text-slate-500'>
                <TrendingUp size={16} />
                Live tracking enabled
              </div>
            </div>
          </TabsContent>

          <TabsContent value='form' className='p-6'>
            <AttendanceForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function calculateDuration(checkIn: string, checkOut: string): string {
  try {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);

    let hours = outH - inH;
    let minutes = outM - inM;

    if (minutes < 0) {
      hours--;
      minutes += 60;
    }

    return `${hours}h ${minutes}m`;
  } catch {
    return '-';
  }
}
