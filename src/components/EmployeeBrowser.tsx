/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmployeeCompliance, TrainingRecord, CategoryAData } from '../types';
import { Search, SlidersHorizontal, Eye, RefreshCw, Save, Check, X, ShieldAlert, BadgeInfo, AlertTriangle, ArrowUpDown, ChevronRight, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface EmployeeBrowserProps {
  complianceData: EmployeeCompliance[];
  trainingRecords: TrainingRecord[];
  categoryAData: CategoryAData[];
  verticals: string[];
  onUpdateCategoryA: (serviceNo: string, count: number) => void;
  selectedEmployeeNo?: string | null;
  onClearSelection?: () => void;
  onDeleteEmployee?: (serviceNo: string | string[]) => void;
  onDeleteTrainingRecord?: (recordId: string) => void;
  onClearAllRecords?: () => void;
  onResetToSampleData?: () => void;
}

export default function EmployeeBrowser({
  complianceData,
  trainingRecords,
  categoryAData,
  verticals,
  onUpdateCategoryA,
  selectedEmployeeNo,
  onClearSelection,
  onDeleteEmployee,
  onDeleteTrainingRecord,
  onClearAllRecords,
  onResetToSampleData
}: EmployeeBrowserProps) {
  // Filters & State
  const [search, setSearch] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All');
  const [customThreshold, setCustomThreshold] = useState(90);
  const [sortField, setSortField] = useState<keyof EmployeeCompliance>('employeeName');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedServiceNos, setSelectedServiceNos] = useState<string[]>([]);

  // Sync selectedServiceNos after complianceData updates (e.g. after deletion)
  React.useEffect(() => {
    setSelectedServiceNos(prev => prev.filter(serviceNo => complianceData.some(e => e.serviceNo === serviceNo)));
  }, [complianceData]);

  // Detail Modal state
  const [selectedEmp, setSelectedEmp] = useState<EmployeeCompliance | null>(null);
  const [editingCatACount, setEditingCatACount] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom confirmation modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Listen to external selection from reports or dashboard
  React.useEffect(() => {
    if (selectedEmployeeNo) {
      const emp = complianceData.find(e => e.serviceNo === selectedEmployeeNo);
      if (emp) {
        setSelectedEmp(emp);
        setEditingCatACount(emp.categoryAPassed);
        setSaveSuccess(false);
        onClearSelection?.();
      }
    }
  }, [selectedEmployeeNo, complianceData, onClearSelection]);

  // Synchronize selectedEmp when complianceData updates (e.g. after deletion or calculation updates)
  React.useEffect(() => {
    if (selectedEmp) {
      const updated = complianceData.find(e => e.serviceNo === selectedEmp.serviceNo);
      if (updated) {
        setSelectedEmp(updated);
      } else {
        // Employee was deleted entirely!
        setSelectedEmp(null);
      }
    }
  }, [complianceData]);

  // Sort toggle helper
  const handleSort = (field: keyof EmployeeCompliance) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort the employees
  const filteredData = complianceData
    .filter(emp => {
      // Search
      const term = search.toLowerCase();
      const matchSearch = 
        emp.employeeName.toLowerCase().includes(term) ||
        emp.serviceNo.toLowerCase().includes(term);

      // Vertical
      const matchVertical = selectedVertical === 'All' || emp.vertical === selectedVertical;

      // Compliance level filter
      let matchCompliance = true;
      if (complianceFilter === 'Compliant') {
        matchCompliance = emp.status === 'Compliant';
      } else if (complianceFilter === 'Non-Compliant') {
        matchCompliance = emp.status === 'Non-Compliant';
      } else if (complianceFilter === 'BelowThreshold') {
        matchCompliance = emp.overallCompliance < customThreshold;
      } else if (complianceFilter === 'Zero') {
        matchCompliance = emp.overallCompliance === 0;
      } else if (complianceFilter === 'Partial') {
        matchCompliance = emp.overallCompliance > 0 && emp.overallCompliance < 100;
      } else if (complianceFilter === 'Full') {
        matchCompliance = emp.overallCompliance === 100;
      }

      return matchSearch && matchVertical && matchCompliance;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

  // Open detail panel for employee
  const handleViewEmployee = (emp: EmployeeCompliance) => {
    setSelectedEmp(emp);
    setEditingCatACount(emp.categoryAPassed);
    setSaveSuccess(false);
  };

  // Double-click handler
  const handleDoubleClickRow = (emp: EmployeeCompliance) => {
    handleViewEmployee(emp);
  };

  // Save manual override for Category A
  const handleSaveCategoryAOverride = () => {
    if (selectedEmp && editingCatACount !== null) {
      onUpdateCategoryA(selectedEmp.serviceNo, editingCatACount);
      setSaveSuccess(true);
      
      // Instantly recalculate local selected employee details
      const updatedEmp = complianceData.find(e => e.serviceNo === selectedEmp.serviceNo);
      if (updatedEmp) {
        setSelectedEmp({
          ...updatedEmp,
          categoryAPassed: editingCatACount,
          // Recalculating totals on the fly so UI responds instantly inside modal
          totalPassed: updatedEmp.totalPassed - updatedEmp.categoryAPassed + editingCatACount,
        });
      }

      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Get course list for the selected employee
  const getEmployeeCourses = (serviceNo: string) => {
    return trainingRecords.filter(r => r.serviceNo === serviceNo);
  };

  return (
    <div className="space-y-4" id="employee-browser-container">
      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search employee name or service number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Vertical filter */}
          <div className="md:col-span-3">
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Verticals</option>
              {verticals.map((v, i) => (
                <option key={i} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Compliance filter */}
          <div className="md:col-span-4">
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Compliance States</option>
              <option value="Compliant">Compliant Status (100% in all)</option>
              <option value="Non-Compliant">Non-Compliant Status (Deficient)</option>
              <option value="Full">Overall Compliance = 100%</option>
              <option value="Partial">Partially Compliant (1% to 99%)</option>
              <option value="BelowThreshold">Below Custom Threshold (&lt; {customThreshold}%)</option>
              <option value="Zero">Zero Compliance (0%)</option>
            </select>
          </div>
        </div>

        {/* Custom threshold slider - visible only when BelowThreshold is chosen */}
        {complianceFilter === 'BelowThreshold' && (
          <div className="flex items-center gap-4 bg-blue-50/50 dark:bg-blue-950/10 p-3 rounded-xl border border-blue-100/30">
            <SlidersHorizontal className="text-blue-500 shrink-0" size={16} />
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Threshold:</span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={customThreshold}
                onChange={(e) => setCustomThreshold(Number(e.target.value))}
                className="flex-1 h-1.5 bg-blue-100 dark:bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-blue-100/30 shadow-sm">{customThreshold}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Action Banner */}
      {selectedServiceNos.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-rose-50 dark:bg-rose-950/20 p-3.5 px-4 rounded-xl border border-rose-100 dark:border-rose-900/30 gap-3 shadow-xs animate-fade-in">
          <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2">
            <AlertTriangle size={14} className="text-rose-500 shrink-0" />
            Selected <strong className="font-extrabold text-rose-800 dark:text-rose-300">{selectedServiceNos.length}</strong> {selectedServiceNos.length === 1 ? 'employee file' : 'employee files'}. You can delete them completely or clear selection.
          </span>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setConfirmState({
                  isOpen: true,
                  title: 'Delete Selected Employees',
                  message: `Are you sure you want to delete all ${selectedServiceNos.length} selected employee records and all of their training history? This action cannot be undone.`,
                  confirmText: 'Delete All',
                  isDanger: true,
                  onConfirm: () => {
                    onDeleteEmployee?.(selectedServiceNos);
                    setSelectedServiceNos([]);
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Trash2 size={13} /> Delete Selected ({selectedServiceNos.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedServiceNos([])}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 shadow-xs transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Grid count display */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-2">
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-700 dark:text-slate-300">{filteredData.length}</strong> of {complianceData.length} employees
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {complianceData.length > 0 && onClearAllRecords && (
            <button
              onClick={() => {
                setConfirmState({
                  isOpen: true,
                  title: 'Purge Whole Database',
                  message: 'Are you sure you want to purge ALL uploaded training records, category overrides, and compliance logs? This will empty the database.',
                  confirmText: 'Purge Database',
                  isDanger: true,
                  onConfirm: () => {
                    onClearAllRecords();
                    setSelectedServiceNos([]);
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }
                });
              }}
              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              title="Empty whole database records"
            >
              <AlertTriangle size={11} /> Purge Whole Database
            </button>
          )}
          {complianceData.length === 0 && onResetToSampleData && (
            <button
              onClick={() => {
                onResetToSampleData();
              }}
              className="text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              title="Load default demo records"
            >
              <RefreshCw size={11} className="animate-spin-once" /> Restore Demo Records
            </button>
          )}
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1 ml-1">
            <BadgeInfo size={11} /> Double-click a row to open history files
          </span>
        </div>
      </div>

      {/* Employees Table Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center select-none">
                  <input
                    type="checkbox"
                    checked={filteredData.length > 0 && filteredData.every(emp => selectedServiceNos.includes(emp.serviceNo))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServiceNos(filteredData.map(emp => emp.serviceNo));
                      } else {
                        setSelectedServiceNos([]);
                      }
                    }}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer w-3.5 h-3.5"
                  />
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-500 select-none" onClick={() => handleSort('employeeName')}>
                  <span className="flex items-center gap-1">Name <ArrowUpDown size={10} /></span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-500 select-none" onClick={() => handleSort('serviceNo')}>
                  <span className="flex items-center gap-1">Service No <ArrowUpDown size={10} /></span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-500 select-none" onClick={() => handleSort('vertical')}>
                  <span className="flex items-center gap-1">Vertical <ArrowUpDown size={10} /></span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-500 select-none" onClick={() => handleSort('designation')}>
                  <span className="flex items-center gap-1">Designation <ArrowUpDown size={10} /></span>
                </th>
                <th className="py-3 px-4 text-center">Category Pass Rates (A | B | C | D)</th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-500 text-right select-none" onClick={() => handleSort('overallCompliance')}>
                  <span className="flex items-center gap-1 justify-end">Overall % <ArrowUpDown size={10} /></span>
                </th>
                <th className="py-3 px-4 text-center">Cert Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {filteredData.length > 0 ? (
                filteredData.map((emp) => (
                  <tr
                    key={emp.serviceNo}
                    onDoubleClick={() => handleDoubleClickRow(emp)}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/50 cursor-pointer transition-colors duration-150 ${
                      selectedServiceNos.includes(emp.serviceNo) ? 'bg-blue-50/10 dark:bg-blue-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedServiceNos.includes(emp.serviceNo)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServiceNos(prev => [...prev, emp.serviceNo]);
                          } else {
                            setSelectedServiceNos(prev => prev.filter(id => id !== emp.serviceNo));
                          }
                        }}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer w-3.5 h-3.5"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{emp.employeeName}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">{emp.serviceNo}</td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium">{emp.vertical}</td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        emp.designation === 'Manager'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'
                      }`}>
                        {emp.designation || 'Assistant Manager'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {/* Grid representation of category completions */}
                      <div className="flex items-center justify-center gap-2">
                        {/* Fundamental */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">FUN</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.fundamentalPassed >= emp.fundamentalRequired ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                          }`}>
                            {emp.fundamentalPassed}/{emp.fundamentalRequired}
                          </span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-800 text-xs">|</span>
                        {/* A */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">CAT A</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.categoryAPassed >= emp.categoryARequired ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                          }`}>
                            {emp.categoryAPassed}/{emp.categoryARequired}
                          </span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-800 text-xs">|</span>
                        {/* B */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">CAT B</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.categoryBPassed >= emp.categoryBRequired ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                          }`}>
                            {emp.categoryBPassed}/{emp.categoryBRequired}
                          </span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-800 text-xs">|</span>
                        {/* C */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">CAT C</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.categoryCPassed >= emp.categoryCRequired ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                          }`}>
                            {emp.categoryCPassed}/{emp.categoryCRequired}
                          </span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-800 text-xs">|</span>
                        {/* D */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">CAT D</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            emp.categoryDPassed >= emp.categoryDRequired ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                          }`}>
                            {emp.categoryDPassed}/{emp.categoryDRequired}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              emp.overallCompliance >= 90 ? 'bg-emerald-500' : emp.overallCompliance >= 75 ? 'bg-blue-500' : emp.overallCompliance >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${emp.overallCompliance}%` }}
                          ></div>
                        </div>
                        <span>{emp.overallCompliance.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        emp.status === 'Compliant'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewEmployee(emp)}
                          className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors"
                          title="View employee logs and manual override"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmState({
                              isOpen: true,
                              title: 'Delete Employee',
                              message: `Are you sure you want to delete ${emp.employeeName} (${emp.serviceNo})? This will remove them and all their training logs from the database.`,
                              confirmText: 'Delete',
                              isDanger: true,
                              onConfirm: () => {
                                onDeleteEmployee?.(emp.serviceNo);
                                setConfirmState(prev => ({ ...prev, isOpen: false }));
                              }
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Delete employee completely"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No employees match the specified criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal/Drawer */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs font-sans">
          <div className="h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-left border-l border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee Audit File</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedEmp.employeeName}</h3>
                <div className="flex flex-wrap gap-2 items-center text-xs mt-1 text-slate-500">
                  <span className="font-mono">ID: {selectedEmp.serviceNo}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                    selectedEmp.designation === 'Manager'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100/40'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'
                  }`}>
                    {selectedEmp.designation || 'Assistant Manager'}
                  </span>
                  <span>•</span>
                  <span>{selectedEmp.vertical}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmState({
                      isOpen: true,
                      title: 'Delete Employee File',
                      message: `Are you sure you want to completely delete employee ${selectedEmp.employeeName} (${selectedEmp.serviceNo})? This will delete all of their files and compliance data.`,
                      confirmText: 'Delete File',
                      isDanger: true,
                      onConfirm: () => {
                        onDeleteEmployee?.(selectedEmp.serviceNo);
                        setSelectedEmp(null);
                        setConfirmState(prev => ({ ...prev, isOpen: false }));
                      }
                    });
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition flex items-center gap-1 text-xs font-bold"
                  title="Delete this entire employee file"
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline">Delete File</span>
                </button>
                <button 
                  onClick={() => setSelectedEmp(null)} 
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Category A Manual Edit Module */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Category A Completed Trainings</h4>
                    <p className="text-[10px] text-slate-400">Manually edited override values are persistent inside the SQLite database</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    (categoryAData.find(c => c.serviceNo === selectedEmp.serviceNo)?.source === 'manual')
                      ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600'
                      : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                  }`}>
                    {(categoryAData.find(c => c.serviceNo === selectedEmp.serviceNo)?.source === 'manual') ? 'Manual Override' : 'Import File'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingCatACount ?? 0}
                    onChange={(e) => setEditingCatACount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-center font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveCategoryAOverride}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    {saveSuccess ? <Check size={14} /> : <Save size={14} />}
                    {saveSuccess ? 'Saved' : 'Override Count'}
                  </button>
                </div>
              </div>

              {/* Summary breakdown per category */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Compliance Status Card</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Fundamental', passed: selectedEmp.fundamentalPassed, req: selectedEmp.fundamentalRequired, comp: selectedEmp.fundamentalCompliance },
                    { label: 'Category A', passed: selectedEmp.categoryAPassed, req: selectedEmp.categoryARequired, comp: selectedEmp.categoryACompliance },
                    { label: 'Category B', passed: selectedEmp.categoryBPassed, req: selectedEmp.categoryBRequired, comp: selectedEmp.categoryBCompliance },
                    { label: 'Category C', passed: selectedEmp.categoryCPassed, req: selectedEmp.categoryCRequired, comp: selectedEmp.categoryCCompliance },
                    { label: 'Category D', passed: selectedEmp.categoryDPassed, req: selectedEmp.categoryDRequired, comp: selectedEmp.categoryDCompliance }
                  ].map((cat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-center shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold truncate block mb-1">{cat.label}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{cat.passed} / {cat.req}</div>
                        <div className={`text-[10px] font-bold mt-1 ${cat.comp >= 100 ? 'text-emerald-500' : 'text-amber-500'}`}>{cat.comp.toFixed(0)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs mt-2">
                  <span className="font-semibold text-slate-500">Totals Assessment:</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Passed: <strong>{selectedEmp.totalPassed}</strong> / {selectedEmp.totalRequired}</span>
                    <span className="text-slate-300 dark:text-slate-800">|</span>
                    <span className={`font-bold text-sm ${selectedEmp.overallCompliance >= 90 ? 'text-emerald-500' : selectedEmp.overallCompliance >= 75 ? 'text-blue-500' : 'text-red-500'}`}>
                      {selectedEmp.overallCompliance.toFixed(1)}% Overall
                    </span>
                  </div>
                </div>
              </div>

              {/* Grouped training history from file records */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Imported Course Logs</h4>
                
                {['Fundamental', 'Category B', 'Category C', 'Category D'].map((category) => {
                  const matchingRecords = getEmployeeCourses(selectedEmp.serviceNo)
                    .filter(r => {
                      const c = r.category?.toLowerCase() || '';
                      if (category === 'Fundamental') return c === 'fundamental' || c === 'fundamentals';
                      if (category === 'Category B') return c === 'category b' || c === 'b';
                      if (category === 'Category C') return c === 'category c' || c === 'c';
                      if (category === 'Category D') return c === 'category d' || c === 'd';
                      return false;
                    });

                  return (
                    <div key={category} className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden">
                      <div className="bg-slate-50/70 dark:bg-slate-950/60 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{category} Trainings</span>
                        <span className="text-[10px] text-slate-400">{matchingRecords.length} records found</span>
                      </div>
                      
                      {matchingRecords.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                          {matchingRecords.map((rec) => (
                            <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-slate-50/30">
                              <div className="space-y-0.5 max-w-[75%]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 dark:text-slate-200">{rec.code}</span>
                                  <span className="text-[10px] text-slate-400 truncate">{rec.title}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  rec.status?.toLowerCase() === 'pass'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                    : rec.status?.toLowerCase() === 'fail'
                                    ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {rec.status}
                                </span>
                                <button
                                  onClick={() => {
                                    setConfirmState({
                                      isOpen: true,
                                      title: 'Delete Training Record',
                                      message: `Are you sure you want to delete training record for ${rec.code} - ${rec.title}?`,
                                      confirmText: 'Delete Record',
                                      isDanger: true,
                                      onConfirm: () => {
                                        onDeleteTrainingRecord?.(rec.id);
                                        setConfirmState(prev => ({ ...prev, isOpen: false }));
                                      }
                                    });
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors"
                                  title="Delete course log record"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 font-sans italic bg-white dark:bg-slate-900">
                          No training records found for this category.
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Note about Category A logs */}
                <div className="p-3 bg-blue-50/30 dark:bg-blue-950/5 border border-blue-100/20 rounded-xl flex gap-2.5 text-xs text-slate-500 leading-normal font-sans">
                  <BadgeInfo className="text-blue-500 shrink-0 mt-0.5" size={14} />
                  <span>Category A completions are fetched from bulk counts in the external Excel register or custom manual edits. No individual code entries are populated.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        isDanger={confirmState.isDanger}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
