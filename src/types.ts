/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  name: string;
  serviceNo: string;
  vertical: string;
  designation?: string;
}

export interface TrainingRecord {
  id: string;
  employeeName: string;
  serviceNo: string;
  vertical: string;
  category: string; // 'Fundamental', 'Category B', 'Category C', 'Category D', etc.
  code: string;
  title: string;
  status: string; // 'Pass', 'Fail', 'Withdrawn'
}

export interface CategoryAData {
  serviceNo: string;
  completedCount: number;
  source: 'import' | 'manual';
}

export interface ManualOverride {
  serviceNo: string;
  category: 'Fundamental' | 'Category A' | 'Category B' | 'Category C' | 'Category D';
  completedCount: number;
}

export interface CompliancePolicy {
  Fundamental: number;
  CategoryA: number;
  CategoryB: number;
  CategoryC: number;
  CategoryD: number;
}

export interface EmployeeCompliance {
  employeeName: string;
  serviceNo: string;
  vertical: string;
  designation?: string;
  
  fundamentalPassed: number;
  fundamentalRequired: number;
  fundamentalRemaining: number;
  fundamentalCompliance: number;
  fundamentalOverridden?: boolean;

  categoryAPassed: number;
  categoryARequired: number;
  categoryARemaining: number;
  categoryACompliance: number;
  categoryAOverridden?: boolean;

  categoryBPassed: number;
  categoryBRequired: number;
  categoryBRemaining: number;
  categoryBCompliance: number;
  categoryBOverridden?: boolean;

  categoryCPassed: number;
  categoryCRequired: number;
  categoryCRemaining: number;
  categoryCCompliance: number;
  categoryCOverridden?: boolean;

  categoryDPassed: number;
  categoryDRequired: number;
  categoryDRemaining: number;
  categoryDCompliance: number;
  categoryDOverridden?: boolean;

  totalPassed: number;
  totalRequired: number;
  overallCompliance: number; // percentage
  status: 'Compliant' | 'Non-Compliant';
}

export interface ValidationLog {
  id: string;
  rowNum?: number;
  fileName?: string;
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  value?: string;
}

export interface VerticalSummary {
  vertical: string;
  employeeCount: number;
  avgCompliance: number;
  fundamentalCompliance: number;
  categoryACompliance: number;
  categoryBCompliance: number;
  categoryCCompliance: number;
  categoryDCompliance: number;
}

export interface CategorySummary {
  categoryName: string;
  passedCount: number;
  requiredTotal: number;
  avgCompliance: number;
}
