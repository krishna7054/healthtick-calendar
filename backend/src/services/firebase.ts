import * as admin from 'firebase-admin';
import { Booking, Client } from '../models';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin with environment variables
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
  }
};

console.log("ds",process.env.FIREBASE_PROJECT_ID, process.env.FIREBASE_CLIENT_EMAIL, process.env.FIREBASE_PRIVATE_KEY);

initializeFirebase();
export const db = admin.firestore();

export class FirebaseService {
  // Client operations
  static async getClients(): Promise<Client[]> {
    const snapshot = await db.collection('clients').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  }

  static async initializeClients(): Promise<void> {
    const clientsRef = db.collection('clients');
    const snapshot = await clientsRef.get();
    
    if (snapshot.empty) {
      const dummyClients: Omit<Client, 'id'>[] = [
        { name: 'Sriram Kumar', phone: '+91-9876543210' },
        { name: 'Shilpa Sharma', phone: '+91-9876543211' },
        { name: 'Rahul Verma', phone: '+91-9876543212' },
        { name: 'Priya Patel', phone: '+91-9876543213' },
        { name: 'Amit Singh', phone: '+91-9876543214' },
        { name: 'Neha Gupta', phone: '+91-9876543215' },
        { name: 'Vikram Rao', phone: '+91-9876543216' },
        { name: 'Kavya Reddy', phone: '+91-9876543217' },
        { name: 'Arjun Nair', phone: '+91-9876543218' },
        { name: 'Sneha Iyer', phone: '+91-9876543219' },
        { name: 'Rohit Joshi', phone: '+91-9876543220' },
        { name: 'Meera Khanna', phone: '+91-9876543221' },
        { name: 'Karthik Pillai', phone: '+91-9876543222' },
        { name: 'Anita Agarwal', phone: '+91-9876543223' },
        { name: 'Deepak Mishra', phone: '+91-9876543224' },
        { name: 'Ritu Kapoor', phone: '+91-9876543225' },
        { name: 'Suresh Chandra', phone: '+91-9876543226' },
        { name: 'Pooja Bansal', phone: '+91-9876543227' },
        { name: 'Manish Tiwari', phone: '+91-9876543228' },
        { name: 'Divya Saxena', phone: '+91-9876543229' }
      ];

      const batch = db.batch();
      dummyClients.forEach(client => {
        const docRef = clientsRef.doc();
        batch.set(docRef, client);
      });
      await batch.commit();
    }
  }

  // Booking operations
  static async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const now = new Date().toISOString();
    const bookingData = {
      ...booking,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db.collection('bookings').add(bookingData);
    return { id: docRef.id, ...bookingData };
  }

  static async getBookingsByDate(date: string): Promise<Booking[]> {
    const snapshot = await db.collection('bookings')
      .where('date', '==', date)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  }

  static async getRecurringBookingsForDate(date: string): Promise<Booking[]> {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    
    const snapshot = await db.collection('bookings')
      .where('isRecurring', '==', true)
      .where('recurringPattern.dayOfWeek', '==', dayOfWeek)
      .get();
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Booking))
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate <= targetDate;
      });
  }

  static async deleteBooking(id: string): Promise<void> {
    await db.collection('bookings').doc(id).delete();
  }

  static async getAllBookings(): Promise<Booking[]> {
    const snapshot = await db.collection('bookings').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  }
}
