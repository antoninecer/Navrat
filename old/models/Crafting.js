class Crafting {
  constructor(skillLevel, resources) {
    this.skillLevel = skillLevel; // Úroveň dovednosti v daném řemesle
    this.resources = resources; // Suroviny dostupné pro výrobu
  }
  craftWeapon(character, weaponBlueprint) {
    // Kontrola, zda postava má dostatečnou úroveň dovednosti
    if (this.skillLevel < weaponBlueprint.requiredSkillLevel) {
      console.log(
        `${character.name} nemá dostatečnou úroveň k výrobě této zbraně.`
      );
      return null;
    }
    // Kontrola, zda jsou dostupné suroviny
    for (const [resource, amount] of Object.entries(
      weaponBlueprint.requiredResources
    )) {
      if (!this.resources[resource] || this.resources[resource] < amount) {
        console.log(
          `Nedostatečné množství ${resource} pro výrobu ${weaponBlueprint.name}.`
        );
        return null;
      }
    }
    // Odebrání použitých surovin
    for (const [resource, amount] of Object.entries(
      weaponBlueprint.requiredResources
    )) {
      this.resources[resource] -= amount;
    }
    // Vytvoření nové zbraně
    const craftedWeapon = new Weapon(
      weaponBlueprint.name,
      weaponBlueprint.attack + this.skillLevel, // Útok zvýšený podle úrovně dovednosti
      weaponBlueprint.weight,
      weaponBlueprint.type,
      weaponBlueprint.allowedClasses,
      weaponBlueprint.allowedRaces
    );
    // Přidání magických efektů, pokud je specifikováno
    if (weaponBlueprint.magicEffects) {
      craftedWeapon.magicEffects = weaponBlueprint.magicEffects;
    }
    console.log(`${character.name} vytvořil ${craftedWeapon.name}.`);
    return craftedWeapon;
  }
}
export default Crafting;
