'use client';

import React from 'react';
import { SubjectLineVariant } from '@/types/reporting';
import { GitBranch, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectLineOptimizer({ variants }: { variants: SubjectLineVariant[] }) {
  // Find top performer for visual highlighting
  const topVariant = [...variants].sort((a, b) => b.performanceScore - a.performanceScore)[0];

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-blue-900 border border-indigo-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 text-indigo-500/20">
        <GitBranch className="w-64 h-64" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
            <Activity className="w-5 h-5 text-indigo-300" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Subject Line AI Optimizer</h3>
            <p className="text-sm text-indigo-200/80">Multi-Armed Bandit live traffic routing</p>
          </div>
        </div>

        <div className="space-y-4">
          {variants.map((v) => {
            const isTop = v.id === topVariant.id;
            return (
              <div 
                key={v.id} 
                className={`p-4 rounded-lg border ${isTop ? 'bg-indigo-600/40 border-indigo-400' : 'bg-indigo-900/40 border-indigo-800'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="max-w-[70%]">
                    <p className="text-sm font-medium text-white break-words">"{v.subject}"</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-200 mb-1">Traffic</p>
                    <p className="font-bold text-lg">{v.trafficAllocation}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-grow bg-indigo-950 rounded-full h-1.5 overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${v.performanceScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${isTop ? 'bg-emerald-400' : 'bg-indigo-300'}`}
                      role="progressbar"
                      aria-valuenow={v.performanceScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Performance score for variant: ${v.subject}`}
                    />
                  </div>
                  <span className="text-xs text-indigo-200 w-16 text-right">Score: {v.performanceScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
