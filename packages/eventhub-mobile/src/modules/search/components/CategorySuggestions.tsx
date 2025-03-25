import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

// Importar tipos necesarios
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySuggestionsProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

export function CategorySuggestions({ 
  categories, 
  onCategoryPress 
}: CategorySuggestionsProps) {
  const { theme } = useTheme();
  
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: theme.colors.background.default }]}
      onPress={() => onCategoryPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary.main}20` }]}>
        <Ionicons name={item.icon as any} size={22} color={theme.colors.primary.main} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Categorías populares
      </Text>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    borderRadius: 8,
    width: 100,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 