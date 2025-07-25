export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  callType: 'onboarding' | 'follow-up';
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  duration: number; // minutes
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'weekly';
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Booking;
}

export interface CalendarDay {
  date: string;
  timeSlots: TimeSlot[];
}
