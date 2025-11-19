// Test simple para verificar que la clase User funciona
import { User } from '../models/User';

// Datos de ejemplo como los que vienen del backend
const mockUserData = {
  id: 1,
  email: 'usuario@ejemplo.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  phone: '+1234567890',
  avatar: 'https://via.placeholder.com/150',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  addresses: [
    {
      id: 1,
      type: 'home',
      street: 'Calle Principal 123',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: '12345',
      country: 'País',
      isPrimary: true
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'credit_card',
      cardNumber: '**** **** **** 1234',
      cardHolder: 'Juan Pérez',
      expiryDate: '12/25',
      isPrimary: true
    }
  ],
  preferences: {
    notifications: true,
    newsletter: false,
    language: 'es'
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: new Date()
};

// Crear instancia de User
const user = new User(mockUserData);

// Tests
console.log('=== Tests de la clase User ===');

console.log('1. getFullName():', user.getFullName());
// Esperado: "Juan Pérez"

console.log('2. getMemberSince():', user.getMemberSince());
// Esperado: "Miembro desde 2023"

console.log('3. getPrimaryAddress():', user.getPrimaryAddress());
// Esperado: objeto de dirección con isPrimary: true

console.log('4. getPrimaryPaymentMethod():', user.getPrimaryPaymentMethod());
// Esperado: objeto de método de pago con isPrimary: true

console.log('5. Email:', user.email);
// Esperado: "usuario@ejemplo.com"

console.log('=== Todos los tests completados ===');