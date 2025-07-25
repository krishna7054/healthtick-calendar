import React, { useState } from 'react';
import { X, Search, Clock, Calendar, User, Phone } from 'lucide-react';
import { useClientSearch } from '../hooks/useClientSearch.ts';
import { apiService } from '../services/api.ts';
import { Client } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onSuccess,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<'onboarding' | 'follow-up'>('onboarding');
  const [loading, setLoading] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  
  const { clients, searchTerm, setSearchTerm } = useClientSearch();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setShowClientList(false);
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    setLoading(true);
    try {
      await apiService.createBooking({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        callType,
        date: selectedDate,
        time: selectedTime,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Choose a different time slot or try again later');
    } finally {
      setLoading(false);
    }
  };

  const getDuration = (type: 'onboarding' | 'follow-up') => {
    return type === 'onboarding' ? 40 : 20;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Book New Call</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date and Time Display */}
          <div className="bg-primary-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-primary-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-primary-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>

          {/* Call Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Call Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCallType('onboarding')}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${callType === 'onboarding'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-medium">🚀 Onboarding</div>
                <div className="text-sm text-gray-500 mt-1">
                  {getDuration('onboarding')} minutes • One-time
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setCallType('follow-up')}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${callType === 'follow-up'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-medium">🔄 Follow-up</div>
                <div className="text-sm text-gray-500 mt-1">
                  {getDuration('follow-up')} minutes • Weekly recurring
                </div>
              </button>
            </div>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Client
            </label>
            
            {selectedClient ? (
              <div className="border-2 border-primary-500 rounded-lg p-4 bg-primary-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-primary-700">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{selectedClient.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-primary-600 text-sm mt-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowClientList(true);
                    }}
                    onFocus={() => setShowClientList(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {showClientList && (
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        No clients found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedClient || loading}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Booking...' : 'Book Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
