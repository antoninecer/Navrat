class Battle {
  constructor(player, party, enemies) {
    this.player = player; // Hlavní postava hráče
    this.party = party; // Array of hired characters (najmuté postavy)
    this.enemies = enemies; // Array of enemies (pole nepřátel)
  }
  // Zahájení souboje
  startBattle() {
    console.log("Souboj začíná!");
    while (this.player.health > 0 && this.enemies.length > 0) {
      this.takeTurn();
    }
    this.endBattle();
  }
  // Zpracování jednoho kola
  takeTurn() {
    // Nepřátelé útočí na party nebo hráče
    for (const enemy of this.enemies) {
      let target = this.getNextTarget();
      console.log(`${enemy.name} útočí na ${target.name}`);
      const attackResult = enemy.attack(target);
      console.log(attackResult);
      if (target.health <= 0) {
        console.log(`${target.name} byl poražen!`);
        this.removeDeadCharacter(target);
      }
    }
    // Hráč a jeho party útočí na nepřátele
    if (this.player.health > 0) {
      const playerTarget = this.enemies[0]; // Hráč útočí na prvního nepřítele
      console.log(`${this.player.name} útočí na ${playerTarget.name}`);
      const playerAttackResult = this.player.attack(playerTarget);
      console.log(playerAttackResult);
      if (playerTarget.health <= 0) {
        console.log(`${playerTarget.name} byl poražen!`);
        this.enemies.shift(); // Odstranění poraženého nepřítele z pole
      }
    }
  }
  // Určení dalšího cíle (priorita: party > hráč)
  getNextTarget() {
    if (this.party.length > 0) {
      return this.party[0]; // Najmutá postava jako první cíl
    }
    return this.player; // Pokud nejsou najmuté postavy, útok na hlavního hráče
  }
  // Odstranění poražené postavy nebo najmuté postavy
  removeDeadCharacter(character) {
    if (character === this.player) {
      console.log("Hráč byl poražen. Konec hry.");
    } else {
      this.party = this.party.filter((member) => member !== character);
      console.log(`Postava ${character.name} byla odstraněna z party.`);
    }
  }
  // Ukončení souboje
  endBattle() {
    if (this.player.health > 0) {
      console.log("Hráč vyhrál souboj!");
    } else {
      console.log("Hráč prohrál souboj.");
    }
    if (this.enemies.length === 0) {
      console.log("Všichni nepřátelé byli poraženi!");
    }
  }
}
export default Battle;
