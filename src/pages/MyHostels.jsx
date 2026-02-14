import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import hostelService from '../services/hostelService';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHome } from 'react-icons/fa';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { formatCurrency, handleApiError } from '../utils/helpers';
import '../styles/global.css';

const MyHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, hostelId: null, hostelName: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyHostels();
  }, []);

  const fetchMyHostels = async () => {
    setLoading(true);
    try {
      const data = await hostelService.getOwnerHostels();
      setHostels(data.hostels);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (hostel) => {
    setDeleteModal({
      isOpen: true,
      hostelId: hostel._id,
      hostelName: hostel.name
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await hostelService.deleteHostel(deleteModal.hostelId);
      toast.success('Hostel deleted successfully!');
      setHostels(hostels.filter(h => h._id !== deleteModal.hostelId));
      setDeleteModal({ isOpen: false, hostelId: null, hostelName: '' });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading your hostels..." />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--gray-lighter)',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-4xl)',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <FaHome style={{ marginRight: '0.5rem' }} />
              My Hostels
            </h1>
            <p style={{ color: 'var(--gray)', fontSize: 'var(--font-size-lg)' }}>
              Manage your {hostels.length} hostel listing{hostels.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Link to="/hostels/create">
            <Button variant="primary" size="lg">
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Add New Hostel
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {hostels.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                {hostels.length}
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Total Hostels</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--success)', marginBottom: '0.5rem' }}>
                {hostels.reduce((sum, h) => sum + h.availableRooms, 0)}
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Available Rooms</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--warning)', marginBottom: '0.5rem' }}>
                {hostels.reduce((sum, h) => sum + h.viewCount, 0)}
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Total Views</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--info)', marginBottom: '0.5rem' }}>
                {hostels.filter(h => h.verified).length}
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0 }}>Verified</p>
            </div>
          </div>
        )}

        {/* Hostels List */}
        {hostels.length === 0 ? (
          <EmptyState
            icon={<FaHome />}
            title="No Hostels Yet"
            message="You haven't listed any hostels yet. Start by adding your first hostel property."
            actionText="Add Your First Hostel"
            actionLink="/hostels/create"
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {hostels.map((hostel) => (
              <div
                key={hostel._id}
                className="card"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image */}
                <div style={{
                  height: '200px',
                  backgroundColor: 'var(--gray-lighter)',
                  position: 'relative'
                }}>
                  {hostel.images && hostel.images.length > 0 ? (
                    <img
                      src={hostel.images[0]}
                      alt={hostel.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gray)'
                    }}>
                      <FaHome size={48} />
                    </div>
                  )}

                  {/* Status Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {hostel.verified && (
                      <Badge variant="success">Verified</Badge>
                    )}
                    {!hostel.isActive && (
                      <Badge variant="error">Inactive</Badge>
                    )}
                  </div>

                  {/* Availability */}
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem'
                  }}>
                    <Badge variant={hostel.availableRooms > 0 ? 'info' : 'error'}>
                      {hostel.availableRooms} / {hostel.totalRooms} Available
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    marginBottom: '0.5rem',
                    fontSize: 'var(--font-size-xl)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {hostel.name}
                  </h3>

                  <p style={{
                    color: 'var(--gray)',
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {hostel.description}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--gray-lighter)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray)', margin: 0 }}>
                        Price
                      </p>
                      <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                        {formatCurrency(hostel.price)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray)', margin: 0 }}>
                        Views
                      </p>
                      <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'bold', margin: 0 }}>
                        <FaEye style={{ marginRight: '0.25rem' }} />
                        {hostel.viewCount || 0}
                      </p>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Action Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--gray-light)'
                  }}>
                    <Link to={`/hostels/${hostel._id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outline" size="sm" fullWidth>
                        <FaEye />
                      </Button>
                    </Link>

                    <Link to={`/hostels/edit/${hostel._id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="sm" fullWidth>
                        <FaEdit />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => handleDeleteClick(hostel)}
                      style={{
                        color: 'var(--error)',
                        borderColor: 'var(--error)'
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, hostelId: null, hostelName: '' })}
        title="Delete Hostel"
        footer={
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, hostelId: null, hostelName: '' })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              loading={deleting}
              style={{
                backgroundColor: 'var(--error)',
                borderColor: 'var(--error)'
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p style={{ marginBottom: '1rem' }}>
          Are you sure you want to delete <strong>{deleteModal.hostelName}</strong>?
        </p>
        <p style={{ color: 'var(--error)' }}>
          ⚠️ This action cannot be undone. All data including images, reviews, and bookings will be permanently deleted.
        </p>
      </Modal>
    </div>
  );
};

export default MyHostels;