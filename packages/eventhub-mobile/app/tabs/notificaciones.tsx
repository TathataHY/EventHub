import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Datos de ejemplo - Serán reemplazados por datos reales de la API
const NOTIFICACIONES_EJEMPLO = [
  {
    id: '1',
    tipo: 'evento_invitacion',
    titulo: 'Invitación a evento',
    mensaje: 'Has sido invitado al evento "Workshop de Diseño UX"',
    fecha: '2025-03-10T14:30:00',
    leida: false,
    datos: {
      eventoId: '2',
      eventoTitulo: 'Workshop de Diseño UX',
    }
  },
  {
    id: '2',
    tipo: 'evento_recordatorio',
    titulo: 'Recordatorio de evento',
    mensaje: 'El evento "Concierto de Rock" comienza mañana a las 20:00',
    fecha: '2025-03-24T09:00:00',
    leida: true,
    datos: {
      eventoId: '1',
      eventoTitulo: 'Concierto de Rock',
    }
  },
  {
    id: '3',
    tipo: 'evento_cambio',
    titulo: 'Cambio en evento',
    mensaje: 'El evento "Feria Gastronómica" ha cambiado de ubicación',
    fecha: '2025-03-15T11:20:00',
    leida: false,
    datos: {
      eventoId: '3',
      eventoTitulo: 'Feria Gastronómica',
    }
  },
  {
    id: '4',
    tipo: 'sistema',
    titulo: 'Bienvenido a EventHub',
    mensaje: 'Gracias por unirte a nuestra plataforma. ¡Explora eventos cercanos!',
    fecha: '2025-03-01T08:45:00',
    leida: true,
    datos: {}
  },
  {
    id: '5',
    tipo: 'evento_cancelacion',
    titulo: 'Evento cancelado',
    mensaje: 'El evento "Taller de Fotografía" ha sido cancelado por el organizador',
    fecha: '2025-03-18T16:10:00',
    leida: false,
    datos: {
      eventoId: '5',
      eventoTitulo: 'Taller de Fotografía',
    }
  },
];

export default function Notificaciones() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState(NOTIFICACIONES_EJEMPLO);
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'leidas', 'no_leidas'

  // Formatear fecha relativa
  const formatearFechaRelativa = (fechaString) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora - fecha;
    const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaHoras / 24);

    if (diferenciaDias > 7) {
      return fecha.toLocaleDateString();
    } else if (diferenciaDias > 0) {
      return `Hace ${diferenciaDias} ${diferenciaDias === 1 ? 'día' : 'días'}`;
    } else if (diferenciaHoras > 0) {
      return `Hace ${diferenciaHoras} ${diferenciaHoras === 1 ? 'hora' : 'horas'}`;
    } else if (diferenciaMinutos > 0) {
      return `Hace ${diferenciaMinutos} ${diferenciaMinutos === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'Ahora mismo';
    }
  };

  // Marcar notificación como leída
  const marcarComoLeida = (id) => {
    setNotificaciones(notificaciones.map(notif => 
      notif.id === id ? { ...notif, leida: true } : notif
    ));
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = () => {
    setNotificaciones(notificaciones.map(notif => ({ ...notif, leida: true })));
  };

  // Filtrar notificaciones
  const notificacionesFiltradas = notificaciones.filter(notif => {
    if (filtro === 'leidas') return notif.leida;
    if (filtro === 'no_leidas') return !notif.leida;
    return true;
  });

  // Obtener icono según tipo de notificación
  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case 'evento_invitacion':
        return 'envelope';
      case 'evento_recordatorio':
        return 'clock-o';
      case 'evento_cambio':
        return 'refresh';
      case 'evento_cancelacion':
        return 'ban';
      case 'sistema':
        return 'info-circle';
      default:
        return 'bell';
    }
  };

  // Manejar tap en notificación
  const manejarTapNotificacion = (notificacion) => {
    marcarComoLeida(notificacion.id);
    
    // Navegar según el tipo de notificación
    if (notificacion.tipo.startsWith('evento_') && notificacion.datos.eventoId) {
      router.push(`/evento/${notificacion.datos.eventoId}`);
    }
  };

  const renderNotificacion = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificacionItem, item.leida ? styles.notificacionLeida : styles.notificacionNoLeida]}
      onPress={() => manejarTapNotificacion(item)}
    >
      <View style={styles.iconoContainer}>
        <FontAwesome name={obtenerIcono(item.tipo)} size={24} color="#4a80f5" />
      </View>
      <View style={styles.contenidoNotificacion}>
        <Text style={styles.tituloNotificacion}>{item.titulo}</Text>
        <Text style={styles.mensajeNotificacion}>{item.mensaje}</Text>
        <Text style={styles.fechaNotificacion}>{formatearFechaRelativa(item.fecha)}</Text>
      </View>
      {!item.leida && <View style={styles.indicadorNoLeida} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Notificaciones</Text>
        <TouchableOpacity onPress={marcarTodasComoLeidas}>
          <Text style={styles.marcarTodasTexto}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtrosContainer}>
        <TouchableOpacity 
          style={[styles.filtroBoton, filtro === 'todas' && styles.filtroSeleccionado]}
          onPress={() => setFiltro('todas')}
        >
          <Text style={[styles.filtroTexto, filtro === 'todas' && styles.filtroTextoSeleccionado]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filtroBoton, filtro === 'no_leidas' && styles.filtroSeleccionado]}
          onPress={() => setFiltro('no_leidas')}
        >
          <Text style={[styles.filtroTexto, filtro === 'no_leidas' && styles.filtroTextoSeleccionado]}>
            No leídas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filtroBoton, filtro === 'leidas' && styles.filtroSeleccionado]}
          onPress={() => setFiltro('leidas')}
        >
          <Text style={[styles.filtroTexto, filtro === 'leidas' && styles.filtroTextoSeleccionado]}>
            Leídas
          </Text>
        </TouchableOpacity>
      </View>
      
      {cargando ? (
        <View style={styles.cargandoContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.cargandoTexto}>Cargando notificaciones...</Text>
        </View>
      ) : notificacionesFiltradas.length > 0 ? (
        <FlatList
          data={notificacionesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificacion}
          contentContainerStyle={styles.listaNotificaciones}
        />
      ) : (
        <View style={styles.sinNotificacionesContainer}>
          <FontAwesome name="bell-slash" size={50} color="#ccc" />
          <Text style={styles.sinNotificacionesTexto}>No tienes notificaciones</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  marcarTodasTexto: {
    color: '#4a80f5',
    fontSize: 14,
  },
  filtrosContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtroBoton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filtroSeleccionado: {
    backgroundColor: '#4a80f5',
  },
  filtroTexto: {
    color: '#666',
  },
  filtroTextoSeleccionado: {
    color: 'white',
  },
  listaNotificaciones: {
    padding: 12,
  },
  notificacionItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificacionNoLeida: {
    borderLeftWidth: 4,
    borderLeftColor: '#4a80f5',
  },
  notificacionLeida: {
    opacity: 0.8,
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contenidoNotificacion: {
    flex: 1,
  },
  tituloNotificacion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mensajeNotificacion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  fechaNotificacion: {
    fontSize: 12,
    color: '#999',
  },
  indicadorNoLeida: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a80f5',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    marginTop: 10,
    color: '#666',
  },
  sinNotificacionesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sinNotificacionesTexto: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
}); 