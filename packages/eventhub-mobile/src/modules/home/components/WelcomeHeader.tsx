import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface WelcomeHeaderProps {
  userName: string;
  userAvatar?: string;
}

export function WelcomeHeader({ 
  userName, 
  userAvatar 
}: WelcomeHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  
  const handleAvatarPress = () => {
    router.push('/profile');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.welcomeText, { color: getColorValue(theme.colors.text.secondary) }]}>
            ¡Bienvenido!
          </Text>
          <Text style={[styles.userName, { color: getColorValue(theme.colors.text.primary) }]}>
            {userName}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarPress}
        >
          {userAvatar ? (
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.avatar} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: getColorValue(theme.colors.primary.light) }]}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 