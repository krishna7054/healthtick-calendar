import axios from 'axios';
import { CalendarDay, Booking, Client, BookingFormData } from '../types';
import dotenv from 'dotenv';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Calendar
  getCalendarDay: async (date: string): Promise<CalendarDay> => {
    const response = await api.get(`/calendar/${date}`);
    return response.data;
  },

  // Bookings
  createBooking: async (bookingData: BookingFormData): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },

  // Clients
  getClients: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },
};
