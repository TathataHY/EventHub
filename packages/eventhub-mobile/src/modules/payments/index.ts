// export * from './components';

// En vez de exportar componentes que no existen, exportamos un objeto vacío
// para evitar errores de compilación, hasta que los componentes reales sean creados
export const paymentComponents = {};

// También podríamos exportar tipos si los hubiera
export type PaymentMethod = 'creditCard' | 'paypal' | 'transfer';

// Objetos de muestra en caso de que sean necesarios
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'creditCard',
  PAYPAL: 'paypal',
  TRANSFER: 'transfer'
};
