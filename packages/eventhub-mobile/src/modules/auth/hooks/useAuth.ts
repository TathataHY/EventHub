import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User, RegisterData } from '../types';

// Usamos User del módulo types pero usamos la respuesta del service
type ServiceUser = Awaited<ReturnType<typeof authService.getCurrentUser>>;
type ServiceAuthResponse = Awaited<ReturnType<typeof authService.register>>;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          // Adaptamos el formato del usuario si es necesario
          setUser(currentUser as unknown as User);
        }
        setError(null);
      } catch (err) {
        setError('Error al verificar estado de autenticación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const loggedUser = await authService.login({ email, password });
      // Adaptamos el formato del usuario si es necesario
      setUser(loggedUser as unknown as User);
      setError(null);
      return loggedUser;
    } catch (err) {
      setError('Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      // Adaptamos el formato para el servicio
      const serviceData = {
        ...userData,
        confirmPassword: userData.password
      };
      const response = await authService.register(serviceData as any);
      // Adaptamos el formato del usuario si es necesario
      setUser((response.user || response) as unknown as User);
      setError(null);
      return response;
    } catch (err) {
      setError('Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicitar restablecimiento de contraseña
   * @param email Correo electrónico del usuario
   */
  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      setError(null);
    } catch (err) {
      setError('Error al solicitar restablecimiento de contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Restablecer contraseña con token
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   */
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setError(null);
    } catch (err) {
      setError('Error al restablecer contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user
  };
} 