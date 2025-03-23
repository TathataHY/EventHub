import React from 'react';
import { EventsLayout } from '../../src/modules/events/components';
import { Slot } from 'expo-router';

/**
 * Layout para la sección de eventos
 */
export default function Layout() {
  return (
    <EventsLayout>
      <Slot />
    </EventsLayout>
  );
} 