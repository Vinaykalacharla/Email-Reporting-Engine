import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@/types/reporting';

const MOCK_DATA: DashboardData = {
  metrics: {
    sent: 125000,
    delivered: 122500,
    openRate: 48.2,
    clickRate: 12.5,
    bounceRate: 2.3, // > 2% to test High Risk UI safely
  },
  timeOnEmail: [
    { category: 'Glance', percentage: 20, count: 24500 },
    { category: 'Read', percentage: 35, count: 42875 },
    { category: 'Engaged', percentage: 45, count: 55125 },
  ],
  openRateTimeline: Array.from({ length: 24 }, (_, i) => ({
    date: `${i.toString().padStart(2, '0')}:00`,
    opens: Math.floor(Math.random() * 5000) + 1000,
  })),
  bounces: [
    { id: '1', email: 'user1@invalid.com', type: 'Hard', reason: 'Invalid Email', timestamp: '2023-10-27T10:00:00Z' },
    { id: '2', email: 'user2@nowhere.org', type: 'Hard', reason: "Domain doesn't exist", timestamp: '2023-10-27T10:05:00Z' },
    { id: '3', email: 'user3@fullbox.com', type: 'Soft', reason: 'Mailbox full', timestamp: '2023-10-27T10:15:00Z' },
    { id: '4', email: 'user4@temp.net', type: 'Soft', reason: 'Temporary server issue', timestamp: '2023-10-27T10:30:00Z' },
  ],
  subjectLineVariants: [
    { id: 'v1', subject: 'Unlock Your Exclusive Benefits Today', trafficAllocation: 30, performanceScore: 78 },
    { id: 'v2', subject: 'Your Exclusive Benefits Are Inside', trafficAllocation: 55, performanceScore: 92 },
    { id: 'v3', subject: 'Benefits Unlocked: Action Required', trafficAllocation: 15, performanceScore: 45 },
  ],
  heatmapData: [
    { x: 50, y: 20, weight: 0.9, elementId: 'header-cta' },
    { x: 30, y: 60, weight: 0.5, elementId: 'product-image-1' },
    { x: 70, y: 60, weight: 0.7, elementId: 'product-image-2' },
    { x: 50, y: 90, weight: 0.3, elementId: 'footer-link' },
  ],
  churnRisks: [
    {
      elementId: 'footer-link',
      x: 50,
      y: 90,
      riskLevel: 'High',
      reasoning: 'Rapid footer scrolling and immediate click on "Unsubscribe" bounding area detected.',
    },
    {
      elementId: 'header-cta',
      x: 50,
      y: 20,
      riskLevel: 'Low',
      reasoning: 'Normal engagement pattern, standard read time before interaction.',
    }
  ],
  strategies: [
    { id: 's1', title: 'Shift Traffic to Variant 2', description: 'Variant 2 ("...Are Inside") is outperforming by 22% in open rate. Recommend increasing traffic allocation to 80%.' },
    { id: 's2', title: 'Optimize Hero CTA', description: 'Heatmap shows 45% of users dropping off right after the hero image. Consider moving the CTA above the fold.' },
    { id: 's3', title: 'Address Soft Bounces', description: 'Spike in "Temporary server issue" soft bounces detected at 10:30 AM. Recommend staggering send times to avoid provider throttling.' }
  ]
};

// Simulate API fetch delay
const fetchDashboardData = async (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 800); // 800ms simulation
  });
};

export const useCampaignData = () => {
  return useQuery({
    queryKey: ['campaignData'],
    queryFn: fetchDashboardData,
    refetchInterval: 15000, // Poll every 15 seconds to simulate real-time updates
  });
};
