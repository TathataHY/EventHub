import { useState, useCallback } from 'react';
import { eventService } from '../services';
import { 
  CreateEventData, 
  Event, 
  EventType, 
  EventStatus,
  EventVisibility,
  EventCategory
} from '../types';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface EventCreationResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  createEvent: (eventData: CreateEventData) => Promise<string | null>;
  updateEvent: (eventId: string, eventData: Partial<CreateEventData>) => Promise<string | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  validateEvent: (eventData: CreateEventData) => ValidationResult;
  resetState: () => void;
}

export const useEventCreation = (): EventCreationResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Resetear el estado
  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  // Validar el evento antes de crear/actualizar
  const validateEvent = useCallback((eventData: CreateEventData): ValidationResult => {
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
  const createEvent = useCallback(async (eventData: CreateEventData): Promise<string | null> => {
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
      return String(newEvent.id);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Error al crear el evento. Por favor, inténtalo de nuevo.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [validateEvent]);

  // Actualizar un evento existente
  const updateEvent = useCallback(async (eventId: string, eventData: Partial<CreateEventData>): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Para actualizaciones parciales no necesitamos validar todos los campos
      // Solo validamos si tenemos todos los datos requeridos
      if ('title' in eventData && 'description' in eventData && 'startDate' in eventData && 'location' in eventData) {
        const validationResult = validateEvent(eventData as CreateEventData);
        if (!validationResult.isValid) {
          setError('Hay errores de validación en el formulario');
          return null;
        }
      }

      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      setSuccess(true);
      return String(updatedEvent.id);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Error al actualizar el evento. Por favor, inténtalo de nuevo.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [validateEvent]);

  // Eliminar un evento
  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await eventService.deleteEvent(eventId);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Error al eliminar el evento. Por favor, inténtalo de nuevo.');
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
    validateEvent,
    resetState
  };
}; 