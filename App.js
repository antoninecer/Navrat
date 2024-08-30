import React from "react";
import "intl-pluralrules";
import { NavigationContainer } from "@react-navigation/native"; // Opravený import
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import PointScreen from "./screens/PointScreen";
import ReturnPointScreen from "./screens/ReturnPointScreen";
import InterestPointScreen from "./screens/InterestPointScreen";
import PhotoViewerScreen from "./screens/PhotoViewerScreen";
import ActionsMenuScreen from "./screens/ActionsMenuScreen";
import PlaceObjectScreen from "./screens/PlaceObjectScreen";
import SearchAreaScreen from "./screens/SearchAreaScreen";
import InventoryScreen from "./screens/InventoryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MapScreen from "./screens/CurrentLocationMapScreen";
import KompasScreen from "./screens/KompasScreen";
import EditPointScreen from "./screens/EditPointScreen";
import TaskList from "./components/TaskList";
import { ThemeProvider } from "./components/ThemeContext";
import CharacterSettingsScreen from "./screens/CharacterSettingsScreen";
import CharacterSelectionScreen from "./screens/CharacterSelectionScreen";
import CharacterDetailScreen from "./screens/CharacterDetailScreen";
import CharacterCreationScreen from "./screens/CharacterCreationScreen";
import AboutScreen from "./screens/AboutScreen";
import DungeonScreen from "./screens/DungeonScreen";
import EquipmentScreen from "./screens/EquipmentScreen";
import CharacterEquipmentScreen from "./screens/CharacterEquipmentScreen";
import "./i18n";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PointScreen" component={PointScreen} />
          <Stack.Screen name="Return Point" component={ReturnPointScreen} />
          <Stack.Screen name="Interest Point" component={InterestPointScreen} />
          <Stack.Screen name="Photo Viewer" component={PhotoViewerScreen} />
          <Stack.Screen name="Actions Menu" component={ActionsMenuScreen} />
          <Stack.Screen name="Place Object" component={PlaceObjectScreen} />
          <Stack.Screen name="Search Area" component={SearchAreaScreen} />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="DynamicMap" component={MapScreen} />
          <Stack.Screen name="KompasScreen" component={KompasScreen} />
          <Stack.Screen name="Edit Point" component={EditPointScreen} />
          <Stack.Screen name="Tasks" component={TaskList} />
          <Stack.Screen
            name="CharacterEquipment"
            component={CharacterEquipmentScreen}
          />
          <Stack.Screen
            name="CharacterCreation"
            component={CharacterCreationScreen}
          />
          <Stack.Screen
            name="Character Settings"
            component={CharacterSettingsScreen}
          />
          <Stack.Screen
            name="CharacterSelection"
            component={CharacterSelectionScreen}
          />
          <Stack.Screen
            name="CharacterDetail"
            component={CharacterDetailScreen}
          />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="DungeonScreen" component={DungeonScreen} />
          <Stack.Screen name="Equipment" component={EquipmentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
