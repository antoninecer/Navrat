class Weapon {
  constructor(name, attack, weight, type, allowedClasses, allowedRaces) {
    this.name = name;
    this.attack = attack; // Bonus k útoku
    this.weight = weight; // Hmotnost zbraně
    this.type = type; // Např. "jednoruční" nebo "obouruční"
    this.allowedClasses = allowedClasses; // Povolání, která mohou zbraň používat
    this.allowedRaces = allowedRaces; // Rasy, které mohou zbraň používat
  }
  canEquip(character) {
    return (
      (!this.allowedClasses || this.allowedClasses.includes(character.class)) &&
      (!this.allowedRaces || this.allowedRaces.includes(character.race))
    );
  }
  applyEffects(character) {
    if (this.canEquip(character)) {
      character.attack += this.attack;
      console.log(`${this.name} equipped by ${character.name}.`);
    } else {
      console.log(`${character.name} cannot equip ${this.name}.`);
    }
  }
  removeEffects(character) {
    character.attack -= this.attack;
    console.log(`${this.name} unequipped by ${character.name}.`);
  }
}
export default Weapon;
