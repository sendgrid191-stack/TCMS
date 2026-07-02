/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, FileText, Settings, BadgeAlert, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PythonExporter() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    // Copy a command or hint. Since we have /python/tcms_desktop.py written in the workspace,
    // they can download the workspace as a zip, or they can copy the main python script content.
    navigator.clipboard.writeText(`python python/tcms_desktop.py`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pyinstallerCommand = `pyinstaller --noconfirm --onedir --windowed --add-data "tcms_database.db;." tcms_desktop.py`;

  return (
    <div className="max-w-3xl mx-auto space-y-4" id="python-exporter-container">
      {/* Title */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-xl shadow-md border border-slate-800/80 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Desktop Release Kit</span>
          <h3 className="text-lg font-bold font-sans">Python CustomTkinter Exporter</h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            The full, working Python CustomTkinter desktop app code is written to your workspace. Run it locally using SQLite or compile it to a standalone executable for Windows or MacOS deployment!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 text-slate-800 opacity-20 pointer-events-none">
          <Terminal size={140} strokeWidth={1} />
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        
        {/* Step-by-Step Running Instructions */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Settings size={13} className="text-blue-500" /> Local Setup Instructions
            </h4>
            
            <ol className="list-decimal pl-4 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <li>
                <strong>Install Python 3.12+</strong> on your system. Enable the <code className="bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200">Add to PATH</code> checkbox during installation.
              </li>
              <li>
                Open your local command line (Terminal / PowerShell) and install the required dependencies:
                <pre className="bg-slate-900 text-slate-200 p-2 rounded-lg text-[10px] font-mono mt-1 select-all overflow-x-auto">
                  pip install customtkinter pandas openpyxl matplotlib
                </pre>
              </li>
              <li>
                Download or copy the <code className="bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200 text-blue-500 text-[11px]">python/tcms_desktop.py</code> file from this workspace to your local folder.
              </li>
              <li>
                Run the desktop application instantly:
                <pre className="bg-slate-900 text-slate-200 p-2 rounded-lg text-[10px] font-mono mt-1 select-all overflow-x-auto">
                  python tcms_desktop.py
                </pre>
              </li>
            </ol>
          </div>

          <div className="p-2.5 bg-blue-50/50 dark:bg-slate-950/20 rounded-lg border border-blue-100/20 text-[11px] text-slate-500 leading-normal">
            <strong>System SQLite DB:</strong> The app creates <code className="font-mono text-blue-500">tcms_database.db</code> on the first run, pre-populating standard completion policies automatically!
          </div>
        </div>

        {/* PyInstaller Executable compiler */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal size={13} className="text-emerald-500" /> PyInstaller Compiler Guide
            </h4>
            
            <ol className="list-decimal pl-4 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <li>
                Install PyInstaller on your local computer:
                <pre className="bg-slate-900 text-slate-200 p-2 rounded-lg text-[10px] font-mono mt-1 select-all overflow-x-auto">
                  pip install pyinstaller
                </pre>
              </li>
              <li>
                Compile the Python script to a standalone bundle directory:
                <pre className="bg-slate-900 text-slate-200 p-2 rounded-lg text-[10px] font-mono mt-1 select-all overflow-x-auto truncate">
                  {pyinstallerCommand}
                </pre>
              </li>
              <li>
                Alternatively, pack the entire system into a <strong>Single Standalone Portable File (.exe)</strong>:
                <pre className="bg-slate-900 text-slate-200 p-2 rounded-lg text-[10px] font-mono mt-1 select-all overflow-x-auto">
                  pyinstaller --onefile --windowed tcms_desktop.py
                </pre>
              </li>
            </ol>
          </div>

          <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-100/20 text-[11px] text-slate-500 leading-normal">
            <strong>Distribution Tip:</strong> Find your compiled application inside the <code className="font-mono text-amber-600">dist/</code> directory. Distribute the executable folder securely inside your organization.
          </div>
        </div>

      </div>

      {/* User Documentation and Maintenance Guide */}
      <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <FileText size={13} className="text-purple-500" /> User Documentation & Maintenance Manual
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold block">1. Excel Data Standard</strong>
            <p>
              Uploaded spreadsheets must contain Employee Name, Service No, Vertical, Training Category, Training Code, Training Title, and Status. Category A completed counters are managed in a separate sheet mapped by Service No.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold block">2. Validation Protocols</strong>
            <p>
              The calculation pipeline ignores empty rows, duplicate passes, fails, and withdrawals. Service numbers are treated as immutable primary keys to guarantee audit-safe consistency.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold block">3. DB Overrides</strong>
            <p>
              Manual edits to Category A passed tallies are immediately committed to SQLite database storage, superseding imported values, and triggering automatic real-time metric recalculation.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            <ShieldCheck size={12} /> Compliance Standard Approved
          </span>
          <span>Version: Desktop Release v1.1.0</span>
        </div>
      </div>
    </div>
  );
}
