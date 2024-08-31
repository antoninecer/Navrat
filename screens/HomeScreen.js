import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ImageBackground } from "react-native";
import styles from "../components/styles"; // Import stylů
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next"; // Použij useTranslation hook

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation(); // Inicializace funkce t pro překlady

  const [returnPointSet, setReturnPointSet] = useState(false);
  const [characterSummary, setCharacterSummary] = useState(null);
  const [selectedMode, setSelectedMode] = useState("Herní režim");

  useEffect(() => {
    const fetchMode = async () => {
      const mode = await AsyncStorage.getItem("selectedMode");
      if (mode) {
        setSelectedMode(mode);
      }
    };
    fetchMode();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkReturnPoint();
      loadCharacterSummary();
    }, [])
  );

  const checkReturnPoint = async () => {
    try {
      const returnPoint = await AsyncStorage.getItem("returnPoint");
      setReturnPointSet(!!returnPoint);
    } catch (error) {
      console.error("Error reading return point from AsyncStorage:", error);
      setReturnPointSet(false);
    }
  };

  const loadCharacterSummary = async () => {
    try {
      const storedCharacter = await AsyncStorage.getItem("characters");
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter)[0]; // Zobrazí se první postava
        setCharacterSummary({
          name: character.name,
          race: character.race,
          gender: character.gender || "",
          characterClass: character.characterClass,
          level: character.level || 1,
        });
      }
    } catch (error) {
      console.error("Failed to load character summary", error);
    }
  };

  const showConfirmationDialog = (title, message, onConfirm) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("yes"),
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={require("../assets/return.png")}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: "#fff", fontSize: 28 }]}>
          {t("explore_capture_title")}
        </Text>
        <Text style={[styles.subtitle, { color: "#fff", fontSize: 20 }]}>
          {t("personal_map_subtitle")}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t("record_interest_point")}
          onPress={() => navigation.navigate("Interest Point")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t("Return", "Return")}
          onPress={() => navigation.navigate("Return Point")}
        />
      </View>

      {(selectedMode === "Admin režim" || selectedMode === "Herní režim") && (
        <View style={styles.buttonContainer}>
          <Button
            title={t("actions")}
            onPress={() => navigation.navigate("Actions Menu")}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={t("view_photos")}
          onPress={() => navigation.navigate("Photo Viewer")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t("settings")}
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
      {characterSummary && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>
            {characterSummary.name} {characterSummary.race}{" "}
            {characterSummary.gender ? characterSummary.gender.charAt(0) : ""}{" "}
            {characterSummary.characterClass} Lvl {characterSummary.level}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}
