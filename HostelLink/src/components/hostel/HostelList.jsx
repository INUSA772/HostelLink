import React from 'react';
import HostelCard from './HostelCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { FaHome } from 'react-icons/fa';
import '../../styles/global.css';

const HostelList = ({ hostels, loading }) => {
  if (loading) {
    return <Loader text="Loading hostels..." />;
  }

  if (!hostels || hostels.length === 0) {
    return (
      <EmptyState
        icon={<FaHome />}
        title="No Hostels Found"
        message="We couldn't find any hostels matching your criteria. Try adjusting your filters or check back later."
      />
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    }}>
      {hostels.map((hostel) => (
        <HostelCard key={hostel._id} hostel={hostel} />
      ))}
    </div>
  );
};

export default HostelList;