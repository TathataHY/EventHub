import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Alert
} from 'react-native';
// @ts-ignore
import { CameraView } from 'expo-camera/next';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getColorValue } from '@theme/index';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

/**
 * Componente para escanear códigos QR
 */
export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  // Solicitar permisos para usar la cámara
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Se necesita acceso a la cámara para escanear códigos QR',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    })();
  }, []);

  // Manejar el escaneo de un código QR
  const handleBarCodeScanned = (scanResult: BarCodeScannerResult) => {
    if (scanned) return;
    
    setScanned(true);
    onScan(scanResult.data);
  };

  // Alternar la linterna
  const toggleTorch = () => {
    setTorch(prevTorch => !prevTorch);
  };

  // Si no hay permisos, mostrar mensaje
  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background.default) }]}>
        <Text style={[styles.text, { color: getColorValue(theme.colors.text) }]}>
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }

  // Si no se otorgaron permisos, mostrar mensaje
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background.default) }]}>
        <Text style={[styles.text, { color: getColorValue(theme.colors.text) }]}>
          Sin acceso a la cámara
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: getColorValue(theme.colors.primary.main) }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {/* Área de escaneo */}
          <View style={styles.scanArea} />
          
          {/* Texto de instrucción */}
          <Text style={styles.scanText}>
            Alinea el código QR dentro del recuadro
          </Text>
          
          {/* Botones de control */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleTorch}
            >
              <Ionicons 
                name={torch ? 'flash' : 'flash-outline'} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 