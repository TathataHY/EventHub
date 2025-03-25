const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

// Encuentra las rutas del proyecto y del monorepo
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// Force the router root to be ./app
process.env.EXPO_ROUTER_APP_ROOT = './app';

const defaultConfig = getDefaultConfig(projectRoot);

// 1. Observar todos los archivos dentro del monorepo
defaultConfig.watchFolders = [monorepoRoot];
// 2. Informar a Metro dónde resolver los paquetes y en qué orden
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
// 3. Asegurar que Metro pueda procesar los archivos TypeScript del paquete compartido
defaultConfig.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = defaultConfig; 