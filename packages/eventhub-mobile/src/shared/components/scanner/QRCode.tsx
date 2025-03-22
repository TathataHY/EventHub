import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as SVG from 'react-native-svg';
import QRCodeGenerator from 'react-native-qrcode-svg';

interface QRCodeProps {
  /**
   * Valor a codificar en el QR
   */
  value: string;
  
  /**
   * Tamaño del código QR (ancho y alto)
   * @default 200
   */
  size?: number;
  
  /**
   * Color del código QR
   * @default '#000000'
   */
  color?: string;
  
  /**
   * Color de fondo del código QR
   * @default '#FFFFFF'
   */
  backgroundColor?: string;
  
  /**
   * Logo para mostrar en el centro del QR
   */
  logo?: {
    uri: string;
    size?: number;
  };
}

/**
 * Componente para mostrar un código QR
 */
export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  color = '#000000',
  backgroundColor = '#FFFFFF',
  logo
}) => {
  return (
    <View style={styles.container}>
      <QRCodeGenerator
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        logo={logo?.uri}
        logoSize={logo?.size}
        logoBackgroundColor={backgroundColor}
        enableLinearGradient={false}
        quietZone={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 