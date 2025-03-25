import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface SettingsOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

export const SettingsOption: React.FC<SettingsOptionProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightElement
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.option}
      onPress={onPress}
    >
      <View style={styles.optionContent}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={theme.colors.primary.main} 
          style={styles.optionIcon} 
        />
        <View>
          <Text style={[styles.optionTitle, { color: theme.colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.optionSubtitle, { color: theme.colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {rightElement || (showChevron && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.colors.text.secondary} 
        />
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
}); 