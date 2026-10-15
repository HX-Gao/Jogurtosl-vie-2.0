import React from 'react';
import { BookOpen, X, Shield, Swords, Sparkles, Target, Compass } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[#14150e] border-2 border-[#c9a84c] rounded-xl flex flex-col shadow-[0_0_50px_rgba(201,168,76,0.2)] text-[#ded9c7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 bg-[#191b12] border-b border-[#2e2b1c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#2b2715] border border-[#524925] text-[#c9a84c]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                PRAVIDLA A STRATEGIE · JOGURTOSLÁVIE
              </h2>
              <span className="text-xs text-[#9c957e] font-mono">
                Příručka partyzánského velitele (1941–1944)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#202216] border border-[#383422] text-[#8e876f] hover:text-white hover:border-[#c9a84c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-[#cdc7b2] leading-relaxed">
          {/* Main Objective */}
          <div className="p-3.5 rounded-lg bg-[#191b12] border-l-4 border-green-500 space-y-1">
            <div className="flex items-center gap-2 font-serif font-bold text-green-300 text-sm">
              <Target className="w-4 h-4" />
              <span>CÍL HRY (PODMÍNKA VÍTĚZSTVÍ)</span>
            </div>
            <p className="text-xs text-[#ded9c7]">
              Do konce 12. tahu (20. října 1944) musíte <strong>osvobodit Bělehrad</strong> (kontrola nad městem ≥ +3) 
              a zároveň plně <strong>kontrolovat alespoň 2 další oblasti</strong> (celkem tedy ≥ 3 osvobozené zóny).
            </p>
          </div>

          {/* Defeat Conditions */}
          <div className="p-3.5 rounded-lg bg-[#191b12] border-l-4 border-red-500 space-y-1">
            <div className="flex items-center gap-2 font-serif font-bold text-red-300 text-sm">
              <Shield className="w-4 h-4" />
              <span>PODMÍNKA PROHRY</span>
            </div>
            <p className="text-xs text-[#ded9c7]">
              Prohrajete okamžitě, pokud <strong>morálka lidu klesne na 0</strong> (např. v důsledku německých poprav a okupačního tlaku), 
              nebo pokud po skončení 12. tahu nedržíte Bělehrad a 2 další oblasti.
            </p>
          </div>

          {/* Turn Sequence */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-white text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c9a84c]" />
              <span>3 FÁZE KAŽDÉHO TAHU</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded bg-[#181a11] border border-[#2e2a1b]">
                <strong className="text-amber-400 block mb-1">1. Fáze událostí</strong>
                <span className="text-[#a8a187] text-[11px] font-sans">
                  Vyhodnotí se skutečná historická událost daného měsíce a případné náhodné válečné zvraty.
                </span>
              </div>
              <div className="p-3 rounded bg-[#181a11] border border-[#2e2a1b]">
                <strong className="text-red-400 block mb-1">2. Fáze Wehrmachtu</strong>
                <span className="text-[#a8a187] text-[11px] font-sans">
                  Německá AI posiluje nejslabší zóny a vysílá útočné kolony do oblastí s nejvyšším partyzánským vlivem.
                </span>
              </div>
              <div className="p-3 rounded bg-[#181a11] border border-[#2e2a1b]">
                <strong className="text-green-400 block mb-1">3. Vaše fáze</strong>
                <span className="text-[#a8a187] text-[11px] font-sans">
                  Máte 2 akce k hraní karet z ruky: Útok, Sabotáž, Nábor, Základna, Propaganda, Zásoby, Výzvědci či Mise SOE.
                </span>
              </div>
            </div>
          </div>

          {/* Terrain & Combat Rules */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-white text-sm flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#c9a84c]" />
              <span>TERÉN A BOJOVÉ MECHANIKY</span>
            </h3>
            <div className="space-y-1.5 text-xs text-[#bbb49c]">
              <div>• <strong>Hory (Západní & Jižní Srbsko):</strong> Dinárské Alpy a Kopaonik. Partyzáni mají bonus +2 k hodu, Němci postih -2. Ideální pro výstavbu základen!</div>
              <div>• <strong>Rovina (Banát):</strong> Německé tanky se pohybují volně: Němci +2 k hodu (+1 útok), partyzáni -1.</div>
              <div>• <strong>Kopce a lesy (Střední & Východní Srbsko):</strong> Vyrovnaný terén bez plošných modifikátorů. Sabotáž ve Středním Srbsku dává +2 zásoby navíc ze zbrojovek v Kragujevaci!</div>
              <div>• <strong>Pevnost Bělehrad:</strong> Chráněna těžkým opevněním (🔒). Útok bez Rudé armády trpí tvrdým postihem -4. V tahu 11 přichází 3. ukrajinský front, opevnění padne a partyzáni získají +10 bojovníků!</div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-3 rounded-lg bg-[#171912] border border-[#312e1f] text-xs font-mono">
            <span className="text-[#c9a84c] font-bold block mb-1">Klávesové zkratky:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#a8a186]">
              <div><strong className="text-white">1–4:</strong> Zvolit kartu</div>
              <div><strong className="text-white">Mezerník:</strong> Další akce / fáze</div>
              <div><strong className="text-white">M:</strong> Dobová mapa</div>
              <div><strong className="text-white">H:</strong> Historie a archiv</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-6 bg-[#181a11] border-t border-[#2e2b1c] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#c9a84c] hover:bg-[#dfbd5d] text-[#11120c] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition"
          >
            Rozumím, zpět do hry
          </button>
        </div>
      </div>
    </div>
  );
};
