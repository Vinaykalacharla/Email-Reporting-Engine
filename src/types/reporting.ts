export type EngagementCategory = 'Glance' | 'Read' | 'Engaged';

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  openRate: number; // Percentage 0-100
  clickRate: number; // Percentage 0-100
  bounceRate: number; // Percentage 0-100
}

export interface TimeOnEmailData {
  category: EngagementCategory;
  percentage: number;
  count: number;
}

export interface OpenRateDataPoint {
  date: string;
  opens: number;
}

export type BounceType = 'Hard' | 'Soft';

// Specific industry reason codes as requested
export type HardBounceReason = 'Invalid Email' | "Domain doesn't exist";
export type SoftBounceReason = 'Mailbox full' | 'Temporary server issue';

export interface BounceDetail {
  id: string;
  email: string;
  type: BounceType;
  reason: HardBounceReason | SoftBounceReason;
  timestamp: string;
}

// Phase 2 Types
export interface SubjectLineVariant {
  id: string;
  subject: string;
  trafficAllocation: number; // percentage
  performanceScore: number;
}

export interface HeatmapHotspot {
  x: number; // percentage width
  y: number; // percentage height
  weight: number; // 0 to 1 intensity
  elementId?: string;
}

export interface ChurnRiskZone {
  elementId: string; // ID of the HTML element in the heatmap or coordinates bounding box
  x: number;
  y: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasoning: string; // e.g., "Rapid footer scrolling detected"
}

export interface AIStrategy {
  id: string;
  title: string;
  description: string;
}

export interface DashboardData {
  metrics: CampaignMetrics;
  timeOnEmail: TimeOnEmailData[];
  openRateTimeline: OpenRateDataPoint[];
  bounces: BounceDetail[];
  subjectLineVariants: SubjectLineVariant[];
  heatmapData: HeatmapHotspot[];
  churnRisks: ChurnRiskZone[];
  strategies: AIStrategy[];
}
