/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrainingRecord, CategoryAData, CompliancePolicy } from './types';

export const DEFAULT_COMPLIANCE_POLICY: CompliancePolicy = {
  Fundamental: 6,
  CategoryA: 4,
  CategoryB: 5,
  CategoryC: 8,
  CategoryD: 3
};

export const DEFAULT_DESIGNATION_POLICIES: { 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy } = {
  'Assistant Manager': {
    Fundamental: 5,
    CategoryA: 3,
    CategoryB: 4,
    CategoryC: 6,
    CategoryD: 2
  },
  'Manager': {
    Fundamental: 6,
    CategoryA: 4,
    CategoryB: 5,
    CategoryC: 8,
    CategoryD: 3
  }
};

export const INITIAL_VERTICALS = [
  'Digital Solutions',
  'Cloud Infrastructure',
  'Talent & HRD',
  'Financial Services',
  'Customer Experience',
  'Operations'
];

export const INITIAL_CATEGORY_A_RECORDS: CategoryAData[] = [
  { serviceNo: 'EMP1001', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1002', completedCount: 3, source: 'import' },
  { serviceNo: 'EMP1003', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1004', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1005', completedCount: 2, source: 'import' },
  { serviceNo: 'EMP1006', completedCount: 0, source: 'import' },
  { serviceNo: 'EMP1007', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1008', completedCount: 1, source: 'import' },
  { serviceNo: 'EMP1009', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1010', completedCount: 2, source: 'import' },
  { serviceNo: 'EMP1011', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1012', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1013', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1014', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1015', completedCount: 1, source: 'import' },
  { serviceNo: 'EMP1016', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1017', completedCount: 0, source: 'import' },
  { serviceNo: 'EMP1018', completedCount: 3, source: 'import' },
  { serviceNo: 'EMP1019', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1020', completedCount: 4, source: 'import' },
  { serviceNo: 'EMP1021', completedCount: 2, source: 'import' },
  { serviceNo: 'EMP1022', completedCount: 4, source: 'import' },
  // EMP1023 is deliberately missing to test "Missing Category A data report"
  // EMP1024 is deliberately missing
  // EMP1025 has zero
];

export const INITIAL_EMPLOYEES = [
  { name: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', designation: 'Assistant Manager' },
  { name: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', designation: 'Manager' },
  { name: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', designation: 'Assistant Manager' },
  { name: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', designation: 'Manager' },
  { name: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', designation: 'Assistant Manager' },
  { name: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', designation: 'Manager' },
  { name: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', designation: 'Assistant Manager' },
  { name: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', designation: 'Manager' },
  { name: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', designation: 'Assistant Manager' },
  { name: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', designation: 'Manager' },
  { name: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', designation: 'Assistant Manager' },
  { name: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', designation: 'Manager' },
  { name: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', designation: 'Assistant Manager' },
  { name: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', designation: 'Manager' },
  { name: 'Oscar Wilde', serviceNo: 'EMP1015', vertical: 'Talent & HRD', designation: 'Assistant Manager' },
  { name: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', designation: 'Manager' },
  { name: 'Quentin Tarantino', serviceNo: 'EMP1017', vertical: 'Customer Experience', designation: 'Assistant Manager' },
  { name: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', designation: 'Manager' },
  { name: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', designation: 'Assistant Manager' },
  { name: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', designation: 'Manager' },
  { name: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', designation: 'Assistant Manager' },
  { name: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', designation: 'Manager' },
  { name: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', designation: 'Assistant Manager' },
  { name: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', designation: 'Manager' },
  { name: 'Yolanda Adams', serviceNo: 'EMP1025', vertical: 'Digital Solutions', designation: 'Assistant Manager' }
];

// Helper to generate a unique ID
let recordIdCounter = 1;
const nextId = () => `TR_${String(recordIdCounter++).padStart(5, '0')}`;

export const INITIAL_TRAINING_RECORDS: TrainingRecord[] = [
  // EMP1001: Aaliyah Vance - Compliant with all policies (Fundamental: 6, B: 5, C: 8, D: 3, A: 4 from Cat A list)
  // Fundamental (Passed: 7)
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-007', title: 'Anti-Bribery and Corruption', status: 'Pass' },
  // Duplicate record for FUN-001 to test duplicate rule
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  // Fail record to test ignoring fails
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-008', title: 'Advanced Cybersecurity', status: 'Fail' },
  // Withdrawn record to test ignoring withdrawns
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-009', title: 'First Aid Training', status: 'Withdrawn' },
  
  // Category B (Passed: 5)
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },

  // Category C (Passed: 8)
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },

  // Category D (Passed: 3)
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Aaliyah Vance', serviceNo: 'EMP1001', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1002: Benjamin Carter - Compliance: Partially Compliant
  // Fundamental (Passed: 5, Required: 6) - Missing 1
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  // Category B (Passed: 4, Required: 5)
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  // Category C (Passed: 8, Required: 8)
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (Passed: 2, Required: 3)
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Benjamin Carter', serviceNo: 'EMP1002', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },


  // EMP1003: Clara Oswald - Compliant with all policies (Fundamental: 6, B: 5, C: 8, D: 3, A: 4 from Cat A list)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Clara Oswald', serviceNo: 'EMP1003', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1004: Devon Miller - Compliant
  // Fundamental (6)
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Devon Miller', serviceNo: 'EMP1004', vertical: 'Financial Services', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1005: Elena Rostova - Non-compliant (Category A: 2 of 4)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Elena Rostova', serviceNo: 'EMP1005', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1006: Farhan Qureshi - Non-compliant (Category A: 0 of 4)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (4)
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Farhan Qureshi', serviceNo: 'EMP1006', vertical: 'Operations', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },


  // EMP1007: Gavin Belson - Compliant (100%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Gavin Belson', serviceNo: 'EMP1007', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1008: Helena Bonham - Partially Compliant (<90%)
  // Fundamental (4)
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  // Category B (3)
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Helena Bonham', serviceNo: 'EMP1008', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },


  // EMP1009: Ian Malcolm - Compliant (100%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Ian Malcolm', serviceNo: 'EMP1009', vertical: 'Talent & HRD', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1010: Julia Roberts - Partially Compliant (Category A: 2 of 4)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (4)
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Julia Roberts', serviceNo: 'EMP1010', vertical: 'Financial Services', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },


  // EMP1011: Kevin Parker - Compliant
  // Fundamental (6)
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Kevin Parker', serviceNo: 'EMP1011', vertical: 'Customer Experience', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1012: Lara Croft - Compliant
  // Fundamental (6)
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Lara Croft', serviceNo: 'EMP1012', vertical: 'Operations', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1013: Michael Scott - Partially Compliant (<90%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (2)
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  // Category C (4)
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Michael Scott', serviceNo: 'EMP1013', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },


  // EMP1014: Nadia Petrova - Compliant
  // Fundamental (6)
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Nadia Petrova', serviceNo: 'EMP1014', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1015: Oscar Wilde - Low Compliance (<60%)
  // Fundamental (3)
  { id: nextId(), employeeName: 'Oscar Wilde', serviceNo: 'EMP1015', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Oscar Wilde', serviceNo: 'EMP1015', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Oscar Wilde', serviceNo: 'EMP1015', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  // Category B (1)
  { id: nextId(), employeeName: 'Oscar Wilde', serviceNo: 'EMP1015', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },


  // EMP1016: Pam Beesly - Compliant
  // Fundamental (6)
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Pam Beesly', serviceNo: 'EMP1016', vertical: 'Financial Services', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1017: Quentin Tarantino - Low Compliance (<60%) (Category A: 0 of 4)
  // Fundamental (3)
  { id: nextId(), employeeName: 'Quentin Tarantino', serviceNo: 'EMP1017', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Quentin Tarantino', serviceNo: 'EMP1017', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Quentin Tarantino', serviceNo: 'EMP1017', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },


  // EMP1018: Rachel Green - Partially Compliant (<90%)
  // Fundamental (5)
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  // Category B (4)
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Rachel Green', serviceNo: 'EMP1018', vertical: 'Operations', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },


  // EMP1019: Steve Rogers - Compliant (100%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Steve Rogers', serviceNo: 'EMP1019', vertical: 'Digital Solutions', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1020: Tony Stark - Compliant (100%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Tony Stark', serviceNo: 'EMP1020', vertical: 'Cloud Infrastructure', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1021: Ursula Buffay - Non-compliant (Category A: 2 of 4)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (4)
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Ursula Buffay', serviceNo: 'EMP1021', vertical: 'Talent & HRD', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },


  // EMP1022: Victor Stone - Compliant (100%)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (5)
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category B', code: 'CATB-04', title: 'Customer Journey Mapping', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category B', code: 'CATB-05', title: 'Scrum Master Basics', status: 'Pass' },
  // Category C (8)
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-01', title: 'Introduction to SQL Databases', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-02', title: 'Data Structures & Algorithms', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-03', title: 'Version Control with Git', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-04', title: 'JavaScript Mastery', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-05', title: 'React Frontend Framework', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-06', title: 'REST API Design Principles', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-07', title: 'Node.js Backend Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category C', code: 'CATC-08', title: 'Unit Testing Methodologies', status: 'Pass' },
  // Category D (3)
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category D', code: 'CATD-01', title: 'Cloud Computing Fundamentals', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category D', code: 'CATD-02', title: 'Docker Containerization', status: 'Pass' },
  { id: nextId(), employeeName: 'Victor Stone', serviceNo: 'EMP1022', vertical: 'Financial Services', category: 'Category D', code: 'CATD-03', title: 'CI/CD Pipelines Architecture', status: 'Pass' },


  // EMP1023: Wendy Darling - Partially Compliant (Missing Category A in records, so defaults to 0 passed)
  // Fundamental (6)
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Fundamental', code: 'FUN-006', title: 'Antitrust & Fair Competition', status: 'Pass' },
  // Category B (3)
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-02', title: 'UI/UX Design Essentials', status: 'Pass' },
  { id: nextId(), employeeName: 'Wendy Darling', serviceNo: 'EMP1023', vertical: 'Customer Experience', category: 'Category B', code: 'CATB-03', title: 'Product Roadmap Planning', status: 'Pass' },


  // EMP1024: Xavier Charles - Partially Compliant (Missing Category A in records, so defaults to 0 passed)
  // Fundamental (5)
  { id: nextId(), employeeName: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Pass' },
  { id: nextId(), employeeName: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Pass' },
  { id: nextId(), employeeName: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', category: 'Fundamental', code: 'FUN-003', title: 'Workplace Diversity & Inclusion', status: 'Pass' },
  { id: nextId(), employeeName: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', category: 'Fundamental', code: 'FUN-004', title: 'Data Privacy Regulations', status: 'Pass' },
  { id: nextId(), employeeName: 'Xavier Charles', serviceNo: 'EMP1024', vertical: 'Operations', category: 'Fundamental', code: 'FUN-005', title: 'Workplace Safety Procedures', status: 'Pass' },


  // EMP1025: Yolanda Adams - Zero Compliance (All statuses Fail or Withdrawn!)
  { id: nextId(), employeeName: 'Yolanda Adams', serviceNo: 'EMP1025', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-001', title: 'Corporate Code of Conduct', status: 'Fail' },
  { id: nextId(), employeeName: 'Yolanda Adams', serviceNo: 'EMP1025', vertical: 'Digital Solutions', category: 'Fundamental', code: 'FUN-002', title: 'Information Security Basics', status: 'Withdrawn' },
  { id: nextId(), employeeName: 'Yolanda Adams', serviceNo: 'EMP1025', vertical: 'Digital Solutions', category: 'Category B', code: 'CATB-01', title: 'Agile Project Management', status: 'Fail' }
];
