/**
 * Sistema de sombras
 * Define las configuraciones de sombras para diferentes niveles de elevación
 * Compatible con iOS y Android
 */

// Definiciones de elevación para Android e iOS
export const elevations = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Elevación muy sutil (para elementos sutilmente destacados)
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  
  // Elevación baja (tarjetas planas, botones normales)
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // Elevación media (tarjetas destacadas, elementos flotantes)
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  
  // Elevación alta (modales, diálogos, elementos prominentes)
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Elevación muy alta (elementos destacados más importantes)
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  
  // Elevación máxima (menús desplegables, popovers)
  xxl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
};

// Función para adaptar sombras a un color específico
export const getShadowForColor = (color: string, elevation: keyof typeof elevations) => {
  const shadowConfig = elevations[elevation];
  return {
    ...shadowConfig,
    shadowColor: color,
  };
};

// Exportación principal
export const shadows = {
  ...elevations,
  forColor: getShadowForColor,
}; 