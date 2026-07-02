/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrainingRecord, CategoryAData, CompliancePolicy, EmployeeCompliance, ValidationLog, VerticalSummary, CategorySummary } from './types';
import * as XLSX from 'xlsx';

// 1. Compliance Calculator
export function calculateCompliance(
  employees: { name: string; serviceNo: string; vertical: string; designation?: string }[],
  trainingRecords: TrainingRecord[],
  categoryAData: CategoryAData[],
  policies: { 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy }
): EmployeeCompliance[] {
  
  // Build lookup maps
  const catAMap = new Map<string, number>();
  categoryAData.forEach(item => {
    catAMap.set(item.serviceNo, item.completedCount);
  });

  // Group passed training codes per employee and category
  // Map of serviceNo -> Map of category -> Set of trainingCodes
  const employeePassedMap = new Map<string, Map<string, Set<string>>>();

  trainingRecords.forEach(record => {
    // Only status = Pass counts
    if (record.status?.trim().toLowerCase() !== 'pass') return;
    if (!record.serviceNo) return;

    let catMap = employeePassedMap.get(record.serviceNo);
    if (!catMap) {
      catMap = new Map<string, Set<string>>();
      employeePassedMap.set(record.serviceNo, catMap);
    }

    // Standardize category name to match policy fields:
    // "Fundamental" or "Category B" etc.
    let catKey = record.category?.trim();
    if (catKey?.toLowerCase() === 'fundamental' || catKey?.toLowerCase() === 'fundamentals') {
      catKey = 'Fundamental';
    } else if (catKey?.toLowerCase() === 'category b' || catKey?.toLowerCase() === 'b') {
      catKey = 'Category B';
    } else if (catKey?.toLowerCase() === 'category c' || catKey?.toLowerCase() === 'c') {
      catKey = 'Category C';
    } else if (catKey?.toLowerCase() === 'category d' || catKey?.toLowerCase() === 'd') {
      catKey = 'Category D';
    }

    let codeSet = catMap.get(catKey);
    if (!codeSet) {
      codeSet = new Set<string>();
      catMap.set(catKey, codeSet);
    }

    codeSet.add(record.code?.trim());
  });

  return employees.map(emp => {
    const sNo = emp.serviceNo;
    const catMap = employeePassedMap.get(sNo);

    // Get the policy based on designation
    const rawDesig = emp.designation?.trim() || 'Assistant Manager';
    const isManager = rawDesig.toLowerCase().includes('manager') && !rawDesig.toLowerCase().includes('assistant');
    const desigKey: 'Assistant Manager' | 'Manager' = isManager ? 'Manager' : 'Assistant Manager';
    const empPolicy = policies[desigKey];

    // Passed counts (unique codes with Pass status)
    const fundamentalPassed = catMap?.get('Fundamental')?.size || 0;
    const categoryAPassed = catAMap.get(sNo) ?? 0; // Default to 0 if not found
    const categoryBPassed = catMap?.get('Category B')?.size || 0;
    const categoryCPassed = catMap?.get('Category C')?.size || 0;
    const categoryDPassed = catMap?.get('Category D')?.size || 0;

    // Policies
    const fundamentalRequired = empPolicy.Fundamental;
    const categoryARequired = empPolicy.CategoryA;
    const categoryBRequired = empPolicy.CategoryB;
    const categoryCRequired = empPolicy.CategoryC;
    const categoryDRequired = empPolicy.CategoryD;

    // Remaining calculations (capped at 0, cannot be negative)
    const fundamentalRemaining = Math.max(0, fundamentalRequired - fundamentalPassed);
    const categoryARemaining = Math.max(0, categoryARequired - categoryAPassed);
    const categoryBRemaining = Math.max(0, categoryBRequired - categoryBPassed);
    const categoryCRemaining = Math.max(0, categoryCRequired - categoryCPassed);
    const categoryDRemaining = Math.max(0, categoryDRequired - categoryDPassed);

    // Compliance % per category (capped at 100%)
    const fundamentalCompliance = fundamentalRequired > 0 
      ? Math.min(100, (fundamentalPassed / fundamentalRequired) * 100) 
      : 100;
    const categoryACompliance = categoryARequired > 0 
      ? Math.min(100, (categoryAPassed / categoryARequired) * 100) 
      : 100;
    const categoryBCompliance = categoryBRequired > 0 
      ? Math.min(100, (categoryBPassed / categoryBRequired) * 100) 
      : 100;
    const categoryCCompliance = categoryCRequired > 0 
      ? Math.min(100, (categoryCPassed / categoryCRequired) * 100) 
      : 100;
    const categoryDCompliance = categoryDRequired > 0 
      ? Math.min(100, (categoryDPassed / categoryDRequired) * 100) 
      : 100;

    // Overall compliance calculation:
    // Capped passed sum to prevent overperformance in one category from masking deficits in another.
    const cappedPassedFundamental = Math.min(fundamentalPassed, fundamentalRequired);
    const cappedPassedA = Math.min(categoryAPassed, categoryARequired);
    const cappedPassedB = Math.min(categoryBPassed, categoryBRequired);
    const cappedPassedC = Math.min(categoryCPassed, categoryCRequired);
    const cappedPassedD = Math.min(categoryDPassed, categoryDRequired);

    const totalPassed = fundamentalPassed + categoryAPassed + categoryBPassed + categoryCPassed + categoryDPassed;
    const totalRequired = fundamentalRequired + categoryARequired + categoryBRequired + categoryCRequired + categoryDRequired;

    // Professional Capped Passed total for compliance score
    const totalPassedCapped = cappedPassedFundamental + cappedPassedA + cappedPassedB + cappedPassedC + cappedPassedD;
    const overallCompliance = totalRequired > 0 
      ? (totalPassedCapped / totalRequired) * 100 
      : 100;

    // Status: Compliant only if they met every category requirement (100% compliance in each category)
    const isCompliant = 
      fundamentalPassed >= fundamentalRequired &&
      categoryAPassed >= categoryARequired &&
      categoryBPassed >= categoryBRequired &&
      categoryCPassed >= categoryCRequired &&
      categoryDPassed >= categoryDRequired;

    return {
      employeeName: emp.name,
      serviceNo: emp.serviceNo,
      vertical: emp.vertical,
      designation: desigKey,
      fundamentalPassed,
      fundamentalRequired,
      fundamentalRemaining,
      fundamentalCompliance,
      categoryAPassed,
      categoryARequired,
      categoryARemaining,
      categoryACompliance,
      categoryBPassed,
      categoryBRequired,
      categoryBRemaining,
      categoryBCompliance,
      categoryCPassed,
      categoryCRequired,
      categoryCRemaining,
      categoryCCompliance,
      categoryDPassed,
      categoryDRequired,
      categoryDRemaining,
      categoryDCompliance,
      totalPassed,
      totalRequired,
      overallCompliance,
      status: isCompliant ? 'Compliant' : 'Non-Compliant'
    };
  });
}

// 2. Data Validator
export function validateRecords(
  records: any[],
  fileName: string = 'Import'
): { logs: ValidationLog[]; validRecords: TrainingRecord[]; newEmployees: { name: string; serviceNo: string; vertical: string; designation?: string }[] } {
  
  const logs: ValidationLog[] = [];
  const validRecords: TrainingRecord[] = [];
  const employeesMap = new Map<string, { name: string; serviceNo: string; vertical: string; designation?: string }>();

  let idCounter = 1;

  records.forEach((row, index) => {
    const rowNum = index + 2; // Offset for Excel header row
    const id = `VTR_${Date.now()}_${String(idCounter++).padStart(5, '0')}`;

    // 1. Check for blank row
    const values = Object.values(row).map(v => String(v || '').trim());
    if (values.every(v => v === '')) {
      logs.push({
        id: `LOG_${id}`,
        rowNum,
        fileName,
        type: 'warning',
        field: 'Row',
        message: 'Blank row detected and skipped.',
        value: ''
      });
      return;
    }

    // Extracted Fields from auto-mapped or standard columns
    const employeeName = String(row['Employee Name'] || row['name'] || row['EmployeeName'] || '').trim();
    const serviceNo = String(row['Service No'] || row['serviceNo'] || row['ServiceNo'] || row['Service Number'] || '').trim();
    const vertical = String(row['Vertical'] || row['vertical'] || '').trim();
    const category = String(row['Training Category'] || row['category'] || row['TrainingCategory'] || '').trim();
    const code = String(row['Training Code'] || row['code'] || row['TrainingCode'] || '').trim();
    const title = String(row['Training Title'] || row['title'] || row['TrainingTitle'] || '').trim();
    const status = String(row['Status'] || row['status'] || '').trim();
    const designation = String(row['Designation'] || row['designation'] || row['Role'] || row['role'] || '').trim();

    // Validations
    let isRowValid = true;

    if (!serviceNo) {
      logs.push({
        id: `LOG_${id}_1`,
        rowNum,
        fileName,
        type: 'error',
        field: 'Service No',
        message: 'Missing Employee Service Number. Record cannot be matched.',
        value: ''
      });
      isRowValid = false;
    }

    if (!employeeName) {
      logs.push({
        id: `LOG_${id}_2`,
        rowNum,
        fileName,
        type: 'warning',
        field: 'Employee Name',
        message: `Missing Employee Name for Service No: ${serviceNo || 'N/A'}.`,
        value: ''
      });
    }

    if (!category) {
      logs.push({
        id: `LOG_${id}_3`,
        rowNum,
        fileName,
        type: 'error',
        field: 'Training Category',
        message: 'Missing Training Category.',
        value: ''
      });
      isRowValid = false;
    }

    if (!code) {
      logs.push({
        id: `LOG_${id}_4`,
        rowNum,
        fileName,
        type: 'error',
        field: 'Training Code',
        message: 'Missing Training Code.',
        value: ''
      });
      isRowValid = false;
    }

    // Validate Status values
    const validStatuses = ['pass', 'fail', 'withdrawn'];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      logs.push({
        id: `LOG_${id}_5`,
        rowNum,
        fileName,
        type: 'warning',
        field: 'Status',
        message: `Invalid Training Status: "${status}". Allowed values: Pass, Fail, Withdrawn.`,
        value: status
      });
    }

    if (isRowValid) {
      validRecords.push({
        id,
        employeeName: employeeName || `Service No: ${serviceNo}`,
        serviceNo,
        vertical: vertical || 'General',
        category,
        code,
        title: title || 'Untitled Course',
        status: status || 'Pass'
      });

      // Track unique employee definitions found in logs
      if (serviceNo && !employeesMap.has(serviceNo)) {
        // Try to identify if designation is Manager or Assistant Manager
        let finalDesig = 'Assistant Manager';
        if (designation) {
          const lowerDesig = designation.toLowerCase();
          if (lowerDesig.includes('manager') && !lowerDesig.includes('assistant')) {
            finalDesig = 'Manager';
          } else if (lowerDesig.includes('assistant') || lowerDesig.includes('am')) {
            finalDesig = 'Assistant Manager';
          } else {
            // Default based on any other keyword or keep original
            finalDesig = designation;
          }
        }
        employeesMap.set(serviceNo, {
          name: employeeName || `Service No: ${serviceNo}`,
          serviceNo,
          vertical: vertical || 'General',
          designation: finalDesig
        });
      }
    }
  });

  // Duplicate training records check (same employee, same code, same status)
  const duplicateTracker = new Map<string, Set<number>>(); // key: serviceNo_code -> Set of row numbers
  validRecords.forEach((rec, idx) => {
    const rowNum = idx + 2;
    const key = `${rec.serviceNo}_${rec.code}`;
    let set = duplicateTracker.get(key);
    if (!set) {
      set = new Set<number>();
      duplicateTracker.set(key, set);
    }
    set.add(rowNum);
  });

  duplicateTracker.forEach((rows, key) => {
    if (rows.size > 1) {
      const arr = Array.from(rows);
      const [serviceNo, code] = key.split('_');
      logs.push({
        id: `LOG_DUP_${serviceNo}_${code}`,
        type: 'info',
        field: 'Training Record',
        message: `Duplicate training record detected for Employee ${serviceNo} and Course ${code} on rows [${arr.join(', ')}]. Calculating only once as per policy rules.`,
        value: `Employee: ${serviceNo}, Code: ${code}`
      });
    }
  });

  return {
    logs,
    validRecords,
    newEmployees: Array.from(employeesMap.values())
  };
}

// 3. Export to Excel (Generates Blob for download)
export function exportToExcel(
  complianceData: EmployeeCompliance[],
  verticalsSummary: VerticalSummary[],
  categoriesSummary: CategorySummary[],
  validationLogs: ValidationLog[]
): Blob {
  const wb = XLSX.utils.book_new();

  // 1. Dashboard Tab
  const dashboardRows = [
    ['TRAINING COMPLIANCE MANAGEMENT SYSTEM - DASHBOARD SUMMARY'],
    ['Generated On:', new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
    [],
    ['Key Performance Indicator', 'Value'],
    ['Total Employees', complianceData.length],
    ['Overall Compliance (%)', (complianceData.reduce((acc, c) => acc + c.overallCompliance, 0) / (complianceData.length || 1)).toFixed(2) + '%'],
    ['Fully Compliant Employees', complianceData.filter(e => e.status === 'Compliant').length],
    ['Non-Compliant Employees', complianceData.filter(e => e.status === 'Non-Compliant').length],
    [],
    ['Vertical-wise Performance Summary'],
    ['Vertical', 'Total Employees', 'Average Compliance (%)'],
    ...verticalsSummary.map(v => [v.vertical, v.employeeCount, v.avgCompliance.toFixed(2) + '%']),
    [],
    ['Category-wise Performance Summary'],
    ['Category', 'Passed Training Count', 'Average Category Compliance (%)'],
    ...categoriesSummary.map(c => [c.categoryName, c.passedCount, c.avgCompliance.toFixed(2) + '%'])
  ];
  const wsDash = XLSX.utils.aoa_to_sheet(dashboardRows);
  XLSX.utils.book_append_sheet(wb, wsDash, 'Dashboard');

  // 2. Employee Report Tab
  const employeeHeaders = [
    'Employee Name', 'Service No', 'Vertical',
    'Fundamental Passed', 'Fundamental Required', 'Fundamental Compliance %',
    'Category A Passed', 'Category A Required', 'Category A Compliance %',
    'Category B Passed', 'Category B Required', 'Category B Compliance %',
    'Category C Passed', 'Category C Required', 'Category C Compliance %',
    'Category D Passed', 'Category D Required', 'Category D Compliance %',
    'Total Passed (All)', 'Total Required (All)', 'Overall Compliance %', 'Status'
  ];
  const employeeRows = complianceData.map(e => [
    e.employeeName, e.serviceNo, e.vertical,
    e.fundamentalPassed, e.fundamentalRequired, e.fundamentalCompliance.toFixed(1) + '%',
    e.categoryAPassed, e.categoryARequired, e.categoryACompliance.toFixed(1) + '%',
    e.categoryBPassed, e.categoryBRequired, e.categoryBCompliance.toFixed(1) + '%',
    e.categoryCPassed, e.categoryCRequired, e.categoryCCompliance.toFixed(1) + '%',
    e.categoryDPassed, e.categoryDRequired, e.categoryDCompliance.toFixed(1) + '%',
    e.totalPassed, e.totalRequired, e.overallCompliance.toFixed(1) + '%', e.status
  ]);
  const wsEmp = XLSX.utils.aoa_to_sheet([employeeHeaders, ...employeeRows]);
  XLSX.utils.book_append_sheet(wb, wsEmp, 'Employee Report');

  // 3. Vertical Summary Tab
  const verticalHeaders = [
    'Vertical Name', 'Employee Count', 'Overall Avg Compliance %',
    'Fundamental Avg Compliance %', 'Category A Avg Compliance %',
    'Category B Avg Compliance %', 'Category C Avg Compliance %', 'Category D Avg Compliance %'
  ];
  const verticalRows = verticalsSummary.map(v => [
    v.vertical, v.employeeCount, v.avgCompliance.toFixed(1) + '%',
    v.fundamentalCompliance.toFixed(1) + '%', v.categoryACompliance.toFixed(1) + '%',
    v.categoryBCompliance.toFixed(1) + '%', v.categoryCCompliance.toFixed(1) + '%', v.categoryDCompliance.toFixed(1) + '%'
  ]);
  const wsVert = XLSX.utils.aoa_to_sheet([verticalHeaders, ...verticalRows]);
  XLSX.utils.book_append_sheet(wb, wsVert, 'Vertical Summary');

  // 4. Category Summary Tab
  const categoryHeaders = ['Category Name', 'Passed Counts (Deduplicated)', 'Required Policy Total', 'Category-wide Average Compliance %'];
  const categoryRows = categoriesSummary.map(c => [
    c.categoryName, c.passedCount, c.requiredTotal, c.avgCompliance.toFixed(1) + '%'
  ]);
  const wsCat = XLSX.utils.aoa_to_sheet([categoryHeaders, ...categoryRows]);
  XLSX.utils.book_append_sheet(wb, wsCat, 'Category Summary');

  // 5. Validation Tab
  const validationHeaders = ['Row Number', 'File Name', 'Type', 'Field', 'Message', 'Invalid Value Provided'];
  const validationRows = validationLogs.map(l => [
    l.rowNum || 'N/A', l.fileName || 'System', l.type.toUpperCase(), l.field, l.message, l.value || ''
  ]);
  const wsVal = XLSX.utils.aoa_to_sheet([validationHeaders, ...validationRows]);
  XLSX.utils.book_append_sheet(wb, wsVal, 'Validation Report');

  // Write and return blob
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
}

// 4. Generate beautiful, professional formatted sample files for download
export function generateSampleExcelFiles(): { mainSample: Blob, categoryASample: Blob } {
  // Main training records workbook
  const mainHeaders = ['Employee Name', 'Service No', 'Vertical', 'Training Category', 'Training Code', 'Training Title', 'Status'];
  const mainData = [
    ['Alice Smith', 'EMP1001', 'Digital Solutions', 'Fundamental', 'FUN-001', 'Corporate Code of Conduct', 'Pass'],
    ['Alice Smith', 'EMP1001', 'Digital Solutions', 'Fundamental', 'FUN-002', 'Information Security Basics', 'Pass'],
    ['Alice Smith', 'EMP1001', 'Digital Solutions', 'Category B', 'CATB-01', 'Agile Project Management', 'Pass'],
    ['Bob Johnson', 'EMP1002', 'Cloud Infrastructure', 'Fundamental', 'FUN-001', 'Corporate Code of Conduct', 'Pass'],
    ['Bob Johnson', 'EMP1002', 'Cloud Infrastructure', 'Fundamental', 'FUN-002', 'Information Security Basics', 'Fail'],
    ['Bob Johnson', 'EMP1002', 'Cloud Infrastructure', 'Category B', 'CATB-01', 'Agile Project Management', 'Withdrawn'],
    ['Charlie Brown', 'EMP1003', 'Talent & HRD', 'Fundamental', 'FUN-001', 'Corporate Code of Conduct', 'Pass']
  ];
  const wb1 = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet([mainHeaders, ...mainData]);
  XLSX.utils.book_append_sheet(wb1, ws1, 'Training Records');
  const out1 = XLSX.write(wb1, { bookType: 'xlsx', type: 'array' });
  const mainSample = new Blob([out1], { type: 'application/octet-stream' });

  // Category A completed workbook
  const catAHeaders = ['Service No', 'Category A Completed'];
  const catAData = [
    ['EMP1001', 3],
    ['EMP1002', 4],
    ['EMP1003', 2]
  ];
  const wb2 = XLSX.utils.book_new();
  const ws2 = XLSX.utils.aoa_to_sheet([catAHeaders, ...catAData]);
  XLSX.utils.book_append_sheet(wb2, ws2, 'Category A Completed');
  const out2 = XLSX.write(wb2, { bookType: 'xlsx', type: 'array' });
  const categoryASample = new Blob([out2], { type: 'application/octet-stream' });

  return { mainSample, categoryASample };
}
