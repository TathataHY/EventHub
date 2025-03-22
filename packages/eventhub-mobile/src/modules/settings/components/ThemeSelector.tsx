import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSelector = () => {
  const { theme, isDark, changeTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectTheme = (themeMode: 'light' | 'dark' | 'system') => {
    changeTheme(themeMode);
    setShowOptions(false);
  };

  const getThemeModeName = () => {
    if (theme.mode === 'system') {
      return isDark ? 'Sistema (Oscuro)' : 'Sistema (Claro)';
    } else if (theme.mode === 'dark') {
      return 'Oscuro';
    } else {
      return 'Claro';
    }
  };

  const getThemeModeIcon = () => {
    if (theme.mode === 'system') {
      return isDark ? 'phone-portrait' : 'phone-portrait-outline';
    } else if (theme.mode === 'dark') {
      return 'moon';
    } else {
      return 'sunny';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.themeButton, { backgroundColor: theme.colors.background }]}
        onPress={toggleShowOptions}
      >
        <View style={styles.themeButtonContent}>
          <Ionicons 
            name={getThemeModeIcon() as any} 
            size={24} 
            color={theme.colors.primary} 
            style={styles.themeIcon} 
          />
          <View style={styles.themeTextContainer}>
            <Text style={[styles.themeName, { color: theme.colors.text }]}>
              Tema
            </Text>
            <Text style={[styles.themeValue, { color: theme.colors.secondaryText }]}>
              {getThemeModeName()}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={showOptions ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={theme.colors.secondaryText} 
        />
      </TouchableOpacity>

      {showOptions && (
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'light' && styles.selectedOption,
              theme.mode === 'light' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => handleSelectTheme('light')}
          >
            <Ionicons 
              name="sunny" 
              size={20} 
              color={theme.mode === 'light' ? theme.colors.primary : theme.colors.text} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'light' ? theme.colors.primary : theme.colors.text }
              ]}
            >
              Claro
            </Text>
            {theme.mode === 'light' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'dark' && styles.selectedOption,
              theme.mode === 'dark' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => handleSelectTheme('dark')}
          >
            <Ionicons 
              name="moon" 
              size={20} 
              color={theme.mode === 'dark' ? theme.colors.primary : theme.colors.text} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'dark' ? theme.colors.primary : theme.colors.text }
              ]}
            >
              Oscuro
            </Text>
            {theme.mode === 'dark' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'system' && styles.selectedOption,
              theme.mode === 'system' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => handleSelectTheme('system')}
          >
            <Ionicons 
              name="phone-portrait" 
              size={20} 
              color={theme.mode === 'system' ? theme.colors.primary : theme.colors.text} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'system' ? theme.colors.primary : theme.colors.text }
              ]}
            >
              Sistema
            </Text>
            {theme.mode === 'system' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  themeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginRight: 16,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeValue: {
    fontSize: 14,
    marginTop: 2,
  },
  optionsContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedOption: {
    borderRadius: 8,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
}); 