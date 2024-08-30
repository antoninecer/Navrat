class Creature {
  constructor(
    name,
    type,
    level,
    health,
    attack,
    defense,
    speed,
    abilities,
    environment
  ) {
    this.name = name; // Název potvory, např. "Orc"
    this.type = type; // Typ, např. "Humanoid", "Beast", "Undead"
    this.level = level; // Úroveň potvory, která by měla odpovídat síle hráče
    this.health = health; // Zdraví potvory
    this.attack = attack; // Útočná síla
    this.defense = defense; // Obranná síla
    this.speed = speed; // Rychlost, může ovlivnit pořadí v boji
    this.abilities = abilities; // Pole speciálních schopností, např. ["Fireball", "Heal"]
    this.environment = environment; // Prostředí, kde se potvora vyskytuje, např. "Cave", "Forest"
  }
  // Metoda pro útok
  attackTarget(target) {
    const damage = Math.max(0, this.attack - target.defense);
    target.health -= damage;
    return `${this.name} attacks ${target.name} for ${damage} damage!`;
  }
  // Metoda pro zpracování poškození
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      return `${this.name} has been defeated!`;
    }
    return `${this.name} has ${this.health} health remaining.`;
  }
  // Metoda pro použití schopnosti
  useAbility(ability, target) {
    if (this.abilities.includes(ability)) {
      // Implementace účinku schopnosti
      // Například: zvýšení útoku, léčení, atd.
      return `${this.name} uses ${ability} on ${target.name}!`;
    }
    return `${this.name} does not have the ability ${ability}.`;
  }
}
