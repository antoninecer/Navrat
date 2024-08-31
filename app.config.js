import "dotenv/config";

//console.log(
//  "GOOGLE_MAPS_API_KEY_ANDROID: ",
//  process.env.GOOGLE_MAPS_API_KEY_ANDROID
//);

export default {
  expo: {
    name: "Return",
    slug: "Return",
    version: "1.0.10",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to show the return point on the map.",
        NSCameraUsageDescription:
          "This app uses your camera to take photos of interesting points.",
      },
      bundleIdentifier: "com.antoninecer.Return",
    },
    android: {
      permissions: ["ACCESS_FINE_LOCATION", "CAMERA"],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.antoninecer.Return",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      googleMapsApiKeyAndroid: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      googleMapsApiKeyIos: process.env.GOOGLE_MAPS_API_KEY_IOS,
      eas: {
        projectId: "272b283e-70c2-4382-ad46-57c13fd9acde",
      },
    },
  },
};
