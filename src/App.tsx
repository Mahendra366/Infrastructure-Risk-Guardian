import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Server, 
  Thermometer, 
  Zap, 
  LayoutDashboard, 
  Shield, 
  FileText, 
  Search,
  ChevronRight,
  Info,
  Trash2,
  type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatCard } from './components/StatCard';
import { RiskComparisonChart } from './components/RiskComparisonChart';
import { MitigationAdvisor } from './components/MitigationAdvisor';
import { RiskMatrix } from './components/RiskMatrix';
import { INITIAL_RISKS, INFRA_STATS } from './constants';
import { RiskItem, RiskLevel } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [risks, setRisks] = useState<RiskItem[]>(INITIAL_RISKS);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRisk, setNewRisk] = useState({ title: '', category: 'Server' as const, likelihood: 2, impact: 2 });

  const handleDeleteRisk = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't select the row when deleting
    setRisks(risks.filter(r => r.id !== id));
    if (selectedRisk?.id === id) setSelectedRisk(null);
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    const rpn = newRisk.likelihood * newRisk.impact;
    const level = rpn >= 9 ? RiskLevel.Critical : rpn >= 6 ? RiskLevel.High : RiskLevel.Medium;
    
    const risk: RiskItem = {
      id: `risk-${Date.now()}`,
      title: newRisk.title,
      category: newRisk.category,
      likelihood: newRisk.likelihood,
      impact: newRisk.impact,
      rpn: rpn,
      level: level,
      status: rpn >= 9 ? 'Critical' : rpn >= 6 ? 'Warning' : 'Healthy',
      mitigation: 'Awaiting AI analysis...',
      beforeScore: rpn,
      afterScore: Math.ceil(rpn / 2)
    };

    setRisks([risk, ...risks]);
    setIsModalOpen(false);
    setNewRisk({ title: '', category: 'Server', likelihood: 2, impact: 2 });
    setSelectedRisk(risk);
  };

  const filteredRisks = risks.filter(risk => 
    risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    risk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { ...INFRA_STATS[0], icon: Thermometer },
    { ...INFRA_STATS[1], icon: Activity },
    { ...INFRA_STATS[2], icon: Zap },
    { ...INFRA_STATS[3], icon: Server },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'reports':
        return (
          <div className="space-y-6">
            <section className="card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Infrastructure Resilience Report</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Comprehensive audit of data center hardening protocols, cooling stability, and power redundancy metrics for Q2 2026.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
                <ReportCard title="Security Audit" status="Verified" date="Apr 12" />
                <ReportCard title="Cooling Stress Test" status="Passed" date="Apr 15" />
                <ReportCard title="Power Load Analysis" status="Critical" date="Apr 16" />
              </div>
              <button className="mt-8 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-100 italic">
                Download PDF Summary
              </button>
            </section>
          </div>
        );
      case 'risks':
        return (
          <div className="space-y-8">
            <section className="card p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Master Risk Registry</h2>
                <div className="flex gap-2">
                  <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold">4 CRITICAL</span>
                  <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold">12 WARNING</span>
                </div>
              </div>
              <RiskTable 
                filteredRisks={filteredRisks} 
                selectedRisk={selectedRisk} 
                setSelectedRisk={setSelectedRisk} 
                handleDeleteRisk={handleDeleteRisk}
                searchQuery={searchQuery}
              />
            </section>
          </div>
        );
      default:
        return (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <section className="card p-0 h-full flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Operational Risk Registry</h2>
                      <p className="text-sm text-slate-400 font-medium">Prioritized infrastructure threats based on RPN analysis</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('risks')}
                      className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                      View Registry <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <RiskTable 
                      filteredRisks={filteredRisks} 
                      selectedRisk={selectedRisk} 
                      setSelectedRisk={setSelectedRisk} 
                      handleDeleteRisk={handleDeleteRisk}
                      searchQuery={searchQuery}
                    />
                  </div>
                </section>
              </div>
              <div className="xl:col-span-1">
                <MitigationAdvisor selectedRisk={selectedRisk} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="card p-6 min-h-[450px]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Risk Mitigation Impact</h2>
                    <p className="text-sm text-slate-400 font-medium">Residual vs Initial RPN Reduction Analysis</p>
                  </div>
                </div>
                <RiskComparisonChart data={risks} />
              </section>
              <section className="card p-6">
                <RiskMatrix risks={risks} />
              </section>
            </div>

            <section className="card p-6 bg-slate-900 border-none text-white relative overflow-hidden mb-12">
              <div className="relative z-10 flex flex-col md:flex-row gap-12">
                <div className="max-w-xs">
                  <h2 className="text-lg font-bold mb-2">Resilience Report</h2>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Download detailed infrastructure health and reliability metrics.
                  </p>
                  <span className="text-3xl font-mono font-bold text-indigo-400">99.995%</span>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  <ProgressItem label="Power Redundancy" progress={94} color="bg-indigo-400" />
                  <ProgressItem label="Thermal Integrity" progress={88} color="bg-cyan-400" />
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Full Reliability Report
                  </button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Shield className="w-6 h-6 border-none" />
        </div>
        
        <nav className="flex flex-col gap-8">
          <NavItem icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={ShieldAlert} active={activeTab === 'risks'} onClick={() => setActiveTab('risks')} />
          <NavItem icon={FileText} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={Activity} active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
        </nav>

        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://picsum.photos/seed/admin/100" alt="Admin" referrerPolicy="no-referrer" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Infrastructure Risk Guardian
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                ISO 31000
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Real-time Data Center Risk Assessment & Mitigation</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search vulnerabilities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">System Operational</span>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Report Threat
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1440px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Input Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Report Infrastructure Threat</h3>
                <p className="text-sm text-slate-500">Document a new risk for RPN analysis</p>
              </div>
              <form onSubmit={handleAddRisk} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Threat Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., HVAC Controller Lag"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={newRisk.title}
                    onChange={e => setNewRisk({...newRisk, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={newRisk.category}
                      onChange={e => setNewRisk({...newRisk, category: e.target.value as any})}
                    >
                      <option>Server</option>
                      <option>Cooling</option>
                      <option>Power</option>
                      <option>Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Likelihood (1-3)</label>
                    <input 
                      type="number" min="1" max="3"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={newRisk.likelihood}
                      onChange={e => setNewRisk({...newRisk, likelihood: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Impact (1-4)</label>
                  <input 
                    type="number" min="1" max="4"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={newRisk.impact}
                    onChange={e => setNewRisk({...newRisk, impact: parseInt(e.target.value)})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Analyze Risk
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportCard({ title, status, date }: { title: string, status: string, date: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 text-left shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{date}</span>
        <span className={cn(
          "text-[8px] font-bold px-1.5 py-0.5 rounded",
          status === 'Verified' ? "bg-emerald-50 text-emerald-600" :
          status === 'Passed' ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
        )}>{status}</span>
      </div>
      <h4 className="text-sm font-bold text-slate-700 leading-tight">{title}</h4>
    </div>
  );
}

function RiskTable({ filteredRisks, selectedRisk, setSelectedRisk, handleDeleteRisk, searchQuery }: any) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Threat / Event</th>
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Likelihood</th>
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Impact</th>
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">RPN Score</th>
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 w-10"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {filteredRisks.length > 0 ? (
          filteredRisks.map((risk: any) => (
            <tr 
              key={risk.id}
              onClick={() => setSelectedRisk(risk)}
              className={cn(
                "cursor-pointer transition-colors hover:bg-indigo-50/30",
                selectedRisk?.id === risk.id ? "bg-indigo-50/70 border-l-4 border-indigo-600" : ""
              )}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className={cn("text-sm font-bold", selectedRisk?.id === risk.id ? "text-indigo-700" : "text-slate-700")}>
                    {risk.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{risk.category}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <LikelihoodGauge value={risk.likelihood} />
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  LVL {risk.impact}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    risk.rpn >= 9 ? "text-rose-600" : risk.rpn >= 6 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {risk.rpn}
                  </span>
                  <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", 
                        risk.rpn >= 9 ? "bg-rose-500" : risk.rpn >= 6 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${(risk.rpn / 12) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "risk-badge",
                  risk.level === RiskLevel.Critical ? "bg-rose-100 text-rose-700" :
                  risk.level === RiskLevel.High ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                )}>
                  {risk.level}
                </span>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={(e) => handleDeleteRisk(risk.id, e)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" /> 
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
              No matching risks found for "{searchQuery}"
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function NavItem({ icon: Icon, active = false, onClick }: { icon: LucideIcon, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        active 
          ? "bg-indigo-50 text-indigo-600 shadow-sm" 
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      )}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  );
}

function LikelihoodGauge({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((v) => (
        <div 
          key={v}
          className={cn(
            "h-1.5 w-6 rounded-full",
            v <= value 
              ? (value === 3 ? "bg-rose-400" : value === 2 ? "bg-amber-400" : "bg-emerald-400")
              : "bg-slate-100"
          )}
        />
      ))}
      <span className="text-[10px] font-bold text-slate-400 ml-1">
        {value === 3 ? "HIGH" : value === 2 ? "MED" : "LOW"}
      </span>
    </div>
  );
}

function ProgressItem({ label, progress, color }: { label: string, progress: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
        <span className="text-slate-300">{label}</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

