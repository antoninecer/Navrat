import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };
    loadTasks();
  }, []);
  const handleTaskComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  const handleTaskDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  const renderTask = ({ item }) => (
    <Task
      task={item}
      onComplete={handleTaskComplete}
      onDelete={handleTaskDelete}
    />
  );
  return (
    <View>
      <Text style={styles.header}>Nedokončené úkoly</Text>
      <FlatList
        data={tasks.filter((task) => !task.completed)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
      />
      <View style={styles.divider} />
      <Text style={styles.header}>Dokončené úkoly</Text>
      <FlatList
        data={tasks.filter((task) => task.completed)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  divider: {
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});
