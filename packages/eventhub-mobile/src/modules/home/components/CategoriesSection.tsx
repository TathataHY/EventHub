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
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryCard: {
    width: 110,
    height: 110,
    borderRadius: 16,
    marginRight: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
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