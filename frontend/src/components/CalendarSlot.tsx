import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, User, Phone } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar.ts';
import { BookingModal } from './BookingModal.tsx';
import { apiService } from '../services/api.ts';
import { Booking } from '../types/index.ts';
import { Loading } from './Loading.tsx';

export const CalendarSlot: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const { calendarDay, loading, error, refreshCalendar } = useCalendar(selectedDate);

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
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
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
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
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
  );
};
