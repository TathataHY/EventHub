import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface RecentSearchesProps {
  searches: string[];
  onSearchPress: (search: string) => void;
  onClearAll: () => void;
}

export function RecentSearches({ 
  searches, 
  onSearchPress, 
  onClearAll 
}: RecentSearchesProps) {
  const { theme } = useTheme();
  
  if (!searches.length) return null;
  
  const renderSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.searchItem, { backgroundColor: theme.colors.background.default }]}
      onPress={() => onSearchPress(item)}
    >
      <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
      <Text style={[styles.searchText, { color: theme.colors.text.primary }]}>
        {item}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Búsquedas recientes
        </Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={[styles.clearText, { color: theme.colors.primary.main }]}>
            Limpiar todo
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={searches}
        renderItem={renderSearchItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.searchesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
  },
  searchesList: {
    paddingHorizontal: 16,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
}); 