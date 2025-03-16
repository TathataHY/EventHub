import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { eventService } from '../src/services/event.service';

// Esquema de validación
const EventoSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: Yup.string()
    .required('La descripción es obligatoria')
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  location: Yup.string()
    .required('La ubicación es obligatoria'),
  category: Yup.string()
    .required('La categoría es obligatoria'),
  startDate: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .min(new Date(), 'La fecha de inicio debe ser en el futuro'),
  capacity: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, 'La capacidad debe ser al menos 1')
    .max(10000, 'La capacidad no puede exceder 10000'),
  imageUrl: Yup.string()
    .url('Debe ser una URL válida')
    .nullable(),
});

// Categorías disponibles
const categorias = [
  'Música', 
  'Deportes', 
  'Tecnología', 
  'Arte', 
  'Gastronomía', 
  'Educación', 
  'Negocios',
  'Social',
  'Otro'
];

export default function CrearEvento() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  // Manejar la creación del evento
  const handleCreateEvent = async (values, { setSubmitting }) => {
    try {
      const response = await eventService.createEvent(values);
      Alert.alert(
        'Éxito',
        'El evento ha sido creado correctamente',
        [
          { 
            text: 'Ver evento', 
            onPress: () => router.push(`/evento/${response.id}`) 
          },
          { 
            text: 'Volver a eventos', 
            onPress: () => router.replace('/tabs/eventos') 
          }
        ]
      );
    } catch (error) {
      console.error('Error al crear evento:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el evento. Por favor, inténtalo de nuevo más tarde.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  // Formatear hora para mostrar
  const formatTime = (date) => {
    return format(date, 'HH:mm', { locale: es });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Evento</Text>
        </View>

        <Formik
          initialValues={{
            title: '',
            description: '',
            location: '',
            category: '',
            startDate: new Date(Date.now() + 86400000), // Mañana
            capacity: '',
            imageUrl: '',
          }}
          validationSchema={EventoSchema}
          onSubmit={handleCreateEvent}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título del evento *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Concierto de rock en vivo"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                />
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe tu evento..."
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ubicación *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Teatro Municipal, Calle Principal 123"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                />
                {touched.location && errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoría *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCategories(!showCategories)}
                >
                  <Text style={values.category ? styles.inputText : styles.placeholderText}>
                    {values.category || 'Selecciona una categoría'}
                  </Text>
                  <FontAwesome name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                {showCategories && (
                  <View style={styles.categoriesList}>
                    {categorias.map((categoria) => (
                      <TouchableOpacity
                        key={categoria}
                        style={styles.categoryItem}
                        onPress={() => {
                          setFieldValue('category', categoria);
                          setSelectedCategory(categoria);
                          setShowCategories(false);
                        }}
                      >
                        <Text style={[
                          styles.categoryText,
                          values.category === categoria && styles.selectedCategoryText
                        ]}>
                          {categoria}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {touched.category && errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de inicio *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.inputText}>
                    {formatDate(values.startDate)}
                  </Text>
                  <FontAwesome name="calendar" size={16} color="#666" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={values.startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        // Mantener la hora actual al cambiar la fecha
                        const currentHours = values.startDate.getHours();
                        const currentMinutes = values.startDate.getMinutes();
                        selectedDate.setHours(currentHours);
                        selectedDate.setMinutes(currentMinutes);
                        setFieldValue('startDate', selectedDate);
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hora de inicio *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.inputText}>
                    {formatTime(values.startDate)}
                  </Text>
                  <FontAwesome name="clock-o" size={16} color="#666" />
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={values.startDate}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        setFieldValue('startDate', selectedTime);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Capacidad (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Número máximo de asistentes"
                  value={values.capacity}
                  onChangeText={handleChange('capacity')}
                  onBlur={handleBlur('capacity')}
                  keyboardType="numeric"
                />
                {touched.capacity && errors.capacity && (
                  <Text style={styles.errorText}>{errors.capacity}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL de imagen (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={values.imageUrl}
                  onChangeText={handleChange('imageUrl')}
                  onBlur={handleBlur('imageUrl')}
                />
                {touched.imageUrl && errors.imageUrl && (
                  <Text style={styles.errorText}>{errors.imageUrl}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <FontAwesome name="plus-circle" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.submitButtonText}>Crear Evento</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  categoriesList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#4a80f5',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});