// components/DeleteAllPoints.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
export const deleteAllPoints = async (clearStorageCallback) => {
  showConfirmationDialog(
    "Smazat všechny body?",
    "Opravdu chcete smazat všechny body zájmu? Tato akce je nevratná.",
    async () => {
      try {
        await clearStorageCallback();
        Alert.alert("Úspěch", "Všechny body byly smazány.");
      } catch (error) {
        Alert.alert("Chyba", "Došlo k chybě při mazání bodů.");
        console.error("Delete error:", error);
      }
    }
  );
};
const showConfirmationDialog = (title, message, onConfirm) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Zrušit",
        style: "cancel",
      },
      {
        text: "Ano",
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};
