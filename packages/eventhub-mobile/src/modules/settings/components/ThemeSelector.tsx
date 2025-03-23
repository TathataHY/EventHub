import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeSelector = () => {
  const { theme } = useTheme();
  // Simular funcionalidad ya que no tenemos el changeTheme en nuestro hook personalizado
  const isDark = false;
  const changeTheme = (mode: ThemeMode) => console.log(`Cambiando tema a: ${mode}`);
  
  const [showOptions, setShowOptions] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ThemeMode>('system');

  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectTheme = (themeMode: ThemeMode) => {
    changeTheme(themeMode);
    setSelectedMode(themeMode);
    setShowOptions(false);
  };

  const getThemeModeName = () => {
    if (selectedMode === 'system') {
      return isDark ? 'Sistema (Oscuro)' : 'Sistema (Claro)';
    } else if (selectedMode === 'dark') {
      return 'Oscuro';
    } else {
      return 'Claro';
    }
  };

  const getThemeModeIcon = () => {
    if (selectedMode === 'system') {
      return isDark ? 'phone-portrait' : 'phone-portrait-outline';
    } else if (selectedMode === 'dark') {
      return 'moon';
    } else {
      return 'sunny';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.themeButton, { backgroundColor: theme.colors.background.default }]}
        onPress={toggleShowOptions}
      >
        <View style={styles.themeButtonContent}>
          <Ionicons 
            name={getThemeModeIcon()} 
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
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.default }]}>
          <TouchableOpacity 
            style={[
              styles.optionItem, 
              (selectedMode === 'light' || (!isDark && selectedMode === 'system')) && styles.selectedOption,
              (selectedMode === 'light' || (!isDark && selectedMode === 'system')) && { backgroundColor: `${theme.colors.primary.main}20` }
            ]}
            onPress={() => handleSelectTheme('light')}
          >
            <Ionicons 
              name="sunny" 
              size={20} 
              color={(selectedMode === 'light' || (!isDark && selectedMode === 'system')) ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: (selectedMode === 'light' || (!isDark && selectedMode === 'system')) ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Claro
            </Text>
            {(selectedMode === 'light' || (!isDark && selectedMode === 'system')) && (
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
              (selectedMode === 'dark' || (isDark && selectedMode === 'system')) && styles.selectedOption,
              (selectedMode === 'dark' || (isDark && selectedMode === 'system')) && { backgroundColor: `${theme.colors.primary.main}20` }
            ]}
            onPress={() => handleSelectTheme('dark')}
          >
            <Ionicons 
              name="moon" 
              size={20} 
              color={(selectedMode === 'dark' || (isDark && selectedMode === 'system')) ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: (selectedMode === 'dark' || (isDark && selectedMode === 'system')) ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Oscuro
            </Text>
            {(selectedMode === 'dark' || (isDark && selectedMode === 'system')) && (
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
              selectedMode === 'system' && styles.selectedOption,
              selectedMode === 'system' && { backgroundColor: `${theme.colors.primary.main}20` }
            ]}
            onPress={() => handleSelectTheme('system')}
          >
            <Ionicons 
              name="phone-portrait" 
              size={20} 
              color={selectedMode === 'system' ? theme.colors.primary.main : theme.colors.text.primary} 
              style={styles.optionIcon} 
            />
            <Text 
              style={[
                styles.optionText, 
                { color: selectedMode === 'system' ? theme.colors.primary.main : theme.colors.text.primary }
              ]}
            >
              Sistema
            </Text>
            {selectedMode === 'system' && (
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