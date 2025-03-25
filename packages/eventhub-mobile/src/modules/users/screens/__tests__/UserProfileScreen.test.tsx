import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { UserProfileScreen } from '../UserProfileScreen';
import { userService } from '../../services/user.service';

// Mock de los servicios y hooks necesarios
jest.mock('../../services/user.service', () => ({
  userService: {
    getUserProfile: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn()
  }
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn()
  })
}));

// Mock básico para el perfil de usuario
const mockUserProfile = {
  id: 'user123',
  username: 'testuser',
  fullName: 'Test User',
  photoURL: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  location: {
    city: 'Madrid',
    country: 'España'
  },
  interests: ['music', 'sports'],
  followersCount: 100,
  followingCount: 50,
  eventsAttended: 10,
  eventsOrganized: 5
};

describe('UserProfileScreen', () => {
  beforeEach(() => {
    // Configurar el mock para useRoute
    (useRoute as jest.Mock).mockReturnValue({
      params: { userId: 'user123' }
    });
    
    // Reiniciar mocks
    jest.clearAllMocks();
    
    // Configurar respuesta por defecto para getUserProfile
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);
  });
  
  it('muestra indicador de carga inicialmente', () => {
    const { getByTestId } = render(<UserProfileScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  it('carga y muestra el perfil del usuario correctamente', async () => {
    const { getByText, findByText } = render(<UserProfileScreen />);
    
    // Verificar que se muestra el contenido correcto después de la carga
    await findByText('Test User');
    expect(getByText('@testuser')).toBeTruthy();
    expect(getByText('Test bio')).toBeTruthy();
    expect(getByText('Madrid, España')).toBeTruthy();
    
    // Verificar que se llamó al servicio con el ID correcto
    expect(userService.getUserProfile).toHaveBeenCalledWith('user123');
  });
  
  it('muestra mensaje de error si falla la carga del perfil', async () => {
    // Configurar el mock para simular un error
    (userService.getUserProfile as jest.Mock).mockRejectedValue(new Error('Error de red'));
    
    const { findByText } = render(<UserProfileScreen />);
    
    // Verificar que se muestra el mensaje de error
    await findByText('No se pudo cargar el perfil de usuario');
  });
}); 