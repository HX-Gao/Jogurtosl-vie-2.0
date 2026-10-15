/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * JOGURTOSLÁVIE — Historická strategická a edukativní hra (1941–1944)
 * Inspirováno a rozšířeno na základě projektu HX-Gao/Jogurtoslavie
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Card, RegionState, CombatRollResult, HistoricalDilemma } from './types';
import { REGIONS_DATA, TERRAINS, HISTORICAL_TURNS, RANDOM_EVENTS, CARDS_DATA, HISTORICAL_DILEMMAS } from './gameData';
import {
  playCardDrawSound,
  playCardPlaySound,
  playDiceRollSound,
  playCombatSound,
  playSabotageSound,
  playPhaseDrum,
  playRadioChirp,
  playVictorySound,
  playDefeatSound,
  setSoundMuted,
  isSoundMuted
} from './sound';

import { TitleScreen } from './components/TitleScreen';
import { SerbiaMap } from './components/SerbiaMap';
import { HUD } from './components/HUD';
import { CardsPanel } from './components/CardsPanel';
import { CombatDialog } from './components/CombatDialog';
import { HistoricalDossier } from './components/HistoricalDossier';
import { HistoricalDilemmaModal } from './components/HistoricalDilemmaModal';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { BookOpen, ScrollText, CheckCircle2, AlertCircle } from 'lucide-react';

let uidCounter = 1;
const getNextUid = () => uidCounter++;
const rollD6 = () => Math.floor(Math.random() * 6) + 1;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createFreshDeck(): Card[] {
  return shuffle(
    CARDS_DATA.flatMap((card) =>
      Array.from({ length: card.n }, () => ({
        ...card,
        _uid: getNextUid(),
      }))
    )
  );
}

function createInitialRegions(): Record<string, RegionState> {
  return Object.fromEntries(
    REGIONS_DATA.map((rd) => [
      rd.id,
      {
        ...rd,
        control: rd.sc,
        garrison: rd.sg,
        bases: rd.sb,
        fortified: rd.isCapital,
      },
    ])
  );
}

function initializeGame(difficulty: 'easy' | 'normal' | 'hard' = 'normal'): GameState {
  const deck = createFreshDeck();
  const startingMorale = difficulty === 'easy' ? 75 : difficulty === 'hard' ? 50 : 62;
  const startingFighters = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 6 : 8;
  const startingResources = difficulty === 'easy' ? 8 : difficulty === 'hard' ? 4 : 6;

  return {
    regions: createInitialRegions(),
    morale: startingMorale,
    fighters: startingFighters,
    resources: startingResources,
    turn: 1,
    maxTurns: 12,
    phase: 'event',
    deck: deck.slice(4),
    hand: deck.slice(0, 4),
    actionsLeft: 2,
    skipGerman: false,
    redArmy: false,
    british: false,
    over: null,
    log: [
      '════════════════════════════════════════════════',
      '🎮 JOGURTOSLÁVIE — Historická kampaň 1941–1944 zahájena',
      '🎯 Cíl: Osvobodit Bělehrad (kontrola ≥ +3) a celkem alespoň 3 oblasti',
      '⚠️  Bělehrad: Pevnost chráněná Wehrmachtem do příchodu Rudé armády (tah 11)',
      '════════════════════════════════════════════════',
    ],
    difficulty,
    stats: {
      battlesFought: 0,
      battlesWon: 0,
      sabotagesConducted: 0,
      recruitsGained: 0,
      eventsEncountered: 0,
    },
  };
}

function checkVictoryCondition(g: GameState): 'win' | 'lose' | null {
  if (g.morale <= 0) return 'lose';
  const liberated = Object.values(g.regions).filter((r) => r.control >= 3);
  const belgradeLiberated = (g.regions.belehrad?.control ?? -5) >= 3;

  if (belgradeLiberated && liberated.length >= 3) return 'win';
  if (g.turn > g.maxTurns) {
    return belgradeLiberated && liberated.length >= 3 ? 'win' : 'lose';
  }
  return null;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Modals & Panels state
  const [combatResult, setCombatResult] = useState<CombatRollResult | null>(null);
  const [activeDilemma, setActiveDilemma] = useState<HistoricalDilemma | null>(null);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const [dossierTurn, setDossierTurn] = useState<number>(1);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [sideTab, setSideTab] = useState<'facts' | 'log'>('facts');

  // Handle Game Start
  const handleStartGame = (difficulty: 'easy' | 'normal' | 'hard') => {
    const newGame = initializeGame(difficulty);
    setGameState(newGame);
    setSelectedCard(null);
  };

  // Turn advance helper
  const addLogEntry = useCallback((g: GameState, msg: string): GameState => {
    return { ...g, log: [msg, ...g.log] };
  }, []);

  // Phase 1: Event Phase Execution
  const runEventPhase = useCallback(() => {
    if (!gameState) return;
    playRadioChirp();

    const turnData = HISTORICAL_TURNS.find((t) => t.n === gameState.turn);
    let nextGame: GameState = {
      ...gameState,
      regions: { ...gameState.regions },
      stats: {
        ...gameState.stats,
        eventsEncountered: gameState.stats.eventsEncountered + 1,
      },
    };

    // Apply historical turn effect
    if (turnData?.fApply) {
      nextGame = turnData.fApply(nextGame);
      if (turnData.fLog) {
        nextGame = addLogEntry(nextGame, turnData.fLog);
      }
    }

    // Check if a historical dilemma triggers on this turn
    if (gameState.turn === 2) {
      setActiveDilemma(HISTORICAL_DILEMMAS[0]);
    } else if (gameState.turn === 7) {
      setActiveDilemma(HISTORICAL_DILEMMAS[1]);
    }

    // Random Event: always for non-historical turns, 50% for historical
    if (!turnData?.hist || Math.random() > 0.5) {
      const validEvents = RANDOM_EVENTS.filter((e) => !e.cond || e.cond(nextGame));
      if (validEvents.length > 0) {
        const picked = validEvents[Math.floor(Math.random() * validEvents.length)];
        nextGame = picked.apply({ ...nextGame, regions: { ...nextGame.regions } });
        nextGame = addLogEntry(nextGame, picked.log);
      }
    }

    nextGame = addLogEntry(
      nextGame,
      `📜 Tah ${gameState.turn} — ${turnData?.date ?? '?'}: ${turnData?.short ?? 'Událost'}`
    );

    nextGame.phase = 'german';
    const vc = checkVictoryCondition(nextGame);
    if (vc) {
      nextGame.over = vc;
      if (vc === 'win') playVictorySound();
      else playDefeatSound();
    }

    setGameState(nextGame);
    setDossierTurn(gameState.turn);
  }, [gameState, addLogEntry]);

  // Phase 2: German AI Execution
  const runGermanPhase = useCallback(() => {
    if (!gameState) return;
    playPhaseDrum();

    if (gameState.skipGerman) {
      let g = addLogEntry(
        { ...gameState, skipGerman: false },
        '🕵️ Výzvědná síť včas varovala štáb: Wehrmacht byl zmaten falešnými depešemi – německá fáze přeskočena!'
      );
      g.phase = 'player';
      g.actionsLeft = 2;
      setGameState(g);
      return;
    }

    let g: GameState = { ...gameState, regions: { ...gameState.regions } };
    const rIds = Object.keys(g.regions);

    // 1. Wehrmacht reinforces weakest occupied zone
    const germanZones = rIds
      .filter((id) => g.regions[id].control <= 0)
      .sort((a, b) => g.regions[a].garrison - g.regions[b].garrison);

    if (germanZones.length > 0) {
      const targetId = germanZones[0];
      const boostAmount = g.turn <= 5 ? 2 : 1;
      g.regions[targetId] = {
        ...g.regions[targetId],
        garrison: Math.min(6, g.regions[targetId].garrison + boostAmount),
      };
      g = addLogEntry(
        g,
        `🪖 Wehrmacht posílil ${g.regions[targetId].name} o +${boostAmount} posádku (nyní ${g.regions[targetId].garrison}).`
      );
    }

    // 2. Wehrmacht counter-attack against the most partisan-controlled non-capital region
    const partisanZones = rIds
      .filter((id) => g.regions[id].control > 0 && id !== 'belehrad')
      .sort((a, b) => g.regions[b].control - g.regions[a].control);

    if (partisanZones.length > 0) {
      const targetId = partisanZones[0];
      const targetRegion = g.regions[targetId];
      const terrain = TERRAINS[targetRegion.ter];
      const banatExtra = targetId === 'banat' ? 1 : 0;

      const germanDie = rollD6();
      const germanScore = germanDie + terrain.gM + Math.floor(targetRegion.garrison * 0.8) + banatExtra;

      const partisanDie = rollD6();
      const partisanScore =
        partisanDie + terrain.pM + targetRegion.bases * 2 + Math.min(3, Math.floor(g.fighters / 4));

      if (germanScore > partisanScore) {
        const newControl = Math.max(-5, targetRegion.control - 2);
        let newBases = targetRegion.bases;
        if (newBases > 0) {
          if (targetId === 'jiz' && newBases <= 1) {
            newBases = 1; // Southern Serbia mountain retreat base is protected
          } else {
            newBases = Math.max(0, newBases - 1);
          }
        }
        g.regions[targetId] = {
          ...targetRegion,
          control: newControl,
          bases: newBases,
        };
        g = addLogEntry(
          g,
          `⚔️ Trestná výprava na ${targetRegion.name}: Němci (${germanScore}) prorazili partyzány (${partisanScore})! Kontrola klesla na ${newControl}${
            newBases < targetRegion.bases ? ' (základna zničena)' : ''
          }.`
        );
      } else {
        g = addLogEntry(
          g,
          `🛡️ Trestná výprava na ${targetRegion.name}: Partyzáni (${partisanScore}) statečně odrazili Wehrmacht (${germanScore})!`
        );
      }
    }

    // 3. Heavy Occupation Pressure
    const totalGarrison = rIds.reduce((sum, id) => sum + g.regions[id].garrison, 0);
    if (totalGarrison > 13) {
      g.morale = Math.max(0, g.morale - 3);
      g = addLogEntry(
        g,
        `😰 Těžká okupace celého Srbska (${totalGarrison} posádek celkem) vyčerpává lid – morálka klesá o 3.`
      );
    }

    g.phase = 'player';
    g.actionsLeft = 2;
    const vc = checkVictoryCondition(g);
    if (vc) {
      g.over = vc;
      if (vc === 'win') playVictorySound();
      else playDefeatSound();
    }

    setGameState(g);
  }, [gameState, addLogEntry]);

  // Phase 3: End of Turn / Advance to next month
  const runEndTurn = useCallback(() => {
    if (!gameState) return;
    playPhaseDrum();

    let g: GameState = { ...gameState, regions: { ...gameState.regions } };
    const endTurnBonuses: string[] = [];

    // Eastern Serbia border supply line
    if (g.regions.vych && g.regions.vych.control > 0) {
      g.resources = Math.min(20, g.resources + 1);
      endTurnBonuses.push('Východní Srbsko: +1 zásoby z hranic');
    }
    // Belgrade liberation morale boost
    if (g.regions.belehrad && g.regions.belehrad.control >= 3) {
      g.morale = Math.min(100, g.morale + 5);
      endTurnBonuses.push('Bělehrad pod kontrolou: +5 morálka');
    }
    // British SOE ongoing drops
    if (g.british && g.turn >= 9) {
      g.resources = Math.min(20, g.resources + 2);
      endTurnBonuses.push('Britská mise SOE: +2 shozené zásoby');
    }

    if (endTurnBonuses.length > 0) {
      g = addLogEntry(g, `💰 Konec měsíce: ${endTurnBonuses.join(', ')}`);
    }

    g.turn += 1;
    g.phase = 'event';

    const vc = checkVictoryCondition(g);
    if (vc) {
      g.over = vc;
      if (vc === 'win') playVictorySound();
      else playDefeatSound();
    }

    setGameState(g);
    setSelectedCard(null);
  }, [gameState, addLogEntry]);

  // Handle advancing whatever phase is active
  const handleAdvancePhase = () => {
    if (!gameState || gameState.over) return;
    if (gameState.phase === 'event') runEventPhase();
    else if (gameState.phase === 'german') runGermanPhase();
    else if (gameState.phase === 'player') runEndTurn();
  };

  // Card Execution
  const executeCardPlay = (card: Card, targetRegionId: string | null) => {
    if (!gameState || gameState.phase !== 'player' || gameState.actionsLeft <= 0 || gameState.over) return;
    if (gameState.resources < card.cost) return;

    let g: GameState = {
      ...gameState,
      regions: { ...gameState.regions },
      resources: gameState.resources - card.cost,
      stats: { ...gameState.stats },
    };

    const targetRegion = targetRegionId ? g.regions[targetRegionId] : null;
    const terrain = targetRegion ? TERRAINS[targetRegion.ter] : null;

    let logMsg = '';

    switch (card.id) {
      case 'atk': {
        if (!targetRegion || !terrain || !targetRegionId) return;
        playDiceRollSound();

        const pDie = rollD6();
        const gDie = rollD6();

        const isBelgrade = targetRegionId === 'belehrad';
        const fortPenalty = isBelgrade && targetRegion.fortified !== false ? -4 : 0;
        const redArmyBonus = isBelgrade && g.redArmy ? 4 : 0;
        const fighterBonus = Math.min(4, Math.floor(g.fighters / 2));
        const banatBonus = targetRegionId === 'banat' ? 1 : 0;

        const pTotal = pDie + terrain.pM + fighterBonus + fortPenalty + redArmyBonus;
        const gTotal = gDie + terrain.gM + targetRegion.garrison + banatBonus;

        const isWin = pTotal > gTotal;

        // Build modifier breakdown
        const pBreakdown = [
          `Hod kostkou: ${pDie}`,
          `Terén (${terrain.label}): ${terrain.pM >= 0 ? `+${terrain.pM}` : terrain.pM}`,
          `Podpora bojovníků: +${fighterBonus}`,
        ];
        if (fortPenalty !== 0) pBreakdown.push(`Opevnění pevnosti: ${fortPenalty}`);
        if (redArmyBonus !== 0) pBreakdown.push(`Rudá armáda (T-34): +${redArmyBonus}`);

        const gBreakdown = [
          `Hod kostkou: ${gDie}`,
          `Terén (${terrain.label}): ${terrain.gM >= 0 ? `+${terrain.gM}` : terrain.gM}`,
          `Německá posádka: +${targetRegion.garrison}`,
        ];
        if (banatBonus !== 0) gBreakdown.push(`Tankový koridor: +${banatBonus}`);

        g.stats.battlesFought += 1;

        if (isWin) {
          g.stats.battlesWon += 1;
          g.regions[targetRegionId] = {
            ...targetRegion,
            control: Math.min(5, targetRegion.control + 2),
            garrison: Math.max(0, targetRegion.garrison - 1),
            fortified: false,
          };
          g.fighters = Math.max(0, g.fighters - 1);
          logMsg = `⚔️ Útok na ${targetRegion.name}: Partyzáni (${pTotal}) > Wehrmacht (${gTotal}) → ÚSPĚCH! Kontrola +2, posádka -1, padl 1 partyzán.`;
          playCombatSound(true);
        } else {
          g.fighters = Math.max(0, g.fighters - 2);
          logMsg = `⚔️ Útok na ${targetRegion.name}: Partyzáni (${pTotal}) ≤ Wehrmacht (${gTotal}) → Odraženi! Ztráta 2 bojovníků.`;
          playCombatSound(false);
        }

        setCombatResult({
          type: 'attack',
          regionId: targetRegionId,
          regionName: targetRegion.name,
          terrain: terrain.label,
          partisanDice: pDie,
          partisanMod: terrain.pM + fighterBonus + fortPenalty + redArmyBonus,
          partisanBreakdown: pBreakdown,
          partisanTotal: pTotal,
          germanDice: gDie,
          germanMod: terrain.gM + targetRegion.garrison + banatBonus,
          germanBreakdown: gBreakdown,
          germanTotal: gTotal,
          success: isWin,
          message: isWin
            ? `Úspěšný přepad! Zóna osvobozena a Wehrmacht zatlačen zpět.`
            : `Německá posádka útok odrazila. Partyzáni se stáhli se ztrátami.`,
          effects: {
            controlChange: isWin ? 2 : 0,
            garrisonChange: isWin ? -1 : 0,
            fighterChange: isWin ? -1 : -2,
          },
        });
        break;
      }

      case 'sab': {
        if (!targetRegion || !terrain || !targetRegionId) return;
        playDiceRollSound();

        const sDie = rollD6();
        const sTotal = sDie + terrain.pM;
        const isSuccess = sTotal >= 4;

        g.stats.sabotagesConducted += 1;

        if (isSuccess) {
          playSabotageSound();
          const extraSupplies = targetRegionId === 'stred' ? 2 : 0;
          g.regions[targetRegionId] = {
            ...targetRegion,
            garrison: Math.max(0, targetRegion.garrison - 2),
          };
          g.resources = Math.min(20, g.resources + extraSupplies);
          logMsg = `💣 Sabotáž v ${targetRegion.name} (${sTotal} ≥ 4): Úspěch! Německá posádka -2.${
            extraSupplies > 0 ? ' Získány +2 zásoby ze zbrojovky Zastava v Kragujevaci.' : ''
          }`;
        } else {
          g.fighters = Math.max(0, g.fighters - 1);
          logMsg = `💣 Sabotáž v ${targetRegion.name} (${sTotal} < 4): Záškodníci odhaleni, -1 bojovník.`;
        }

        setCombatResult({
          type: 'sabotage',
          regionId: targetRegionId,
          regionName: targetRegion.name,
          terrain: terrain.label,
          partisanDice: sDie,
          partisanMod: terrain.pM,
          partisanBreakdown: [`Hod kostkou: ${sDie}`, `Terén: ${terrain.pM >= 0 ? `+${terrain.pM}` : terrain.pM}`],
          partisanTotal: sTotal,
          success: isSuccess,
          message: isSuccess
            ? 'Vyhozen do povětří muniční sklad a železniční most! Posádka -2.'
            : 'Hlídka SS záškodníky odhalila. Nálož neodpálena, 1 bojovník padl.',
          effects: {
            garrisonChange: isSuccess ? -2 : 0,
            fighterChange: isSuccess ? 0 : -1,
            resourceChange: isSuccess && targetRegionId === 'stred' ? 2 : 0,
          },
        });
        break;
      }

      case 'rec': {
        playCardPlaySound();
        const liberatedCount = Object.values(g.regions).filter((r) => r.control >= 1).length;
        const recruited = 4 + liberatedCount;
        g.fighters += recruited;
        g.stats.recruitsGained += recruited;
        logMsg = `👥 Všeobecný nábor: +${recruited} nových bojovníků (4 základní + ${liberatedCount} z vašich oblastí).`;
        break;
      }

      case 'bas': {
        if (!targetRegion || !terrain || !targetRegionId) return;
        playCardPlaySound();

        if (targetRegion.control < 0) {
          g.resources += card.cost;
          setGameState(addLogEntry(g, `❌ ${targetRegion.name}: Pro vybudování základny je nutná kontrola ≥ 0.`));
          return;
        }
        if (targetRegion.bases >= 2) {
          g.resources += card.cost;
          setGameState(addLogEntry(g, `❌ ${targetRegion.name}: V oblasti již existují maximální 2 základny.`));
          return;
        }

        g.regions[targetRegionId] = {
          ...targetRegion,
          bases: targetRegion.bases + 1,
        };
        logMsg = `🏕️ Vybudována nová partyzánská základna v ${targetRegion.name} (+2 k obraně${
          terrain.pM > 0 ? ', v horách +1 bonus' : ''
        }).`;
        break;
      }

      case 'prp': {
        if (!targetRegion || !targetRegionId) return;
        playCardPlaySound();
        g.morale = Math.min(100, g.morale + 10);
        g.regions[targetRegionId] = {
          ...targetRegion,
          control: Math.min(5, targetRegion.control + 1),
        };
        logMsg = `📢 Agitace a tiskoviny v ${targetRegion.name}: Morálka +10, kontrola oblasti +1.`;
        break;
      }

      case 'sup': {
        playCardPlaySound();
        g.resources = Math.min(20, g.resources + 5);
        g.fighters += 2;
        logMsg = `✈️ Noční padákový shoz RAF z Itálie: +5 zásob, +2 zkušení partyzáni.`;
        break;
      }

      case 'int': {
        playCardPlaySound();
        g.skipGerman = true;
        logMsg = `🕵️ Zpravodajská síť v Abwehru aktivována! Příští německá akční fáze je zcela zmařena.`;
        break;
      }

      case 'dip': {
        playCardPlaySound();
        g.fighters += 4;
        if (!g.british) {
          g.british = true;
          g.resources = Math.min(20, g.resources + 3);
        }
        const mountainZones = ['zap', 'jiz'].filter((id) => g.regions[id]?.control >= 0);
        mountainZones.forEach((id) => {
          g.regions[id] = { ...g.regions[id], control: Math.min(5, g.regions[id].control + 1) };
        });
        logMsg = `🤝 Spojenecká mise SOE dorazila k hlavnímu štábu: +4 bojovníci, britská podpora aktivována${
          mountainZones.length > 0 ? ', kontrola v horách +1' : ''
        }.`;
        break;
      }

      default:
        logMsg = `${card.name} použita.`;
    }

    // Discard played card and draw replacement
    g.hand = g.hand.filter((c) => c._uid !== card._uid);
    if (g.deck.length > 0) {
      g.hand = [...g.hand, g.deck[0]];
      g.deck = g.deck.slice(1);
      playCardDrawSound();
    }

    // Reshuffle deck if completely empty
    if (g.hand.length === 0 && g.deck.length === 0) {
      const fresh = createFreshDeck();
      g.hand = fresh.slice(0, 4);
      g.deck = fresh.slice(4);
      g = addLogEntry(g, '🔄 Balíček vyčerpán – karty byly kompletně promíchány a rozdány 4 nové!');
    }

    g.actionsLeft -= 1;
    g = addLogEntry(g, `   ↳ ${logMsg}`);
    g = addLogEntry(g, `🃏 ${card.icon} ${card.name} zahrána (zbývá akcí: ${g.actionsLeft})`);

    const vc = checkVictoryCondition(g);
    if (vc) {
      g.over = vc;
      if (vc === 'win') playVictorySound();
      else playDefeatSound();
    }

    setGameState(g);
    setSelectedCard(null);
  };

  // Card click handler
  const handleSelectCard = (card: Card) => {
    if (!gameState || gameState.phase !== 'player' || gameState.actionsLeft <= 0) return;
    if (!card.reg) {
      // Global instant effect card
      executeCardPlay(card, null);
    } else {
      // Toggle card targeting
      setSelectedCard((prev) => (prev?._uid === card._uid ? null : card));
    }
  };

  // Region click handler on SVG map
  const handleSelectRegion = (regionId: string) => {
    if (!selectedCard) return;
    executeCardPlay(selectedCard, regionId);
  };

  // Handle Dilemma choices
  const handleChooseDilemmaOption = (optionIndex: number) => {
    if (!activeDilemma || !gameState) return;
    const option = activeDilemma.options[optionIndex];
    const { state: nextState, logMsg } = option.apply(gameState);
    const finalized = addLogEntry(nextState, logMsg);
    setGameState(finalized);
    setActiveDilemma(null);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not process shortcuts if modals are open
      if (combatResult) return;
      if (activeDilemma) return;

      if (e.key === 'Escape') {
        if (showDossier) setShowDossier(false);
        else if (showRules) setShowRules(false);
        else if (selectedCard) setSelectedCard(null);
      } else if (e.key === 's' || e.key === 'S') {
        setSoundMuted(!isSoundMuted());
      } else if (e.key === 'h' || e.key === 'H') {
        setShowDossier(true);
      } else if (e.key === 'r' || e.key === 'R' || e.key === '?') {
        setShowRules(true);
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Space / Enter advances the phase or triggers phase button
        e.preventDefault();
        handleAdvancePhase();
      } else if (gameState?.phase === 'player' && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (gameState.hand[idx]) {
          handleSelectCard(gameState.hand[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedCard, combatResult, activeDilemma, showDossier, showRules]);

  // Title Screen View
  if (!gameState) {
    return (
      <TitleScreen
        onStart={handleStartGame}
        onOpenRules={() => setShowRules(true)}
        onOpenDossier={() => setShowDossier(true)}
      />
    );
  }

  const currentTurnData = HISTORICAL_TURNS.find((t) => t.n === gameState.turn) || HISTORICAL_TURNS[0];
  const dossierTurnData = HISTORICAL_TURNS.find((t) => t.n === dossierTurn) || currentTurnData;

  return (
    <div className="relative w-screen h-screen bg-[#0d0e09] text-[#ded9c7] flex flex-col overflow-hidden font-serif select-none">
      {/* 1. TOP TACTICAL HUD */}
      <HUD
        game={gameState}
        onAdvancePhase={handleAdvancePhase}
        onOpenRules={() => setShowRules(true)}
        onOpenDossier={() => {
          setDossierTurn(gameState.turn);
          setShowDossier(true);
        }}
        onReset={() => handleStartGame(gameState.difficulty)}
        onSelectTurnInHistory={(tNum) => {
          setDossierTurn(tNum);
          setShowDossier(true);
        }}
      />

      {/* 2. MAIN BATTLEFIELD VIEWPORT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: SVG TACTICAL MAP */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-1 sm:p-2 bg-[#0d0e09] overflow-hidden">
          <SerbiaMap
            regions={gameState.regions}
            selectedCard={selectedCard}
            onSelectRegion={handleSelectRegion}
            hoveredRegion={hoveredRegion}
            onHoverRegion={setHoveredRegion}
            redArmyActive={gameState.redArmy}
          />
        </div>

        {/* MIDDLE COLUMN: TACTICAL CARDS HAND (Fixed 240px width on desktop) */}
        <div className="w-full md:w-[240px] md:h-full shrink-0 flex flex-col">
          <CardsPanel
            game={gameState}
            selectedCard={selectedCard}
            onSelectCard={handleSelectCard}
            onCancelSelection={() => setSelectedCard(null)}
          />
        </div>

        {/* RIGHT COLUMN: HISTORICAL FACTS & DIARY (280px-340px) */}
        <div className="w-full md:w-[310px] md:h-full bg-[#14150e] border-t md:border-t-0 md:border-l border-[#2e2b1c] flex flex-col shrink-0 overflow-hidden">
          {/* Sub-Tabs: Historical Factsheet vs Command Journal */}
          <div className="flex border-b border-[#2e2b1c] bg-[#181a11] shrink-0">
            <button
              onClick={() => setSideTab('facts')}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                sideTab === 'facts'
                  ? 'border-[#c9a84c] text-[#c9a84c] bg-[#1c1f14]'
                  : 'border-transparent text-[#857f6a] hover:text-[#ded9c7]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Historická fakta</span>
            </button>
            <button
              onClick={() => setSideTab('log')}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                sideTab === 'log'
                  ? 'border-[#c9a84c] text-[#c9a84c] bg-[#1c1f14]'
                  : 'border-transparent text-[#857f6a] hover:text-[#ded9c7]'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>Deník velitelství</span>
            </button>
          </div>

          {/* TAB 1: HISTORICAL FACTS */}
          {sideTab === 'facts' && (
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed">
              <div className="border-b border-[#2d2a1b] pb-2">
                <span className="text-[10px] font-mono text-[#c9a84c] uppercase tracking-wider block">
                  Tah {currentTurnData.n} · {currentTurnData.date}
                </span>
                <h3 className="font-serif font-bold text-white text-sm mt-0.5">
                  {currentTurnData.hTitle}
                </h3>
              </div>

              <p className="text-[#bfb89e] font-serif leading-relaxed">
                {currentTurnData.hText}
              </p>

              {currentTurnData.quote && (
                <div className="p-2.5 rounded bg-[#1c1f15] border-l-2 border-[#c9a84c] text-[11px] italic text-[#ded9c7]">
                  <div>{currentTurnData.quote.text}</div>
                  <span className="text-[10px] not-italic text-[#8c856e] block mt-1">
                    — {currentTurnData.quote.author}
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  setDossierTurn(gameState.turn);
                  setShowDossier(true);
                }}
                className="mt-auto w-full py-2 rounded bg-[#1f2216] hover:bg-[#2c301f] text-[#c9a84c] border border-[#3e3a24] font-mono text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Otevřít kompletní archiv</span>
              </button>
            </div>
          )}

          {/* TAB 2: COMMAND JOURNAL / LOG */}
          {sideTab === 'log' && (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#10110b]">
              {gameState.log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    idx === 0
                      ? 'text-white font-bold bg-[#1b1e13] p-1.5 rounded border-l-2 border-[#c9a84c]'
                      : entry.startsWith('══')
                      ? 'text-[#6f6952] text-[9px]'
                      : entry.startsWith('📜')
                      ? 'text-[#c9a84c] font-semibold border-l-2 border-[#826a27] pl-1.5 mt-1'
                      : entry.startsWith('⚔️') || entry.startsWith('💣')
                      ? 'text-[#ded9c7]'
                      : 'text-[#888168]'
                  }`}
                >
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. MODALS & POPUPS */}
      {/* Combat Resolution Dice Dialog */}
      {combatResult && (
        <CombatDialog
          combat={combatResult}
          onClose={() => setCombatResult(null)}
        />
      )}

      {/* Historical Dilemma Modal */}
      {activeDilemma && (
        <HistoricalDilemmaModal
          dilemma={activeDilemma}
          onChooseOption={handleChooseDilemmaOption}
        />
      )}

      {/* Full Educational Dossier / Encyclopedia Modal */}
      {showDossier && (
        <HistoricalDossier
          currentTurn={gameState.turn}
          initialSelectedTurn={dossierTurn}
          onClose={() => setShowDossier(false)}
        />
      )}

      {/* Rules / Strategy Guide Modal */}
      {showRules && (
        <HelpModal onClose={() => setShowRules(false)} />
      )}

      {/* Game Over Modal (Win / Lose) */}
      {gameState.over && (
        <GameOverModal
          game={gameState}
          onRestart={() => handleStartGame(gameState.difficulty)}
          onOpenDossier={() => setShowDossier(true)}
        />
      )}
    </div>
  );
}
