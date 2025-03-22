import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@core/context/ThemeContext';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
  rating?: number;
}

interface EventCommentsProps {
  eventId: string;
  comments: Comment[];
  isAuthenticated: boolean;
  onAddComment?: (text: string, rating: number) => Promise<void>;
  maxComments?: number;
}

export const EventComments: React.FC<EventCommentsProps> = ({
  eventId,
  comments,
  isAuthenticated,
  onAddComment,
  maxComments = 3
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formatear fecha relativa
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };
  
  // Ver todos los comentarios
  const viewAllComments = () => {
    router.push(`/events/evento/comentarios/${eventId}`);
  };
  
  // Añadir comentario
  const handleAddComment = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para comentar en este evento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    if (!commentText.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onAddComment) {
        await onAddComment(commentText, rating);
      }
      setCommentText('');
      setRating(5);
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      Alert.alert('Error', 'No se pudo añadir el comentario. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar estrellas para calificación
  const renderRatingStars = (value: number, editable = false) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => editable && setRating(star)}
            disabled={!editable}
          >
            <Ionicons
              name={star <= value ? 'star' : 'star-outline'}
              size={editable ? 28 : 16}
              color={star <= value ? theme.colors.warning.main : theme.colors.text.secondary}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Mostrar comentarios limitados
  const visibleComments = comments.slice(0, maxComments);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Comentarios
        </Text>
        {comments.length > 0 && (
          <TouchableOpacity onPress={viewAllComments}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary.main }]}>
              Ver todos ({comments.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isAuthenticated && (
        <View style={[styles.addCommentContainer, { backgroundColor: theme.colors.background.paper }]}>
          <Text style={[styles.addCommentTitle, { color: theme.colors.text.primary }]}>
            Deja tu comentario
          </Text>
          
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingLabel, { color: theme.colors.text.secondary }]}>
              Calificación:
            </Text>
            {renderRatingStars(rating, true)}
          </View>
          
          <TextInput
            style={[
              styles.commentInput,
              { 
                backgroundColor: theme.colors.background.default,
                color: theme.colors.text.primary,
                borderColor: theme.colors.divider
              }
            ]}
            placeholder="Escribe tu comentario..."
            placeholderTextColor={theme.colors.text.secondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.primary.main },
              (!commentText.trim() || isSubmitting) && { opacity: 0.7 }
            ]}
            onPress={handleAddComment}
            disabled={!commentText.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      
      {comments.length > 0 ? (
        <View style={styles.commentsList}>
          {visibleComments.map((comment) => (
            <View 
              key={comment.id} 
              style={[styles.commentItem, { backgroundColor: theme.colors.background.paper }]}
            >
              <View style={styles.commentHeader}>
                <Image
                  source={{ uri: comment.userAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.commentInfo}>
                  <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
                    {comment.userName}
                  </Text>
                  <Text style={[styles.commentDate, { color: theme.colors.text.secondary }]}>
                    {formatDate(comment.date)}
                  </Text>
                </View>
                {comment.rating && (
                  <View style={styles.commentRating}>
                    {renderRatingStars(comment.rating)}
                  </View>
                )}
              </View>
              <Text style={[styles.commentText, { color: theme.colors.text.primary }]}>
                {comment.text}
              </Text>
            </View>
          ))}
          
          {comments.length > maxComments && (
            <TouchableOpacity 
              style={[styles.viewMoreButton, { borderColor: theme.colors.primary.main }]} 
              onPress={viewAllComments}
            >
              <Text style={[styles.viewMoreText, { color: theme.colors.primary.main }]}>
                Ver más comentarios
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={theme.colors.primary.main}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background.paper }]}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={48}
            color={theme.colors.text.secondary}
          />
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No hay comentarios aún. ¡Sé el primero en comentar!
          </Text>
        </View>
      )}
      
      {!isAuthenticated && (
        <TouchableOpacity 
          style={[styles.loginButton, { borderColor: theme.colors.primary.main }]}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={[styles.loginButtonText, { color: theme.colors.primary.main }]}>
            Inicia sesión para comentar
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
  },
  addCommentContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addCommentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentsList: {
    marginTop: 8,
  },
  commentItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
  },
  commentRating: {
    alignItems: 'flex-end',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  loginButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 