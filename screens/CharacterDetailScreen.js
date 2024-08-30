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

  // Logování celého objektu character
  console.log(JSON.stringify(character, null, 2));

  const [inventory, setInventory] = useState(character.inventory || []);

  const handleUnequipItem = (slot) => {
    const updatedEquipment = { ...character.equipment };
    const removedItem = updatedEquipment[slot];
    updatedEquipment[slot] = null;
    character.equipment = updatedEquipment;
    setInventory([...inventory, removedItem]);
    Alert.alert("Item removed", `The item from ${slot} was unequipped.`);
  };

  const handleEquipItem = (item) => {
    const updatedInventory = inventory.filter(
      (invItem) => invItem.id !== item.id
    );
    const updatedEquipment = { ...character.equipment };

    if (updatedEquipment[item.slot]) {
      setInventory([...updatedInventory, updatedEquipment[item.slot]]);
    }

    updatedEquipment[item.slot] = item;
    character.equipment = updatedEquipment;
    setInventory(updatedInventory);
    Alert.alert("Item equipped", `${item.name} was equipped to ${item.slot}.`);
  };
  const renderEquippedItem = (slot, label) => {
    const item = character.equipment[slot] || null;
    console.log(
      "Rendering item for slot:",
      slot,
      "Label:",
      label,
      "Item:",
      item
    );

    // Pokud item není, zobrazí se "None"
    if (!item) {
      return (
        <View style={styles.itemSlot}>
          <Text style={styles.itemSlotText}>{label}: None</Text>
        </View>
      );
    }

    // Pokud je item přítomen, ale nemá `name`, zobrazí se "Unnamed Item"
    return (
      <View style={styles.itemSlot}>
        <Text style={styles.itemSlotText}>
          {label}: {item.name || "Unnamed Item"}
        </Text>
        <Button title="Remove" onPress={() => handleUnequipItem(slot)} />
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
        <Text>Attack: {character.stats.attack}</Text>
        <Text>Defense: {character.stats.defense}</Text>
        <Text style={styles.sectionTitle}>Equipped Items:</Text>
        {character.equipment && renderEquippedItem("helmet", "Head")}
        {character.equipment && renderEquippedItem("necklace", "Neck")}
        {character.equipment && renderEquippedItem("chest", "Body")}
        {character.equipment && renderEquippedItem("gloves", "Hands")}
        {character.equipment && renderEquippedItem("legs", "Legs")}
        {character.equipment && renderEquippedItem("boots", "Feet")}
        {character.equipment && renderEquippedItem("weapon", "Weapon")}
        {character.equipment && renderEquippedItem("shield", "Shield")}
        <Text style={styles.sectionTitle}>Inventory:</Text>
        {inventory.length > 0 ? (
          inventory.map((item, index) => (
            <View
              key={item?.id || index.toString()}
              style={styles.inventoryItem}
            >
              <Text>{item?.name || "Unnamed Item"}</Text>
              <Button title="Equip" onPress={() => handleEquipItem(item)} />
            </View>
          ))
        ) : (
          <Text>No items in inventory.</Text>
        )}
      </View>
    </ScrollView>
  );
}

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
