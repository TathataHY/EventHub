import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function SearchBar({ 
  searchQuery, 
  onChangeText, 
  onSubmit, 
  onClear 
}: SearchBarProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.searchBarContainer, { backgroundColor: theme.colors.background.default }]}>
      <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text.primary }]}
        placeholder="Buscar eventos, personas, lugares..."
        placeholderTextColor={theme.colors.text.secondary}
        value={searchQuery}
        onChangeText={onChangeText}
        autoFocus
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
}); 