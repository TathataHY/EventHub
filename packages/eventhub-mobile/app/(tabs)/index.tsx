import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { eventService } from '../../src/services/event.service';

export default function EventsScreen() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategorias, setFiltroCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  // Función para cargar los eventos
  const cargarEventos = useCallback(async (refreshing = false) => {
    try {
      if (refreshing) {
        setRefrescando(true);
      } else {
        setCargando(true);
      }
      
      // Obtener eventos desde el servicio
      const eventosData = await eventService.getEvents();
      
      // Extraer categorías únicas para el filtro
      const categorias = [...new Set(eventosData.map(event => event.category))];
      setFiltroCategorias(categorias);
      
      // Filtrar eventos si hay búsqueda o categorías seleccionadas
      let eventosFiltrados = eventosData;
      
      if (busqueda) {
        eventosFiltrados = eventosFiltrados.filter(event => 
          event.title.toLowerCase().includes(busqueda.toLowerCase()) ||
          event.description.toLowerCase().includes(busqueda.toLowerCase())
        );
      }
      
      if (categoriasSeleccionadas.length > 0) {
        eventosFiltrados = eventosFiltrados.filter(event => 
          categoriasSeleccionadas.includes(event.category)
        );
      }
      
      setEventos(eventosFiltrados);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [busqueda, categoriasSeleccionadas]);

  // Cargar eventos al iniciar y cuando cambien los filtros
  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  // Manejar cambio en la búsqueda
  const manejarBusqueda = (texto) => {
    setBusqueda(texto);
  };

  // Manejar selección de categoría
  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas(prevSelected => {
      if (prevSelected.includes(categoria)) {
        return prevSelected.filter(cat => cat !== categoria);
      } else {
        return [...prevSelected, categoria];
      }
    });
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return format(fecha, "d 'de' MMMM", { locale: es });
    } catch (error) {
      return fechaString;
    }
  };

  // Renderizar un evento
  const renderizarEvento = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventoCard}
      onPress={() => router.push(`/evento/${item.id}`)}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://img.freepik.com/free-photo/group-people-enjoying-party_23-2147652037.jpg' }} 
        style={styles.eventoImagen}
      />
      
      <View style={styles.eventoContenido}>
        <Text style={styles.eventoTitulo} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.eventoInfo}>
          <FontAwesome name="calendar" size={14} color="#666" style={styles.infoIcono} />
          <Text style={styles.eventoFecha}>{formatearFecha(item.date)}</Text>
        </View>
        
        <View style={styles.eventoInfo}>
          <FontAwesome name="map-marker" size={14} color="#666" style={styles.infoIcono} />
          <Text style={styles.eventoUbicacion} numberOfLines={1}>{item.location}</Text>
        </View>
        
        <View style={styles.eventoFooter}>
          <View style={styles.categoriaEtiqueta}>
            <Text style={styles.categoriaTexto}>{item.category}</Text>
          </View>
          {item.attending && (
            <View style={styles.asistiendoEtiqueta}>
              <FontAwesome name="check-circle" size={12} color="white" />
              <Text style={styles.asistiendoTexto}>Asistiré</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Renderizar el encabezado de filtros
  const renderizarEncabezado = () => (
    <View style={styles.filtrosContainer}>
      <View style={styles.busquedaContainer}>
        <FontAwesome name="search" size={16} color="#999" style={styles.busquedaIcono} />
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar eventos..."
          value={busqueda}
          onChangeText={manejarBusqueda}
        />
        {busqueda ? (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <FontAwesome name="times-circle" size={16} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <Text style={styles.filtroTitulo}>Categorías</Text>
      <FlatList
        horizontal
        data={filtroCategorias}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaFiltro,
              categoriasSeleccionadas.includes(item) && styles.categoriaSeleccionada
            ]}
            onPress={() => toggleCategoria(item)}
          >
            <Text style={[
              styles.categoriaFiltroTexto,
              categoriasSeleccionadas.includes(item) && styles.categoriaSeleccionadaTexto
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoriasList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Eventos</Text>
        <TouchableOpacity
          style={styles.crearEventoButton}
          onPress={() => router.push('/crear-evento')}
        >
          <FontAwesome name="plus" size={20} color="#4a80f5" />
        </TouchableOpacity>
      </View>
      
      {cargando && !refrescando ? (
        <View style={styles.cargandoContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.cargandoTexto}>Cargando eventos...</Text>
        </View>
      ) : (
        <FlatList
          data={eventos}
          renderItem={renderizarEvento}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listaContainer}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={() => cargarEventos(true)}
              colors={['#4a80f5']}
            />
          }
          ListHeaderComponent={renderizarEncabezado}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="calendar-o" size={60} color="#ccc" />
              <Text style={styles.emptyTexto}>
                No se encontraron eventos
                {busqueda ? ' para tu búsqueda' : ''}
                {categoriasSeleccionadas.length > 0 ? ' en las categorías seleccionadas' : ''}
              </Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setBusqueda('');
                  setCategoriasSeleccionadas([]);
                }}
              >
                <Text style={styles.resetButtonText}>Reiniciar filtros</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  crearEventoButton: {
    padding: 10,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  listaContainer: {
    paddingBottom: 20,
  },
  filtrosContainer: {
    padding: 15,
  },
  busquedaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 44,
  },
  busquedaIcono: {
    marginRight: 10,
  },
  busquedaInput: {
    flex: 1,
    height: 44,
    color: '#333',
  },
  filtroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoriasList: {
    paddingVertical: 5,
  },
  categoriaFiltro: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoriaSeleccionada: {
    backgroundColor: '#4a80f5',
  },
  categoriaFiltroTexto: {
    color: '#666',
    fontSize: 14,
  },
  categoriaSeleccionadaTexto: {
    color: 'white',
  },
  eventoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventoImagen: {
    width: '100%',
    height: 150,
  },
  eventoContenido: {
    padding: 15,
  },
  eventoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcono: {
    width: 20,
    marginRight: 5,
  },
  eventoFecha: {
    fontSize: 14,
    color: '#666',
  },
  eventoUbicacion: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  eventoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  categoriaEtiqueta: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoriaTexto: {
    fontSize: 12,
    color: '#666',
  },
  asistiendoEtiqueta: {
    backgroundColor: '#4cd964',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  asistiendoTexto: {
    fontSize: 12,
    color: 'white',
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});