import { useState, useCallback } from 'react';

// Tipos
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  latitude: number;
  longitude: number;
  address: string;
  organizer: string;
}

export function useMapEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos del mapa
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carga de datos - reemplazar con API real
      setTimeout(() => {
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Festival de Jazz',
            description: 'Gran festival de jazz con artistas internacionales',
            category: 'Música',
            date: new Date(Date.now() + 3600000 * 24 * 2).toISOString(),
            latitude: 40.416775,
            longitude: -3.703790,
            address: 'Plaza Mayor, Madrid',
            organizer: 'Ayuntamiento de Madrid'
          },
          {
            id: '2',
            title: 'Exposición de Arte Moderno',
            description: 'Muestra de artistas contemporáneos',
            category: 'Arte',
            date: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
            latitude: 40.407015,
            longitude: -3.691163,
            address: 'Museo Reina Sofía, Madrid',
            organizer: 'Museo Nacional Reina Sofía'
          },
          {
            id: '3',
            title: 'Conferencia de Tecnología',
            description: 'Presentación de las últimas innovaciones tecnológicas',
            category: 'Tecnología',
            date: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
            latitude: 40.422055,
            longitude: -3.683804,
            address: 'IFEMA, Madrid',
            organizer: 'TechForum'
          },
          {
            id: '4',
            title: 'Partido de Baloncesto',
            description: 'Final de liga profesional',
            category: 'Deportes',
            date: new Date(Date.now() + 3600000 * 24 * 1).toISOString(),
            latitude: 40.436329,
            longitude: -3.661708,
            address: 'Wizink Center, Madrid',
            organizer: 'Liga ACB'
          },
          {
            id: '5',
            title: 'Festival Gastronómico',
            description: 'Degustación de platos típicos de diferentes regiones',
            category: 'Gastronomía',
            date: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
            latitude: 40.424435,
            longitude: -3.707112,
            address: 'Mercado de San Miguel, Madrid',
            organizer: 'Asociación de Chefs'
          }
        ];
        
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setError('Error al cargar los eventos. Por favor, inténtalo de nuevo');
      setIsLoading(false);
    }
  }, []);

  // Filtrar eventos por categoría
  const filterEventsByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    
    if (!category) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => event.category === category);
      setFilteredEvents(filtered);
    }
  }, [events]);

  return {
    events,
    filteredEvents,
    selectedCategory,
    isLoading,
    error,
    loadEvents,
    filterEventsByCategory
  };
} 