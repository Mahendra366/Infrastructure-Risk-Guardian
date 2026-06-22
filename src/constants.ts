import { RiskItem, Likelihood, Impact, RiskLevel } from './types';

export const INITIAL_RISKS: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Server Downtime',
    category: 'Server',
    likelihood: Likelihood.High,
    impact: Impact.High,
    rpn: 9,
    level: RiskLevel.Critical,
    status: 'Critical',
    mitigation: 'Regular maintenance and monitoring, automated failover systems.',
    beforeScore: 9,
    afterScore: 4
  },
  {
    id: 'risk-2',
    title: 'Cooling System Failure',
    category: 'Cooling',
    likelihood: Likelihood.Medium,
    impact: Impact.High,
    rpn: 6,
    level: RiskLevel.High,
    status: 'Warning',
    mitigation: 'Redundant cooling units, continuous temperature monitoring.',
    beforeScore: 8,
    afterScore: 3
  },
  {
    id: 'risk-3',
    title: 'Power Supply Interruption',
    category: 'Power',
    likelihood: Likelihood.High,
    impact: Impact.VeryHigh,
    rpn: 12,
    level: RiskLevel.Critical,
    status: 'Critical',
    mitigation: 'Backup generators, UPS systems, dual-feed power architecture.',
    beforeScore: 10,
    afterScore: 4
  }
];

export const INFRA_STATS = [
  { label: 'Ambient Temperature', value: 22.4, unit: '°C', trend: 'stable', status: 'good' },
  { label: 'Power Load', value: 84, unit: '%', trend: 'up', status: 'warning' },
  { label: 'UPS Battery', value: 98, unit: '%', trend: 'stable', status: 'good' },
  { label: 'Server Availability', value: 99.99, unit: '%', trend: 'stable', status: 'good' }
];
