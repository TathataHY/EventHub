import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import { UserPreferences } from '../types';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar las preferencias del usuario
  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userPreferences = await userService.getPreferences();
      setPreferences(userPreferences);
    } catch (err) {
      setError('Error al cargar las preferencias');
      console.error('Error en useUserPreferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar las preferencias del usuario
  const updatePreferences = useCallback(async (updatedPrefs: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPreferences = await userService.updatePreferences(updatedPrefs);
      setPreferences(updatedPreferences);
      return { success: true };
    } catch (err) {
      setError('Error al actualizar las preferencias');
      console.error('Error en updatePreferences:', err);
      return { success: false, error: 'Error al actualizar las preferencias' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar una preferencia específica
  const updateSinglePreference = useCallback(
    async (key: keyof UserPreferences, value: any) => {
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
    isLoading,
    error,
    loadPreferences,
    updatePreferences,
    updateSinglePreference
  };
}; 