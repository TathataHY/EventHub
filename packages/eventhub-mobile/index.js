import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Registrar Expo Router como el componente raíz
// https://docs.expo.dev/router/installation/#usage-with-registerrootcomponent
export default function App() {
  return <ExpoRoot context={require.context('./app', true)} />;
}

registerRootComponent(App); 