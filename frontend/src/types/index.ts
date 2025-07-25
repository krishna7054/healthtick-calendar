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
  date: string;
  time: string;
  duration: number;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'weekly';
    dayOfWeek: number;
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

export interface BookingFormData {
  clientId: string;
  clientName: string;
  clientPhone: string;
  callType: 'onboarding' | 'follow-up';
  date: string;
  time: string;
}
