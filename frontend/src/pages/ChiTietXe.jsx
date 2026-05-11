// File: src/pages/ChiTietXe.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { API_URL } from '../apiConfig';
import { useVehicle } from '../context/VehicleContext';

const ChiTietXe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadVehicleById } = useVehicle();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError] = useState(false);

  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');
  const [isAvailable, setIsAvailable] = useState(null);
  const [booking, setBooking] = useState({ loading: false, error: '', success: false });

  // ===== MỚI: phương thức thanh toán =====
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'transfer'

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchVehicle(startDate, endDate);
  }, [id]);

  useEffect(() => {
    if (!vehicle) return;
    checkAvailability(startDate, endDate);
  }, [startDate, endDate]);

  const fetchVehicle = async (sd, ed) => {
    setLoading(true);
    setError('');
    try {
      const data = await loadVehicleById(id);
      if (!data) throw new Error('Không tìm thấy xe');
      setVehicle(data);
      if (sd && ed) {
        await checkAvailability(sd, ed, data.id);
      } else {
        setIsAvailable(data.status === 0);
      }
      const primary = data.images?.find((img) => img.is_primary) || data.images?.[0];
      setSelectedImage(primary?.url || null);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin xe.');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (sd, ed) => {
    if (!sd || !ed) {
      setIsAvailable(vehicle?.status === 0);
      return;
    }
    try {
      console.log(startDate, endDate);
      const query = new URLSearchParams({ start_date: sd, end_date: ed });
      const res = await fetch(`http://127.0.0.1:8000/api/vehicles/available?${query.toString()}`);
      const data = await res.json();
      const found = data.find(v => v.id == id);
      setIsAvailable(!!found);
    } catch {
      // giữ nguyên giá trị cũ nếu lỗi
    }
  };

  const days = (() => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  })();
  const total = days * (vehicle?.price_per_day || 0);

  const formatPrice = (price) =>
    price != null ? `${Number(price).toLocaleString('vi-VN')} đ` : 'Liên hệ';

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setBooking(b => ({ ...b, error: 'Vui lòng chọn ngày bắt đầu và ngày kết thúc.' }));
      return;
    }
    if (days <= 0) {
      setBooking(b => ({ ...b, error: 'Ngày kết thúc phải sau ngày bắt đầu.' }));
      return;
    }

    // ===== CHUYỂN KHOẢN: chuyển sang trang QR =====
    if (paymentMethod === 'transfer') {
      navigate('/thanh-toan-qr', {
        state: {
          vehicle,
          startDate,
          endDate,
          days,
          total,
        }
      });
      return;
    }

    // ===== TIỀN MẶT: tạo đơn thuê luôn =====
    try {
      setBooking(b => ({ ...b, loading: true, error: '' }));
      const res = await fetch(`${API_URL}/rentals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          start_date: startDate,
          end_date: endDate,
          payment_method: 'cash',
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setBooking(b => ({ ...b, error: data.message || 'Không thể đặt xe' }));
        return;
      }
      setBooking(b => ({ ...b, success: 'Đặt xe thành công!', error: '' }));
    } catch {
      setBooking(b => ({ ...b, error: 'Lỗi kết nối server' }));
    } finally {
      setBooking(b => ({ ...b, loading: false }));
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    const qs = params.toString();
    navigate(`/xe${qs ? `?${qs}` : ''}`);
  };

  if (loading) return (
    <div style={st.fullCenter}>
      <div style={st.spinner} />
      <p style={st.loadingTxt}>Đang tải thông tin xe...</p>
    </div>
  );
  if (error) return (
    <div style={st.fullCenter}>
      <span style={{ fontSize: '48px' }}>⚠️</span>
      <p style={{ color: '#dc2626', fontSize: '16px' }}>{error}</p>
      <button style={st.backBtnSm} onClick={() => navigate('/xe')}>← Quay lại</button>
    </div>
  );
  if (!vehicle) return (
    <div style={st.fullCenter}>
      <p style={{ color: '#6b7280' }}>Xe không tồn tại!</p>
    </div>
  );

  const { name, license_plate, price_per_day, description, category, brand, images = [] } = vehicle;
  const avail = isAvailable !== null ? isAvailable : vehicle.is_available;
  const displayImage = (!imgError && selectedImage) || 'https://placehold.co/700x480/1e3a5f/FFF?text=Chua+Co+Anh';
  const hasDateFilter = !!(startDate && endDate && days > 0);

  return (
    <div style={st.page}>

      {/* Breadcrumb */}
      <div style={st.breadcrumb}>
        <span style={st.breadLink} onClick={handleBack}>← Danh sách xe</span>
        <span style={st.breadSep}>/</span>
        <span style={st.breadCurrent}>{name}</span>
      </div>

      <div style={st.container}>
        <div style={st.topGrid}>

          {/* ===== CỘT ẢNH ===== */}
          <div style={st.imageCol}>
            <div style={st.mainImgWrap}>
              <img
                src={displayImage}
                alt={name}
                style={st.mainImg}
                onError={() => setImgError(true)}
              />
              {!avail && (
                <div style={st.unavailOverlay}>
                  <span style={st.unavailText}>Hết xe</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={st.thumbRow}>
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={name}
                    style={{ ...st.thumb, ...(selectedImage === img.url ? st.thumbActive : {}) }}
                    onClick={() => { setSelectedImage(img.url); setImgError(false); }}
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e3a5f/FFF?text=Loi'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ===== CỘT THÔNG TIN ===== */}
          <div style={st.infoCol}>

            <div style={st.tagRow}>
              {brand?.name && <span style={st.tag}>{brand.name}</span>}
              {category?.name && <span style={{ ...st.tag, ...st.tagBlue }}>{category.name}</span>}
              <span style={{ ...st.tag, ...(avail ? st.tagGreen : st.tagRed) }}>
                {avail ? '● Còn xe' : '● Hết xe'}
              </span>
            </div>

            <h1 style={st.title}>{name}</h1>
            <div style={st.titleBar} />

            {license_plate && (
              <p style={st.plate}>🚗 Biển số: <strong>{license_plate}</strong></p>
            )}

            <p style={st.desc}>{description || 'Thông tin mô tả xe đang được cập nhật.'}</p>

            <div style={st.priceBlock}>
              <span style={st.price}>{formatPrice(price_per_day)}</span>
              <span style={st.priceSub}> / ngày</span>
            </div>

            {/* ===== BOOKING BOX ===== */}
            <div style={st.bookingBox}>
              <div style={st.bookingTitle}>🗓️ Chọn thời gian thuê</div>

              {startDate && endDate && (
                <div style={st.prefillNote}>
                  📋 Ngày được chọn sẵn từ trang danh sách
                </div>
              )}

              <div style={st.dateRow}>
                <div style={st.dateField}>
                  <label style={st.dateLabel}>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    style={st.dateInput}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value >= endDate) setEndDate('');
                      setBooking({ loading: false, error: '', success: false });
                    }}
                  />
                </div>
                <div style={st.dateField}>
                  <label style={st.dateLabel}>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    disabled={!startDate}
                    style={{
                      ...st.dateInput,
                      opacity: !startDate ? 0.5 : 1,
                      cursor: !startDate ? 'not-allowed' : 'pointer',
                    }}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setBooking({ loading: false, error: '', success: false });
                    }}
                  />
                </div>
              </div>

              {hasDateFilter && (
                <div style={st.summary}>
                  <span style={st.summaryLeft}>
                    {days} ngày × {formatPrice(price_per_day)}
                  </span>
                  <strong style={st.summaryTotal}>{formatPrice(total)}</strong>
                </div>
              )}

              {/* ===== MỚI: CHỌN PHƯƠNG THỨC THANH TOÁN ===== */}
              <div>
                <div style={st.payLabel}>💳 Phương thức thanh toán</div>
                <div style={st.payMethodRow}>
                  <div
                    style={{ ...st.payCard, ...(paymentMethod === 'cash' ? st.payCardActive : {}) }}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div style={st.payIcon}>💵</div>
                    <div style={st.payName}>Tiền mặt</div>
                    <div style={st.payDesc}>Thanh toán khi nhận xe</div>
                    <div style={{ ...st.payRadio, ...(paymentMethod === 'cash' ? st.payRadioActive : {}) }} />
                  </div>
                  <div
                    style={{ ...st.payCard, ...(paymentMethod === 'transfer' ? st.payCardActive : {}) }}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <div style={st.payIcon}>🏦</div>
                    <div style={st.payName}>Chuyển khoản</div>
                    <div style={st.payDesc}>Quét mã QR ngân hàng</div>
                    <div style={{ ...st.payRadio, ...(paymentMethod === 'transfer' ? st.payRadioActive : {}) }} />
                  </div>
                </div>
              </div>

              {hasDateFilter && !avail && (
                <div style={st.alertUnavail}>
                  ⚠️ <strong>Xe đã được đặt</strong> trong khoảng thời gian này. Vui lòng chọn ngày khác.
                </div>
              )}

              {booking.error && <p style={st.msgError}>{booking.error}</p>}
              {booking.success && (
                <p style={st.msgSuccess}>
                  ✅ Đặt xe thành công!{' '}
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => navigate('/don-thue')}
                  >
                    Xem đơn thuê
                  </span>
                </p>
              )}

              <div style={st.actions}>
                <button
                  onClick={handleBooking}
                  disabled={!avail || booking.loading || !hasDateFilter}
                  style={{
                    ...st.rentBtn,
                    ...(!avail || booking.loading || !hasDateFilter ? st.rentBtnDisabled : {}),
                    ...(paymentMethod === 'transfer' && avail && hasDateFilter ? st.rentBtnTransfer : {}),
                  }}
                >
                  {booking.loading
                    ? '⏳ Đang xử lý...'
                    : !avail
                      ? '✗ Hết xe trong thời gian này'
                      : !hasDateFilter
                        ? 'Chọn ngày để đặt xe'
                        : paymentMethod === 'transfer'
                          ? '🏦 Tiếp tục thanh toán QR'
                          : '🚘 THUÊ XE NGAY'}
                </button>
                <button onClick={handleBack} style={st.backBtn}>
                  ← Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== THÔNG TIN CHI TIẾT ===== */}
        <div style={st.detailSection}>
          <h2 style={st.detailTitle}>Thông tin xe</h2>
          <div style={st.detailGrid}>
            <div style={st.detailCard}>
              <h3 style={st.detailCardTitle}>📋 Thông số</h3>
              <table style={st.specTable}>
                <tbody>
                  {brand?.name && (
                    <tr style={st.specRow}>
                      <td style={st.specKey}>Thương hiệu</td>
                      <td style={st.specVal}>{brand.name}</td>
                    </tr>
                  )}
                  {category?.name && (
                    <tr style={st.specRow}>
                      <td style={st.specKey}>Loại xe</td>
                      <td style={st.specVal}>{category.name}</td>
                    </tr>
                  )}
                  {license_plate && (
                    <tr style={st.specRow}>
                      <td style={st.specKey}>Biển số</td>
                      <td style={st.specVal}>{license_plate}</td>
                    </tr>
                  )}
                  <tr style={st.specRow}>
                    <td style={st.specKey}>Giá thuê</td>
                    <td style={{ ...st.specVal, color: '#1e3a5f', fontWeight: 700 }}>
                      {formatPrice(price_per_day)} / ngày
                    </td>
                  </tr>
                  <tr style={st.specRow}>
                    <td style={st.specKey}>Trạng thái</td>
                    <td style={{ ...st.specVal, color: avail ? '#15803d' : '#dc2626', fontWeight: 600 }}>
                      {avail ? '✓ Còn xe' : '✗ Hết xe'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={st.detailCard}>
              <h3 style={st.detailCardTitle}>📝 Mô tả</h3>
              <p style={st.descTxt}>
                {description || 'Thông tin mô tả xe đang được cập nhật từ cơ sở dữ liệu.'}
              </p>
              {hasDateFilter && (
                <div style={st.rentalSummaryBox}>
                  <div style={st.rentalSummaryTitle}>🗒️ Tóm tắt thuê xe</div>
                  <div style={st.rentalRow}>
                    <span>Ngày nhận:</span>
                    <strong>{new Date(startDate).toLocaleDateString('vi-VN')}</strong>
                  </div>
                  <div style={st.rentalRow}>
                    <span>Ngày trả:</span>
                    <strong>{new Date(endDate).toLocaleDateString('vi-VN')}</strong>
                  </div>
                  <div style={st.rentalRow}>
                    <span>Phương thức:</span>
                    <strong>{paymentMethod === 'cash' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}</strong>
                  </div>
                  <div style={{ ...st.rentalRow, ...st.rentalTotalRow }}>
                    <span>Tổng dự kiến ({days} ngày):</span>
                    <strong style={{ color: '#b45309' }}>{formatPrice(total)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const st = {
  fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' },
  spinner: { width: '44px', height: '44px', border: '4px solid #e5e7eb', borderTop: '4px solid #1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingTxt: { color: '#6b7280', fontSize: '16px' },
  backBtnSm: { padding: '8px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },

  page: { minHeight: '100vh', backgroundColor: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif" },

  breadcrumb: { background: '#fff', borderBottom: '1px solid #eaeff6', padding: '14px 40px', display: 'flex', alignItems: 'center', gap: '10px' },
  breadLink: { fontSize: '14px', color: '#1e3a5f', cursor: 'pointer', fontWeight: 600 },
  breadSep: { color: '#cbd5e1', fontSize: '14px' },
  breadCurrent: { fontSize: '14px', color: '#94a3b8' },

  container: { maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 60px' },
  topGrid: { display: 'flex', flexWrap: 'wrap', gap: '48px', marginBottom: '56px' },

  imageCol: { flex: '1 1 440px' },
  mainImgWrap: { position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #eaeff6', marginBottom: '12px', backgroundColor: '#f1f4f9' },
  mainImg: { width: '100%', maxHeight: '440px', objectFit: 'cover', display: 'block' },
  unavailOverlay: { position: 'absolute', inset: 0, background: 'rgba(17,17,17,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  unavailText: { color: '#fff', fontSize: '28px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' },
  thumbRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  thumb: { width: '80px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0', cursor: 'pointer' },
  thumbActive: { borderColor: '#1e3a5f', boxShadow: '0 0 0 2px #93c5fd' },

  infoCol: { flex: '1 1 400px', display: 'flex', flexDirection: 'column' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' },
  tag: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#f1f5f9', color: '#475569' },
  tagBlue: { background: '#eff6ff', color: '#2563eb' },
  tagGreen: { background: '#f0fdf4', color: '#15803d' },
  tagRed: { background: '#fef2f2', color: '#b91c1c' },

  title: { fontSize: '30px', fontWeight: 800, color: '#1e293b', margin: '0 0 12px 0', lineHeight: 1.25 },
  titleBar: { width: '50px', height: '3px', background: '#1e3a5f', borderRadius: '2px', marginBottom: '18px' },
  plate: { fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' },
  desc: { fontSize: '15px', color: '#64748b', lineHeight: 1.75, margin: '0 0 18px 0' },
  priceBlock: { margin: '0 0 24px 0' },
  price: { fontSize: '36px', fontWeight: 800, color: '#1e3a5f' },
  priceSub: { fontSize: '16px', color: '#94a3b8', fontWeight: 400 },

  bookingBox: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' },
  bookingTitle: { fontSize: '15px', fontWeight: 700, color: '#374151' },
  prefillNote: { padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '13px', color: '#1d4ed8', fontWeight: 500 },
  dateRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  dateField: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' },
  dateLabel: { fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.4px' },
  dateInput: { padding: '11px 13px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1f2937', cursor: 'pointer', backgroundColor: '#fff', boxSizing: 'border-box', width: '100%' },
  summary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', color: '#374151' },
  summaryLeft: { color: '#374151' },
  summaryTotal: { fontSize: '18px', color: '#1e3a5f' },

  // ===== MỚI: payment method styles =====
  payLabel: { fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' },
  payMethodRow: { display: 'flex', gap: '10px' },
  payCard: {
    flex: 1, position: 'relative', padding: '14px 12px', border: '2px solid #e2e8f0',
    borderRadius: '12px', cursor: 'pointer', background: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'all 0.18s', userSelect: 'none',
  },
  payCardActive: { borderColor: '#1e3a5f', background: '#eff6ff', boxShadow: '0 0 0 3px #bfdbfe55' },
  payIcon: { fontSize: '24px' },
  payName: { fontSize: '13px', fontWeight: 700, color: '#1e293b' },
  payDesc: { fontSize: '11px', color: '#94a3b8', textAlign: 'center' },
  payRadio: { width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #cbd5e1', marginTop: '6px', transition: 'all 0.18s' },
  payRadioActive: { border: '4px solid #1e3a5f', background: '#fff' },

  alertUnavail: { padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', fontSize: '14px', color: '#b91c1c', lineHeight: 1.5 },
  msgError: { color: '#dc2626', fontSize: '14px', margin: 0 },
  msgSuccess: { color: '#15803d', fontSize: '14px', margin: 0 },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  rentBtn: { flex: 1, minWidth: '160px', padding: '14px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' },
  rentBtnDisabled: { background: '#cbd5e1', cursor: 'not-allowed', color: '#64748b' },
  rentBtnTransfer: { background: '#0369a1' },
  backBtn: { padding: '14px 24px', background: '#fff', color: '#1e3a5f', border: '2px solid #1e3a5f', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },

  detailSection: { borderTop: '1px solid #eaeff6', paddingTop: '40px' },
  detailTitle: { fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  detailCard: { background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #eaeff6', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' },
  detailCardTitle: { fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' },
  specTable: { width: '100%', borderCollapse: 'collapse' },
  specRow: { borderBottom: '1px solid #f1f5f9' },
  specKey: { padding: '10px 12px 10px 0', fontSize: '14px', color: '#6b7280', fontWeight: 600, width: '45%', verticalAlign: 'middle' },
  specVal: { padding: '10px 0', fontSize: '14px', color: '#1e293b', verticalAlign: 'middle' },
  descTxt: { fontSize: '15px', color: '#64748b', lineHeight: 1.75, margin: '0 0 20px 0' },
  rentalSummaryBox: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '16px' },
  rentalSummaryTitle: { fontSize: '14px', fontWeight: 700, color: '#92400e', marginBottom: '12px' },
  rentalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151', marginBottom: '8px' },
  rentalTotalRow: { borderTop: '1px solid #fde68a', paddingTop: '10px', marginTop: '4px', fontWeight: 700 },
};

if (typeof document !== 'undefined' && !document.getElementById('ctxe-styles')) {
  const style = document.createElement('style');
  style.id = 'ctxe-styles';
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export default ChiTietXe;