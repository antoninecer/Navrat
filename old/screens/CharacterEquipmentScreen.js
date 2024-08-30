import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
export default function CharacterEquipmentScreen({ route }) {
  const { character } = route.params;
  const [inventory, setInventory] = useState(
    initializeInventory(character.inventory)
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
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
  const handleEquipItem = (item) => {
    const updatedInventory = { ...inventory };
    if (selectedSlot.index !== null) {
      updatedInventory[selectedSlot.slot][selectedSlot.index] = item;
    } else {
      updatedInventory[selectedSlot.slot] = item;
    }
    setInventory(updatedInventory);
    setSelectedSlot(null);
    Alert.alert(
      "Item equipped",
      `${item.name} was equipped to ${selectedSlot.label}.`
    );
  };
  const renderSlot = (label, slot, index = null) => {
    const item = index !== null ? inventory[slot][index] : inventory[slot];
    return (
      <TouchableOpacity
        style={styles.slot}
        onPress={() => setSelectedSlot({ slot, index, label })}
      >
        <Text style={styles.slotLabel}>{label}</Text>
        <Text>{item ? item.name : "None"}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{character.name}</Text>
      <Text>Level: {character.level}</Text>
      {/* Vizuální zobrazení těla */}
      <View style={styles.bodyContainer}>
        <View style={styles.upperBody}>
          {renderSlot("Head", "head")}
          {renderSlot("Neck", "neck")}
          {renderSlot("Body", "body")}
        </View>
        <View style={styles.hands}>
          {renderSlot("Left Hand", "hands", 0)}
          {renderSlot("Right Hand", "hands", 1)}
        </View>
        <View style={styles.lowerBody}>
          {renderSlot("Legs", "legs")}
          {renderSlot("Feet", "feet")}
        </View>
      </View>
      {/* Inventář pro vybavení */}
      {selectedSlot && (
        <View style={styles.inventoryContainer}>
          <Text>Equip item to {selectedSlot.label}:</Text>
          <FlatList
            data={inventory.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.inventoryItem}
                onPress={() => handleEquipItem(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  upperBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  hands: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  lowerBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  slotLabel: {
    fontWeight: "bold",
  },
  inventoryContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  inventoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
