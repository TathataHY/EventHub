import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventCategory as EventCategoryEnum } from '@modules/events/types';
import { useTheme } from '../../../shared/hooks/useTheme';

// Definición de EventType para que coincida con los tipos utilizados en la aplicación
interface EventType {
  id: string;
  name: string;
}

// Definición de la categoría de evento para uso en la interfaz
interface EventCategory {
  id: string;
  name: string;
}

// Interfaz para los filtros de eventos
interface EventFiltersState {
  categories: EventCategory[];
  types: EventType[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  location?: string;
  isFree?: boolean;
}

interface EventFiltersProps {
  onFilterChange: (filters: EventFiltersState) => void;
  initialFilters?: Partial<EventFiltersState>;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  onFilterChange,
  initialFilters = {}
}) => {
  const { theme } = useTheme();
  
  // Estado para los filtros
  const [filters, setFilters] = useState<EventFiltersState>({
    categories: initialFilters.categories || [],
    types: initialFilters.types || [],
    dateRange: initialFilters.dateRange || {},
    location: initialFilters.location,
    isFree: initialFilters.isFree
  });
  
  // Estado para el modal de filtros
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  // Conteo de filtros activos
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.categories.length > 0) count += 1;
    if (filters.types.length > 0) count += 1;
    if (filters.dateRange.from || filters.dateRange.to) count += 1;
    if (filters.location) count += 1;
    if (filters.isFree) count += 1;
    return count;
  };
  
  // Manejar cambio en categorías seleccionadas
  const handleCategoryToggle = (category: EventCategory) => {
    const isSelected = filters.categories.some(c => c.id === category.id);
    const updatedCategories = isSelected 
      ? filters.categories.filter(c => c.id !== category.id)
      : [...filters.categories, category];
    
    updateFilters({ categories: updatedCategories });
  };
  
  // Manejar cambio en tipos seleccionados
  const handleTypeToggle = (type: EventType) => {
    const isSelected = filters.types.some(t => t.id === type.id);
    const updatedTypes = isSelected 
      ? filters.types.filter(t => t.id !== type.id)
      : [...filters.types, type];
    
    updateFilters({ types: updatedTypes });
  };
  
  // Manejar cambio en filtro de gratuito
  const handleFreeToggle = () => {
    updateFilters({ isFree: !filters.isFree });
  };
  
  // Actualizar filtros y notificar al componente padre
  const updateFilters = (newFilters: Partial<EventFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const clearedFilters: EventFiltersState = {
      categories: [],
      types: [],
      dateRange: {},
      location: undefined,
      isFree: undefined
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setModalVisible(false);
  };
  
  // Obtener etiqueta para la categoría
  const getCategoryLabel = (category: EventCategory): string => {
    switch (category.name.toLowerCase()) {
      case 'música':
      case 'musica':
        return 'Música';
      case 'deportes':
        return 'Deportes';
      case 'arte':
        return 'Arte y Cultura';
      case 'tecnología':
      case 'tecnologia':
        return 'Tecnología';
      case 'gastronomía':
      case 'gastronomia':
        return 'Gastronomía';
      case 'educación':
      case 'educacion':
        return 'Educación';
      case 'negocios':
        return 'Negocios';
      case 'salud':
        return 'Salud y Bienestar';
      default:
        return category.name;
    }
  };
  
  // Obtener etiqueta para el tipo de evento
  const getTypeLabel = (type: EventType): string => {
    switch (type.name.toLowerCase()) {
      case 'presencial':
        return 'Presencial';
      case 'online':
        return 'Online';
      case 'híbrido':
      case 'hibrido':
        return 'Híbrido';
      default:
        return type.name;
    }
  };
  
  // Renderizar chips de filtros activos
  const renderActiveFiltersChips = () => {
    const activeFiltersCount = getActiveFilterCount();
    
    if (activeFiltersCount === 0) {
      return (
        <View style={styles.noFiltersContainer}>
          <Text style={[styles.noFiltersText, { color: theme.colors.text.secondary }]}>
            Sin filtros activos
          </Text>
        </View>
      );
    }
    
    return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersChipsContainer}
      >
        {filters.categories.length > 0 && (
          <TouchableOpacity 
            style={[styles.filterChip, { backgroundColor: `${theme.colors.primary.main}20` }]}
            onPress={() => {
              setActiveFilterSection('categories');
              setModalVisible(true);
            }}
          >
            <Text style={[styles.filterChipText, { color: theme.colors.primary.main }]}>
              {filters.categories.length === 1 
                ? getCategoryLabel(filters.categories[0])
                : `Categorías (${filters.categories.length})`}
            </Text>
            <Ionicons name="close-circle" size={16} color={theme.colors.primary.main} />
          </TouchableOpacity>
        )}
        
        {filters.types.length > 0 && (
          <TouchableOpacity 
            style={[styles.filterChip, { backgroundColor: `${theme.colors.info.main}20` }]}
            onPress={() => {
              setActiveFilterSection('types');
              setModalVisible(true);
            }}
          >
            <Text style={[styles.filterChipText, { color: theme.colors.info.main }]}>
              {filters.types.length === 1 
                ? getTypeLabel(filters.types[0])
                : `Tipos (${filters.types.length})`}
            </Text>
            <Ionicons name="close-circle" size={16} color={theme.colors.info.main} />
          </TouchableOpacity>
        )}
        
        {filters.isFree && (
          <TouchableOpacity 
            style={[styles.filterChip, { backgroundColor: `${theme.colors.success.main}20` }]}
            onPress={handleFreeToggle}
          >
            <Text style={[styles.filterChipText, { color: theme.colors.success.main }]}>
              Gratis
            </Text>
            <Ionicons name="close-circle" size={16} color={theme.colors.success.main} />
          </TouchableOpacity>
        )}
        
        {activeFiltersCount > 0 && (
          <TouchableOpacity 
            style={[styles.clearAllChip, { borderColor: theme.colors.error.main }]}
            onPress={clearAllFilters}
          >
            <Text style={[styles.clearAllText, { color: theme.colors.error.main }]}>
              Limpiar todo
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };
  
  // Renderizar sección de categorías
  const renderCategoriesSection = () => {
    // Categorías predefinidas
    const predefinedCategories: EventCategory[] = [
      { id: '1', name: 'Música' },
      { id: '2', name: 'Deportes' },
      { id: '3', name: 'Arte' },
      { id: '4', name: 'Tecnología' },
      { id: '5', name: 'Gastronomía' },
      { id: '6', name: 'Educación' },
      { id: '7', name: 'Negocios' },
      { id: '8', name: 'Salud' }
    ];
    
    return (
      <View style={styles.filterSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Categorías
        </Text>
        <View style={styles.optionsContainer}>
          {predefinedCategories.map(category => {
            const isSelected = filters.categories.some(c => c.id === category.id);
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.optionButton,
                  isSelected && { backgroundColor: theme.colors.primary.main }
                ]}
                onPress={() => handleCategoryToggle(category)}
              >
                <Text style={[
                  styles.optionText,
                  isSelected ? { color: '#FFF' } : { color: theme.colors.text.primary }
                ]}>
                  {getCategoryLabel(category)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  
  // Renderizar sección de tipos de evento
  const renderTypesSection = () => {
    // Tipos predefinidos
    const predefinedTypes: EventType[] = [
      { id: '1', name: 'presencial' },
      { id: '2', name: 'online' },
      { id: '3', name: 'híbrido' }
    ];
    
    return (
      <View style={styles.filterSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Tipo de evento
        </Text>
        <View style={styles.optionsContainer}>
          {predefinedTypes.map(type => {
            const isSelected = filters.types.some(t => t.id === type.id);
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionButton,
                  isSelected && { backgroundColor: theme.colors.info.main }
                ]}
                onPress={() => handleTypeToggle(type)}
              >
                <Text style={[
                  styles.optionText,
                  isSelected ? { color: '#FFF' } : { color: theme.colors.text.primary }
                ]}>
                  {getTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  
  // Renderizar sección de precio
  const renderPriceSection = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Precio
        </Text>
        <TouchableOpacity
          style={[
            styles.toggleButton, 
            filters.isFree && { backgroundColor: theme.colors.success.main }
          ]}
          onPress={handleFreeToggle}
        >
          <View style={styles.toggleRow}>
            <Text style={[
              styles.toggleText, 
              filters.isFree ? { color: '#FFF' } : { color: theme.colors.text.primary }
            ]}>
              Solo eventos gratuitos
            </Text>
            {filters.isFree ? (
              <Ionicons name="checkbox" size={24} color="#FFF" />
            ) : (
              <Ionicons name="square-outline" size={24} color={theme.colors.text.secondary} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Renderizar el botón de filtros
  const renderFilterButton = () => {
    const activeCount = getActiveFilterCount();
    
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeCount > 0 && { backgroundColor: theme.colors.primary.main }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons 
          name="options-outline" 
          size={24} 
          color={activeCount > 0 ? '#FFF' : theme.colors.text.primary} 
        />
        <Text 
          style={[
            styles.filterButtonText,
            activeCount > 0 ? { color: '#FFF' } : { color: theme.colors.text.primary }
          ]}
        >
          Filtros {activeCount > 0 && `(${activeCount})`}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {renderFilterButton()}
        {renderActiveFiltersChips()}
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background.default }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
                Filtros
              </Text>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearAllFilters}
              >
                <Text style={[styles.clearText, { color: theme.colors.error.main }]}>
                  Limpiar
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {renderCategoriesSection()}
              {renderTypesSection()}
              {renderPriceSection()}
            </ScrollView>
            
            <View style={[styles.modalFooter, { borderTopColor: theme.colors.grey[300] }]}>
              <TouchableOpacity 
                style={[styles.applyButton, { backgroundColor: theme.colors.primary.main }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  filtersChipsContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    marginRight: 4,
  },
  clearAllChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  clearAllText: {
    fontSize: 14,
  },
  noFiltersContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  noFiltersText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 14,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 