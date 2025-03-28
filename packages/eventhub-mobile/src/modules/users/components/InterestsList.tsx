import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InterestCategory } from '../types/user.types';
import { colors } from '@theme/base/colors';
import { getColorValue } from '@theme/index';

interface InterestsListProps {
  interests: (InterestCategory | string)[];
  style?: ViewStyle;
  editable?: boolean;
  onAddPress?: () => void;
  onRemovePress?: (interest: InterestCategory | string) => void;
}

export const InterestsList: React.FC<InterestsListProps> = ({
  interests,
  style,
  editable = false,
  onAddPress,
  onRemovePress
}) => {
  // Obtener un color basado en la categoría de interés
  const getInterestColor = (interest: InterestCategory | string): ColorValue => {
    const colorMap: Record<string, ColorValue> = {
      [InterestCategory.MUSIC]: getColorValue(colors.primary),
      [InterestCategory.SPORTS]: '#4CAF50',
      [InterestCategory.TECHNOLOGY]: '#2196F3',
      [InterestCategory.ARTS]: '#9C27B0',
      [InterestCategory.FOOD]: '#FF9800',
      [InterestCategory.EDUCATION]: '#795548',
      [InterestCategory.BUSINESS]: '#607D8B',
      [InterestCategory.HEALTH]: '#F44336',
      [InterestCategory.SOCIAL]: '#E91E63',
    };
    
    return colorMap[interest as string] || getColorValue(colors.grey[400]);
  };

  // Obtener un ícono basado en la categoría de interés
  const getInterestIcon = (interest: InterestCategory | string): string => {
    const iconMap: Record<string, string> = {
      [InterestCategory.MUSIC]: 'musical-notes',
      [InterestCategory.SPORTS]: 'basketball',
      [InterestCategory.TECHNOLOGY]: 'hardware-chip',
      [InterestCategory.ARTS]: 'color-palette',
      [InterestCategory.FOOD]: 'restaurant',
      [InterestCategory.EDUCATION]: 'school',
      [InterestCategory.BUSINESS]: 'briefcase',
      [InterestCategory.HEALTH]: 'fitness',
      [InterestCategory.SOCIAL]: 'people',
    };
    
    return iconMap[interest as string] || 'star';
  };

  // Obtener etiqueta para mostrar en español
  const getInterestLabel = (interest: InterestCategory | string): string => {
    const labelMap: Record<string, string> = {
      [InterestCategory.MUSIC]: 'Música',
      [InterestCategory.SPORTS]: 'Deportes',
      [InterestCategory.TECHNOLOGY]: 'Tecnología',
      [InterestCategory.ARTS]: 'Arte',
      [InterestCategory.FOOD]: 'Gastronomía',
      [InterestCategory.EDUCATION]: 'Educación',
      [InterestCategory.BUSINESS]: 'Negocios',
      [InterestCategory.HEALTH]: 'Salud',
      [InterestCategory.SOCIAL]: 'Social',
    };
    
    return labelMap[interest as string] || String(interest);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Intereses</Text>
        {editable && onAddPress && (
          <TouchableOpacity onPress={onAddPress}>
            <Ionicons name="add-circle" size={24} color={getColorValue(colors.primary)} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {interests.length > 0 ? (
          interests.map((interest, index) => (
            <View 
              key={`${interest}-${index}`}
              style={[
                styles.interestItem,
                { backgroundColor: getInterestColor(interest) }
              ]}
            >
              <Ionicons 
                name={getInterestIcon(interest) as any} 
                size={16} 
                color="white" 
                style={styles.interestIcon}
              />
              <Text style={styles.interestText}>
                {getInterestLabel(interest)}
              </Text>
              
              {editable && onRemovePress && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => onRemovePress(interest)}
                >
                  <Ionicons name="close-circle" size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay intereses definidos</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  interestIcon: {
    marginRight: 6,
  },
  interestText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 4,
  },
  emptyText: {
    color: colors.text,
    fontStyle: 'italic',
    padding: 8,
  },
}); 