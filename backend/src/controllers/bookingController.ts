import { Request, Response } from 'express';
import { FirebaseService } from '../services/firebase';
import { CalendarService } from '../services/calendar';
import { Booking } from '../models';
import moment from 'moment';

export class BookingController {
  static async getCalendarDay(req: Request, res: Response) {
    try {
      const { date } = req.params;
      
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      const calendarDay = await CalendarService.getCalendarDay(date);
      res.json(calendarDay);
    } catch (error) {
      console.error('Error getting calendar day:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createBooking(req: Request, res: Response) {
    try {
      const { clientId, clientName, clientPhone, callType, date, time } = req.body;

      // Validate required fields
      if (!clientId || !clientName || !clientPhone || !callType || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Validate call type
      if (!['onboarding', 'follow-up'].includes(callType)) {
        return res.status(400).json({ error: 'Invalid call type' });
      }

      // Validate date format
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      // Check availability
      const isAvailable = await CalendarService.checkAvailability(date, time, callType);
      if (!isAvailable) {
        return res.status(409).json({ error: 'Time slot not available' });
      }

      // Create booking data
      const duration = callType === 'onboarding' ? 40 : 20;
      const isRecurring = callType === 'follow-up';
      
      const bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId,
        clientName,
        clientPhone,
        callType,
        date,
        time,
        duration,
        isRecurring,
        ...(isRecurring && {
          recurringPattern: {
            frequency: 'weekly' as const,
            dayOfWeek: moment(date).day()
          }
        })
      };

      const booking = await FirebaseService.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await FirebaseService.deleteBooking(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getClients(req: Request, res: Response) {
    try {
      const clients = await FirebaseService.getClients();
      res.json(clients);
    } catch (error) {
      console.error('Error getting clients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
