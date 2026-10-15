import React from 'react';
import { HistoricalDilemma, GameState } from '../types';
import { ShieldAlert, BookOpen, CheckCircle } from 'lucide-react';

interface HistoricalDilemmaModalProps {
  dilemma: HistoricalDilemma;
  onChooseOption: (optionIndex: number) => void;
}

export const HistoricalDilemmaModal: React.FC<HistoricalDilemmaModalProps> = ({
  dilemma,
  onChooseOption,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#14150e] border-2 border-[#b45309] rounded-xl p-5 sm:p-6 shadow-[0_0_50px_rgba(180,83,9,0.3)] text-[#ded9c7] flex flex-col gap-4">
        {/* Banner */}
        <div className="flex items-center gap-3 border-b border-[#2e2b1c] pb-3">
          <div className="p-2 rounded bg-amber-950/80 border border-amber-600/80 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              Historické dilema velitele odboje
            </span>
            <h2 className="text-lg font-serif font-bold text-white">
              {dilemma.title}
            </h2>
          </div>
        </div>

        {/* Situation */}
        <div className="text-xs sm:text-sm text-[#ded9c7] font-serif leading-relaxed bg-[#191b12] p-3.5 rounded-lg border border-[#383424]">
          {dilemma.situation}
        </div>

        {/* Historical Context */}
        <div className="text-xs text-[#a8a186] italic border-l-2 border-[#c9a84c] pl-3 py-1">
          <strong className="text-[#c9a84c] not-italic">Historické pozadí: </strong>
          {dilemma.historicalContext}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mt-2">
          {dilemma.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onChooseOption(idx)}
              className="p-3.5 rounded-lg bg-[#1a1c13] hover:bg-[#25281a] border border-[#3b3825] hover:border-[#c9a84c] text-left transition group cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif font-bold text-xs sm:text-sm text-[#f0ebd9] group-hover:text-amber-200">
                  {option.text}
                </span>
                {option.historicalChoice && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/80 shrink-0">
                    Historická volba
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9c957e] mt-1 group-hover:text-[#bcb49a]">
                {option.consequence}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
