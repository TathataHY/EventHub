export interface TicketDTO {
  id: string;
  eventId: string;
  type: string;
  price: string;
  quantity: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDTO {
  eventId: string;
  type: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  availableQuantity: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface UpdateTicketDTO {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  availableQuantity?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
} 