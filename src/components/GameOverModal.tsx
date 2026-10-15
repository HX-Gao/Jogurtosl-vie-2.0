import React from 'react';
import { GameState } from '../types';
import { Trophy, Skull, RotateCcw, BookOpen, Award, CheckCircle } from 'lucide-react';

interface GameOverModalProps {
  game: GameState;
  onRestart: () => void;
  onOpenDossier: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  game,
  onRestart,
  onOpenDossier,
}) => {
  const isWin = game.over === 'win';
  const liberated = Object.values(game.regions).filter((r) => r.control >= 3).length;
  const isBelgradeLiberated = (game.regions.belehrad?.control ?? -5) >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none overflow-y-auto animate-in fade-in duration-300">
      <div
        className={`w-full max-w-xl bg-[#14150e] border-2 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-[#ded9c7] flex flex-col items-center text-center gap-5 my-auto ${
          isWin
            ? 'border-[#22c55e] shadow-[0_0_60px_rgba(34,197,94,0.3)]'
            : 'border-[#ef4444] shadow-[0_0_60px_rgba(239,68,68,0.3)]'
        }`}
      >
        {/* Crest Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl border-2 ${
            isWin
              ? 'bg-green-950/80 border-green-500 text-green-400'
              : 'bg-red-950/80 border-red-500 text-red-400'
          }`}
        >
          {isWin ? <Trophy className="w-10 h-10 text-amber-400" /> : <Skull className="w-10 h-10 text-red-400" />}
        </div>

        {/* Sub-label */}
        <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#948d75]">
          {isWin ? 'Historické vítězství národně osvobozeneckého boje' : 'Konec partyzánského odporu'}
        </div>

        {/* Main Title */}
        <h1
          className={`text-2xl sm:text-4xl font-serif font-black tracking-widest uppercase ${
            isWin ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isWin ? 'BĚLEHRAD OSVOBOZEN!' : 'ODBOJ V SRBSKU POTLAČEN'}
        </h1>

        {/* Historical Narrative */}
        <p className="text-xs sm:text-sm text-[#cdc7b2] font-serif leading-relaxed max-w-md">
          {isWin ? (
            <>
              20. října 1944: Společný nápor Titova 1. armádního sboru NOVJ a sovětského 4. gardového mechanizovaného sboru 
              definitivně vyrazil Wehrmacht z Bělehradu. Maršál Tito vstoupil do osvobozeného hlavního města. 
              Jugoslávie prokázala světu, že její národy dokázaly v nejtěžších podmínkách vybojovat svobodu.
            </>
          ) : (
            <>
              Německé divize Wehrmachtu a kárné oddíly SS zlomily páteř odboje. Morálka srbského lidu byla vyčerpána 
              pod brutálním terorem odvetných poprav a blokád. Přesto v nepřístupných roklích Dinárských Alp 
              dál plápolají ohně svobody – boj nikdy nekončí.
            </>
          )}
        </p>

        {/* Strategic Campaign Stats Box */}
        <div className="w-full bg-[#181a12] border border-[#2e2a1b] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#7d7762] block">Dosažený tah</span>
            <span className="text-white font-bold">{game.turn} / {game.maxTurns}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#7d7762] block">Konečná morálka</span>
            <span className={game.morale <= 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
              {game.morale}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#7d7762] block">Osvobozeno oblastí</span>
            <span className={liberated >= 3 ? 'text-green-400 font-bold' : 'text-[#c9a84c] font-bold'}>
              {liberated}/6 {isBelgradeLiberated ? '(vč. Bělehradu)' : ''}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#7d7762] block">Úspěšnost bitev</span>
            <span className="text-sky-400 font-bold">
              {game.stats.battlesWon} / {game.stats.battlesFought}
            </span>
          </div>
        </div>

        {/* Educational Debriefing Tips if Lost */}
        {!isWin && (
          <div className="w-full text-left bg-[#1a1714] border border-[#42221e] rounded-lg p-3 text-[11px] text-[#bca59e] leading-relaxed">
            <strong className="text-amber-300 block mb-1">💡 Taktická rada pro příště:</strong>
            Zabezpečte hory na západě a jihu pro základny (+2 k obraně). Sabotujte posádku ve Středním Srbsku, 
            aby Wehrmacht neprováděl silné odvety. Neútočte přímo na opevněný Bělehrad, dokud v tahu 11 nedorazí 
            tanky Rudé armády!
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mt-2">
          <button
            onClick={onRestart}
            className={`w-full flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-serif font-bold text-sm tracking-wider uppercase transition cursor-pointer ${
              isWin
                ? 'bg-green-700 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-red-800 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Hrát znovu</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#1e2016] hover:bg-[#282b1d] text-[#c9a84c] border border-[#3b3824] hover:border-[#c9a84c] font-mono text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Archiv</span>
          </button>
        </div>
      </div>
    </div>
  );
};
