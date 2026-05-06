// File: src/pages/DanhSachXe.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAvailableVehicle } from '../context/AvailableVehicleContext';
import { boYeuThich, layDanhSachYeuThich, themYeuThich } from '../services/api';

const DanhSachXe = () => {
  const { vehicles, loading, error, loadAvailableVehicles } = useAvailableVehicle();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  // Set chứa vehicle_id đang được yêu thích
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  // Set chứa vehicle_id đang pending (tránh double click)
  const [pendingIds, setPendingIds] = useState(new Set());

  const today = new Date().toISOString().split('T')[0];
  const isLoggedIn = !!localStorage.getItem('token');

  // Load xe
  useEffect(() => {
    loadAvailableVehicles({
      keyword,
      category_id: categoryId,
      brand_id: brandId,
      start_date: startDate,
      end_date: endDate,
    });
  }, [keyword, categoryId, brandId, startDate, endDate]);

  // Load danh sách yêu thích khi đã đăng nhập
  useEffect(() => {
    if (!isLoggedIn) return;
    layDanhSachYeuThich()
      .then((data) => {
        const ids = new Set((data || []).map((v) => v.id));
        setFavoriteIds(ids);
      })
      .catch(() => { });
  }, []);

  const toggleFavorite = async (e, vehicleId) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (pendingIds.has(vehicleId)) return;

    setPendingIds((prev) => new Set(prev).add(vehicleId));

    const isFav = favoriteIds.has(vehicleId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(vehicleId) : next.add(vehicleId);
      return next;
    });

    try {
      if (isFav) {
        await boYeuThich(vehicleId);
      } else {
        await themYeuThich(vehicleId);
      }
    } catch {
      // Rollback nếu lỗi
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(vehicleId) : next.delete(vehicleId);
        return next;
      });
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(vehicleId);
        return next;
      });
    }
  };

  const rentalDays = (() => {
    if (!startDate || !endDate) return null;
    const diff = (new Date(endDate) - new Date(startDate)) / 86400000;
    return diff > 0 ? diff : null;
  })();

  const getPrimaryImage = (vehicle) => {
    const images = vehicle.images || [];
    return images.find((img) => img.is_primary)?.url || images[0]?.url || null;
  };

  const formatVND = (amount) => Number(amount).toLocaleString('vi-VN');

  const goToDetail = (vehicle) => {
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    const qs = params.toString();
    navigate(`/vehicle/${vehicle.id}${qs ? `?${qs}` : ''}`);
  };

  const hasDateFilter = !!(startDate && endDate);
  const displayVehicles = hasDateFilter
    ? vehicles.filter(v => v.is_available === true)
    : vehicles.filter(v => v.status === 0 || v.status === 1);

  return (
    <div style={s.page}>
      {/* ===== HERO ===== */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.heroSub}>Khám phá & đặt xe dễ dàng</p>
          <h1 style={s.heroTitle}>Danh Sách Xe Cho Thuê</h1>
        </div>
      </div>

      <div style={s.container}>
        {/* ===== BỘ LỌC ===== */}
        <div style={s.filterCard}>
          <div style={s.filterRow}>
            <div style={s.searchWrapper}>
              <span style={s.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên xe..."
                style={s.searchInput}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <select style={s.select} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">🏍️ Tất cả loại xe</option>
              <option value="2">Xe số</option>
              <option value="1">Xe tay ga</option>
              <option value="3">Xe điện</option>
            </select>

            <select style={s.select} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">🏷️ Tất cả hãng</option>
              <option value="1">Honda</option>
              <option value="2">Yamaha</option>
              <option value="3">Suzuki</option>
              <option value="4">SYM</option>
            </select>
          </div>

          <div style={s.divider} />

          <div style={s.dateSection}>
            <div style={s.dateSectionTitle}>
              <span style={s.calIcon}>📅</span>
              <span>Chọn thời gian thuê để xem xe trống</span>
            </div>

            <div style={s.dateRow}>
              <div style={s.dateGroup}>
                <label style={s.dateLabel}>Ngày nhận xe</label>
                <input
                  type="date"
                  style={s.dateInput}
                  value={startDate}
                  min={today}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value >= endDate) setEndDate('');
                  }}
                />
              </div>

              <div style={s.arrowWrap}>
                <div style={s.arrow}>→</div>
              </div>

              <div style={s.dateGroup}>
                <label style={s.dateLabel}>Ngày trả xe</label>
                <input
                  type="date"
                  style={{
                    ...s.dateInput,
                    opacity: !startDate ? 0.5 : 1,
                    cursor: !startDate ? 'not-allowed' : 'pointer',
                  }}
                  value={endDate}
                  min={startDate || today}
                  disabled={!startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {rentalDays && (
                <div style={s.daysBadge}>
                  <span style={s.daysNum}>{rentalDays}</span>
                  <span style={s.daysTxt}>ngày</span>
                </div>
              )}

              {(startDate || endDate) && (
                <button
                  style={s.clearBtn}
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                >
                  ✕ Xóa ngày
                </button>
              )}
            </div>

            {hasDateFilter && (
              <div style={s.filterNotice}>
                <span style={s.noticeIcon}>✅</span>
                Đang hiển thị xe <strong>còn trống</strong> từ{' '}
                <strong>{new Date(startDate).toLocaleDateString('vi-VN')}</strong>
                {' '}đến{' '}
                <strong>{new Date(endDate).toLocaleDateString('vi-VN')}</strong>
              </div>
            )}
          </div>
        </div>

        {/* ===== RESULTS BAR ===== */}
        <div style={s.resultsBar}>
          <span style={s.resultsCount}>
            <strong>{displayVehicles.length}</strong> xe{hasDateFilter ? ' còn trống' : ''}
          </span>
          {hasDateFilter && rentalDays && (
            <span style={s.rentalInfo}>Thuê {rentalDays} ngày</span>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        {loading ? (
          <div style={s.stateBox}>
            <div style={s.spinner} />
            <p style={s.stateMsg}>Đang tải danh sách xe...</p>
          </div>
        ) : error ? (
          <div style={s.stateBox}>
            <span style={{ fontSize: '48px' }}>⚠️</span>
            <p style={{ ...s.stateMsg, color: '#dc2626' }}>{error}</p>
          </div>
        ) : displayVehicles.length === 0 ? (
          <div style={s.stateBox}>
            <span style={{ fontSize: '64px' }}>🏍️</span>
            <p style={s.stateMsg}>
              {hasDateFilter
                ? 'Không có xe trống trong khoảng thời gian này.'
                : 'Không tìm thấy xe nào phù hợp.'}
            </p>
            {hasDateFilter && (
              <button style={s.resetBtn} onClick={() => { setStartDate(''); setEndDate(''); }}>
                Xem tất cả xe
              </button>
            )}
          </div>
        ) : (
          <div style={s.grid}>
            {displayVehicles.map((vehicle) => {
              const imageUrl = getPrimaryImage(vehicle);
              const totalPrice = rentalDays
                ? formatVND(vehicle.price_per_day * rentalDays)
                : null;
              const avail = vehicle.is_available;
              const isFav = favoriteIds.has(vehicle.id);
              const isPending = pendingIds.has(vehicle.id);

              return (
                <div key={vehicle.id} style={s.card} className="dsxe-card">
                  <div style={s.imgWrap}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={vehicle.name} style={s.img} />
                    ) : (
                      <div style={s.noImg}>🏍️</div>
                    )}

                    {/* Nút tim */}
                    <button
                      style={{
                        ...s.favBtn,
                        ...(isFav ? s.favBtnActive : {}),
                        ...(isPending ? { opacity: 0.6 } : {}),
                      }}
                      onClick={(e) => toggleFavorite(e, vehicle.id)}
                      title={
                        !isLoggedIn
                          ? 'Đăng nhập để yêu thích'
                          : isFav
                            ? 'Bỏ yêu thích'
                            : 'Thêm vào yêu thích'
                      }
                      className="dsxe-fav-btn"
                      disabled={isPending}
                    >
                      {isPending ? '⏳' : isFav ? '❤️' : '🤍'}
                    </button>

                    {/* Badge trạng thái — góc trái */}
                    <div style={{ ...s.statusBadge, ...(avail ? s.badgeAvail : s.badgeUnavail) }}>
                      {avail ? '● Còn xe' : '● Hết xe'}
                    </div>

                    {!avail && <div style={s.imgOverlay} />}
                  </div>

                  <div style={s.cardBody}>
                    <div style={s.tagRow}>
                      {vehicle.brand?.name && (
                        <span style={s.tag}>{vehicle.brand.name}</span>
                      )}
                      {vehicle.category?.name && (
                        <span style={{ ...s.tag, ...s.tagBlue }}>{vehicle.category.name}</span>
                      )}
                    </div>

                    <h3 style={s.cardName}>{vehicle.name}</h3>
                    <p style={s.plate}>🚗 {vehicle.license_plate || '---'}</p>

                    <div style={s.priceRow}>
                      <span style={s.price}>{formatVND(vehicle.price_per_day)}đ</span>
                      <span style={s.priceUnit}>/ngày</span>
                    </div>

                    {totalPrice && avail && (
                      <div style={s.totalRow}>
                        Tổng {rentalDays} ngày:{' '}
                        <strong style={{ color: '#b45309' }}>{totalPrice}đ</strong>
                      </div>
                    )}

                    <button
                      style={{ ...s.btn, ...(avail ? s.btnActive : s.btnDisabled) }}
                      disabled={!avail}
                      onClick={() => avail && goToDetail(vehicle)}
                    >
                      {avail ? 'Xem chi tiết & Đặt xe →' : 'Không còn trống'}
                    </button>
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

/* ===== STYLES ===== */
const s = {
  page: { minHeight: '100vh', backgroundColor: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif" },

  hero: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 60%, #1a3350 100%)',
    padding: '48px 20px 52px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroInner: { position: 'relative', zIndex: 1 },
  heroSub: { color: '#93c5fd', fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' },
  heroTitle: { color: '#fff', fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' },

  container: { maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 60px' },

  filterCard: {
    background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px',
    boxShadow: '0 4px 24px rgba(30,58,95,0.08)', border: '1px solid #e8edf5',
  },
  filterRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' },

  searchWrapper: { flex: 2, minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '14px', fontSize: '16px', pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '11px 14px 11px 42px', fontSize: '14px',
    border: '1.5px solid #dde3ed', borderRadius: '10px', outline: 'none',
    backgroundColor: '#fafbfd', boxSizing: 'border-box',
  },
  select: {
    flex: 1, minWidth: '150px', padding: '11px 14px', fontSize: '14px',
    border: '1.5px solid #dde3ed', borderRadius: '10px', outline: 'none',
    backgroundColor: '#fafbfd', cursor: 'pointer', appearance: 'auto',
  },

  divider: { height: '1px', background: '#eef0f5', margin: '20px 0' },

  dateSection: {},
  dateSectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  calIcon: { fontSize: '16px' },
  dateRow: { display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' },
  dateGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '170px' },
  dateLabel: { fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' },
  dateInput: {
    padding: '11px 14px', fontSize: '14px', border: '1.5px solid #dde3ed',
    borderRadius: '10px', outline: 'none', color: '#1f2937', backgroundColor: '#fafbfd',
    cursor: 'pointer', width: '100%', boxSizing: 'border-box',
  },
  arrowWrap: { display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' },
  arrow: { fontSize: '20px', color: '#94a3b8', fontWeight: 300 },
  daysBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '8px 18px', background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)',
    color: '#fff', borderRadius: '12px', alignSelf: 'flex-end', minWidth: '70px',
  },
  daysNum: { fontSize: '22px', fontWeight: 800, lineHeight: 1 },
  daysTxt: { fontSize: '11px', fontWeight: 500, opacity: 0.8 },
  clearBtn: {
    alignSelf: 'flex-end', padding: '10px 16px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', background: '#fff', color: '#9ca3af',
    fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  filterNotice: {
    marginTop: '16px', padding: '12px 16px', backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#166534',
    display: 'flex', gap: '8px', alignItems: 'center',
  },
  noticeIcon: { fontSize: '16px' },

  resultsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  resultsCount: { fontSize: '15px', color: '#374151' },
  rentalInfo: { padding: '5px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '20px', fontSize: '13px', fontWeight: 600 },

  stateBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', gap: '16px' },
  stateMsg: { fontSize: '16px', color: '#6b7280', margin: 0 },
  spinner: {
    width: '40px', height: '40px', border: '3px solid #e5e7eb',
    borderTop: '3px solid #1e3a5f', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  resetBtn: {
    padding: '10px 24px', backgroundColor: '#1e3a5f', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },

  card: {
    backgroundColor: '#fff', borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(30,58,95,0.08)',
    overflow: 'hidden', border: '1px solid #eaeff6',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  imgWrap: { position: 'relative', width: '100%', height: '185px', backgroundColor: '#f1f4f9', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#cbd5e1' },
  imgOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.35)' },

  // Nút tim — góc phải trên
  favBtn: {
    position: 'absolute', top: '10px', right: '10px',
    width: '34px', height: '34px', borderRadius: '50%',
    border: 'none', backgroundColor: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    transition: 'transform 0.15s, background-color 0.15s',
    zIndex: 2, padding: 0, lineHeight: 1,
  },
  favBtnActive: {
    backgroundColor: 'rgba(255,228,228,0.95)',
  },

  // Badge trạng thái — góc trái trên
  statusBadge: {
    position: 'absolute', top: '12px', left: '12px',
    padding: '4px 11px', borderRadius: '20px',
    fontSize: '12px', fontWeight: 700, backdropFilter: 'blur(6px)',
  },
  badgeAvail: { backgroundColor: 'rgba(220,252,231,0.92)', color: '#15803d' },
  badgeUnavail: { backgroundColor: 'rgba(254,226,226,0.92)', color: '#b91c1c' },

  cardBody: { padding: '16px 18px 18px' },
  tagRow: { display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' },
  tag: { padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#f1f5f9', color: '#475569', letterSpacing: '0.3px' },
  tagBlue: { background: '#eff6ff', color: '#2563eb' },
  cardName: { fontSize: '16px', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0', lineHeight: 1.3 },
  plate: { fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '4px', margin: '0 0 6px 0' },
  price: { fontSize: '20px', fontWeight: 800, color: '#1e3a5f' },
  priceUnit: { fontSize: '13px', color: '#94a3b8' },
  totalRow: { fontSize: '13px', color: '#6b7280', marginBottom: '14px' },
  btn: { width: '100%', padding: '11px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '6px', transition: 'all 0.2s' },
  btnActive: { backgroundColor: '#1e3a5f', color: '#fff' },
  btnDisabled: { backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' },
};

if (typeof document !== 'undefined' && !document.getElementById('dsxe-styles')) {
  const style = document.createElement('style');
  style.id = 'dsxe-styles';
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .dsxe-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(30,58,95,0.14) !important; }
    .dsxe-card:hover img { transform: scale(1.04); }
    .dsxe-fav-btn:hover { transform: scale(1.18) !important; }
    .dsxe-fav-btn:active { transform: scale(0.92) !important; }
  `;
  document.head.appendChild(style);
}

export default DanhSachXe;