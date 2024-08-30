export const standardWeapons = [
  {
    name: "Short Sword",
    properties: {
      attackPoints: 3,
      defensePoints: 1,
      weight: 2,
    },
    slot: "hand",
  },
  {
    name: "Long Sword",
    properties: {
      attackPoints: 5,
      defensePoints: 2,
      weight: 4,
    },
    slot: "hand",
  },
  {
    name: "Rapier",
    properties: {
      attackPoints: 4,
      defensePoints: 1,
      weight: 3,
    },
    slot: "hand",
  },
  {
    name: "Battle Axe",
    properties: {
      attackPoints: 6,
      defensePoints: 2,
      weight: 5,
    },
    slot: "hand",
  },
  {
    name: "War Hammer",
    properties: {
      attackPoints: 7,
      defensePoints: 3,
      weight: 6,
    },
    slot: "hand",
  },
];

export const standardArmor = [
  {
    name: "Leather Armor",
    properties: {
      defensePoints: 2,
      weight: 5,
    },
    slot: "body",
  },
  {
    name: "Chainmail Armor",
    properties: {
      defensePoints: 4,
      weight: 10,
    },
    slot: "body",
  },
  {
    name: "Plate Armor",
    properties: {
      defensePoints: 6,
      weight: 15,
    },
    slot: "body",
  },
  {
    name: "Shield",
    properties: {
      defensePoints: 2,
      weight: 4,
    },
    slot: "hand",
  },
  {
    name: "Iron Helmet",
    properties: {
      defensePoints: 3,
      weight: 3,
    },
    slot: "head",
  },
  {
    name: "Iron Leggings",
    properties: {
      defensePoints: 4,
      weight: 6,
    },
    slot: "legs",
  },
  {
    name: "Leather Boots",
    properties: {
      defensePoints: 1,
      weight: 2,
    },
    slot: "feet",
  },
];

export const standardAccessories = [
  {
    name: "Ring of Strength",
    properties: {
      strength: 2,
      weight: 0.1,
    },
    slot: "finger",
  },
  {
    name: "Ring of Agility",
    properties: {
      agility: 2,
      weight: 0.1,
    },
    slot: "finger",
  },

  {
    name: "Amulet of Protection",
    properties: {
      defensePoints: 3,
      weight: 0.2,
    },
    slot: "neck",
  },
  {
    name: "Ring of Speed",
    properties: {
      speed: 2,
      weight: 0.1,
    },
    slot: "finger",
  },
];

export const standardPotions = [
  {
    name: "Potion of Healing",
    properties: {
      healingPoints: 20,
      weight: 0.5,
    },
    slot: "consumable",
  },
  {
    name: "Potion of Strength",
    properties: {
      strength: 3,
      weight: 0.5,
    },
    slot: "consumable",
  },
];

export const standardScrolls = [
  {
    name: "Scroll of Fireball",
    properties: {
      magicDamage: 15,
      weight: 0.3,
    },
    slot: "consumable",
  },
  {
    name: "Scroll of Healing",
    properties: {
      healingPoints: 20,
      weight: 0.3,
    },
    slot: "consumable",
  },
];

export const specialObjects = [
  {
    name: "Dungeon Entrance",
    properties: {
      type: "dungeon",
      weight: 0,
    },
    slot: "special",
  },
  {
    name: "Engraving",
    properties: {
      type: "inscription",
      weight: 0,
    },
    slot: "special",
  },
];
