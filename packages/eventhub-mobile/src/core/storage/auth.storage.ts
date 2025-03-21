/**
 * Funciones de almacenamiento para datos de autenticación
 * Maneja la persistencia de tokens y datos de usuario
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para almacenamiento
const STORAGE_KEYS = {
  AUTH_TOKEN: '@EventHub:auth_token',
  USER_ID: '@EventHub:user_id',
  USER_DATA: '@EventHub:user_data',
  REFRESH_TOKEN: '@EventHub:refresh_token',
};

/**
 * Guarda el token de autenticación
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error al guardar el token de autenticación:', error);
    throw error;
  }
};

/**
 * Obtiene el token de autenticación
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
    return null;
  }
};

/**
 * Guarda el token de actualización
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error al guardar el token de actualización:', error);
    throw error;
  }
};

/**
 * Obtiene el token de actualización
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error al obtener el token de actualización:', error);
    return null;
  }
};

/**
 * Guarda el ID del usuario autenticado
 */
export const saveUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  } catch (error) {
    console.error('Error al guardar el ID de usuario:', error);
    throw error;
  }
};

/**
 * Obtiene el ID del usuario autenticado
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('Error al obtener el ID de usuario:', error);
    return null;
  }
};

/**
 * Guarda los datos del usuario
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
  } catch (error) {
    console.error('Error al guardar los datos de usuario:', error);
    throw error;
  }
};

/**
 * Obtiene los datos del usuario
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error al obtener los datos de usuario:', error);
    return null;
  }
};

/**
 * Borra todos los datos de autenticación
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  } catch (error) {
    console.error('Error al borrar los datos de autenticación:', error);
    throw error;
  }
}; 