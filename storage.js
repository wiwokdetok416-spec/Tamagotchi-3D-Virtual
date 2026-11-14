export const PET_SPECIES = {
  milo: {
    id: 'milo',
    name: 'Milo',
    species: 'Anjing Golden Corgi',
    tagline: 'Si anjing penurut yang setia dan penuh kasih',
    description:
      'Milo adalah anjing ceria berbulu keemasan dengan telinga bergoyang lucu. Selalu sigap menuruti perintahmu, suka berguling, mengejar bola, dan mengibaskan ekor saat kamu menyapanya.',
    nature: 'Penurut, Setia, Ceria & Penuh Energi',
    favoriteFood: 'Biskuit Tulang Gurih & Daging Panggang',
    specialSkill: 'Duduk Santun, Berguling & Gonggong Ceria',
    primaryColor: '#f59e0b',
    secondaryColor: '#fef3c7',
    habitat: 'room',
  },
  fizzi: {
    id: 'fizzi',
    name: 'Fizzi',
    species: 'Ikan Cupang Halfmoon',
    tagline: 'Si ikan cupang anggun bercahaya di air jernih',
    description:
      'Fizzi adalah ikan cupang berjiwa tenang nan memesona. Siripnya mengembang indah berkilau gradasi cyan dan magenta dalam kubah air kristal. Fizzi suka berenang melingkar dan menyambut ketukan jarimu di kaca.',
    nature: 'Tenang, Elegan, Anggun & Penuh Pesona',
    favoriteFood: 'Pelet Emas Berkilau & Jentik Kristal',
    specialSkill: 'Tarian Sirip Halfmoon & Tembakan Gelembung Hati',
    primaryColor: '#06b6d4',
    secondaryColor: '#ec4899',
    habitat: 'aquarium',
  },
  ngkur: {
    id: 'ngkur',
    name: 'Ngkur',
    species: 'Kucing Calico Pemberani',
    tagline: 'Si kucing manis bertopi pahlawan yang tak kenal takut',
    description:
      'Ngkur adalah kucing calico yang manis sekaligus berjiwa petualang tinggi. Walau badannya imut, tatapannya tajam penuh keberanian menghadapi segala tantangan. Suka mendengkur lembut saat dielus dan melompat lincah.',
    nature: 'Pemberani, Manis, Tangguh & Gemar Bermanja',
    favoriteFood: 'Ikan Salmon Segar & Susu Hangat Lezat',
    specialSkill: 'Lompatan Akrobatik & Dengkuran Nyaman (Purr)',
    primaryColor: '#ea580c',
    secondaryColor: '#fed7aa',
    habitat: 'room',
  },
  patar: {
    id: 'patar',
    name: 'Patar',
    species: 'Kepiting Karang Kasar',
    tagline: 'Si kepiting kasar bertempurung merah dan bercapit perkasa',
    description:
      'Patar adalah kepiting karang berkulit merah membara dengan sepasang capit perkasa. Bicaranya ketus dan lagaknya kasar ("Hmph! Jangan sentuh sembarangan!"), tapi aslinya tsundere setia yang selalu menjaga teman-temannya. Suka jalan miring, memotong rumput laut, dan berjoget crab rave!',
    nature: 'Kasar, Ketus, Tsundere tapi Setia & Perkasa',
    favoriteFood: 'Rumput Laut Krispi & Daging Remis',
    specialSkill: 'Jepit Capit Petir, Jalan Miring Cepat & Crab Rave',
    primaryColor: '#ef4444',
    secondaryColor: '#f97316',
    habitat: 'room',
  },
};
export const INITIAL_FOODS = [
  {
    id: 'food_biscuit',
    name: 'Biskuit Tulang Gurih',
    description: 'Biskuit renyah beraroma keju. Makanan terfavorit Milo si anjing penurut!',
    cost: 10,
    hungerBoost: 25,
    happinessBoost: 15,
    suitablePet: 'milo',
    emoji: '🦴',
  },
  {
    id: 'food_pellet',
    name: 'Pelet Emas Bercahaya',
    description: 'Pelet terapung bernutrisi tinggi kesukaan Fizzi si ikan cupang.',
    cost: 10,
    hungerBoost: 25,
    happinessBoost: 15,
    suitablePet: 'fizzi',
    emoji: '✨',
  },
  {
    id: 'food_salmon',
    name: 'Ikan Salmon Segar',
    description: 'Potongan salmon segar kaya omega-3. Menu istimewa buat Ngkur si kucing!',
    cost: 15,
    hungerBoost: 30,
    happinessBoost: 20,
    suitablePet: 'ngkur',
    emoji: '🐟',
  },
  {
    id: 'food_milk',
    name: 'Susu Hangat Menenangkan',
    description: 'Semangkuk susu hangat yang menghangatkan perut dan menaikkan energi.',
    cost: 12,
    hungerBoost: 18,
    happinessBoost: 25,
    energyBoost: 15,
    suitablePet: 'all',
    emoji: '🥛',
  },
  {
    id: 'food_berry',
    name: 'Buah Beri Manis',
    description: 'Buah beri organik kaya vitamin untuk menjaga kesehatan dan imun pet.',
    cost: 15,
    hungerBoost: 20,
    happinessBoost: 20,
    suitablePet: 'all',
    emoji: '🍓',
  },
  {
    id: 'food_feast',
    name: 'Paket Pesta Lezat',
    description: 'Hidangan mewah lengkap yang membuat pet sangat kenyang dan bahagia seketika!',
    cost: 35,
    hungerBoost: 60,
    happinessBoost: 50,
    energyBoost: 30,
    suitablePet: 'all',
    emoji: '🍱',
  },
  {
    id: 'food_seaweed',
    name: 'Rumput Laut Krispi',
    description:
      'Camilan rumput laut asin gurih renyah dengan garam laut. Favorit Patar si kepiting!',
    cost: 14,
    hungerBoost: 28,
    happinessBoost: 20,
    suitablePet: 'patar',
    emoji: '🌿',
  },
];
export const ACCESSORIES_CATALOG = [
  {
    id: 'hat_party',
    name: 'Topi Pesta Kerucut',
    category: 'hat',
    cost: 30,
    description: 'Topi pesta warna-warni yang membuat pet terlihat selalu merayakan hari gembira.',
    emoji: '🎉',
  },
  {
    id: 'hat_crown',
    name: 'Mahkota Emas Raja Kecil',
    category: 'hat',
    cost: 80,
    description: 'Mahkota emas megah bertatah permata merah untuk hewan peliharaan terbaik.',
    emoji: '👑',
  },
  {
    id: 'acc_glasses',
    name: 'Kacamata Hitam Gaul',
    category: 'accessory',
    cost: 45,
    description: 'Kacamata trendi yang membuat petmu terlihat super keren dan percaya diri.',
    emoji: '🕶️',
  },
  {
    id: 'acc_bowtie',
    name: 'Dasi Kupu-Kupu Merah',
    category: 'accessory',
    cost: 35,
    description: 'Dasi kupu-kupu satin rapi yang membuat tampilan pet semakin sopan dan manis.',
    emoji: '🎀',
  },
  {
    id: 'toy_ball',
    name: 'Bola Mainan Ceria',
    category: 'toy',
    cost: 25,
    description: 'Bola karet membal di ruangan yang bisa ditendang dan dikejar.',
    emoji: '⚽',
  },
  {
    id: 'hat_hero',
    name: 'Ikat Kepala Pahlawan',
    category: 'hat',
    cost: 50,
    description: 'Ikat kepala kain merah menyala lambang petualang pemberani!',
    emoji: '🥋',
  },
];
export const DANCE_CATALOG = [
  {
    id: 'dance_robot_stiff',
    name: 'Joget Robot Kaku',
    cost: 0,
    isDefault: true,
    style: 'robot_stiff',
    emoji: '🤖',
    description: 'Joget gratis gerakan kaku patah-patah ala robot retro, sangat unik dan lucu!',
  },
  {
    id: 'dance_wiggle',
    name: 'Goyang Ceria (Wiggle)',
    cost: 150,
    style: 'wiggle',
    emoji: '💃',
    description: 'Goyangan pinggul dan ekor lincah ke kiri dan kanan penuh tawa!',
  },
  {
    id: 'dance_breakdance',
    name: 'Breakdance Spin Mantap',
    cost: 350,
    style: 'breakdance',
    emoji: '🕺',
    description: 'Putaran 360 derajat cepat di udara dan mendarat gaya akrobatik keren!',
  },
  {
    id: 'dance_disco',
    name: 'Disco Party Heboh',
    cost: 600,
    style: 'disco',
    emoji: '🪩',
    description: 'Lompatan pesta bertempo cepat diiringi kilauan lampu disko warna-warni!',
  },
  {
    id: 'dance_moonwalk',
    name: 'Moonwalk Halus Bintang Pop',
    cost: 1200,
    style: 'moonwalk',
    emoji: '⭐',
    description: 'Langkah meluncur mundur super halus ala superstar legendaris!',
  },
];
export const JOSSY_BOT_INFO = {
  id: 'companion_jossy_bot',
  name: 'J0ssy bot',
  cost: 100000,
  description:
    'Robot AI cerdas canggih sahabat setia! Bisa diajak ngobrol cerdas, memberi tips, dan membantu merawat hewan peliharaan secara otomatis saat energinya tersedia.',
  emoji: '🤖',
};
export const SHELL_THEMES = [
  {
    id: 'classic_egg',
    name: 'Classic Tamagotchi (Kuning Pastel)',
    primary: 'from-amber-200 via-amber-300 to-yellow-400',
    border: 'border-amber-400',
    accent: 'bg-amber-500',
    button: 'bg-rose-400 hover:bg-rose-500 text-white shadow-rose-600',
    screenGlow: 'bg-sky-50/90',
  },
  {
    id: 'retro_cyber',
    name: 'Cyber Wave (Turquoise & Neon)',
    primary: 'from-cyan-900 via-teal-800 to-slate-900',
    border: 'border-cyan-400',
    accent: 'bg-cyan-400',
    button: 'bg-teal-400 hover:bg-teal-300 text-slate-900 shadow-teal-700',
    screenGlow: 'bg-slate-900/90',
  },
  {
    id: 'sakura_bloom',
    name: 'Sakura Blossom (Pink Manis)',
    primary: 'from-pink-200 via-rose-200 to-pink-300',
    border: 'border-pink-400',
    accent: 'bg-pink-500',
    button: 'bg-purple-400 hover:bg-purple-500 text-white shadow-purple-600',
    screenGlow: 'bg-rose-50/90',
  },
  {
    id: 'mint_fresh',
    name: 'Mint Fresh (Hijau Segar)',
    primary: 'from-emerald-200 via-teal-200 to-emerald-300',
    border: 'border-emerald-400',
    accent: 'bg-emerald-500',
    button: 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-amber-600',
    screenGlow: 'bg-emerald-50/90',
  },
  {
    id: 'violet_dream',
    name: 'Violet Dream (Lavender Elegan)',
    primary: 'from-purple-300 via-indigo-300 to-violet-400',
    border: 'border-purple-400',
    accent: 'bg-purple-600',
    button: 'bg-pink-400 hover:bg-pink-500 text-white shadow-pink-600',
    screenGlow: 'bg-indigo-50/90',
  },
];
export const ACHIEVEMENTS_LIST = [
  {
    id: 'ach_first_pet',
    title: 'Sahabat Pertama',
    description: 'Memilih hewan peliharaan pertamamu di game.',
    rewardCoins: 50,
    icon: '🐾',
  },
  {
    id: 'ach_feed_master',
    title: 'Koki Kesayangan',
    description: 'Memberi makan hewan peliharaan sebanyak 10 kali.',
    rewardCoins: 40,
    icon: '🍲',
  },
  {
    id: 'ach_sparkle_clean',
    title: 'Kinclong & Harum',
    description: 'Memandikan hewan peliharaan sampai kebersihan 100%.',
    rewardCoins: 35,
    icon: '🫧',
  },
  {
    id: 'ach_fashion_star',
    title: 'Bintang Modis',
    description: 'Mengenakan aksesoris topi atau kacamata pada pet.',
    rewardCoins: 60,
    icon: '🎩',
  },
  {
    id: 'ach_play_champ',
    title: 'Jagoan Mini-Game',
    description: 'Meraih skor minimal 100 poin di salah satu mini-game.',
    rewardCoins: 75,
    icon: '🎮',
  },
  {
    id: 'ach_level_5',
    title: 'Tumbuh Bersama (Lv. 5)',
    description: 'Mencapai Level 5 bersama hewan peliharaanmu.',
    rewardCoins: 100,
    icon: '⭐',
  },
];
export const ACHIEVEMENTS_CATALOG = ACHIEVEMENTS_LIST;
const STORAGE_KEY = 'tamagotchi_3d_save_v1';
export function createDefaultPet(id) {
  const info = PET_SPECIES[id];
  const now = Date.now();
  return {
    id,
    name: info.name,
    level: 1,
    xp: 0,
    xpNext: 100,
    ageDays: 1,
    birthTimestamp: now,
    lastSavedTimestamp: now,
    stats: {
      hunger: 85,
      energy: 90,
      hygiene: 90,
      happiness: 85,
      love: 70,
      health: 100,
    },
    isSleeping: false,
    equippedHat: null,
    equippedAccessory: null,
    unlockedAchievements: ['ach_first_pet'],
  };
}
export function createDefaultGameState() {
  const now = Date.now();
  const initialPets = {
    milo: createDefaultPet('milo'),
    fizzi: createDefaultPet('fizzi'),
    ngkur: createDefaultPet('ngkur'),
    patar: createDefaultPet('patar'),
  };
  const initialDiary = [
    {
      id: 'entry_initial',
      petId: 'milo',
      dateStr: new Date(now).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      timestamp: now,
      title: 'Selamat Datang di Dunia Tamagotchi 3D! 🎈',
      markdownContent: `## Selamat Datang, Sahabat Baru! 🐾

Hari ini petualanganmu dimulai bersama hewan peliharaan virtual 3D terbaik!
Game ini **100% offline** dan progresmu **tersimpan otomatis di perangkatmu** tanpa perlu khawatir kehilangan jejak.

### Karakter Pilihanmu:
1. **Milo si anjing penurut**: Penuh keceriaan, suka dielus, dan setia menemanimu.
2. **Fizzi si ikan cupang**: Berenang anggun dengan sirip bercahaya di air kristal jernih.
3. **Ngkur si kucing manis dan pemberani**: Imut bersahaja namun berani menghadapi petualangan!

> *Tips: Jangan lupa beri makan tepat waktu, mandikan saat kotor, dan ajak bermain mini-game untuk mengumpulkan koin!*`,
      isAutoMilestone: true,
      badge: 'Awal Petualangan',
    },
  ];
  return {
    currentPetId: null, // User picks on first launch
    pets: initialPets,
    coins: 100, // Starter coins
    inventory: {
      food_biscuit: 3,
      food_pellet: 3,
      food_salmon: 3,
      food_milk: 2,
    },
    ownedAccessories: ['hat_party'],
    ownedDances: ['dance_robot_stiff'],
    jossyBot: {
      owned: false,
      battery: 100,
      isSleeping: false,
      lastDecayTimestamp: now,
    },
    adminPanel: {
      unlocked: false,
      freeShopping: false,
      invincibleMiniGame: false,
      freezeStats: false,
    },
    diary: initialDiary,
    settings: {
      soundEnabled: true,
      graphicsQuality: 'medium',
      shellThemeId: 'classic_egg',
      autoSave: true,
    },
  };
}
export class StorageService {
  static loadGame() {
    if (typeof window === 'undefined') {
      return { state: createDefaultGameState(), report: null };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaultState = createDefaultGameState();
        return { state: defaultState, report: null };
      }
      const parsed = JSON.parse(raw);
      // Ensure state integrity with fallbacks
      const state = this.sanitizeState(parsed);
      // Calculate offline time progression
      const report = this.processOfflineDecay(state);
      this.saveGame(state);
      return { state, report };
    } catch (err) {
      console.warn('Gagal memuat save game dari localStorage, menggunakan data baru:', err);
      const fallback = createDefaultGameState();
      return { state: fallback, report: null };
    }
  }
  static saveGame(state) {
    if (typeof window === 'undefined') return false;
    try {
      // Update timestamps
      const now = Date.now();
      if (state.currentPetId && state.pets[state.currentPetId]) {
        state.pets[state.currentPetId].lastSavedTimestamp = now;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Save error:', e);
      return false;
    }
  }
  static clearSave() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Clear save error:', e);
      }
    }
    const fresh = createDefaultGameState();
    this.saveGame(fresh);
    return fresh;
  }
  static sanitizeState(state) {
    const defaultState = createDefaultGameState();
    const currentPetId = state.currentPetId || null;
    const pets = { ...defaultState.pets, ...(state.pets || {}) };
    const coins = typeof state.coins === 'number' ? Math.max(0, state.coins) : 100;
    const inventory = { ...defaultState.inventory, ...(state.inventory || {}) };
    const ownedAccessories = Array.isArray(state.ownedAccessories)
      ? state.ownedAccessories
      : defaultState.ownedAccessories;
    const ownedDances =
      Array.isArray(state.ownedDances) && state.ownedDances.length > 0
        ? state.ownedDances
        : defaultState.ownedDances;
    const jossyBot = {
      ...defaultState.jossyBot,
      ...(state.jossyBot || {}),
    };
    const adminPanel = {
      ...defaultState.adminPanel,
      ...(state.adminPanel || {}),
    };
    const diary = Array.isArray(state.diary) ? state.diary : defaultState.diary;
    const settings = { ...defaultState.settings, ...(state.settings || {}) };
    return {
      currentPetId,
      pets,
      coins,
      inventory,
      ownedAccessories,
      ownedDances,
      jossyBot,
      adminPanel,
      diary,
      settings,
    };
  }
  static processOfflineDecay(state) {
    if (!state.currentPetId || !state.pets[state.currentPetId]) return null;
    const pet = state.pets[state.currentPetId];
    const now = Date.now();
    const lastSaved = pet.lastSavedTimestamp || now;
    // Check if admin froze stats
    if (state.adminPanel?.freezeStats) {
      pet.lastSavedTimestamp = now;
      return null;
    }
    const elapsedMs = now - lastSaved;
    const minutesAway = Math.floor(elapsedMs / (1000 * 60));
    // If away for less than 3 minutes, no report needed
    if (minutesAway < 3) {
      pet.lastSavedTimestamp = now;
      return null;
    }
    // Humane decay rate:
    // Every 20 minutes away:
    // - 2 hunger points lost (minimum stat floor is 25, pet NEVER dies while user is away)
    // - 1 hygiene lost
    // - 1 happiness lost
    // If sleeping:
    // + 5 energy restored per 10 minutes up to 100!
    // Pet finds dream coins: 1 coin per 15 minutes away (max 50 coins)
    const intervals = Math.min(minutesAway / 15, 48); // max 12 hours accounted
    const hungerLoss = Math.floor(intervals * 2);
    const hygieneLoss = Math.floor(intervals * 1.2);
    const happinessLoss = Math.floor(intervals * 1.5);
    let energyRestored = 0;
    const coinsFound = Math.min(Math.floor(intervals * 1.5), 60);
    // Apply stats
    pet.stats.hunger = Math.max(25, pet.stats.hunger - hungerLoss);
    pet.stats.hygiene = Math.max(25, pet.stats.hygiene - hygieneLoss);
    pet.stats.happiness = Math.max(25, pet.stats.happiness - happinessLoss);
    if (pet.isSleeping) {
      const neededEnergy = 100 - pet.stats.energy;
      energyRestored = Math.min(neededEnergy, Math.floor(intervals * 6));
      pet.stats.energy = Math.min(100, pet.stats.energy + energyRestored);
    } else {
      pet.stats.energy = Math.max(20, pet.stats.energy - Math.floor(intervals * 1));
    }
    // Calculate age in days
    const ageDays = Math.max(1, Math.floor((now - pet.birthTimestamp) / (1000 * 60 * 60 * 24)) + 1);
    pet.ageDays = ageDays;
    if (coinsFound > 0) {
      state.coins += coinsFound;
    }
    // J0ssy bot battery offline decay or recharging
    if (state.jossyBot && state.jossyBot.owned) {
      if (state.jossyBot.isSleeping) {
        // While resting, charges up (+10% per 15 mins)
        const charged = Math.min(100, state.jossyBot.battery + Math.floor(intervals * 10));
        state.jossyBot.battery = charged;
      } else {
        // Left on without rest: drains battery (-4% per 15 mins)
        const drained = Math.max(0, state.jossyBot.battery - Math.floor(intervals * 4));
        state.jossyBot.battery = drained;
      }
    }
    pet.lastSavedTimestamp = now;
    let notes = '';
    if (pet.isSleeping) {
      notes = `${pet.name} tidur sangat nyenyak saat kamu pergi dan terbangun dengan tenaga baru!`;
    } else if (pet.stats.hunger <= 35) {
      notes = `${pet.name} merindukanmu dan perutnya mulai keroncongan minta makanan hangat.`;
    } else {
      notes = `${pet.name} menjaga rumah virtualmu dengan baik dan sangat senang melihatmu kembali!`;
    }
    if (state.jossyBot?.owned && state.jossyBot.battery === 0) {
      notes += ' (Perhatian: J0ssy bot kehabisan baterai dan butuh dicas manual!)';
    }
    return {
      hasElapsed: true,
      minutesAway,
      petName: pet.name,
      hungerLost: hungerLoss,
      hygieneLost: hygieneLoss,
      happinessLost: happinessLoss,
      energyRestored,
      coinsFound,
      notes,
    };
  }
}
