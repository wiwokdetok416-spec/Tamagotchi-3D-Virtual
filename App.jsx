/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StorageService,
  SHELL_THEMES,
  PET_SPECIES,
  ACHIEVEMENTS_CATALOG,
  JOSSY_BOT_INFO,
  INITIAL_FOODS,
  ACCESSORIES_CATALOG,
  DANCE_CATALOG,
} from './services/storage';
import { PetScene } from './three/PetScene';
import { soundFx } from './audio/soundEffects';
import { PetHUD } from './components/PetHUD';
import { ActionDock } from './components/ActionDock';
import { PetSelectorModal } from './components/PetSelectorModal';
import { FoodMenuModal } from './components/FoodMenuModal';
import { MiniGameModal } from './components/MiniGameModal';
import { ShopModal } from './components/ShopModal';
import { MarkdownModal } from './components/MarkdownModal';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { JossyBotModal } from './components/JossyBotModal';
import { DanceModal } from './components/DanceModal';
import { AdminQuizModal } from './components/AdminQuizModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DraggableAdminBadge } from './components/DraggableAdminBadge';
export default function App() {
  // 1. Initial State from Storage
  const [gameState, setGameState] = useState(() => {
    return StorageService.loadGame().state;
  });
  const [welcomeReport, setWelcomeReport] = useState(null);
  const [toasts, setToasts] = useState([]);
  // Active Modals
  const [showSelector, setShowSelector] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showJossyModal, setShowJossyModal] = useState(false);
  const [showDanceModal, setShowDanceModal] = useState(false);
  const [showAdminQuiz, setShowAdminQuiz] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [consoleFrameMode, setConsoleFrameMode] = useState(false); // default to expansive clean viewport!
  // 3D Scene Reference
  const canvasMountRef = useRef(null);
  const petSceneRef = useRef(null);
  // Trigger floating toast feedback
  const showToast = (text, icon = '✨') => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, text, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };
  // Check initial load offline report & pet selection
  useEffect(() => {
    const { report } = StorageService.loadGame();
    if (report && report.hasElapsed) {
      setWelcomeReport(report);
    }
    if (!gameState.currentPetId) {
      setShowSelector(true);
    }
  }, []);
  // Current active pet data helper
  const currentPetId = gameState.currentPetId || 'milo';
  const currentPet = gameState.pets[currentPetId];
  // Refs to guarantee callbacks always read the real-time active pet
  const currentPetIdRef = useRef(currentPetId);
  currentPetIdRef.current = currentPetId;
  const currentPetRef = useRef(currentPet);
  currentPetRef.current = currentPet;
  const handlePetInteractionRef = useRef(() => {});
  // Shell theme helper
  const currentTheme =
    SHELL_THEMES.find((t) => t.id === gameState.settings.shellThemeId) || SHELL_THEMES[0];
  // Sound state sync
  useEffect(() => {
    soundFx.setEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);
  // Periodic Auto-Save and Stat Decay
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        if (!prev.currentPetId || !prev.pets[prev.currentPetId]) return prev;
        const pet = { ...prev.pets[prev.currentPetId] };
        // Very gentle real-time natural decay while open (every 30 seconds)
        if (pet.isSleeping) {
          pet.stats.energy = Math.min(100, pet.stats.energy + 2);
          pet.stats.hunger = Math.max(20, pet.stats.hunger - 0.3);
        } else {
          pet.stats.hunger = Math.max(15, pet.stats.hunger - 0.5);
          pet.stats.energy = Math.max(10, pet.stats.energy - 0.3);
          pet.stats.hygiene = Math.max(15, pet.stats.hygiene - 0.2);
          pet.stats.happiness = Math.max(15, pet.stats.happiness - 0.2);
        }
        const nextState = {
          ...prev,
          pets: {
            ...prev.pets,
            [prev.currentPetId]: pet,
          },
        };
        StorageService.saveGame(nextState);
        return nextState;
      });
    }, 25000);
    return () => clearInterval(interval);
  }, []);
  // Save on state change
  const updateStateAndSave = useCallback((updater) => {
    setGameState((prev) => {
      const next = updater(prev);
      StorageService.saveGame(next);
      return next;
    });
  }, []);
  // 2. Initialize 3D Scene
  useEffect(() => {
    if (!canvasMountRef.current) return;
    const scene = new PetScene(
      canvasMountRef.current,
      currentPetId,
      gameState.settings.graphicsQuality,
    );
    petSceneRef.current = scene;
    scene.setPetInteractedCallback((petId) => {
      handlePetInteractionRef.current(petId);
    });
    scene.setJossyInteractedCallback(() => {
      setShowJossyModal(true);
    });
    if (currentPet.equippedHat) {
      scene.updateAccessories(currentPet.equippedHat);
    }
    scene.setSleeping(currentPet.isSleeping);
    scene.setJossyBot(
      gameState.jossyBot.owned,
      gameState.jossyBot.battery,
      gameState.jossyBot.isSleeping,
    );
    return () => {
      scene.dispose();
      petSceneRef.current = null;
    };
  }, []);
  // Re-trigger resize on layout toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (petSceneRef.current) {
        petSceneRef.current.onResize();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [consoleFrameMode]);
  // Handle pet switch in 3D scene
  useEffect(() => {
    if (petSceneRef.current && currentPetId) {
      petSceneRef.current.switchPet(currentPetId);
      petSceneRef.current.updateAccessories(currentPet?.equippedHat || null);
      petSceneRef.current.setSleeping(currentPet?.isSleeping || false);
      petSceneRef.current.setPetInteractedCallback((petId) => {
        handlePetInteractionRef.current(petId);
      });
    }
  }, [currentPetId]);
  // Handle accessory dynamic equip/unequip in 3D scene
  useEffect(() => {
    if (petSceneRef.current) {
      petSceneRef.current.updateAccessories(currentPet?.equippedHat || null);
    }
  }, [currentPet?.equippedHat]);
  // Handle sleeping state change in 3D scene
  useEffect(() => {
    if (petSceneRef.current) {
      petSceneRef.current.setSleeping(currentPet?.isSleeping || false);
    }
  }, [currentPet?.isSleeping]);
  // Handle J0ssy bot updates in 3D scene
  useEffect(() => {
    if (petSceneRef.current) {
      petSceneRef.current.setJossyBot(
        gameState.jossyBot.owned,
        gameState.jossyBot.battery,
        gameState.jossyBot.isSleeping,
      );
    }
  }, [gameState.jossyBot.owned, gameState.jossyBot.battery, gameState.jossyBot.isSleeping]);
  // J0ssy bot live battery drain and recharging interval
  useEffect(() => {
    if (!gameState.jossyBot.owned) return;
    const interval = setInterval(() => {
      updateStateAndSave((prev) => {
        if (!prev.jossyBot.owned) return prev;
        const bot = { ...prev.jossyBot };
        if (bot.isSleeping) {
          // Recharging while resting (+1% every 15s)
          bot.battery = Math.min(100, bot.battery + 1);
        } else {
          // Drains slowly while awake (-1% every 25s)
          if (bot.battery > 0) {
            const nextBat = Math.max(0, bot.battery - 1);
            bot.battery = nextBat;
            if (nextBat === 19) {
              showToast(
                '⚠️ Kapasitas baterai J0ssy bot < 20%! Matikan & istirahatkan untuk cas.',
                '⚡',
              );
              soundFx.playBeep(450, 0.2);
            } else if (nextBat === 0) {
              showToast('🛑 J0ssy bot kehabisan baterai dan mati! Perlu dicas manual.', '🔌');
              soundFx.playBeep(250, 0.3);
            }
          }
        }
        return { ...prev, jossyBot: bot };
      });
    }, 25000);
    return () => clearInterval(interval);
  }, [gameState.jossyBot.owned, gameState.jossyBot.isSleeping]);
  // Handle quality change in 3D scene
  useEffect(() => {
    if (petSceneRef.current) {
      petSceneRef.current.applyQualitySettings(gameState.settings.graphicsQuality);
    }
  }, [gameState.settings.graphicsQuality]);
  // Add XP and check Level Up
  const addXP = (amount) => {
    updateStateAndSave((prev) => {
      if (!prev.currentPetId) return prev;
      const pet = { ...prev.pets[prev.currentPetId] };
      pet.xp += amount;
      if (pet.xp >= pet.xpNext) {
        pet.level += 1;
        pet.xp = pet.xp - pet.xpNext;
        pet.xpNext = Math.floor(pet.xpNext * 1.3);
        soundFx.playLevelUp();
        showToast(`Selamat! ${pet.name} naik ke Level ${pet.level}! ⭐`, '🎉');
        // Check level 5 achievement
        if (pet.level >= 5 && !pet.unlockedAchievements.includes('ach_level_5')) {
          pet.unlockedAchievements = [...pet.unlockedAchievements, 'ach_level_5'];
          prev.coins += 100;
          showToast(`Prestasi Tercapai: Tumbuh Bersama! (+100 🪙)`, '🏆');
        }
        // Add auto diary milestone
        const milestoneEntry = {
          id: `lvl_${Date.now()}`,
          petId: prev.currentPetId,
          dateStr: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          timestamp: Date.now(),
          title: `🌟 ${pet.name} Naik ke Level ${pet.level}!`,
          markdownContent: `### Hebat Sekali! ${pet.name} Bertambah Pintar! 🎖️\n\nMelalui kasih sayang dan perawatanmu yang telaten, **${pet.name}** berhasil mencapai **Level ${pet.level}**!\n\n* Kapasitas energi dan kebahagiaan bertambah kuat.\n* Teruslah merawat sahabatmu setiap hari!`,
          isAutoMilestone: true,
          badge: `Level ${pet.level}`,
        };
        prev.diary = [milestoneEntry, ...prev.diary];
      }
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [prev.currentPetId]: pet,
        },
      };
    });
  };
  // 3. User Interactions: Petting
  const handlePetInteraction = (targetPetId) => {
    const activePetId = targetPetId || currentPetIdRef.current || currentPetId || 'milo';
    const activePet = gameState.pets[activePetId] || currentPet;
    const petName = activePet?.name || PET_SPECIES[activePetId]?.name || 'Hewanmu';
    if (activePet.isSleeping) {
      // Pet is disturbed while sleeping: Pet does NOT wake up!
      const sleepDisturbReaction =
        activePetId === 'milo'
          ? `Ssshh... Milo lagi tidur pulas (Zzz...). Milo hanya menggeliat manja, mendengkur halus, lalu lanjut mimpi makan sosis! 💤🐶`
          : activePetId === 'fizzi'
            ? `Ssshh... Fizzi sedang tidur nyenyak melayang di air (Zzz...). Fizzi mengibaskan siripnya perlahan tanpa terbangun! 💤🐠`
            : activePetId === 'patar'
              ? `Ssshh... Patar tidur lelap di balik capitnya (Zzz...). "Hmph... jangan ganggu preman pantai lagi mimpi..." Patar mendengkur pelan dan tetap tidur! 💤🦀`
              : `Ssshh... Ngkur melingkar nyenyak dan mendengkur "purrr... Zzz...". Ngkur tidak bangun karena masih sangat mengantuk! 💤🐱`;
      updateStateAndSave((prev) => {
        const pid = targetPetId || prev.currentPetId || activePetId;
        if (!pid || !prev.pets[pid]) return prev;
        const pet = { ...prev.pets[pid] };
        pet.stats.love = Math.min(100, pet.stats.love + 2);
        return {
          ...prev,
          pets: {
            ...prev.pets,
            [pid]: pet,
          },
        };
      });
      showToast(sleepDisturbReaction, '💤');
      return;
    }
    updateStateAndSave((prev) => {
      const pid = targetPetId || prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.stats.love = Math.min(100, pet.stats.love + 5);
      pet.stats.happiness = Math.min(100, pet.stats.happiness + 4);
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    addXP(10);
    const petReaction =
      activePetId === 'milo'
        ? `${petName} mengibas ekor dan menjulurkan lidah bahagia!`
        : activePetId === 'fizzi'
          ? `${petName} menari indah dan mengibaskan sirip halfmoon-nya!`
          : activePetId === 'patar'
            ? `${petName} mengetuk capitnya "Klak-klak!" ("Hmph! Boleh juga elusanmu!")`
            : `${petName} mendengkur nyaman dan mengusapkan pipinya!`;
    showToast(petReaction, '❤️');
  };
  handlePetInteractionRef.current = handlePetInteraction;
  // Feed Pet
  const handleFeedPet = (food) => {
    const activePetId = currentPetIdRef.current || currentPetId || 'milo';
    const activePet = gameState.pets[activePetId] || currentPet;
    const petName = activePet?.name || PET_SPECIES[activePetId]?.name || 'Hewanmu';
    if (activePet.isSleeping) {
      soundFx.playBeep(260, 0.2);
      showToast(
        `Hsst! ${petName} sedang tidur lelap (Zzz...). Tidak bisa makan sambil tidur! Bangunkan dulu di tombol Kasur/Tidur 💤`,
        '😴',
      );
      return;
    }
    if (petSceneRef.current) {
      petSceneRef.current.dropFood(food.emoji);
    }
    updateStateAndSave((prev) => {
      if (!prev.currentPetId) return prev;
      const pet = { ...prev.pets[prev.currentPetId] };
      const count = prev.inventory[food.id] || 0;
      if (count <= 0) return prev;
      // Apply food stats
      const isFav = food.suitablePet === prev.currentPetId;
      const hungerInc = food.hungerBoost * (isFav ? 1.25 : 1);
      const happyInc = food.happinessBoost * (isFav ? 1.5 : 1);
      pet.stats.hunger = Math.min(100, Math.round(pet.stats.hunger + hungerInc));
      pet.stats.happiness = Math.min(100, Math.round(pet.stats.happiness + happyInc));
      if (food.energyBoost) {
        pet.stats.energy = Math.min(100, pet.stats.energy + food.energyBoost);
      }
      const nextInv = { ...prev.inventory, [food.id]: count - 1 };
      return {
        ...prev,
        inventory: nextInv,
        pets: {
          ...prev.pets,
          [prev.currentPetId]: pet,
        },
      };
    });
    addXP(15);
    setShowFoodMenu(false);
    showToast(
      `Nyam nyam! ${petName} lahap memakan ${food.name}! (+${food.hungerBoost}% Kenyang)`,
      food.emoji,
    );
  };
  // Buy Food
  const handleBuyFood = (food) => {
    const isFree = gameState.adminPanel?.freeShopping;
    if (!isFree && gameState.coins < food.cost) return;
    soundFx.playCoin();
    updateStateAndSave((prev) => {
      const curCount = prev.inventory[food.id] || 0;
      return {
        ...prev,
        coins: isFree ? prev.coins : prev.coins - food.cost,
        inventory: {
          ...prev.inventory,
          [food.id]: curCount + 1,
        },
      };
    });
    showToast(
      isFree
        ? `[Admin Gratis] Berhasil mengambil 1 ${food.name}! Koin tidak berkurang.`
        : `Membeli 1 ${food.name}! Tersisa ${gameState.coins - food.cost} 🪙`,
      '🛒',
    );
  };
  // Wash / Clean Pet
  const handleWashPet = () => {
    const activePetId = currentPetIdRef.current || currentPetId;
    const activePet = gameState.pets[activePetId] || currentPet;
    const petName = activePet?.name || currentPet.name;
    if (activePet.isSleeping) {
      soundFx.playBeep(260, 0.2);
      showToast(
        `Brrr dingin! Jangan mandikan ${petName} saat sedang tidur lelap (Zzz...), nanti masuk angin! Bangunkan dulu ya! 💤🛁`,
        '😴',
      );
      return;
    }
    if (petSceneRef.current) {
      petSceneRef.current.triggerWash();
    }
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.stats.hygiene = 100;
      pet.stats.happiness = Math.min(100, pet.stats.happiness + 10);
      // Check clean achievement
      if (!pet.unlockedAchievements.includes('ach_sparkle_clean')) {
        pet.unlockedAchievements = [...pet.unlockedAchievements, 'ach_sparkle_clean'];
        prev.coins += 35;
        showToast('Prestasi Tercapai: Kinclong & Harum! (+35 🪙)', '🏆');
      }
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    addXP(20);
    showToast(`Swoosh! ${petName} sekarang sangat bersih, wangi, dan segar! (100% Bersih)`, '🫧');
  };
  // Toggle Sleep / Awake
  const handleToggleSleep = () => {
    const activePetId = currentPetIdRef.current || currentPetId;
    const activePet = gameState.pets[activePetId] || currentPet;
    const petName = activePet?.name || 'Sahabatmu';
    const nextSleep = !activePet.isSleeping;
    if (petSceneRef.current) {
      petSceneRef.current.setSleeping(nextSleep);
    }
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.isSleeping = nextSleep;
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    if (nextSleep) {
      showToast(`Lampu diredupkan... ${petName} tidur nyenyak memulihkan energi.`, '💤');
    } else {
      showToast(`Selamat pagi! ${petName} terbangun segar bugar!`, '☀️');
    }
  };
  // Mini-Game Reward
  const handleMiniGameReward = (earnedCoins, happinessBoost, gameScore) => {
    const activePetId = currentPetIdRef.current || currentPetId;
    const petName = gameState.pets[activePetId]?.name || currentPet.name;
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.stats.happiness = Math.min(100, pet.stats.happiness + happinessBoost);
      if (gameScore >= 100 && !pet.unlockedAchievements.includes('ach_play_champ')) {
        pet.unlockedAchievements = [...pet.unlockedAchievements, 'ach_play_champ'];
        prev.coins += 75;
        showToast('Prestasi Tercapai: Jagoan Mini-Game! (+75 🪙)', '🏆');
      }
      return {
        ...prev,
        coins: prev.coins + earnedCoins,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    addXP(30);
    showToast(
      `Hebat! Bermain bersama ${petName} mendapat +${earnedCoins} 🪙 & +${happinessBoost}% Kebahagiaan!`,
      '🎮',
    );
  };
  // Buy Accessory & Auto-Equip onto Pet
  const handleBuyAccessory = (item) => {
    const isFree = gameState.adminPanel?.freeShopping;
    if (!isFree && gameState.coins < item.cost) return;
    soundFx.playCoin();
    soundFx.playSparkle();
    const activePetId = currentPetIdRef.current || currentPetId;
    const petName = gameState.pets[activePetId]?.name || currentPet.name;
    // Auto-equip onto 3D pet immediately
    if (petSceneRef.current) {
      petSceneRef.current.updateAccessories(item.id);
    }
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.equippedHat = item.id;
      pet.equippedAccessory = item.id;
      if (!pet.unlockedAchievements.includes('ach_fashion_star')) {
        pet.unlockedAchievements = [...pet.unlockedAchievements, 'ach_fashion_star'];
        prev.coins += 60;
        showToast('Prestasi Tercapai: Bintang Modis! (+60 🪙)', '🎩');
      }
      return {
        ...prev,
        coins: isFree ? prev.coins : prev.coins - item.cost,
        ownedAccessories: prev.ownedAccessories.includes(item.id)
          ? prev.ownedAccessories
          : [...prev.ownedAccessories, item.id],
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    showToast(
      isFree
        ? `[Admin Gratis] Berhasil mengambil & langsung memakaikan ${item.name} ke ${petName}! ✨`
        : `Berhasil membeli & langsung memakaikan ${item.name} ke ${petName}! ✨`,
      item.emoji,
    );
  };
  // Equip / Unequip Hat & Accessories
  const handleEquipHat = (hatId) => {
    const activePetId = currentPetIdRef.current || currentPetId;
    const petName = gameState.pets[activePetId]?.name || currentPet.name;
    if (petSceneRef.current) {
      petSceneRef.current.updateAccessories(hatId);
    }
    if (hatId) {
      soundFx.playSparkle();
    } else {
      soundFx.playBeep();
    }
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.equippedHat = hatId;
      pet.equippedAccessory = hatId;
      if (hatId && !pet.unlockedAchievements.includes('ach_fashion_star')) {
        pet.unlockedAchievements = [...pet.unlockedAchievements, 'ach_fashion_star'];
        prev.coins += 60;
        showToast('Prestasi Tercapai: Bintang Modis! (+60 🪙)', '🎩');
      }
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    showToast(
      hatId
        ? `Memakaikan aksesoris baru pada ${petName}! ✨`
        : `Melepas aksesoris dari ${petName}.`,
      hatId ? '👒' : '🧺',
    );
  };
  // Select Console Shell Theme
  const handleSelectTheme = (theme) => {
    updateStateAndSave((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        shellThemeId: theme.id,
      },
    }));
    showToast(`Cangkang konsol diubah ke: ${theme.name}`, '🎨');
  };
  // Sound Toggle
  const handleToggleSound = () => {
    const nextSound = !gameState.settings.soundEnabled;
    soundFx.setEnabled(nextSound);
    if (nextSound) soundFx.playBeep();
    updateStateAndSave((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: nextSound,
      },
    }));
    showToast(nextSound ? 'Efek Suara Diaktifkan 🔊' : 'Efek Suara Dimatikan 🔇', '🎵');
  };
  // Cycle Quality
  const handleCycleQuality = () => {
    const sequence = ['low', 'medium', 'high'];
    const curIdx = sequence.indexOf(gameState.settings.graphicsQuality);
    const nextQ = sequence[(curIdx + 1) % sequence.length];
    updateStateAndSave((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        graphicsQuality: nextQ,
      },
    }));
    const label =
      nextQ === 'low'
        ? 'Hemat Daya (Perangkat Lawas)'
        : nextQ === 'medium'
          ? 'Normal'
          : 'Tinggi (HD)';
    showToast(`Kualitas Grafis: ${label}`, '⚙️');
  };
  // Add Diary Entry (Markdown)
  const handleAddDiaryEntry = (title, content) => {
    const newEntry = {
      id: `diary_${Date.now()}`,
      petId: currentPetId,
      dateStr: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      timestamp: Date.now(),
      title,
      markdownContent: content,
      isAutoMilestone: false,
    };
    updateStateAndSave((prev) => ({
      ...prev,
      diary: [newEntry, ...prev.diary],
    }));
    showToast(`Catatan harian baru disimpan dengan format Markdown!`, '📝');
  };
  // Claim Achievement
  const handleClaimAchievement = (ach) => {
    soundFx.playLevelUp();
    updateStateAndSave((prev) => ({
      ...prev,
      coins: prev.coins + ach.rewardCoins,
    }));
    showToast(`Klaim Hadiah: +${ach.rewardCoins} 🪙`, '🎁');
  };
  // Switch / Select Pet
  const handleSelectPet = (petId, customName) => {
    currentPetIdRef.current = petId;
    updateStateAndSave((prev) => {
      const pet = { ...prev.pets[petId] };
      if (customName) {
        pet.name = customName;
      }
      return {
        ...prev,
        currentPetId: petId,
        pets: {
          ...prev.pets,
          [petId]: pet,
        },
      };
    });
    // Immediately switch 3D pet and accessories
    if (petSceneRef.current) {
      petSceneRef.current.switchPet(petId);
      petSceneRef.current.updateAccessories(gameState.pets[petId]?.equippedHat || null);
      petSceneRef.current.setSleeping(gameState.pets[petId]?.isSleeping || false);
      petSceneRef.current.setPetInteractedCallback((pId) => {
        handlePetInteractionRef.current(pId);
      });
    }
    setShowSelector(false);
    showToast(`Sekarang bermain bersama ${customName || PET_SPECIES[petId].name}!`, '🐾');
  };
  // Reset Game Handler
  const handleConfirmReset = () => {
    const freshState = StorageService.clearSave();
    setGameState(freshState);
    setShowResetModal(false);
    setShowSelector(true);
    if (petSceneRef.current) {
      petSceneRef.current.switchPet('milo');
      petSceneRef.current.updateAccessories(null);
      petSceneRef.current.setSleeping(false);
      petSceneRef.current.setJossyBot(false, 100, false);
    }
    showToast('Permainan Tamagotchi 3D berhasil direset! Silakan pilih hewan barumu.', '🔄');
  };
  // Buy J0ssy bot from shop
  const handleBuyJossyBot = () => {
    const isFree = gameState.adminPanel?.freeShopping;
    if (!isFree && gameState.coins < JOSSY_BOT_INFO.cost) {
      soundFx.playBeep(250, 0.2);
      showToast(
        `Koin tidak cukup! Butuh ${JOSSY_BOT_INFO.cost.toLocaleString('id-ID')} 🪙 untuk J0ssy bot.`,
        '⚠️',
      );
      return;
    }
    soundFx.playCoin();
    soundFx.playSparkle();
    updateStateAndSave((prev) => ({
      ...prev,
      coins: isFree ? prev.coins : prev.coins - JOSSY_BOT_INFO.cost,
      jossyBot: {
        owned: true,
        battery: 100,
        isSleeping: false,
        lastDecayTimestamp: Date.now(),
      },
    }));
    if (petSceneRef.current) {
      petSceneRef.current.setJossyBot(true, 100, false);
    }
    showToast(
      isFree
        ? '🎉 [Admin Gratis] J0ssy bot AI berhasil diaktifkan tanpa biaya!'
        : '🎉 Selamat! J0ssy bot berhasil dibeli! Robot AI siap membantumu!',
      '🤖',
    );
  };
  // Buy Dance Emote
  const handleBuyDance = (dance) => {
    const isFree = gameState.adminPanel?.freeShopping;
    if (!isFree && gameState.coins < dance.cost) {
      soundFx.playBeep(250, 0.2);
      showToast(`Koin tidak cukup! Butuh ${dance.cost.toLocaleString('id-ID')} 🪙.`, '⚠️');
      return;
    }
    soundFx.playCoin();
    soundFx.playSparkle();
    updateStateAndSave((prev) => ({
      ...prev,
      coins: isFree ? prev.coins : prev.coins - dance.cost,
      ownedDances: prev.ownedDances.includes(dance.id)
        ? prev.ownedDances
        : [...prev.ownedDances, dance.id],
    }));
    showToast(
      isFree
        ? `[Admin Gratis] Membuka gerakan joget "${dance.name}" tanpa koin! 💃`
        : `Membuka gerakan joget "${dance.name}"! 💃`,
      '🎶',
    );
  };
  // Select Dance & Trigger 3D choreography
  const handleSelectDance = (dance) => {
    const activePetId = currentPetIdRef.current || currentPetId;
    const activePet = gameState.pets[activePetId] || currentPet;
    const petName = activePet?.name || currentPet.name;
    if (activePet.isSleeping) {
      soundFx.playBeep(260, 0.2);
      showToast(
        `Hoaamm... ${petName} terlalu mengantuk untuk berjoget (Zzz...)! Bangunkan dulu agar bisa bergoyang ceria! 😴🎶`,
        '💤',
      );
      return;
    }
    if (petSceneRef.current) {
      petSceneRef.current.startDance(dance.style, 6000);
    }
    soundFx.playSparkle();
    updateStateAndSave((prev) => {
      const pid = prev.currentPetId || activePetId;
      if (!pid || !prev.pets[pid]) return prev;
      const pet = { ...prev.pets[pid] };
      pet.stats.happiness = Math.min(100, pet.stats.happiness + 15);
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [pid]: pet,
        },
      };
    });
    addXP(10);
    showToast(`Asik! ${petName} bergoyang seru dengan gerakan ${dance.name}! 🕺✨`, '🎶');
  };
  // Update J0ssy Bot State (rest/sleep toggle, battery recharge)
  const handleUpdateJossyState = (updater) => {
    updateStateAndSave((prev) => {
      const nextBot = updater(prev.jossyBot);
      return {
        ...prev,
        jossyBot: nextBot,
      };
    });
  };
  // Admin Panel Handlers
  const handleUnlockAdminSuccess = () => {
    updateStateAndSave((prev) => ({
      ...prev,
      adminPanel: {
        ...prev.adminPanel,
        unlocked: true,
      },
    }));
    showToast(
      '🎉 5/5 BENAR SEMUA! Admin Panel Berhasil Terbuka Selamanya! Kotak ⚡ ADMIN kini muncul di layar!',
      '👑',
    );
  };
  const handleUpdateAdminState = (updater) => {
    updateStateAndSave((prev) => ({
      ...prev,
      adminPanel: updater(prev.adminPanel),
    }));
  };
  const handleUpdatePetStats = (petId, stats) => {
    updateStateAndSave((prev) => {
      if (!prev.pets[petId]) return prev;
      const pet = { ...prev.pets[petId] };
      pet.stats = { ...pet.stats, ...stats };
      return {
        ...prev,
        pets: {
          ...prev.pets,
          [petId]: pet,
        },
      };
    });
  };
  const handleSetCoins = (amount) => {
    updateStateAndSave((prev) => ({
      ...prev,
      coins: amount,
    }));
    showToast(
      `Dompet koin diperbarui: ${amount >= 999999999 ? '∞ (999.999.999)' : amount.toLocaleString('id-ID')} 🪙`,
      '🪙',
    );
  };
  const handleUnlockAllContent = () => {
    const allAccs = ACCESSORIES_CATALOG.map((a) => a.id);
    const allDances = DANCE_CATALOG.map((d) => d.id);
    const allAchs = ACHIEVEMENTS_CATALOG.map((a) => a.id);
    updateStateAndSave((prev) => {
      const updatedPets = { ...prev.pets };
      Object.keys(updatedPets).forEach((pKey) => {
        const p = { ...updatedPets[pKey] };
        p.unlockedAchievements = Array.from(new Set([...p.unlockedAchievements, ...allAchs]));
        p.stats = {
          hunger: 100,
          energy: 100,
          hygiene: 100,
          happiness: 100,
          love: 100,
          health: 100,
        };
        p.level = 10;
        updatedPets[pKey] = p;
      });
      return {
        ...prev,
        ownedAccessories: Array.from(new Set([...prev.ownedAccessories, ...allAccs])),
        ownedDances: Array.from(new Set([...prev.ownedDances, ...allDances])),
        jossyBot: {
          owned: true,
          battery: 100,
          isSleeping: false,
          lastDecayTimestamp: Date.now(),
        },
        pets: updatedPets,
      };
    });
    if (petSceneRef.current) {
      petSceneRef.current.setJossyBot(true, 100, false);
    }
    soundFx.playLevelUp();
    showToast('🔓 SEMUA Topi, Tarian, Robot J0ssy & Prestasi Berhasil Dibuka Sekaligus!', '✨');
  };
  const handleResetAdminCheats = () => {
    updateStateAndSave((prev) => ({
      ...prev,
      adminPanel: {
        ...prev.adminPanel,
        freeShopping: false,
        invincibleMiniGame: false,
        freezeStats: false,
      },
    }));
    showToast('Pengaturan cheat admin telah dikembalikan ke standar normal.', '⚙️');
  };
  const handleResetAdminModifications = () => {
    updateStateAndSave((prev) => {
      // 1. Reset admin panel cheats to standard normal
      const adminPanel = {
        unlocked: prev.adminPanel?.unlocked ?? true,
        freeShopping: false,
        invincibleMiniGame: false,
        freezeStats: false,
      };
      // 2. Restore all pets back to natural healthy baseline
      const updatedPets = { ...prev.pets };
      Object.keys(updatedPets).forEach((pid) => {
        const pet = { ...updatedPets[pid] };
        pet.stats = {
          hunger: 85,
          energy: 90,
          hygiene: 90,
          happiness: 85,
          health: 100,
          love: Math.max(70, pet.stats.love || 70),
        };
        updatedPets[pid] = pet;
      });
      // 3. Normalize coins back to reasonable balance if infinite or modified
      let restoredCoins = prev.coins;
      if (restoredCoins > 10000 || restoredCoins < 0) {
        restoredCoins = 100;
      }
      return {
        ...prev,
        adminPanel,
        coins: restoredCoins,
        pets: updatedPets,
      };
    });
    soundFx.playSparkle();
    showToast(
      'Seluruh modifikasi Admin Panel telah dikembalikan ke kondisi standar semula! ✨',
      '🔄',
    );
  };
  // Keyboard Shortcuts (1-6 for actions, Space for pet)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === '1') {
        soundFx.playBeep();
        setShowFoodMenu(true);
      } else if (e.key === '2') {
        handleWashPet();
      } else if (e.key === '3') {
        soundFx.playBeep();
        setShowMiniGame(true);
      } else if (e.key === '4') {
        handleToggleSleep();
      } else if (e.key === '5') {
        soundFx.playBeep();
        setShowShop(true);
      } else if (e.key === '6') {
        soundFx.playBeep();
        setShowMarkdown(true);
      } else if (e.key === ' ') {
        e.preventDefault();
        handlePetInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPetId, currentPet]);
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none font-sans">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black pointer-events-none" />

      {/* Floating Toast Feedback Notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1.5 w-full max-w-md px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in fade-in slide-in-from-top-4 duration-300 px-4 py-2 rounded-2xl bg-slate-900/95 border border-amber-400/60 text-slate-100 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-heading font-bold flex items-center gap-2 text-center"
          >
            <span className="text-base">{toast.icon}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* 3D WebGL Canvas Layer - Persistent & Permanent */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div
          ref={canvasMountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Ketuk atau elus hewan peliharaanmu!"
        />
      </div>

      {/* Decorative Console Bezel Frame Overlay (When consoleFrameMode is active) */}
      {consoleFrameMode && (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center p-1 sm:p-3">
          <div
            className={`w-full h-full max-w-6xl max-h-[97vh] rounded-[24px] sm:rounded-[36px] border-4 sm:border-8 ${currentTheme.border} shadow-2xl flex flex-col justify-between p-2 sm:p-3 bg-transparent ring-4 ring-black/40`}
          >
            {/* Header Branding Pill */}
            <div className="self-center px-4 py-1 rounded-full bg-slate-900/85 border border-slate-700/80 text-white flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-amber-300">
                TAMAGOTCHI 3D • {currentPet.name}
              </span>
            </div>

            {/* Bottom Retro Speaker Grille Indicator */}
            <div className="self-center flex gap-1.5 opacity-60 pb-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HUD Header Overlay (Fixed on Top) */}
      <PetHUD
        pet={currentPet}
        coins={gameState.coins}
        soundEnabled={gameState.settings.soundEnabled}
        quality={gameState.settings.graphicsQuality}
        isSleeping={currentPet.isSleeping}
        consoleFrameMode={consoleFrameMode}
        jossyState={gameState.jossyBot}
        onToggleSound={handleToggleSound}
        onCycleQuality={handleCycleQuality}
        onToggleFrameMode={() => setConsoleFrameMode(!consoleFrameMode)}
        onOpenSelector={() => setShowSelector(true)}
        onOpenMarkdown={() => setShowMarkdown(true)}
        onResetGame={() => setShowResetModal(true)}
        onOpenJossyBot={() => setShowJossyModal(true)}
      />

      {/* Action Dock (Fixed at Bottom) */}
      <ActionDock
        isSleeping={currentPet.isSleeping}
        onFeedClick={() => {
          if (currentPet.isSleeping) {
            soundFx.playBeep(260, 0.2);
            showToast(
              `Hsst! ${currentPet.name} sedang tidur lelap (Zzz...). Hewan tidak bisa makan sambil tidur, bangunkan dulu! 💤🍖`,
              '😴',
            );
            return;
          }
          setShowFoodMenu(true);
        }}
        onWashClick={handleWashPet}
        onPlayClick={() => {
          if (currentPet.isSleeping) {
            soundFx.playBeep(260, 0.2);
            showToast(
              `Ssshh! ${currentPet.name} sedang bermimpi indah (Zzz...). Bangunkan dulu jika ingin mengajaknya bermain mini-game! 💤⚽`,
              '😴',
            );
            return;
          }
          setShowMiniGame(true);
        }}
        onDanceClick={() => {
          if (currentPet.isSleeping) {
            soundFx.playBeep(260, 0.2);
            showToast(
              `Hoaamm... ${currentPet.name} sedang tidur pulas (Zzz...)! Bangunkan dulu jika ingin mengajaknya berjoget! 😴💃`,
              '💤',
            );
            return;
          }
          setShowDanceModal(true);
        }}
        onToggleSleep={handleToggleSleep}
        onShopClick={() => setShowShop(true)}
        onMarkdownClick={() => setShowMarkdown(true)}
        onPetClick={handlePetInteraction}
      />

      {/* Floating Draggable Admin Badge (Active if unlocked forever) */}
      {gameState.adminPanel?.unlocked && (
        <DraggableAdminBadge onOpenPanel={() => setShowAdminPanel(true)} />
      )}

      {/* MODALS */}
      {/* 1. Pet Selector Modal */}
      {showSelector && (
        <PetSelectorModal
          currentPetId={gameState.currentPetId}
          onSelectPet={handleSelectPet}
          canClose={gameState.currentPetId !== null}
          onClose={() => setShowSelector(false)}
        />
      )}

      {/* 2. Food & Feeding Modal */}
      {showFoodMenu && (
        <FoodMenuModal
          petId={currentPetId}
          petName={currentPet.name}
          inventory={gameState.inventory}
          coins={gameState.coins}
          freeShopping={gameState.adminPanel?.freeShopping}
          onFeed={handleFeedPet}
          onBuyFood={handleBuyFood}
          onClose={() => setShowFoodMenu(false)}
        />
      )}

      {/* 3. Mini-Game Modal */}
      {showMiniGame && (
        <MiniGameModal
          petId={currentPetId}
          petName={currentPet.name}
          isInvincible={gameState.adminPanel?.invincibleMiniGame}
          onClose={() => setShowMiniGame(false)}
          onReward={handleMiniGameReward}
        />
      )}

      {/* 4. Shop & Wardrobe Modal */}
      {showShop && (
        <ShopModal
          coins={gameState.coins}
          ownedAccessories={gameState.ownedAccessories}
          equippedHat={currentPet.equippedHat}
          currentThemeId={gameState.settings.shellThemeId}
          isJossyOwned={gameState.jossyBot.owned}
          ownedDances={gameState.ownedDances}
          adminUnlocked={gameState.adminPanel?.unlocked}
          freeShopping={gameState.adminPanel?.freeShopping}
          pets={gameState.pets}
          onBuyAccessory={handleBuyAccessory}
          onEquipHat={handleEquipHat}
          onSelectTheme={handleSelectTheme}
          onBuyJossyBot={handleBuyJossyBot}
          onBuyDance={handleBuyDance}
          onStartAdminQuiz={() => {
            setShowShop(false);
            setShowAdminQuiz(true);
          }}
          onOpenAdminPanel={() => {
            setShowShop(false);
            setShowAdminPanel(true);
          }}
          onOpenJossyBotModal={() => {
            setShowShop(false);
            setShowJossyModal(true);
          }}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* 5. Markdown Handbook & Live Diary Modal */}
      {showMarkdown && (
        <MarkdownModal
          currentPetId={currentPetId}
          petName={currentPet.name}
          diary={gameState.diary}
          unlockedAchievements={currentPet.unlockedAchievements}
          coins={gameState.coins}
          onAddDiaryEntry={handleAddDiaryEntry}
          onClaimAchievement={handleClaimAchievement}
          onClose={() => setShowMarkdown(false)}
        />
      )}

      {/* 6. Welcome Back Offline Report Modal */}
      {welcomeReport && (
        <WelcomeBackModal report={welcomeReport} onClose={() => setWelcomeReport(null)} />
      )}

      {/* 7. Reset Game Confirmation Modal */}
      {showResetModal && (
        <ResetConfirmModal
          petName={currentPet.name}
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetModal(false)}
        />
      )}

      {/* 8. J0ssy Bot AI & Battery Modal */}
      {showJossyModal && (
        <JossyBotModal
          pet={currentPet}
          jossyState={gameState.jossyBot}
          onUpdateJossy={handleUpdateJossyState}
          onFeedPet={() => {
            // Find food in inventory or synthesize
            const availableFoods = INITIAL_FOODS.filter(
              (f) => (gameState.inventory[f.id] || 0) > 0,
            );
            if (availableFoods.length > 0) {
              handleFeedPet(availableFoods[0]);
            } else {
              // J0ssy robot synthesizes instant nourishment
              updateStateAndSave((prev) => {
                if (!prev.currentPetId) return prev;
                const pet = { ...prev.pets[prev.currentPetId] };
                pet.stats.hunger = Math.min(100, pet.stats.hunger + 30);
                pet.stats.happiness = Math.min(100, pet.stats.happiness + 20);
                return { ...prev, pets: { ...prev.pets, [prev.currentPetId]: pet } };
              });
              if (petSceneRef.current) {
                petSceneRef.current.dropFood('🍲');
              }
              soundFx.playSparkle();
              addXP(15);
              showToast(
                `J0ssy bot meracik nutrisi instan lezat untuk ${currentPet.name}! (+30% Kenyang)`,
                '🍲',
              );
            }
          }}
          onWashPet={handleWashPet}
          onClose={() => setShowJossyModal(false)}
        />
      )}

      {/* 9. Dance Emote & Stage Modal */}
      {showDanceModal && (
        <DanceModal
          coins={gameState.coins}
          ownedDances={gameState.ownedDances}
          petName={currentPet.name}
          onSelectDance={handleSelectDance}
          onBuyDance={handleBuyDance}
          onClose={() => setShowDanceModal(false)}
        />
      )}

      {/* 10. Admin 5-Question Quiz Modal */}
      {showAdminQuiz && (
        <AdminQuizModal
          onUnlockSuccess={handleUnlockAdminSuccess}
          onClose={() => setShowAdminQuiz(false)}
        />
      )}

      {/* 11. Admin Panel Control Center Modal */}
      {showAdminPanel && (
        <AdminPanelModal
          currentPetId={currentPetId}
          pets={gameState.pets}
          coins={gameState.coins}
          adminState={gameState.adminPanel}
          onUpdateAdminState={handleUpdateAdminState}
          onUpdatePetStats={handleUpdatePetStats}
          onSetCoins={handleSetCoins}
          onUnlockAllContent={handleUnlockAllContent}
          onResetAdminCheats={handleResetAdminCheats}
          onResetAdminModifications={handleResetAdminModifications}
          onResetGameFactory={handleConfirmReset}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}
