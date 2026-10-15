export type TerrainType = 'plains' | 'mountains' | 'mixed' | 'city';

export interface TerrainInfo {
  label: string;
  icon: string;
  pM: number; // Partisan roll modifier
  gM: number; // German roll modifier
  desc: string;
}

export interface RegionData {
  id: string;
  name: string;
  ter: TerrainType;
  sc: number; // Starting control
  sg: number; // Starting garrison
  sb: number; // Starting bases
  isCapital: boolean;
  city: string;
  cx: number;
  cy: number;
  lx: number;
  ly: number;
  sp: string;
  path: string;
  historicalNote?: string;
}

export interface RegionState extends RegionData {
  control: number;
  garrison: number;
  bases: number;
  fortified?: boolean;
}

export interface TurnEvent {
  n: number;
  date: string;
  short: string;
  hist: boolean;
  fLog?: string;
  fApply?: (g: GameState) => GameState;
  hTitle: string;
  hText: string;
  quote?: { text: string; author: string };
  dilemma?: HistoricalDilemma;
}

export interface HistoricalDilemma {
  id: string;
  title: string;
  situation: string;
  historicalContext: string;
  options: {
    text: string;
    historicalChoice?: boolean;
    consequence: string;
    apply: (g: GameState) => { state: GameState; logMsg: string };
  }[];
}

export interface RandomEvent {
  id: string;
  name: string;
  log: string;
  cond?: (g: GameState) => boolean;
  apply: (g: GameState) => GameState;
}

export interface Card {
  id: string;
  name: string;
  icon: string;
  cost: number;
  n: number;
  reg: boolean; // Requires target region
  ac: string;
  desc: string;
  historicalFlavor: string;
  _uid?: number;
}

export type PhaseType = 'event' | 'german' | 'player';

export interface CombatRollResult {
  type: 'attack' | 'sabotage';
  regionId: string;
  regionName: string;
  terrain: string;
  partisanDice: number;
  partisanMod: number;
  partisanBreakdown: string[];
  partisanTotal: number;
  germanDice?: number;
  germanMod?: number;
  germanBreakdown?: string[];
  germanTotal?: number;
  success: boolean;
  message: string;
  effects: {
    controlChange?: number;
    garrisonChange?: number;
    fighterChange?: number;
    resourceChange?: number;
  };
}

export interface GameState {
  regions: Record<string, RegionState>;
  morale: number;
  fighters: number;
  resources: number;
  turn: number;
  maxTurns: number;
  phase: PhaseType;
  deck: Card[];
  hand: Card[];
  actionsLeft: number;
  skipGerman: boolean;
  redArmy: boolean;
  british: boolean;
  over: 'win' | 'lose' | null;
  log: string[];
  difficulty: 'easy' | 'normal' | 'hard';
  stats: {
    battlesFought: number;
    battlesWon: number;
    sabotagesConducted: number;
    recruitsGained: number;
    eventsEncountered: number;
  };
}

export interface PersonProfile {
  id: string;
  name: string;
  role: string;
  faction: 'Partyzáni' | 'Četníci' | 'Německo / Kolaboranti' | 'Spojenci' | 'Rudá armáda';
  bio: string;
  impact: string;
  quote?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Vojenské' | 'Politické' | 'Geografické';
}
