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
