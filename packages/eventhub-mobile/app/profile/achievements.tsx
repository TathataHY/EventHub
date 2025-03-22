import React from 'react';
import { Stack } from 'expo-router';
import { UserAchievementsScreen } from '../../src/modules/users/screens';

export default function AchievementsRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Mis Logros',
          headerShown: true
        }}
      />
      <UserAchievementsScreen />
    </>
  );
} 