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
import { EventCategory, EventType } from '../types';
import { colors } from '@theme';

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
    if (filters.categories.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.location) count++;
    if (filters.isFree !== undefined) count++;
    return count;
  };
  
  // Manejar cambios en la categoría
  const handleCategoryToggle = (category: EventCategory) => {
    let newCategories: EventCategory[];
    
    if (filters.categories.includes(category)) {
      newCategories = filters.categories.filter(c => c !== category);
    } else {
      newCategories = [...filters.categories, category];
    }
    
    updateFilters({ categories: newCategories });
  };
  
  // Manejar cambios en el tipo de evento
  const handleTypeToggle = (type: EventType) => {
    let newTypes: EventType[];
    
    if (filters.types.includes(type)) {
      newTypes = filters.types.filter(t => t !== type);
    } else {
      newTypes = [...filters.types, type];
    }
    
    updateFilters({ types: newTypes });
  };
  
  // Manejar cambios en el precio (gratis o no)
  const handleFreeToggle = () => {
    updateFilters({ isFree: !filters.isFree });
  };
  
  // Actualizar filtros y notificar
  const updateFilters = (newFilters: Partial<EventFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const emptyFilters: EventFiltersState = {
      categories: [],
      types: [],
      dateRange: {},
      location: undefined,
      isFree: undefined
    };
    
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setModalVisible(false);
  };
  
  // Obtener etiqueta para la categoría
  const getCategoryLabel = (category: EventCategory): string => {
    switch (category) {
      case EventCategory.MUSIC:
        return 'Música';
      case EventCategory.BUSINESS:
        return 'Negocios';
      case EventCategory.FOOD:
        return 'Gastronomía';
      case EventCategory.ARTS:
        return 'Arte y Cultura';
      case EventCategory.SPORTS:
        return 'Deportes';
      case EventCategory.HEALTH:
        return 'Salud y Bienestar';
      case EventCategory.EDUCATION:
        return 'Educación';
      case EventCategory.TECHNOLOGY:
        return 'Tecnología';
      case EventCategory.OTHER:
        return 'Otros';
      default:
        return 'Desconocido';
    }
  };
  
  // Obtener etiqueta para el tipo de evento
  const getTypeLabel = (type: EventType): string => {
    switch (type) {
      case EventType.CONFERENCE:
        return 'Conferencia';
      case EventType.WORKSHOP:
        return 'Taller';
      case EventType.MEETUP:
        return 'Encuentro';
      default:
        return 'Desconocido';
    }
  };
  
  // Renderizar chips de filtros activos
  const renderActiveFiltersChips = () => {
    const activeFilterCount = getActiveFilterCount();
    
    if (activeFilterCount === 0) {
      return (
        <View style={styles.noFiltersContainer}>
          <Text style={styles.noFiltersText}>Sin filtros activos</Text>
        </View>
      );
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {filters.categories.map((category) => (
          <TouchableOpacity
            key={`category-${category}`}
            style={styles.filterChip}
            onPress={() => handleCategoryToggle(category)}
          >
            <Text style={styles.chipText}>{getCategoryLabel(category)}</Text>
            <Ionicons name="close-circle" size={16} color={colors.textLight} />
          </TouchableOpacity>
        ))}
        
        {filters.types.map((type) => (
          <TouchableOpacity
            key={`type-${type}`}
            style={styles.filterChip}
            onPress={() => handleTypeToggle(type)}
          >
            <Text style={styles.chipText}>{getTypeLabel(type)}</Text>
            <Ionicons name="close-circle" size={16} color={colors.textLight} />
          </TouchableOpacity>
        ))}
        
        {filters.isFree && (
          <TouchableOpacity
            style={styles.filterChip}
            onPress={handleFreeToggle}
          >
            <Text style={styles.chipText}>Gratuito</Text>
            <Ionicons name="close-circle" size={16} color={colors.textLight} />
          </TouchableOpacity>
        )}
        
        {/* Botón para limpiar todos los filtros */}
        {activeFilterCount > 1 && (
          <TouchableOpacity
            style={styles.clearAllChip}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearAllText}>Limpiar todos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };
  
  // Renderizar sección de categorías
  const renderCategoriesSection = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoriesContainer}>
          {Object.values(EventCategory).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                filters.categories.includes(category) && styles.categorySelected
              ]}
              onPress={() => handleCategoryToggle(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  filters.categories.includes(category) && styles.categoryTextSelected
                ]}
              >
                {getCategoryLabel(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  // Renderizar sección de tipos de evento
  const renderTypesSection = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Tipos de evento</Text>
        <View style={styles.typesContainer}>
          {Object.values(EventType).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                filters.types.includes(type) && styles.typeSelected
              ]}
              onPress={() => handleTypeToggle(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  filters.types.includes(type) && styles.typeTextSelected
                ]}
              >
                {getTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  // Renderizar sección de precio
  const renderPriceSection = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Precio</Text>
        <TouchableOpacity
          style={[
            styles.priceButton,
            filters.isFree && styles.priceSelected
          ]}
          onPress={handleFreeToggle}
        >
          <Text
            style={[
              styles.priceText,
              filters.isFree && styles.priceTextSelected
            ]}
          >
            Solo eventos gratuitos
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filtros</Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Área para mostrar los filtros activos como chips */}
      {renderActiveFiltersChips()}
      
      {/* Modal de filtros */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar eventos</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              {renderCategoriesSection()}
              {renderTypesSection()}
              {renderPriceSection()}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearButtonText}>Limpiar filtros</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyButton}
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
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  filterButtonText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  filterCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noFiltersText: {
    color: colors.textLight,
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    color: colors.textDark,
    marginRight: 6,
  },
  clearAllChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: colors.danger,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 16,
  },
  filterSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.cardBackground,
  },
  categorySelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textDark,
  },
  categoryTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.cardBackground,
  },
  typeSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeText: {
    color: colors.textDark,
  },
  typeTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  priceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  priceSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  priceText: {
    color: colors.textDark,
  },
  priceTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    color: colors.textDark,
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 