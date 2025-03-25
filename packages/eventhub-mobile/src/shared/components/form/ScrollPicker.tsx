import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ViewStyle,
  TextStyle,
  DimensionValue
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';

export interface PickerItem {
  label: string;
  value: string | number;
}

export interface ScrollPickerProps {
  items: PickerItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  style?: ViewStyle;
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
  itemHeight?: number;
  itemWidth?: number;
  maxVisibleItems?: number;
}

/**
 * Componente para selección mediante scroll
 */
export const ScrollPicker = ({
  items,
  selectedValue,
  onValueChange,
  label,
  placeholder = 'Seleccionar',
  style,
  horizontal = true,
  showsScrollIndicator = false,
  itemHeight = 40,
  itemWidth = 120,
  maxVisibleItems = 5
}: ScrollPickerProps) => {
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<string | number | undefined>(selectedValue);
  
  useEffect(() => {
    setSelectedItem(selectedValue);
  }, [selectedValue]);
  
  const handleSelect = (value: string | number) => {
    setSelectedItem(value);
    onValueChange(value);
  };
  
  const isSelected = (value: string | number) => {
    return selectedItem === value;
  };
  
  // Obtener el estilo específico para cada elemento
  const getItemStyle = (value: string | number): ViewStyle => {
    const isItemSelected = isSelected(value);
    
    return {
      backgroundColor: isItemSelected ? getColorValue(theme.colors.primary.main) : getColorValue(theme.colors.background.default),
      width: itemWidth as DimensionValue,
      height: itemHeight,
      marginRight: horizontal ? 8 : 0,
      marginBottom: horizontal ? 0 : 8,
      borderColor: isItemSelected ? getColorValue(theme.colors.primary.main) : getColorValue(theme.colors.grey[300]),
    };
  };
  
  // Obtener el estilo para el texto del elemento
  const getTextStyle = (value: string | number): TextStyle => {
    return {
      color: isSelected(value) ? getColorValue(theme.colors.primary.contrastText) : getColorValue(theme.colors.text.primary),
      fontWeight: isSelected(value) ? 'bold' : 'normal'
    };
  };
  
  // Función para renderizar cada ítem
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const value = typeof item === 'object' ? item.value : item;
    const label = typeof item === 'object' ? item.label : item;
    const isItemSelected = isSelected(value);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.item,
          {
            backgroundColor: isItemSelected ? getColorValue(theme.colors.primary.main) : getColorValue(theme.colors.background.default),
            borderWidth: isItemSelected ? 1 : 0,
            borderColor: isItemSelected ? getColorValue(theme.colors.primary.main) : getColorValue(theme.colors.grey[300]),
          },
          getItemStyle(value),
        ]}
        onPress={() => handleSelect(value)}
        accessibilityLabel={`Opción ${label}`}
      >
        <Text
          style={[
            styles.itemText,
            {
              color: isSelected(value) ? getColorValue(theme.colors.primary.contrastText) : getColorValue(theme.colors.text.primary),
              fontWeight: isSelected(value) ? 'bold' : 'normal',
            },
            getTextStyle(value),
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: getColorValue(theme.colors.text.primary) }
        ]}>
          {label}
        </Text>
      )}
      
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsScrollIndicator}
        showsVerticalScrollIndicator={showsScrollIndicator}
        contentContainerStyle={[
          styles.scrollContent,
          horizontal ? styles.horizontalContent : styles.verticalContent
        ]}
      >
        {items.map((item, index) => renderItem({ item, index }))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  horizontalContent: {
    flexDirection: 'row',
  },
  verticalContent: {
    flexDirection: 'column',
  },
  item: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center'
  },
}); 