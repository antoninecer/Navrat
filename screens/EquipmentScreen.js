import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function EquipmentScreen({ character, setCharacter }) {
  const handleUnequipItem = async (slot) => {
    const item = character.inventory[slot];
    if (item) {
      Alert.alert("Unequip Item", `Opravdu chcete odvybavit ${item.name}?`, [
        { text: "Zrušit", style: "cancel" },
        {
          text: "Odvybavit",
          onPress: async () => {
            // Remove item from the equipped slot
            const newInventory = [...character.inventory.items];
            newInventory.push({ ...item, equipped: false });
            const updatedCharacter = {
              ...character,
              inventory: {
                ...character.inventory,
                [slot]: null,
                items: newInventory,
              },
            };
            setCharacter(updatedCharacter);
            await AsyncStorage.setItem(
              "character",
              JSON.stringify(updatedCharacter)
            );
            Alert.alert(`${item.name} byl odvybaven a přesunut do inventáře.`);
          },
        },
      ]);
    }
  };
  const renderEquippedItem = (slot, label) => {
    const item = character.inventory[slot];
    if (!item) {
      return <Text style={styles.itemSlotText}>{label}: Žádný předmět</Text>;
    }
    let itemDetails = "";
    switch (item.type) {
      case "weapon":
        itemDetails = `Útok: +${item.properties.attackPoints}`;
        break;
      case "armor":
        itemDetails = `Obrana: +${item.properties.defensePoints}`;
        break;
      case "ring":
      case "amulet":
        itemDetails = `Efekt: +${item.properties.effectAmount}`;
        break;
      default:
        itemDetails = "";
    }
    return (
      <View style={styles.itemSlot}>
        <Text style={styles.itemSlotText}>
          {label}: {item.name} ({itemDetails})
        </Text>
        <Button title="Odvybavit" onPress={() => handleUnequipItem(slot)} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {renderEquippedItem("head", "Hlava")}
      {renderEquippedItem("neck", "Krk")}
      {renderEquippedItem("body", "Tělo")}
      {renderEquippedItem("hands[0]", "Levá ruka")}
      {renderEquippedItem("hands[1]", "Pravá ruka")}
      {renderEquippedItem("legs", "Nohy")}
      {renderEquippedItem("feet", "Chodidla")}
      {character.inventory.fingers.map((ring, index) => (
        <View key={index}>
          {renderEquippedItem(`fingers[${index}]`, `Prst (${index + 1})`)}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  itemSlot: {
    marginBottom: 20,
  },
  itemSlotText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
