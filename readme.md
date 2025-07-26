## HealthTick Calendar System
A comprehensive calendar booking system built for health coaching companies to manage onboarding and follow-up calls with clients. Features a modern React frontend with a Node.js backend powered by Firebase Firestore.

- Smart Booking System with overlap prevention
- Recurring Follow-up Calls (weekly recurring)
- One-time Onboarding Calls (40 minutes)
- Client Management with searchable database
- Real-time Statistics dashboard
- Responsive Design with Tailwind CSS
- Firebase Integration for data persistence

### 🛠️ Tech Stack
#### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- Date-fns for date manipulation

#### Backend
- Node.js with Express.js
- TypeScript for type safety
- Firebase Admin SDK for Firestore
- CORS and Helmet for security

#### Database
- Firebase Firestore (NoSQL document database)

### 📋 Prerequisites
Before running the application, ensure you have:
- Node.js (version 16 or higher)
- npm or yarn package manager
- Firebase project with Firestore enabled
- Git for version control

### 🔧 Installation & Setup
1. Clone the Repository
```bash
git clone https://github.com/krishna7054/healthtick-calendar.git
cd healthtick-calendar
```
2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env

# Add your Firebase credentials to .env
echo "FIREBASE_PROJECT_ID=your-project-id" >> .env
echo "FIREBASE_CLIENT_EMAIL=your-service-account-email" >> .env
echo "FIREBASE_PRIVATE_KEY=\"your-private-key-here\"" >> .env
echo "NODE_ENV=development" >> .env
echo "PORT=3001" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Place your firebase-admin-key.json file in the backend directory
# Download from Firebase Console > Project Settings > Service Accounts

# Build and start development server
npm run build
npm run dev
```
3. Frontend Setup
``` bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env

# Add backend API URL
echo "REACT_APP_API_URL=http://localhost:3001/api" >> .env

# Start development server
npm start
```
4. Firebase Configuration
1. Create Firebase Project:
- Go to Firebase Console
- Create a new project or select existing one

2. Enable Firestore Database:
- Navigate to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" for development

3. Generate Service Account Key:
- Go to Project Settings > Service Accounts
- Click "Generate new private key"
- Save as firebase-admin-key.json in backend directory

### 🚀 Running the Application
#### Development Mode
1. Start Backend (Terminal 1):
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3001

2. Start Frontend (Terminal 2):
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000


### 🗄️ Firebase Schema Description
#### Collections Structure
#### clients Collection
```javascript
{
  id: "auto-generated-doc-id",
  name: "string",           // Client's full name
  phone: "string"           // Phone number with country code
}
```
Example:

```javascript
{
  id: "abc123",
  name: "Sriram Kumar",
  phone: "+91-9876543210"
}
```
#### bookings Collection
```javascript
{
  id: "auto-generated-doc-id",
  clientId: "string",               // Reference to client document
  clientName: "string",             // Denormalized for quick access
  clientPhone: "string",            // Denormalized for quick access
  callType: "onboarding" | "follow-up",
  date: "string",                   // Format: "YYYY-MM-DD"
  time: "string",                   // Format: "HH:MM" (24-hour)
  duration: 40 | 20,                // Minutes (40 for onboarding, 20 for follow-up)
  isRecurring: boolean,             // true for follow-up calls
  recurringPattern?: {              // Only present if isRecurring = true
    frequency: "weekly",
    dayOfWeek: 0-6                  // Sunday=0, Monday=1, ..., Saturday=6
  },
  createdAt: "string",              // ISO timestamp
  updatedAt: "string"               // ISO timestamp
}
```
Example - Onboarding Call:

```javascript
{
  id: "def456",
  clientId: "abc123",
  clientName: "Sriram Kumar",
  clientPhone: "+91-9876543210",
  callType: "onboarding",
  date: "2025-07-26",
  time: "11:10",
  duration: 40,
  isRecurring: false,
  createdAt: "2025-07-26T10:30:00.000Z",
  updatedAt: "2025-07-26T10:30:00.000Z"
}
```
Example - Recurring Follow-up Call:

```javascript
{
  id: "ghi789",
  clientId: "xyz789",
  clientName: "Shilpa Sharma",
  clientPhone: "+91-9876543211",
  callType: "follow-up",
  date: "2025-07-26",        // Original booking date
  time: "15:50",
  duration: 20,
  isRecurring: true,
  recurringPattern: {
    frequency: "weekly",
    dayOfWeek: 5             // Friday
  },
  createdAt: "2025-07-26T10:30:00.000Z",
  updatedAt: "2025-07-26T10:30:00.000Z"
}
```
### Data Design Principles

1. Efficient Recurring Logic:
- Recurring calls are stored once with pattern metadata
- Backend logic determines which dates to display them on
- Prevents data duplication while maintaining flexibility

2. Denormalization for Performance:
- Client name and phone stored in bookings for quick retrieval
- Reduces the need for joins in calendar queries

3. Indexed Queries:
- Queries by date for daily calendar view
- Queries by isRecurring and dayOfWeek for recurring calls
- Composite indexes recommended for production

### 🔮 Key Assumptions Made
#### Business Logic Assumptions
1. Operating Hours:
- Business operates 10:30 AM to 7:30 PM
- 20-minute time slots throughout the day
- No booking outside these hours

2. Call Types:
- Onboarding calls: 40 minutes, one-time only
- Follow-up calls: 20 minutes, weekly recurring
- No other call types supported

3. Overlap Prevention:
- No two calls can overlap in time
- System validates conflicts across both one-time and recurring calls
- Booking blocked if any overlap detected

4. Recurring Logic:
- Follow-up calls repeat on the same weekday and time
- Recurring calls appear on all future dates matching the pattern
- Deleting a recurring call removes all future instances

#### Technical Assumptions
1. Client Data:
- 20 dummy clients pre-populated on first run
- Phone numbers follow Indian format (+91-xxxxxxxxxx)
- Client names are unique (no duplicate handling)

2. Date Handling:
- All dates stored in YYYY-MM-DD format
- Times stored in 24-hour HH:MM format
- Timezone assumed to be local (no UTC conversion)

3. Firebase Configuration:
- Firestore in test mode for development
- Production should implement proper security rules
- Service account has full admin privileges

4. API Design:
- RESTful endpoints for all operations
- CORS enabled for cross-origin requests
- No authentication implemented (should be added in future)

#### UI/UX Assumptions
1. Single Day View:
- Calendar shows one day at a time
- Navigation via previous/next day buttons
- No month or week view implemented

2. Client Selection:
- Searchable dropdown for client selection
- Search works on both name and phone number
- No client creation from booking interface

3. Real-time Updates:
- Calendar refreshes after booking/deletion
- No WebSocket integration for multi-user scenarios
- Stats update immediately with calendar changes

### 🧪 Testing
#### Manual Testing Checklist
- Create onboarding call (40 minutes)
- Create follow-up call (20 minutes, recurring)
- Verify overlap prevention
- Test recurring call display on future dates
- Delete bookings functionality
- Client search functionality
- Calendar navigation (previous/next day)
- Statistics update correctly

### API Endpoints
- GET /health - Health check
- GET /api/calendar/:date - Get calendar for specific date
- POST /api/bookings - Create new booking
- DELETE /api/bookings/:id - Delete booking
- GET /api/clients - Get all clients