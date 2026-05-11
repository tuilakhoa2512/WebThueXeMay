import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead
} from '../services/api';

const MainLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const location = useLocation();
  const currentPath = location.pathname;

  // ===== LOAD DATA =====
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnread();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUnread = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unread);
    } catch (e) {
      console.log(e);
    }
  };

  // ===== CLICK = ĐỌC =====
  const handleRead = async (id) => {
    // Nếu đã đọc rồi thì chỉ đóng dropdown, không gọi API
    const notif = notifications.find((n) => n.id === id);
    if (notif && Number(notif.is_read) === 1) {
      setNotiOpen(false);
      return;
    }

    // Optimistic update — cập nhật UI ngay lập tức
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

    try {
      await markNotificationRead(id);
    } catch (e) {
      // Rollback nếu API lỗi
      console.error('Lỗi đánh dấu đã đọc:', e);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 0 } : n))
      );
      setUnreadCount((prev) => prev + 1);
    } finally {
      setNotiOpen(false);
    }
  };

  // ===== CLICK OUTSIDE =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== LOGOUT =====
  const handleLogout = () => {
    logout();

    setMenuOpen(false);
    setNotiOpen(false);

    // về trang chủ
    navigate('/');

    // reload lại homepage
    window.location.reload();
  };

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.container}>

          {/* LOGO */}
          <Link to="/" style={s.logoWrapper}>
            <img src="/logo.png" alt="Logo" style={s.logoImg} />
          </Link>

          {/* MENU */}
          <div style={s.links}>
            <Link to="/" style={{ ...s.link, ...(currentPath === '/' ? s.activeLink : {}) }}>
              TRANG CHỦ
            </Link>
            <Link to="/gioi-thieu" style={{ ...s.link, ...(currentPath === '/gioi-thieu' ? s.activeLink : {}) }}>
              GIỚI THIỆU
            </Link>
            <Link to="/vehicle" style={{ ...s.link, ...(currentPath.startsWith('/vehicle') ? s.activeLink : {}) }}>
              Xe
            </Link>
            <Link to="/review" style={{ ...s.link, ...(currentPath === '/review' ? s.activeLink : {}) }}>
              Đánh giá
            </Link>


            {isAuthenticated && (
              <Link
                to="/don-thue"
                style={{
                  ...s.link,
                  ...(currentPath.startsWith('/don-thue') ? s.activeLink : {})
                }}
              >
                LỊCH SỬ
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/ho-so"
                style={{
                  ...s.link,
                  ...(currentPath.startsWith('/ho-so') ? s.activeLink : {})
                }}
              >
                HỒ SƠ
              </Link>
            )}
          </div>

          {/* AUTH */}
          <div style={s.actions} ref={menuRef}>
            {!isAuthenticated ? (
              <>
                <Link to="/dang-nhap?mode=login" style={s.loginBtn}>
                  Đăng nhập
                </Link>
                <Link to="/dang-nhap?mode=register" style={s.registerBtn}>
                  Đăng ký
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                {/* 🔔 NOTIFICATION */}
                <div style={{ position: 'relative' }}>
                  <button
                    style={s.iconButton}
                    onClick={() => {
                      setNotiOpen((prev) => !prev);
                      setMenuOpen(false);
                    }}
                  >
                    🔔
                  </button>

                  {unreadCount > 0 && (
                    <span style={s.badge}>{unreadCount}</span>
                  )}

                  {notiOpen && (
                    <div style={s.notiDropdown}>
                      <div style={s.notiHeader}>🔔 Thông báo</div>

                      {notifications.length === 0 && (
                        <div style={s.notiEmpty}>Không có thông báo</div>
                      )}

                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleRead(item.id)}
                          style={{
                            ...s.notiItem,
                            backgroundColor: Number(item.is_read) === 1
                              ? '#f5f5f5'
                              : '#e6f7ff'
                          }}
                        >
                          <div style={s.notiTitle}>
                            {Number(item.is_read) === 1 ? '📩' : '📬'} {item.content}
                          </div>

                          <div style={s.notiTime}>
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 👤 USER */}
                <div style={s.userMenuWrapper}>
                  <button
                    style={s.userButton}
                    onClick={() => {
                      setMenuOpen((prev) => !prev);
                      setNotiOpen(false);
                    }}
                  >
                    👤
                  </button>

                  {menuOpen && (
                    <div style={s.userDropdown}>
                      <div style={s.dropdownHeader}>
                        Xin chào, {user?.fullname || user?.name || 'User'}!
                      </div>

                      <hr style={s.divider} />

                      <button style={s.dropdownButton} onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </nav>

      <div style={s.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

const s = {
  app: {
    fontFamily: "Arial, Helvetica, sans-serif",
    backgroundColor: '#F9F8F3',
    minHeight: '100vh',
    color: '#3E2723',
    display: 'flex',
    flexDirection: 'column'
  },

  nav: {
    backgroundColor: '#720e0e',
    height: '80px',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },

  notiDropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: '320px',
    background: '#fff',
    color: '#333',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    zIndex: 2000
  },

  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold'
  },

  notiHeader: {
    padding: '12px',
    fontWeight: '700',
    borderBottom: '1px solid #eee',
    background: '#fafafa'
  },

  notiEmpty: {
    padding: '20px',
    textAlign: 'center',
    color: '#999'
  },

  notiItem: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer'
  },

  notiTitle: {
    fontSize: '14px',
    fontWeight: '500'
  },

  notiTime: {
    fontSize: '11px',
    color: '#888',
    marginTop: '5px'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    width: '100%',
    gap: '20px'
  },

  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    height: '100%'
  },

  logoImg: {
    height: '55px',
    objectFit: 'contain'
  },

  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },

  link: {
    color: '#F5F5F5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '8px 12px',
    borderRadius: '6px'
  },

  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottom: '3px solid #F3C68F'
  },

  content: {
    flex: 1
  },

  actions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },

  loginBtn: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 18px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.7)'
  },

  registerBtn: {
    color: '#720e0e',
    backgroundColor: '#F3C68F',
    textDecoration: 'none',
    padding: '9px 20px',
    borderRadius: '24px',
    fontWeight: '700'
  },

  iconButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.4)',
    color: 'white',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  userMenuWrapper: {
    position: 'relative'
  },

  userButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.4)',
    color: 'white',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    cursor: 'pointer',
    fontSize: '18px',
  },

  userDropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
  },

  dropdownHeader: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333'
  },

  divider: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '8px 0'
  },

  dropdownButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    cursor: 'pointer'
  }
};

export default MainLayout;