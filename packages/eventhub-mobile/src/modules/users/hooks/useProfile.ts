import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import { UserProfile, UpdateProfileParams } from '../types/user.types';

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar el perfil del usuario
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profile = await userService.getProfile();
      setUser(profile);
    } catch (err) {
      setError('Error al cargar el perfil de usuario');
      console.error('Error en useProfile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar el perfil del usuario
  const updateProfile = useCallback(async (params: UpdateProfileParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(params);
      setUser(updatedProfile);
      return { success: true };
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error('Error en updateProfile:', err);
      return { success: false, error: 'Error al actualizar el perfil' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subir foto de perfil
  const uploadProfilePhoto = useCallback(async (imageUri: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { photoURL } = await userService.updateProfilePhoto(imageUri);
      
      if (user) {
        // La foto se actualiza en el servidor, ahora actualizamos el estado local
        setUser({
          ...user,
          photoURL
        });
      }
      
      return { success: true, photoURL };
    } catch (err) {
      setError('Error al subir la foto de perfil');
      console.error('Error en uploadProfilePhoto:', err);
      return { success: false, error: 'Error al subir la foto de perfil' };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Cargar el perfil al montar el componente
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    uploadProfilePhoto
  };
}; 