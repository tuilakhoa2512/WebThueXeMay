// File: src/pages/DonThue.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  capnhatthongtin,
  danxuat,
  doimatkhau,
  laydonthueculatoi,
  laythongtin,
} from '../services/api';

const tabs = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang thuê', 'Hoàn thành', 'Đã hủy'];

const convertStatus = (status) => {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'renting': return 2;
    case 'completed': return 3;
    case 'cancelled': return 4;
    default: return status; // nếu BE trả số rồi thì giữ nguyên
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

  // ===== State đơn thuê =====
  const [rentals, setRentals] = useState([]);
  const [loadingR, setLoadingR] = useState(true);
  const [errorR, setErrorR] = useState('');

  // ===== State hồ sơ =====
  const [profile, setProfile] = useState(null);
  const [loadingP, setLoadingP] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');

  // ===== State đổi mật khẩu =====
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // ===== Load đơn thuê =====
  useEffect(() => {
    const fetch = async () => {
      setLoadingR(true);
      setErrorR('');
      try {
        const data = await laydonthueculatoi();

        const normalized = data.map(r => ({
          ...r,
          status: convertStatus(r.status)
        }));

        setRentals(normalized);
      } catch (err) {
        setErrorR(err.message || 'Không thể tải danh sách đơn thuê.');
      } finally {
        setLoadingR(false);
      }
    };
    fetch();
  }, []);

  // ===== Load hồ sơ khi chuyển tab =====
  useEffect(() => {
    if (activeMenu !== 'profile') return;
    const fetch = async () => {
      setLoadingP(true);
      try {
        const data = await laythongtin();
        setProfile(data);
        setFullname(data.fullname || '');
        setPhone(data.phone || '');
      } catch (err) {
        setProfileMsg(err.message || 'Không thể tải hồ sơ.');
      } finally {
        setLoadingP(false);
      }
    };
    fetch();
  }, [activeMenu]);

  // ===== Lưu thông tin =====
  const handleSaveProfile = async () => {
    setProfileMsg('');
    try {
      await capnhatthongtin({ fullname, phone });
      setProfileMsg('✅ Cập nhật thông tin thành công!');
    } catch (err) {
      setProfileMsg('❌ ' + (err.message || 'Cập nhật thất bại.'));
    }
  };

  // ===== Đổi mật khẩu =====
  const handleChangePassword = async () => {
    setPassMsg('');
    if (newPassword !== confirmPass) {
      setPassMsg('❌ Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      await doimatkhau({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPass,
      });
      setPassMsg('✅ Đổi mật khẩu thành công!');
      setOldPassword(''); setNewPassword(''); setConfirmPass('');
    } catch (err) {
      setPassMsg('❌ ' + (err.message || 'Đổi mật khẩu thất bại.'));
    }
  };

  // ===== Đăng xuất =====
  const handleLogout = async () => {
    if (!window.confirm('Bạn có chắc muốn đăng xuất không?')) return;
    try {
      await danxuat();
    } catch (_) { }
    logout?.();
    navigate('/');
  };

  // ===== Lọc đơn thuê theo tab =====
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

  // ===== VIEW HỒ SƠ =====
  const ProfileView = () => (
    <div style={styles.viewContainer}>
      <h2 style={styles.viewTitle}>Hồ Sơ & Bảo Mật</h2>
      <p style={styles.viewSub}>Quản lý thông tin tài khoản và mật khẩu của bạn</p>
      <hr style={styles.hr} />

      {loadingP ? (
        <p style={{ color: '#888' }}>Đang tải...</p>
      ) : (
        <>
          <div style={styles.formSection}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <span style={styles.textStatic}>{profile?.email || user?.email || '---'}</span>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Họ và tên</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {profileMsg && (
            <p style={{
              marginTop: '12px', marginLeft: '170px', fontSize: '14px',
              color: profileMsg.startsWith('✅') ? '#0b6b2f' : '#a00'
            }}>
              {profileMsg}
            </p>
          )}

          <button style={styles.btnSave} onClick={handleSaveProfile}>
            LƯU THAY ĐỔI
          </button>

          <h3 style={{ ...styles.viewTitle, fontSize: '18px', marginTop: '36px' }}>Đổi mật khẩu</h3>
          <hr style={styles.hr} />
          <div style={styles.formSection}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu cũ</label>
              <input type="password" value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Xác nhận</label>
              <input type="password" value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)} style={styles.input} />
            </div>
          </div>

          {passMsg && (
            <p style={{
              marginTop: '12px', marginLeft: '170px', fontSize: '14px',
              color: passMsg.startsWith('✅') ? '#0b6b2f' : '#a00'
            }}>
              {passMsg}
            </p>
          )}

          <button style={styles.btnSave} onClick={handleChangePassword}>
            ĐỔI MẬT KHẨU
          </button>
        </>
      )}
    </div>
  );

  // ===== VIEW ĐƠN THUÊ =====
  const RentalsView = () => (
    <>
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
                  <button
                    style={styles.btnOutline}
                    onClick={() => navigate(`/don-thue/${rental.id}`)}
                  >
                    XEM CHI TIẾT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

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
            onClick={() => setActiveMenu('profile')}
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
        {activeMenu === 'rentals' ? <RentalsView /> : <ProfileView />}
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

  // Profile
  viewContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  viewTitle: { margin: '0 0 8px 0', fontSize: '20px', color: '#1e3a5f' },
  viewSub: { fontSize: '14px', color: '#777', marginBottom: '20px' },
  hr: { border: 'none', borderBottom: '1px solid #eee', marginBottom: '24px' },
  formSection: { display: 'flex', flexDirection: 'column', gap: '18px' },
  formGroup: { display: 'flex', alignItems: 'center', gap: '20px' },
  label: { width: '150px', textAlign: 'right', fontSize: '14px', color: '#555' },
  textStatic: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
  input: {
    flex: 1, maxWidth: '400px', padding: '10px',
    border: '1px solid #ddd', borderRadius: '6px', outline: 'none', fontSize: '14px',
  },
  btnSave: {
    marginTop: '24px', marginLeft: '170px',
    backgroundColor: '#1e3a5f', color: '#fff',
    border: 'none', padding: '11px 28px', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
  },

  // Tabs
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

  // Danh sách đơn
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
  orderFooter: { padding: '14px 20px', backgroundColor: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  orderTotal: { fontSize: '14px', color: '#555' },
  totalPrice: { fontSize: '20px', color: '#1e3a5f', fontWeight: 'bold', marginLeft: '8px' },
  btnOutline: {
    backgroundColor: 'transparent', color: '#1e3a5f', border: '1px solid #1e3a5f',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '13px', textDecoration: 'none',
  },
  emptyState: { backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#777' },
  emptyIcon: { fontSize: '56px', marginBottom: '12px', opacity: 0.4 },
};

export default DonThue;