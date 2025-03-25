import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  debounceTime?: number;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
}

/**
 * Componente SearchBar para búsquedas en la aplicación
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value = '',
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
  containerStyle,
  inputStyle,
  debounceTime = 500,
  returnKeyType = 'search'
}) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Manejar cambio de texto con debounce
  const handleTextChange = (text: string) => {
    setInputValue(text);
    
    if (timer) {
      clearTimeout(timer);
    }
    
    if (onChangeText && debounceTime > 0) {
      const newTimer = setTimeout(() => {
        onChangeText(text);
      }, debounceTime);
      
      setTimer(newTimer);
    } else if (onChangeText) {
      onChangeText(text);
    }
  };
  
  // Manejar limpieza de texto
  const handleClear = () => {
    setInputValue('');
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };
  
  // Manejar envío de búsqueda
  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background.default,
          borderColor: theme.colors.grey[300],
        },
        containerStyle
      ]}
    >
      <Ionicons 
        name="search-outline" 
        size={20} 
        color={theme.colors.text.secondary}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={[
          styles.input,
          { 
            color: theme.colors.text.primary,
          },
          inputStyle
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary}
        value={inputValue}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSubmit}
        returnKeyType={returnKeyType}
        autoFocus={autoFocus}
        clearButtonMode="never"
      />
      
      {inputValue.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="close-circle" 
            size={18} 
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: 4,
  }
}); 