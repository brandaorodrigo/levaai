export type UserRole = 'passenger' | 'driver';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  createdAt?: string;
}

export interface Passenger extends User {
  role: 'passenger';
  defaultAddress?: Address;
  paymentMethod?: 'pix' | 'card' | 'cash';
}

export interface Driver extends User {
  role: 'driver';
  cpf?: string;
  vehicle?: Vehicle;
  pixKey?: string;
  isOnline?: boolean;
  totalRides?: number;
  earningsToday?: number;
  earningsWeek?: number;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Vehicle {
  model: string;
  plate: string;
  color?: string;
  year?: number;
}

export interface Ride {
  id: string;
  passengerId: string;
  passengerName: string;
  driverId?: string;
  driverName?: string;
  origin: Address;
  destination: Address;
  estimatedValue: number;
  estimatedTime?: number;
  estimatedDistance?: number;
  bagsCount?: number;
  status: RideStatus;
  createdAt: string;
  completedAt?: string;
  driverRating?: number;
  passengerRating?: number;
}

export type RideStatus =
  | 'requested'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
