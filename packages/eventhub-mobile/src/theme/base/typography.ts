/**
 * Definiciones de tipografía para la aplicación
 * Este archivo contiene todas las configuraciones relacionadas con
 * fuentes, tamaños, pesos y estilos de texto
 */

// Familias de fuentes
export const fontFamilies = {
  primary: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
    thin: 'Roboto-Thin',
  },
  secondary: {
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
    bold: 'OpenSans-Bold',
    light: 'OpenSans-Light',
  },
  // Alternativas para dispositivos sin fuentes personalizadas
  system: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
    light: 'System-Light',
  }
};

// Tamaños de fuente
export const fontSizes = {
  // Tamaños escalados
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
};

// Pesos de fuente
export const fontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

// Estilos de línea
export const lineHeights = {
  tight: 1.2,   // Para títulos y texto compacto
  normal: 1.5,  // Para la mayoría del texto
  relaxed: 1.8, // Para texto que necesita más espacio
  loose: 2,     // Para texto muy separado
};

// Estilos de letra
export const letterSpacings = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
};

// Variantes de texto (configuraciones preestablecidas)
export const textVariants = {
  h1: {
    fontFamily: fontFamilies.primary.bold,
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontFamily: fontFamilies.primary.bold,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.normal,
  },
  h4: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.h4,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  body: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  caption: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  button: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wide,
  },
  buttonSmall: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wide,
  },
};

// Exportación completa de tipografía
export const typography = {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  variants: textVariants,
}; 