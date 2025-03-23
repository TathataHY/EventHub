import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface EventCategoryIconProps {
  category: {
    id: string;
    name: string;
    color?: string;
    iconName?: string;
  };
  size?: number;
  outlined?: boolean;
}

export const EventCategoryIcon: React.FC<EventCategoryIconProps> = ({
  category,
  size = 24,
  outlined = false
}) => {
  const { theme } = useTheme();

  // Mapa de categorías a iconos y colores predeterminados
  const getCategoryDefaults = () => {
    const defaultMappings: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
      'music': { 
        icon: 'musical-notes', 
        color: theme.colors.primary.main 
      },
      'business': { 
        icon: 'briefcase', 
        color: theme.colors.info.main 
      },
      'food': { 
        icon: 'restaurant', 
        color: theme.colors.warning.main 
      },
      'sports': { 
        icon: 'football', 
        color: theme.colors.success.main 
      },
      'art': { 
        icon: 'color-palette', 
        color: theme.colors.secondary.main 
      },
      'technology': { 
        icon: 'code-slash', 
        color: theme.colors.info.dark 
      },
      'education': { 
        icon: 'school', 
        color: theme.colors.primary.dark 
      },
      'networking': { 
        icon: 'people', 
        color: theme.colors.secondary.light 
      },
      'conference': { 
        icon: 'mic', 
        color: theme.colors.success.dark 
      },
      'workshop': { 
        icon: 'construct', 
        color: theme.colors.warning.dark 
      },
      'social': { 
        icon: 'chatbubbles', 
        color: theme.colors.info.light 
      },
      'outdoor': { 
        icon: 'leaf', 
        color: theme.colors.success.light 
      },
      'entertainment': { 
        icon: 'film', 
        color: theme.colors.secondary.dark 
      },
      'charity': { 
        icon: 'heart', 
        color: theme.colors.error.main 
      },
      'health': { 
        icon: 'fitness', 
        color: theme.colors.success.main 
      }
    };

    // Si no hay categoría o nombre, usamos un default
    if (!category || !category.name) {
      return defaultMappings['entertainment'];
    }

    // Intentamos coincidir por nombre o elegimos una opción predeterminada
    const categoryKey = category.name.toLowerCase();
    return defaultMappings[categoryKey] || defaultMappings['entertainment'];
  };

  const defaults = getCategoryDefaults();
  
  // Usar iconName de la categoría si existe, o el predeterminado
  const iconName: keyof typeof Ionicons.glyphMap = 
    (category.iconName as keyof typeof Ionicons.glyphMap) || 
    defaults.icon;
  
  // Determinar si debe usar icono con outline
  const iconNameWithOutline: keyof typeof Ionicons.glyphMap = 
    outlined && !iconName.includes('-outline') 
      ? (`${iconName}-outline` as keyof typeof Ionicons.glyphMap) 
      : iconName;
  
  // Usar color de la categoría si existe, o el predeterminado
  const categoryColor = category.color || defaults.color;

  return (
    <View style={[styles.container, { backgroundColor: `${categoryColor}15` }]}>
      <Ionicons
        name={iconNameWithOutline}
        size={size}
        color={categoryColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  }
}); 