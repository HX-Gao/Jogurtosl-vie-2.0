import React, { useState } from 'react';
import { RegionState, Card } from '../types';
import { REGIONS_DATA, TERRAINS } from '../gameData';
import { Eye, MapPin, Compass } from 'lucide-react';

interface SerbiaMapProps {
  regions: Record<string, RegionState>;
  selectedCard: Card | null;
  onSelectRegion: (regionId: string) => void;
  hoveredRegion: string | null;
  onHoverRegion: (regionId: string | null) => void;
  redArmyActive: boolean;
}

function getControlFill(control: number, isCapital: boolean, fortified: boolean): string {
  if (isCapital && fortified) {
    return control <= -4 ? '#380606' : '#571010';
  }
  if (control <= -4) return '#6b0d0d'; // Severe Nazi occupation
  if (control <= -3) return '#8c1c1c';
  if (control <= -2) return '#a83222';
  if (control <= -1) return '#995228';
  if (control === 0) return '#574d39'; // Contested / Neutral
  if (control <= 2) return '#2e5927';  // Partisan influence
  return '#1b6b23';                   // Liberated!
}

export const SerbiaMap: React.FC<SerbiaMapProps> = ({
  regions,
  selectedCard,
  onSelectRegion,
  hoveredRegion,
  onHoverRegion,
  redArmyActive
}) => {
  const [showArchivalPhoto, setShowArchivalPhoto] = useState(false);
  const [archivalOpacity, setArchivalOpacity] = useState(0.65);

  const canTargetRegion = !!selectedCard?.reg;
  const activeHover = hoveredRegion ? regions[hoveredRegion] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      {/* Top Map Controls: Archival Overlay Toggle */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#14150e]/90 border border-[#3b3824] px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono">
        <button
          onClick={() => setShowArchivalPhoto(!showArchivalPhoto)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer ${
            showArchivalPhoto ? 'bg-[#c9a84c] text-[#0d0d08] font-bold' : 'bg-[#1e2014] text-[#aba388] hover:text-white'
          }`}
          title="Porovnat s autentickou historickou mapou Srbska 1941–1944"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showArchivalPhoto ? 'Historická mapa ZAP' : 'Porovnat s dobovou mapou'}</span>
        </button>

        {showArchivalPhoto && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#3a3725]">
            <span className="text-[10px] text-[#888168]">Průhlednost:</span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={archivalOpacity}
              onChange={(e) => setArchivalOpacity(parseFloat(e.target.value))}
              className="w-16 h-1 accent-[#c9a84c] cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Target Action Prompt Banner */}
      {canTargetRegion && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-gradient-to-r from-red-950/90 to-amber-950/90 border border-amber-500/60 px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.25)] text-xs text-amber-200 animate-pulse">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">Klikněte na oblast na mapě pro akci: {selectedCard.name}</span>
        </div>
      )}

      {/* Main Tactical SVG Canvas */}
      <div className="relative w-full max-w-[560px] aspect-[500/520] flex items-center justify-center">
        {/* Archival Map Image Layer (when active) */}
        {showArchivalPhoto && (
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden transition-opacity duration-300 shadow-inner"
            style={{ opacity: archivalOpacity }}
          >
            <img
              src="/Jogurtoslavie.jpeg"
              alt="Historická mapa Srbska 1941-1944"
              className="w-full h-full object-cover mix-blend-screen"
            />
          </div>
        )}

        <svg
          viewBox="0 0 500 520"
          className="w-full h-full drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] rounded-xl"
        >
          <defs>
            {/* Glow Filter */}
            <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Target Pulse Glow */}
            <filter id="target-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Cross-hatch military tactical pattern */}
            <pattern id="military-grid" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff10" strokeWidth="0.8" />
            </pattern>

            {/* Topographical elevation contours */}
            <pattern id="mountain-shading" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#252115" strokeWidth="0.7" strokeDasharray="3 3" />
            </pattern>
          </defs>

          {/* Map Base & Vignette */}
          <rect width="500" height="520" rx="14" fill="#11120c" stroke="#2c2a1c" strokeWidth="2" />
          <rect width="500" height="520" fill="url(#military-grid)" opacity="0.6" />

          {/* Strategic Danube and Sava Rivers (crossing Belgrade!) */}
          <g opacity="0.65" stroke="#3b6285" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Sava River entering from West to Belgrade */}
            <path d="M 10,165 Q 90,162 140,166 T 195,162" />
            {/* Danube River entering from North-West through Belgrade and flowing East */}
            <path d="M 170,20 Q 185,90 195,162 Q 220,168 250,158 T 340,150 T 400,136 T 470,140" />
            <text x="75" y="158" fill="#587e9e" fontSize="7" fontStyle="italic">řeka Sáva</text>
            <text x="355" y="142" fill="#587e9e" fontSize="7" fontStyle="italic">řeka Dunaj</text>
          </g>

          {/* Neighboring Territories & Axis Forces Labels */}
          {[
            { label: 'MAĎARSKO (Osa)', x: 50, y: 45 },
            { label: 'RUMUNSKO (Osa do srpna 44)', x: 350, y: 28 },
            { label: 'NDH / CHORVATSKO (Ustašovci)', x: 12, y: 200 },
            { label: 'BULHARSKO', x: 420, y: 440 },
            { label: 'ČERNÁ HORA', x: 14, y: 460 },
            { label: 'ALBÁNIE', x: 180, y: 508 },
          ].map((item, idx) => (
            <text
              key={idx}
              x={item.x}
              y={item.y}
              fill="#423e2a"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1"
              pointerEvents="none"
            >
              {item.label}
            </text>
          ))}

          {/* Compass Rose */}
          <g transform="translate(450, 480)" opacity="0.5" pointerEvents="none">
            <circle cx="0" cy="0" r="14" fill="#181912" stroke="#484430" strokeWidth="1" />
            <polygon points="0,-12 3,-3 0,0 -3,-3" fill="#c9a84c" />
            <polygon points="0,12 3,3 0,0 -3,3" fill="#665f44" />
            <polygon points="-12,0 -3,-3 0,0 -3,3" fill="#665f44" />
            <polygon points="12,0 3,-3 0,0 3,3" fill="#665f44" />
            <text x="0" y="-14" textAnchor="middle" fill="#c9a84c" fontSize="6" fontWeight="bold">S</text>
          </g>

          {/* Interactive Regions */}
          {REGIONS_DATA.map((rd) => {
            const rs = regions[rd.id];
            if (!rs) return null;

            const isFortified = rs.isCapital && rs.fortified !== false;
            const fill = getControlFill(rs.control, rs.isCapital, isFortified);
            const isHovered = hoveredRegion === rd.id;
            const isClickable = canTargetRegion;

            return (
              <g
                key={rd.id}
                onClick={() => isClickable && onSelectRegion(rd.id)}
                onMouseEnter={() => onHoverRegion(rd.id)}
                onMouseLeave={() => onHoverRegion(null)}
                className={`transition-all duration-200 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {/* Clickable Action Glow Pulse */}
                {isClickable && (
                  <path
                    d={rd.path}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="10"
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Main Region Body */}
                <path
                  d={rd.path}
                  fill={fill}
                  stroke={isClickable ? '#86efac' : isHovered ? '#ffd700' : '#1e1c14'}
                  strokeWidth={isClickable || isHovered ? 2.8 : 1.2}
                  opacity={isHovered ? 0.95 : 0.85}
                />

                {/* Hover Tint Overlay */}
                {isHovered && (
                  <path
                    d={rd.path}
                    fill="#ffffff"
                    stroke="none"
                    opacity="0.08"
                    pointerEvents="none"
                  />
                )}

                {/* Region Name Label */}
                <text
                  x={rd.lx}
                  y={rd.ly - (rd.isCapital ? 4 : 2)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={rd.isCapital ? 9.5 : 10.5}
                  fontWeight="bold"
                  fontFamily="serif"
                  letterSpacing="0.5"
                  pointerEvents="none"
                  style={{ textShadow: '0 2px 4px #000, 0 0 8px #000' }}
                >
                  {rd.name}
                </text>

                {/* Tactical Status Pill: Control, Garrison, Bases */}
                <g pointerEvents="none">
                  {/* Status Box Background */}
                  <rect
                    x={rd.lx - 38}
                    y={rd.ly + 5}
                    width="76"
                    height="16"
                    rx="4"
                    fill="#0f100a"
                    stroke={rs.control > 0 ? '#15803d' : rs.control < 0 ? '#b91c1c' : '#71694f'}
                    strokeWidth="1"
                    opacity="0.92"
                  />

                  {/* Control readout */}
                  <text
                    x={rd.lx - 26}
                    y={rd.ly + 16}
                    fill={rs.control > 0 ? '#4ade80' : rs.control < 0 ? '#f87171' : '#fef08a'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {rs.control > 0 ? `+${rs.control}` : rs.control}
                  </text>

                  {/* Separator dot */}
                  <circle cx={rd.lx - 12} cy={rd.ly + 13} r="1.5" fill="#71694f" />

                  {/* Wehrmacht Garrison icon + count */}
                  <text
                    x={rd.lx - 4}
                    y={rd.ly + 16}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    🪖{rs.garrison}
                  </text>

                  {/* Partisan Bases (if any) */}
                  {rs.bases > 0 && (
                    <text
                      x={rd.lx + 20}
                      y={rd.ly + 16}
                      fill="#86efac"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {'🏕️'.repeat(rs.bases)}
                    </text>
                  )}
                </g>

                {/* City Center Pin Dot */}
                <circle
                  cx={rd.cx}
                  cy={rd.cy}
                  r={rd.isCapital ? 6 : 4}
                  fill={rd.isCapital ? '#eab308' : '#e2e8f0'}
                  stroke={rd.isCapital ? '#991b1b' : '#0f172a'}
                  strokeWidth={rd.isCapital ? 2 : 1}
                  filter={rd.isCapital ? 'url(#map-glow)' : 'none'}
                  pointerEvents="none"
                />

                {/* Terrain badge icon */}
                <text
                  x={rd.lx + (rd.isCapital ? 26 : 32)}
                  y={rd.ly - (rd.isCapital ? 4 : 2)}
                  fontSize="10"
                  pointerEvents="none"
                  opacity="0.85"
                >
                  {TERRAINS[rd.ter].icon}
                </text>

                {/* Fortified Lock Symbol for Belgrade */}
                {isFortified && (
                  <g pointerEvents="none">
                    <circle cx={rd.lx} cy={rd.ly - 20} r="9" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                    <text x={rd.lx} y={rd.ly - 16} textAnchor="middle" fontSize="10">🔒</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Red Army Assault Arrow (when Red Army is active) */}
          {redArmyActive && (
            <g pointerEvents="none" className="animate-pulse">
              <path
                d="M 450,150 Q 320,170 235,164"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="6 3"
              />
              <polygon points="230,164 245,158 243,170" fill="#ef4444" />
              <text x="350" y="185" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace">
                ★ 3. UKRAJINSKÝ FRONT
              </text>
            </g>
          )}

          {/* Map Legend */}
          <g transform="translate(10, 420)" pointerEvents="none">
            <rect width="135" height="90" rx="6" fill="#0d0e09" stroke="#2e2b1c" strokeWidth="1" opacity="0.9" />
            <text x="10" y="15" fill="#c9a84c" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
              KONTROLA OBLASTÍ
            </text>
            {[
              { color: '#6b0d0d', label: 'Těžká okupace (-5 až -4)' },
              { color: '#995228', label: 'Sporné území (-3 až -1)' },
              { color: '#574d39', label: 'Neutrální / Vyrovnané (0)' },
              { color: '#2e5927', label: 'Partyzánský vliv (+1 až +2)' },
              { color: '#1b6b23', label: 'Osvobozeno ✓ (+3 až +5)' },
            ].map((item, idx) => (
              <g key={idx} transform={`translate(10, ${25 + idx * 12})`}>
                <rect width="10" height="8" rx="2" fill={item.color} stroke="#1b1c13" strokeWidth="0.5" />
                <text x="16" y="7.5" fill="#a8a28e" fontSize="7" fontFamily="sans-serif">
                  {item.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Region Hover Details Popover (Bottom bar) */}
      <div className="w-full max-w-[560px] min-h-[54px] mt-2 bg-[#14150e] border border-[#2e2b1c] rounded-lg p-2.5 px-3 flex items-center justify-between text-xs text-[#c5bea9]">
        {activeHover ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c9a84c] text-sm font-serif">{activeHover.name}</span>
                <span className="text-[11px] text-[#8e876e]">({activeHover.city})</span>
                <span className="px-1.5 py-0.5 rounded bg-[#1e2016] text-[#b4a98a] text-[10px] border border-[#3b3724]">
                  {TERRAINS[activeHover.ter].icon} {TERRAINS[activeHover.ter].label}
                </span>
                {activeHover.isCapital && activeHover.fortified !== false && (
                  <span className="text-red-400 text-[10px] font-bold">🔒 Pevnost</span>
                )}
              </div>
              <p className="text-[11px] text-[#9c957d] mt-0.5">{activeHover.sp}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
              <div>
                <span className="text-[#7d7762]">Kontrola: </span>
                <span className={activeHover.control > 0 ? 'text-green-400 font-bold' : activeHover.control < 0 ? 'text-red-400 font-bold' : 'text-amber-300'}>
                  {activeHover.control > 0 ? `+${activeHover.control}` : activeHover.control}
                </span>
              </div>
              <div>
                <span className="text-[#7d7762]">Wehrmacht: </span>
                <span className="text-white font-bold">🪖{activeHover.garrison}</span>
              </div>
              <div>
                <span className="text-[#7d7762]">Základny: </span>
                <span className="text-green-300 font-bold">🏕️{activeHover.bases}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-[#7d7762] italic text-[11px]">
            <span>Najeďte myší na oblast pro vojenské a terénní informace.</span>
            <span className="font-mono not-italic text-[#c9a84c]">
              Cíl: Bělehrad ≥ +3 a celkem 3+ osvobozené zóny
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
