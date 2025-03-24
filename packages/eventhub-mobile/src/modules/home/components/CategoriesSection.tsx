import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryPress: (categoryId: string, categoryName: string) => void;
}

export function CategoriesSection({ 
  categories, 
  onCategoryPress 
}: CategoriesSectionProps) {
  const { theme } = useTheme();
  
  if (!categories || categories.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
        Categorías
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: category.color || getColorValue(theme.colors.primary.light) }
            ]}
            onPress={() => onCategoryPress(category.id, category.name)}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={(category.icon as any) || 'grid-outline'} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
}); 