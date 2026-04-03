'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { month: 'Jan', active: 45, inactive: 5 },
  { month: 'Feb', active: 52, inactive: 3 },
  { month: 'Mar', active: 58, inactive: 4 },
  { month: 'Apr', active: 65, inactive: 2 },
  { month: 'May', active: 72, inactive: 1 },
  { month: 'Jun', active: 78, inactive: 2 },
];

const departmentData = [
  { name: 'Engineering', value: 28, fill: '#3b82f6' },
  { name: 'Sales', value: 18, fill: '#8b5cf6' },
  { name: 'HR', value: 12, fill: '#ec4899' },
  { name: 'Operations', value: 15, fill: '#06b6d4' },
  { name: 'Finance', value: 7, fill: '#f59e0b' },
];

export function EmployeeGrowthChart() {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Employee Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Line type="monotone" dataKey="active" stroke="#3b82f6" name="Active" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
          <Line type="monotone" dataKey="inactive" stroke="#ef4444" name="Inactive" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentDistribution() {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Department Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={departmentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} (${value})`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttendanceChart() {
  const attendanceData = [
    { day: 'Mon', attendance: 95 },
    { day: 'Tue', attendance: 92 },
    { day: 'Wed', attendance: 88 },
    { day: 'Thu', attendance: 94 },
    { day: 'Fri', attendance: 87 },
  ];

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="attendance" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
