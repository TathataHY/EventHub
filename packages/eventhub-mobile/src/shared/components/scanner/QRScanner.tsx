import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
// @ts-ignore
import { CameraView } from 'expo-camera/next';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { useTheme } from '../../../shared/hooks/useTheme';

import { getColorValue } from '@theme/index';
import { colors } from '@theme/base/colors';

interface QRScannerProps {
  /**
   * Función que se ejecuta cuando se escanea un código QR
   */
  onScan: (data: string) => void;
  
  /**
   * Función que se ejecuta cuando se cierra el escáner
   */
  onClose: () => void;
  
  /**
   * Texto que se muestra en la parte superior del escáner
   */
  title?: string;
  
  /**
   * Texto que se muestra como instrucción
   */
  instructionText?: string;
}

/**
 * Componente para escanear códigos QR
 */
export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
  title = 'Escanear Código QR',
  instructionText = 'Coloca el código QR dentro del marco para escanearlo'
}) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  
  // Solicitar permisos de cámara al montar el componente
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  // Manejar el escaneo de un código de barras
  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    if (scanned) return;
    
    // Sólo procesar códigos QR
    if (scanningResult.type === 'qr') {
      setScanned(true);
      onScan(scanningResult.data);
    }
  };
  
  // Renderizar según el estado de los permisos
  if (hasPermission === null) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: '#FFFFFF' }]}>
        <ActivityIndicator size="large" color={getColorValue(colors.primary)} />
        <Text style={[styles.permissionText, { color: '#000000' }]}>
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: '#FFFFFF' }]}>
        <Ionicons name="camera-outline" size={64} color={getColorValue(colors.error)} />
        <Text style={[styles.permissionTitle, { color: '#000000' }]}>
          No hay acceso a la cámara
        </Text>
        <Text style={[styles.permissionText, { color: '#000000' }]}>
          Para escanear códigos QR, debes permitir el acceso a la cámara en la configuración de tu dispositivo.
        </Text>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: getColorValue(colors.primary) }]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Cámara */}
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Parte superior */}
          <View style={[styles.topSection, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.instructionText}>{instructionText}</Text>
          </View>
          
          {/* Sección central con las esquinas */}
          <View style={styles.middleSection}>
            <View style={[styles.sideSection, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]} />
            
            <View style={styles.scannerContainer}>
              {/* Esquinas del marco */}
              <View style={[styles.corner, styles.topLeftCorner, { borderColor: getColorValue(colors.primary) }]} />
              <View style={[styles.corner, styles.topRightCorner, { borderColor: getColorValue(colors.primary) }]} />
              <View style={[styles.corner, styles.bottomLeftCorner, { borderColor: getColorValue(colors.primary) }]} />
              <View style={[styles.corner, styles.bottomRightCorner, { borderColor: getColorValue(colors.primary) }]} />
            </View>
            
            <View style={[styles.sideSection, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]} />
          </View>
          
          {/* Parte inferior */}
          <View style={[styles.bottomSection, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Ionicons name="close-circle" size={64} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');
const scannerSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topSection: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  middleSection: {
    flexDirection: 'row',
  },
  sideSection: {
    width: (width - scannerSize) / 2,
    height: scannerSize,
  },
  scannerContainer: {
    width: scannerSize,
    height: scannerSize,
    position: 'relative',
  },
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonBottom: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 4,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 12,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});