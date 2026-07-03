/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { TrainingRecord, CategoryAData, ValidationLog } from '../types';
import { validateRecords, generateSampleExcelFiles } from '../utils';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import ConfirmDialog from './ConfirmDialog';

interface ImporterProps {
  onImportTrainingRecords: (records: TrainingRecord[], newEmployees: { name: string; serviceNo: string; vertical: string; designation?: string }[], logs: ValidationLog[]) => void;
  onImportCategoryAData: (data: CategoryAData[]) => void;
  onClearAllRecords?: () => void;
  onResetToSampleData?: () => void;
}

export default function Importer({ onImportTrainingRecords, onImportCategoryAData, onClearAllRecords, onResetToSampleData }: ImporterProps) {
  // States
  const [activeTab, setActiveTab] = useState<'training' | 'categoryA'>('training');
  const [isDragging, setIsDragging] = useState(false);
  
  // Mapping wizard states
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string; logCount?: number }>({ type: null, message: '' });

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expected standard schemas
  const expectedTrainingFields = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'serviceNo', label: 'Service No / Number' },
    { key: 'vertical', label: 'Vertical / Division' },
    { key: 'designation', label: 'Designation / Role' },
    { key: 'category', label: 'Training Category' },
    { key: 'code', label: 'Training Code' },
    { key: 'title', label: 'Training Title' },
    { key: 'status', label: 'Status (Pass/Fail)' }
  ];

  // Try to auto-map headers
  const autoMapHeaders = (headers: string[]) => {
    const autoMap: Record<string, string> = {};
    headers.forEach(h => {
      const lower = h.trim().toLowerCase();
      if (lower.includes('name')) autoMap['employeeName'] = h;
      else if (lower.includes('service') || lower.includes('no') || lower.includes('number')) autoMap['serviceNo'] = h;
      else if (lower.includes('vertical') || lower.includes('division') || lower.includes('dept')) autoMap['vertical'] = h;
      else if (lower.includes('designation') || lower.includes('role') || lower.includes('desig')) autoMap['designation'] = h;
      else if (lower.includes('category') || lower.includes('class')) autoMap['category'] = h;
      else if (lower.includes('code') || lower.includes('course')) autoMap['code'] = h;
      else if (lower.includes('title') || lower.includes('subject')) autoMap['title'] = h;
      else if (lower.includes('status') || lower.includes('result')) autoMap['status'] = h;
    });
    return autoMap;
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Parse Excel file using SheetJS
  const processFile = (file: File) => {
    setFileName(file.name);
    setFeedback({ type: null, message: '' });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        
        // Get rows with headers
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length === 0) {
          setFeedback({ type: 'error', message: 'The uploaded worksheet is completely empty!' });
          return;
        }

        const headers = (data[0] as string[]).map(h => String(h || '').trim()).filter(h => h !== '');
        const rows = XLSX.utils.sheet_to_json(ws); // list of key-value maps

        setExcelHeaders(headers);
        setUploadedData(rows);

        if (activeTab === 'training') {
          // Open mapping wizard
          const auto = autoMapHeaders(headers);
          setMapping(auto);
        } else {
          // Category A schema is simple: Service No and Count
          processCategoryAFile(rows, headers);
        }
      } catch (err) {
        setFeedback({ type: 'error', message: 'Failed to read Excel workbook: ' + (err as Error).message });
      }
    };
    reader.readAsBinaryString(file);
  };

  // Import wizard complete for training records
  const handleCommitTrainingRecords = () => {
    if (uploadedData.length === 0) return;

    // Convert excel columns to expected column titles
    const normalizedRows = uploadedData.map(row => {
      return {
        'Employee Name': row[mapping['employeeName']] || '',
        'Service No': row[mapping['serviceNo']] || '',
        'Vertical': row[mapping['vertical']] || '',
        'Designation': row[mapping['designation']] || '',
        'Training Category': row[mapping['category']] || '',
        'Training Code': row[mapping['code']] || '',
        'Training Title': row[mapping['title']] || '',
        'Status': row[mapping['status']] || 'Pass'
      };
    });

    // Run validator
    const { logs, validRecords, newEmployees } = validateRecords(normalizedRows, fileName);
    onImportTrainingRecords(validRecords, newEmployees, logs);

    setFeedback({
      type: 'success',
      message: `Parsed and imported ${validRecords.length} training records! Detected ${newEmployees.length} unique employees.`,
      logCount: logs.length
    });

    // Reset wizard
    setExcelHeaders([]);
    setUploadedData([]);
  };

  // Immediate import of Category A completed spreadsheet
  const processCategoryAFile = (rows: any[], headers: string[]) => {
    // Find service no column and count column
    let serviceCol = '';
    let countCol = '';

    headers.forEach(h => {
      const lower = h.trim().toLowerCase();
      if (lower.includes('service') || lower.includes('no') || lower.includes('emp')) serviceCol = h;
      if (lower.includes('completed') || lower.includes('count') || lower.includes('total') || lower.includes('a')) countCol = h;
    });

    if (!serviceCol || !countCol) {
      // Fallback to first two columns
      serviceCol = headers[0];
      countCol = headers[1] || '';
    }

    if (!serviceCol) {
      setFeedback({ type: 'error', message: 'Could not auto-detect the Employee Service Number column in Category A file!' });
      return;
    }

    const categoryARecords: CategoryAData[] = [];
    rows.forEach(r => {
      const serviceNo = String(r[serviceCol] || '').trim();
      const countVal = parseInt(r[countCol]) || 0;
      if (serviceNo) {
        categoryARecords.push({
          serviceNo,
          completedCount: countVal,
          source: 'import'
        });
      }
    });

    onImportCategoryAData(categoryARecords);
    setFeedback({
      type: 'success',
      message: `Successfully imported Category A completed tallies for ${categoryARecords.length} employees!`
    });
  };

  // Template Downloader
  const handleDownloadSample = () => {
    const { mainSample, categoryASample } = generateSampleExcelFiles();
    
    // Save files
    const saveBlob = (blob: Blob, name: string) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    if (activeTab === 'training') {
      saveBlob(mainSample, 'TCMS_Training_Records_Template.xlsx');
    } else {
      saveBlob(categoryASample, 'TCMS_Category_A_Completed_Template.xlsx');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4" id="importer-component">
      {/* Importer tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
        <button
          onClick={() => { setActiveTab('training'); setExcelHeaders([]); setUploadedData([]); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'training' 
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <FileSpreadsheet size={13} /> Training Records Excel
        </button>
        <button
          onClick={() => { setActiveTab('categoryA'); setExcelHeaders([]); setUploadedData([]); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'categoryA' 
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Upload size={13} /> Category A Completed Excel
        </button>
      </div>

      {/* Main Upload Area */}
      {excelHeaders.length === 0 && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 scale-[0.99]' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-950/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 bg-blue-50 dark:bg-slate-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-xs">
              <Upload size={20} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & drop your Excel workbook here</h4>
              <p className="text-[11px] text-slate-400">or click to browse local files (formats: .xlsx, .xls)</p>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Wizard Panel */}
      {activeTab === 'training' && excelHeaders.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Automatic Column Mapping Wizard</h4>
            <p className="text-[11px] text-slate-400">Map columns found in your Excel spreadsheet to the expected TCMS database fields.</p>
          </div>

          <div className="space-y-2 border-t border-b border-slate-200 dark:border-slate-800 py-3 max-h-[260px] overflow-y-auto">
            {expectedTrainingFields.map(field => (
              <div key={field.key} className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 rounded-lg gap-2 text-[11px]">
                <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{field.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">maps to</span>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-xs"
                  >
                    <option value="">-- Ignored Column --</option>
                    {excelHeaders.map((header, idx) => (
                      <option key={idx} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => { setExcelHeaders([]); setUploadedData([]); }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cancel Upload
            </button>
            <button
              onClick={handleCommitTrainingRecords}
              disabled={!mapping['serviceNo'] || !mapping['category'] || !mapping['code']}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-bold shadow-sm transition ${
                (!mapping['serviceNo'] || !mapping['category'] || !mapping['code'])
                  ? 'bg-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Parse and Load Records <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Alert banners */}
      {feedback.type && (
        <div className={`p-3.5 rounded-xl flex gap-3 text-xs leading-relaxed animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 text-slate-600 dark:text-slate-400' 
            : 'bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 text-slate-600 dark:text-slate-400'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
          ) : (
            <AlertTriangle className="text-rose-500 shrink-0" size={16} />
          )}
          <div className="space-y-0.5">
            <strong className={`font-bold block ${feedback.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {feedback.type === 'success' ? 'Import Complete' : 'Import Error'}
            </strong>
            <p>{feedback.message}</p>
            {feedback.logCount !== undefined && feedback.logCount > 0 && (
              <p className="text-[11px] font-semibold text-blue-500 mt-0.5">
                Generated {feedback.logCount} validation warnings. View them in the Validation tab.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Guide & Sample Download Box */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle size={13} className="text-slate-400" /> Getting Started Guidelines
        </h4>
        <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
          <p>
            To trial calculations immediately, click below to download pre-formatted spreadsheet templates. You can write mock values or copy real data directly!
          </p>
          <div className="flex gap-3 pt-0.5">
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs transition"
            >
              <Download size={13} /> Download {activeTab === 'training' ? 'Records' : 'Category A'} Template
            </button>
          </div>
        </div>
      </div>

      {/* Database Maintenance Panel */}
      <div className="bg-rose-50/40 dark:bg-rose-950/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/20 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
          <AlertTriangle size={13} className="text-rose-500" /> System Database Administration
        </h4>
        <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
          <p>
            Perform database-wide cleanup operations. You can purge all active datasets to load a new organization profile, or restore default HR demo data.
          </p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setConfirmState({
                  isOpen: true,
                  title: 'Purge All Uploaded Records',
                  message: 'Are you sure you want to clear ALL uploaded training records, override registries, and compliance logs? This cannot be undone.',
                  confirmText: 'Purge All',
                  isDanger: true,
                  onConfirm: () => {
                    onClearAllRecords?.();
                    setFeedback({ type: 'success', message: 'All system datasets, training records, and category overrides have been successfully purged.' });
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Purge All Uploaded Records
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmState({
                  isOpen: true,
                  title: 'Restore Organizational Demo Records',
                  message: 'Are you sure you want to reset the system database back to the default organizational demo sample records?',
                  confirmText: 'Restore Demo',
                  isDanger: false,
                  onConfirm: () => {
                    onResetToSampleData?.();
                    setFeedback({ type: 'success', message: 'Demo database has been successfully restored to original training registries.' });
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs transition cursor-pointer"
            >
              Restore Organizational Demo Records
            </button>
          </div>
        </div>
      </div>
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
