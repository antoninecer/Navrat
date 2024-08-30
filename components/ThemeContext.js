// components/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    };
    loadTheme();
  }, []);
  const toggleTheme = async () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
