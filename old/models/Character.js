import Races from "../data/Races";
class Character {
  constructor(
    name,
    race,
    characterClass,
    naturalTalents = [],
    abilities = [],
    inventory = []
  ) {
    this.name = name;
    this.race = race; // Instance Race
    this.characterClass = characterClass; // Instance Class
    this.naturalTalents = naturalTalents; // Vrozené schopnosti (Array of Talent instances)
    this.abilities = abilities; // Získané schopnosti (Array of Ability instances)
    this.inventory = inventory; // Array of InventoryItem instances
    this.rings = []; // Maximum 10 prstenů
    this.level = 1;
    this.gold = 0;
    this.mana = 50;
    this.health = 100; // Zdraví
    this.healthRegen = 1; // Rychlost regenerace zdraví
    this.manaRegen = 1; // Rychlost regenerace many
    this.carryCapacity = 100; // Nosnost postavy, např. 100 jednotek
    this.equippedWeapon = null; // Aktuálně vybavená zbraň
    this.equippedArmor = null; // Aktuálně vybavené brnění
    this.activePotions = []; // Aktuálně aktivní lektvary
    // Výpočet atributů postavy na základě rasy a povolání
    const baseAttributes = this.calculateAttributes(race, characterClass);
    this.strength = baseAttributes.strength;
    this.defense = baseAttributes.defense;
    this.attack = baseAttributes.attack;
    this.speed = baseAttributes.speed;
    this.luck = baseAttributes.luck;
    this.courage = baseAttributes.courage;
    this.magic = baseAttributes.magic || 0;
  }
  // Výpočet atributů postavy na základě rasy a povolání
  calculateAttributes(race, characterClass) {
    const baseAttributes = { ...Races[race.name] };
    const classModifiers = this.getClassModifiers(characterClass);
    return {
      strength: baseAttributes.strength + classModifiers.strength,
      defense: baseAttributes.defense + classModifiers.defense,
      attack: baseAttributes.attack + classModifiers.attack,
      speed: baseAttributes.speed + classModifiers.speed,
      luck: baseAttributes.luck + classModifiers.luck,
      courage: baseAttributes.courage + classModifiers.courage,
      magic: (baseAttributes.magic || 0) + classModifiers.magic,
    };
  }
  // Získání modifikátorů povolání
  getClassModifiers(characterClass) {
    const modifiers = {
      Warrior: { strength: 5, defense: 3, attack: 3, speed: -2, magic: -3 },
      Mage: { strength: -3, defense: -2, attack: 1, speed: 0, magic: 7 },
      Rogue: { strength: 0, defense: 0, attack: 2, speed: 5, magic: 0 },
    };
    return modifiers[characterClass] || {};
  }
  // Hod D20 kostkou
  rollD20() {
    return Math.floor(Math.random() * 20) + 1;
  }
  // Hod s modifikátorem
  rollD20WithModifier(modifier = 0) {
    return this.rollD20() + modifier;
  }
  // Útokový hod
  attack(enemy) {
    const attackRoll = this.rollD20WithModifier(this.attack);
    const hit = attackRoll >= enemy.defense;
    if (hit) {
      const damage = this.rollDamage(2, 6); // Např. meč s poškozením 2x D6
      enemy.takeDamage(damage);
      return `Útok úspěšný! ${this.name} způsobil ${damage} poškození.`;
    } else {
      return `Útok neúspěšný. ${this.name} nezasáhl ${enemy.name}.`;
    }
  }
  // Poškození
  rollDamage(diceCount, diceType, damageBonus = 0) {
    let totalDamage = 0;
    for (let i = 0; i < diceCount; i++) {
      totalDamage += Math.floor(Math.random() * diceType) + 1;
    }
    return totalDamage + damageBonus;
  }
  // Zpracování poškození
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      console.log(`${this.name} byl poražen.`);
    } else {
      console.log(`${this.name} má nyní ${this.health} zdraví.`);
    }
  }
  // Záchranný hod
  savingThrow(abilityModifier, saveDC) {
    const roll = this.rollD20WithModifier(abilityModifier);
    const success = roll >= saveDC;
    return success
      ? `Záchranný hod úspěšný! Hodil ${roll}.`
      : `Záchranný hod neúspěšný. Hodil ${roll}.`;
  }
  // Kontrola schopnosti
  abilityCheck(abilityModifier, difficultyClass) {
    const roll = this.rollD20WithModifier(abilityModifier);
    const success = roll >= difficultyClass;
    return success
      ? `Kontrola schopnosti úspěšná! Hodil ${roll}.`
      : `Kontrola schopnosti neúspěšná. Hodil ${roll}.`;
  }
  addAbility(ability) {
    if (!this.abilities.includes(ability)) {
      this.abilities.push(ability);
      console.log(`${this.name} získal novou schopnost: ${ability}.`);
    }
  }
  learnAbility(ability) {
    this.addAbility(ability);
  }
  receiveCertificate(skill, masterName) {
    this.learnAbility(`${skill} Certified by ${masterName}`);
    console.log(`${this.name} obdržel certifikát v ${skill} od ${masterName}.`);
  }
  useNaturalTalent(talent) {
    if (this.naturalTalents.includes(talent)) {
      console.log(`${this.name} využívá svůj talent: ${talent}.`);
      // Implementace specifického účinku talentu
    } else {
      console.log(`${this.name} nemá talent na ${talent}.`);
    }
  }
  addItemToInventory(item) {
    const currentLoad = this.calculateCurrentLoad();
    if (currentLoad + item.weight <= this.carryCapacity) {
      this.inventory.push(item);
      console.log(`${item.name} added to inventory.`);
    } else {
      console.log(`${item.name} is too heavy to carry!`);
      Alert.alert("Error", `${item.name} je příliš těžké na nošení!`);
    }
  }
  calculateCurrentLoad() {
    return this.inventory.reduce(
      (total, item) => total + (item.weight || 0),
      0
    );
  }
  addRing(ring) {
    if (this.rings.length < 10) {
      ring.applyEffects(this);
      this.rings.push(ring);
    } else {
      console.log(`${this.name} cannot equip more than 10 rings.`);
      Alert.alert("Error", "Nemůžeš vybavit více než 10 prstenů!");
    }
  }
  removeRing(ring) {
    ring.removeEffects(this);
    this.rings = this.rings.filter((r) => r !== ring);
  }
  equipWeapon(weapon) {
    if (this.equippedWeapon) {
      this.equippedWeapon.removeEffects(this);
    }
    weapon.applyEffects(this);
    this.equippedWeapon = weapon;
  }
  unequipWeapon() {
    if (this.equippedWeapon) {
      this.equippedWeapon.removeEffects(this);
      this.equippedWeapon = null;
    }
  }
  equipArmor(armor) {
    if (this.equippedArmor) {
      this.equippedArmor.removeEffects(this);
    }
    armor.applyEffects(this);
    this.equippedArmor = armor;
  }
  unequipArmor() {
    if (this.equippedArmor) {
      this.equippedArmor.removeEffects(this);
      this.equippedArmor = null;
    }
  }
  usePotion(potion) {
    potion.use(this);
    this.activePotions.push(potion);
  }
  update(timeIncrement) {
    // Aktualizace zdraví a many na základě regenerace a uplynulého času
    this.health += (this.healthRegen * timeIncrement) / 60;
    this.mana += (this.manaRegen * timeIncrement) / 60;
    // Kontrola účinků lektvarů
    this.activePotions = this.activePotions.filter((potion) => {
      if (potion.hasExpired()) {
        potion.removeEffects(this);
        return false; // Lektvar se odstraní z aktivních po vypršení účinku
      }
      return true;
    });
  }
  autoUsePotions() {
    const healthPotions = this.inventory.filter(
      (item) => item instanceof Potion && item.effects.health > 0
    );
    if (this.health <= 40 && healthPotions.length > 0) {
      this.usePotion(healthPotions[0]);
      this.inventory = this.inventory.filter(
        (item) => item !== healthPotions[0]
      );
    }
  }
  attackEnemy(enemy) {
    this.autoUsePotions(); // Automatické použití lektvaru
    const attackResult = this.attack(enemy);
    this.update(5); // Předpokládaný čas v minutách na útok, např. 5 minut
    return attackResult;
  }
  getCharacterSummary() {
    return `
      Name: ${this.name}
      Race: ${this.race.name}
      Class: ${this.characterClass.name}
      Level: ${this.level}
      Strength: ${this.strength}
      Defense: ${this.defense}
      Attack: ${this.attack}
      Speed: ${this.speed}
      Luck: ${this.luck}
      Courage: ${this.courage}
      Gold: ${this.gold}
      Mana: ${this.mana}
      Health: ${this.health}
      Health Regeneration: ${this.healthRegen}
      Mana Regeneration: ${this.manaRegen}
      Carry Capacity: ${this.carryCapacity}
      Current Load: ${this.calculateCurrentLoad()}
      Natural Talents: ${this.naturalTalents.join(", ")}
      Abilities: ${this.abilities.map((a) => a.name).join(", ")}
      Inventory: ${this.inventory.map((i) => i.name).join(", ")}
      Rings: ${this.rings.map((r) => r.name).join(", ")}
      Equipped Weapon: ${
        this.equippedWeapon ? this.equippedWeapon.name : "None"
      }
      Equipped Armor: ${this.equippedArmor ? this.equippedArmor.name : "None"}
    `;
  }
}
export default Character;
