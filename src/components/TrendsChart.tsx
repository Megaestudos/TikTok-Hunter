"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Seg', viral: 400, eng: 240 },
  { name: 'Ter', viral: 300, eng: 139 },
  { name: 'Qua', viral: 200, eng: 980 },
  { name: 'Qui', viral: 278, eng: 390 },
  { name: 'Sex', viral: 189, eng: 480 },
  { name: 'Sáb', viral: 239, eng: 380 },
  { name: 'Dom', viral: 349, eng: 430 },
];

export function TrendsChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 10 }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#121212', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#FAFAFA' }}
          />
          <Area 
            type="monotone" 
            dataKey="viral" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViral)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
