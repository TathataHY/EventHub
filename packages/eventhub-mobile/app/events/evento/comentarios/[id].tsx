import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '../../../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Divider } from '../../../../src/components/common/Divider';

// Tipo para los comentarios
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  date: string;
  likes: number;
  userLiked: boolean;
}

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [eventTitle, setEventTitle] = useState('');

  // Simulamos datos del evento y comentarios
  useEffect(() => {
    // En una app real, aquí cargaríamos los datos del evento y sus comentarios desde una API
    setTimeout(() => {
      setEventTitle('Festival de Música Electrónica');
      setComments([
        {
          id: '1',
          userId: 'user1',
          userName: 'María García',
          userImage: 'https://randomuser.me/api/portraits/women/12.jpg',
          text: '¡Excelente evento! La música estuvo increíble y el ambiente fue muy bueno.',
          date: '2023-12-01T14:30:00',
          likes: 15,
          userLiked: true,
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Carlos Rodríguez',
          userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
          text: 'Me encantó la selección de DJs, pero el sonido podría haber sido mejor en algunas zonas.',
          date: '2023-12-01T16:45:00',
          likes: 7,
          userLiked: false,
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Ana Martínez',
          userImage: 'https://randomuser.me/api/portraits/women/45.jpg',
          text: 'La organización fue impecable, todo comenzó a tiempo y el personal fue muy amable.',
          date: '2023-12-02T09:20:00',
          likes: 22,
          userLiked: false,
        },
        {
          id: '4',
          userId: 'user4',
          userName: 'Juan López',
          userImage: 'https://randomuser.me/api/portraits/men/67.jpg',
          text: 'Las bebidas estaban un poco caras, pero la experiencia general valió la pena.',
          date: '2023-12-02T11:15:00',
          likes: 5,
          userLiked: false,
        },
        {
          id: '5',
          userId: 'user5',
          userName: 'Laura Fernández',
          userImage: 'https://randomuser.me/api/portraits/women/22.jpg',
          text: '¡Definitivamente volveré el próximo año! Fue una experiencia inolvidable.',
          date: '2023-12-03T08:30:00',
          likes: 18,
          userLiked: true,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      }
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Enviar nuevo comentario
  const handleSendComment = () => {
    if (newComment.trim() === '') return;
    
    setIsSending(true);
    
    // Simulamos el envío a una API
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `temp-${Date.now()}`,
        userId: 'currentUser',
        userName: 'Yo',
        userImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        text: newComment,
        date: new Date().toISOString(),
        likes: 0,
        userLiked: false,
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setIsSending(false);
    }, 500);
  };

  // Dar like a un comentario
  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          const liked = !comment.userLiked;
          return {
            ...comment,
            userLiked: liked,
            likes: liked ? comment.likes + 1 : comment.likes - 1,
          };
        }
        return comment;
      })
    );
  };

  // Reportar comentario
  const handleReportComment = (commentId: string) => {
    Alert.alert(
      'Reportar comentario',
      '¿Estás seguro de que quieres reportar este comentario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reportar',
          onPress: () => {
            // Aquí iría la lógica para reportar el comentario
            Alert.alert(
              'Comentario reportado',
              'Gracias por ayudarnos a mantener una comunidad respetuosa.',
              [{ text: 'OK' }]
            );
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Renderizar un comentario
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={[styles.commentItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: item.userImage }} 
            style={styles.userImage} 
          />
          <View>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {item.userName}
            </Text>
            <Text style={[styles.commentDate, { color: theme.colors.secondaryText }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => handleReportComment(item.id)}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.secondaryText} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.commentText, { color: theme.colors.text }]}>
        {item.text}
      </Text>
      
      <View style={styles.commentFooter}>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Ionicons 
            name={item.userLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={item.userLiked ? "#FF5252" : theme.colors.secondaryText} 
          />
          <Text 
            style={[
              styles.likeCount, 
              { 
                color: item.userLiked 
                  ? "#FF5252" 
                  : theme.colors.secondaryText
              }
            ]}
          >
            {item.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.replyButton}>
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.replyText, { color: theme.colors.secondaryText }]}>
            Responder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar separador entre comentarios
  const renderSeparator = () => <Divider style={styles.divider} />;

  // Renderizar cuando no hay comentarios
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={80} color={theme.colors.secondaryText} />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        No hay comentarios todavía
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.secondaryText }]}>
        ¡Sé el primero en comentar!
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Cabecera de evento */}
      <View style={[styles.eventHeader, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {isLoading ? 'Cargando...' : eventTitle}
        </Text>
        <Text style={[styles.commentCount, { color: theme.colors.secondaryText }]}>
          {isLoading ? '' : `${comments.length} comentarios`}
        </Text>
      </View>
      
      <Divider />

      {/* Lista de comentarios */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Cargando comentarios...
          </Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.commentsList}
        />
      )}

      {/* Campo para nuevo comentario */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }
          ]}
          placeholder="Escribe un comentario..."
          placeholderTextColor={theme.colors.secondaryText}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: theme.colors.primary,
              opacity: newComment.trim() === '' || isSending ? 0.5 : 1 
            }
          ]}
          onPress={handleSendComment}
          disabled={newComment.trim() === '' || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventHeader: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentCount: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 0,
  },
  commentsList: {
    flexGrow: 1,
  },
  commentItem: {
    padding: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 14,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 