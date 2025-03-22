/**
 * DTO para representar un organizador
 */
export interface OrganizerDTO {
  id: string;
  userId: string;
  name: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  verified: boolean;
  verificationDate?: Date;
  rating: number;
  eventCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear un nuevo organizador
 */
export interface CreateOrganizerDTO {
  userId: string;
  name: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * DTO para actualizar un organizador existente
 */
export interface UpdateOrganizerDTO {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * DTO para verificar un organizador
 */
export interface VerifyOrganizerDTO {
  verified: boolean;
} 