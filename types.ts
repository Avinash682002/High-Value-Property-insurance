
export enum UserRole {
  UNDERWRITER = 'UNDERWRITER',
  ADMIN_MANAGER = 'ADMIN_MANAGER',
  AGENT = 'AGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  lastActive?: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export enum CaseStatus {
  DRAFT = 'DRAFT',
  PENDING_ANALYSIS = 'PENDING_ANALYSIS',
  AI_PROCESSED = 'AI_PROCESSED',
  HUMAN_REVIEWED = 'HUMAN_REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  AUTO_FLAGGED = 'AUTO_FLAGGED'
}

export interface Guideline {
  id: string;
  name: string;
  content: string;
  version: string;
  department: string;
  effectiveDate: string;
  isActive: boolean;
  uploadedAt: string;
}

export interface PropertyCase {
  id: string;
  userId: string;
  userName: string;
  propertyType?: string;
  location?: string;
  value: number;
  yearBuilt?: number;
  constructionType?: string;
  sqft?: number;
  riskFactors: string[];
  claimNotes?: string;
  externalLinks?: string[];
  documents: { name: string; type: string; size: string }[];
  status: CaseStatus;
  analysis?: CaseAnalysis;
  humanNotes?: string;
  decisionBy?: string;
  decisionDate?: string;
  createdAt: string;
  qaSampled?: boolean;
  aiFeedback?: {
    rating: number;
    comment: string;
  };
}

export interface CaseAnalysis {
  riskScore: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number;
  dataQualityScore: number;
  
  verification: {
    verifiedSqft: number;
    countyValueMatch: boolean;
    reconciledValue: number;
    marketInsight: string;
    lastSalePrice?: number;
    lastSaleDate?: string;
    neighborhoodTrend?: string; // "Appreciating", "Stable", "Declining"
    marketVolatility?: string;
  };

  visualAudit: {
    zillowGalleryInsights: string;
    detectedFeatures: string[];
    visualMismatches: string[];
    conditionScore: number;
  };

  mapsAudit: {
    aerialInsights: string;
    fireStationDistance: string;
    hydrantDistance: string;
    nearbyExposures: string[];
    geospatialLinks: { title: string; uri: string }[];
  };

  permitsAudit?: {
    summary: string;
    recentPermits: { date: string; type: string; status: string }[];
    renovationImpactScore: number; // 0-100 impact on value/risk
  };

  hazardScore: number;
  hazardDetails: string;
  
  claimsSynthesis: {
    summary: string;
    unrepairedDamagePattern: boolean;
    totalPriorClaims: number;
  };
  
  photoAnalysis: {
    hazardsDetected: string[];
    conditionRating: string;
    featuresDetected: string[];
  };

  summary: string;
  premiumRecommendation?: number;
  redFlags: string[];
  recommendations: string[];
  guidelineCitations: { title: string; reasoning: string }[];
  aiReasoning: string;
  engine?: 'BAIC' | 'GEMINI';
}
