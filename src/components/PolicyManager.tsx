/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompliancePolicy } from '../types';
import { Settings, ShieldCheck, HelpCircle, Save, Check } from 'lucide-react';

interface PolicyManagerProps {
  policies: { 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy };
  onUpdatePolicies: (policies: { 'Assistant Manager': CompliancePolicy; 'Manager': CompliancePolicy }) => void;
}

export default function PolicyManager({ policies, onUpdatePolicies }: PolicyManagerProps) {
  const [activeDesig, setActiveDesig] = useState<'Assistant Manager' | 'Manager'>('Assistant Manager');

  // Temporary state for the policy editor
  const [fundamental, setFundamental] = useState(policies[activeDesig].Fundamental);
  const [categoryA, setCategoryA] = useState(policies[activeDesig].CategoryA);
  const [categoryB, setCategoryB] = useState(policies[activeDesig].CategoryB);
  const [categoryC, setCategoryC] = useState(policies[activeDesig].CategoryC);
  const [categoryD, setCategoryD] = useState(policies[activeDesig].CategoryD);
  const [isSaved, setIsSaved] = useState(false);

  // When activeDesig or policies change, sync the input states!
  React.useEffect(() => {
    setFundamental(policies[activeDesig].Fundamental);
    setCategoryA(policies[activeDesig].CategoryA);
    setCategoryB(policies[activeDesig].CategoryB);
    setCategoryC(policies[activeDesig].CategoryC);
    setCategoryD(policies[activeDesig].CategoryD);
  }, [activeDesig, policies]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPolicies = {
      ...policies,
      [activeDesig]: {
        Fundamental: fundamental,
        CategoryA: categoryA,
        CategoryB: categoryB,
        CategoryC: categoryC,
        CategoryD: categoryD
      }
    };
    onUpdatePolicies(updatedPolicies);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (activeDesig === 'Assistant Manager') {
      setFundamental(5);
      setCategoryA(3);
      setCategoryB(4);
      setCategoryC(6);
      setCategoryD(2);
    } else {
      setFundamental(6);
      setCategoryA(4);
      setCategoryB(5);
      setCategoryC(8);
      setCategoryD(3);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="policy-manager-container">
      {/* Policy Card Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-6 rounded-2xl shadow-md border border-blue-600/20 relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">System Parameters</span>
          <h3 className="text-xl font-bold font-sans">Completion Policy Configuration</h3>
          <p className="text-xs text-blue-100 leading-normal max-w-lg">
            Define compliance thresholds for required training categories based on designation. Changes automatically update overall calculation matrices and compliant standing metrics.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-blue-500 opacity-20 pointer-events-none">
          <Settings size={220} strokeWidth={1} />
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Designation Tab Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Designation Profile</label>
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveDesig('Assistant Manager')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeDesig === 'Assistant Manager'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-800/50'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Assistant Manager Policy Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveDesig('Manager')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeDesig === 'Manager'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-800/50'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Manager Policy Profile
            </button>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-4 bg-blue-50/50 dark:bg-slate-950/40 p-3 rounded-lg border border-blue-100/20">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Editing policy criteria for all employees with designation: <strong className="text-blue-600 dark:text-blue-400 uppercase font-sans tracking-wide">{activeDesig}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          
          {/* Fundamental */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Fundamental Training Requirement</label>
              <p className="text-[11px] text-slate-400">Core safety, security, and corporate legal compliance courses</p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="number"
                min="0"
                max="30"
                value={fundamental}
                onChange={(e) => setFundamental(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">courses</span>
            </div>
          </div>

          {/* Category A */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Category A Training Requirement</label>
              <p className="text-[11px] text-slate-400">Department-specific workflow certifications, managed separately</p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="number"
                min="0"
                max="30"
                value={categoryA}
                onChange={(e) => setCategoryA(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">courses</span>
            </div>
          </div>

          {/* Category B */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Category B Training Requirement</label>
              <p className="text-[11px] text-slate-400">Technical methodologies and tools enablement training logs</p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="number"
                min="0"
                max="30"
                value={categoryB}
                onChange={(e) => setCategoryB(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">courses</span>
            </div>
          </div>

          {/* Category C */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Category C Training Requirement</label>
              <p className="text-[11px] text-slate-400">Engineering practices, developer guides and architectural alignment</p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="number"
                min="0"
                max="30"
                value={categoryC}
                onChange={(e) => setCategoryC(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">courses</span>
            </div>
          </div>

          {/* Category D */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Category D Training Requirement</label>
              <p className="text-[11px] text-slate-400">Cloud computing, platform infrastructure and DevOps certification modules</p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="number"
                min="0"
                max="30"
                value={categoryD}
                onChange={(e) => setCategoryD(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">courses</span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Reset to Default Policy
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            {isSaved ? <Check size={14} /> : <Save size={14} />}
            {isSaved ? 'Policy Updated' : 'Apply & Recalculate Compliance'}
          </button>
        </div>
      </form>

      {/* Compliance Rules Advice Box */}
      <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl flex gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
        <ShieldCheck className="text-amber-500 shrink-0" size={18} />
        <div>
          <strong className="text-amber-700 dark:text-amber-400 font-semibold block mb-1">Deduplication & Certification Criteria:</strong>
          Only courses with <strong className="text-slate-800 dark:text-slate-200">Status = Pass</strong> are counted toward the totals. Any entries marked as <strong className="text-slate-800 dark:text-slate-200">Fail</strong> or <strong className="text-slate-800 dark:text-slate-200">Withdrawn</strong> are completely ignored. Multiple completions of the same training code by the same employee are counted only once to enforce structural fairness in assessments.
        </div>
      </div>
    </div>
  );
}
