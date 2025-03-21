/**
 * DTO para representar las estadísticas generales del sistema
 */
export interface SystemStatisticsDTO {
  totalUsers: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalOrganizers: number;
  averageEventRating: number;
  mostPopularEventCategory: string;
  mostActiveCity: string;
  mostActiveCountry: string;
}

/**
 * DTO para representar estadísticas de un usuario específico
 */
export interface UserStatisticsDTO {
  userId: string;
  eventsAttended: number;
  ticketsPurchased: number;
  totalSpent: number;
  favoriteEventCategory: string;
  favoriteOrganizer: string;
  reviewsSubmitted: number;
}

/**
 * DTO para representar estadísticas de un organizador específico
 */
export interface OrganizerStatisticsDTO {
  organizerId: string;
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageEventRating: number;
  mostPopularEventCategory: string;
  upcomingEventsCount: number;
  mostPopularLocation: string;
}

/**
 * DTO para representar estadísticas de un evento específico
 */
export interface EventStatisticsDTO {
  eventId: string;
  totalTicketsSold: number;
  totalRevenue: number;
  averageRating: number;
  attendeeGenderDistribution: {
    male: number;
    female: number;
    other: number;
    unspecified: number;
  };
  attendeeAgeDistribution: {
    under18: number;
    age18to24: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55plus: number;
  };
  ticketTypeDistribution: Record<string, number>;
}

/**
 * DTO para representar estadísticas de ventas por período
 */
export interface SalesStatisticsDTO {
  period: string; // 'daily' | 'weekly' | 'monthly' | 'yearly'
  data: {
    label: string; // Fecha o periodo
    ticketsSold: number;
    revenue: number;
  }[];
  total: {
    ticketsSold: number;
    revenue: number;
  };
}

/**
 * DTO para representar estadísticas de ubicaciones
 */
export interface LocationStatisticsDTO {
  mostPopularCities: {
    city: string;
    country: string;
    eventsCount: number;
    attendeesCount: number;
  }[];
  mostPopularCountries: {
    country: string;
    eventsCount: number;
    attendeesCount: number;
  }[];
}

/**
 * DTO para representar estadísticas de categorías
 */
export interface CategoryStatisticsDTO {
  mostPopularCategories: {
    category: string;
    eventsCount: number;
    attendeesCount: number;
    revenue: number;
  }[];
} 