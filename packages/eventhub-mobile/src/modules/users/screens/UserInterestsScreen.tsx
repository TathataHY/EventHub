import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { appColors, appTypography, appSpacing } from '@theme/index';
import { Button } from '@shared/components/ui';
import { userService } from '../services/user.service';
import { InterestCategory } from '../types/user.types';

/**
 * Pantalla para gestionar intereses del usuario
 */
export const UserInterestsScreen = () => {
  const router = useRouter();
  const [interests, setInterests] = useState<InterestCategory[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // Lista completa de categorías disponibles
  const allCategories = Object.values(InterestCategory);

  // Cargar intereses del usuario
  useEffect(() => {
    loadUserInterests();
  }, []);

  const loadUserInterests = async () => {
    try {
      setLoading(true);
      const userInterests = await userService.getUserInterests();
      setInterests(userInterests);
      setSelectedInterests(userInterests);
    } catch (error) {
      console.error('Error al cargar intereses:', error);
      Alert.alert('Error', 'No se pudieron cargar tus intereses. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de interés
  const handleToggleInterest = (interest: InterestCategory) => {
    let newSelectedInterests;
    
    if (selectedInterests.includes(interest)) {
      // Quitar de seleccionados
      newSelectedInterests = selectedInterests.filter(item => item !== interest);
    } else {
      // Añadir a seleccionados
      newSelectedInterests = [...selectedInterests, interest];
    }
    
    setSelectedInterests(newSelectedInterests);
    setIsModified(
      JSON.stringify(newSelectedInterests.sort()) !== 
      JSON.stringify(interests.sort())
    );
  };

  // Guardar los cambios
  const handleSaveInterests = async () => {
    if (!isModified) return;
    
    try {
      setSaving(true);
      await userService.updateUserInterests(selectedInterests);
      
      // Actualizar estado local
      setInterests(selectedInterests);
      setIsModified(false);
      
      Alert.alert('Éxito', 'Tus intereses se han actualizado correctamente.');
    } catch (error) {
      console.error('Error al guardar intereses:', error);
      Alert.alert('Error', 'No se pudieron guardar tus intereses. Inténtalo de nuevo más tarde.');
    } finally {
      setSaving(false);
    }
  };

  // Traducir la categoría para mostrar
  const getCategoryTitle = (category: InterestCategory): string => {
    switch (category) {
      case InterestCategory.MUSIC:
        return 'Música';
      case InterestCategory.SPORTS:
        return 'Deportes';
      case InterestCategory.ARTS:
        return 'Arte y Cultura';
      case InterestCategory.TECHNOLOGY:
        return 'Tecnología';
      case InterestCategory.FOOD:
        return 'Gastronomía';
      case InterestCategory.HEALTH:
        return 'Salud y Bienestar';
      case InterestCategory.BUSINESS:
        return 'Negocios';
      case InterestCategory.EDUCATION:
        return 'Educación';
      case InterestCategory.TRAVEL:
        return 'Viajes';
      case InterestCategory.SOCIAL:
        return 'Eventos Sociales';
      default:
        return category;
    }
  };

  // Obtener icono para la categoría
  const getCategoryIcon = (category: InterestCategory): string => {
    switch (category) {
      case InterestCategory.MUSIC:
        return 'musical-notes';
      case InterestCategory.SPORTS:
        return 'football';
      case InterestCategory.ARTS:
        return 'color-palette';
      case InterestCategory.TECHNOLOGY:
        return 'laptop';
      case InterestCategory.FOOD:
        return 'restaurant';
      case InterestCategory.HEALTH:
        return 'fitness';
      case InterestCategory.BUSINESS:
        return 'briefcase';
      case InterestCategory.EDUCATION:
        return 'school';
      case InterestCategory.TRAVEL:
        return 'airplane';
      case InterestCategory.SOCIAL:
        return 'people';
      default:
        return 'star';
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
        <Text style={styles.loaderText}>Cargando intereses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Intereses</Text>
          <Text style={styles.subtitle}>
            Selecciona las categorías que te interesan para recibir recomendaciones personalizadas
          </Text>
        </View>
        
        <View style={styles.interestsGrid}>
          {allCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryCard,
                selectedInterests.includes(category) && styles.selectedCategory
              ]}
              onPress={() => handleToggleInterest(category)}
            >
              <View style={styles.categoryContent}>
                <Ionicons 
                  name={getCategoryIcon(category)} 
                  size={24} 
                  color={selectedInterests.includes(category) 
                    ? appColors.common.white 
                    : appColors.grey[700]
                  } 
                />
                <Text 
                  style={[
                    styles.categoryTitle,
                    selectedInterests.includes(category) && styles.selectedCategoryText
                  ]}
                >
                  {getCategoryTitle(category)}
                </Text>
              </View>
              
              {selectedInterests.includes(category) && (
                <View style={styles.checkMark}>
                  <Ionicons name="checkmark" size={16} color={appColors.common.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.helperText}>
          {selectedInterests.length === 0 
            ? 'Selecciona al menos una categoría' 
            : `Has seleccionado ${selectedInterests.length} categorías`
          }
        </Text>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          text="Guardar cambios" 
          onPress={handleSaveInterests} 
          disabled={!isModified || saving} 
          loading={saving}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  scrollContent: {
    padding: appSpacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
  },
  loaderText: {
    ...appTypography.body1,
    color: appColors.grey[600],
    marginTop: appSpacing.md,
  },
  header: {
    marginBottom: appSpacing.lg,
  },
  title: {
    ...appTypography.h4,
    color: appColors.text,
    marginBottom: appSpacing.xs,
  },
  subtitle: {
    ...appTypography.body2,
    color: appColors.grey[600],
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: appSpacing.md,
  },
  categoryCard: {
    width: '48%',
    padding: appSpacing.md,
    borderRadius: 8,
    backgroundColor: appColors.common.white,
    marginBottom: appSpacing.md,
    borderWidth: 1,
    borderColor: appColors.grey[200],
    position: 'relative',
    shadowColor: appColors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    ...appTypography.subtitle2,
    color: appColors.text,
    marginLeft: appSpacing.sm,
    flex: 1,
  },
  selectedCategoryText: {
    color: appColors.common.white,
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: appColors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    ...appTypography.caption,
    color: appColors.grey[600],
    textAlign: 'center',
    marginTop: appSpacing.sm,
    marginBottom: appSpacing.lg,
  },
  footer: {
    padding: appSpacing.md,
    borderTopWidth: 1,
    borderTopColor: appColors.grey[200],
    backgroundColor: appColors.common.white,
  },
  saveButton: {
    width: '100%',
  },
}); 