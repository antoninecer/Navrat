import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../components/styles";
import { importData } from "../components/importData";
import { exportData } from "../components/exportData";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState("Herní režim");
  const [loading, setLoading] = useState(false);

  const handleModeChange = async (mode) => {
    setSelectedMode(mode);
    await AsyncStorage.setItem("selectedMode", mode);
    Alert.alert("Režim změněn", `Aktuální režim je nyní: ${mode}`);
  };

  const deleteAllData = async () => {
    Alert.alert(
      "Smazat všechna data?",
      "Opravdu chcete smazat všechna data? Tato akce je nevratná.",
      [
        { text: "Zrušit", style: "cancel" },
        {
          text: "Ano",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Úspěch", "Všechna data byla smazána.");
            } catch (error) {
              Alert.alert("Chyba", "Došlo k chybě při mazání dat.");
              console.error("Delete error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mode Settings</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMode}
            style={styles.picker}
            onValueChange={(itemValue) => handleModeChange(itemValue)}
          >
            <Picker.Item label="Herní režim" value="Herní režim" />
            <Picker.Item label="Výletní režim" value="Výletní režim" />
            <Picker.Item label="Admin režim" value="Admin režim" />
          </Picker>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Export Data"
          onPress={() => exportData(setLoading)}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Import Data"
          onPress={() => importData(setLoading)}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete All Data" onPress={deleteAllData} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="About" onPress={() => navigation.navigate("About")} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={localStyles.aboutButton}
          onPress={() =>
            Linking.openURL("https://www.facebook.com/groups/461720089986492")
          }
        >
          <Text style={localStyles.aboutButtonText}>
            VentureOut Facebook Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Přidání stylů pro tlačítko About
const localStyles = StyleSheet.create({
  aboutButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  aboutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
