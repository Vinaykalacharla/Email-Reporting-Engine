'use client';

import React, { useState } from 'react';
import { CampaignMetrics, TimeOnEmailData, BounceDetail } from '@/types/reporting';
import { Mail, Send, Eye, MousePointerClick, Download, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import clsx from 'clsx';

export const CampaignSummaryCard = ({ metrics }: { metrics: CampaignMetrics }) => {
  const isBounceHighRisk = metrics.bounceRate > 2.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {[
        { title: 'Sent', value: metrics.sent.toLocaleString(), icon: Send, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
        { title: 'Delivered', value: metrics.delivered.toLocaleString(), icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
        { title: 'Open Rate', value: `${metrics.openRate}%`, icon: Eye, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/40' },
        { title: 'Click Rate', value: `${metrics.clickRate}%`, icon: MousePointerClick, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/40' }
      ].map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 ring-blue-500">
          <div className="flex items-center gap-4">
            <div className={clsx("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* WCAG 2.1 AA Compliant Bounce Rate Summary Card */}
      <div 
        role="group" 
        aria-label="Bounce Rate Summary" 
        className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 focus-within:ring-2 ring-blue-500"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600">
            <Activity className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">Bounce Rate</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.bounceRate}%</p>
          </div>
        </div>
        
        {/* Industry Standard Conditional Status Badge with explicit Text + Icon for A11y */}
        <div className="mt-3">
          {isBounceHighRisk ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>High Risk (&gt;2%)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Healthy (&lt;2%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TimeOnEmailWidget = ({ data }: { data: TimeOnEmailData[] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Time on Email</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
              <span className="text-slate-500">{item.percentage}% ({item.count.toLocaleString()})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className={clsx(
                  "h-2 rounded-full",
                  item.category === 'Engaged' ? 'bg-emerald-500' :
                  item.category === 'Read' ? 'bg-blue-500' : 'bg-orange-400'
                )} 
                style={{ width: `${item.percentage}%` }}
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.category} engagement`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BounceDetailTable = ({ bounces }: { bounces: BounceDetail[] }) => {
  const [sortKey, setSortKey] = useState<keyof BounceDetail>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc');

  const sortedBounces = [...bounces].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof BounceDetail) => {
    let order: 'asc'|'desc' = 'asc';
    if (sortKey === key && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Bounce Analysis</h3>
      <table className="w-full text-left border-collapse" aria-label="Bounce Details">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {['Email', 'Type', 'Reason', 'Timestamp'].map((header) => {
              const key = header.toLowerCase() as keyof BounceDetail;
              return (
                <th key={key} className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <button 
                    onClick={() => requestSort(key)}
                    className="flex justify-between items-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={`Sort by ${header} ${sortKey === key && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    {header}
                    {sortKey === key && (
                      <span className="ml-1 text-xs">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedBounces.map((bounce) => (
            <tr key={bounce.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="p-3 text-sm text-slate-900 dark:text-slate-300">{bounce.email}</td>
              <td className="p-3 text-sm">
                <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", bounce.type === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')}>
                  {bounce.type}
                </span>
              </td>
              <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{bounce.reason}</td>
              <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{new Date(bounce.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const ExportButton = () => {
  return (
    <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-colors shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
      <Download className="w-4 h-4" aria-hidden="true" />
      Export CSV
    </button>
  );
}
