import React from 'react';
import { GameState } from '../types';
import { HISTORICAL_TURNS } from '../gameData';
import { Volume2, VolumeX, BookOpen, Award, ArrowRight, ShieldAlert, CheckCircle, RotateCcw } from 'lucide-react';
import { isSoundMuted, setSoundMuted } from '../sound';

interface HUDProps {
  game: GameState;
  onAdvancePhase: () => void;
  onOpenRules: () => void;
  onOpenDossier: () => void;
  onReset: () => void;
  onSelectTurnInHistory: (turnNum: number) => void;
}

export const HUD: React.FC<HUDProps> = ({
  game,
  onAdvancePhase,
  onOpenRules,
  onOpenDossier,
  onReset,
  onSelectTurnInHistory,
}) => {
  const [muted, setMuted] = React.useState(isSoundMuted());
  const currentTurnData = HISTORICAL_TURNS.find((t) => t.n === game.turn) || HISTORICAL_TURNS[0];

  const liberatedCount = Object.values(game.regions).filter((r) => r.control >= 3).length;
  const belgradeControl = game.regions.belehrad?.control ?? -5;
  const isBelgradeLiberated = belgradeControl >= 3;

  const toggleMute = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const getPhaseButtonText = () => {
    switch (game.phase) {
      case 'event':
        return '▶ Táhnout historickou událost';
      case 'german':
        return '▶ Tah Wehrmachtu (AI)';
      case 'player':
        return game.actionsLeft > 0 ? '⏩ Přeskočit akce & ukončit tah' : '▶ Ukončit tah & nový měsíc';
    }
  };

  const getPhaseDescription = () => {
    switch (game.phase) {
      case 'event':
        return 'Vyhodnocení historické situace a válečných zpráv.';
      case 'german':
        return 'Wehrmacht posiluje posádky a podniká trestné výpravy.';
      case 'player':
        return `Vaše velení: zbývají ${game.actionsLeft} akce. Zvolte kartu z panelu.`;
    }
  };

  return (
    <div className="w-full bg-[#12130d] border-b border-[#2e2b1c] text-[#ded9c7] flex flex-col select-none shadow-md shrink-0">
      {/* Upper Status Ribbon */}
      <div className="px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#242216]">
        {/* Title & Turn Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="font-serif font-black tracking-widest text-[#c9a84c] text-sm sm:text-base uppercase">
              JOGURTOSLÁVIE
            </span>
          </div>

          <div className="h-4 w-px bg-[#332f1f]" />

          {/* Turn date & badges */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#1e2015] border border-[#383422] text-[#f4eed9] font-bold">
              Tah {game.turn}/{game.maxTurns}
            </span>
            <span className="text-[#a49d85] font-serif italic hidden sm:inline">
              {currentTurnData.date}
            </span>

            {/* Active strategic status badges */}
            {game.redArmy && (
              <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-600/80 text-red-300 text-[10px] font-bold animate-pulse">
                ★ Rudá armáda
              </span>
            )}
            {game.british && (
              <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/80 text-blue-300 text-[10px] font-bold">
                🇬🇧 Mise SOE
              </span>
            )}
            {game.skipGerman && (
              <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/80 text-purple-300 text-[10px] font-bold">
                🕵️ Abwehr oklamán
              </span>
            )}
          </div>
        </div>

        {/* Resources Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
          {/* Morale */}
          <div
            className={`flex flex-col items-center px-2.5 py-1 rounded bg-[#181911] border ${
              game.morale < 25 ? 'border-red-600 bg-red-950/30' : 'border-[#332f1f]'
            }`}
            title="Morálka partyzánů a srbského lidu (Klesne-li na 0, odboj je potlačen)"
          >
            <span className="text-[9px] font-mono text-[#8a846e] uppercase">❤️ Morálka</span>
            <span
              className={`text-sm sm:text-base font-mono font-bold ${
                game.morale < 25 ? 'text-red-400 animate-pulse' : game.morale < 50 ? 'text-amber-400' : 'text-green-400'
              }`}
            >
              {game.morale}%
            </span>
          </div>

          {/* Fighters */}
          <div
            className="flex flex-col items-center px-2.5 py-1 rounded bg-[#181911] border border-[#332f1f]"
            title="Aktivní partyzánští bojovníci (Zvyšují sílu útoků a násobí odvahu)"
          >
            <span className="text-[9px] font-mono text-[#8a846e] uppercase">⚔️ Bojovníci</span>
            <span className="text-sm sm:text-base font-mono font-bold text-[#c9a84c]">
              {game.fighters}
            </span>
          </div>

          {/* Supplies */}
          <div
            className="flex flex-col items-center px-2.5 py-1 rounded bg-[#181911] border border-[#332f1f]"
            title="Zásoby munice, zbraní a léků (Potřebné pro karty útoků a základen)"
          >
            <span className="text-[9px] font-mono text-[#8a846e] uppercase">📦 Zásoby</span>
            <span className="text-sm sm:text-base font-mono font-bold text-sky-400">
              {game.resources}
            </span>
          </div>

          {/* Liberated Zones */}
          <div
            className={`flex flex-col items-center px-2.5 py-1 rounded bg-[#181911] border ${
              liberatedCount >= 3 && isBelgradeLiberated ? 'border-green-500 bg-green-950/30' : 'border-[#332f1f]'
            }`}
            title="Osvobozené oblasti s kontrolou ≥ +3 (Nutno mít 3+ včetně Bělehradu)"
          >
            <span className="text-[9px] font-mono text-[#8a846e] uppercase">🚩 Osvobozeno</span>
            <span
              className={`text-sm sm:text-base font-mono font-bold ${
                liberatedCount >= 3 ? 'text-green-400' : 'text-[#c9a84c]'
              }`}
            >
              {liberatedCount}/6 {isBelgradeLiberated ? '✓' : ''}
            </span>
          </div>

          {/* Utility buttons */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-[#1a1b13] border border-[#383422] hover:border-[#c9a84c] text-[#a49d85] hover:text-[#c9a84c] cursor-pointer"
              title="Zvuk zap/vyp [S]"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onOpenDossier}
              className="p-1.5 rounded bg-[#1a1b13] border border-[#383422] hover:border-[#86afdb] text-[#86afdb] cursor-pointer"
              title="Historický archiv a osobnosti [H]"
            >
              <Award className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenRules}
              className="p-1.5 rounded bg-[#1a1b13] border border-[#383422] hover:border-[#c9a84c] text-[#c9a84c] cursor-pointer"
              title="Pravidla a nápověda [R]"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onReset}
              className="p-1.5 rounded bg-[#1a1b13] border border-[#383422] hover:border-red-400 text-[#888168] hover:text-red-400 cursor-pointer"
              title="Restartovat hru"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Phase Action Bar & Timeline */}
      <div className="px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161710]">
        {/* Phase Info & Helper */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 ${
              game.phase === 'event'
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                : game.phase === 'german'
                ? 'bg-red-950/60 border-red-500/80 text-red-300'
                : 'bg-green-950/60 border-green-500/80 text-green-300'
            }`}
          >
            <span>
              {game.phase === 'event'
                ? '📜 Fáze událostí'
                : game.phase === 'german'
                ? '🪖 Německá fáze'
                : `🎯 Partyzánská fáze (${game.actionsLeft} akce)`}
            </span>
          </div>

          <span className="text-xs text-[#a49c81] font-serif hidden md:inline">
            {getPhaseDescription()}
          </span>
        </div>

        {/* 12-Turn Timeline Dots */}
        <div className="hidden lg:flex items-center gap-1 px-3 py-1 rounded bg-[#0f100a] border border-[#2b2819]">
          <span className="text-[10px] font-mono text-[#777058] mr-1 uppercase">1941</span>
          {HISTORICAL_TURNS.map((t, idx) => {
            const isCurrent = t.n === game.turn;
            const isPast = t.n < game.turn;
            return (
              <button
                key={t.n}
                onClick={() => onSelectTurnInHistory(t.n)}
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono transition cursor-pointer ${
                  isCurrent
                    ? 'bg-[#c9a84c] text-black font-bold ring-2 ring-[#c9a84c]/60 scale-110'
                    : isPast
                    ? 'bg-[#2b5a2b] text-green-200'
                    : 'bg-[#212317] text-[#6d6650] hover:bg-[#343725]'
                }`}
                title={`Tah ${t.n}: ${t.date} — ${t.short}`}
              >
                {t.n}
              </button>
            );
          })}
          <span className="text-[10px] font-mono text-[#777058] ml-1 uppercase">1944</span>
        </div>

        {/* Phase Advance Button */}
        <button
          onClick={onAdvancePhase}
          className={`flex items-center gap-2 px-5 py-2 rounded font-serif font-bold text-xs sm:text-sm tracking-wider uppercase transition cursor-pointer shadow-md ${
            game.phase === 'event'
              ? 'bg-[#85531b] hover:bg-[#9e6321] text-[#fff8ea] border border-[#d49747]'
              : game.phase === 'german'
              ? 'bg-[#7c1d1d] hover:bg-[#992222] text-[#fff0f0] border border-[#e26969]'
              : 'bg-[#1b6b2b] hover:bg-[#238536] text-[#f0fff0] border border-[#52bd69]'
          }`}
        >
          <span>{getPhaseButtonText()}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
