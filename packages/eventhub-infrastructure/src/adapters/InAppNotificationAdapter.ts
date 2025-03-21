import { injectable } from 'inversify';
import { Notification } from '../../../eventhub-domain/src/entities/Notification';
import { NotificationChannel } from '../../../eventhub-domain/src/value-objects/NotificationChannel';
import { INotificationChannelAdapter } from '../../../eventhub-application/src/adapters/INotificationChannelAdapter';

/**
 * Adaptador para notificaciones internas de la aplicación
 * Este adaptador simplemente marca la notificación como enviada, ya que
 * las notificaciones in-app se almacenan en la base de datos directamente
 */
@injectable()
export class InAppNotificationAdapter implements INotificationChannelAdapter {
  private isInitialized: boolean = false;
  
  /**
   * Inicializa el adaptador
   * @param config Configuración del adaptador
   */
  initialize(config: Record<string, any>): void {
    this.isInitialized = true;
  }
  
  /**
   * Verifica si el adaptador está configurado correctamente
   * @returns true si está configurado
   */
  isConfigured(): boolean {
    return this.isInitialized;
  }
  
  /**
   * "Envía" una notificación in-app
   * En realidad, las notificaciones in-app simplemente se almacenan en la base de datos,
   * por lo que este método solo verifica que todo esté en orden.
   * @param notification Notificación a procesar
   */
  async send(notification: Notification): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('El adaptador de notificaciones in-app no está inicializado');
    }
    
    if (notification.channel !== NotificationChannel.IN_APP) {
      throw new Error(`Canal incorrecto: esperado ${NotificationChannel.IN_APP}, recibido ${notification.channel}`);
    }
    
    // No hay nada específico que hacer aquí, ya que las notificaciones in-app
    // se guardan automáticamente en la base de datos por el servicio de notificaciones
  }
} 