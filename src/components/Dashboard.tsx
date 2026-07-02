/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmployeeCompliance, VerticalSummary, CategorySummary } from '../types';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Users, Award, AlertCircle, CheckCircle, AwardIcon, TrendingUp, HelpCircle } from 'lucide-react';

interface DashboardProps {
  complianceData: EmployeeCompliance[];
  verticalsSummary: VerticalSummary[];
  categoriesSummary: CategorySummary[];
}

export default function Dashboard({ complianceData, verticalsSummary, categoriesSummary }: DashboardProps) {
  // Calculations
  const totalEmployees = complianceData.length;
  
  // Overall compliance is the average of each employee's overallCompliance
  const averageCompliance = totalEmployees > 0 
    ? complianceData.reduce((acc, emp) => acc + emp.overallCompliance, 0) / totalEmployees 
    : 0;

  const totalPassedTrainings = complianceData.reduce((acc, emp) => acc + emp.totalPassed, 0);
  
  // Total required is policy totals * employees
  const totalRequiredTrainings = complianceData.reduce((acc, emp) => acc + emp.totalRequired, 0);
  
  // Pending trainings (sum of remaining)
  const pendingTrainings = complianceData.reduce((acc, emp) => {
    const fundamentalRem = Math.max(0, emp.fundamentalRequired - emp.fundamentalPassed);
    const catARem = Math.max(0, emp.categoryARequired - emp.categoryAPassed);
    const catBRem = Math.max(0, emp.categoryBRequired - emp.categoryBPassed);
    const catCRem = Math.max(0, emp.categoryCRequired - emp.categoryCPassed);
    const catDRem = Math.max(0, emp.categoryDRequired - emp.categoryDPassed);
    return acc + fundamentalRem + catARem + catBRem + catCRem + catDRem;
  }, 0);

  const fullyCompliantCount = complianceData.filter(emp => emp.status === 'Compliant').length;
  const nonCompliantCount = totalEmployees - fullyCompliantCount;

  // Pie chart data: Compliance Bands
  // Green: >=90%, Yellow: 75-89%, Orange: 60-74%, Red: <60%
  const bands = {
    green: complianceData.filter(e => e.overallCompliance >= 90).length,
    yellow: complianceData.filter(e => e.overallCompliance >= 75 && e.overallCompliance < 90).length,
    orange: complianceData.filter(e => e.overallCompliance >= 60 && e.overallCompliance < 75).length,
    red: complianceData.filter(e => e.overallCompliance < 60).length,
  };

  const distributionData = [
    { name: 'Elite (≥90%)', value: bands.green, color: '#10B981' },
    { name: 'Satisfactory (75-89%)', value: bands.yellow, color: '#FBBF24' },
    { name: 'Needs Care (60-74%)', value: bands.orange, color: '#F97316' },
    { name: 'Critical (<60%)', value: bands.red, color: '#EF4444' },
  ].filter(b => b.value > 0);

  // Top / Lowest performing verticals
  const sortedVerticals = [...verticalsSummary].sort((a, b) => b.avgCompliance - a.avgCompliance);
  const topVerticals = sortedVerticals.slice(0, 3);
  const lowestVerticals = [...sortedVerticals].reverse().slice(0, 3);

  // Custom tooltips to keep styles extremely clean
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-700 text-xs shadow-xl font-sans">
          <p className="font-semibold mb-1 text-slate-200">{label}</p>
          <p className="text-emerald-400 font-medium">Compliance: {Number(payload[0].value).toFixed(1)}%</p>
          {payload[1] && <p className="text-blue-400 font-medium">Count: {payload[1].value}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5" id="tcms-dashboard">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Headcount */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">Total Headcount</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-slate-900 dark:text-slate-50 font-sans">{totalEmployees}</p>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded uppercase tracking-wider">Live</span>
            </div>
          </div>
          <div className="h-9 w-9 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
            <Users size={16} />
          </div>
        </div>

        {/* KPI 2: Avg Compliance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-blue-600 transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">Overall Compliance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-slate-900 dark:text-slate-50 font-sans">{averageCompliance.toFixed(1)}%</p>
              <span className="text-[10px] text-slate-400 font-medium">Target: 90%</span>
            </div>
            <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full ${averageCompliance >= 90 ? 'bg-green-500' : averageCompliance >= 75 ? 'bg-blue-600' : 'bg-red-500'}`}
                style={{ width: `${averageCompliance}%` }}
              ></div>
            </div>
          </div>
          <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* KPI 3: Fully Compliant */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-green-500 transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">Fully Compliant</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-green-600 dark:text-green-400 font-sans">{fullyCompliantCount}</p>
              <span className="text-[10px] text-slate-400 font-medium">
                {totalEmployees > 0 ? ((fullyCompliantCount / totalEmployees) * 100).toFixed(0) : 0}% of staff
              </span>
            </div>
          </div>
          <div className="h-9 w-9 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
            <CheckCircle size={16} />
          </div>
        </div>

        {/* KPI 4: Pending Action */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-red-500 transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">Pending Trainings</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-red-600 dark:text-red-400 font-sans">{pendingTrainings}</p>
              <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/20 px-1 py-0.5 rounded uppercase tracking-wider">Audit Alert</span>
            </div>
          </div>
          <div className="h-9 w-9 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
            <AlertCircle size={16} />
          </div>
        </div>
      </div>

      {/* Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main Bar Chart: Vertical-wise Compliance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Compliance by Vertical</h3>
              <p className="text-[11px] text-slate-400">Completion rate breakdown across organizational sectors</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verticalsSummary} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:stroke-slate-800" />
                <XAxis dataKey="vertical" tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={renderCustomTooltip} cursor={{ fill: '#F8FAFC', opacity: 0.3 }} />
                <Bar dataKey="avgCompliance" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={32}>
                  {verticalsSummary.map((entry, index) => {
                    const color = entry.avgCompliance >= 90 ? '#10B981' : entry.avgCompliance >= 75 ? '#3B82F6' : '#EF4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Compliance Distribution */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-0.5">Compliance Distribution</h3>
            <p className="text-[11px] text-slate-400">Workforce classification by compliance tiers</p>
          </div>
          <div className="h-44 relative flex items-center justify-center my-2">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={64}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Employees`]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs text-center flex flex-col items-center justify-center gap-2 h-full">
                <HelpCircle size={24} strokeWidth={1.5} /> No data available
              </div>
            )}
            <div className="absolute text-center flex flex-col">
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{fullyCompliantCount}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Certified</span>
            </div>
          </div>
          
          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {distributionData.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px]">
                <span className="h-2 w-2 rounded-full inline-block shrink-0 animate-pulse" style={{ backgroundColor: b.color }} />
                <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">{b.name.split(' ')[0]}: {b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar Chart: Category-wise Compliance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-0.5">Category Completion Rate</h3>
          <p className="text-[11px] text-slate-400">Pass rate efficiency across different course disciplines</p>
          <div className="h-56 flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoriesSummary}>
                <PolarGrid stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="categoryName" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 7 }} />
                <Radar name="Pass Rate" dataKey="avgCompliance" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.18} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top & Lowest Performing Verticals List */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-0.5">Organizational Standings</h3>
            <p className="text-[11px] text-slate-400 mb-3">Comparing highest performing and support-requiring divisions</p>
            
            <div className="space-y-3.5">
              {/* Top performing */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5 tracking-wider">
                  <Award size={12} /> Top Divisions
                </h4>
                <div className="space-y-1.5">
                  {topVerticals.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/30 rounded-lg">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{v.vertical}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">{v.employeeCount} staff</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{v.avgCompliance.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lowest performing */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1 mb-1.5 tracking-wider">
                  <AlertCircle size={12} /> Priority Support Required
                </h4>
                <div className="space-y-1.5">
                  {lowestVerticals.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 rounded-lg">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{v.vertical}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">{v.employeeCount} staff</span>
                        <span className="font-bold text-rose-500 dark:text-rose-400 font-mono">{v.avgCompliance.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
