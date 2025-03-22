import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../../core/theme';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { commentService } from '../services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Pantalla de comentarios de un evento
 */
export const EventCommentsScreen = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Cargar comentarios
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const eventComments = await commentService.getEventComments(id?.toString() || '');
        setComments(eventComments);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
        Alert.alert('Error', 'No se pudieron cargar los comentarios');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
  }, [id]);
  
  // Enviar un nuevo comentario
  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSending(true);
      const commentData = {
        eventId: id?.toString() || '',
        text: newComment.trim(),
        userId: 'currentUser', // En una implementación real, obtener del contexto de autenticación
        date: new Date().toISOString()
      };
      
      const addedComment = await commentService.addComment(commentData);
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setIsSending(false);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Renderizar un comentario
  const renderComment = ({ item }: { item: any }) => (
    <View style={[styles.commentContainer, { backgroundColor: colors.card }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {item.userName || 'Usuario'}
        </Text>
        <Text style={[styles.commentDate, { color: colors.secondaryText }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      
      <Text style={[styles.commentText, { color: colors.text }]}>
        {item.text}
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Cargando comentarios...
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={60} color={colors.secondaryText} />
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No hay comentarios
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
                  ¡Sé el primero en comentar!
                </Text>
              </View>
            }
          />
          
          <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.secondaryText}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: newComment.trim() ? 1 : 0.5 }
              ]}
              onPress={handleSendComment}
              disabled={!newComment.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  commentContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 