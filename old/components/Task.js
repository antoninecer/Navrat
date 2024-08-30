import React from "react";
import { View, Text, Button } from "react-native";
export default function Task({ task, onComplete, onDelete }) {
  return (
    <View>
      <Text>{task.description}</Text>
      <Button
        title={task.completed ? "Zrušit splnění" : "Splnit"}
        onPress={() => onComplete(task.id)}
      />
      <Button title="Smazat" onPress={() => onDelete(task.id)} />
    </View>
  );
}
