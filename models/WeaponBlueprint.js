const WeaponBlueprints = {
  enchantedSword: {
    name: "Enchanted Sword",
    requiredSkillLevel: 5, // Potřebná úroveň dovednosti
    requiredResources: {
      iron: 10,
      magicGem: 2,
    },
    attack: 20,
    weight: 15,
    type: "jednoruční",
    allowedClasses: ["Warrior", "Paladin"],
    allowedRaces: ["Human", "Elf"],
    magicEffects: {
      fireDamage: 10, // Přidání magického ohnivého poškození
      durability: 100, // Trvanlivost zbraně
    },
  },
};
export default WeaponBlueprints;
