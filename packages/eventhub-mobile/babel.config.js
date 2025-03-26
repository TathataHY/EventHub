module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel', // Necesario para Expo Router en SDK 50
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@modules': './src/modules',
            '@core': './src/core',
            '@shared': './src/shared',
            '@assets': './assets',
            '@theme': './src/theme',
            '@app': './app',
          },
        },
      ],
    ],
  };
};