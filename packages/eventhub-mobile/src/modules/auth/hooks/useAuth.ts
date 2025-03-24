import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
// Importamos desde react-query ya que está instalada
import { useQuery, useQueryClient } from 'react-query';
// Importamos correctamente el servicio de autenticación
import { authService } from '../services/auth.service';
// Comentamos la importación no existente
// import { useToast } from '@modules/ui/hooks/useToast';

// Interfaz para los parámetros de login
export interface LoginParams {
  email: string;
  password: string;
}

// Interfaz para la respuesta de autenticación con tipo any para evitar conflictos
export interface AuthResponse {
  user: any;
  accessToken: string;
  token?: string;
}

// Interfaz propia para representar un usuario autenticado, sin modificar User original
export interface AuthenticatedUser {
  id: string;
  name?: string;
  firstName?: string;
  username?: string;
  email: string;
  [key: string]: any; // Para campos adicionales
}

/**
 * Hook para manejar la autenticación del usuario
 * @returns Funciones y estado de autenticación
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  // Implementamos un toast simple mientras se implementa el módulo de UI
  const toast = {
    show: ({ message, type }: { message: string; type: string }) => {
      console.log(`[${type}] ${message}`);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consulta para obtener el usuario autenticado
  const { data: currentUser, isLoading: isLoadingUser } = useQuery<AuthenticatedUser | null>(
    ['currentUser'],
    async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return null;
        
        const user = await authService.getCurrentUser();
        return user as AuthenticatedUser;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    }
  );

  // Función para iniciar sesión
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const params: LoginParams = { email, password };
      const response: any = await authService.login(params);
      // Usar accessToken o token según lo que esté disponible
      const token = response.accessToken || response.token || '';
      
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Actualizar datos de usuario en caché
      queryClient.setQueryData(['currentUser'], response.user);
      
      // Mostrar mensaje de éxito
      const user = response.user || {};
      toast.show({
        message: `¡Bienvenido, ${user.name || user.firstName || user.username || 'Usuario'}!`,
        type: 'success',
      });
      
      // Navegar a la pantalla principal
      router.replace('/(tabs)');
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast.show({
        message: error.message || 'Error al iniciar sesión',
        type: 'error',
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, toast]);

  // Función para registrar un usuario
  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    try {
      const response: any = await authService.register(userData);
      // Usar accessToken o token según lo que esté disponible
      const token = response.accessToken || response.token || '';
      
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Actualizar datos de usuario en caché
      queryClient.setQueryData(['currentUser'], response.user);
      
      // Mostrar mensaje de éxito
      const user = response.user || {};
      toast.show({
        message: `¡Bienvenido, ${user.name || user.firstName || user.username || 'Usuario'}!`,
        type: 'success',
      });
      
      // Navegar a la pantalla principal
      router.replace('/(tabs)');
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast.show({
        message: error.message || 'Error al registrar usuario',
        type: 'error',
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, toast]);

  // Función para cerrar sesión
  const logout = useCallback(async () => {
    try {
      // Eliminar token de AsyncStorage
      await AsyncStorage.removeItem('token');
      
      // Eliminar datos de usuario en caché
      queryClient.setQueryData(['currentUser'], null);
      
      // Navegar a la pantalla de login
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [queryClient]);

  /**
   * Solicitar restablecimiento de contraseña
   * @param email Correo electrónico del usuario
   */
  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordReset(email);
      setError(null);
    } catch (err) {
      setError('Error al solicitar restablecimiento de contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Restablecer contraseña con token
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   */
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, newPassword);
      setError(null);
    } catch (err) {
      setError('Error al restablecer contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: isLoading || isLoadingUser,
    error,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
  };
};

export default useAuth;