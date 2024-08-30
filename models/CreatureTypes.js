const CreatureTypes = {
  Weak: {
    Goblin: {
      name: "Goblin",
      type: "Humanoid",
      baseLevel: 2,
      baseHealth: 50,
      baseAttack: 10,
      baseDefense: 5,
      baseSpeed: 9,
      abilities: ["Stealth", "Backstab"],
      environments: ["Cave", "Forest"],
    },
    Skeleton: {
      name: "Skeleton",
      type: "Undead",
      baseLevel: 2,
      baseHealth: 40,
      baseAttack: 8,
      baseDefense: 4,
      baseSpeed: 6,
      abilities: ["Fear", "Bone Armor"],
      environments: ["Crypt", "Cave"],
    },
    Kobold: {
      name: "Kobold",
      type: "Humanoid",
      baseLevel: 2,
      baseHealth: 45,
      baseAttack: 9,
      baseDefense: 4,
      baseSpeed: 8,
      abilities: ["Trap Setting", "Dark Vision"],
      environments: ["Cave", "Forest"],
    },
    Wolf: {
      name: "Wolf",
      type: "Beast",
      baseLevel: 3,
      baseHealth: 60,
      baseAttack: 12,
      baseDefense: 6,
      baseSpeed: 10,
      abilities: ["Pack Tactics", "Bite"],
      environments: ["Forest", "Mountain"],
    },
  },
  Medium: {
    Orc: {
      name: "Orc",
      type: "Humanoid",
      baseLevel: 5,
      baseHealth: 120,
      baseAttack: 18,
      baseDefense: 12,
      baseSpeed: 8,
      abilities: ["Berserk", "Roar"],
      environments: ["Cave", "Forest"],
    },
    Troll: {
      name: "Troll",
      type: "Giant",
      baseLevel: 6,
      baseHealth: 180,
      baseAttack: 20,
      baseDefense: 15,
      baseSpeed: 7,
      abilities: ["Regeneration", "Smash"],
      environments: ["Swamp", "Forest"],
    },
    Zombie: {
      name: "Zombie",
      type: "Undead",
      baseLevel: 4,
      baseHealth: 80,
      baseAttack: 14,
      baseDefense: 10,
      baseSpeed: 4,
      abilities: ["Undead Fortitude", "Bite"],
      environments: ["Crypt", "Graveyard"],
    },
    Hobgoblin: {
      name: "Hobgoblin",
      type: "Humanoid",
      baseLevel: 5,
      baseHealth: 110,
      baseAttack: 16,
      baseDefense: 10,
      baseSpeed: 7,
      abilities: ["Tactical Leader", "Martial Advantage"],
      environments: ["Cave", "Fortress"],
    },
  },
  Strong: {
    YoungDragon: {
      name: "Young Dragon",
      type: "Dragon",
      baseLevel: 10,
      baseHealth: 300,
      baseAttack: 25,
      baseDefense: 20,
      baseSpeed: 10,
      abilities: ["Fire Breath", "Flight"],
      environments: ["Mountain", "Cave"],
    },
    Demon: {
      name: "Demon",
      type: "Fiend",
      baseLevel: 9,
      baseHealth: 250,
      baseAttack: 30,
      baseDefense: 18,
      baseSpeed: 9,
      abilities: ["Hellfire", "Teleport"],
      environments: ["Hellscape", "Ruin"],
    },
    Lich: {
      name: "Lich",
      type: "Undead",
      baseLevel: 12,
      baseHealth: 200,
      baseAttack: 22,
      baseDefense: 15,
      baseSpeed: 8,
      abilities: ["Necromancy", "Undying Magic"],
      environments: ["Crypt", "Tower"],
    },
    Behemoth: {
      name: "Behemoth",
      type: "Beast",
      baseLevel: 11,
      baseHealth: 350,
      baseAttack: 28,
      baseDefense: 25,
      baseSpeed: 6,
      abilities: ["Earthquake", "Stomp"],
      environments: ["Mountain", "Plain"],
    },
  },
  Boss: {
    ElderDragon: {
      name: "Elder Dragon",
      type: "Dragon",
      baseLevel: 15,
      baseHealth: 500,
      baseAttack: 35,
      baseDefense: 30,
      baseSpeed: 12,
      abilities: ["Fire Breath", "Flight", "Ancient Wisdom"],
      environments: ["Mountain", "Cave"],
    },
    Beholder: {
      name: "Beholder",
      type: "Aberration",
      baseLevel: 14,
      baseHealth: 400,
      baseAttack: 20,
      baseDefense: 18,
      baseSpeed: 8,
      abilities: ["Anti-Magic Cone", "Eye Rays"],
      environments: ["Underdark", "Cave"],
    },
    Balrog: {
      name: "Balrog",
      type: "Fiend",
      baseLevel: 15,
      baseHealth: 450,
      baseAttack: 40,
      baseDefense: 28,
      baseSpeed: 10,
      abilities: ["Flaming Whip", "Shadow and Flame"],
      environments: ["Cave", "Ruin"],
    },
    UndeadCommander: {
      name: "Undead Commander",
      type: "Undead",
      baseLevel: 13,
      baseHealth: 380,
      baseAttack: 30,
      baseDefense: 20,
      baseSpeed: 7,
      abilities: ["Necromancy", "Command Undead"],
      environments: ["Crypt", "Graveyard"],
    },
  },
};
