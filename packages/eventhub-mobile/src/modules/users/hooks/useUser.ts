import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { authService } from '../../auth/services/auth.service';
import { User, UserProfile } from '../types';

/**
 * Hook para gestionar operaciones relacionadas con usuarios
 */
export function useUser() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar información del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        // Si estamos usando mock data, podemos usar esto:
        const userData = await userService.getCurrentUserProfile();
        setCurrentUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  /**
   * Obtener perfil de usuario por ID
   */
  const getUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const userProfile = await userService.getUserProfile(userId);
      return userProfile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('No se pudo cargar el perfil del usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar perfil de usuario
   */
  const updateProfile = async (userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const updatedProfile = await userService.updateUserProfile(userData);
      setCurrentUser((prev) => {
        if (!prev) return updatedProfile;
        return { ...prev, ...updatedProfile };
      });
      setError(null);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('No se pudo actualizar el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener eventos creados por el usuario
   */
  const getUserEvents = async (userId?: string) => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('User ID is required');
      
      const events = await userService.getUserEvents(targetUserId);
      return events;
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError('No se pudieron cargar los eventos del usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener eventos a los que asiste el usuario
   */
  const getUserAttendingEvents = async (userId?: string) => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('User ID is required');
      
      const events = await userService.getUserAttendingEvents(targetUserId);
      return events;
    } catch (err) {
      console.error('Error fetching attending events:', err);
      setError('No se pudieron cargar los eventos a los que asiste el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener eventos guardados por el usuario
   */
  const getSavedEvents = async () => {
    try {
      setLoading(true);
      if (!currentUser?.id) throw new Error('User is not authenticated');
      
      const events = await userService.getSavedEvents(currentUser.id);
      return events;
    } catch (err) {
      console.error('Error fetching saved events:', err);
      setError('No se pudieron cargar los eventos guardados');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar/remover un evento de favoritos
   */
  const toggleSaveEvent = async (eventId: string) => {
    try {
      setLoading(true);
      if (!currentUser?.id) throw new Error('User is not authenticated');
      
      const result = await userService.toggleSaveEvent(eventId);
      return result;
    } catch (err) {
      console.error('Error toggling saved event:', err);
      setError('No se pudo actualizar el evento guardado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    loading,
    error,
    getUserProfile,
    updateProfile,
    getUserEvents,
    getUserAttendingEvents,
    getSavedEvents,
    toggleSaveEvent,
  };
} 