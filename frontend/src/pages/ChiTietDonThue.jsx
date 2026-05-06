// File: src/pages/ChiTietDonThue.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { huydonthuê, laydonthuebyid } from '../services/api';

const ChiTietDonThue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchRental = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await laydonthuebyid(id);
        setRental(data);
      } catch (err) {
        setError(err.message || 'Không tìm thấy đơn thuê');
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { label: 'Chờ xác nhận', color: '#7a5c00', bg: '#fff8e1' };
      case 1: return { label: 'Đã xác nhận',  color: '#0b6b2f', bg: '#e9f8ef' };
      case 2: return { label: 'Đang thuê',    color: '#1565c0', bg: '#e3f2fd' };
      case 3: return { label: 'Hoàn thành',   color: '#555',    bg: '#f0f0f0' };
      case 4: return { label: 'Đã hủy',       color: '#a00',    bg: '#fdecea' };
      default: return { label: 'Không rõ',    color: '#888',    bg: '#eee'    };
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn thuê này?')) return;
    setCancelling(true);
    setError('');
    try {
      await huydonthuê(id);
      setSuccessMsg('Hủy đơn thành công!');
      setRental((prev) => ({ ...prev, status: 4 }));
    } catch (err) {
      setError(err.message || 'Không thể hủy đơn');
    } finally {
      setCancelling(false);
    }
  };

  // Dùng field url trực tiếp từ API, không hardcode domain
  const getPrimaryImage = (vehicle) => {
    const images = vehicle?.images || [];
    return images.find((img) => img.is_primary)?.url || images[0]?.url || null;
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN') + ' đ';

  if (loading) return <p style={styles.centerMsg}>Đang tải đơn thuê...</p>;
  if (error && !rental) return <p style={{ ...styles.centerMsg, color: '#a00' }}>{error}</p>;
  if (!rental) return null;

  const status   = getStatusInfo(rental.status);
  const imageUrl = getPrimaryImage(rental.vehicle);

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <h1 style={styles.pageTitle}>CHI TIẾT ĐƠN THUÊ #{rental.id}</h1>

      {successMsg && <div style={styles.successBox}>{successMsg}</div>}
      {error      && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.grid}>

        {/* ===== THÔNG TIN XE ===== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏍️ Thông tin xe</h2>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={rental.vehicle?.name}
              style={styles.vehicleImage}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={styles.noImage}>Chưa có ảnh</div>
          )}

          <div style={styles.infoRow}>
            <span style={styles.label}>Tên xe:</span>
            <span style={styles.value}>{rental.vehicle?.name || '---'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Hãng:</span>
            <span style={styles.value}>{rental.vehicle?.brand?.name || '---'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Loại:</span>
            <span style={styles.value}>{rental.vehicle?.category?.name || '---'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Biển số:</span>
            <span style={styles.value}>{rental.vehicle?.license_plate || '---'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Giá/ngày:</span>
            <span style={{ ...styles.value, color: '#1e3a5f', fontWeight: 'bold' }}>
              {formatPrice(rental.vehicle?.price_per_day)}
            </span>
          </div>
        </div>

        {/* ===== THÔNG TIN ĐƠN THUÊ ===== */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📋 Thông tin đơn thuê</h2>

          <div style={styles.infoRow}>
            <span style={styles.label}>Mã đơn:</span>
            <span style={styles.value}>#{rental.id}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Trạng thái:</span>
            <span style={{ ...styles.badge, color: status.color, backgroundColor: status.bg }}>
              {status.label}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Ngày bắt đầu:</span>
            <span style={styles.value}>{formatDate(rental.start_date)}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Ngày kết thúc:</span>
            <span style={styles.value}>{formatDate(rental.end_date)}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Ngày tạo đơn:</span>
            <span style={styles.value}>{formatDate(rental.created_at)}</span>
          </div>

          <div style={styles.totalBox}>
            <span>Tổng tiền:</span>
            <span style={styles.totalPrice}>{formatPrice(rental.total_price)}</span>
          </div>

          {/* Chỉ hiện khi đang chờ xác nhận */}
          {rental.status === 0 && (
            <button
              style={{ ...styles.cancelBtn, opacity: cancelling ? 0.6 : 1 }}
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Đang hủy...' : '❌ Hủy đơn thuê'}
            </button>
          )}
        </div>

        {/* ===== THÔNG TIN NGƯỜI THUÊ (admin xem) ===== */}
        {rental.user && (
          <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
            <h2 style={styles.cardTitle}>👤 Thông tin người thuê</h2>
            <div style={styles.userGrid}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Họ tên:</span>
                <span style={styles.value}>{rental.user?.fullname || '---'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Email:</span>
                <span style={styles.value}>{rental.user?.email || '---'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Số điện thoại:</span>
                <span style={styles.value}>{rental.user?.phone || '---'}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    minHeight: '80vh',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#1e3a5f',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '0',
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: '22px',
    color: '#1e3a5f',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  vehicleImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  noImage: {
    width: '100%',
    height: '160px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#bbb',
    marginBottom: '16px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '14px',
  },
  label: { color: '#888', fontWeight: '500' },
  value: { color: '#333', fontWeight: '500', textAlign: 'right' },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '2px solid #eee',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: '22px',
    color: '#1e3a5f',
    fontWeight: 'bold',
  },
  cancelBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fdecea',
    color: '#a00',
    border: '1px solid #f5c2c7',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  },
  successBox: {
    padding: '12px',
    backgroundColor: '#e9f8ef',
    color: '#0b6b2f',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  errorBox: {
    padding: '12px',
    backgroundColor: '#fdecea',
    color: '#a00',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  centerMsg: {
    textAlign: 'center',
    marginTop: '80px',
    color: '#888',
    fontSize: '16px',
  },
};

export default ChiTietDonThue;