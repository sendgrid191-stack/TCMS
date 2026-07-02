/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, LayoutDashboard, Database, UploadCloud, AlertCircle, FileText, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
}

export default function LandingPage({ onLoginSuccess, isDarkMode }: LandingPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Exact user constraint:
    // Username: admin
    // Password: [blank]
    if (username !== 'admin') {
      setError('Invalid administrator username.');
      return;
    }

    if (password !== 'Ideatrg@3305') {
      setError('Incorrect administrator password.');
      return;
    }

    setError(null);
    onLoginSuccess();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'}`} id="tcms-landing-container">
      
      {/* Public Header */}
      <header className="h-20 border-b border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 lg:px-16 flex items-center justify-between sticky top-0 z-40" id="tcms-landing-header">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg tracking-wide shadow-md shadow-blue-500/20">
            TC
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-wide uppercase leading-tight font-sans">TCMS Portal</h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-widest">HRD Department</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gateway Active</span>
        </div>
      </header>

      {/* Main split viewport */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-6 lg:px-16 py-12 gap-12 lg:gap-16 items-center justify-center" id="tcms-landing-main">
        
        {/* Left Side: Dynamic System Presentation */}
        <div className="flex-1 space-y-8 max-w-xl" id="tcms-landing-info">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
              <Shield size={12} /> Organizational Security Registry
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
              Training Compliance &amp; Policy Management Portal
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Welcome to the corporate training validation engine. This platform calculates regulatory requirements, maps structural hierarchies, processes spreadsheet matrices, and guarantees institutional readiness audits.
            </p>
          </div>

          {/* Core System highlights */}
          <div className="grid sm:grid-cols-2 gap-4" id="tcms-system-features">
            {[
              {
                icon: LayoutDashboard,
                title: "Executive Analytics",
                desc: "High-level summary panels showing completion ratios, risk trends, and compliance metrics by functional vertical."
              },
              {
                icon: Database,
                title: "Manual Compliance Overrides",
                desc: "Direct and persistent override tools for custom-editing training outcomes in every requirement category."
              },
              {
                icon: UploadCloud,
                title: "Excel Data Importer",
                desc: "Advanced auto-detect algorithms that parse external rosters, course files, and tallies without manual re-keying."
              },
              {
                icon: FileText,
                title: "Corporate Audit Exporter",
                desc: "Standalone python compilation tools and printable logs detailing compliance alerts and missing credentials."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-2">
                  <div className="h-8 w-8 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual Administrator Login Frame */}
        <div className="w-full max-w-md shrink-0" id="tcms-landing-login-panel">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-slate-950/40 relative overflow-hidden">
            
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Admin Authentication</h3>
              <p className="text-xs text-slate-400">Please authenticate with administrative credentials to access the data panels.</p>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 mb-5 animate-fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authentication Failed</span>
                  <p className="mt-0.5 text-[11px] opacity-90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute right-3.5 top-2.5 text-slate-400">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-black px-1.5 py-0.5 rounded">
                      admin
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Password</label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Required</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/15 transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Lock size={13} />
                <span>Sign In to Dashboard</span>
                <ChevronRight size={13} />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">
                Standard administrator access. All data resets on purge.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-4 text-center px-6" id="tcms-landing-footer">
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          &copy; 2026 Training Compliance Management System (TCMS). Unauthorized duplication of HRD records is governed by organization directives.
        </p>
      </footer>
    </div>
  );
}
