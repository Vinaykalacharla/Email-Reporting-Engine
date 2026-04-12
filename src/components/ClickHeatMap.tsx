'use client';

import React, { useState } from 'react';
import { HeatmapHotspot, ChurnRiskZone } from '@/types/reporting';
import { Switch } from '@radix-ui/react-switch';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ClickHeatMapProps {
  hotspots: HeatmapHotspot[];
  churnRisks: ChurnRiskZone[];
}

export default function ClickHeatMap({ hotspots, churnRisks }: ClickHeatMapProps) {
  const [showChurnRisk, setShowChurnRisk] = useState(false);

  // Color-blind safe scale (Blue to Orange)
  const getHeatmapColor = (weight: number) => {
    if (weight > 0.8) return 'rgba(230, 85, 13, 0.7)'; // Deep Orange
    if (weight > 0.5) return 'rgba(253, 141, 60, 0.6)'; // Orange
    if (weight > 0.3) return 'rgba(253, 190, 133, 0.5)'; // Light Orange
    return 'rgba(49, 130, 189, 0.4)'; // Blue (coolest)
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Engagement Heatmap</h3>
          <p className="text-sm text-slate-500">Visual click tracking across template</p>
        </div>
        
        {/* Toggle Churn Risk AI Overlay */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <label htmlFor="churn-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
            <span className="sr-only">Toggle Predictive Churn Risk Overlay</span>
            AI Churn Risk
            <AccessibleIcon.Root label="AI analyzes user flows to predict unsubscribe intent.">
              <Info className="w-4 h-4 text-slate-400" />
            </AccessibleIcon.Root>
          </label>
          <button
            id="churn-toggle"
            role="switch"
            aria-checked={showChurnRisk}
            onClick={() => setShowChurnRisk(!showChurnRisk)}
            className={clsx(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none",
              showChurnRisk ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
            )}
          >
            <span
              className={clsx(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                showChurnRisk ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      <div className="relative flex-grow min-h-[400px] bg-slate-100 dark:bg-slate-800/50 p-6 flex justify-center items-center">
        {/* Mock Email Template Wrapper */}
        <div 
          className="relative w-full max-w-sm aspect-[1/1.5] bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden"
          role="img" 
          aria-label="Email preview template with overlay data"
        >
          {/* Wireframe Mock content */}
          <div className="w-full h-32 bg-slate-100 flex items-center justify-center">Hero Image</div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
             <div className="text-xs text-slate-400">Unsubscribe</div>
          </div>

          {/* Heatmap Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {hotspots.map((spot, i) => (
              <circle
                key={`spot-${i}`}
                cx={`${spot.x}%`}
                cy={`${spot.y}%`}
                r={20 + spot.weight * 20}
                fill={getHeatmapColor(spot.weight)}
                style={{ filter: 'blur(8px)' }}
              />
            ))}
          </svg>

          {/* Accessible data nodes (invisible, focusable for screen readers) */}
          <div className="sr-only">
            <h4>Heatmap Data Points</h4>
            <ul>
              {hotspots.map((spot, i) => (
                <li key={`sr-spot-${i}`}>
                  Hotspot at {spot.x}% across, {spot.y}% down. Intensity weight: {Math.round(spot.weight * 100)}%. Element context: {spot.elementId}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Churn Risk Overlay */}
          {showChurnRisk && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {churnRisks.map((risk, i) => (
                <motion.div
                  key={`risk-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={clsx(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 p-2 bg-white/90 shadow-xl flex items-center justify-center pointer-events-auto",
                    risk.riskLevel === 'High' ? 'border-orange-500 text-orange-600' : 'border-blue-400 text-blue-600'
                  )}
                  style={{ left: `${risk.x}%`, top: `${risk.y}%` }}
                >
                  <AlertTriangle className="w-5 h-5 absolute -top-3 -right-3 bg-white rounded-full text-orange-600" />
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-orange-500 animate-[spin_10s_linear_infinite] absolute mix-blend-multiply opacity-50" />
                  
                  {/* Tooltip trigger or visible text. For simplicity using sr-only for reader and pulsing dot for visuals */}
                  <span className="sr-only">AI Prediction: {risk.riskLevel} Churn Risk. {risk.reasoning}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
