import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Clock,
  User, Phone, CalendarIcon,
} from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar.ts';
import { BookingModal } from './BookingModal.tsx';
import { apiService } from '../services/api.ts';
import { Loading } from './Loading.tsx';
import { useCalendarStats } from '../hooks/useCalendarStats.ts';

export const CalendarSlot: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const { calendarDay, loading, error, refreshCalendar } = useCalendar(selectedDate);
  const { stats, refreshStats } = useCalendarStats(selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
  };

  const handleTimeSlotClick = (time: string, available: boolean) => {
    if (available) {
      setSelectedTimeSlot(time);
      setShowBookingModal(true);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await apiService.deleteBooking(bookingId);
        refreshCalendar();
        refreshStats();
        alert('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
    refreshStats();
    refreshCalendar();
  };

  const getCallTypeColor = (callType: 'onboarding' | 'follow-up') =>
    callType === 'onboarding'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-green-100 text-green-800 border-green-200';

  const getCallTypeIcon = (callType: 'onboarding' | 'follow-up') =>
    callType === 'onboarding' ? '🚀' : '🔄';

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-8 py-6 max-w-screen-xl mx-auto w-full">
      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Today's Calls" value={stats.totalToday} icon={<CalendarIcon className="h-4 w-4 text-green-600" />} bg="bg-green-100" />
        <StatCard title="Recurring Series" value={stats.totalRecurring} icon={<Clock className="h-4 w-4 text-purple-600" />} bg="bg-purple-100" />
        <StatCard title="One-time Calls" value={stats.totalOneTime} icon={<User className="h-4 w-4 text-orange-600" />} bg="bg-orange-100" />
      </div>

      {/* 📅 Calendar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 sm:p-6">
          <div className="flex flex-row sm:flex-row items-center justify-between gap-4">
            <button onClick={() => navigateDate('prev')} className="p-2 rounded-lg hover:bg-primary-700 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h1>
              <p className="text-sm text-primary-100">Daily Schedule • 10:30 AM - 7:30 PM</p>
            </div>
            <button onClick={() => navigateDate('next')} className="p-2 rounded-lg hover:bg-primary-700 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6 mb-6">
            <h2 className="text-xl font-semibold">Daily Schedule</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <Legend color="bg-blue-600" label="Onboarding (40min)" />
              <Legend color="bg-green-600" label="Follow-up (20min)" />
            </div>
          </div>

          <div className="grid gap-2">
            {calendarDay?.timeSlots.map(({ time, available, booking }) => (
              <div
                key={time}
                className={`
                  border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer
                  ${available
                    ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    : 'border-gray-300 bg-gray-50'}
                `}
                onClick={() => handleTimeSlotClick(time, available)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{time}</span>
                    </div>

                    {available ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Available</span>
                      </div>
                    ) : booking && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{getCallTypeIcon(booking.callType)}</span>
                        <div className={`px-3 py-1 rounded-full font-medium border ${getCallTypeColor(booking.callType)}`}>
                          {booking.callType === 'onboarding' ? 'Onboarding' : 'Follow-up'}
                          {booking.isRecurring && ' (Recurring)'}
                        </div>
                      </div>
                    )}
                  </div>

                  {booking && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-right sm:text-left">
                      <div>
                        <div className="flex items-center gap-1 text-gray-900">
                          <User className="w-4 h-4" />
                          {booking.clientName}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-3 h-3" />
                          {booking.clientPhone}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBooking(booking.id);
                        }}
                        className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showBookingModal && selectedTimeSlot && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTimeSlot(null);
          }}
          selectedDate={format(selectedDate, 'yyyy-MM-dd')}
          selectedTime={selectedTimeSlot}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* 📘 Demo Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md shadow-md">
        <div className="p-4 space-y-2 text-sm text-blue-800">
          <h3 className="font-semibold text-blue-900">🎯 Demo Instructions</h3>
          <ul className="list-disc list-inside">
            <li><strong>Try booking overlapping calls</strong> - The system will prevent conflicts</li>
            <li><strong>Book a follow-up call</strong> - It will automatically repeat weekly</li>
            <li><strong>Navigate between days</strong> - See how recurring calls appear on matching weekdays</li>
            <li><strong>Search clients</strong> - Type names or phone numbers in the booking modal</li>
            <li><strong>Delete bookings</strong> - Recurring calls will remove the entire series</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component for Stats
const StatCard = ({ title, value, icon, bg }: any) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3">
    <div className={`p-2 ${bg} rounded-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Reusable Legend Item
const Legend = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 ${color} rounded-full`} />
    <span className="font-medium">{label}</span>
  </div>
);
