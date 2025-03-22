import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

interface ShareOptions {
  message?: string;
  title?: string;
  url?: string;
}

export const sharingService = {
  /**
   * Comparte un evento utilizando el selector nativo de compartir
   */
  async shareEvent(eventId: string, eventName: string, eventDate: string, eventLocation: string): Promise<void> {
    try {
      // Construir mensaje para compartir
      const message = `¡Te invito a asistir a "${eventName}" el ${eventDate} en ${eventLocation}!`;
      const url = Linking.createURL(`/events/evento/${eventId}`);
      
      // Compartir según la plataforma
      if (Platform.OS === 'web') {
        // En web usamos la API de Web Share si está disponible
        if (navigator.share) {
          await navigator.share({
            title: eventName,
            text: message,
            url: url
          });
        } else {
          // Fallback para navegadores que no soportan Web Share API
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
        }
      } else {
        // En móvil usamos la API de Sharing
        const shareOptions: ShareOptions = {
          message: `${message}\n\nAbrir en la app: ${url}`,
        };
        
        await Sharing.shareAsync(url, {
          dialogTitle: `Compartir: ${eventName}`,
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      }
    } catch (error) {
      console.error('Error al compartir evento:', error);
      throw error;
    }
  },
  
  /**
   * Comparte una invitación personalizada a un evento
   */
  async shareInvitation(eventId: string, eventName: string, eventDate: string, customMessage: string = ''): Promise<void> {
    try {
      const url = Linking.createURL(`/events/evento/${eventId}`);
      const message = customMessage 
        ? `${customMessage}\n\n${eventName} - ${eventDate}`
        : `¡Te invito personalmente a ${eventName} el ${eventDate}!`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: `Invitación a ${eventName}`,
            text: message,
            url: url
          });
        } else {
          // Fallback para email
          const mailtoLink = `mailto:?subject=${encodeURIComponent(`Invitación a ${eventName}`)}&body=${encodeURIComponent(`${message}\n\nAbrir en la app: ${url}`)}`;
          window.location.href = mailtoLink;
        }
      } else {
        await Sharing.shareAsync(url, {
          dialogTitle: `Invitar a: ${eventName}`,
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      }
    } catch (error) {
      console.error('Error al compartir invitación:', error);
      throw error;
    }
  }
}; 