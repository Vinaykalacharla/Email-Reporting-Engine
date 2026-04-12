'use client';

import React from 'react';
import { useCampaignData } from '@/hooks/useCampaignData';
import { CampaignSummaryCard, TimeOnEmailWidget, BounceDetailTable, ExportButton } from '@/components/DashboardWidgets';
import OpenRateChart from '@/components/OpenRateChart';
import ClickHeatMap from '@/components/ClickHeatMap';
import AnalyticsBot from '@/components/AnalyticsBot';
import SubjectLineOptimizer from '@/components/SubjectLineOptimizer';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, error } = useCampaignData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-label="Loading dashboard data" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
          <AlertTriangle className="w-5 h-5" id="error-icon" />
          <p aria-describedby="error-icon" role="alert">Failed to load campaign data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded z-50">
        Skip to main content
      </a>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campaign Analytics</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance dashboard</p>
            </div>
            <ExportButton />
          </header>

          <main id="main-content" className="space-y-8 focus:outline-none" tabIndex={-1}>
            
            {/* Phase 1: Core Summary Widgets */}
            <section aria-label="Campaign Overview">
              <CampaignSummaryCard metrics={data.metrics} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart Column */}
              <div className="lg:col-span-2 space-y-6">
                <section aria-label="Opens Over Time">
                   <OpenRateChart data={data.openRateTimeline} />
                </section>
                <section aria-label="Bounce Details">
                   <BounceDetailTable bounces={data.bounces} />
                </section>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <section aria-label="Time on Email">
                   <TimeOnEmailWidget data={data.timeOnEmail} />
                </section>
                <section aria-label="AI Subject Line Optimizer">
                   <SubjectLineOptimizer variants={data.subjectLineVariants} />
                </section>
              </div>
            </div>

            {/* Interaction Heatmap */}
            <section aria-label="Template Click Heatmap with Churn Risks">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClickHeatMap hotspots={data.heatmapData} churnRisks={data.churnRisks} />
                
                {/* Info Panel for Heatmap context (mocking remaining layout balance) */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-center text-center items-center">
                  <h3 className="text-xl font-bold mb-2">Analyzing Interaction</h3>
                  <p className="text-slate-500 max-w-sm mb-6">Our predictive models map visual attention over the DOM elements, calculating localized drop-off and unsubscribe probability within 500ms of scrolling.</p>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Phase 2: AI Analytics Bot */}
      <AnalyticsBot strategies={data.strategies} />
    </>
  );
}
