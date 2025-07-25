import express from 'express';
import { BookingController } from '../controllers/bookingController';

const router = express.Router();

// Calendar routes
router.get('/calendar/:date', BookingController.getCalendarDay);

// Booking routes
router.post('/bookings', BookingController.createBooking);
router.delete('/bookings/:id', BookingController.deleteBooking);

// Client routes
router.get('/clients', BookingController.getClients);

export default router;
