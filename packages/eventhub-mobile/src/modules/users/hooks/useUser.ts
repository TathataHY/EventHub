import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import { authService } from '../../auth/services/auth.service';
import { User, UserProfile, ProfileUpdateData } from '../types';

/**
 * Hook para gestionar operaciones relacionadas con usuarios
 */
export const useUser = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil del usuario actual
  const loadCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await userService.getCurrentUser();
      setCurrentUser(userData as UserProfile); // Forzar tipo para evitar errores
    } catch (err) {
      console.error('Error loading current user:', err);
      setError('Error al cargar la información del usuario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtener perfil de usuario por ID
   */
  const getUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const userProfile = await userService.getUserProfile(userId);
      return userProfile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('No se pudo cargar el perfil del usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = useCallback(async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar aserción de tipo para evitar errores de tipado
      const updatedProfile = await userService.updateUserProfile(userData as any);
      
      // Actualizar usuario en estado manteniendo campos que no se actualizaron
      // Usar aserción de tipo para evitar errores de tipado
      setCurrentUser((prev: any) => {
        if (!prev) return updatedProfile;
        return { ...prev, ...updatedProfile };
      });
      
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Error al actualizar el perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Añadir función updateProfile para compatibilidad con ProfileEditScreen
  const updateProfile = async (profileData: any) => {
    try {
      setIsLoading(true);
      
      // Añadir aserción de tipo para evitar problemas con location
      const result: any = await userService.updateUserProfile(profileData as any);
      
      if (result && result.success) {
        setCurrentUser(result.user);
        setError(null);
      } else {
        setError((result && result.error) || 'Error al actualizar perfil');
      }
      
      return result || { success: false };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error al actualizar perfil');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener eventos creados por el usuario
   */
  const getUserEvents = async (userId?: string) => {
    try {
      setIsLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('User ID is required');
      
      const events = await userService.getUserEvents(targetUserId);
      return events;
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError('No se pudieron cargar los eventos del usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener eventos a los que asiste el usuario
   */
  const getUserAttendingEvents = async (userId?: string) => {
    try {
      setIsLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('User ID is required');
      
      const events = await userService.getUserAttendingEvents(targetUserId);
      return events;
    } catch (err) {
      console.error('Error fetching attending events:', err);
      setError('No se pudieron cargar los eventos a los que asiste el usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener eventos guardados por el usuario
   */
  const getSavedEvents = async () => {
    try {
      setIsLoading(true);
      if (!currentUser?.id) throw new Error('User is not authenticated');
      
      const events = await userService.getSavedEvents(currentUser.id);
      return events;
    } catch (err) {
      console.error('Error fetching saved events:', err);
      setError('No se pudieron cargar los eventos guardados');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guardar/remover un evento de favoritos
   */
  const toggleSaveEvent = async (eventId: string) => {
    try {
      setIsLoading(true);
      if (!currentUser?.id) throw new Error('User is not authenticated');
      
      const result = await userService.toggleSaveEvent(eventId);
      return result;
    } catch (err) {
      console.error('Error toggling saved event:', err);
      setError('No se pudo actualizar el evento guardado');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    loading: isLoading,
    isLoading,
    error,
    loadCurrentUser,
    getUserProfile,
    updateUserProfile,
    getUserEvents,
    getUserAttendingEvents,
    getSavedEvents,
    toggleSaveEvent,
    updateProfile,
  };
}; 