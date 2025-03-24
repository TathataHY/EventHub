import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  onClear?: () => void;
}

export function SearchInput({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  onSubmitEditing,
  containerStyle,
  inputStyle,
  onClear
}: SearchInputProps) {
  const { theme } = useTheme();
  
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: getColorValue(theme.colors.background.paper) },
      containerStyle
    ]}>
      <Ionicons 
        name="search-outline" 
        size={20} 
        color={getColorValue(theme.colors.text.secondary)} 
        style={styles.searchIcon} 
      />
      
      <TextInput
        style={[
          styles.input, 
          { color: getColorValue(theme.colors.text.primary) },
          inputStyle
        ]}
        placeholder={placeholder}
        placeholderTextColor={getColorValue(theme.colors.text.disabled)}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        clearButtonMode="never"
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons 
            name="close-circle" 
            size={18} 
            color={getColorValue(theme.colors.text.secondary)} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
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
    fontSize: 16,
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
}); 