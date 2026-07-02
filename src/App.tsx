/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  DEFAULT_COMPLIANCE_POLICY, 
  DEFAULT_DESIGNATION_POLICIES,
  INITIAL_EMPLOYEES, 
  INITIAL_TRAINING_RECORDS, 
  INITIAL_CATEGORY_A_RECORDS 
} from './sampleData';
import { calculateCompliance } from './utils';
import { 
  TrainingRecord, 
  CategoryAData, 
  CompliancePolicy, 
  ValidationLog, 
  VerticalSummary, 
  CategorySummary,
  ManualOverride
} from './types';

// Subcomponents
import Dashboard from './components/Dashboard';
import EmployeeBrowser from './components/EmployeeBrowser';
import PolicyManager from './components/PolicyManager';
import Importer from './components/Importer';
import Reports from './components/Reports';
import ValidationLogs from './components/ValidationLogs';
import PythonExporter from './components/PythonExporter';

// Icons
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UploadCloud, 
  FileSpreadsheet, 
  ShieldAlert, 
  Terminal, 
  Building2, 
  BookOpen, 
  Globe, 
  Sun, 
  Moon,
  HelpCircle,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Core application data states
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>(INITIAL_TRAINING_RECORDS);
  const [categoryAData, setCategoryAData] = useState<CategoryAData[]>(INITIAL_CATEGORY_A_RECORDS);
  const [policies, setPolicies] = useState<{ 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy }>(DEFAULT_DESIGNATION_POLICIES);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);
  const [manualOverrides, setManualOverrides] = useState<ManualOverride[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Side drawer selection / search trigger
  const [selectedEmployeeNo, setSelectedEmployeeNo] = useState<string | null>(null);

  // Global recalculation metrics
  const complianceData = useMemo(() => {
    return calculateCompliance(employees, trainingRecords, categoryAData, policies, manualOverrides);
  }, [employees, trainingRecords, categoryAData, policies, manualOverrides]);

  // Record/employee deletion handlers
  const handleDeleteEmployee = (serviceNoOrNos: string | string[]) => {
    const nos = Array.isArray(serviceNoOrNos) ? serviceNoOrNos : [serviceNoOrNos];
    const noSet = new Set(nos);
    
    setEmployees(prev => prev.filter(emp => !noSet.has(emp.serviceNo)));
    setTrainingRecords(prev => prev.filter(rec => !noSet.has(rec.serviceNo)));
    setCategoryAData(prev => prev.filter(cat => !noSet.has(cat.serviceNo)));
    setManualOverrides(prev => prev.filter(o => !noSet.has(o.serviceNo)));

    if (selectedEmployeeNo && noSet.has(selectedEmployeeNo)) {
      setSelectedEmployeeNo(null);
    }
  };

  const handleDeleteTrainingRecord = (recordId: string) => {
    setTrainingRecords(prev => prev.filter(rec => rec.id !== recordId));
  };

  const handleClearAllRecords = () => {
    setTrainingRecords([]);
    setCategoryAData([]);
    setEmployees([]);
    setValidationLogs([]);
    setManualOverrides([]);
  };

  const handleResetToSampleData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setTrainingRecords(INITIAL_TRAINING_RECORDS);
    setCategoryAData(INITIAL_CATEGORY_A_RECORDS);
    setValidationLogs([]);
    setManualOverrides([]);
  };

  // Compute unique list of verticals
  const verticalsList = useMemo(() => {
    return Array.from(new Set(employees.map(e => e.vertical).filter(Boolean)));
  }, [employees]);

  // Aggregate Vertical summary metrics
  const verticalsSummary = useMemo(() => {
    const verticalMap = new Map<string, {
      vertical: string;
      employees: typeof complianceData;
    }>();

    complianceData.forEach(e => {
      let group = verticalMap.get(e.vertical);
      if (!group) {
        group = { vertical: e.vertical, employees: [] };
        verticalMap.set(e.vertical, group);
      }
      group.employees.push(e);
    });

    const summary: VerticalSummary[] = [];
    verticalMap.forEach((val, key) => {
      const count = val.employees.length || 1;
      const sumOverall = val.employees.reduce((acc, x) => acc + x.overallCompliance, 0);
      const sumFun = val.employees.reduce((acc, x) => acc + x.fundamentalCompliance, 0);
      const sumA = val.employees.reduce((acc, x) => acc + x.categoryACompliance, 0);
      const sumB = val.employees.reduce((acc, x) => acc + x.categoryBCompliance, 0);
      const sumC = val.employees.reduce((acc, x) => acc + x.categoryCCompliance, 0);
      const sumD = val.employees.reduce((acc, x) => acc + x.categoryDCompliance, 0);

      summary.push({
        vertical: key,
        employeeCount: val.employees.length,
        avgCompliance: sumOverall / count,
        fundamentalCompliance: sumFun / count,
        categoryACompliance: sumA / count,
        categoryBCompliance: sumB / count,
        categoryCCompliance: sumC / count,
        categoryDCompliance: sumD / count
      });
    });

    return summary;
  }, [complianceData]);

  // Aggregate Category summary metrics
  const categoriesSummary = useMemo(() => {
    const categories = [
      { key: 'Fundamental', label: 'Fundamental Trainings' },
      { key: 'Category A', label: 'Category A Workflows' },
      { key: 'Category B', label: 'Category B Modules' },
      { key: 'Category C', label: 'Category C Guidelines' },
      { key: 'Category D', label: 'Category D Platforms' }
    ];

    return categories.map(cat => {
      let passedSum = 0;
      let reqSum = 0;

      complianceData.forEach(e => {
        if (cat.key === 'Fundamental') {
          passedSum += Math.min(e.fundamentalPassed, e.fundamentalRequired);
          reqSum += e.fundamentalRequired;
        } else if (cat.key === 'Category A') {
          passedSum += Math.min(e.categoryAPassed, e.categoryARequired);
          reqSum += e.categoryARequired;
        } else if (cat.key === 'Category B') {
          passedSum += Math.min(e.categoryBPassed, e.categoryBRequired);
          reqSum += e.categoryBRequired;
        } else if (cat.key === 'Category C') {
          passedSum += Math.min(e.categoryCPassed, e.categoryCRequired);
          reqSum += e.categoryCRequired;
        } else if (cat.key === 'Category D') {
          passedSum += Math.min(e.categoryDPassed, e.categoryDRequired);
          reqSum += e.categoryDRequired;
        }
      });

      return {
        categoryName: cat.label,
        passedCount: passedSum,
        requiredTotal: reqSum,
        avgCompliance: reqSum > 0 ? (passedSum / reqSum) * 100 : 100
      };
    });
  }, [complianceData]);

  // Action handlers
  const handleUpdatePolicies = (newPolicies: { 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy }) => {
    setPolicies(newPolicies);
  };

  const handleImportTrainingRecords = (
    newRecords: TrainingRecord[], 
    newEmployeesList: { name: string; serviceNo: string; vertical: string; designation?: string }[],
    logs: ValidationLog[]
  ) => {
    // Append records
    setTrainingRecords(prev => [...newRecords, ...prev]);
    
    // Merge validation logs
    setValidationLogs(prev => [...logs, ...prev]);

    // Check for any new unique employees
    if (newEmployeesList.length > 0) {
      setEmployees(prev => {
        const existingNos = new Set(prev.map(e => e.serviceNo));
        const filteredNew = newEmployeesList.filter(e => !existingNos.has(e.serviceNo));
        return [...prev, ...filteredNew];
      });
    }
  };

  const handleImportCategoryAData = (newData: CategoryAData[]) => {
    setCategoryAData(prev => {
      const map = new Map<string, CategoryAData>();
      prev.forEach(d => map.set(d.serviceNo, d));
      
      // Merge new data (overwriting import values but keeping manual ones if preferred)
      newData.forEach(d => {
        const existing = map.get(d.serviceNo);
        if (!existing || existing.source !== 'manual') {
          map.set(d.serviceNo, d);
        }
      });
      return Array.from(map.values());
    });
  };

  // Callback to update Category A from details drawer
  const handleSaveCategoryAOverride = (serviceNo: string, count: number) => {
    setCategoryAData(prev => {
      const map = new Map<string, CategoryAData>();
      prev.forEach(d => map.set(d.serviceNo, d));
      map.set(serviceNo, {
        serviceNo,
        completedCount: count,
        source: 'manual'
      });
      return Array.from(map.values());
    });
  };

  const handleUpdateOverride = (
    serviceNo: string,
    category: 'Fundamental' | 'Category A' | 'Category B' | 'Category C' | 'Category D',
    count: number | null
  ) => {
    setManualOverrides(prev => {
      const filtered = prev.filter(o => !(o.serviceNo === serviceNo && o.category === category));
      if (count === null) {
        return filtered;
      } else {
        return [...filtered, { serviceNo, category, completedCount: count }];
      }
    });
  };

  const handleClearLogs = () => {
    setValidationLogs([]);
  };

  // Nav actions
  const handleViewEmployeeFromReport = (serviceNo: string) => {
    setSelectedEmployeeNo(serviceNo);
    setActiveTab('employees');
  };

  // Counts of non-compliant and compliant
  const totalEmployees = complianceData.length;
  const compliantCount = complianceData.filter(e => e.status === 'Compliant').length;
  const avgCompliance = totalEmployees > 0 
    ? complianceData.reduce((acc, x) => acc + x.overallCompliance, 0) / totalEmployees 
    : 100;

  const errorLogsCount = validationLogs.filter(l => l.type === 'error').length;
  const warningLogsCount = validationLogs.filter(l => l.type === 'warning').length;

  return (
    <div className={`min-h-screen font-sans flex text-slate-800 dark:text-slate-100 transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50/50'}`} id="tcms-root-layout">
      
      {/* 1. Navigation Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between" id="tcms-sidebar">
        
        {/* Top brand header */}
        <div className="space-y-6 p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-base tracking-wide shadow-md">
              TC
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide uppercase leading-tight font-sans">TCMS Portal</h1>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">HRD Department</span>
            </div>
          </div>

          {/* Quick Metrics Inside Sidebar */}
          <div className="bg-slate-800/40 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Staff</span>
              <span className="font-bold text-white">{totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Compliant</span>
              <span className="font-bold text-emerald-400">{compliantCount} ({((compliantCount / (totalEmployees || 1)) * 100).toFixed(0)}%)</span>
            </div>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${(compliantCount / (totalEmployees || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Sidebar Menu items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'employees', label: 'Employee Browser', icon: Users },
              { id: 'policy', label: 'Completion Policy', icon: Settings },
              { id: 'importer', label: 'Import Central', icon: UploadCloud },
              { id: 'reports', label: 'Corporate Reports', icon: FileSpreadsheet },
              { id: 'logs', label: 'Error Log Tracer', icon: ShieldAlert, badge: errorLogsCount + warningLogsCount },
              { id: 'desktop', label: 'Desktop Release Kit', icon: Terminal }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      activeTab === item.id ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer branding */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Corporate Audit Mode</span>
            <span className="h-2 w-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Calculations are performed strictly in memory and persistent inside temporary caches.
          </p>
        </div>
      </aside>

      {/* 2. Main content stage */}
      <div className="flex-1 flex flex-col min-w-0" id="tcms-main-stage">
        
        {/* Main Navbar Header */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between" id="tcms-header">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {activeTab === 'dashboard' && 'Executive Dashboard'}
              {activeTab === 'employees' && 'Employee Tally Browser'}
              {activeTab === 'policy' && 'Completion Policy Guidelines'}
              {activeTab === 'importer' && 'Bulk Excel Import Desk'}
              {activeTab === 'reports' && 'Audit Record Reports'}
              {activeTab === 'logs' && 'Validation Warning Traces'}
              {activeTab === 'desktop' && 'Desktop Client Compilation Kit'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition"
              title="Toggle theme mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Quick Validation Alerts pill */}
            {(errorLogsCount + warningLogsCount) > 0 && (
              <div 
                onClick={() => setActiveTab('logs')}
                className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 hover:bg-amber-100/30 px-3 py-1 rounded-full text-[11px] text-amber-700 dark:text-amber-400 font-bold cursor-pointer transition animate-fade-in"
              >
                <AlertTriangle size={12} />
                <span>{errorLogsCount + warningLogsCount} Issue Logs</span>
              </div>
            )}
          </div>
        </header>

        {/* Sub Navigation Bar for Mobile screens */}
        <div className="md:hidden flex bg-slate-900 text-slate-300 p-2 overflow-x-auto gap-1 border-b border-slate-800">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'employees', label: 'Employees' },
            { id: 'policy', label: 'Policy' },
            { id: 'importer', label: 'Importer' },
            { id: 'reports', label: 'Reports' },
            { id: 'logs', label: 'Logs' },
            { id: 'desktop', label: 'Desktop Kit' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main interactive viewport container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto" id="tcms-viewport">
          
          {activeTab === 'dashboard' && (
            <Dashboard 
              complianceData={complianceData} 
              verticalsSummary={verticalsSummary} 
              categoriesSummary={categoriesSummary}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeBrowser 
              complianceData={complianceData} 
              trainingRecords={trainingRecords}
              categoryAData={categoryAData}
              manualOverrides={manualOverrides}
              verticals={verticalsList}
              onUpdateCategoryA={handleSaveCategoryAOverride}
              onUpdateOverride={handleUpdateOverride}
              selectedEmployeeNo={selectedEmployeeNo}
              onClearSelection={() => setSelectedEmployeeNo(null)}
              onDeleteEmployee={handleDeleteEmployee}
              onDeleteTrainingRecord={handleDeleteTrainingRecord}
              onClearAllRecords={handleClearAllRecords}
              onResetToSampleData={handleResetToSampleData}
            />
          )}

          {activeTab === 'policy' && (
            <PolicyManager 
              policies={policies} 
              onUpdatePolicies={handleUpdatePolicies} 
            />
          )}

          {activeTab === 'importer' && (
            <Importer 
              onImportTrainingRecords={handleImportTrainingRecords}
              onImportCategoryAData={handleImportCategoryAData}
              onClearAllRecords={handleClearAllRecords}
              onResetToSampleData={handleResetToSampleData}
            />
          )}

          {activeTab === 'reports' && (
            <Reports 
              complianceData={complianceData}
              verticalsSummary={verticalsSummary}
              categoriesSummary={categoriesSummary}
              validationLogs={validationLogs}
              trainingRecords={trainingRecords}
              onViewEmployee={handleViewEmployeeFromReport}
            />
          )}

          {activeTab === 'logs' && (
            <ValidationLogs 
              logs={validationLogs}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === 'desktop' && (
            <PythonExporter />
          )}

        </main>
      </div>
    </div>
  );
}
