import React, { useState } from 'react';
import { HISTORICAL_TURNS, HISTORICAL_PERSONS, GLOSSARY } from '../gameData';
import { BookOpen, Users, Map, HelpCircle, X, ChevronLeft, ChevronRight, Quote, Shield } from 'lucide-react';

interface HistoricalDossierProps {
  currentTurn: number;
  initialSelectedTurn?: number;
  onClose: () => void;
}

export const HistoricalDossier: React.FC<HistoricalDossierProps> = ({
  currentTurn,
  initialSelectedTurn = 1,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'persons' | 'map' | 'glossary'>('timeline');
  const [selectedTurnNum, setSelectedTurnNum] = useState<number>(initialSelectedTurn);
  const [selectedPersonId, setSelectedPersonId] = useState<string>(HISTORICAL_PERSONS[0].id);

  const selectedTurnData = HISTORICAL_TURNS.find((t) => t.n === selectedTurnNum) || HISTORICAL_TURNS[0];
  const selectedPerson = HISTORICAL_PERSONS.find((p) => p.id === selectedPersonId) || HISTORICAL_PERSONS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-[#14150e] border-2 border-[#3f3b26] rounded-xl flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] text-[#ded9c7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dossier Header */}
        <div className="p-4 px-6 bg-[#181a11] border-b border-[#2e2b1c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#2a2717] border border-[#484227] text-[#c9a84c]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                HISTORICKÝ ARCHIV A DOKUMENTACE · JOGURTOSLÁVIE
              </h2>
              <span className="text-xs text-[#9c957e] font-mono">
                Autentické materiály, osobnosti a fakta odboje v Srbsku 1941–1944
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#202216] border border-[#383422] text-[#8e876f] hover:text-white hover:border-[#c9a84c] transition cursor-pointer"
            title="Zavřít [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2e2b1c] bg-[#161710] overflow-x-auto shrink-0">
          {[
            { id: 'timeline', label: 'Chronologie 1941–1944', icon: BookOpen },
            { id: 'persons', label: 'Osobnosti a frakce', icon: Users },
            { id: 'map', label: 'Archivní mapa a území', icon: Map },
            { id: 'glossary', label: 'Historický glosář', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#c9a84c] text-[#c9a84c] bg-[#1a1c12]'
                    : 'border-transparent text-[#8e8770] hover:text-[#ded9c7] hover:bg-[#1a1b12]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#12130c]">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-5">
              {/* Turn Selector Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#2b2819]">
                {HISTORICAL_TURNS.map((t) => {
                  const isSelected = t.n === selectedTurnNum;
                  const isPassed = t.n <= currentTurn;
                  return (
                    <button
                      key={t.n}
                      onClick={() => setSelectedTurnNum(t.n)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#c9a84c] text-[#11120c] font-bold border-[#c9a84c] shadow-sm'
                          : isPassed
                          ? 'bg-[#1e2215] text-[#b8b093] border-[#373b25] hover:border-[#5a5f3d]'
                          : 'bg-[#15160e] text-[#6b6550] border-[#252718]'
                      }`}
                    >
                      <span>Tah {t.n}</span>
                      <span className="text-[10px] opacity-75">({t.date})</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Turn Detail */}
              <div className="bg-[#171912] border border-[#333020] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d2a1b] pb-3">
                  <div>
                    <span className="text-xs font-mono text-[#c9a84c] uppercase tracking-wider block">
                      Tah {selectedTurnData.n} · {selectedTurnData.date}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                      {selectedTurnData.hTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTurnNum((n) => Math.max(1, n - 1))}
                      disabled={selectedTurnNum <= 1}
                      className="p-1.5 rounded bg-[#212317] border border-[#3a3725] disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#c9a84c]" />
                    </button>
                    <span className="text-xs font-mono text-[#8a836c]">
                      {selectedTurnNum} / 12
                    </span>
                    <button
                      onClick={() => setSelectedTurnNum((n) => Math.min(12, n + 1))}
                      disabled={selectedTurnNum >= 12}
                      className="p-1.5 rounded bg-[#212317] border border-[#3a3725] disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-[#c9a84c]" />
                    </button>
                  </div>
                </div>

                {/* Educational Narrative */}
                <p className="text-sm text-[#cdc7b2] leading-relaxed font-serif">
                  {selectedTurnData.hText}
                </p>

                {/* Historical Quote (if any) */}
                {selectedTurnData.quote && (
                  <div className="p-3.5 rounded-lg bg-[#1c1f15] border-l-4 border-[#c9a84c] text-xs italic text-[#ded9c7] flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                    <div>
                      <div>{selectedTurnData.quote.text}</div>
                      <span className="text-[11px] not-italic text-[#999279] mt-1 block">
                        — {selectedTurnData.quote.author}
                      </span>
                    </div>
                  </div>
                )}

                {/* Gameplay Impact Note */}
                <div className="p-3 rounded-lg bg-[#14150e] border border-[#2e2a1b] text-xs font-mono text-[#a8a186]">
                  <strong className="text-[#c9a84c]">Vliv ve hře: </strong>
                  <span>{selectedTurnData.fLog ?? 'Tah reorganizace a plánování.'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONS & FACTIONS */}
          {activeTab === 'persons' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Person List Sidebar */}
              <div className="flex flex-col gap-2">
                {HISTORICAL_PERSONS.map((person) => {
                  const isSelected = person.id === selectedPersonId;
                  return (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPersonId(person.id)}
                      className={`p-3 rounded-lg text-left transition border cursor-pointer ${
                        isSelected
                          ? 'bg-[#222418] border-[#c9a84c] text-white shadow-md'
                          : 'bg-[#161710] border-[#2d2a1b] text-[#9e967d] hover:bg-[#1c1e14] hover:text-[#ded9c7]'
                      }`}
                    >
                      <div className="font-serif font-bold text-sm text-[#f0ebd9]">
                        {person.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#c9a84c] mt-0.5">
                        {person.faction}
                      </div>
                      <div className="text-[10px] text-[#7a745d] line-clamp-1 mt-0.5">
                        {person.role}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Person Details Card */}
              <div className="md:col-span-2 bg-[#171912] border border-[#333020] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
                <div className="border-b border-[#2d2a1b] pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#c9a84c] font-bold">
                    {selectedPerson.faction}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                    {selectedPerson.name}
                  </h3>
                  <p className="text-xs text-[#a8a187] font-mono mt-0.5">
                    {selectedPerson.role}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#c9a84c] mb-1">
                    Život a působení v odboji
                  </h4>
                  <p className="text-sm text-[#ded9c7] leading-relaxed font-serif">
                    {selectedPerson.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#c9a84c] mb-1">
                    Historický dopad
                  </h4>
                  <p className="text-xs text-[#bfb89e] leading-relaxed">
                    {selectedPerson.impact}
                  </p>
                </div>

                {selectedPerson.quote && (
                  <div className="p-3 rounded-lg bg-[#1c1f15] border-l-4 border-[#c9a84c] text-xs italic text-[#f4eed9] flex items-start gap-2 mt-auto">
                    <Quote className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                    <span>{selectedPerson.quote}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ARCHIVAL MAP */}
          {activeTab === 'map' && (
            <div className="flex flex-col gap-4">
              <div className="text-xs text-[#a8a187] leading-relaxed">
                Níže je autentická historická mapa německé vojenské správy Srbska a okolních států z let 1941–1944 
                (původní předloha z projektu Jogurtoslávie). Zobrazuje rozdělení okupované Jugoslávie mezi Osu 
                (Maďarsko, Nezávislý stát Chorvatsko, Bulharsko, Německo).
              </div>

              <div className="relative rounded-xl overflow-hidden border-2 border-[#3d3824] shadow-2xl bg-black">
                <img
                  src="/Jogurtoslavie.jpeg"
                  alt="Historická mapa Jugoslávie 1941-1944"
                  className="w-full max-h-[550px] object-contain"
                />
              </div>

              {/* Geographic Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-lg bg-[#171912] border border-[#2e2b1c] text-xs">
                  <strong className="text-[#c9a84c] block mb-1">1. Banát a Folksdojčeři:</strong>
                  <p className="text-[#a8a187] leading-relaxed">
                    Etnicky německá oblast měla autonomní správu a sloužila jako tankový koridor Wehrmachtu na Bělehrad.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#171912] border border-[#2e2b1c] text-xs">
                  <strong className="text-[#c9a84c] block mb-1">2. Dinárský horský masiv:</strong>
                  <p className="text-[#a8a187] leading-relaxed">
                    Nepřístupné zalesněné hory západního a jižního Srbska umožnily partyzánům zřídit podzemní základny a přežít 7 velkých německých ofenzív.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOSSARY */}
          {activeTab === 'glossary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GLOSSARY.map((term, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#171912] border border-[#2d2a1b] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-[#f0ebd9]">
                        {term.term}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202216] text-[#c9a84c] border border-[#3b3824]">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#a8a187] leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dossier Footer */}
        <div className="p-3 px-6 bg-[#161710] border-t border-[#2e2b1c] flex items-center justify-between text-xs font-mono text-[#8e876f]">
          <span>Edukativní modul pro studenty historie a zájemce o 2. světovou válku</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#222418] hover:bg-[#2d3020] text-[#c9a84c] border border-[#484227] cursor-pointer"
          >
            Zavřít archiv
          </button>
        </div>
      </div>
    </div>
  );
};
