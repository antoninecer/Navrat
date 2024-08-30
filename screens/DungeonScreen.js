import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Character from "../models/Character";
import { generateEnemy } from "../utils/generateEnemy";
import standartItems from "../data/standardItems"; // Import standardních položek

const DungeonScreen = ({ route, navigation }) => {
  const { dungeon } = route.params;
  const [character, setCharacter] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [playerPower, setPlayerPower] = useState(0);
  const [enemyPower, setEnemyPower] = useState(0);
  const [reward, setReward] = useState({ gold: 0, items: [] });

  useEffect(() => {
    const fetchCharacterAndGenerateEnemies = async () => {
      try {
        const storedCharacter = await AsyncStorage.getItem("activeCharacter");
        if (!storedCharacter) {
          throw new Error("Character data not found.");
        }

        const parsedCharacter = JSON.parse(storedCharacter);
        const characterInstance = new Character(
          parsedCharacter.name,
          parsedCharacter.race,
          parsedCharacter.characterClass,
          parsedCharacter.naturalTalents,
          parsedCharacter.abilities,
          parsedCharacter.inventory
        );
        setCharacter(characterInstance);

        const generatedEnemies = [];
        for (let i = 0; i < 3; i++) {
          const enemy = generateEnemy(
            characterInstance.level,
            dungeon.difficulty || "normal",
            dungeon.environment
          );
          generatedEnemies.push(enemy);
        }
        setEnemies(generatedEnemies);

        const playerTotalPower = characterInstance.calculatePower();
        const enemyTotalPower = generatedEnemies.reduce(
          (acc, enemy) => acc + enemy.attack + enemy.defense,
          0
        );

        setPlayerPower(playerTotalPower);
        setEnemyPower(enemyTotalPower);
        calculateReward(playerTotalPower, enemyTotalPower, generatedEnemies);
      } catch (error) {
        console.error("Failed to fetch character or generate enemies", error);
        Alert.alert("Error", "Failed to fetch character or generate enemies");
      }
    };

    fetchCharacterAndGenerateEnemies();
  }, [dungeon]);

  const calculateReward = (playerPower, enemyPower, enemies) => {
    let rewardValue;
    let rewardItems = [];

    if (playerPower > enemyPower) {
      rewardValue = Math.floor(Math.random() * 50) + 50;

      // Přidání náhodného předmětu z standartItems
      const itemTypes = Object.keys(standartItems);
      const randomType =
        itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const randomItem =
        standartItems[randomType][
          Math.floor(Math.random() * standartItems[randomType].length)
        ];
      rewardItems.push(randomItem);

      // Přidání vybavení z nepřátel
      enemies.forEach((enemy) => {
        if (enemy.weapon) rewardItems.push(enemy.weapon);
        if (enemy.armor) rewardItems.push(enemy.armor);
      });
    } else {
      rewardValue = Math.floor(Math.random() * 20) + 10;
    }

    setReward({ gold: rewardValue, items: rewardItems });
  };

  const startExploration = () => {
    let message = `You encountered ${enemies.length} enemies with a total power of ${enemyPower}. Your total power is ${playerPower}.`;

    if (reward.items.length > 0) {
      const itemNames = reward.items.map((item) => item.name).join(", ");
      message += ` You also found: ${itemNames}.`;
    }

    Alert.alert("Dungeon Exploration", message, [
      {
        text: "Fight",
        onPress: async () => {
          if (playerPower > enemyPower) {
            const victoryMessage = `You defeated the enemies, earned ${
              reward.gold
            } gold, and found: ${reward.items
              .map((item) => item.name)
              .join(", ")}!`;

            Alert.alert("Victory!", victoryMessage);
            reward.items.forEach((item) => {
              character.addItemToInventory(item);
            });
            await AsyncStorage.setItem(
              "activeCharacter",
              JSON.stringify(character)
            );
          } else {
            Alert.alert(
              "Defeat!",
              "You were defeated and escaped with nothing."
            );
          }
          navigation.navigate("CharacterSelection");
        },
      },
      {
        text: "Flee",
        onPress: () => navigation.navigate("CharacterSelection"),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{dungeon.name}</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>
        {dungeon.description}
      </Text>
      <Button title="Start Exploration" onPress={startExploration} />
    </View>
  );
};

export default DungeonScreen;
