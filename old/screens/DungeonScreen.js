import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { getCharacter } from "../models/characterModel";
import { generateEnemy } from "../utils/generateEnemy";
const DungeonScreen = ({ route, navigation }) => {
  const { dungeon } = route.params;
  const [character, setCharacter] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [playerPower, setPlayerPower] = useState(0);
  const [enemyPower, setEnemyPower] = useState(0);
  const [reward, setReward] = useState(null);
  useEffect(() => {
    const fetchCharacterAndGenerateEnemies = async () => {
      try {
        const fetchedCharacter = await getCharacter();
        if (!fetchedCharacter) {
          throw new Error("Character data not found.");
        }
        setCharacter(fetchedCharacter);
        const generatedEnemies = [];
        for (let i = 0; i < 3; i++) {
          const enemy = generateEnemy(
            fetchedCharacter.level,
            dungeon.difficulty || "normal",
            dungeon.environment
          );
          generatedEnemies.push(enemy);
        }
        setEnemies(generatedEnemies);
        calculatePowers(fetchedCharacter, generatedEnemies);
      } catch (error) {
        console.error("Failed to fetch character or generate enemies", error);
        Alert.alert("Error", "Failed to fetch character or generate enemies");
      }
    };
    fetchCharacterAndGenerateEnemies();
  }, []);
  const calculatePowers = (character, enemies) => {
    if (!character || !enemies.length) return;
    const playerTotalPower =
      character.strength +
      character.defense +
      character.attack +
      character.speed;
    const enemyTotalPower = enemies.reduce(
      (acc, enemy) => acc + enemy.attack + enemy.defense,
      0
    );
    setPlayerPower(playerTotalPower);
    setEnemyPower(enemyTotalPower);
    calculateReward(playerTotalPower, enemyTotalPower);
  };
  const calculateReward = (playerPower, enemyPower) => {
    let rewardValue;
    if (playerPower > enemyPower) {
      rewardValue = Math.floor(Math.random() * 50) + 50;
    } else {
      rewardValue = Math.floor(Math.random() * 20) + 10;
    }
    setReward({ gold: rewardValue });
  };
  const startExploration = () => {
    Alert.alert(
      "Dungeon Exploration",
      `You encountered ${enemies.length} enemies with a total power of ${enemyPower}. Your total power is ${playerPower}.`,
      [
        {
          text: "Fight",
          onPress: () => {
            if (playerPower > enemyPower) {
              Alert.alert(
                "Victory!",
                `You defeated the enemies and earned ${reward.gold} gold!`
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
      ]
    );
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
