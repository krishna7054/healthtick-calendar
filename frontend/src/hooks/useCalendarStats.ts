import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.ts';
import { format } from 'date-fns';

interface CalendarStats {
  totalToday: number;
  totalRecurring: number;
  totalOneTime: number;
}

export const useCalendarStats = (selectedDate: Date) => {
  const [stats, setStats] = useState<CalendarStats>({
    totalToday: 0,
    totalRecurring: 0,
    totalOneTime: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const calendarDay = await apiService.getCalendarDay(dateString);
      
      const bookedSlots = calendarDay.timeSlots.filter(slot => !slot.available);
      const totalToday = bookedSlots.length;
      const totalRecurring = bookedSlots.filter(slot => slot.booking?.isRecurring).length;
      const totalOneTime = bookedSlots.filter(slot => !slot.booking?.isRecurring).length;

      setStats({
        totalToday,
        totalRecurring,
        totalOneTime
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Expose refresh function
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refreshStats };
};
