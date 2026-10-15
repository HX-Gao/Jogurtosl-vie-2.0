import React, { useEffect } from 'react';
import { CombatRollResult } from '../types';
import { Swords, Shield, Bomb, CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react';

interface CombatDialogProps {
  combat: CombatRollResult;
  onClose: () => void;
}

export const CombatDialog: React.FC<CombatDialogProps> = ({ combat, onClose }) => {
  // Listen for Enter / Space / Esc to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isAttack = combat.type === 'attack';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#14150e] border-2 border-[#3d3824] rounded-xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-[#ded9c7] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="flex items-center justify-between border-b border-[#2d2a1c] pb-3">
          <div className="flex items-center gap-2.5">
            {isAttack ? (
              <div className="p-2 rounded bg-red-950/80 border border-red-700/80 text-red-400">
                <Swords className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded bg-amber-950/80 border border-amber-700/80 text-amber-400">
                <Bomb className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#948d75]">
                {isAttack ? 'Válečné střetnutí' : 'Diverzní akce'}
              </span>
              <h2 className="text-lg font-serif font-bold text-white">
                {isAttack ? `Partyzánský útok na ${combat.regionName}` : `Sabotáž v oblasti ${combat.regionName}`}
              </h2>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-[#202216] border border-[#3b3824] text-xs font-mono text-[#c9a84c]">
            {combat.terrain}
          </span>
        </div>

        {/* Dice Comparison Arenas */}
        {isAttack ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 my-2">
            {/* Partisan Forces */}
            <div
              className={`p-3 sm:p-4 rounded-lg border flex flex-col items-center text-center ${
                combat.success
                  ? 'bg-[#152e18]/80 border-green-500/80 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                  : 'bg-[#1a1c14] border-[#312e1f]'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-wider text-green-300 font-bold mb-2">
                🚩 Partyzáni
              </span>

              {/* Animated Dice */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-700 to-green-950 border-2 border-green-400 flex items-center justify-center text-2xl font-bold font-mono text-white shadow-lg my-1 animate-dice">
                {combat.partisanDice}
              </div>

              {/* Breakdown list */}
              <div className="mt-2 w-full text-[10px] font-mono text-[#a6bca2] space-y-0.5 text-left bg-black/30 p-2 rounded">
                {combat.partisanBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Final Partisan Score */}
              <div className="mt-2 text-sm font-mono font-bold text-green-300">
                Celkem: {combat.partisanTotal}
              </div>
            </div>

            {/* German Garrison Forces */}
            <div
              className={`p-3 sm:p-4 rounded-lg border flex flex-col items-center text-center ${
                !combat.success
                  ? 'bg-[#2e1515]/80 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                  : 'bg-[#1a1c14] border-[#312e1f]'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-wider text-red-300 font-bold mb-2">
                🪖 Wehrmacht
              </span>

              {/* Animated Dice */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-700 to-red-950 border-2 border-red-400 flex items-center justify-center text-2xl font-bold font-mono text-white shadow-lg my-1 animate-dice">
                {combat.germanDice ?? 0}
              </div>

              {/* Breakdown list */}
              <div className="mt-2 w-full text-[10px] font-mono text-[#bca2a2] space-y-0.5 text-left bg-black/30 p-2 rounded">
                {combat.germanBreakdown?.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Final German Score */}
              <div className="mt-2 text-sm font-mono font-bold text-red-300">
                Celkem: {combat.germanTotal}
              </div>
            </div>
          </div>
        ) : (
          /* Sabotage Resolution */
          <div className="flex flex-col items-center text-center p-4 bg-[#1a1b12] border border-[#3b3824] rounded-lg my-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold mb-2">
              💣 Hod na úspěch záškodnické akce (Potřeba ≥ 4)
            </span>

            <div className="flex items-center gap-4 my-2">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-600 to-amber-950 border-2 border-amber-400 flex items-center justify-center text-3xl font-bold font-mono text-white shadow-lg animate-dice">
                {combat.partisanDice}
              </div>
              <div className="text-left font-mono text-xs text-[#ded9c7] space-y-1">
                <div>Hod kostkou: <span className="font-bold text-white">{combat.partisanDice}</span></div>
                <div>Terénní modifikátor: <span className="font-bold text-amber-300">{combat.partisanMod >= 0 ? `+${combat.partisanMod}` : combat.partisanMod}</span></div>
                <div className="text-sm font-bold text-amber-400">Výsledek: {combat.partisanTotal} / 4</div>
              </div>
            </div>

            <div className="mt-1 text-xs text-[#aba388] font-serif">
              {combat.success
                ? 'Sabotáž úspěšná! Wehrmacht utrpěl ztráty a chaos v zásobování.'
                : 'Záškodníci odhaleni německou hlídkou před odpálením nálože.'}
            </div>
          </div>
        )}

        {/* Outcome Result Card */}
        <div
          className={`p-3.5 rounded-lg border flex items-center gap-3 ${
            combat.success
              ? 'bg-green-950/50 border-green-700/80 text-green-200'
              : 'bg-red-950/50 border-red-700/80 text-red-200'
          }`}
        >
          {combat.success ? (
            <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
          )}

          <div className="text-xs leading-relaxed">
            <div className="font-serif font-bold text-sm text-white mb-0.5">
              {combat.success ? 'ÚSPĚCH OPERACE' : 'NEÚSPĚCH OPERACE'}
            </div>
            <div>{combat.message}</div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded bg-[#202217] hover:bg-[#2c2f1f] border border-[#45422a] hover:border-[#c9a84c] text-[#ded9c7] font-serif font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Pokračovat v boji [Mezerník / Enter]</span>
          <ChevronRight className="w-4 h-4 text-[#c9a84c]" />
        </button>
      </div>
    </div>
  );
};
