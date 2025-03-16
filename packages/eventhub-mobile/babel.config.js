module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 'expo-router/babel', // Obsoleto en SDK 50
      'react-native-reanimated/plugin',
    ],
  };
};