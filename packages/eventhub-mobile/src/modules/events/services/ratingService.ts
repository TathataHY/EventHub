import AsyncStorage from '@react-native-async-storage/async-storage';

interface Rating {
  id: string;
  userId: string;
  eventId: string;
  value: number;
  date: string;
}

class RatingService {
  // Obtener calificación del usuario para un evento específico
  async getUserEventRating(userId: string, eventId: string): Promise<number | null> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.get(`/events/${eventId}/ratings/${userId}`);
      
      // Para desarrollo, usar calificaciones almacenadas localmente
      const storedRatings = await AsyncStorage.getItem('eventRatings');
      if (!storedRatings) {
        return null;
      }
      
      const ratings: Rating[] = JSON.parse(storedRatings);
      const userRating = ratings.find(
        rating => rating.userId === userId && rating.eventId === eventId
      );
      
      return userRating ? userRating.value : null;
    } catch (error) {
      console.error('Error al obtener calificación:', error);
      return null;
    }
  }

  // Obtener calificación promedio de un evento
  async getEventAverageRating(eventId: string): Promise<{ average: number; count: number }> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.get(`/events/${eventId}/ratings/average`);
      
      // Para desarrollo, calcular promedio de calificaciones almacenadas
      const storedRatings = await AsyncStorage.getItem('eventRatings');
      if (!storedRatings) {
        return { average: 0, count: 0 };
      }
      
      const ratings: Rating[] = JSON.parse(storedRatings);
      const eventRatings = ratings.filter(rating => rating.eventId === eventId);
      
      if (eventRatings.length === 0) {
        return { average: 0, count: 0 };
      }
      
      const sum = eventRatings.reduce((acc, rating) => acc + rating.value, 0);
      const average = sum / eventRatings.length;
      
      return {
        average: parseFloat(average.toFixed(1)),
        count: eventRatings.length
      };
    } catch (error) {
      console.error('Error al obtener calificación promedio:', error);
      return { average: 0, count: 0 };
    }
  }

  // Guardar o actualizar calificación de usuario para un evento
  async rateEvent(userId: string, eventId: string, value: number): Promise<Rating> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.post(`/events/${eventId}/ratings`, { userId, value });
      
      // Para desarrollo, almacenar calificación localmente
      // Obtener calificaciones existentes
      const storedRatings = await AsyncStorage.getItem('eventRatings');
      let ratings: Rating[] = storedRatings ? JSON.parse(storedRatings) : [];
      
      // Verificar si ya existe una calificación para actualizar
      const existingIndex = ratings.findIndex(
        rating => rating.userId === userId && rating.eventId === eventId
      );
      
      const newRating: Rating = {
        id: existingIndex >= 0 ? ratings[existingIndex].id : Date.now().toString(),
        userId,
        eventId,
        value,
        date: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        // Actualizar calificación existente
        ratings[existingIndex] = newRating;
      } else {
        // Añadir nueva calificación
        ratings.push(newRating);
      }
      
      // Guardar calificaciones actualizadas
      await AsyncStorage.setItem('eventRatings', JSON.stringify(ratings));
      
      return newRating;
    } catch (error) {
      console.error('Error al calificar evento:', error);
      throw new Error('No se pudo guardar la calificación');
    }
  }

  // Eliminar calificación de usuario para un evento
  async deleteRating(userId: string, eventId: string): Promise<void> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.delete(`/events/${eventId}/ratings/${userId}`);
      
      // Para desarrollo, eliminar calificación localmente
      const storedRatings = await AsyncStorage.getItem('eventRatings');
      if (!storedRatings) {
        return;
      }
      
      let ratings: Rating[] = JSON.parse(storedRatings);
      ratings = ratings.filter(
        rating => !(rating.userId === userId && rating.eventId === eventId)
      );
      
      await AsyncStorage.setItem('eventRatings', JSON.stringify(ratings));
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      throw new Error('No se pudo eliminar la calificación');
    }
  }
}

export const ratingService = new RatingService(); 