import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { danxuat, laydonthueculatoi } from '../services/api';

const tabs = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang thuê', 'Hoàn thành', 'Đã hủy'];

const convertStatus = (status) => {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'renting': return 2;
    case 'completed': return 3;
    case 'cancelled': return 4;
    default: return status;
  }
};

const STATUS_MAP = {
  0: 'Chờ xác nhận',
  1: 'Đã xác nhận',
  2: 'Đang thuê',
  3: 'Hoàn thành',
  4: 'Đã hủy',
};

const STATUS_STYLE = {
  0: { color: '#7a5c00', bg: '#fff8e1' },
  1: { color: '#0b6b2f', bg: '#e9f8ef' },
  2: { color: '#1565c0', bg: '#e3f2fd' },
  3: { color: '#555', bg: '#f0f0f0' },
  4: { color: '#a00', bg: '#fdecea' },
};

const DonThue = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState('rentals');
  const [activeTab, setActiveTab] = useState('Tất cả');

  const [rentals, setRentals] = useState([]);
  const [loadingR, setLoadingR] = useState(true);
  const [errorR, setErrorR] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoadingR(true);
      setErrorR('');
      try {
        const data = await laydonthueculatoi();
        const normalized = data.map(r => ({ ...r, status: convertStatus(r.status) }));
        setRentals(normalized);
      } catch (err) {
        setErrorR(err.message || 'Không thể tải danh sách đơn thuê.');
      } finally {
        setLoadingR(false);
      }
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('Bạn có chắc muốn đăng xuất không?')) return;
    try { await danxuat(); } catch (_) { }
    logout?.();
    navigate('/');
  };

  const filteredRentals =
    activeTab === 'Tất cả'
      ? rentals
      : rentals.filter((r) => STATUS_MAP[r.status] === activeTab);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + ' đ';

  const getPrimaryImage = (vehicle) => {
    const images = vehicle?.images || [];
    return images.find((img) => img.is_primary)?.url || images[0]?.url || null;
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.userDetails}>
            <h3 style={styles.userName}>{user?.fullname || user?.name || 'Khách hàng'}</h3>
            <p style={styles.userEmail}>{user?.email || ''}</p>
          </div>
        </div>
        <ul style={styles.menuList}>
          <li
            style={{ ...styles.menuItem, ...(activeMenu === 'profile' ? styles.activeMenuItem : {}) }}
            onClick={() => { setActiveMenu('profile'); navigate('/ho-so'); }}
          >
            👤 Hồ sơ & Bảo mật
          </li>
          <li
            style={{ ...styles.menuItem, ...(activeMenu === 'rentals' ? styles.activeMenuItem : {}) }}
            onClick={() => setActiveMenu('rentals')}
          >
            🚘 Đơn thuê xe
          </li>
          <li
            style={{ ...styles.menuItem, color: '#a00', marginTop: '20px' }}
            onClick={handleLogout}
          >
            🚪 Đăng xuất
          </li>
        </ul>
      </div>

      {/* NỘI DUNG PHẢI */}
      <div style={styles.mainContent}>
        {/* TABS */}
        <div style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <div
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* DANH SÁCH ĐƠN */}
        {loadingR ? (
          <div style={styles.emptyState}><div style={styles.emptyIcon}>⏳</div><p>Đang tải đơn thuê...</p></div>
        ) : errorR ? (
          <div style={styles.emptyState}><div style={styles.emptyIcon}>❌</div><p>{errorR}</p></div>
        ) : filteredRentals.length === 0 ? (
          <div style={styles.emptyState}><div style={styles.emptyIcon}>🚘</div><p>Chưa có đơn thuê nào.</p></div>
        ) : (
          <div style={styles.orderList}>
            {filteredRentals.map((rental) => {
              const st = STATUS_STYLE[rental.status] || STATUS_STYLE[4];
              const label = STATUS_MAP[rental.status] || 'Không rõ';
              const imageUrl = getPrimaryImage(rental.vehicle);
              const isCompleted = rental.status === 3;

              return (
                <div key={rental.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <span style={styles.orderId}>Mã đơn: <strong>#{rental.id}</strong></span>
                    <span style={{ ...styles.statusBadge, color: st.color, backgroundColor: st.bg }}>
                      {label.toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.orderBody}>
                    <div style={styles.productRow}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={rental.vehicle?.name} style={styles.productImg}
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div style={styles.noImg}>🏍️</div>
                      )}
                      <div style={styles.productInfo}>
                        <h4 style={styles.productName}>{rental.vehicle?.name || '---'}</h4>
                        <p style={styles.productMeta}>
                          {rental.vehicle?.brand?.name} · {rental.vehicle?.category?.name}
                        </p>
                        <p style={styles.productMeta}>🚗 {rental.vehicle?.license_plate || '---'}</p>
                        <p style={styles.productMeta}>
                          📅 {formatDate(rental.start_date)} → {formatDate(rental.end_date)}
                        </p>
                      </div>
                      <div style={styles.productPrice}>
                        {formatPrice(rental.vehicle?.price_per_day)}
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}> / ngày</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.orderTotal}>
                      Tổng tiền:{' '}
                      <span style={styles.totalPrice}>{formatPrice(rental.total_price)}</span>
                    </div>
                    <div style={styles.footerActions}>
                      {isCompleted && (
                        <button
                          style={styles.btnReview}
                          onClick={() => navigate(`/danh-gia/${rental.id}`, {
                            state: {
                              rentalId: rental.id,
                              vehicle: rental.vehicle,
                            }
                          })}
                        >
                          ⭐ ĐÁNH GIÁ
                        </button>
                      )}
                      <button
                        style={styles.btnOutline}
                        onClick={() => navigate(`/don-thue/${rental.id}`)}
                      >
                        XEM CHI TIẾT
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px', margin: '40px auto', padding: '0 20px',
    display: 'flex', gap: '20px', alignItems: 'flex-start', minHeight: '70vh',
  },
  sidebar: {
    flex: '0 0 250px', backgroundColor: '#fff',
    borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden',
  },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: '15px',
    padding: '20px', borderBottom: '1px solid #f0f0f0',
  },
  avatar: {
    fontSize: '28px', backgroundColor: '#eff6ff', borderRadius: '50%',
    width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  userDetails: { flex: 1, overflow: 'hidden' },
  userName: { margin: '0 0 4px 0', fontSize: '15px', color: '#1e3a5f', fontWeight: 'bold' },
  userEmail: { margin: 0, fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  menuList: { listStyle: 'none', padding: '10px 0', margin: 0 },
  menuItem: { padding: '12px 20px', color: '#555', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' },
  activeMenuItem: { color: '#1e3a5f', fontWeight: 'bold', backgroundColor: '#eff6ff' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
  tabsContainer: {
    display: 'flex', backgroundColor: '#fff', borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto',
  },
  tab: {
    flex: 1, textAlign: 'center', padding: '14px 10px',
    cursor: 'pointer', fontSize: '13px', color: '#555',
    borderBottom: '3px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  activeTab: { color: '#1e3a5f', fontWeight: 'bold', borderBottomColor: '#1e3a5f' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderCard: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' },
  orderHeader: { padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: '14px', color: '#333' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  orderBody: { padding: '20px' },
  productRow: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  productImg: { width: '90px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee', flexShrink: 0 },
  noImg: {
    width: '90px', height: '70px', backgroundColor: '#f3f4f6',
    borderRadius: '6px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '28px', flexShrink: 0,
  },
  productInfo: { flex: 1 },
  productName: { margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e3a5f' },
  productMeta: { margin: '0 0 4px 0', fontSize: '13px', color: '#777' },
  productPrice: { fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f', whiteSpace: 'nowrap' },
  orderFooter: {
    padding: '14px 20px', backgroundColor: '#fafbfc',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '12px',
  },
  orderTotal: { fontSize: '14px', color: '#555' },
  totalPrice: { fontSize: '20px', color: '#1e3a5f', fontWeight: 'bold', marginLeft: '8px' },
  footerActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  btnReview: {
    backgroundColor: '#f59e0b', color: '#fff',
    border: 'none', padding: '8px 16px', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
  },
  btnOutline: {
    backgroundColor: 'transparent', color: '#1e3a5f', border: '1px solid #1e3a5f',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '13px', textDecoration: 'none',
  },
  emptyState: { backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#777' },
  emptyIcon: { fontSize: '56px', marginBottom: '12px', opacity: 0.4 },
};

export default DonThue;