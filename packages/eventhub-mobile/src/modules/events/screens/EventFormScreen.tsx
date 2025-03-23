import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useEventCreation } from '../hooks/useEventCreation';
import {
  Event,
  EventType,
  EventCategory,
  EventVisibility,
  CreateEventParams
} from '../types';
import { colors } from '@theme/base/colors';

interface EventFormScreenProps {
  event?: Event;
  onSave?: (eventId: string | number) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export const EventFormScreen: React.FC<EventFormScreenProps> = ({
  event,
  onSave,
  onCancel
}) => {
  // Hook para gestionar la creación/edición
  const {
    isLoading,
    error,
    success,
    createEvent,
    updateEvent,
    deleteEvent,
    validateEvent
  } = useEventCreation();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<CreateEventParams>({
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    location: '',
    category: EventCategory.OTHER,
    type: EventType.IN_PERSON,
    visibility: EventVisibility.PUBLIC,
    ticketInfo: {
      isFree: true,
      price: 0,
      currency: 'EUR'
    }
  });

  // Estados para los date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Estado para los errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Cargar datos del evento si estamos editando
  useEffect(() => {
    if (event) {
      const eventData: CreateEventParams = {
        title: event.title,
        description: event.description,
        startDate: event.startDate ? new Date(event.startDate).toISOString() : new Date().toISOString(),
        endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
        location: event.location,
        category: event.category || EventCategory.OTHER,
        type: event.type as EventType || EventType.IN_PERSON,
        visibility: event.visibility as EventVisibility || EventVisibility.PUBLIC,
        ticketInfo: event.ticketInfo || {
          isFree: true,
          price: 0,
          currency: 'EUR'
        },
        websiteUrl: event.websiteUrl,
        imageUrl: event.imageUrl,
        tags: event.tags,
        capacity: event.metrics?.maxCapacity
      };
      
      setFormData(eventData);
    }
  }, [event]);

  // Actualizar un campo del formulario
  const handleChange = (field: keyof CreateEventParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error de validación al cambiar un campo
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Actualizar campos anidados
  const handleNestedChange = (parent: keyof CreateEventParams, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Gestionar cambios en el tipo de entrada (gratis o de pago)
  const handleFreeToggle = (isFree: boolean) => {
    setFormData(prev => ({
      ...prev,
      ticketInfo: {
        ...prev.ticketInfo,
        isFree,
        price: isFree ? 0 : prev.ticketInfo?.price || 0
      }
    }));
  };

  // Cambios en fechas
  const handleDateChange = (field: 'startDate' | 'endDate', date?: Date) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date.toISOString()
      }));
    }
    
    if (field === 'startDate') {
      setShowStartDatePicker(false);
      setShowStartTimePicker(Platform.OS === 'ios');
    } else {
      setShowEndDatePicker(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date?: Date): string => {
    if (!date) return 'Seleccionar fecha';
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    } as Intl.DateTimeFormatOptions;
    
    return date.toLocaleDateString('es-ES', options);
  };

  // Validar formulario antes de enviar
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const result = validateEvent(formData);
    
    if (!result.isValid) {
      result.errors.forEach(err => {
        errors[err.field] = err.message;
      });
      
      setValidationErrors(errors);
      return false;
    }
    
    return true;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    try {
      if (!validate()) {
        // Mensaje de error para el primer error de validación
        const firstError = Object.values(validationErrors)[0];
        Alert.alert('Error de validación', firstError);
        return;
      }
      
      let eventId;
      if (event) {
        // Actualizar evento existente
        eventId = await updateEvent(event.id, formData);
      } else {
        // Crear nuevo evento
        eventId = await createEvent(formData);
      }
      
      if (onSave && eventId) {
        onSave(eventId);
      }
    } catch (err) {
      console.error('Error saving event:', err);
      Alert.alert(
        'Error',
        'No se pudo guardar el evento. Inténtelo de nuevo más tarde.'
      );
    }
  };

  // Eliminar evento
  const handleDelete = () => {
    if (!event) return;
    
    Alert.alert(
      'Eliminar evento',
      '¿Está seguro que desea eliminar este evento? Esta acción no se puede deshacer.',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event.id);
              if (onCancel) {
                onCancel();
              }
            } catch (err) {
              console.error('Error deleting event:', err);
              Alert.alert(
                'Error',
                'No se pudo eliminar el evento. Inténtelo de nuevo más tarde.'
              );
            }
          }
        }
      ]
    );
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>
          {event ? 'Actualizando evento...' : 'Creando evento...'}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.title ? styles.inputError : null
            ]}
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="Título del evento"
            placeholderTextColor={colors.grey[400]}
            maxLength={100}
          />
          {validationErrors.title && (
            <Text style={styles.errorText}>{validationErrors.title}</Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[
              styles.textArea,
              validationErrors.description ? styles.inputError : null
            ]}
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            placeholder="Describe tu evento..."
            placeholderTextColor={colors.grey[400]}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {validationErrors.description && (
            <Text style={styles.errorText}>{validationErrors.description}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de inicio *</Text>
          <TouchableOpacity
            style={[styles.dateButton, showStartDatePicker && styles.dateButtonSelected]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={[styles.dateText, showStartDatePicker && styles.dateTextSelected]}>
              {formatDate(formData.startDate ? new Date(formData.startDate) : undefined)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.primary.main} />
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={formData.startDate ? new Date(formData.startDate) : new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => handleDateChange('startDate', date)}
            />
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de finalización (opcional)</Text>
          <TouchableOpacity
            style={[styles.dateButton, showEndDatePicker && styles.dateButtonSelected]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={[styles.dateText, showEndDatePicker && styles.dateTextSelected]}>
              {formData.endDate ? formatDate(formData.endDate ? new Date(formData.endDate) : undefined) : 'Seleccionar fecha'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.primary.main} />
          </TouchableOpacity>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate ? new Date(formData.endDate) : new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => handleDateChange('endDate', date)}
              minimumDate={formData.startDate ? new Date(formData.startDate) : undefined}
            />
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación *</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.location ? styles.inputError : null
            ]}
            value={typeof formData.location === 'string' ? formData.location : ''}
            onChangeText={(value) => handleChange('location', value)}
            placeholder="Dirección o ubicación del evento"
            placeholderTextColor={colors.grey[400]}
          />
          {validationErrors.location && (
            <Text style={styles.errorText}>{validationErrors.location}</Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(EventCategory).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.categorySelected
                  ]}
                  onPress={() => handleChange('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextSelected
                    ]}
                  >
                    {getCategoryLabel(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de evento *</Text>
          <View style={styles.pickerContainer}>
            {Object.values(EventType).map((type) => (
              <TouchableOpacity
                key={type.toString()}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.typeSelected
                ]}
                onPress={() => handleChange('type', type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.type === type && styles.typeTextSelected
                  ]}
                >
                  {getTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Entrada</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Evento gratuito</Text>
            <Switch
              value={formData.ticketInfo?.isFree}
              onValueChange={handleFreeToggle}
              trackColor={{ false: colors.grey[200], true: colors.primary.light }}
              thumbColor={formData.ticketInfo?.isFree ? colors.primary.main : colors.grey[300]}
            />
          </View>
          
          {!formData.ticketInfo?.isFree && (
            <View style={styles.priceContainer}>
              <TextInput
                style={styles.priceInput}
                value={formData.ticketInfo?.price?.toString() || '0'}
                onChangeText={(value) => 
                  handleNestedChange('ticketInfo', 'price', parseFloat(value) || 0)
                }
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.grey[400]}
              />
              
              <TextInput
                style={styles.currencyInput}
                value={formData.ticketInfo?.currency || 'EUR'}
                onChangeText={(value) => 
                  handleNestedChange('ticketInfo', 'currency', value)
                }
                placeholder="EUR"
                placeholderTextColor={colors.grey[400]}
                maxLength={3}
              />
            </View>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Visibilidad</Text>
          <View style={styles.pickerContainer}>
            {Object.values(EventVisibility).map((visibility) => (
              <TouchableOpacity
                key={visibility.toString()}
                style={[
                  styles.visibilityButton,
                  formData.visibility === visibility && styles.visibilitySelected
                ]}
                onPress={() => handleChange('visibility', visibility)}
              >
                <Text
                  style={[
                    styles.visibilityText,
                    formData.visibility === visibility && styles.visibilityTextSelected
                  ]}
                >
                  {getVisibilityLabel(visibility)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sitio web (opcional)</Text>
          <TextInput
            style={styles.input}
            value={formData.websiteUrl || ''}
            onChangeText={(value) => handleChange('websiteUrl', value)}
            placeholder="https://www.ejemplo.com"
            placeholderTextColor={colors.grey[400]}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Capacidad máxima (opcional)</Text>
          <TextInput
            style={styles.input}
            value={formData.capacity?.toString() || ''}
            onChangeText={(value) => 
              handleChange('capacity', value ? parseInt(value, 10) : undefined)
            }
            placeholder="Número de asistentes permitidos"
            placeholderTextColor={colors.grey[400]}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.buttonGroup}>
          {event && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color="white" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>
              {event ? 'Actualizar evento' : 'Crear evento'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Función para obtener la etiqueta de la categoría
const getCategoryLabel = (category: EventCategory): string => {
  switch (category) {
    case EventCategory.MUSIC:
      return 'Música';
    case EventCategory.BUSINESS:
      return 'Negocios';
    case EventCategory.FOOD:
      return 'Gastronomía';
    case EventCategory.ART:
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

// Función para obtener la etiqueta del tipo de evento
const getTypeLabel = (type: EventType): string => {
  switch (type) {
    case EventType.IN_PERSON:
      return 'Presencial';
    case EventType.ONLINE:
      return 'En línea';
    case EventType.HYBRID:
      return 'Híbrido';
    default:
      return 'Desconocido';
  }
};

// Función para obtener la etiqueta de visibilidad
const getVisibilityLabel = (visibility: EventVisibility): string => {
  switch (visibility) {
    case EventVisibility.PUBLIC:
      return 'Público';
    case EventVisibility.PRIVATE:
      return 'Privado';
    case EventVisibility.UNLISTED:
      return 'No listado';
    default:
      return 'Desconocido';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#333333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderColor: colors.grey[300],
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: colors.error.main,
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderColor: colors.grey[300],
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#333333',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderColor: colors.grey[300],
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  dateButtonSelected: {
    borderColor: colors.primary.main,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  dateTextSelected: {
    color: colors.primary.main,
  },
  pickerContainer: {
    height: 200,
    marginTop: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderColor: colors.grey[300],
  },
  categorySelected: {
    borderColor: colors.primary.main,
  },
  categoryText: {
    fontSize: 16,
    color: '#333333',
  },
  categoryTextSelected: {
    color: colors.primary.main,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 16,
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderColor: colors.grey[300],
  },
  typeSelected: {
    borderColor: colors.primary.main,
  },
  typeText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
  },
  typeTextSelected: {
    color: colors.primary.main,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceInput: {
    flex: 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 12,
    fontSize: 16,
    color: '#333333',
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  visibilityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  visibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderColor: colors.grey[300],
  },
  visibilitySelected: {
    borderColor: colors.primary.main,
  },
  visibilityText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.text.primary,
  },
  visibilityTextSelected: {
    color: colors.primary.main,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: colors.grey[200],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error.main,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 'auto',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
}); 