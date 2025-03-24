import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ViewStyle } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

interface TabViewProps {
  tabs: string[];
  initialTab?: number;
  onChange?: (index: number) => void;
  style?: ViewStyle;
  tabContainerStyle?: ViewStyle;
  children?: React.ReactNode;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  initialTab = 0,
  onChange,
  style,
  tabContainerStyle,
  children
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { theme } = useTheme();
  
  // Manejar cambio de tab
  const handleTabPress = (index: number) => {
    setActiveTab(index);
    onChange && onChange(index);
  };
  
  // Renderizar tabs
  const renderTabs = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { borderBottomColor: theme.colors.grey[300], backgroundColor: '#FFFFFF' }]}
        contentContainerStyle={[styles.tabsContainer, tabContainerStyle]}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={`tab-${index}`}
            style={[
              styles.tab,
              activeTab === index && styles.activeTab
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.colors.grey[600] },
                activeTab === index && { color: theme.colors.primary.main }
              ]}
            >
              {tab}
            </Text>
            {activeTab === index && (
              <View style={[styles.indicator, { backgroundColor: theme.colors.primary.main }]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  // Renderizar contenido de tab actual
  const renderContent = () => {
    if (Array.isArray(children)) {
      return children[activeTab] || null;
    }
    return children;
  };
  
  return (
    <View style={[styles.container, style]}>
      {renderTabs()}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsScroll: {
    maxHeight: 48,
    borderBottomWidth: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width / 3,
    position: 'relative',
  },
  activeTab: {
    // Se usa directamente en el componente
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    // Se usa directamente en el componente
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
}); 