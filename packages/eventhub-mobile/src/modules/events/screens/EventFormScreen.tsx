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
  EventCategoryEnum,
  EventVisibility,
  CreateEventData,
  EventTicketInfo,
  EventLocation
} from '../types';
import { useTheme, getColorValue, getIconColor } from '../../../core/theme';
import { format, addDays } from 'date-fns';
import { ServiceEvent } from '@modules/events/services/event.service';

interface EventFormScreenProps {
  event?: Event;
  onSave?: (eventId: string) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export const EventFormScreen: React.FC<EventFormScreenProps> = ({
  event,
  onSave,
  onCancel,
  isEditMode = false
}) => {
  const { theme } = useTheme();
  
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
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: '',
    location: '',
    category: EventCategoryEnum.OTHER,
    type: EventType.INPERSON,
    price: 0,
    capacity: 0,
    organizerId: '', // Se debe establecer desde el contexto de autenticación
    ticketInfo: {
      price: 0,
      availableTickets: 0,
      isFree: true,
      currency: 'EUR'
    }
  });

  // Estados para los date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Estado para los errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Cargar datos del evento si estamos en modo edición
  useEffect(() => {
    if (isEditMode && event) {
      // Usar la función setFormFieldsFromEvent que ya maneja ServiceEvent
      setFormFieldsFromEvent(event as ServiceEvent);
    }
  }, [event, isEditMode]);

  // Manejar cambios en campos simples
  const handleChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Limpiar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manejar cambios en objetos anidados
  const handleNestedChange = (parent: keyof CreateEventData, field: string, value: any) => {
    setFormData(prevData => {
      // Asegurarse que prevData[parent] sea un objeto
      const parentData = prevData[parent] || {};
      if (typeof parentData === 'object') {
        return {
          ...prevData,
          [parent]: {
            ...parentData,
            [field]: value
          }
        };
      }
      // Si no es un objeto, simplemente devolver los datos anteriores
      return prevData;
    });
    
    const errorKey = `${parent}.${field}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Manejar cambio en "Evento gratuito"
  const handleFreeToggle = (isFree: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      ticketInfo: {
        ...prevData.ticketInfo as EventTicketInfo,
        isFree,
        price: isFree ? 0 : prevData.ticketInfo?.price || 0
      }
    }));
  };

  // Manejar cambios de fecha
  const handleDateChange = (field: 'startDate' | 'endDate', date?: Date) => {
    if (!date) return;
    
    const isoDate = date.toISOString();
    
    setFormData(prevData => ({
      ...prevData,
      [field]: isoDate
    }));
    
    if (field === 'startDate') {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
    
    // Limpiar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No seleccionada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Validar formulario antes de enviar
  const validate = (): boolean => {
    const result = validateEvent(formData);
    
    if (!result.isValid) {
      const errors: Record<string, string> = {};
      result.errors.forEach(error => {
        errors[error.field] = error.message;
      });
      
      setValidationErrors(errors);
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Error de validación', 'Por favor, completa correctamente todos los campos requeridos.');
      return;
    }
    
    try {
      // Crear o actualizar según el caso
      let eventId: string | null;
      
      if (isEditMode && event?.id) {
        eventId = await updateEvent(event.id, formData);
      } else {
        eventId = await createEvent(formData);
      }
      
      if (eventId && onSave) {
        onSave(eventId);
      }
    } catch (error) {
      console.error('Error al guardar evento:', error);
      Alert.alert('Error', 'No se pudo guardar el evento. Inténtalo de nuevo.');
    }
  };

  // Manejar eliminación del evento
  const handleDelete = () => {
    if (!event?.id) return;
    
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteEvent(event.id);
              if (success && onCancel) {
                onCancel();
              }
            } catch (error) {
              console.error('Error al eliminar evento:', error);
              Alert.alert('Error', 'No se pudo eliminar el evento. Inténtalo de nuevo.');
            }
          }
        }
      ]
    );
  };

  // Utilidad para crear colores con opacidad
  const withOpacity = (color: any, opacity: string) => {
    return `${String(color)}${opacity}`;
  };

  // Función para obtener el color de la categoría seleccionada
  const getSelectedCategoryColor = (category: string, selectedCategory?: string) => {
    return category === selectedCategory ? 'active' : 'inactive';
  };

  // Obtener el icono para una categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case EventCategoryEnum.MUSIC:
        return 'musical-notes-outline';
      case EventCategoryEnum.SPORTS:
        return 'football-outline';
      case EventCategoryEnum.ARTS:
        return 'color-palette-outline';
      case EventCategoryEnum.BUSINESS:
        return 'briefcase-outline';
      case EventCategoryEnum.FOOD:
        return 'restaurant-outline';
      case EventCategoryEnum.TECHNOLOGY:
        return 'hardware-chip-outline';
      case EventCategoryEnum.LIFESTYLE:
        return 'leaf-outline';
      case EventCategoryEnum.EDUCATION:
        return 'book-outline';
      case EventCategoryEnum.OTHER:
      default:
        return 'pricetag-outline';
    }
  };

  // Actualizar la función setFormFieldsFromEvent para usar ServiceEvent
  const setFormFieldsFromEvent = (event: ServiceEvent | null) => {
    if (!event) return;
    
    const formData: CreateEventData = {
      title: event.title || '',
      description: event.description || '',
      location: typeof event.location === 'string' ? event.location : event.location?.address || '',
      startDate: event.startDate || new Date().toISOString(),
      endDate: event.endDate || new Date().toISOString(),
      category: event.category?.toString() || EventCategoryEnum.OTHER,
      type: (event.type as EventType) || EventType.INPERSON,
      organizerId: String(event.organizerId) || '',
      capacity: event.metrics?.maxCapacity || 0,
      imageUrl: event.imageUrl || '',
      ticketInfo: {
        price: event.ticketInfo?.price || 0,
        availableTickets: event.ticketInfo?.availableTickets || 0,
        isFree: event.ticketInfo?.isFree || true,
        currency: event.ticketInfo?.currency || 'MXN'
      }
    };
    
    setFormData(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Título del formulario */}
        <Text style={[styles.formTitle, { color: getColorValue(theme.colors.text.primary) }]}>
          {isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </Text>
        
        {/* Campos del formulario */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Información Básica
          </Text>
          
          {/* Título */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Título *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: validationErrors.title
                    ? getColorValue(theme.colors.error)
                    : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              placeholder="Ej. Conferencia sobre Desarrollo Web"
              placeholderTextColor={withOpacity(getColorValue(theme.colors.text.secondary), '80')}
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
            />
            {validationErrors.title && (
              <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                {validationErrors.title}
              </Text>
            )}
          </View>
          
          {/* Descripción */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Descripción *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                { 
                  borderColor: validationErrors.description
                    ? getColorValue(theme.colors.error)
                    : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              placeholder="Describe tu evento..."
              placeholderTextColor={withOpacity(getColorValue(theme.colors.text.secondary), '80')}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {validationErrors.description && (
              <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                {validationErrors.description}
              </Text>
            )}
          </View>
        </View>
        
        {/* Fecha y Hora */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Fecha y Hora
          </Text>
          
          {/* Fecha de inicio */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Fecha de inicio *
            </Text>
            <TouchableOpacity
              style={[
                styles.datePickerButton,
                { 
                  borderColor: validationErrors.startDate
                    ? getColorValue(theme.colors.error)
                    : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={getIconColor(theme.colors.primary)} />
              <Text style={[styles.dateText, { color: getColorValue(theme.colors.text.primary) }]}>
                {formatDate(formData.startDate)}
              </Text>
            </TouchableOpacity>
            {validationErrors.startDate && (
              <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                {validationErrors.startDate}
              </Text>
            )}
            
            {/* Date Picker para fecha de inicio */}
            {showStartDatePicker && (
              <DateTimePicker
                value={new Date(formData.startDate || new Date())}
                mode="datetime"
                display="default"
                onChange={(event, date) => handleDateChange('startDate', date)}
              />
            )}
          </View>
          
          {/* Fecha de fin */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Fecha de fin (opcional)
            </Text>
            <TouchableOpacity
              style={[
                styles.datePickerButton,
                { 
                  borderColor: validationErrors.endDate
                    ? getColorValue(theme.colors.error)
                    : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={getIconColor(theme.colors.primary)} />
              <Text style={[styles.dateText, { color: getColorValue(theme.colors.text.primary) }]}>
                {formData.endDate ? formatDate(formData.endDate) : 'No seleccionada'}
              </Text>
            </TouchableOpacity>
            {validationErrors.endDate && (
              <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                {validationErrors.endDate}
              </Text>
            )}
            
            {/* Date Picker para fecha de fin */}
            {showEndDatePicker && (
              <DateTimePicker
                value={new Date(formData.endDate || formData.startDate || new Date())}
                mode="datetime"
                display="default"
                onChange={(event, date) => handleDateChange('endDate', date)}
              />
            )}
          </View>
        </View>
        
        {/* Ubicación */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Ubicación
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Dirección *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  borderColor: validationErrors.location
                    ? getColorValue(theme.colors.error)
                    : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              placeholder="Ej. Calle Ejemplo 123, Madrid"
              placeholderTextColor={withOpacity(getColorValue(theme.colors.text.secondary), '80')}
              value={typeof formData.location === 'string' ? formData.location : ''}
              onChangeText={(text) => handleChange('location', text)}
            />
            {validationErrors.location && (
              <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                {validationErrors.location}
              </Text>
            )}
          </View>
        </View>
        
        {/* Categoría y Tipo */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Categoría y Tipo
          </Text>
          
          {/* Categoría */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Categoría
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {Object.values(EventCategoryEnum).map((category) => (
                  <TouchableOpacity
                    key={String(category)}
                    onPress={() => handleChange('category', category)}
                    style={[
                      styles.categoryButton,
                      getSelectedCategoryColor(String(category), formData.category) === 'active'
                        ? { 
                            backgroundColor: getColorValue(theme.colors.primary),
                            borderColor: getColorValue(theme.colors.primary)
                          }
                        : {
                            backgroundColor: getColorValue(theme.colors.background),
                            borderColor: getSelectedCategoryColor(String(category), formData.category) === 'active'
                              ? getColorValue(theme.colors.primary)
                              : getColorValue(theme.colors.border)
                          }
                    ]}
                  >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}>
                      <Text style={{
                        color: getSelectedCategoryColor(String(category), formData.category) === 'active'
                          ? getColorValue(theme.colors.primary.contrastText)
                          : getColorValue(theme.colors.text.primary),
                        fontWeight: 'bold'
                      }}>
                        {getCategoryLabel(String(category))}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Tipo de evento */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Tipo de evento
            </Text>
            <View style={styles.typeContainer}>
              {Object.values(EventType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && { 
                      backgroundColor: withOpacity(getColorValue(theme.colors.primary), '20'),
                      borderColor: getColorValue(theme.colors.primary)
                    }
                  ]}
                  onPress={() => handleChange('type', type)}
                >
                  <Text 
                    style={[
                      styles.typeText, 
                      { 
                        color: formData.type === type 
                          ? getColorValue(theme.colors.primary)
                          : getColorValue(theme.colors.text.primary)
                      }
                    ]}
                  >
                    {getTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Entradas */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Información de Entradas
          </Text>
          
          {/* Evento gratuito */}
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Evento gratuito
            </Text>
            <Switch
              value={formData.ticketInfo?.isFree}
              onValueChange={handleFreeToggle}
              trackColor={{ 
                false: withOpacity(getColorValue(theme.colors.text.secondary), '40'), 
                true: withOpacity(getColorValue(theme.colors.success), '70')
              }}
              thumbColor={
                formData.ticketInfo?.isFree 
                  ? getColorValue(theme.colors.success) 
                  : getColorValue(theme.colors.text.secondary)
              }
            />
          </View>
          
          {/* Precio (si no es gratuito) */}
          {!formData.ticketInfo?.isFree && (
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
                Precio (EUR)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    borderColor: validationErrors['ticketInfo.price']
                      ? getColorValue(theme.colors.error)
                      : withOpacity(getColorValue(theme.colors.text.secondary), '40')
                  }
                ]}
                placeholder="0.00"
                placeholderTextColor={withOpacity(getColorValue(theme.colors.text.secondary), '80')}
                value={formData.ticketInfo?.price?.toString() || '0'}
                onChangeText={(text) => {
                  const price = parseFloat(text) || 0;
                  handleNestedChange('ticketInfo', 'price', price);
                }}
                keyboardType="numeric"
              />
              {validationErrors['ticketInfo.price'] && (
                <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                  {validationErrors['ticketInfo.price']}
                </Text>
              )}
            </View>
          )}
          
          {/* Capacidad */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: getColorValue(theme.colors.text.primary) }]}>
              Capacidad máxima
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  borderColor: withOpacity(getColorValue(theme.colors.text.secondary), '40')
                }
              ]}
              placeholder="Ej. 100"
              placeholderTextColor={withOpacity(getColorValue(theme.colors.text.secondary), '80')}
              value={formData.capacity?.toString() || ''}
              onChangeText={(text) => {
                const capacity = parseInt(text) || 0;
                handleChange('capacity', capacity);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={getColorValue(theme.colors.primary)} />
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: getColorValue(theme.colors.primary) }
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {isEditMode ? 'Guardar Cambios' : 'Crear Evento'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { borderColor: getColorValue(theme.colors.text.secondary) }
                ]}
                onPress={onCancel}
              >
                <Text style={[styles.cancelButtonText, { color: getColorValue(theme.colors.text.secondary) }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              {isEditMode && event?.id && (
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: getColorValue(theme.colors.error) }
                  ]}
                  onPress={handleDelete}
                >
                  <Text style={styles.buttonText}>
                    Eliminar Evento
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        
        {/* Mensaje de error */}
        {error && (
          <Text style={[styles.errorMessage, { color: getColorValue(theme.colors.error) }]}>
            {error}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Utilidad para obtener el label de una categoría
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case EventCategoryEnum.MUSIC:
      return "Música";
    case EventCategoryEnum.SPORTS:
      return "Deportes";
    case EventCategoryEnum.ARTS:
      return "Arte y Cultura";
    case EventCategoryEnum.BUSINESS:
      return "Negocios";
    case EventCategoryEnum.FOOD:
      return "Gastronomía";
    case EventCategoryEnum.TECHNOLOGY:
      return "Tecnología";
    case EventCategoryEnum.LIFESTYLE:
      return "Estilo de Vida";
    case EventCategoryEnum.EDUCATION:
      return "Educación";
    case EventCategoryEnum.OTHER:
      return "Otro";
    default:
      return "Categoría";
  }
};

// Utilidad para obtener el label del tipo de evento
const getTypeLabel = (type: EventType): string => {
  switch (type) {
    case EventType.INPERSON:
      return 'Presencial';
    case EventType.ONLINE:
      return 'En línea';
    case EventType.HYBRID:
      return 'Híbrido';
    default:
      return 'Desconocido';
  }
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  actionsContainer: {
    marginTop: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -4,
  },
}); 