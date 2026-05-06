import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!vehicle) return null;

  const {
    id,
    name,
    license_plate,
    price_per_day,
    description,
    category,
    brand,
    images = [],
    status,
  } = vehicle;

  const is_available = status === 0;

  const getImageUrl = (img) => {
    if (!img?.image) return null;
    return `http://127.0.0.1:8000/storage/${img.image}`;
  };

  const primaryImage =
    (!imgError &&
      (getImageUrl(images.find((img) => img.is_primary)) ||
        getImageUrl(images[0]))) ||
    'https://placehold.co/300x220?text=🚗';

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Liên hệ';
    return `${Number(price).toLocaleString('vi-VN')} đ`;
  };

  const handleRent = (e) => {
    e.preventDefault();
    navigate(`/vehicle/${id}`);
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <span
        style={{
          ...styles.badge,
          backgroundColor: is_available ? '#22c55e' : '#ef4444',
        }}
      >
        {is_available ? 'Còn xe' : 'Hết xe'}
      </span>

      {/* Image */}
      <Link to={`/xe/${id}`} style={styles.imageContainer}>
        <img
          src={primaryImage}
          alt={name}
          style={{
            ...styles.image,
            ...(isHovered ? { transform: 'scale(1.08)' } : {}),
          }}
          onError={() => setImgError(true)}
        />
        <div style={styles.imageOverlay}></div>
      </Link>

      {/* Info */}
      <div style={styles.info}>
        <div style={styles.metaRow}>
          {brand?.name && <p style={styles.type}>{brand.name}</p>}
          {category?.name && <p style={styles.typeBlue}>{category.name}</p>}
        </div>

        <h3 style={styles.name}>{name}</h3>

        {license_plate && (
          <p style={styles.licensePlate}>🚗 {license_plate}</p>
        )}

        {/* ✅ PRICE + BUTTON (1 cột) */}
        <div style={styles.footer}>
          <div style={styles.priceBox}>
            <p style={styles.price}>{formatPrice(price_per_day)}</p>
            <span style={styles.priceLabel}>/ ngày</span>
          </div>

          <button
            onClick={handleRent}
            disabled={!is_available}
            style={{
              ...styles.button,
              ...(isHovered && is_available ? styles.buttonHover : {}),
              ...(!is_available ? styles.buttonDisabled : {}),
            }}
          >
            🚘 Thuê ngay
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    transition: 'all 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
  },

  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.10)',
  },

  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 10px',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    zIndex: 5,
  },

  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    background: '#f3f4f6',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',

    // QUAN TRỌNG
    transition: 'transform 0.3s ease',

    // XÓA hiệu ứng đen
    filter: 'none',
    opacity: 1,
  },

  // XÓA overlay đen
  imageOverlay: {
    display: 'none',
  },

  info: {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    background: '#fff',
  },

  metaRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '6px',
  },

  type: {
    fontSize: '11px',
    background: '#f1f5f9',
    padding: '3px 8px',
    borderRadius: '6px',
    color: '#334155',
  },

  typeBlue: {
    fontSize: '11px',
    background: '#dbeafe',
    padding: '3px 8px',
    borderRadius: '6px',
    color: '#1d4ed8',
  },

  name: {
    fontWeight: '700',
    fontSize: '17px',
    margin: '6px 0',
    color: '#111827',
  },

  licensePlate: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '12px',
  },

  footer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  priceBox: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },

  price: {
    fontSize: '22px',
    fontWeight: '800',
    margin: 0,
    color: '#dc2626',
  },

  priceLabel: {
    fontSize: '12px',
    color: '#94a3b8',
  },

  button: {
    width: '100%',
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.25s',
  },

  buttonHover: {
    transform: 'scale(1.01)',
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
export default VehicleCard;