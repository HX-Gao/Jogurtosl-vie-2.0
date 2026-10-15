import React from 'react';
import { Card, GameState } from '../types';
import { Zap, X, ShieldAlert, Sparkles } from 'lucide-react';

interface CardsPanelProps {
  game: GameState;
  selectedCard: Card | null;
  onSelectCard: (card: Card) => void;
  onCancelSelection: () => void;
}

export const CardsPanel: React.FC<CardsPanelProps> = ({
  game,
  selectedCard,
  onSelectCard,
  onCancelSelection,
}) => {
  const isPlayerTurn = game.phase === 'player';
  const hasActions = game.actionsLeft > 0;
  const canPlay = isPlayerTurn && hasActions && !game.over;

  return (
    <div className="w-full flex flex-col bg-[#14150e] border-t md:border-t-0 md:border-r border-[#2e2b1c] text-[#ded9c7] select-none h-full overflow-hidden">
      {/* Cards Header */}
      <div className="p-2.5 px-3 bg-[#181911] border-b border-[#2e2b1c] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#c9a84c]">
            🃏 Karty v ruce ({game.hand.length})
          </span>
          <span className="text-[10px] text-[#7d7762] font-mono">
            Balíček: {game.deck.length}
          </span>
        </div>

        {selectedCard && (
          <button
            onClick={onCancelSelection}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 px-2 py-0.5 rounded bg-red-950/40 border border-red-800/60 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Zrušit výběr</span>
          </button>
        )}
      </div>

      {/* Selected Card Action Banner */}
      {selectedCard && (
        <div className="p-2 bg-gradient-to-r from-[#21351d] to-[#172714] border-b border-[#3e6b36] text-xs text-green-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCard.icon}</span>
            <div>
              <span className="font-bold text-white">{selectedCard.name}</span>
              <span className="text-[10px] text-green-300 block">
                {selectedCard.reg ? '🎯 Vyberte oblast na mapě' : 'Okamžitý efekt'}
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-black/40 px-2 py-1 rounded border border-green-500/40">
            {selectedCard.cost === 0 ? 'ZDARMA' : `📦 ${selectedCard.cost}`}
          </span>
        </div>
      )}

      {/* Cards List */}
      <div className="flex-1 p-2 sm:p-2.5 overflow-y-auto flex flex-col gap-2">
        {game.hand.length === 0 && game.deck.length === 0 && (
          <div className="text-center py-8 text-[#7d7762] text-xs italic">
            Balíček byl vyčerpán. Bude zamíchán nový...
          </div>
        )}

        {game.hand.map((card, idx) => {
          const isSelected = selectedCard?._uid === card._uid;
          const notEnoughSupplies = game.resources < card.cost;
          const disabled = !canPlay || notEnoughSupplies;

          return (
            <div
              key={card._uid ?? `${card.id}-${idx}`}
              onClick={() => {
                if (!disabled) onSelectCard(card);
              }}
              className={`relative rounded-lg p-2.5 transition-all duration-200 border text-left flex flex-col justify-between ${
                disabled
                  ? 'opacity-40 bg-[#12130c] border-[#222319] cursor-not-allowed'
                  : isSelected
                  ? 'bg-gradient-to-r from-[#17301c] to-[#122416] border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.25)] ring-1 ring-[#4ade80] cursor-pointer scale-[1.01]'
                  : 'bg-[#181a12] hover:bg-[#202217] border-[#383424] hover:border-[#c9a84c] cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header: Icon, Name, Key Badge, Cost */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0">{card.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs text-[#f2edd9]">
                        {card.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 rounded bg-[#27291e] text-[#a8a187] border border-[#3f3c2b]">
                        [{idx + 1}]
                      </span>
                    </div>
                    {card.reg ? (
                      <span className="text-[9px] font-mono text-amber-400">Vyžaduje oblast</span>
                    ) : (
                      <span className="text-[9px] font-mono text-sky-400">Globální efekt</span>
                    )}
                  </div>
                </div>

                {/* Cost Pill */}
                <div
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    card.cost === 0
                      ? 'bg-green-950/60 text-green-300 border-green-700/60'
                      : notEnoughSupplies
                      ? 'bg-red-950/60 text-red-400 border-red-700/60'
                      : 'bg-sky-950/60 text-sky-300 border-sky-700/60'
                  }`}
                >
                  {card.cost === 0 ? 'FREE' : `📦 ${card.cost}`}
                </div>
              </div>

              {/* Card Mechanical Description */}
              <p className="text-[11px] text-[#bfb89e] leading-relaxed mb-1.5">
                {card.desc}
              </p>

              {/* Historical Context Quote */}
              <p className="text-[9.5px] italic text-[#7a745e] border-t border-[#29271c] pt-1 mt-0.5">
                {card.historicalFlavor}
              </p>

              {/* Alert if not enough supplies */}
              {notEnoughSupplies && isPlayerTurn && (
                <div className="mt-1 text-[9px] text-red-400 font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Nedostatek zásob (máte {game.resources}/{card.cost})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
