// Các kiểu dữ liệu TypeScript dùng chung giữa frontend và backend

// ===== TƯỚNG (Champion) =====
export type DamageType = 'Physical' | 'Magic' | 'Mixed';
export type ChampionRole = 'TopLane' | 'Jungle' | 'MidLane' | 'ADC' | 'Support';
export type SynergyTag = 'Dive' | 'Poke' | 'Protect' | 'Pick' | 'Teamfight';

export interface Champion {
  id: number;
  name: string;
  imageUrl: string | null;
  // Chỉ số cơ bản
  hp: number;
  hpPerLevel: number;
  mp: number;
  mpPerLevel: number;
  armor: number;
  armorPerLevel: number;
  spellBlock: number;
  mrPerLevel: number;
  attackDamage: number;
  adPerLevel: number;
  attackSpeed: number;
  asPerLevel: number;
  attackRange: number;
  moveSpeed: number;
  hpRegen: number;
  mpRegen: number;
  // Chỉ số kỹ năng
  damageType: DamageType;
  burstPotential: number;
  dpsPotential: number;
  waveclearScore: number;
  hardCC: number;
  softCC: number;
  healShieldPower: number;
  cooldownRatio: number;
  // Chỉ số vai trò (0-10)
  damage: number;
  durability: number;
  crowdControl: number;
  mobility: number;
  utility: number;
  difficulty: number;
  // Vai trò & tag
  roles: ChampionRole[];
  synergyTags: SynergyTag[];
  createdAt: string;
  updatedAt: string;
}

// ===== TUYỂN THỦ (Player) =====
export type PlayerRole = 'TopLane' | 'Jungle' | 'MidLane' | 'ADC' | 'Support';

export interface Player {
  id: number;
  name: string;
  imageUrl: string | null;
  age: number;
  nationality: string;
  mainRole: PlayerRole;
  ovr: number;
  potential: number;
  // Technical
  mechanics: number;
  laning: number;
  farming: number;
  teamfighting: number;
  versatility: number;
  kiting: number;
  smite: number;
  visionControl: number;
  // Mental
  mapAwareness: number;
  positioning: number;
  decisionMaking: number;
  shotcalling: number;
  aggression: number;
  composure: number;
  anticipation: number;
  bravery: number;
  roaming: number;
  // Physical & Hidden
  reactionTime: number;
  apm: number;
  stamina: number;
  naturalFitness: number;
  consistency: number;
  importantMatches: number;
  injuryProneness: number;
  adaptability: number;
  professionalism: number;
  loyalty: number;
  salary: number;
  // Phase 4: Transfer Market
  isTransferListed: boolean;
  transferFee: number;
  contractEndSeason: number;
  teamId: number | null;
  team: Team | null;
  createdAt: string;
  updatedAt: string;
}

// ===== TRANG BỊ (Item) =====
export interface Item {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
  tags: string[];
  ad: number;
  ap: number;
  armor: number;
  mr: number;
  hp: number;
  mana: number;
  attackSpeed: number;
  critChance: number;
  haste: number;
  rule: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== ĐỘI TUYỂN (Team) =====
export type Region = 'LCK' | 'LPL' | 'LEC' | 'LCS' | 'LCP' | 'VCS' | 'CBLOL';

export interface Team {
  id: number;
  name: string;
  imageUrl: string | null;
  region: Region;
  budget: number;
  reputation: number;
  trainingRoomLevel: number;
  academyLevel: number;
  totalSalary: number;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
  updatedAt: string;
}

// ===== TRẬN ĐẤU (Match) =====
export type MatchFormat = 'bo1' | 'bo3' | 'bo5';

export type MatchEventType =
  | 'FIRST_BLOOD'
  | 'DRAGON'
  | 'BARON'
  | 'TOWER'
  | 'INHIBITOR'
  | 'NEXUS'
  | 'KILL';

export interface MatchEvent {
  time: number;
  type: MatchEventType;
  teamSide: 1 | 2;
  playerName?: string;
  description: string;
}

export interface GameLog {
  gameNumber: number;
  winningSide: 1 | 2;
  duration: number;
  team1Kills: number;
  team2Kills: number;
  team1PowerScore: number;
  team2PowerScore: number;
  events: MatchEvent[];
}

export interface Match {
  id: number;
  team1Id: number;
  team1: Team;
  team2Id: number;
  team2: Team;
  winnerId: number;
  winner: Team;
  format: MatchFormat;
  team1Score: number;
  team2Score: number;
  team1Power: number;
  team2Power: number;
  matchLog: GameLog[];
  createdAt: string;
}

// ===== GIẢI ĐẤU (Tournament) - Phase 3 =====
export type TournamentStatus = 'pending' | 'ongoing' | 'completed';

export interface TournamentMatch {
  round: number;
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  matchId?: number;
  winnerId?: number;
  winnerName?: string;
  team1Score?: number;
  team2Score?: number;
  status: 'pending' | 'completed';
}

export interface TournamentStanding {
  teamId: number;
  teamName: string;
  primaryColor: string;
  secondaryColor: string;
  wins: number;
  losses: number;
  points: number;
}

export interface Tournament {
  id: number;
  name: string;
  status: TournamentStatus;
  matchFormat: MatchFormat;
  teams: Team[];
  schedule: TournamentMatch[];
  standings: TournamentStanding[];
  winnerId: number | null;
  createdAt: string;
  updatedAt: string;
}

// ===== CHUYỂN NHƯỢNG (Transfer) - Phase 4 =====
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface TransferOffer {
  id: number;
  fromTeamId: number;
  fromTeam: Team;
  toTeamId: number | null;
  toTeam: Team | null;
  playerId: number;
  player: Player;
  amount: number;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TransferMarket {
  freeAgents: Player[];
  listedPlayers: Player[];
}

export interface TeamOffers {
  incoming: TransferOffer[];
  outgoing: TransferOffer[];
}
