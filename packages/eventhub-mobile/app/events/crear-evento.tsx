import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import Divider from '../../src/components/ui/Divider';
import Card from '../../src/components/ui/Card';
import theme from '../../src/theme';

// Categorías disponibles
const CATEGORIAS = [
  { id: 'música', nombre: 'Música' },
  { id: 'tecnología', nombre: 'Tecnología' },
  { id: 'arte', nombre: 'Arte' },
  { id: 'deporte', nombre: 'Deporte' },
  { id: 'gastronomía', nombre: 'Gastronomía' },
  { id: 'educación', nombre: 'Educación' },
  { id: 'negocios', nombre: 'Negocios' },
  { id: 'otros', nombre: 'Otros' }
];

// Esquema de validación
const EventoSchema = Yup.object().shape({
  titulo: Yup.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título debe tener máximo 100 caracteres')
    .required('Título requerido'),
  descripcion: Yup.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .required('Descripción requerida'),
  lugar: Yup.string()
    .required('Lugar requerido'),
  capacidad: Yup.number()
    .min(1, 'La capacidad debe ser al menos 1')
    .nullable(),
  precio: Yup.string()
    .required('Precio requerido')
});

export default function CrearEventoScreen() {
  const router = useRouter();
  const [imagenPreview, setImagenPreview] = useState('https://img.freepik.com/free-photo/events-concept-with-hands-clapping_23-2149844139.jpg');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

  // Valores iniciales del formulario
  const initialValues = {
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    lugar: '',
    capacidad: '',
    precio: '',
    categoria: ''
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    // Validar que se haya seleccionado una categoría
    if (!categoriaSeleccionada) {
      Alert.alert('Error', 'Debes seleccionar una categoría');
      setSubmitting(false);
      return;
    }

    try {
      const eventoData = {
        ...values,
        categoria: categoriaSeleccionada,
        imagenUrl: imagenPreview
      };

      console.log('Datos del evento a crear:', eventoData);
      
      // En producción, descomentar:
      // await eventService.createEvent(eventoData);

      Alert.alert(
        'Éxito',
        'El evento ha sido creado correctamente',
        [
          { text: 'OK', onPress: () => router.replace('/tabs/eventos') }
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

  // Cambiar fecha
  const handleDateChange = (event, selectedDate, setFieldValue) => {
    setMostrarDatePicker(false);
    if (selectedDate) {
      const currentTime = new Date(setFieldValue('fecha'));
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      setFieldValue('fecha', selectedDate);
    }
  };

  // Cambiar hora
  const handleTimeChange = (event, selectedTime, setFieldValue, currentDate) => {
    setMostrarTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(currentDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFieldValue('fecha', newDate);
    }
  };

  // Seleccionar imagen
  const handleSelectImage = () => {
    // En una implementación real, aquí se abriría un selector de imágenes
    Alert.alert(
      'Seleccionar imagen',
      'Esta funcionalidad estaría implementada con un selector de imágenes real',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Usar imagen de ejemplo', 
          onPress: () => {
            // Rotar entre algunas imágenes de ejemplo
            const imagenes = [
              'https://img.freepik.com/free-photo/events-concept-with-hands-clapping_23-2149844139.jpg',
              'https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg',
              'https://img.freepik.com/free-photo/audience-watching-presentation-speaker-stage-conference-hall_1268-16516.jpg',
              'https://img.freepik.com/free-photo/woman-watching-paintings-museum_23-2148763060.jpg',
              'https://img.freepik.com/free-photo/group-running-marathon_23-2147618482.jpg'
            ];
            const currentIndex = imagenes.indexOf(imagenPreview);
            const nextIndex = (currentIndex + 1) % imagenes.length;
            setImagenPreview(imagenes[nextIndex]);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={theme.colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear nuevo evento</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={EventoSchema}
        onSubmit={handleSubmit}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched, 
          isSubmitting,
          setFieldValue 
        }) => (
          <View style={styles.formContainer}>
            {/* Imagen del evento */}
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: imagenPreview }} 
                style={styles.eventImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={handleSelectImage}
              >
                <FontAwesome name="camera" size={16} color={theme.colors.common.white} />
                <Text style={styles.changeImageText}>Cambiar imagen</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.formCard}>
              {/* Título */}
              <Input
                label="Título del evento"
                value={values.titulo}
                onChangeText={handleChange('titulo')}
                onBlur={handleBlur('titulo')}
                placeholder="Ej. Concierto de rock en vivo"
                error={touched.titulo && errors.titulo ? errors.titulo : undefined}
                leftIcon="music"
                style={styles.input}
              />

              {/* Descripción */}
              <Input
                label="Descripción"
                value={values.descripcion}
                onChangeText={handleChange('descripcion')}
                onBlur={handleBlur('descripcion')}
                placeholder="Escribe los detalles del evento..."
                multiline
                numberOfLines={5}
                error={touched.descripcion && errors.descripcion ? errors.descripcion : undefined}
                leftIcon="align-left"
                style={styles.input}
                textAlignVertical="top"
              />

              {/* Fecha y hora */}
              <Text style={styles.sectionLabel}>Fecha y hora</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setMostrarDatePicker(true)}
                >
                  <FontAwesome name="calendar" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.datePickerText}>
                    {format(values.fecha, 'dd/MM/yyyy', { locale: es })}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setMostrarTimePicker(true)}
                >
                  <FontAwesome name="clock-o" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.datePickerText}>
                    {format(values.fecha, 'HH:mm', { locale: es })}
                  </Text>
                </TouchableOpacity>
              </View>

              {mostrarDatePicker && (
                <DateTimePicker
                  value={values.fecha}
                  mode="date"
                  display="default"
                  onChange={(e, date) => handleDateChange(e, date, setFieldValue)}
                />
              )}

              {mostrarTimePicker && (
                <DateTimePicker
                  value={values.fecha}
                  mode="time"
                  display="default"
                  onChange={(e, time) => handleTimeChange(e, time, setFieldValue, values.fecha)}
                />
              )}

              {/* Lugar */}
              <Input
                label="Lugar"
                value={values.lugar}
                onChangeText={handleChange('lugar')}
                onBlur={handleBlur('lugar')}
                placeholder="Ej. Teatro Municipal, Calle Principal 123"
                error={touched.lugar && errors.lugar ? errors.lugar : undefined}
                leftIcon="map-marker"
                style={styles.input}
              />

              {/* Categoría */}
              <Text style={styles.sectionLabel}>Categoría</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoriasModal(true)}
              >
                <FontAwesome name="tag" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.categorySelectorText}>
                  {categoriaSeleccionada ? 
                    CATEGORIAS.find(cat => cat.id === categoriaSeleccionada)?.nombre : 
                    'Seleccionar categoría'}
                </Text>
                <FontAwesome name="chevron-down" size={14} color={theme.colors.text.secondary} />
              </TouchableOpacity>

              {/* Modal de categorías (simulado) */}
              {showCategoriasModal && (
                <Card style={styles.categoriasModal}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Seleccionar categoría</Text>
                    <TouchableOpacity onPress={() => setShowCategoriasModal(false)}>
                      <FontAwesome name="times" size={20} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                  <Divider style={styles.modalDivider} />
                  <ScrollView style={styles.categoriasListContainer}>
                    {CATEGORIAS.map(categoria => (
                      <TouchableOpacity
                        key={categoria.id}
                        style={[
                          styles.categoriaOption,
                          categoriaSeleccionada === categoria.id && styles.categoriaSelected
                        ]}
                        onPress={() => {
                          setCategoriaSeleccionada(categoria.id);
                          setShowCategoriasModal(false);
                        }}
                      >
                        <Text 
                          style={[
                            styles.categoriaText,
                            categoriaSeleccionada === categoria.id && styles.categoriaTextSelected
                          ]}
                        >
                          {categoria.nombre}
                        </Text>
                        {categoriaSeleccionada === categoria.id && (
                          <FontAwesome name="check" size={16} color={theme.colors.primary.main} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Card>
              )}

              {/* Detalles adicionales */}
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Detalles adicionales</Text>

              {/* Capacidad */}
              <Input
                label="Capacidad (opcional)"
                value={values.capacidad}
                onChangeText={handleChange('capacidad')}
                onBlur={handleBlur('capacidad')}
                placeholder="Ej. 100"
                keyboardType="numeric"
                error={touched.capacidad && errors.capacidad ? errors.capacidad : undefined}
                leftIcon="users"
                style={styles.input}
              />

              {/* Precio */}
              <Input
                label="Precio"
                value={values.precio}
                onChangeText={handleChange('precio')}
                onBlur={handleBlur('precio')}
                placeholder="Ej. Gratis, €10, Desde €25"
                error={touched.precio && errors.precio ? errors.precio : undefined}
                leftIcon="euro"
                style={styles.input}
              />

              {/* Botones de acción */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancelar"
                  onPress={() => router.back()}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Crear evento"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.submitButton}
                />
              </View>
            </Card>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    height: 150,
    backgroundColor: theme.colors.primary.main,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.common.white,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  formContainer: {
    marginTop: -30,
  },
  imageContainer: {
    marginHorizontal: theme.spacing.md,
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  changeImageText: {
    color: theme.colors.common.white,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
  },
  formCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  datePickerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  categorySelectorText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  submitButton: {
    flex: 2,
    marginLeft: theme.spacing.xs,
  },
  categoriasModal: {
    position: 'absolute',
    top: '30%',
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    zIndex: 1000,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  modalDivider: {
    marginBottom: theme.spacing.sm,
  },
  categoriasListContainer: {
    maxHeight: 250,
  },
  categoriaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  categoriaSelected: {
    backgroundColor: theme.colors.primary.light,
  },
  categoriaText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  categoriaTextSelected: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
  },
});