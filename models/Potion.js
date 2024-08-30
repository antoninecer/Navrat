class Potion {
  constructor(name, effects, duration) {
    this.name = name;
    this.effects = effects; // Objekt obsahující různé účinky, např. { health: +40, luck: +5, poison: -20 }
    this.duration = duration || 1800; // Trvání účinku v sekundách (např. 1800 sekund = 30 minut)
    this.startTime = null; // Čas, kdy byl lektvar použit
  }
  use(character) {
    this.startTime = Date.now();
    // Aplikace efektů na postavu
    for (const [key, value] of Object.entries(this.effects)) {
      character[key] += value;
    }
    console.log(`${character.name} used ${this.name}.`);
  }
  removeEffects(character) {
    // Odstranění efektů po vypršení trvání
    for (const [key, value] of Object.entries(this.effects)) {
      character[key] -= value;
    }
    console.log(`${this.name} effects have worn off for ${character.name}.`);
  }
  hasExpired() {
    // Kontrola, zda uplynul čas trvání lektvaru
    if (this.startTime) {
      const elapsedTime = (Date.now() - this.startTime) / 1000;
      return elapsedTime >= this.duration;
    }
    return false;
  }
}
export default Potion;
