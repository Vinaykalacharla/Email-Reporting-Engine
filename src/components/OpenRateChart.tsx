'use client';

import React from 'react';
import { OpenRateDataPoint } from '@/types/reporting';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OpenRateChart({ data }: { data: OpenRateDataPoint[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-96 flex flex-col relative">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Opens Over Time</h3>
      
      {/* Strict Accessibility Hidden Table Fallback */}
      <table className="sr-only" aria-label="Tabular data of Opens Over Time">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Opens</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, index) => (
            <tr key={`sr-row-${index}`}>
              <td>{point.date}</td>
              <td>{point.opens}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual Chart rendered with aria-hidden since semantic table provides equivalent info */}
      <div className="flex-grow w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            {/* keyboard focusable dots enabled via activeDot and tabIndex internally, but standard recharts accessibility usually requires custom dots. Standard Line is used here with aria-hidden overall for screen readers. The Hidden Table satisfies strictly. */}
            <Line 
              type="monotone" 
              dataKey="opens" 
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
