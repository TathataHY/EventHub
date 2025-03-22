import { Stack } from 'expo-router';
import { SearchScreen } from '../src/modules/search/screens';

/**
 * Pantalla de búsqueda utilizando la estructura modular
 */
export default function SearchPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Buscar',
        headerShown: false,
      }} />
      <SearchScreen />
    </>
  );
} 