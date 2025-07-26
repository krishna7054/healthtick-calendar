import React from 'react';
import { CalendarSlot } from './components/CalendarSlot.tsx';
import { Calendar} from "lucide-react"


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calendar className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">HealthTick <span className='bg-gradient-to-br from-red-400 to-indigo-400 bg-clip-text text-transparent'>Calendar</span></h1>
              <p className="text-gray-600">Schedule onboarding and follow-up calls with your clients</p>
            </div>
          </div>
          </div>
        
        <div className="max-w-4xl mx-auto">
          <CalendarSlot />
        </div>
      </div>
    </div>
  );
}

export default App;
