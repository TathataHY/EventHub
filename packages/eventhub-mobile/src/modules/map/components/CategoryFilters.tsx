import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { getColorValue } from '@theme/theme.types';

interface CategoryFiltersProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  getCategoryColor: (category: string) => string;
}

export function CategoryFilters({ 
  selectedCategory, 
  onCategorySelect,
  getCategoryColor
}: CategoryFiltersProps) {
  const { theme } = useTheme();
  
  // Categorías disponibles
  const categories = [
    'Música', 
    'Deportes', 
    'Tecnología', 
    'Arte', 
    'Gastronomía', 
    'Cine', 
    'Teatro', 
    'Conferencia'
  ];
  
  return (
    <View style={[styles.filtersContainer, { backgroundColor: getColorValue(theme.colors.background.paper) }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            { backgroundColor: !selectedCategory ? getColorValue(theme.colors.primary.main) : getColorValue(theme.colors.background.default) }
          ]}
          onPress={() => onCategorySelect(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: !selectedCategory ? '#FFF' : getColorValue(theme.colors.text.primary) }
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterChip,
              { backgroundColor: selectedCategory === category ? getCategoryColor(category) : getColorValue(theme.colors.background.default) }
            ]}
            onPress={() => onCategorySelect(category)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedCategory === category ? '#FFF' : getColorValue(theme.colors.text.primary) }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 