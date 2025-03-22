import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';
import { ThemeMode } from '@core/context/ThemeContext';

export const ThemeSelector = () => {
  const { theme, isDark, changeTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectTheme = (themeMode: ThemeMode) => {
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
        style={[styles.themeButton, { backgroundColor: theme.colors.background.paper }]}
        onPress={toggleShowOptions}
      >
        <View style={styles.themeButtonContent}>
          <Ionicons 
            name={getThemeModeIcon() as any} 
            size={24} 
            color={theme.colors.primary.main} 
            style={styles.themeIcon} 
          />
          <View style={styles.themeTextContainer}>
            <Text style={[styles.themeName, { color: theme.colors.text.primary }]}>
              Tema
            </Text>
            <Text style={[styles.themeValue, { color: theme.colors.text.secondary }]}>
              {getThemeModeName()}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={showOptions ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={theme.colors.text.secondary} 
        />
      </TouchableOpacity>

      {showOptions && (
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.paper }]}>
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'light' && styles.selectedOption,
              theme.mode === 'light' && { backgroundColor: theme.colors.primary.light }
            ]}
            onPress={() => handleSelectTheme('light')}
          >
            <Ionicons 
              name="sunny" 
              size={20} 
              color={theme.mode === 'light' ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'light' ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Claro
            </Text>
            {theme.mode === 'light' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary.main} 
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'dark' && styles.selectedOption,
              theme.mode === 'dark' && { backgroundColor: theme.colors.primary.light }
            ]}
            onPress={() => handleSelectTheme('dark')}
          >
            <Ionicons 
              name="moon" 
              size={20} 
              color={theme.mode === 'dark' ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'dark' ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Oscuro
            </Text>
            {theme.mode === 'dark' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary.main} 
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              theme.mode === 'system' && styles.selectedOption,
              theme.mode === 'system' && { backgroundColor: theme.colors.primary.light }
            ]}
            onPress={() => handleSelectTheme('system')}
          >
            <Ionicons 
              name="phone-portrait" 
              size={20} 
              color={theme.mode === 'system' ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: theme.mode === 'system' ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Sistema
            </Text>
            {theme.mode === 'system' && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={theme.colors.primary.main} 
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