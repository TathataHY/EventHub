/**
 * Sistema de espaciado
 * Define las unidades de espacio consistentes para márgenes, paddings y gaps.
 * Basado en un sistema de escala de multiplicación.
 */

// Unidad base de espaciado (en píxeles)
const baseUnit = 4;

// Escala de espaciado
export const spacingScale = {
  none: 0,
  xxxs: baseUnit * 0.5,  // 2px
  xxs: baseUnit,         // 4px
  xs: baseUnit * 2,      // 8px
  sm: baseUnit * 3,      // 12px
  md: baseUnit * 4,      // 16px
  lg: baseUnit * 6,      // 24px
  xl: baseUnit * 8,      // 32px
  xxl: baseUnit * 12,    // 48px
  xxxl: baseUnit * 16,   // 64px
};

// Funciones de ayuda para espaciado
export const getSpacing = (multiple: number) => baseUnit * multiple;

// Sistema de espaciado completo
export const spacing = {
  ...spacingScale,
  // Funciones de utilidad
  get: getSpacing,
  
  // Configuraciones para diferentes contextos
  layout: {
    containerPadding: spacingScale.lg,
    screenMargin: spacingScale.md,
    sectionMargin: spacingScale.xl,
    cardPadding: spacingScale.md,
  },
  
  // Configuraciones para componentes específicos
  components: {
    buttonPadding: {
      vertical: spacingScale.xs,
      horizontal: spacingScale.md
    },
    inputPadding: {
      vertical: spacingScale.xs,
      horizontal: spacingScale.sm
    },
    cardMargin: spacingScale.xs,
    itemSpacing: spacingScale.sm,
  }
}; 