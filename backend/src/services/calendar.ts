import moment from 'moment';
import { Booking, TimeSlot, CalendarDay } from '../models';
import { FirebaseService } from './firebase';

export class CalendarService {
  private static readonly TIME_SLOTS = [
    '10:30', '10:50', '11:10', '11:30', '11:50',
    '12:10', '12:30', '12:50', '13:10', '13:30',
    '13:50', '14:10', '14:30', '14:50', '15:10',
    '15:30', '15:50', '16:10', '16:30', '16:50',
    '17:10', '17:30', '17:50', '18:10', '18:30',
    '18:50', '19:10', '19:30'
  ];

  static async getCalendarDay(date: string): Promise<CalendarDay> {
    // Get direct bookings for the date
    const directBookings = await FirebaseService.getBookingsByDate(date);
    
    // Get recurring bookings that fall on this date
    const recurringBookings = await FirebaseService.getRecurringBookingsForDate(date);
    
    // Combine all bookings
    const allBookings = [...directBookings, ...recurringBookings];
    
    // Create time slots
    const timeSlots: TimeSlot[] = this.TIME_SLOTS.map(time => {
      const booking = allBookings.find(b => b.time === time);
      return {
        time,
        available: !booking,
        booking
      };
    });

    return {
      date,
      timeSlots
    };
  }

  static validateBooking(
    date: string, 
    time: string, 
    callType: 'onboarding' | 'follow-up',
    existingBookings: Booking[]
  ): { valid: boolean; message?: string } {
    const duration = callType === 'onboarding' ? 40 : 20;
    const startMinutes = this.timeToMinutes(time);
    const endMinutes = startMinutes + duration;

    // Check for overlaps
    for (const booking of existingBookings) {
      if (booking.time === time) {
        return { valid: false, message: 'Time slot already booked' };
      }

      const bookingStart = this.timeToMinutes(booking.time);
      const bookingEnd = bookingStart + booking.duration;

      // Check if new booking overlaps with existing booking
      if (
        (startMinutes < bookingEnd && endMinutes > bookingStart) ||
        (bookingStart < endMinutes && bookingEnd > startMinutes)
      ) {
        return { 
          valid: false, 
          message: `Would overlap with existing ${booking.callType} call at ${booking.time}` 
        };
      }
    }

    // Check if booking extends beyond business hours
    const lastSlotMinutes = this.timeToMinutes('19:30');
    if (endMinutes > lastSlotMinutes + 20) {
      return { 
        valid: false, 
        message: 'Booking extends beyond business hours' 
      };
    }

    return { valid: true };
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static async checkAvailability(date: string, time: string, callType: 'onboarding' | 'follow-up'): Promise<boolean> {
    const directBookings = await FirebaseService.getBookingsByDate(date);
    const recurringBookings = await FirebaseService.getRecurringBookingsForDate(date);
    const allBookings = [...directBookings, ...recurringBookings];

    const validation = this.validateBooking(date, time, callType, allBookings);
    return validation.valid;
  }
}
