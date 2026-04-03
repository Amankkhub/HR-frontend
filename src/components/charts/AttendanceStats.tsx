'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function AttendanceTrendChart() {
  const trendData = [
    { week: 'Week 1', present: 145, absent: 5, late: 8 },
    { week: 'Week 2', present: 148, absent: 3, late: 5 },
    { week: 'Week 3', present: 150, absent: 4, late: 6 },
    { week: 'Week 4', present: 152, absent: 2, late: 4 },
  ];

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Monthly Attendance Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Area type="monotone" dataKey="present" stackId="1" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPresent)" name="Present" />
          <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentAttendanceChart() {
  const deptData = [
    { dept: 'Engineering', attendance: 98 },
    { dept: 'Sales', attendance: 92 },
    { dept: 'HR', attendance: 96 },
    { dept: 'Operations', attendance: 94 },
    { dept: 'Finance', attendance: 97 },
  ];

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Department Attendance Rate</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={deptData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
