import { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import { handleApiError } from '../utils/helpers';
import { toast } from 'react-toastify';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data.bookings);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchBookings();
  };

  return { bookings, loading, error, refetch };
};

export default useBookings;