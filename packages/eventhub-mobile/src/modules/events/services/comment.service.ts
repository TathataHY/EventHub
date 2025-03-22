import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
  rating?: number;
}

// Datos mock para desarrollo
const COMMENTS_MOCK: Comment[] = [
  {
    id: '1',
    eventId: '1',
    userId: '101',
    userName: 'María García',
    userAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: '¡Excelente evento! La organización fue perfecta y los artistas increíbles. Definitivamente repetiré el próximo año.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    rating: 5
  },
  {
    id: '2',
    eventId: '1',
    userId: '102',
    userName: 'Carlos Rodríguez',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Muy buen ambiente, aunque el sonido podría mejorar. Los accesos estuvieron bien organizados y no hubo que esperar mucho.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    rating: 4
  },
  {
    id: '3',
    eventId: '1',
    userId: '103',
    userName: 'Laura Martínez',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'La zona de comida tenía opciones muy limitadas y caras. El resto del evento estuvo bien.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    rating: 3
  },
  {
    id: '4',
    eventId: '1',
    userId: '104',
    userName: 'Javier López',
    userAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    text: 'Gran selección de artistas, el escenario principal estaba impresionante con las luces y efectos.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    rating: 5
  },
  {
    id: '5',
    eventId: '1',
    userId: '105',
    userName: 'Ana Gómez',
    userAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    text: 'La aplicación para seguir el horario de los artistas funcionó muy bien, me ayudó a organizarme durante el festival.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    rating: 4
  },
  {
    id: '6',
    eventId: '2',
    userId: '101',
    userName: 'María García',
    userAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: 'El taller estuvo muy bien organizado, aprendí mucho sobre fotografía.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    rating: 5
  }
];

class CommentService {
  // Obtener comentarios de un evento
  async getEventComments(eventId: string): Promise<Comment[]> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.get(`/events/${eventId}/comments`);
      
      // Para desarrollo, usar datos de ejemplo
      const storedComments = await AsyncStorage.getItem('eventComments');
      let allComments: Comment[] = storedComments 
        ? JSON.parse(storedComments) 
        : COMMENTS_MOCK;
      
      // Filtrar comentarios para el evento específico
      return allComments
        .filter(comment => comment.eventId === eventId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      return [];
    }
  }

  // Añadir un comentario
  async addComment(
    eventId: string, 
    text: string, 
    rating: number, 
    userData: { userId: string; userName: string; userAvatar: string }
  ): Promise<Comment> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.post(`/events/${eventId}/comments`, { text, rating });
      
      // Para desarrollo, simular adición de comentario
      const newComment: Comment = {
        id: Date.now().toString(),
        eventId,
        userId: userData.userId,
        userName: userData.userName,
        userAvatar: userData.userAvatar,
        text,
        date: new Date().toISOString(),
        rating
      };
      
      // Obtener comentarios existentes
      const storedComments = await AsyncStorage.getItem('eventComments');
      let allComments: Comment[] = storedComments 
        ? JSON.parse(storedComments) 
        : COMMENTS_MOCK;
      
      // Añadir el nuevo comentario
      allComments = [newComment, ...allComments];
      
      // Guardar comentarios
      await AsyncStorage.setItem('eventComments', JSON.stringify(allComments));
      
      return newComment;
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      throw new Error('No se pudo añadir el comentario');
    }
  }

  // Eliminar un comentario
  async deleteComment(commentId: string): Promise<void> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.delete(`/comments/${commentId}`);
      
      // Para desarrollo, simular eliminación
      const storedComments = await AsyncStorage.getItem('eventComments');
      if (!storedComments) {
        return;
      }
      
      let allComments: Comment[] = JSON.parse(storedComments);
      allComments = allComments.filter(comment => comment.id !== commentId);
      
      await AsyncStorage.setItem('eventComments', JSON.stringify(allComments));
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw new Error('No se pudo eliminar el comentario');
    }
  }

  // Editar un comentario
  async editComment(commentId: string, text: string, rating: number): Promise<Comment> {
    try {
      // En producción, reemplazar con llamada a API
      // return await api.put(`/comments/${commentId}`, { text, rating });
      
      // Para desarrollo, simular edición
      const storedComments = await AsyncStorage.getItem('eventComments');
      if (!storedComments) {
        throw new Error('No se encontró el comentario');
      }
      
      let allComments: Comment[] = JSON.parse(storedComments);
      const commentIndex = allComments.findIndex(comment => comment.id === commentId);
      
      if (commentIndex === -1) {
        throw new Error('No se encontró el comentario');
      }
      
      const updatedComment = {
        ...allComments[commentIndex],
        text,
        rating,
        date: new Date().toISOString() // Actualizar fecha al editar
      };
      
      allComments[commentIndex] = updatedComment;
      await AsyncStorage.setItem('eventComments', JSON.stringify(allComments));
      
      return updatedComment;
    } catch (error) {
      console.error('Error al editar comentario:', error);
      throw new Error('No se pudo editar el comentario');
    }
  }
}

export const commentService = new CommentService(); 