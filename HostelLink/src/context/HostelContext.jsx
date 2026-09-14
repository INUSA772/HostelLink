import { createContext, useState, useContext, useMemo } from 'react';
import hostelService from '../services/hostelService';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/helpers';

const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [currentHostel, setCurrentHostel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    amenities: [],
    distance: '',
    sort: 'latest',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // Fetch all hostels
  const fetchHostels = async (customFilters = {}) => {
    setLoading(true);
    try {
      const filterParams = { ...filters, ...customFilters };
      const data = await hostelService.getAllHostels(filterParams);
      setHostels(data.hostels);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  // Fetch single hostel
  const fetchHostelById = async (id) => {
    setLoading(true);
    try {
      const data = await hostelService.getHostelById(id);
      setCurrentHostel(data.hostel);
      return data.hostel;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create hostel
  const createHostel = async (hostelData) => {
    setLoading(true);
    try {
      const data = await hostelService.createHostel(hostelData);
      toast.success('Property created successfully!');
      return data.hostel;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update hostel
  const updateHostel = async (id, hostelData) => {
    setLoading(true);
    try {
      const data = await hostelService.updateHostel(id, hostelData);
      toast.success('Property updated successfully!');
      setCurrentHostel(data.hostel);
      return data.hostel;
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete hostel
  const deleteHostel = async (id) => {
    setLoading(true);
    try {
      await hostelService.deleteHostel(id);
      toast.success('Property deleted successfully!');
      setHostels(hostels.filter(h => h._id !== id));
    } catch (error) {
      toast.error(handleApiError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      gender: '',
      amenities: [],
      distance: '',
      sort: 'latest',
      page: 1,
      limit: 12
    });
  };

  // Change page
  const changePage = (page) => {
    setFilters({ ...filters, page });
  };

  // Memoized so consumers only re-render when the actual data changes, not on
  // every render of this provider (an unmemoized object literal here was
  // causing every useHostel() consumer — including property detail pages with
  // an embedded map — to re-render constantly, which made the map flicker).
  const value = useMemo(() => ({
    hostels,
    currentHostel,
    loading,
    filters,
    pagination,
    fetchHostels,
    fetchHostelById,
    createHostel,
    updateHostel,
    deleteHostel,
    updateFilters,
    resetFilters,
    changePage,
    setCurrentHostel
    // Action functions are plain re-declarations each render (not wrapped in
    // useCallback) but always close over the same stable setters, so they're
    // safe to omit here — including them would defeat the memoization above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [hostels, currentHostel, loading, filters, pagination]);

  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>;
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};

export default HostelContext;