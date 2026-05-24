"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Seg', viral: 400, eng: 240, sales: 120 },
  { name: 'Ter', viral: 300, eng: 139, sales: 90 },
  { name: 'Qua', viral: 600, eng: 980, sales: 300 },
  { name: 'Qui', viral: 800, eng: 1200, sales: 450 },
  { name: 'Sex', viral: 1200, eng: 1800, sales: 700 },
  { name: 'Sáb', viral: 2100, eng: 3200, sales: 1100 },
  { name: 'Dom', viral: 1800, eng: 2800, sales: 900 },
];

export function TrendsChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 11, fontWeight: 500 }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.95)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              fontSize: '12px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ padding: '2px 0' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="eng" 
            name="Engajamento"
            stroke="#ec4899" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1} 
            fill="url(#colorEng)" 
          />
          <Area 
            type="monotone" 
            dataKey="viral" 
            name="Viralização"
            stroke="#8B5CF6" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorViral)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
