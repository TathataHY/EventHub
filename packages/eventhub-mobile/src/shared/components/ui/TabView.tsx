import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@theme/base/colors';
import { typography } from '@theme/base/typography';

interface TabItem {
  title: string;
  key?: string;
}

interface TabViewProps {
  tabs: TabItem[];
  selectedIndex: number;
  onChange: (index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;
  tabTextStyle?: StyleProp<TextStyle>;
  activeTabTextStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

/**
 * Componente TabView reutilizable para implementar pestañas
 */
export function TabView({
  tabs,
  selectedIndex,
  onChange,
  containerStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  indicatorStyle,
  scrollable = false,
}: TabViewProps) {
  const TabContainer = scrollable ? ScrollView : View;
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TabContainer
        style={styles.tabsContainer}
        horizontal={scrollable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollable ? styles.scrollableContent : styles.fixedContent}
      >
        {tabs.map((tab, index) => {
          const isActive = selectedIndex === index;
          
          return (
            <TouchableOpacity
              key={tab.key || index}
              style={[
                styles.tab,
                tabStyle,
                isActive && styles.activeTab,
                isActive && activeTabStyle,
              ]}
              onPress={() => onChange(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  tabTextStyle,
                  isActive && styles.activeTabText,
                  isActive && activeTabTextStyle,
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
              
              {isActive && (
                <View style={[styles.indicator, indicatorStyle]} />
              )}
            </TouchableOpacity>
          );
        })}
      </TabContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  fixedContent: {
    flexDirection: 'row',
    width: '100%',
  },
  scrollableContent: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 90,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.button1,
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
}); 