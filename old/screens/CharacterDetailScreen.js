import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
export default function CharacterDetailScreen({ route }) {
  const { character } = route.params;
  const [inventory, setInventory] = useState(
    initializeInventory(character.inventory)
  );
  function initializeInventory(inventory = {}) {
    return {
      head: inventory.head || null,
      neck: inventory.neck || null,
      body: inventory.body || null,
      hands: inventory.hands || [null, null],
      legs: inventory.legs || null,
      feet: inventory.feet || null,
      fingers: inventory.fingers || Array(10).fill(null),
      items: inventory.items || [],
    };
  }
  const handleUnequipItem = (slot, index = null) => {
    const updatedInventory = { ...inventory };
    if (index !== null) {
      updatedInventory[slot][index] = null;
    } else {
      updatedInventory[slot] = null;
    }
    setInventory(updatedInventory);
    Alert.alert("Item removed", `The item from ${slot} was unequipped.`);
  };
  const handleEquipItem = (item, slot, index = null) => {
    if (!slot) {
      Alert.alert("Cannot Equip", "This item cannot be equipped to any slot.");
      return;
    }
    const updatedInventory = { ...inventory };
    if (index !== null) {
      updatedInventory[slot][index] = item;
    } else {
      updatedInventory[slot] = item;
    }
    setInventory(updatedInventory);
    Alert.alert("Item equipped", `${item.name} was equipped to ${slot}.`);
  };
  const renderEquippedItem = (slot, label, index = null) => {
    const item = index !== null ? inventory[slot][index] : inventory[slot];
    return (
      <View style={styles.itemSlot}>
        <Text style={styles.itemSlotText}>
          {label}: {item ? item.name : "None"}
        </Text>
        {item && (
          <Button
            title="Remove"
            onPress={() => handleUnequipItem(slot, index)}
          />
        )}
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{character.name}</Text>
        <Text>Race: {character.race}</Text>
        <Text>Class: {character.characterClass}</Text>
        <Text>Level: {character.level}</Text>
        <Text>Health: {character.health}</Text>
        <Text>Mana: {character.mana}</Text>
        <Text style={styles.sectionTitle}>Equipped Items:</Text>
        {renderEquippedItem("head", "Head")}
        {renderEquippedItem("neck", "Neck")}
        {renderEquippedItem("body", "Body")}
        {renderEquippedItem("hands", "Left Hand", 0)}
        {renderEquippedItem("hands", "Right Hand", 1)}
        {renderEquippedItem("legs", "Legs")}
        {renderEquippedItem("feet", "Feet")}
        {inventory.fingers.map((ring, index) => (
          <View key={index}>
            {renderEquippedItem("fingers", `Finger (${index + 1})`, index)}
          </View>
        ))}
        <Text style={styles.sectionTitle}>Inventory:</Text>
        {inventory.items.map((item) => (
          <View key={item.id} style={styles.inventoryItem}>
            <Text>{item.name}</Text>
            <Button
              title="Equip"
              onPress={() => handleEquipItem(item, item.slot)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Přidání spodního paddingu pro posuvnost
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
  itemSlotText: {
    fontSize: 18,
    marginBottom: 10,
  },
  inventoryItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
