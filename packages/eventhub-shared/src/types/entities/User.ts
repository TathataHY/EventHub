export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  ATTENDEE = 'attendee'
} 