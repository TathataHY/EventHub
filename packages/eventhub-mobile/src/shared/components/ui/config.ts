import { appColors, appTypography, appSpacing, appBorderRadius, appShadows } from '../../../theme';

/**
 * Configuración centralizada para componentes UI
 * 
 * Este archivo exporta configuraciones reutilizables para
 * mantener consistencia visual en todos los componentes UI
 */

// Tamaños de botones
export const buttonSizes = {
  small: {
    height: 32,
    paddingHorizontal: appSpacing.sm,
    borderRadius: appBorderRadius.sm,
    fontSize: 12,
  },
  medium: {
    height: 40,
    paddingHorizontal: appSpacing.md,
    borderRadius: appBorderRadius.md,
    fontSize: 14,
  },
  large: {
    height: 48,
    paddingHorizontal: appSpacing.lg,
    borderRadius: appBorderRadius.md,
    fontSize: 16,
  }
};

// Variantes de botones
export const buttonVariants = {
  primary: {
    backgroundColor: appColors.primary.main,
    textColor: appColors.common.white,
    borderColor: appColors.primary.main,
  },
  secondary: {
    backgroundColor: appColors.common.white,
    textColor: appColors.primary.main,
    borderColor: appColors.primary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    textColor: appColors.text,
    borderColor: appColors.grey[300],
  },
  text: {
    backgroundColor: 'transparent',
    textColor: appColors.primary.main,
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: appColors.error.main,
    textColor: appColors.common.white,
    borderColor: appColors.error.main,
  },
  success: {
    backgroundColor: appColors.success.main,
    textColor: appColors.common.white,
    borderColor: appColors.success.main,
  },
  warning: {
    backgroundColor: appColors.warning.main,
    textColor: appColors.common.white,
    borderColor: appColors.warning.main,
  },
};

// Tamaños de tarjetas
export const cardSizes = {
  small: {
    padding: appSpacing.sm,
    borderRadius: appBorderRadius.sm,
  },
  medium: {
    padding: appSpacing.md,
    borderRadius: appBorderRadius.md,
  },
  large: {
    padding: appSpacing.lg,
    borderRadius: appBorderRadius.lg,
  }
};

// Variantes de tarjetas
export const cardVariants = {
  elevated: {
    backgroundColor: appColors.common.white,
    borderColor: 'transparent',
    ...appShadows.sm,
  },
  outlined: {
    backgroundColor: appColors.common.white,
    borderColor: appColors.grey[200],
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  flat: {
    backgroundColor: appColors.common.white,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
};

// Tamaños de inputs
export const inputSizes = {
  small: {
    height: 32,
    paddingHorizontal: appSpacing.sm,
    borderRadius: appBorderRadius.sm,
    fontSize: 12,
  },
  medium: {
    height: 40,
    paddingHorizontal: appSpacing.md,
    borderRadius: appBorderRadius.md,
    fontSize: 14,
  },
  large: {
    height: 48,
    paddingHorizontal: appSpacing.md,
    borderRadius: appBorderRadius.md,
    fontSize: 16,
  }
};

// Variantes de inputs
export const inputVariants = {
  outlined: {
    backgroundColor: 'transparent',
    textColor: appColors.text,
    placeholderColor: appColors.grey[400],
    borderColor: appColors.grey[300],
    borderWidth: 1,
  },
  filled: {
    backgroundColor: appColors.grey[100],
    textColor: appColors.text,
    placeholderColor: appColors.grey[400],
    borderColor: 'transparent',
    borderWidth: 1,
  },
  underlined: {
    backgroundColor: 'transparent',
    textColor: appColors.text,
    placeholderColor: appColors.grey[400],
    borderBottomColor: appColors.grey[300],
    borderBottomWidth: 1,
    borderRadius: 0,
  },
}; 