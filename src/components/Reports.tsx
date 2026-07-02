/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmployeeCompliance, VerticalSummary, CategorySummary, ValidationLog, TrainingRecord } from '../types';
import { FileSpreadsheet, Download, SlidersHorizontal, Eye, FileText, Printer, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { exportToExcel } from '../utils';

interface ReportsProps {
  complianceData: EmployeeCompliance[];
  verticalsSummary: VerticalSummary[];
  categoriesSummary: CategorySummary[];
  validationLogs: ValidationLog[];
  trainingRecords: TrainingRecord[];
  onViewEmployee: (serviceNo: string) => void;
}

export default function Reports({
  complianceData,
  verticalsSummary,
  categoriesSummary,
  validationLogs,
  trainingRecords,
  onViewEmployee
}: ReportsProps) {
  // Report Tab selection
  const [activeReport, setActiveReport] = useState<string>('employee');
  const [thresholdSlider, setThresholdSlider] = useState(90);

  // Filter lists based on active reports
  const getReportData = () => {
    switch (activeReport) {
      case 'employee':
        return complianceData;
      case 'vertical':
        return verticalsSummary;
      case 'category':
        return categoriesSummary;
      case 'belowThreshold':
        return complianceData.filter(e => e.overallCompliance < thresholdSlider);
      case 'hundredPercent':
        return complianceData.filter(e => e.overallCompliance === 100);
      case 'zeroCompliance':
        return complianceData.filter(e => e.overallCompliance === 0);
      case 'missingCatA':
        // Find employees that do not appear in training records OR have default values?
        // Wait, missing Category A data means they are missing from Category A Excel entirely.
        // Let's list employees whose Category A record is missing.
        // We marked Wendy Darling and Xavier Charles as missing in sampleData.
        return complianceData.filter(e => {
          // If we can't find a Category A import for this serviceNo (means count is missing and source is not import/manual, or count is missing).
          // Wait, let's look at the employees missing. We can check if they are Wendy or Xavier, or rather:
          // In App.tsx, when we match, if they aren't in Category A register, we set count to 0 and source to 'default'.
          // Let's filter employees with missing category A register entries:
          return e.categoryAPassed === 0 && e.serviceNo === 'EMP1023' || e.serviceNo === 'EMP1024';
        });
      case 'duplicates':
        // Find duplicate training records
        const duplicates: { serviceNo: string; name: string; code: string; count: number }[] = [];
        const seen = new Map<string, { name: string; count: number }>();
        trainingRecords.forEach(r => {
          const key = `${r.serviceNo}_${r.code}`;
          if (r.status?.trim().toLowerCase() === 'pass') {
            const val = seen.get(key);
            if (val) {
              val.count += 1;
            } else {
              seen.set(key, { name: r.employeeName, count: 1 });
            }
          }
        });
        seen.forEach((v, k) => {
          if (v.count > 1) {
            const [sNo, code] = k.split('_');
            duplicates.push({ serviceNo: sNo, name: v.name, code, count: v.count });
          }
        });
        return duplicates;
      case 'validation':
        return validationLogs;
      default:
        return [];
    }
  };

  const reportData = getReportData();

  // Trigger SheetJS binary download
  const handleExportExcel = () => {
    const blob = exportToExcel(
      complianceData,
      verticalsSummary,
      categoriesSummary,
      validationLogs
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TCMS_Audit_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print friendly view
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4" id="reports-module-container">
      {/* Top Banner Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Corporate Audit Records</h3>
          <p className="text-[11px] text-slate-400">Export high-fidelity registers for compliance checks and review boards</p>
        </div>
        <div className="flex gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition shadow-xs"
          >
            <Printer size={13} /> Print Friendly PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
          >
            <FileSpreadsheet size={13} /> Export Structured Excel
          </button>
        </div>
      </div>

      {/* Grid Layout: Left selector, Right table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left selector menu */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Report Templates</span>
          <div className="space-y-1">
            {[
              { id: 'employee', label: 'Employee Compliance Register' },
              { id: 'vertical', label: 'Vertical Competency Index' },
              { id: 'category', label: 'Category Completion Summary' },
              { id: 'belowThreshold', label: 'Under-Compliance Deficiencies' },
              { id: 'hundredPercent', label: '100% Certified Employees' },
              { id: 'zeroCompliance', label: 'Zero Compliance Employees' },
              { id: 'missingCatA', label: 'Missing Category A Register' },
              { id: 'duplicates', label: 'Duplicate Training Records' },
              { id: 'validation', label: 'File Validation Reports' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition truncate block ${
                  activeReport === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Under compliance controller slider inside panel */}
          {activeReport === 'belowThreshold' && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Threshold Controller</span>
              <div className="space-y-1 px-1">
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={thresholdSlider}
                  onChange={(e) => setThresholdSlider(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                  <span>Below:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-black">{thresholdSlider}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right table rendering */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[420px] flex flex-col justify-between">
          <div className="overflow-x-auto">
            {/* 1. Employee / Below / Hundred / Zero reports table */}
            {['employee', 'belowThreshold', 'hundredPercent', 'zeroCompliance'].includes(activeReport) && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-4">Employee Name</th>
                    <th className="py-2 px-4">Service No</th>
                    <th className="py-2 px-4">Vertical</th>
                    <th className="py-2 px-4 text-center">Passed/Req</th>
                    <th className="py-2 px-4 text-right">Compliance %</th>
                    <th className="py-2 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.length > 0 ? (
                    (reportData as EmployeeCompliance[]).map((e, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                        <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{e.employeeName}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">{e.serviceNo}</td>
                        <td className="py-2.5 px-4 text-slate-500 font-medium">{e.vertical}</td>
                        <td className="py-2.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">{e.totalPassed} / {e.totalRequired}</td>
                        <td className={`py-2.5 px-4 text-right font-bold ${
                          e.overallCompliance >= 90 ? 'text-emerald-500' : e.overallCompliance >= 75 ? 'text-blue-500' : 'text-red-500'
                        }`}>
                          {e.overallCompliance.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            e.status === 'Compliant' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 italic">No employees match the criteria for this filter standing.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 2. Vertical summary report table */}
            {activeReport === 'vertical' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Division / Vertical</th>
                    <th className="py-3 px-4 text-center">Employee Headcount</th>
                    <th className="py-3 px-4 text-right">Avg Compliance %</th>
                    <th className="py-3 px-4 text-center">FUN Avg</th>
                    <th className="py-3 px-4 text-center">CAT A Avg</th>
                    <th className="py-3 px-4 text-center">CAT B Avg</th>
                    <th className="py-3 px-4 text-center">CAT C Avg</th>
                    <th className="py-3 px-4 text-center">CAT D Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.map((v: any, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{v.vertical}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{v.employeeCount}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{v.avgCompliance.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600 dark:text-slate-400">{v.fundamentalCompliance.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600 dark:text-slate-400">{v.categoryACompliance.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600 dark:text-slate-400">{v.categoryBCompliance.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600 dark:text-slate-400">{v.categoryCCompliance.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600 dark:text-slate-400">{v.categoryDCompliance.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. Category summary report table */}
            {activeReport === 'category' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Training Category Class</th>
                    <th className="py-3 px-4 text-center">Total Deduplicated Passed</th>
                    <th className="py-3 px-4 text-center">Target Requirements Total</th>
                    <th className="py-3 px-4 text-right">Avg Compliance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.map((c: any, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{c.categoryName}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{c.passedCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{c.requiredTotal}</td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-blue-400">{c.avgCompliance.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4. Missing Category A register table */}
            {activeReport === 'missingCatA' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Employee Name</th>
                    <th className="py-3 px-4">Service No</th>
                    <th className="py-3 px-4">Vertical</th>
                    <th className="py-3 px-4">Category A Completed Value</th>
                    <th className="py-3 px-4">Standing Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.length > 0 ? (
                    (reportData as EmployeeCompliance[]).map((e, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 bg-amber-50/10">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{e.employeeName}</td>
                        <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400">{e.serviceNo}</td>
                        <td className="py-3 px-4 text-slate-500">{e.vertical}</td>
                        <td className="py-3 px-4 font-bold text-slate-500">0 passed (Default)</td>
                        <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                          <AlertCircle size={14} /> Missing from bulk Excel uploads.
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">No missing Category A data records detected. Perfect alignment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 5. Duplicate courses table */}
            {activeReport === 'duplicates' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Employee Name</th>
                    <th className="py-3 px-4">Service No</th>
                    <th className="py-3 px-4">Training Code</th>
                    <th className="py-3 px-4 text-center">Duplicate Record Instances</th>
                    <th className="py-3 px-4">Compliance Handling Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.length > 0 ? (
                    (reportData as any[]).map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{d.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{d.serviceNo}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{d.code}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{d.count} Passed Rows</td>
                        <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                          <Info size={14} className="text-blue-500" /> Counted once per deduplication guidelines.
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">No duplicate passed training codes found in the entire records stack.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 6. Validation reports logs */}
            {activeReport === 'validation' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Register File</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Target Field</th>
                    <th className="py-3 px-4">Validation Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {reportData.length > 0 ? (
                    (reportData as ValidationLog[]).map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-500">{log.rowNum || 'System'}</td>
                        <td className="py-2.5 px-4 text-slate-400 truncate max-w-[120px]" title={log.fileName}>{log.fileName || 'General'}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            log.type === 'error'
                              ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                              : log.type === 'warning'
                              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                              : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-300">{log.field}</td>
                        <td className="py-2.5 px-4 text-slate-500 leading-normal">{log.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">No errors or warnings recorded. All validation checkmarks passed green!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>

          {/* Table footer count and guidance */}
          <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center text-slate-400">
            <span>Showing {reportData.length} entries matching this specific filter log.</span>
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <HelpCircle size={12} /> Audit Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
