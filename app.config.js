import "dotenv/config";
export default {
  expo: {
    name: "Return",
    slug: "Return",
    version: "1.0.7",
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
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
      },
    },
    android: {
      permissions: ["ACCESS_FINE_LOCATION", "CAMERA"],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.antoninecer.Return",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "272b283e-70c2-4382-ad46-57c13fd9acde",
      },
    },
  },
};
