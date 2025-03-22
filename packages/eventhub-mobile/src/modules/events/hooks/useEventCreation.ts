import { useState, useCallback } from 'react';
import { eventService } from '../services';
import { CreateEventParams, UpdateEventParams } from '../types';

type ValidationError = {
  field: string;
  message: string;
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export const useEventCreation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Validar el evento antes de crear/actualizar
  const validateEvent = useCallback((eventData: CreateEventParams): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validar campos requeridos
    if (!eventData.title || eventData.title.trim() === '') {
      errors.push({ field: 'title', message: 'El título es obligatorio' });
    } else if (eventData.title.length < 3) {
      errors.push({ field: 'title', message: 'El título debe tener al menos 3 caracteres' });
    }

    if (!eventData.description || eventData.description.trim() === '') {
      errors.push({ field: 'description', message: 'La descripción es obligatoria' });
    } else if (eventData.description.length < 10) {
      errors.push({ field: 'description', message: 'La descripción debe tener al menos 10 caracteres' });
    }

    if (!eventData.startDate) {
      errors.push({ field: 'startDate', message: 'La fecha de inicio es obligatoria' });
    }

    if (!eventData.location) {
      errors.push({ field: 'location', message: 'La ubicación es obligatoria' });
    }

    // Si hay endDate, verificar que sea después de startDate
    if (eventData.endDate && eventData.startDate && new Date(eventData.endDate) < new Date(eventData.startDate)) {
      errors.push({ field: 'endDate', message: 'La fecha de finalización debe ser posterior a la fecha de inicio' });
    }

    // Si no es gratis, verificar que el precio sea mayor que 0
    if (eventData.ticketInfo && !eventData.ticketInfo.isFree) {
      if (!eventData.ticketInfo.price || eventData.ticketInfo.price <= 0) {
        errors.push({ field: 'ticketInfo.price', message: 'El precio debe ser mayor que 0 para eventos de pago' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Crear un nuevo evento
  const createEvent = useCallback(async (eventData: CreateEventParams): Promise<string | number | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const validationResult = validateEvent(eventData);
      if (!validationResult.isValid) {
        setError('Hay errores de validación en el formulario');
        return null;
      }

      const newEvent = await eventService.createEvent(eventData);
      setSuccess(true);
      return newEvent.id;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Error al crear el evento');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [validateEvent]);

  // Actualizar un evento existente
  const updateEvent = useCallback(async (eventId: string | number, eventData: UpdateEventParams): Promise<string | number | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const validationResult = validateEvent(eventData as CreateEventParams);
      if (!validationResult.isValid) {
        setError('Hay errores de validación en el formulario');
        return null;
      }

      await eventService.updateEvent(eventId, eventData);
      setSuccess(true);
      return eventId;
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Error al actualizar el evento');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [validateEvent]);

  // Eliminar un evento
  const deleteEvent = useCallback(async (eventId: string | number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await eventService.deleteEvent(eventId);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Error al eliminar el evento');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    success,
    createEvent,
    updateEvent,
    deleteEvent,
    validateEvent
  };
}; 