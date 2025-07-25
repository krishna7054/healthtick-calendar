import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, User, Phone, CalendarIcon } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar.ts';
import { BookingModal } from './BookingModal.tsx';
import { apiService } from '../services/api.ts';
import { Booking } from '../types/index.ts';
import { Loading } from './Loading.tsx';
import { useCalendarStats } from '../hooks/useCalendarStats.ts'; 

export const CalendarSlot: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const { calendarDay, loading, error, refreshCalendar } = useCalendar(selectedDate);
  const { stats,refreshStats  } = useCalendarStats(selectedDate); 

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

  const getCallTypeColor = (callType: 'onboarding' | 'follow-up') => {
    return callType === 'onboarding' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getCallTypeIcon = (callType: 'onboarding' | 'follow-up') => {
    return callType === 'onboarding' ? '🚀' : '🔄';
  };

  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-green-100 rounded-lg">
        <CalendarIcon className="h-4 w-4 text-green-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">Today's Calls</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-purple-100 rounded-lg">
        <Clock className="h-4 w-4 text-purple-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">Recurring Series</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalRecurring}</p>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-orange-100 rounded-lg">
        <User className="h-4 w-4 text-orange-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">One-time Calls</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalOneTime}</p>
      </div>
    </div>
  </div>
</div>
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h1>
            <p className="text-primary-100 mt-1">
              Daily Schedule • 10:30 AM - 7:30 PM
            </p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
                <span className='text-2xl font-semibold'>Daily Schedule</span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className='font-semibold'>Onboarding (40min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className='font-semibold'>Follow-up (20min)</span>
                  </div>
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
                  : 'border-gray-300 bg-gray-50'
                }
              `}
              onClick={() => handleTimeSlotClick(time, available)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{time}</span>
                  </div>
                  
                  {available ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Available</span>
                    </div>
                  ) : booking && (
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getCallTypeIcon(booking.callType)}
                      </span>
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-medium border
                        ${getCallTypeColor(booking.callType)}
                      `}>
                        {booking.callType === 'onboarding' ? 'Onboarding' : 'Follow-up'}
                        {booking.isRecurring && ' (Recurring)'}
                      </div>
                    </div>
                  )}
                </div>

                {booking && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-900">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{booking.clientName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{booking.clientPhone}</span>
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

      {/* Booking Modal */}
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
    </div>
    {/* Demo Instructions */}
        <div className="mt-6 bg-blue-50 border-blue-200 rounded-md shadow-lg">
          <div className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Demo Instructions</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • <strong>Try booking overlapping calls</strong> - The system will prevent conflicts
              </p>
              <p>
                • <strong>Book a follow-up call</strong> - It will automatically repeat weekly
              </p>
              <p>
                • <strong>Navigate between days</strong> - See how recurring calls appear on matching weekdays
              </p>
              <p>
                • <strong>Search clients</strong> - Type names or phone numbers in the booking modal
              </p>
              <p>
                • <strong>Delete bookings</strong> - Recurring calls will remove the entire series
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};
