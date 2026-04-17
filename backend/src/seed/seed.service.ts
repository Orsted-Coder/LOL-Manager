import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Champion, DamageType, ChampionRole, SynergyTag } from '../champion/champion.entity';
import { Player, PlayerRole } from '../player/player.entity';
import { Item } from '../item/item.entity';
import { Team, Region } from '../team/team.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Champion) private championRepo: Repository<Champion>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
    @InjectRepository(Item) private itemRepo: Repository<Item>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) {}

  // POST /api/seed - Gọi endpoint này để tạo dữ liệu mẫu vào database
  async seed() {
    this.logger.log('Bắt đầu tạo dữ liệu mẫu...');

    const champCount = await this.championRepo.count();
    const teamCount = await this.teamRepo.count();

    if (champCount > 0 && teamCount > 0) {
      this.logger.log('Dữ liệu đã tồn tại, bỏ qua seed.');
      return { message: 'Dữ liệu đã tồn tại trong database.' };
    }

    // Tạo dữ liệu tướng mẫu
    await this.seedChampions();

    // Tạo dữ liệu đội tuyển mẫu
    const teams = await this.seedTeams();

    // Tạo dữ liệu tuyển thủ mẫu
    await this.seedPlayers(teams);

    // Tạo dữ liệu trang bị mẫu
    await this.seedItems();

    this.logger.log('✅ Seed dữ liệu thành công!');
    return { message: 'Tạo dữ liệu mẫu thành công!' };
  }

  private async seedChampions() {
    const champions = [
      // ===== TOP LANE =====
      {
        name: 'Thanh Kiếm Bất Bại',  // Darius-like
        imageUrl: null,
        hp: 582, hpPerLevel: 99, mp: 263, mpPerLevel: 37,
        armor: 39, armorPerLevel: 4, spellBlock: 32, mrPerLevel: 1.3,
        attackDamage: 64, adPerLevel: 5, attackSpeed: 0.625, asPerLevel: 1.0,
        attackRange: 175, moveSpeed: 340, hpRegen: 10, mpRegen: 6.5,
        damageType: DamageType.PHYSICAL,
        burstPotential: 14, dpsPotential: 16, waveclearScore: 10,
        hardCC: 12, softCC: 8, healShieldPower: 6, cooldownRatio: 10,
        damage: 8, durability: 7, crowdControl: 6, mobility: 3, utility: 3,
        difficulty: 4,
        roles: [ChampionRole.TOP],
        synergyTags: [SynergyTag.DIVE, SynergyTag.TEAMFIGHT],
      },
      {
        name: 'Thần Chiến Bất Tử',  // Garen-like
        imageUrl: null,
        hp: 620, hpPerLevel: 104, mp: 0, mpPerLevel: 0,
        armor: 36, armorPerLevel: 4.2, spellBlock: 32, mrPerLevel: 1.3,
        attackDamage: 66, adPerLevel: 4.5, attackSpeed: 0.625, asPerLevel: 1.5,
        attackRange: 175, moveSpeed: 355, hpRegen: 8, mpRegen: 0,
        damageType: DamageType.PHYSICAL,
        burstPotential: 13, dpsPotential: 14, waveclearScore: 9,
        hardCC: 6, softCC: 4, healShieldPower: 0, cooldownRatio: 11,
        damage: 7, durability: 8, crowdControl: 3, mobility: 5, utility: 2,
        difficulty: 2,
        roles: [ChampionRole.TOP],
        synergyTags: [SynergyTag.DIVE],
      },
      // ===== JUNGLE =====
      {
        name: 'Ma Thợ Rừng',  // Vi-like
        imageUrl: null,
        hp: 585, hpPerLevel: 90, mp: 299, mpPerLevel: 45,
        armor: 33, armorPerLevel: 3.5, spellBlock: 32, mrPerLevel: 1.3,
        attackDamage: 59, adPerLevel: 3, attackSpeed: 0.644, asPerLevel: 2,
        attackRange: 125, moveSpeed: 340, hpRegen: 9.5, mpRegen: 8,
        damageType: DamageType.PHYSICAL,
        burstPotential: 16, dpsPotential: 12, waveclearScore: 13,
        hardCC: 18, softCC: 4, healShieldPower: 0, cooldownRatio: 10,
        damage: 8, durability: 6, crowdControl: 9, mobility: 7, utility: 2,
        difficulty: 5,
        roles: [ChampionRole.JUNGLE],
        synergyTags: [SynergyTag.DIVE, SynergyTag.PICK],
      },
      {
        name: 'Trùm Rừng Xanh',  // Hecarim-like
        imageUrl: null,
        hp: 550, hpPerLevel: 93, mp: 340, mpPerLevel: 40,
        armor: 31, armorPerLevel: 3.5, spellBlock: 32, mrPerLevel: 1.3,
        attackDamage: 55, adPerLevel: 3.3, attackSpeed: 0.638, asPerLevel: 2.5,
        attackRange: 175, moveSpeed: 345, hpRegen: 8, mpRegen: 7,
        damageType: DamageType.PHYSICAL,
        burstPotential: 15, dpsPotential: 14, waveclearScore: 12,
        hardCC: 14, softCC: 6, healShieldPower: 0, cooldownRatio: 11,
        damage: 7, durability: 6, crowdControl: 7, mobility: 9, utility: 3,
        difficulty: 6,
        roles: [ChampionRole.JUNGLE],
        synergyTags: [SynergyTag.DIVE, SynergyTag.TEAMFIGHT],
      },
      // ===== MID LANE =====
      {
        name: 'Kiếm Sĩ Gió',  // Yasuo-like
        imageUrl: null,
        hp: 523, hpPerLevel: 87, mp: 0, mpPerLevel: 0,
        armor: 30, armorPerLevel: 3, spellBlock: 30, mrPerLevel: 1.3,
        attackDamage: 60, adPerLevel: 3, attackSpeed: 0.697, asPerLevel: 3.2,
        attackRange: 175, moveSpeed: 345, hpRegen: 6.5, mpRegen: 0,
        damageType: DamageType.PHYSICAL,
        burstPotential: 18, dpsPotential: 15, waveclearScore: 11,
        hardCC: 8, softCC: 4, healShieldPower: 0, cooldownRatio: 14,
        damage: 9, durability: 5, crowdControl: 4, mobility: 8, utility: 2,
        difficulty: 10,
        roles: [ChampionRole.MID, ChampionRole.TOP],
        synergyTags: [SynergyTag.DIVE, SynergyTag.TEAMFIGHT],
      },
      {
        name: 'Pháp Sư Lửa',  // Annie-like
        imageUrl: null,
        hp: 511, hpPerLevel: 85, mp: 396, mpPerLevel: 47,
        armor: 21, armorPerLevel: 3.8, spellBlock: 30, mrPerLevel: 0.5,
        attackDamage: 50, adPerLevel: 3, attackSpeed: 0.579, asPerLevel: 1.13,
        attackRange: 625, moveSpeed: 335, hpRegen: 5.5, mpRegen: 8.5,
        damageType: DamageType.MAGIC,
        burstPotential: 19, dpsPotential: 10, waveclearScore: 15,
        hardCC: 15, softCC: 0, healShieldPower: 0, cooldownRatio: 9,
        damage: 9, durability: 3, crowdControl: 8, mobility: 2, utility: 2,
        difficulty: 3,
        roles: [ChampionRole.MID, ChampionRole.SUPPORT],
        synergyTags: [SynergyTag.TEAMFIGHT, SynergyTag.POKE],
      },
      // ===== ADC =====
      {
        name: 'Xạ Thủ Hoàn Hảo',  // Jinx-like
        imageUrl: null,
        hp: 528, hpPerLevel: 88, mp: 325, mpPerLevel: 35,
        armor: 28, armorPerLevel: 3, spellBlock: 30, mrPerLevel: 0.5,
        attackDamage: 57, adPerLevel: 3.4, attackSpeed: 0.625, asPerLevel: 3.3,
        attackRange: 525, moveSpeed: 325, hpRegen: 3.5, mpRegen: 6.9,
        damageType: DamageType.PHYSICAL,
        burstPotential: 12, dpsPotential: 19, waveclearScore: 16,
        hardCC: 10, softCC: 10, healShieldPower: 0, cooldownRatio: 10,
        damage: 9, durability: 3, crowdControl: 5, mobility: 3, utility: 2,
        difficulty: 6,
        roles: [ChampionRole.ADC],
        synergyTags: [SynergyTag.TEAMFIGHT, SynergyTag.POKE],
      },
      {
        name: 'Nữ Xạ Thủ Thần Tốc',  // Caitlyn-like
        imageUrl: null,
        hp: 490, hpPerLevel: 82, mp: 360, mpPerLevel: 35,
        armor: 28, armorPerLevel: 3.5, spellBlock: 30, mrPerLevel: 0.5,
        attackDamage: 62, adPerLevel: 3.2, attackSpeed: 0.568, asPerLevel: 3,
        attackRange: 650, moveSpeed: 325, hpRegen: 4, mpRegen: 6.5,
        damageType: DamageType.PHYSICAL,
        burstPotential: 14, dpsPotential: 17, waveclearScore: 12,
        hardCC: 8, softCC: 12, healShieldPower: 0, cooldownRatio: 9,
        damage: 8, durability: 3, crowdControl: 4, mobility: 3, utility: 3,
        difficulty: 5,
        roles: [ChampionRole.ADC],
        synergyTags: [SynergyTag.POKE, SynergyTag.PICK],
      },
      // ===== SUPPORT =====
      {
        name: 'Thần Hộ Vệ Ánh Sáng',  // Lulu-like
        imageUrl: null,
        hp: 480, hpPerLevel: 78, mp: 350, mpPerLevel: 45,
        armor: 24, armorPerLevel: 4, spellBlock: 30, mrPerLevel: 0.5,
        attackDamage: 48, adPerLevel: 2.5, attackSpeed: 0.625, asPerLevel: 1.13,
        attackRange: 550, moveSpeed: 330, hpRegen: 6, mpRegen: 11,
        damageType: DamageType.MAGIC,
        burstPotential: 6, dpsPotential: 7, waveclearScore: 8,
        hardCC: 10, softCC: 15, healShieldPower: 18, cooldownRatio: 13,
        damage: 4, durability: 4, crowdControl: 6, mobility: 4, utility: 9,
        difficulty: 6,
        roles: [ChampionRole.SUPPORT, ChampionRole.MID],
        synergyTags: [SynergyTag.PROTECT, SynergyTag.TEAMFIGHT],
      },
      {
        name: 'Khổng Lồ Biển Cả',  // Nautilus-like
        imageUrl: null,
        hp: 560, hpPerLevel: 98, mp: 370, mpPerLevel: 40,
        armor: 40, armorPerLevel: 4.7, spellBlock: 32, mrPerLevel: 1.3,
        attackDamage: 57, adPerLevel: 3, attackSpeed: 0.588, asPerLevel: 1,
        attackRange: 175, moveSpeed: 335, hpRegen: 9, mpRegen: 10,
        damageType: DamageType.MAGIC,
        burstPotential: 10, dpsPotential: 7, waveclearScore: 7,
        hardCC: 20, softCC: 10, healShieldPower: 0, cooldownRatio: 9,
        damage: 5, durability: 7, crowdControl: 10, mobility: 3, utility: 5,
        difficulty: 4,
        roles: [ChampionRole.SUPPORT, ChampionRole.JUNGLE],
        synergyTags: [SynergyTag.PICK, SynergyTag.DIVE, SynergyTag.TEAMFIGHT],
      },
    ];

    for (const c of champions) {
      const exists = await this.championRepo.findOne({ where: { name: c.name } });
      if (!exists) {
        await this.championRepo.save(this.championRepo.create(c));
      }
    }
    this.logger.log(`✅ Đã tạo ${champions.length} tướng mẫu`);
  }

  private async seedTeams(): Promise<Team[]> {
    const teamsData = [
      {
        name: 'GAM Esports',
        imageUrl: null,
        region: Region.VCS,
        budget: 2000000,
        reputation: 72,
        trainingRoomLevel: 3,
        academyLevel: 2,
        primaryColor: '#1a472a',
        secondaryColor: '#2ecc71',
      },
      {
        name: 'Team Flash',
        imageUrl: null,
        region: Region.VCS,
        budget: 1500000,
        reputation: 65,
        trainingRoomLevel: 2,
        academyLevel: 2,
        primaryColor: '#1a1a2e',
        secondaryColor: '#e94560',
      },
      {
        name: 'Saigon Buffalo',
        imageUrl: null,
        region: Region.VCS,
        budget: 1200000,
        reputation: 58,
        trainingRoomLevel: 2,
        academyLevel: 1,
        primaryColor: '#2c1654',
        secondaryColor: '#f39c12',
      },
    ];

    const teams: Team[] = [];
    for (const t of teamsData) {
      let team = await this.teamRepo.findOne({ where: { name: t.name } });
      if (!team) {
        team = await this.teamRepo.save(this.teamRepo.create(t));
      }
      teams.push(team);
    }
    this.logger.log(`✅ Đã tạo ${teams.length} đội tuyển mẫu`);
    return teams;
  }

  private async seedPlayers(teams: Team[]) {
    const gamId = teams[0]?.id;
    const flashId = teams[1]?.id;
    const buffId = teams[2]?.id;

    const players = [
      // ===== GAM Esports =====
      {
        name: 'Kiaya', age: 23, nationality: 'Vietnam',
        mainRole: PlayerRole.TOP,
        ovr: 78, potential: 82,
        mechanics: 16, laning: 17, farming: 15, teamfighting: 15, versatility: 14,
        kiting: 11, smite: 8, visionControl: 13,
        mapAwareness: 15, positioning: 14, decisionMaking: 14, shotcalling: 13,
        aggression: 16, composure: 13, anticipation: 14, bravery: 16, roaming: 12,
        reactionTime: 16, apm: 15, stamina: 14, naturalFitness: 15,
        consistency: 14, importantMatches: 15, injuryProneness: 4,
        adaptability: 15, professionalism: 16, loyalty: 17,
        salary: 80000, teamId: gamId,
      },
      {
        name: 'Levi', age: 25, nationality: 'Vietnam',
        mainRole: PlayerRole.JUNGLE,
        ovr: 82, potential: 84,
        mechanics: 17, laning: 15, farming: 16, teamfighting: 17, versatility: 16,
        kiting: 13, smite: 18, visionControl: 16,
        mapAwareness: 18, positioning: 16, decisionMaking: 17, shotcalling: 15,
        aggression: 17, composure: 15, anticipation: 18, bravery: 16, roaming: 17,
        reactionTime: 17, apm: 16, stamina: 15, naturalFitness: 16,
        consistency: 15, importantMatches: 17, injuryProneness: 3,
        adaptability: 16, professionalism: 17, loyalty: 18,
        salary: 100000, teamId: gamId,
      },
      {
        name: 'Yanbaq', age: 21, nationality: 'Vietnam',
        mainRole: PlayerRole.MID,
        ovr: 75, potential: 86,
        mechanics: 16, laning: 15, farming: 14, teamfighting: 14, versatility: 13,
        kiting: 12, smite: 7, visionControl: 13,
        mapAwareness: 14, positioning: 14, decisionMaking: 13, shotcalling: 12,
        aggression: 15, composure: 14, anticipation: 13, bravery: 15, roaming: 14,
        reactionTime: 16, apm: 15, stamina: 14, naturalFitness: 15,
        consistency: 13, importantMatches: 14, injuryProneness: 3,
        adaptability: 16, professionalism: 15, loyalty: 16,
        salary: 70000, teamId: gamId,
      },
      {
        name: 'Sty1e', age: 22, nationality: 'Vietnam',
        mainRole: PlayerRole.ADC,
        ovr: 76, potential: 83,
        mechanics: 16, laning: 16, farming: 17, teamfighting: 15, versatility: 13,
        kiting: 17, smite: 7, visionControl: 13,
        mapAwareness: 15, positioning: 16, decisionMaking: 14, shotcalling: 12,
        aggression: 14, composure: 14, anticipation: 14, bravery: 14, roaming: 10,
        reactionTime: 17, apm: 16, stamina: 15, naturalFitness: 15,
        consistency: 15, importantMatches: 15, injuryProneness: 3,
        adaptability: 14, professionalism: 16, loyalty: 16,
        salary: 75000, teamId: gamId,
      },
      {
        name: 'Palette', age: 24, nationality: 'Vietnam',
        mainRole: PlayerRole.SUPPORT,
        ovr: 77, potential: 80,
        mechanics: 15, laning: 16, farming: 12, teamfighting: 16, versatility: 15,
        kiting: 13, smite: 8, visionControl: 18,
        mapAwareness: 17, positioning: 16, decisionMaking: 16, shotcalling: 17,
        aggression: 13, composure: 16, anticipation: 16, bravery: 14, roaming: 15,
        reactionTime: 15, apm: 14, stamina: 15, naturalFitness: 15,
        consistency: 16, importantMatches: 16, injuryProneness: 2,
        adaptability: 15, professionalism: 17, loyalty: 18,
        salary: 78000, teamId: gamId,
      },
      // ===== Team Flash =====
      {
        name: 'CuCuong', age: 24, nationality: 'Vietnam',
        mainRole: PlayerRole.TOP,
        ovr: 71, potential: 75,
        mechanics: 14, laning: 14, farming: 14, teamfighting: 14, versatility: 13,
        kiting: 10, smite: 7, visionControl: 12,
        mapAwareness: 13, positioning: 13, decisionMaking: 13, shotcalling: 12,
        aggression: 15, composure: 13, anticipation: 13, bravery: 14, roaming: 12,
        reactionTime: 14, apm: 13, stamina: 13, naturalFitness: 14,
        consistency: 13, importantMatches: 13, injuryProneness: 4,
        adaptability: 13, professionalism: 14, loyalty: 15,
        salary: 55000, teamId: flashId,
      },
      {
        name: 'Celebrity', age: 22, nationality: 'Vietnam',
        mainRole: PlayerRole.JUNGLE,
        ovr: 73, potential: 80,
        mechanics: 15, laning: 13, farming: 14, teamfighting: 14, versatility: 14,
        kiting: 11, smite: 15, visionControl: 14,
        mapAwareness: 15, positioning: 14, decisionMaking: 14, shotcalling: 13,
        aggression: 15, composure: 13, anticipation: 15, bravery: 15, roaming: 14,
        reactionTime: 15, apm: 14, stamina: 13, naturalFitness: 14,
        consistency: 13, importantMatches: 13, injuryProneness: 3,
        adaptability: 15, professionalism: 14, loyalty: 15,
        salary: 60000, teamId: flashId,
      },
      {
        name: 'Titan', age: 20, nationality: 'Vietnam',
        mainRole: PlayerRole.MID,
        ovr: 68, potential: 82,
        mechanics: 14, laning: 13, farming: 13, teamfighting: 13, versatility: 13,
        kiting: 11, smite: 7, visionControl: 12,
        mapAwareness: 13, positioning: 13, decisionMaking: 12, shotcalling: 11,
        aggression: 14, composure: 12, anticipation: 12, bravery: 14, roaming: 13,
        reactionTime: 15, apm: 14, stamina: 13, naturalFitness: 14,
        consistency: 12, importantMatches: 12, injuryProneness: 3,
        adaptability: 15, professionalism: 13, loyalty: 14,
        salary: 48000, teamId: flashId,
      },
      {
        name: 'Shogun', age: 23, nationality: 'Vietnam',
        mainRole: PlayerRole.ADC,
        ovr: 72, potential: 76,
        mechanics: 15, laning: 14, farming: 15, teamfighting: 14, versatility: 13,
        kiting: 15, smite: 7, visionControl: 12,
        mapAwareness: 13, positioning: 14, decisionMaking: 13, shotcalling: 11,
        aggression: 13, composure: 14, anticipation: 13, bravery: 13, roaming: 10,
        reactionTime: 15, apm: 14, stamina: 13, naturalFitness: 14,
        consistency: 14, importantMatches: 13, injuryProneness: 3,
        adaptability: 13, professionalism: 14, loyalty: 15,
        salary: 58000, teamId: flashId,
      },
      {
        name: 'BeanJ', age: 25, nationality: 'Vietnam',
        mainRole: PlayerRole.SUPPORT,
        ovr: 70, potential: 72,
        mechanics: 13, laning: 14, farming: 11, teamfighting: 14, versatility: 13,
        kiting: 11, smite: 7, visionControl: 16,
        mapAwareness: 15, positioning: 14, decisionMaking: 14, shotcalling: 15,
        aggression: 12, composure: 15, anticipation: 14, bravery: 12, roaming: 14,
        reactionTime: 13, apm: 12, stamina: 14, naturalFitness: 14,
        consistency: 14, importantMatches: 14, injuryProneness: 2,
        adaptability: 13, professionalism: 15, loyalty: 16,
        salary: 52000, teamId: flashId,
      },
      // ===== Saigon Buffalo =====
      {
        name: 'Naul', age: 21, nationality: 'Vietnam',
        mainRole: PlayerRole.TOP,
        ovr: 66, potential: 78,
        mechanics: 13, laning: 13, farming: 13, teamfighting: 13, versatility: 12,
        kiting: 9, smite: 7, visionControl: 11,
        mapAwareness: 12, positioning: 12, decisionMaking: 12, shotcalling: 11,
        aggression: 14, composure: 12, anticipation: 12, bravery: 14, roaming: 11,
        reactionTime: 14, apm: 13, stamina: 12, naturalFitness: 13,
        consistency: 12, importantMatches: 12, injuryProneness: 4,
        adaptability: 14, professionalism: 13, loyalty: 14,
        salary: 42000, teamId: buffId,
      },
      {
        name: 'Meliodas', age: 20, nationality: 'Vietnam',
        mainRole: PlayerRole.JUNGLE,
        ovr: 65, potential: 80,
        mechanics: 13, laning: 12, farming: 13, teamfighting: 13, versatility: 13,
        kiting: 10, smite: 13, visionControl: 12,
        mapAwareness: 13, positioning: 12, decisionMaking: 12, shotcalling: 11,
        aggression: 14, composure: 11, anticipation: 13, bravery: 14, roaming: 13,
        reactionTime: 14, apm: 13, stamina: 12, naturalFitness: 13,
        consistency: 11, importantMatches: 11, injuryProneness: 3,
        adaptability: 14, professionalism: 13, loyalty: 14,
        salary: 40000, teamId: buffId,
      },
      {
        name: 'Ren', age: 19, nationality: 'Vietnam',
        mainRole: PlayerRole.MID,
        ovr: 63, potential: 83,
        mechanics: 13, laning: 12, farming: 12, teamfighting: 12, versatility: 12,
        kiting: 11, smite: 7, visionControl: 11,
        mapAwareness: 12, positioning: 12, decisionMaking: 11, shotcalling: 10,
        aggression: 13, composure: 11, anticipation: 12, bravery: 13, roaming: 12,
        reactionTime: 14, apm: 13, stamina: 12, naturalFitness: 13,
        consistency: 11, importantMatches: 11, injuryProneness: 3,
        adaptability: 15, professionalism: 12, loyalty: 13,
        salary: 36000, teamId: buffId,
      },
      {
        name: 'Artemis', age: 22, nationality: 'Vietnam',
        mainRole: PlayerRole.ADC,
        ovr: 68, potential: 74,
        mechanics: 14, laning: 13, farming: 14, teamfighting: 13, versatility: 12,
        kiting: 14, smite: 7, visionControl: 11,
        mapAwareness: 12, positioning: 13, decisionMaking: 13, shotcalling: 10,
        aggression: 13, composure: 13, anticipation: 12, bravery: 13, roaming: 9,
        reactionTime: 14, apm: 13, stamina: 13, naturalFitness: 13,
        consistency: 13, importantMatches: 12, injuryProneness: 3,
        adaptability: 13, professionalism: 13, loyalty: 14,
        salary: 45000, teamId: buffId,
      },
      {
        name: 'Lloyd', age: 23, nationality: 'Vietnam',
        mainRole: PlayerRole.SUPPORT,
        ovr: 65, potential: 70,
        mechanics: 12, laning: 13, farming: 10, teamfighting: 13, versatility: 12,
        kiting: 10, smite: 7, visionControl: 15,
        mapAwareness: 14, positioning: 13, decisionMaking: 13, shotcalling: 14,
        aggression: 11, composure: 14, anticipation: 13, bravery: 11, roaming: 13,
        reactionTime: 12, apm: 11, stamina: 13, naturalFitness: 13,
        consistency: 13, importantMatches: 13, injuryProneness: 2,
        adaptability: 12, professionalism: 14, loyalty: 15,
        salary: 40000, teamId: buffId,
      },
    ];

    for (const p of players) {
      const exists = await this.playerRepo.findOne({ where: { name: p.name } });
      if (!exists) {
        await this.playerRepo.save(this.playerRepo.create(p));
      }
    }
    this.logger.log(`✅ Đã tạo ${players.length} tuyển thủ mẫu`);
  }

  private async seedItems() {
    const items = [
      // ===== VŨ KHÍ TẤN CÔNG (AD) =====
      {
        name: 'Vô Cực Kiếm', price: 3400,
        tags: ['Offense'],
        ad: 70, critChance: 20, attackSpeed: 15,
        rule: 'Tăng 35% sát thương chí mạng. Đòn chí mạng đầu tiên sau mỗi 1.5s: 35% sát thương thêm.',
      },
      {
        name: 'Gươm Diệt Quỷ', price: 3400,
        tags: ['Offense'],
        ad: 60, haste: 20,
        rule: 'Xuyên giáp +18. Đòn đánh gây 6% HP hiện tại thêm (tối đa 60 với quái).',
      },
      {
        name: 'Kiếm Thần Chiến', price: 3300,
        tags: ['Offense'],
        ad: 45, hp: 400, haste: 20,
        rule: 'Giải phóng chiêu thứ 3 liên tiếp: gây thêm sát thương và hồi HP.',
      },
      {
        name: 'Lưỡi Rồng Giông Bão', price: 3200,
        tags: ['Offense'],
        ad: 55, attackSpeed: 35, critChance: 20,
        rule: 'Tăng tốc độ di chuyển +5% khi đánh. Chí mạng tạo cơn lốc tốc độ.',
      },
      // ===== SỨC MẠNH PHÉP (AP) =====
      {
        name: 'Mũ Tà Ác', price: 3600,
        tags: ['Offense'],
        ap: 120,
        rule: 'Mỗi tướng bị tiêu diệt: +6 AP (tối đa +120 AP). Nếu ≥100 AP thu được: +35% AP tổng.',
      },
      {
        name: 'Gậy Thiên Thần', price: 3400,
        tags: ['Offense'],
        ap: 90, mana: 600, haste: 10,
        rule: 'Xuyên phép +6%. Vượt ngưỡng 100 mana: +1% xuyên phép mỗi 100 mana (tối đa +6%).',
      },
      {
        name: 'Móng Vuốt Lửa', price: 3200,
        tags: ['Offense'],
        ap: 85, hp: 250,
        rule: 'Đốt cháy: Gây 1.5% HP tối đa của kẻ địch mỗi giây trong 4 giây.',
      },
      // ===== PHÒNG THỦ =====
      {
        name: 'Áo Giáp Titan', price: 3200,
        tags: ['Defense'],
        armor: 80, hp: 500,
        rule: 'Mỗi giây, cộng 5 giáp (tối đa +100) khi bị mục tiêu tấn công.',
      },
      {
        name: 'Vòng Thép Bất Bại', price: 3200,
        tags: ['Defense'],
        armor: 65, hp: 550,
        rule: 'Nếu nhận sát thương vượt 400: chặn lượng dư và nhận khiên 400.',
      },
      {
        name: 'Áo Kháng Phép Ngàn Tuổi', price: 3000,
        tags: ['Defense'],
        mr: 80, hp: 400,
        rule: 'Hồi 15 HP mỗi giây. Nhận kháng phép +4 mỗi giây khi bị kẻ địch nhắm.',
      },
      {
        name: 'Lá Chắn Lực Lượng', price: 3200,
        tags: ['Defense'],
        mr: 70, mana: 400, hp: 350,
        rule: 'Khi HP <30%: nhận khiên bằng 150% lượng mana hiện tại.',
      },
      // ===== HỮU ÍCH (UTILITY) =====
      {
        name: 'Nhẫn Luyện Hóa', price: 3000,
        tags: ['Utility', 'Offense'],
        ap: 60, haste: 25,
        rule: 'Giảm thời gian hồi chiêu thêm 15% sau khi tiêu diệt tướng địch.',
      },
      {
        name: 'Viên Ngọc Hỗ Trợ', price: 2800,
        tags: ['Utility'],
        hp: 300, mana: 300, haste: 15,
        rule: 'Tăng hiệu quả hồi máu/khiên +20% cho đồng đội.',
      },
      // ===== GIÀY =====
      {
        name: 'Giày Tốc Độ', price: 1100,
        tags: ['Boots'],
        rule: 'Tăng tốc độ di chuyển +45.',
      },
      {
        name: 'Giày Thủy Thần', price: 1100,
        tags: ['Boots', 'Defense'],
        mr: 20,
        rule: 'Tăng tốc độ di chuyển +45. Kháng phép +20.',
      },
    ];

    for (const item of items) {
      const exists = await this.itemRepo.findOne({ where: { name: item.name } });
      if (!exists) {
        await this.itemRepo.save(this.itemRepo.create(item));
      }
    }
    this.logger.log(`✅ Đã tạo ${items.length} trang bị mẫu`);
  }
}
