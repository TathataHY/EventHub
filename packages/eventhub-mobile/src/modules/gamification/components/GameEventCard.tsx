import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '@shared/components/ui/Card';

interface GameEventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    type: string;
    points: number;
    dateText: string;
    imageUrl?: string;
    completed: boolean;
  };
  onPress?: (eventId: string) => void;
}

/**
 * Componente para mostrar eventos relacionados con gamificación
 */
export const GameEventCard: React.FC<GameEventCardProps> = ({
  event,
  onPress
}) => {
  const { theme } = useTheme();
  
  // Determinar colores e iconos según el tipo de evento y si está completado
  const getEventTypeInfo = () => {
    const baseInfo: Record<string, { icon: string; color: string }> = {
      'attendance': { 
        icon: 'calendar', 
        color: theme.colors.success.main 
      },
      'social': { 
        icon: 'people', 
        color: theme.colors.info.main 
      },
      'creation': { 
        icon: 'add-circle', 
        color: theme.colors.primary.main 
      },
      'achievement': { 
        icon: 'trophy', 
        color: theme.colors.warning.main 
      },
      'challenge': { 
        icon: 'flag', 
        color: theme.colors.secondary.main 
      }
    };
    
    const typeInfo = baseInfo[event.type] || baseInfo['achievement'];
    
    // Si está completado, añadir '-outline' al icono
    if (!event.completed) {
      typeInfo.icon = `${typeInfo.icon}-outline`;
    }
    
    return typeInfo;
  };
  
  const { icon, color } = getEventTypeInfo();
  
  return (
    <Card style={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress && onPress(event.id)}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${String(theme.colors.text.secondary)}20` }]}>
            <Ionicons 
              name={icon as any}
              size={24}
              color={theme.colors.text.secondary}
            />
          </View>
          
          <View style={styles.pointsContainer}>
            <Text style={[styles.pointsText, { color: theme.colors.text.secondary }]}>
              +{event.points}
            </Text>
            <Ionicons 
              name="star" 
              size={16} 
              color={theme.colors.warning.main}
            />
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {event.imageUrl && (
            <Image 
              source={{ uri: event.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.textContainer}>
            <Text 
              style={[
                styles.title, 
                { 
                  color: theme.colors.text.primary,
                  textDecorationLine: event.completed ? 'line-through' : 'none'
                }
              ]}
              numberOfLines={2}
            >
              {event.title}
            </Text>
            
            <Text 
              style={[styles.description, { color: theme.colors.text.secondary }]}
              numberOfLines={2}
            >
              {event.description}
            </Text>
            
            <View style={styles.dateContainer}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={theme.colors.text.secondary}
              />
              <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
                {event.dateText}
              </Text>
            </View>
          </View>
        </View>
        
        {event.completed && (
          <View style={[styles.completeBadge, { backgroundColor: theme.colors.success.main }]}>
            <Ionicons name="checkmark" size={14} color="#FFF" />
            <Text style={styles.completeText}>Completado</Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  container: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  completeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  }
}); 