import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function BookScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("bookEntries");
        const bookEntries = storedEntries ? JSON.parse(storedEntries) : [];
        setEntries(bookEntries);
      } catch (error) {
        console.error("Error loading book entries:", error);
      }
    };
    loadEntries();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Book</Text>
      <ScrollView>
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <View key={index} style={styles.entryContainer}>
              <Text style={styles.entryTitle}>{entry.name}</Text>
              <Text style={styles.entryText}>{entry.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEntries}>Your book is empty.</Text>
        )}
      </ScrollView>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  entryContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
  },
  noEntries: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
