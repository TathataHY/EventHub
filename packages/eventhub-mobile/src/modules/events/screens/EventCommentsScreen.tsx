import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';
import { commentService } from '../services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Pantalla de comentarios de un evento
 */
export const EventCommentsScreen = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useLocalSearchParams<{ user: any }>();
  
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
    if (!newComment.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const commentData = {
        eventId: id?.toString() || '',
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Usuario anónimo',
        userAvatar: user?.avatar || '',
        text: newComment.trim(),
        date: new Date().toISOString()
      };
      
      const addedComment = await commentService.addComment(
        commentData.eventId,
        commentData.text,
        0, // rating (opcional o valor predeterminado)
        {
          userId: commentData.userId,
          userName: commentData.userName,
          userAvatar: commentData.userAvatar
        }
      );
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
    <View style={[styles.commentContainer, { backgroundColor: theme.colors.background.paper }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
          {item.userName || 'Usuario'}
        </Text>
        <Text style={[styles.commentDate, { color: theme.colors.text.primary }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      
      <Text style={[styles.commentText, { color: theme.colors.text.primary }]}>
        {item.text}
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
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
                <Ionicons name="chatbubble-outline" size={60} color={theme.colors.text.secondary} />
                <Text style={[styles.emptyText, { color: theme.colors.text.primary }]}>
                  No hay comentarios
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.text.secondary }]}>
                  ¡Sé el primero en comentar!
                </Text>
              </View>
            }
          />
          
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background.paper }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary }]}
              placeholder="Escribe un comentario..."
              placeholderTextColor={theme.colors.text.secondary}
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