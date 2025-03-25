import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToastMessage from 'react-native-toast-message';
import { useTheme } from '@core/context/ThemeContext';

// Definición de tipos para ToastProps
export interface ToastProps {
  type?: 'success' | 'error' | 'info';
  position?: 'top' | 'bottom';
  text1?: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
}

// Tipo para los parámetros de los toast
interface ToastContentProps {
  text1?: string;
  text2?: string;
  [key: string]: any;
}

// Componente ToastProvider que configura los estilos de Toast
export const ToastProvider = () => {
  const { theme } = useTheme();
  
  // Devuelve el componente ToastMessage configurado
  return <ToastMessage config={{
    // Configuración básica de ToastMessage
    success: ({ text1, text2, ...rest }: ToastContentProps) => (
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.titleText}>{text1}</Text>
        {text2 && <Text style={styles.messageText}>{text2}</Text>}
      </View>
    ),
    error: ({ text1, text2, ...rest }: ToastContentProps) => (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.titleText}>{text1}</Text>
        {text2 && <Text style={styles.messageText}>{text2}</Text>}
      </View>
    ),
    info: ({ text1, text2, ...rest }: ToastContentProps) => (
      <View style={[styles.container, styles.infoContainer]}>
        <Text style={styles.titleText}>{text1}</Text>
        {text2 && <Text style={styles.messageText}>{text2}</Text>}
      </View>
    ),
  }} />;
};

// Exportamos Toast para usarlo en toda la aplicación
// Esto permite llamar a Toast.show() desde cualquier lugar
// sin necesidad de importar 'react-native-toast-message'
const Toast = ToastMessage;
export default Toast;

// Estilos para los toast personalizados
const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successContainer: {
    backgroundColor: '#4CAF50',
  },
  errorContainer: {
    backgroundColor: '#F44336',
  },
  infoContainer: {
    backgroundColor: '#2196F3',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
}); 