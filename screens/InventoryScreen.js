import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Character from "../models/Character"; // Importuje třídu Character

const InventoryScreen = ({ navigation }) => {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const storedCharacter = await AsyncStorage.getItem("activeCharacter");
        if (storedCharacter) {
          console.log("Stored character found:", storedCharacter);
          const parsedCharacter = JSON.parse(storedCharacter);
          const characterInstance = new Character(
            parsedCharacter.name,
            parsedCharacter.race,
            parsedCharacter.characterClass,
            parsedCharacter.gender,
            parsedCharacter.naturalTalents,
            parsedCharacter.abilities,
            parsedCharacter.inventory
          );
          characterInstance.equipment = parsedCharacter.equipment;
          characterInstance.stats = parsedCharacter.stats;
          characterInstance.level = parsedCharacter.level;
          characterInstance.gold = parsedCharacter.gold;
          characterInstance.mana = parsedCharacter.mana;
          characterInstance.health = parsedCharacter.health;
          characterInstance.healthRegen = parsedCharacter.healthRegen;
          characterInstance.manaRegen = parsedCharacter.manaRegen;
          characterInstance.carryCapacity = parsedCharacter.carryCapacity;
          characterInstance.armorAndWeaponCapacity =
            parsedCharacter.armorAndWeaponCapacity;

          console.log("Active character loaded:", characterInstance);
          setCharacter(characterInstance);
        } else {
          console.log(
            "No active character found. Initializing a new character."
          );
          // Případná inicializace nové postavy zde
          const newCharacter = new Character(
            "New Character",
            "Human",
            "Warrior",
            "Male"
          );
          await AsyncStorage.setItem(
            "activeCharacter",
            JSON.stringify(newCharacter)
          );
          setCharacter(newCharacter);
        }
      } catch (error) {
        console.error("Failed to load character", error);
      }
    };

    loadCharacter();
  }, []);

  const handleEquipItem = async (item) => {
    if (!character) return;

    const success = character.equipItem(item);

    if (success) {
      character.removeItemFromInventory(item); // Odstraní předmět z inventáře, pokud byl úspěšně nasazen
      await AsyncStorage.setItem("activeCharacter", JSON.stringify(character));
      setCharacter({ ...character }); // Aktualizace stavu pro rerender
      console.log("Character after equipping item:", character);
    } else {
      console.log("Failed to equip item:", item.name);
    }
  };

  const handleUnequipItem = async (slot) => {
    if (!character) return;

    const success = character.unequipItem(slot);

    if (success) {
      await AsyncStorage.setItem("activeCharacter", JSON.stringify(character));
      setCharacter({ ...character }); // Aktualizace stavu pro rerender
      console.log(`Item unequipped from ${slot} and added to inventory.`);
    } else {
      console.log(`Failed to unequip item from ${slot}.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {character ? (
          <>
            <Text style={styles.title}>Inventory of {character.name}</Text>
            <Text style={styles.sectionTitle}>Equipped Items:</Text>
            {Object.keys(character.equipment).map((slot) => (
              <View key={slot} style={styles.itemSlot}>
                <Text>
                  {slot}: {character.equipment[slot]?.name || "None"}
                </Text>
                {character.equipment[slot] && (
                  <Button
                    title="Unequip"
                    onPress={() => handleUnequipItem(slot)}
                  />
                )}
              </View>
            ))}
            <Text style={styles.sectionTitle}>Inventory:</Text>
            {character.inventory.length > 0 ? (
              character.inventory.map((item, index) => (
                <View key={index.toString()} style={styles.inventoryItem}>
                  <Text>{item.name}</Text>
                  <Button title="Equip" onPress={() => handleEquipItem(item)} />
                </View>
              ))
            ) : (
              <Text>No items in inventory.</Text>
            )}
            <Button
              title="View Book"
              onPress={() => {
                // Odkaz na zobrazení knihy (můžete přidat navigaci na BookScreen)
                navigation.navigate("BookScreen");
              }}
            />
          </>
        ) : (
          <Text>Loading character...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  itemSlot: {
    marginBottom: 20,
  },
  inventoryItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});

export default InventoryScreen;
