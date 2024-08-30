import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddTask({ navigation }) {
  const [taskDescription, setTaskDescription] = useState("");
  const handleAddTask = async () => {
    const newTask = {
      id: Date.now(),
      description: taskDescription,
      completed: false,
    };
    const storedTasks = await AsyncStorage.getItem("tasks");
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    tasks.push(newTask);
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    navigation.goBack();
  };
  return (
    <View>
      <TextInput
        placeholder="Popis úkolu"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />
      <Button title="Přidat úkol" onPress={handleAddTask} />
    </View>
  );
}
