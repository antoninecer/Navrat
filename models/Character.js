import { Races } from "../data/Races"; // Opravený import ras
import CharacterClasses from "../data/CharacterClasses"; // Import tříd postav
import CharacterAttributes from "../data/CharacterAttributes"; // Import modifikátorů atributů podle pohlaví

class Character {
  constructor(
    name,
    race,
    characterClass,
    gender,
    naturalTalents = [],
    abilities = [],
    inventory = []
  ) {
    this.name = name;
    this.race = race;
    this.gender = gender;
    this.characterClass = characterClass;
    this.naturalTalents = naturalTalents;
    this.abilities = abilities;
    this.inventory = inventory;
    this.level = 1;
    this.gold = 0;
    this.mana = 50;
    this.health = 100;
    this.healthRegen = 1;
    this.manaRegen = 1;
    this.attack = 2; // Nastavení výchozí hodnoty pro útok
    this.defense = 2; // Nastavení výchozí hodnoty pro obranu

    // Nosnost a váhové limity
    this.carryCapacity = 20;
    this.armorAndWeaponCapacity = 30;

    // Sloty pro vybavení včetně prstů
    this.equipment = {
      helmet: null,
      chest: null,
      legs: null,
      boots: null,
      gloves: null,
      weapon: null,
      shield: null,
      fingers: {
        left: [null, null, null, null, null], // 5 prstů na levé ruce
        right: [null, null, null, null, null], // 5 prstů na pravé ruce
      },
    };

    // Výchozí hodnoty statistik
    this.stats = {
      attack: this.attack,
      defense: this.defense,
    };

    const baseAttributes = this.calculateAttributes(
      race,
      characterClass,
      gender
    );
    this.strength = baseAttributes.strength;
    this.defense = baseAttributes.defense || this.defense;
    this.attack = baseAttributes.attack || this.attack;
    this.speed = baseAttributes.speed;
    this.luck = baseAttributes.luck;
    this.courage = baseAttributes.courage;
    this.magic = baseAttributes.magic || 0;
  }

  // Metoda pro výpočet atributů na základě rasy, povolání a pohlaví
  calculateAttributes(race, characterClass, gender) {
    const baseAttributes = Races[race] || {};
    const classModifiers = CharacterClasses[characterClass] || {};
    const genderModifiers = CharacterAttributes.genderModifiers[gender] || {};

    return {
      strength:
        (baseAttributes.strength || 0) +
        (classModifiers.strength || 0) +
        (genderModifiers.strength || 0),
      defense:
        (baseAttributes.defense || 0) +
        (classModifiers.defense || 0) +
        (genderModifiers.defense || 0),
      attack:
        (baseAttributes.attack || 0) +
        (classModifiers.attack || 0) +
        (genderModifiers.attack || 0),
      speed:
        (baseAttributes.speed || 0) +
        (classModifiers.speed || 0) +
        (genderModifiers.speed || 0),
      luck:
        (baseAttributes.luck || 0) +
        (classModifiers.luck || 0) +
        (genderModifiers.luck || 0),
      courage:
        (baseAttributes.courage || 0) +
        (classModifiers.courage || 0) +
        (genderModifiers.courage || 0),
      magic:
        (baseAttributes.magic || 0) +
        (classModifiers.magic || 0) +
        (genderModifiers.magic || 0),
    };
  }

  // Přidání prstenu (kontrola na max 10 prstenů)
  addRing(ring) {
    const leftHandRings = this.equipment.fingers.left.filter(
      (r) => r !== null
    ).length;
    const rightHandRings = this.equipment.fingers.right.filter(
      (r) => r !== null
    ).length;

    if (leftHandRings < 5) {
      this.equipment.fingers.left[leftHandRings] = ring;
      ring.applyEffects(this);
      console.log(
        `${ring.name} was equipped on the left hand, finger ${
          leftHandRings + 1
        }.`
      );
      return true; // Prsten byl úspěšně nasazen
    } else if (rightHandRings < 5) {
      this.equipment.fingers.right[rightHandRings] = ring;
      ring.applyEffects(this);
      console.log(
        `${ring.name} was equipped on the right hand, finger ${
          rightHandRings + 1
        }.`
      );
      return true; // Prsten byl úspěšně nasazen
    } else {
      console.log(`${this.name} cannot equip more than 10 rings.`);
      return false; // Prsten se nepodařilo nasadit, vrátíme false
    }
  }

  // Sundání prstenu a přesunutí do inventáře
  removeRingByChoice(ring) {
    for (let hand of ["left", "right"]) {
      const fingerIndex = this.equipment.fingers[hand].indexOf(ring);
      if (fingerIndex !== -1) {
        this.equipment.fingers[hand][fingerIndex] = null;
        ring.removeEffects(this);
        console.log(
          `${ring.name} was unequipped from ${hand} hand, finger ${
            fingerIndex + 1
          }.`
        );

        // Přesun prstenu do inventáře
        this.addItemToInventory(ring);

        // Přepočítání statistik po sundání prstenu
        this.updateCharacterStats();

        return true;
      }
    }
    console.log(`Ring ${ring.name} not found on any hand.`);
    return false;
  }

  // Nasazení předmětu (univerzální)
  equipItem(item) {
    if (!item || !item.slot) {
      console.log("Cannot equip this item:", item);
      return false;
    }

    if (item.type === "weapon") {
      this.equipment.weapon = item;
    } else if (item.type === "armor") {
      this.equipment[item.slot] = item;
    } else if (item.type === "ring") {
      return this.addRing(item);
    } else {
      console.log("Invalid item type:", item.type);
      return false;
    }

    item.applyEffects(this);
    console.log(`${item.name} was equipped in the ${item.slot} slot.`);
    this.updateCharacterStats();
    return true;
  }

  // Sundání vybavení a přesunutí do inventáře
  unequipItemByChoice(item) {
    for (let slot in this.equipment) {
      if (this.equipment[slot] === item) {
        if (typeof item.removeEffects === "function") {
          item.removeEffects(this);
        } else {
          console.log(`Item ${item.name} does not have removeEffects method.`);
        }

        this.equipment[slot] = null;
        console.log(`${item.name} was unequipped from the ${slot} slot.`);

        // Přesun předmětu do inventáře
        this.addItemToInventory(item);

        // Přepočítání statistik po sundání předmětu
        this.updateCharacterStats();

        return true;
      }
    }
    console.log(`Item ${item.name} not found in any slot.`);
    return false;
  }

  // Přidání předmětu do inventáře
  addItemToInventory(item) {
    this.inventory.push(item);
    console.log(`${item.name} added to inventory.`);
  }

  // Výpočet aktuální zátěže pro zbroj a zbraně
  calculateArmorAndWeaponLoad() {
    return Object.values(this.equipment).reduce(
      (total, item) => total + (item?.weight || 0),
      0
    );
  }

  // Výpočet aktuální zátěže pro mošnu
  calculateInventoryLoad() {
    return this.inventory.reduce(
      (total, item) => total + (item.weight || 0),
      0
    );
  }

  // Přepočítání statistik postavy
  updateCharacterStats() {
    let attack = 0;
    let defense = 0;

    // Projdi všechny vybavené předměty a aktualizuj statistiky
    for (let slot in this.equipment) {
      const equippedItem = this.equipment[slot];
      if (equippedItem && slot !== "fingers") {
        attack += equippedItem.properties.attackPoints || 0;
        defense += equippedItem.properties.defensePoints || 0;
      }
    }

    ["left", "right"].forEach((hand) => {
      this.equipment.fingers[hand].forEach((ring) => {
        if (ring) {
          attack += ring.properties.attackPoints || 0;
          defense += ring.properties.defensePoints || 0;
        }
      });
    });

    this.stats.attack = attack;
    this.stats.defense = defense;

    console.log("Updated stats:", this.stats);
  }

  calculatePower() {
    return this.strength + this.defense + this.attack + this.speed;
  }
}

export default Character;
