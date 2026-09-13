import { useState } from 'react';
import paymentService from '../services/paymentService';
import { handleApiError } from '../utils/helpers';
import { toast } from 'react-toastify';

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.initiatePayment(paymentData);
      toast.success('Payment initiated successfully!');
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId, transactionId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.verifyPayment(paymentId, transactionId);
      toast.success('Payment verified successfully!');
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, initiatePayment, verifyPayment };
};

export default usePayment;