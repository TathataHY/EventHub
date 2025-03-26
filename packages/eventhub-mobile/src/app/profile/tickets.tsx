import React from 'react';
import { Stack } from 'expo-router';
import { UserTicketsScreen } from '@modules/users/screens';

export default function TicketsRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Mis Tickets",
          headerBackTitle: "Perfil",
        }}
      />
      <UserTicketsScreen />
    </>
  );
}