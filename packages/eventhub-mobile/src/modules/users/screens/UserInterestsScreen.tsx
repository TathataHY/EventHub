import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'expo-router';
import { userService } from '../services';
import { InterestCategory } from '../types/user.types';
import { appColors, appTypography, getColorValue, convertTypographyStyle } from '@theme/index';

// Función auxiliar para obtener el icono según la categoría
const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'MUSIC': 'musical-notes',
    'SPORTS': 'basketball',
    'ARTS': 'color-palette',
    'TECHNOLOGY': 'hardware-chip',
    'FOOD': 'restaurant',
    'CINEMA': 'film',
    'THEATRE': 'body',
    'LITERATURE': 'book',
    'PHOTOGRAPHY': 'camera',
    'DANCE': 'people',
    'FASHION': 'shirt',
    'TRAVEL': 'airplane',
    'SCIENCE': 'flask',
    'HISTORY': 'time',
    'GAMES': 'game-controller',
    'NATURE': 'leaf',
    'POLITICS': 'megaphone',
    'EDUCATION': 'school',
    'HEALTH': 'fitness',
    'BUSINESS': 'briefcase',
    'SOCIAL': 'people-outline',
  };
  
  return iconMap[category] || 'ellipse';
};

export function UserInterestsScreen() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<InterestCategory[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([]);
  const { currentUser } = useUser();
  const router = useRouter();
  
  // Cargar categorías disponibles e intereses del usuario
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar intereses disponibles (todas las categorías del enum)
        const availableCategories = Object.values(InterestCategory);
        setCategories(availableCategories);
        
        // Cargar intereses del usuario actual
        if (currentUser) {
          const userInterests = await userService.getUserInterests();
          setSelectedInterests(userInterests);
        }
      } catch (error) {
        console.error('Error loading interests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);
  
  // Manejar selección de interés
  const handleInterestToggle = (category: InterestCategory) => {
    setSelectedInterests(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Guardar intereses seleccionados
  const handleSaveInterests = async () => {
    try {
      setLoading(true);
      await userService.updateUserInterests(selectedInterests);
      router.back();
    } catch (error) {
      console.error('Error updating interests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar cada categoría como un chip seleccionable
  const renderCategory = (category: InterestCategory) => {
    const isSelected = selectedInterests.includes(category);
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          isSelected && styles.selectedChip
        ]}
        onPress={() => handleInterestToggle(category)}
      >
        <Ionicons
          name={getCategoryIcon(category)}
          size={18}
          color={isSelected ? getColorValue(appColors.common.white) : getColorValue(appColors.grey[600])}
          style={styles.categoryIcon}
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={getColorValue(appColors.primary)} />
        <Text style={convertTypographyStyle({
          ...appTypography.body1,
          color: getColorValue(appColors.grey[600]),
          marginTop: 16,
        })}>Cargando intereses...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={convertTypographyStyle({
          ...appTypography.h6,
          color: getColorValue(appColors.text),
          marginBottom: 16,
        })}>Mis Intereses</Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategory)}
        </View>
        
        {selectedInterests.length === 0 && (
          <Text style={convertTypographyStyle({
            ...appTypography.body2,
            color: getColorValue(appColors.grey[500]),
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 16,
          })}>
            Selecciona al menos un interés para personalizar tu experiencia
          </Text>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveInterests}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColorValue(appColors.background),
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getColorValue(appColors.background),
  },
  scrollContent: {
    paddingBottom: 80,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColorValue(appColors.grey[100]),
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: getColorValue(appColors.primary),
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    ...convertTypographyStyle(appTypography.button1),
    color: getColorValue(appColors.grey[700]),
  },
  selectedCategoryText: {
    color: getColorValue(appColors.common.white),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: getColorValue(appColors.background),
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: getColorValue(appColors.grey[200]),
  },
  saveButton: {
    backgroundColor: getColorValue(appColors.primary),
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    ...convertTypographyStyle(appTypography.button1),
    color: getColorValue(appColors.common.white),
  },
}); 