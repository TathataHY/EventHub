import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { appColors, appTypography, appSpacing } from '@theme/index';
import { Card } from '@shared/components/ui';
import { userService } from '../services/user.service';

// Definir interfaz para las estadísticas
interface UserStats {
  eventsOrganized: number;
  eventsAttended: number;
  eventsSaved: number;
  followersCount: number;
  followingCount: number;
  comments: number;
  eventHours: number;
  ratings: number;
  shared: number;
  citiesVisited: number;
  ticketsPurchased: number;
  favoriteCategories: string[];
  achievementsUnlocked: number;
  firstEventDate: string;
}

/**
 * Pantalla que muestra las estadísticas del usuario
 */
export const UserStatsScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      // Obtener el perfil del usuario actual
      const currentUser = await userService.getCurrentUserProfile();
      // Obtener sus estadísticas
      const userStats = await userService.getUserStats(currentUser.id);
      setStats(userStats as UserStats);
    } catch (error) {
      console.error('Error al cargar estadísticas del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar una tarjeta de estadística
  const renderStatCard = (icon: string, title: string, value: number, color = appColors.primary.main) => {
    return (
      <Card style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appColors.primary.main} />
        <Text style={styles.loaderText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.loaderContainer}>
        <Ionicons name="stats-chart" size={64} color={appColors.grey[300]} />
        <Text style={styles.emptyText}>No hay estadísticas disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Estadísticas</Text>
        <Text style={styles.subtitle}>
          Un resumen de tu actividad en EventHub
        </Text>
      </View>
      
      {/* Sección de eventos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'calendar-outline', 
            'Eventos Organizados', 
            stats.eventsOrganized || 0
          )}
          {renderStatCard(
            'people-outline', 
            'Eventos Asistidos', 
            stats.eventsAttended || 0, 
            appColors.success.main
          )}
          {renderStatCard(
            'bookmark-outline', 
            'Eventos Guardados', 
            stats.eventsSaved || 0, 
            appColors.info.main
          )}
        </View>
      </View>
      
      {/* Sección de conexiones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conexiones</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'people', 
            'Seguidores', 
            stats.followersCount || 0, 
            appColors.secondary.main
          )}
          {renderStatCard(
            'person-add-outline', 
            'Siguiendo', 
            stats.followingCount || 0, 
            appColors.warning.main
          )}
          {renderStatCard(
            'chatbubble-outline', 
            'Comentarios', 
            stats.comments || 0, 
            appColors.info.main
          )}
        </View>
      </View>
      
      {/* Sección de actividad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'time-outline', 
            'Horas en Eventos', 
            stats.eventHours || 0,
            appColors.info.main
          )}
          {renderStatCard(
            'thumbs-up-outline', 
            'Valoraciones', 
            stats.ratings || 0,
            appColors.success.main
          )}
          {renderStatCard(
            'share-social-outline', 
            'Compartidos', 
            stats.shared || 0,
            appColors.warning.main
          )}
        </View>
      </View>
      
      {/* Sección de estadísticas adicionales */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de Actividad</Text>
        
        {/* Fila de estadística */}
        <View style={styles.summaryRow}>
          <Ionicons name="location-outline" size={20} color={appColors.primary.main} />
          <Text style={styles.summaryLabel}>Ciudades visitadas:</Text>
          <Text style={styles.summaryValue}>{stats.citiesVisited || 0}</Text>
        </View>
        
        {/* Fila de estadística */}
        <View style={styles.summaryRow}>
          <Ionicons name="ticket-outline" size={20} color={appColors.primary.main} />
          <Text style={styles.summaryLabel}>Tickets comprados:</Text>
          <Text style={styles.summaryValue}>{stats.ticketsPurchased || 0}</Text>
        </View>
        
        {/* Fila de estadística */}
        <View style={styles.summaryRow}>
          <Ionicons name="flag-outline" size={20} color={appColors.primary.main} />
          <Text style={styles.summaryLabel}>Categorías favoritas:</Text>
          <Text style={styles.summaryValue}>{stats.favoriteCategories?.length || 0}</Text>
        </View>
        
        {/* Fila de estadística */}
        <View style={styles.summaryRow}>
          <Ionicons name="trophy-outline" size={20} color={appColors.primary.main} />
          <Text style={styles.summaryLabel}>Logros desbloqueados:</Text>
          <Text style={styles.summaryValue}>{stats.achievementsUnlocked || 0}</Text>
        </View>
        
        {/* Fila de estadística */}
        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={20} color={appColors.primary.main} />
          <Text style={styles.summaryLabel}>Primer evento:</Text>
          <Text style={styles.summaryValue}>
            {stats.firstEventDate 
              ? new Date(stats.firstEventDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    padding: appSpacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
  },
  loaderText: {
    ...appTypography.body1,
    color: appColors.grey[600],
    marginTop: appSpacing.md,
    fontWeight: 'normal' as const,
  },
  emptyText: {
    ...appTypography.h6,
    color: appColors.grey[600],
    marginTop: appSpacing.md,
    fontWeight: 'bold' as const,
  },
  header: {
    marginBottom: appSpacing.lg,
  },
  title: {
    ...appTypography.h4,
    color: appColors.text,
    marginBottom: appSpacing.xs,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    ...appTypography.body2,
    color: appColors.grey[600],
    fontWeight: 'normal' as const,
  },
  section: {
    marginBottom: appSpacing.lg,
  },
  sectionTitle: {
    ...appTypography.h6,
    color: appColors.text,
    marginBottom: appSpacing.md,
    fontWeight: 'bold' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (Dimensions.get('window').width - (appSpacing.md * 3)) / 3,
    padding: appSpacing.sm,
    alignItems: 'center',
    marginBottom: appSpacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: appSpacing.xs,
  },
  statValue: {
    ...appTypography.h5,
    color: appColors.text,
    fontWeight: 'bold' as const,
    marginBottom: 2,
  },
  statTitle: {
    ...appTypography.caption,
    color: appColors.grey[600],
    textAlign: 'center',
    fontWeight: 'normal' as const,
  },
  summaryCard: {
    padding: appSpacing.md,
    marginBottom: appSpacing.xl,
  },
  summaryTitle: {
    ...appTypography.subtitle1,
    color: appColors.text,
    marginBottom: appSpacing.md,
    fontWeight: 'bold' as const,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSpacing.sm,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey[200],
  },
  summaryLabel: {
    ...appTypography.body2,
    color: appColors.grey[700],
    flex: 1,
    marginLeft: appSpacing.sm,
    fontWeight: 'normal' as const,
  },
  summaryValue: {
    ...appTypography.body2,
    color: appColors.text,
    fontWeight: 'bold' as const,
  },
}); 