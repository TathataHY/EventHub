import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '../services/jwt.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private userSocketMap: Map<string, string[]> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Maneja la conexión de un cliente WebSocket
   * @param client Cliente WebSocket conectado
   */
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || 
                     client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verifyToken(token);
      
      if (!payload) {
        client.disconnect();
        return;
      }

      const userId = payload.id;

      // Asociar el socket con el usuario
      client.data.userId = userId;
      
      // Guardar la relación usuario -> sockets
      const userSockets = this.userSocketMap.get(userId) || [];
      userSockets.push(client.id);
      this.userSocketMap.set(userId, userSockets);

      // Unir al usuario a su sala privada
      client.join(`user:${userId}`);
      
      this.logger.log(`Cliente conectado: ${client.id} - Usuario: ${userId}`);
    } catch (error) {
      this.logger.error(`Error en conexión: ${error.message}`);
      client.disconnect();
    }
  }

  /**
   * Maneja la desconexión de un cliente WebSocket
   * @param client Cliente WebSocket desconectado
   */
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    
    if (userId) {
      // Eliminar el socket de la lista del usuario
      const userSockets = this.userSocketMap.get(userId) || [];
      const updatedSockets = userSockets.filter(id => id !== client.id);
      
      if (updatedSockets.length > 0) {
        this.userSocketMap.set(userId, updatedSockets);
      } else {
        this.userSocketMap.delete(userId);
      }
      
      this.logger.log(`Cliente desconectado: ${client.id} - Usuario: ${userId}`);
    }
  }

  /**
   * Envía una notificación a un usuario específico
   * @param userId ID del usuario destinatario
   * @param notification Datos de la notificación
   */
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  /**
   * Envía una notificación a todos los usuarios conectados
   * @param notification Datos de la notificación
   */
  sendNotificationToAll(notification: any) {
    this.server.emit('notification', notification);
  }

  /**
   * Suscribe a un cliente a eventos específicos
   * @param client Cliente WebSocket
   * @param eventTypes Tipos de eventos a suscribir
   */
  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() eventTypes: string[]
  ) {
    try {
      const userId = client.data.userId;
      
      if (!userId) {
        return { success: false, message: 'No autenticado' };
      }
      
      // Unir al usuario a salas para cada tipo de evento
      eventTypes.forEach(eventType => {
        client.join(`event:${eventType}`);
      });
      
      return { success: true, message: 'Suscrito correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
} 