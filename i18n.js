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
        // New translations for ReturnPointScreen and PointScreen
        calculating_gps: "Please wait, averaging GPS measurements...",
        save_success: "Success",
        save_success_message: "Point was successfully saved.",
        save_error: "Error",
        save_error_message: "Failed to save the point.",
        recalculate_gps: "Recalculate GPS",
        view_point: "View Point",
        go_back: "Go Back",
        gps_coordinates: "GPS Coordinates",
        no_coordinates: "No coordinates available",
        return_point: "Return Point",
        save_point: "Save Point",
        //HomeScreen
        explore_capture_title: "Explore, Capture, and Never Get Lost Again",
        personal_map_subtitle:
          "Your personal map for mushroom hunting and other adventures",
        set_return_point: "Set Return Point",
        record_interest_point: "Record Interest Point",
        actions: "Actions",
        view_map: "View Map",
        view_photos: "View Photos",
        settings: "Settings",
        set_return_point_title: "Set Return Point?",
        set_return_point_message:
          "Do you really want to set this location as your return point?",
        permission_denied: "Permission Denied",
        permission_denied_message: "Access to location was denied.",
        saved: "Saved",
        return_point_saved_message: "Return point successfully saved!",
        error: "Error",
        error_setting_return_point:
          "There was an error setting the return point.",
        cancel: "Cancel",
        yes: "Yes",
        // GPS lokalizator
        calculating_gps: "Acquiring GPS...",
        calculating_average: "Calculating precise location...",
        gps_precise: "Precise location determined",
        gps_error: "Error in determining GPS location",
        gps_permission_denied: "GPS permission denied",
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
        // Překlady pro ReturnPointScreen a PointScreen
        calculating_gps: "Prosím počkejte, průměruji GPS měření...",
        save_success: "Úspěch",
        save_success_message: "Bod byl úspěšně uložen.",
        save_error: "Chyba",
        save_error_message: "Nepodařilo se uložit bod.",
        recalculate_gps: "Přepočítat GPS",
        view_point: "Zobrazit bod",
        go_back: "Zpět",
        gps_coordinates: "GPS souřadnice",
        no_coordinates: "Žádné dostupné souřadnice",
        return_point: "Návratový bod",
        save_point: "Uložit bod",
        // HomeScreen
        explore_capture_title: "Prozkoumejte, zachyťte a nikdy se neztraťte",
        personal_map_subtitle:
          "Vaše osobní mapa pro houbaření a další dobrodružství",
        set_return_point: "Nastavit návratový bod",
        record_interest_point: "Zaznamenat bod zájmu",
        actions: "Akce",
        view_map: "Zobrazit mapu",
        view_photos: "Zobrazit fotky",
        settings: "Nastavení",
        set_return_point_title: "Nastavit návratový bod?",
        set_return_point_message:
          "Opravdu chcete nastavit tuto polohu jako návratový bod?",
        permission_denied: "Přístup odepřen",
        permission_denied_message: "Přístup k poloze byl odepřen.",
        saved: "Uloženo",
        return_point_saved_message: "Návratový bod úspěšně uložen!",
        error: "Chyba",
        error_setting_return_point:
          "Při nastavení návratového bodu došlo k chybě.",
        cancel: "Zrušit",
        yes: "Ano",
        //gps lokalizator
        calculating_gps: "Získávání GPS...",
        calculating_average: "Průměrování polohy...",
        gps_precise: "Přesná poloha určena",
        gps_error: "Chyba při získávání GPS polohy",
        gps_permission_denied: "Přístup k GPS odepřen",
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
