// components/clearStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
export const clearStorage = async (setReturnPointSet) => {
  try {
    console.log("Clearing storage...");
    await AsyncStorage.removeItem("returnPoint");
    await AsyncStorage.removeItem("interestPoints");
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    for (let file of files) {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`);
      console.log(`Deleted file: ${file}`);
    }
    setReturnPointSet(false);
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
