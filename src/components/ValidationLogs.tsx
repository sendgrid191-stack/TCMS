/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ValidationLog } from '../types';
import { ShieldAlert, AlertTriangle, Info, Search, Filter, Trash2 } from 'lucide-react';

interface ValidationLogsProps {
  logs: ValidationLog[];
  onClearLogs: () => void;
}

export default function ValidationLogs({ logs, onClearLogs }: ValidationLogsProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.field.toLowerCase().includes(search.toLowerCase()) ||
      (log.value && log.value.toLowerCase().includes(search.toLowerCase()));
    
    const matchesSeverity = 
      severityFilter === 'All' || 
      log.type === severityFilter.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  const errorsCount = logs.filter(l => l.type === 'error').length;
  const warningsCount = logs.filter(l => l.type === 'warning').length;
  const infosCount = logs.filter(l => l.type === 'info').length;

  return (
    <div className="space-y-4" id="validation-logs-container">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Errors card */}
        <div className="bg-rose-50/50 dark:bg-rose-950/5 border border-rose-200/50 dark:border-rose-900/30 p-3.5 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Lethal Errors</span>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{errorsCount}</p>
            <span className="text-[10px] text-slate-400 block">Blocks record imports</span>
          </div>
          <div className="h-9 w-9 bg-rose-100/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>

        {/* Warnings card */}
        <div className="bg-amber-50/50 dark:bg-amber-950/5 border border-amber-200/50 dark:border-amber-900/30 p-3.5 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Warnings</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{warningsCount}</p>
            <span className="text-[10px] text-slate-400 block">Non-ideal data values</span>
          </div>
          <div className="h-9 w-9 bg-amber-100/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Info/Trace cards */}
        <div className="bg-blue-50/50 dark:bg-blue-950/5 border border-blue-200/50 dark:border-blue-900/30 p-3.5 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Info Traces</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{infosCount}</p>
            <span className="text-[10px] text-slate-400 block">Deduplications & events</span>
          </div>
          <div className="h-9 w-9 bg-blue-100/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Info size={18} />
          </div>
        </div>
      </div>

      {/* Filter and search actions bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter log messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Severity selector dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Severity Levels</option>
            <option value="Error">Errors Only</option>
            <option value="Warning">Warnings Only</option>
            <option value="Info">Info Logs Only</option>
          </select>
        </div>

        {/* Clear logs button */}
        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/10 dark:hover:bg-rose-950/35 border border-rose-200/50 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 shadow-xs transition shrink-0"
          >
            <Trash2 size={13} /> Clear Logs Cache
          </button>
        )}
      </div>

      {/* Error Log Viewer list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-500">Live Validation Tracer ({filteredLogs.length} entries shown)</span>
        </div>
        
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-start gap-3 hover:bg-slate-50/20">
                {/* Type Tag badge */}
                <div className="sm:w-28 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    log.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                      : log.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                      : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                  }`}>
                    {log.type === 'error' ? <ShieldAlert size={10} /> : log.type === 'warning' ? <AlertTriangle size={10} /> : <Info size={10} />}
                    {log.type}
                  </span>
                  {log.rowNum && (
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-semibold">Row: {log.rowNum}</span>
                  )}
                </div>

                {/* Log Description details */}
                <div className="space-y-1 flex-1">
                  <div className="flex gap-2 items-center text-xs">
                    <strong className="text-slate-700 dark:text-slate-300">Field: {log.field}</strong>
                    {log.fileName && (
                      <span className="text-[10px] text-slate-400">({log.fileName})</span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans text-xs">{log.message}</p>
                  {log.value && (
                    <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/60 inline-block">
                      Value Provided: &quot;{log.value}&quot;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs font-sans italic bg-white dark:bg-slate-900">
            No validation trace messages found in cache. All systems operational.
          </div>
        )}
      </div>
    </div>
  );
}
