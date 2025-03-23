import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { TicketStatus } from '@modules/tickets/types';
import QR from 'qrcode-svg';

interface TicketQRCodeProps {
  qrValue: string;
  size?: number;
  status: TicketStatus;
  showStatus?: boolean;
}

/**
 * Componente para mostrar el código QR de un ticket
 * NOTA: Esta es una versión simplificada que usa una imagen de muestra
 * En una implementación real, usaríamos react-native-qrcode-svg
 */
export const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  qrValue,
  size = 200,
  status,
  showStatus = true
}) => {
  const { theme } = useTheme();
  
  // Determinar el color según el estado del ticket
  const getStatusColor = () => {
    switch (status) {
      case 'valid':
        return theme.colors.success.main;
      case 'used':
        return theme.colors.warning.main;
      case 'expired':
      case 'cancelled':
        return theme.colors.error.main;
      default:
        return theme.colors.primary.main;
    }
  };

  // Determinar el texto según el estado del ticket
  const getStatusText = () => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'used':
        return 'Utilizado';
      case 'expired':
        return 'Expirado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return '';
    }
  };

  // Determinar si el QR debe mostrarse o no según el estado
  const shouldShowQR = status === 'valid';
  
  // URL de una imagen de QR de muestra
  const sampleQRUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrValue);

  return (
    <View style={styles.container}>
      {qrValue ? (
        <>
          <View 
            style={[
              styles.qrContainer, 
              { 
                borderColor: getStatusColor(),
                opacity: shouldShowQR ? 1 : 0.5
              }
            ]}
          >
            {shouldShowQR ? (
              <Image 
                source={{ uri: sampleQRUrl }}
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.invalidQRContainer}>
                <Image 
                  source={{ uri: sampleQRUrl }}
                  style={{ width: size, height: size }}
                  resizeMode="contain"
                />
                <View style={[styles.invalidOverlay, { backgroundColor: `${theme.colors.background.default}99` }]}>
                  <Text style={[styles.invalidText, { color: getStatusColor() }]}>
                    {getStatusText()}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {showStatus && (
            <View 
              style={[
                styles.statusContainer, 
                { backgroundColor: `${getStatusColor()}20` }
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          )}
        </>
      ) : (
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  qrContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invalidQRContainer: {
    position: 'relative',
  },
  invalidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  invalidText: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transform: [{ rotate: '-30deg' }],
  },
  statusContainer: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  }
}); 