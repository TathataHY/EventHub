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

import { eventService } from '@modules/events/services/event.service';
import { EventsList } from '@modules/events/components/EventsList';
import { NearbyEventsSection } from '@modules/home/components/NearbyEventsSection';
import { RecommendedEventsSection } from '@modules/home/components/RecommendedEventsSection';
import { HomeScreen } from '@modules/home/index';

/**
 * Página de inicio (home) que utiliza la estructura modular
 */
export default function HomePage() {
  return <HomeScreen />;
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