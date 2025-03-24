import { useState, useCallback } from 'react';
import { userService } from '../services';
import { PublicUserProfile, UserRelationsResponse } from '../types';

export const useUserRelations = (userId: string) => {
  const [followers, setFollowers] = useState<PublicUserProfile[]>([]);
  const [following, setFollowing] = useState<PublicUserProfile[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  // Cargar seguidores del usuario
  const loadFollowers = useCallback(async () => {
    setLoadingFollowers(true);
    setFollowError(null);
    
    try {
      const userFollowers = await userService.getUserFollowers(userId);
      setFollowers(userFollowers.users as unknown as PublicUserProfile[]);
      return userFollowers;
    } catch (err) {
      setFollowError('Error al cargar seguidores');
      console.error('Error fetching followers:', err);
      return { users: [], total: 0 };
    } finally {
      setLoadingFollowers(false);
    }
  }, [userId]);

  // Cargar usuarios seguidos
  const loadFollowing = useCallback(async () => {
    setLoadingFollowing(true);
    setFollowError(null);
    
    try {
      const userFollowing = await userService.getUserFollowing(userId);
      setFollowing(userFollowing.users as unknown as PublicUserProfile[]);
      return userFollowing;
    } catch (err) {
      setFollowError('Error al cargar usuarios seguidos');
      console.error('Error fetching following:', err);
      return { users: [], total: 0 };
    } finally {
      setLoadingFollowing(false);
    }
  }, [userId]);

  // Seguir a un usuario
  const followUser = useCallback(async (targetUserId: string) => {
    setFollowError(null);
    
    try {
      const result = await userService.followUser(targetUserId);
      return result;
    } catch (err) {
      setFollowError('Error al seguir al usuario');
      console.error('Error following user:', err);
      throw err;
    }
  }, []);

  // Dejar de seguir a un usuario
  const unfollowUser = useCallback(async (targetUserId: string) => {
    setFollowError(null);
    
    try {
      const result = await userService.unfollowUser(targetUserId);
      return result;
    } catch (err) {
      setFollowError('Error al dejar de seguir al usuario');
      console.error('Error unfollowing user:', err);
      throw err;
    }
  }, []);

  // Bloquear a un usuario
  const blockUser = useCallback(async (targetUserId: string) => {
    setFollowError(null);
    
    try {
      const success = await userService.blockUser(targetUserId);
      
      if (success) {
        // Actualizar las listas si es necesario
        await Promise.all([loadFollowers(), loadFollowing()]);
        return { success: true };
      } else {
        return { success: false, error: 'No se pudo bloquear al usuario' };
      }
    } catch (err) {
      setFollowError('Error al bloquear al usuario');
      console.error('Error en blockUser:', err);
      return { success: false, error: 'Error al bloquear al usuario' };
    }
  }, [loadFollowers, loadFollowing]);

  // Reportar a un usuario
  const reportUser = useCallback(async (targetUserId: string, reason: string) => {
    setFollowError(null);
    
    try {
      const success = await userService.reportUser(targetUserId, reason);
      return { success };
    } catch (err) {
      setFollowError('Error al reportar al usuario');
      console.error('Error en reportUser:', err);
      return { success: false, error: 'Error al reportar al usuario' };
    }
  }, []);

  return {
    followers,
    following,
    loadingFollowers,
    loadingFollowing,
    followError,
    loadFollowers,
    loadFollowing,
    followUser,
    unfollowUser,
    blockUser,
    reportUser
  };
}; 