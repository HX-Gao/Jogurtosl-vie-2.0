import React from 'react';
import { Volume2, VolumeX, BookOpen, Shield, Flame, Award } from 'lucide-react';
import { isSoundMuted, setSoundMuted, playPhaseDrum } from '../sound';

interface TitleScreenProps {
  onStart: (difficulty: 'easy' | 'normal' | 'hard') => void;
  onOpenRules: () => void;
  onOpenDossier: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenRules,
  onOpenDossier
}) => {
  const [muted, setMuted] = React.useState(isSoundMuted());
  const [difficulty, setDifficulty] = React.useState<'easy' | 'normal' | 'hard'>('normal');

  const toggleMute = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const handleStart = () => {
    playPhaseDrum();
    onStart(difficulty);
  };

  // Keyboard shortcut: Space or Enter to start immediately
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStart();
      } else if (e.key === 'r' || e.key === 'R' || e.key === '?') {
        onOpenRules();
      } else if (e.key === 'h' || e.key === 'H') {
        onOpenDossier();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [difficulty]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 sm:p-10 select-none overflow-hidden bg-[#0c0d09] text-[#ded9c7]">
      {/* Background War Room Map Texture */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-luminosity filter contrast-125"
        style={{ backgroundImage: `url('/Jogurtoslavie.jpeg')` }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0c0d09]/80 to-[#0c0d09] pointer-events-none" />

      {/* Top Bar with sound and educational badge */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs tracking-wider uppercase font-mono border-b border-[#2d2c1e] pb-3 text-[#9b947c]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-[#c5ba9d] font-semibold">1941–1944 · Balkánské bojiště Druhé světové války</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#3a3727] hover:border-[#c9a84c] hover:text-[#c9a84c] transition cursor-pointer"
            title="Přepnout zvuk [S]"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#c9a84c]" />}
            <span>{muted ? 'Zvuk vypnut' : 'Zvuk aktivní'}</span>
          </button>
        </div>
      </header>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <main className="relative z-10 my-auto flex flex-col items-center text-center max-w-3xl px-4 py-8">
        {/* Decorative Crest / Yugoslavian Star Lockup */}
        <div className="relative mb-4 group cursor-default">
          <svg className="w-28 h-28 drop-shadow-[0_0_25px_rgba(201,168,76,0.3)] transition-transform duration-700 group-hover:scale-105" viewBox="0 0 100 100">
            {/* Outer Laurel Wreath Ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="#2e2b1c" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="42" fill="#14150e" stroke="#c9a84c" strokeWidth="1.5" />
            
            {/* Five-pointed Red Star with Gold Trim */}
            <polygon
              points="50,15 61,38 86,38 66,54 73,78 50,63 27,78 34,54 14,38 39,38"
              fill="#a82323"
              stroke="#e2c167"
              strokeWidth="2"
            />
            {/* Center Emblem Details */}
            <circle cx="50" cy="50" r="10" fill="#191a11" stroke="#e2c167" strokeWidth="1" />
            <text x="50" y="53" textAnchor="middle" fill="#c9a84c" fontSize="8" fontWeight="bold" fontFamily="monospace">1941</text>
          </svg>
        </div>

        {/* Bespoke Title Lockup */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-[#f2e6c8] via-[#c9a84c] to-[#7f6324] uppercase drop-shadow-md font-serif mb-2">
          JOGURTOSLÁVIE
        </h1>
        
        <p className="text-sm sm:text-base font-serif italic text-[#c0b89e] max-w-xl leading-relaxed mb-6">
          Edukativní historická strategická hra o partyzánském odboji v Srbsku, 
          hrdinství v Dinárských Alpách a osvobození Bělehradu v říjnu 1944.
        </p>

        {/* Historical Mission Card */}
        <div className="w-full bg-[#161710]/90 border border-[#3b3824] rounded-lg p-4 sm:p-5 mb-8 text-left shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[#c9a84c] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span>Historický úkol velitele odboje (12 tahů)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#b8b096] leading-relaxed">
            Ve 12 tazích od dubnové invaze 1941 až po belgradskou ofenzívu 1944 musíte vést partyzánské oddíly, 
            odolat nacistickým kárným expedicím, sabotovat okupanty a s podporou Rudé armády osvobodit 
            <strong className="text-white"> Bělehrad</strong> a alespoň <strong className="text-white">2 další srbské oblasti</strong> dříve, než klesne morálka lidu na nulu.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8a846c]">Obtížnost:</span>
          <div className="flex gap-2">
            {[
              { id: 'easy', label: 'Snadná (Více zásob)', desc: '10 bojovníků, 8 zásob, 75 morálka' },
              { id: 'normal', label: 'Historická (Standard)', desc: '8 bojovníků, 6 zásob, 62 morálka' },
              { id: 'hard', label: 'Tvrdá okupace', desc: '6 bojovníků, 4 zásoby, 50 morálka' },
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id as 'easy' | 'normal' | 'hard')}
                className={`px-3 py-1.5 rounded text-xs font-mono cursor-pointer transition ${
                  difficulty === d.id
                    ? 'bg-[#c9a84c] text-[#0f100b] font-bold shadow-md'
                    : 'bg-[#181912] text-[#9c947c] border border-[#302e1f] hover:border-[#524e35]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded bg-gradient-to-r from-[#942020] via-[#b82929] to-[#7f1818] hover:from-[#a82525] hover:to-[#911b1b] text-white font-serif font-bold text-base sm:text-lg tracking-widest uppercase shadow-[0_0_25px_rgba(180,40,40,0.5)] border border-[#e26969]/50 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Flame className="w-5 h-5 text-amber-300" />
            <span>ZAHÁJIT ODBOJ</span>
          </button>

          <button
            onClick={onOpenRules}
            className="w-full sm:w-auto px-5 py-3.5 rounded bg-[#171811] hover:bg-[#202217] text-[#c9a84c] border border-[#3f3b25] hover:border-[#c9a84c] font-mono text-xs font-semibold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pravidla hry</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="w-full sm:w-auto px-5 py-3.5 rounded bg-[#171811] hover:bg-[#202217] text-[#86afdb] border border-[#2b3c4f] hover:border-[#4d7db3] font-mono text-xs font-semibold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Archiv a osobnosti</span>
          </button>
        </div>
      </main>

      {/* Flat Control-Hint Line & Attribution Footer */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#777058] border-t border-[#2d2c1e] pt-3 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[#a49977]">Ovládání:</span>
          <span>Karty [1–4]</span>
          <span>·</span>
          <span>Mezerník / Enter [Další akce]</span>
          <span>·</span>
          <span>M [Dobová mapa]</span>
          <span>·</span>
          <span>H [Historie]</span>
          <span>·</span>
          <span>Esc [Zavřít okno]</span>
        </div>
        <div className="text-right">
          <span>Na motivy předlohy </span>
          <span className="text-[#c9a84c]">HX-Gao / Jogurtoslávie</span>
          <span> · Licence GPL-3.0</span>
        </div>
      </footer>
    </div>
  );
};
