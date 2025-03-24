import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';

interface EventsSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  delay?: number; // Delay en ms para realizar la búsqueda después de escribir
}

export const EventsSearchBar: React.FC<EventsSearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar eventos...',
  initialValue = '',
  style,
  inputStyle,
  delay = 500
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState(initialValue);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Manejar cambio de texto con debounce
  const handleChangeText = (text: string) => {
    setQuery(text);
    
    // Limpiar timeout anterior si existe
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Configurar nuevo timeout para debounce
    searchTimeout.current = setTimeout(() => {
      onSearch(text.trim());
    }, delay);
  };

  // Manejar la limpieza del input
  const handleClear = () => {
    setQuery('');
    onSearch('');
    Keyboard.dismiss();
  };

  // Manejar el submit del formulario
  const handleSubmit = () => {
    onSearch(query.trim());
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.searchContainer, 
          { 
            backgroundColor: theme.colors.background.paper,
            borderRadius: 8,
            shadowColor: '#000'
          }
        ]}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.colors.text.secondary} 
          style={styles.searchIcon} 
        />
        
        <TextInput
          style={[
            styles.input, 
            { 
              color: theme.colors.text.primary,
              fontSize: 16
            }, 
            inputStyle
          ]}
          value={query}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {query.length > 0 && Platform.OS === 'android' && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
}); 