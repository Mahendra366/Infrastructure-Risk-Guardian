/**
 * Risk Assessment Data Model based on ISO 31000
 */

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum Likelihood {
  Low = 1,
  Medium = 2,
  High = 3
}

export enum Impact {
  Low = 1,
  Medium = 2,
  High = 3,
  VeryHigh = 4
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Server' | 'Cooling' | 'Power' | 'Security';
  likelihood: Likelihood;
  impact: Impact;
  rpn: number; // Likelihood * Impact
  level: RiskLevel;
  status: 'Critical' | 'Warning' | 'Healthy';
  mitigation: string;
  beforeScore: number;
  afterScore: number;
}

export interface InfrastructureStatus {
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'error';
}
