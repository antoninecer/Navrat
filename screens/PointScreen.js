import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { averageGpsCoordinates } from "../components/gpsUtils";

export default function PointScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { pointType } = route.params || {};

  const recalculateGps = async () => {
    setLoading(true);
    try {
      const averagedCoords = await averageGpsCoordinates();
      setLocation(averagedCoords);
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    recalculateGps();
  }, []);

  const saveAndGoBack = async () => {
    if (location) {
      const key = `${pointType}_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(location));
      Alert.alert(t("save_success"), t("save_success_message"));
      navigation.goBack(); // Návrat zpět po uložení
    } else {
      Alert.alert(t("save_error"), t("save_error_message"));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t("calculating_gps")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <MapView
            style={styles.map}
            region={{
              latitude: location ? location.latitude : 0,
              longitude: location ? location.longitude : 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            onRegionChangeComplete={(region) => setLocation(region)}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={pointType || t("return_point")}
              />
            )}
          </MapView>
          <View style={styles.controls}>
            <Button title={t("recalculate_gps")} onPress={recalculateGps} />
            <Button title={t("save_point")} onPress={saveAndGoBack} />{" "}
            {/* Upraveno tlačítko */}
            <Button title={t("go_back")} onPress={() => navigation.goBack()} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
  map: {
    width: "100%",
    height: "50%",
  },
  controls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
