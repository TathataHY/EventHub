import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider } from '../../src/components/common/Divider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddEventScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Categorías disponibles
  const categories = [
    { id: 1, name: 'Música' },
    { id: 2, name: 'Deportes' },
    { id: 3, name: 'Arte' },
    { id: 4, name: 'Gastronomía' },
    { id: 5, name: 'Tecnología' },
  ];

  // Validación de formulario
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'La ubicación es obligatoria');
      return false;
    }
    if (!category) {
      Alert.alert('Error', 'Selecciona una categoría');
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Formato de fecha y hora para el evento
    const eventDate = new Date(date);
    eventDate.setHours(time.getHours(), time.getMinutes());

    const eventData = {
      title,
      description,
      location,
      date: eventDate.toISOString(),
      price: price || 'Gratis',
      capacity: parseInt(capacity) || null,
      category,
    };

    // Simulamos una petición a la API
    setTimeout(() => {
      console.log('Evento creado:', eventData);
      setIsLoading(false);
      
      Alert.alert(
        'Éxito',
        'El evento ha sido creado correctamente',
        [
          {
            text: 'Ver eventos',
            onPress: () => router.push('/events'),
          },
          {
            text: 'Crear otro evento',
            onPress: () => {
              // Limpiar el formulario
              setTitle('');
              setDescription('');
              setLocation('');
              setDate(new Date());
              setTime(new Date());
              setPrice('');
              setCapacity('');
              setCategory('');
            },
          },
        ]
      );
    }, 1500);
  };

  // Manejar cambio de fecha
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Manejar cambio de hora
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Formatear hora para mostrar
  const formatTime = (time) => {
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Crear nuevo evento
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* Título */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Título*
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Título del evento"
              placeholderTextColor={theme.colors.secondaryText}
              maxLength={100}
            />
          </View>

          {/* Descripción */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Descripción*
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción del evento"
              placeholderTextColor={theme.colors.secondaryText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Ubicación */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Ubicación*
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ubicación del evento"
              placeholderTextColor={theme.colors.secondaryText}
            />
          </View>

          {/* Fecha y Hora */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Fecha*
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateTimeText, { color: theme.colors.text }]}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.timeContainer}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Hora*
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateTimeText, { color: theme.colors.text }]}>
                  {formatTime(time)}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
          </View>

          {/* Precio */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Precio (opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="Precio del evento (dejar vacío si es gratis)"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="numeric"
            />
          </View>

          {/* Capacidad */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Capacidad (opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="Número máximo de asistentes"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="numeric"
            />
          </View>

          {/* Categoría */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Categoría*
            </Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    { 
                      backgroundColor: category === cat.name 
                        ? theme.colors.primary 
                        : theme.colors.card,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { 
                        color: category === cat.name 
                          ? '#FFFFFF' 
                          : theme.colors.text 
                      }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider style={{ marginVertical: 20 }} />

          {/* Botón de envío */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isLoading ? theme.colors.secondary : theme.colors.primary }
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.submitButtonText}>Creando evento...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Crear evento</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateContainer: {
    width: '48%',
  },
  timeContainer: {
    width: '48%',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 