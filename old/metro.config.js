/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
module.exports = {
  ...defaultConfig, // Rozšíření o výchozí konfiguraci Expo
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg').concat(['db', 'mp3', 'ttf', 'obj', 'vrm', 'mp4', 'jpg', 'png']),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};
