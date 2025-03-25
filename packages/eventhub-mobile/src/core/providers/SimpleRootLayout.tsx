import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface SimpleRootLayoutProps {
  children?: ReactNode;
}

/**
 * Componente de diseño raíz simplificado para usar temporalmente
 */
export const SimpleRootLayout: React.FC<SimpleRootLayoutProps> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}; 