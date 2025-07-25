import { useState, useEffect } from 'react';
import { CalendarDay } from '../types';
import { apiService } from '../services/api.ts';
import { format } from 'date-fns';

export const useCalendar = (selectedDate: Date) => {
  const [calendarDay, setCalendarDay] = useState<CalendarDay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarDay = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const data = await apiService.getCalendarDay(dateString);
      setCalendarDay(data);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching calendar day:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarDay(selectedDate);
  }, [selectedDate]);

  const refreshCalendar = () => {
    fetchCalendarDay(selectedDate);
  };

  return {
    calendarDay,
    loading,
    error,
    refreshCalendar,
  };
};
