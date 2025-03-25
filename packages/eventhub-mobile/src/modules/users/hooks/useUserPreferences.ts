import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import { UserAppPreferences } from '../types/user.types';

/**
 * Hook personalizado para manejar las preferencias del usuario
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserAppPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar las preferencias del usuario
  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userPreferences = await userService.getPreferences();
      setPreferences(userPreferences);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar las preferencias'));
      console.error('Error al cargar las preferencias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar las preferencias del usuario
  const updatePreferences = useCallback(async (updatedPrefs: Partial<UserAppPreferences>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!preferences) {
        throw new Error('No se han cargado las preferencias');
      }
      
      // Actualización local para UI inmediata
      setPreferences({ ...preferences, ...updatedPrefs });
      
      // Guardar en el servidor
      const updatedPreferences = await userService.updatePreferences(updatedPrefs);
      setPreferences(updatedPreferences);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al actualizar las preferencias'));
      console.error('Error al actualizar las preferencias:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  // Actualizar una preferencia específica
  const updateSinglePreference = useCallback(
    async (key: keyof UserAppPreferences, value: any) => {
      if (!preferences) return { success: false, error: 'No hay preferencias cargadas' };
      
      return updatePreferences({ ...preferences, [key]: value });
    },
    [preferences, updatePreferences]
  );

  // Cargar las preferencias al montar el componente
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    error,
    loadPreferences,
    updatePreferences,
    updateSinglePreference
  };
}; 