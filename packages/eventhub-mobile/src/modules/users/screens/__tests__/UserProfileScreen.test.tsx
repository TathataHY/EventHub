import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { UserProfileScreen } from '../UserProfileScreen';
import { userService } from '../../services';

// Mock de los servicios
jest.mock('../../services', () => ({
  userService: {
    getUserProfile: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    blockUser: jest.fn(),
    reportUser: jest.fn(),
  }
}));

// Mock del hook de navegación
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      goBack: jest.fn(),
      setOptions: jest.fn()
    }),
  };
});

describe('UserProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de respuesta exitosa para getUserProfile
    (userService.getUserProfile as jest.Mock).mockResolvedValue({
      id: 'user123',
      username: 'usuario_test',
      fullName: 'Usuario Test',
      photoURL: 'https://example.com/photo.jpg',
      bio: 'Biografía de prueba',
      location: {
        city: 'Madrid',
        country: 'España'
      },
      interests: ['MUSIC', 'TECHNOLOGY'],
      followersCount: 100,
      followingCount: 50,
      eventsAttended: 20,
      eventsOrganized: 5,
      isFollowing: false,
      createdAt: new Date().toISOString()
    });
  });

  it('renderiza correctamente mientras carga', () => {
    const { getByText } = render(<UserProfileScreen userId="user123" />);
    expect(getByText('Cargando perfil...')).toBeTruthy();
  });

  it('renderiza el perfil del usuario correctamente después de cargar', async () => {
    const { getByText, findByText } = render(<UserProfileScreen userId="user123" />);
    
    await waitFor(() => {
      expect(userService.getUserProfile).toHaveBeenCalledWith('user123');
    });
    
    expect(await findByText('Usuario Test')).toBeTruthy();
    expect(await findByText('@usuario_test')).toBeTruthy();
    expect(await findByText('Madrid, España')).toBeTruthy();
    expect(await findByText('Biografía de prueba')).toBeTruthy();
  });

  it('muestra mensaje de error si falla la carga', async () => {
    // Mock de error
    (userService.getUserProfile as jest.Mock).mockRejectedValue(new Error('Error de prueba'));
    
    const { findByText } = render(<UserProfileScreen userId="user123" />);
    
    expect(await findByText('No se pudo cargar el perfil del usuario')).toBeTruthy();
    expect(await findByText('Reintentar')).toBeTruthy();
  });
}); 