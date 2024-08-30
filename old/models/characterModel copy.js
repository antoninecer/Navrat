// components/characterModel.js
import AsyncStorage from "@react-native-async-storage/async-storage";
export const createCharacter = async (character) => {
  try {
    await AsyncStorage.setItem("character", JSON.stringify(character));
    console.log("Character created:", character);
  } catch (error) {
    console.error("Failed to create character:", error);
  }
};
export const getCharacter = async () => {
  try {
    const character = await AsyncStorage.getItem("character");
    return character ? JSON.parse(character) : null;
  } catch (error) {
    console.error("Failed to get character:", error);
    return null;
  }
};
// Example of a character model
export const defaultCharacter = {
  name: "Unnamed",
  race: "Human",
  class: "Warrior",
  level: 1,
  strength: 10,
  health: 100,
  mana: 50,
  armor: 5,
};
