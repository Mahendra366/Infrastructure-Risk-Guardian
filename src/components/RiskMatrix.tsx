import React from 'react';
import { motion } from 'motion/react';
import { Likelihood, Impact, RiskItem } from '../types';
import { cn } from '../lib/utils';

interface RiskMatrixProps {
  risks: RiskItem[];
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  const likelihoods = [3, 2, 1]; // High to Low
  const impacts = [1, 2, 3, 4]; // Low to High

  const getRisksInCell = (l: number, i: number) => {
    return risks.filter(r => r.likelihood === l && r.impact === i);
  };

  const getCellColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 9) return 'bg-rose-100 hover:bg-rose-200 border-rose-200';
    if (score >= 6) return 'bg-amber-100 hover:bg-amber-200 border-amber-200';
    return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Heatmap</span>
        <div className="flex gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-rose-400" /> CRITICAL</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-400" /> HIGH</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-400" /> LOW</div>
        </div>
      </div>

      <div className="grid grid-cols-[100px_1fr] gap-4">
        {/* Y-Axis Label */}
        <div className="flex flex-col justify-between py-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-6">
          <div className="rotate-270 whitespace-nowrap">Likelihood</div>
        </div>

        <div className="grid grid-rows-3 gap-2">
          {likelihoods.map((l) => (
            <div key={l} className="grid grid-cols-4 gap-2 h-24">
              {impacts.map((i) => {
                const risksInCell = getRisksInCell(l, i);
                return (
                  <motion.div
                    key={`${l}-${i}`}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "rounded-lg border-2 flex flex-col items-center justify-center relative p-1 transition-colors",
                      getCellColor(l, i)
                    )}
                  >
                    {risksInCell.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center justify-center">
                        {risksInCell.map(risk => (
                          <div 
                            key={risk.id}
                            className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-[8px] text-white font-bold cursor-help"
                            title={risk.title}
                          >
                            {risk.id.split('-')[1]}
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="text-[8px] font-bold text-slate-400 absolute bottom-1 right-1">
                      {l}x{i}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}
          {/* X-Axis Label */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
            <div>Low</div>
            <div>Medium</div>
            <div>High</div>
            <div>Very High</div>
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
        Impact Intensity
      </div>
    </div>
  );
};
