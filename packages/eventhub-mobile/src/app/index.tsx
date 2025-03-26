import { Redirect } from 'expo-router';

/**
 * Página de inicio que redirige a las pestañas principales
 * El layout de pestañas se carga desde los componentes modularizados
 */
export default function IndexPage() {
  return <Redirect href="/(tabs)" />;
} 