import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Name: "Name",
        Race: "Race",
        Description: "Description",
        Level: "Level",
        Strength: "Strength",
        Defense: "Defense",
        Attack: "Attack",
        Speed: "Speed",
        Luck: "Luck",
        Courage: "Courage",
        Health: "Health",
        Mana: "Mana",
        Class: "Class",
      },
    },
    cs: {
      translation: {
        Name: "Jméno",
        Race: "Rasa",
        Description: "Popis",
        Level: "Úroveň",
        Strength: "Síla",
        Defense: "Obrana",
        Attack: "Útok",
        Speed: "Rychlost",
        Luck: "Štěstí",
        Courage: "Odvaha",
        Health: "Zdraví",
        Mana: "Mana",
        Class: "Povolání",
      },
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
