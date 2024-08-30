import { getCharacter } from "../models/characterModel";
import CharacterInventory from "../models/CharacterInventory";
export const equipItem = async (item) => {
  const character = await getCharacter();
  if (!character) {
    console.error("Character is undefined or null.");
    return;
  }
  // Inicializace inventáře, pokud neexistuje
  if (!character.inventory) {
    console.warn("Inventory is undefined, initializing default inventory.");
    character.inventory = new CharacterInventory();
  } else {
    character.inventory = CharacterInventory.fromObject(character.inventory);
  }
  character.inventory.equipItem(item);
  updateCharacterStats(character);
  await AsyncStorage.setItem("activeCharacter", JSON.stringify(character));
};
const updateCharacterStats = (character) => {
  let attack = 0;
  let defense = 0;
  if (character.inventory.hands[0]) {
    attack += character.inventory.hands[0].properties.attackPoints || 0;
  }
  if (character.inventory.hands[1]) {
    attack += character.inventory.hands[1].properties.attackPoints || 0;
  }
  if (character.inventory.body) {
    defense += character.inventory.body.properties.defensePoints || 0;
  }
  if (character.inventory.head) {
    defense += character.inventory.head.properties.defensePoints || 0;
  }
  if (character.inventory.neck) {
    defense += character.inventory.neck.properties.defensePoints || 0;
  }
  if (character.inventory.legs) {
    defense += character.inventory.legs.properties.defensePoints || 0;
  }
  if (character.inventory.feet) {
    defense += character.inventory.feet.properties.defensePoints || 0;
  }
  character.stats.attack = attack;
  character.stats.defense = defense;
};
