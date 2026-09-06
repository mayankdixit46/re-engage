export type BucketType = 'active' | 'at-risk' | 'inactive';

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  signupDate?: string;
  lastOpenedDate?: string;
  lastClickedDate?: string;
  openCount: number;
  clickCount: number;
  totalEmailsSent: number;
  
  // Derived / Calculated Properties
  daysSinceLastActivity: number | null; // null if never engaged
  engagementScore: number; // 0 to 100
  bucket: BucketType;
  manualOverrideBucket?: BucketType;
  rejectionReason?: string;
  originalData: Record<string, string>;
}

export interface ColumnMapping {
  email: string;
  firstName?: string;
  lastName?: string;
  signupDate?: string;
  lastOpenedDate?: string;
  lastClickedDate?: string;
  openCount?: string;
  clickCount?: string;
  totalEmailsSent?: string;
}

export interface ThresholdConfig {
  activeDays: number; // default: 90
  atRiskDays: number; // default: 180
  minOpensForActive: number; // default: 1
}

export interface BucketStats {
  total: number;
  activeCount: number;
  atRiskCount: number;
  inactiveCount: number;
  activePct: number;
  atRiskPct: number;
  inactivePct: number;
}

export interface DeliverabilityMetrics {
  before: {
    listSize: number;
    projectedOpenRate: number; // %
    projectedClickRate: number; // %
    spamRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    inboxPlacementPct: number; // %
    monthlyEspCost: number; // $
  };
  after: {
    listSize: number;
    projectedOpenRate: number; // %
    projectedClickRate: number; // %
    spamRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    inboxPlacementPct: number; // %
    monthlyEspCost: number; // $
    costSavingsMonthly: number; // $
    openRateBoostPct: number; // %
    deliverabilityBoostPct: number; // %
  };
}

export interface AiWinBackRequest {
  brandName?: string;
  industry?: string;
  tone?: 'Friendly' | 'Urgent' | 'Value-First' | 'Curiosity' | 'Incentive';
  atRiskCount: number;
  topInactivityPeriodDays: number;
  specialOffer?: string;
}

export interface AiWinBackResponse {
  subjectLines: string[];
  previewText: string;
  emailBody: string;
  callToAction: string;
  reengagementStrategyNotes: string;
}
