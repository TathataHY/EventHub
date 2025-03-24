import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Solicitar permisos para usar la cámara
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setPermissionError('Se ha denegado el permiso para usar la cámara');
      }
    })();
  }, []);

  // Función para volver a solicitar permisos
  const requestPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setPermissionError('Se ha denegado el permiso para usar la cámara');
      }
    } catch (err) {
      console.error('Error al solicitar permisos de cámara:', err);
      setPermissionError('Error al solicitar permisos de cámara');
    }
  };

  // Manejar el escaneo de un código de barras
  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.text, { color: theme.colors.text.primary }]}>
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.text, { color: theme.colors.text.primary }]}>
          {permissionError || 'Se requiere permiso para acceder a la cámara'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => requestPermission()}
        >
          <Text style={styles.buttonText}>Solicitar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        type={BarCodeScanner.Constants.Type.back}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.torchButton} 
          onPress={() => setTorch(!torch)}
        >
          <Ionicons 
            name={torch ? "flash" : "flash-outline"} 
            size={28} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
      
      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.rescanText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.instructions}>
        Coloca el código QR dentro del cuadro para escanear
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  controlsContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  rescanText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    borderRadius: 8,
  },
});