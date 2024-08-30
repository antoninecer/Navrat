class Ring {
  constructor(name, description, effects, allowedClasses, allowedRaces) {
    this.name = name;
    this.description = description;
    this.effects = effects; // Např. { strength: +2, luck: +5, regenMana: +3 }
    this.allowedClasses = allowedClasses; // Např. ['Warrior', 'Mage']
    this.allowedRaces = allowedRaces; // Např. ['Elf', 'Human']
  }
  canEquip(character) {
    return (
      (!this.allowedClasses || this.allowedClasses.includes(character.class)) &&
      (!this.allowedRaces || this.allowedRaces.includes(character.race))
    );
  }
  applyEffects(character) {
    if (this.canEquip(character)) {
      Object.keys(this.effects).forEach((effect) => {
        character[effect] += this.effects[effect];
      });
      console.log(`${this.name} equipped by ${character.name}.`);
    } else {
      console.log(`${character.name} cannot equip ${this.name}.`);
    }
  }
  removeEffects(character) {
    Object.keys(this.effects).forEach((effect) => {
      character[effect] -= this.effects[effect];
    });
    console.log(`${this.name} unequipped by ${character.name}.`);
  }
}
export default Ring;
