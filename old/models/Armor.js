class Armor {
  constructor(name, defense, weight, allowedClasses, allowedRaces) {
    this.name = name;
    this.defense = defense; // Bonus k obraně
    this.weight = weight; // Hmotnost brnění
    this.allowedClasses = allowedClasses; // Povolání, která mohou brnění používat
    this.allowedRaces = allowedRaces; // Rasy, které mohou brnění používat
  }
  canEquip(character) {
    return (
      (!this.allowedClasses || this.allowedClasses.includes(character.class)) &&
      (!this.allowedRaces || this.allowedRaces.includes(character.race))
    );
  }
  applyEffects(character) {
    if (this.canEquip(character)) {
      character.defense += this.defense;
      console.log(`${this.name} equipped by ${character.name}.`);
    } else {
      console.log(`${character.name} cannot equip ${this.name}.`);
    }
  }
  removeEffects(character) {
    character.defense -= this.defense;
    console.log(`${this.name} unequipped by ${character.name}.`);
  }
}
export default Armor;
