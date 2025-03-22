/**
 * Representa los posibles proveedores de pago
 */
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  MERCADO_PAGO = 'MERCADO_PAGO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  OTHER = 'OTHER'
} 