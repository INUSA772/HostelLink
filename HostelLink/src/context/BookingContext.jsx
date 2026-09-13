import { createContext, useState, useContext } from 'react';
import bookingService from '../services/bookingService';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/helpers';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user bookings
  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data.bookings);
      return data.bookings;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single booking
  const fetchBookingById = async (id) => {
    setLoading(true);
    try {
      const data = await bookingService.getBookingById(id);
      setCurrentBooking(data.booking);
      return data.booking;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const data = await bookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      setBookings([...bookings, data.booking]);
      return data.booking;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    setLoading(true);
    try {
      const data = await bookingService.updateBookingStatus(id, status);
      toast.success(`Booking ${status} successfully!`);
      
      // Update in state
      setBookings(bookings.map(b => 
        b._id === id ? { ...b, status: data.booking.status } : b
      ));
      
      if (currentBooking && currentBooking._id === id) {
        setCurrentBooking({ ...currentBooking, status: data.booking.status });
      }
      
      return data.booking;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (id, reason) => {
    setLoading(true);
    try {
      const data = await bookingService.cancelBooking(id, reason);
      toast.success('Booking cancelled successfully!');
      
      // Update in state
      setBookings(bookings.map(b => 
        b._id === id ? { ...b, status: 'cancelled' } : b
      ));
      
      return data.booking;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm move-in
  const confirmMoveIn = async (id) => {
    setLoading(true);
    try {
      const data = await bookingService.confirmMoveIn(id);
      toast.success('Move-in confirmed successfully!');
      
      // Update in state
      setBookings(bookings.map(b => 
        b._id === id ? data.booking : b
      ));
      
      return data.booking;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch hostel bookings (for owners)
  const fetchHostelBookings = async (hostelId) => {
    setLoading(true);
    try {
      const data = await bookingService.getHostelBookings(hostelId);
      return data.bookings;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    currentBooking,
    loading,
    fetchUserBookings,
    fetchBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    confirmMoveIn,
    fetchHostelBookings,
    setCurrentBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;