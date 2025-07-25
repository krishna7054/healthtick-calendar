import React from 'react';
import { Calendar } from './components/Calendar.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HealthTick Calendar
          </h1>
          <p className="text-gray-600">
            Schedule onboarding and follow-up calls with your clients
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default App;
