// ==========================================
// USER
// ==========================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// ==========================================
// PACKAGE
// ==========================================
export interface Hotel {
  id: string;
  city: string;
  name: string;
  stars: number;
  distance: string;
  roomType: string;
  nights: number;
}

export interface Inclusion {
  id: string;
  name: string;
  included: boolean;
}

export interface ItineraryItem {
  id: string;
  day: number;
  date?: string;
  location: string;
  title: string;
  description: string;
  order: number;
}

export interface Package {
  id: string;
  name: string;
  type: 'HAJJ' | 'UMRAH';
  departureCity: string;
  travelDate: string;
  returnDate: string;
  duration: number;
  totalPrice: number;
  advancePercent: number;
  advanceAmount?: number;
  remainingAmount?: number;
  availableSeats: number;
  description: string;
  posterUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  hotels?: Hotel[];
  inclusions?: Inclusion[];
  itinerary?: ItineraryItem[];
  bookingCount?: number;
  seatsLeft?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// BOOKING
// ==========================================
export interface Traveller {
  id?: string;
  fullName: string;
  passportNumber: string;
  dateOfBirth: string;
  gender: string;
  relationship?: string;
  nic?: string;
  phone?: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  packageId: string;
  travellers: Traveller[];
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  package?: Package;
  user?: Partial<User>;
  travellersData?: Traveller[];
  payments?: Payment[];
}

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'ADVANCE_PAID'
  | 'CONFIRMED'
  | 'DOCUMENTS_PENDING'
  | 'DOCUMENTS_VERIFIED'
  | 'TRAVEL_READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

// ==========================================
// PAYMENT
// ==========================================
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentType: 'ADVANCE' | 'BALANCE';
  gateway: string;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  booking?: Partial<Booking>;
}

// ==========================================
// API RESPONSES
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
  } & {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}