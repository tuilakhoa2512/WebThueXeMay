import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DanhGia = () => {
    const navigate = useNavigate();
    const { id: rentalId } = useParams();
    const { state } = useLocation();
    const vehicle = state?.vehicle || null;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [done, setDone] = useState(false);

    const getPrimaryImage = (v) => {
        const images = v?.images || [];
        return images.find((img) => img.is_primary)?.url || images[0]?.url || null;
    };

    const imageUrl = getPrimaryImage(vehicle);

    const ratingLabels = {
        1: 'Rất tệ',
        2: 'Tệ',
        3: 'Bình thường',
        4: 'Tốt',
        5: 'Tuyệt vời',
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            setMsg('❌ Vui lòng chọn số sao đánh giá.');
            return;
        }
        if (!comment.trim()) {
            setMsg('❌ Vui lòng nhập nhận xét của bạn.');
            return;
        }

        setSubmitting(true);
        setMsg('');

        try {
            // TODO: thay bằng hàm API thực tế của bạn, ví dụ:
            // await guidanhgia({ rental_id: rentalId, rating, comment });

            // Giả lập gọi API thành công
            await new Promise((res) => setTimeout(res, 800));

            setDone(true);
        } catch (err) {
            setMsg('❌ ' + (err.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.card}>
                    <div style={styles.successIcon}>🎉</div>
                    <h2 style={styles.successTitle}>Cảm ơn bạn đã đánh giá!</h2>
                    <p style={styles.successSub}>Nhận xét của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                        <button style={styles.btnPrimary} onClick={() => navigate('/don-thue')}>
                            Về danh sách đơn thuê
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.cardHeader}>
                    <button style={styles.backBtn} onClick={() => navigate(-1)}>← Quay lại</button>
                    <h2 style={styles.cardTitle}>Đánh giá chuyến thuê xe</h2>
                    <p style={styles.cardSub}>Mã đơn: <strong>#{rentalId}</strong></p>
                </div>

                <hr style={styles.hr} />

                {/* Thông tin xe */}
                {vehicle && (
                    <div style={styles.vehicleRow}>
                        {imageUrl ? (
                            <img src={imageUrl} alt={vehicle.name} style={styles.vehicleImg}
                                onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                            <div style={styles.vehicleNoImg}>🏍️</div>
                        )}
                        <div>
                            <h3 style={styles.vehicleName}>{vehicle.name || '---'}</h3>
                            <p style={styles.vehicleMeta}>{vehicle.brand?.name} · {vehicle.category?.name}</p>
                            <p style={styles.vehicleMeta}>🚗 {vehicle.license_plate || '---'}</p>
                        </div>
                    </div>
                )}

                <hr style={styles.hr} />

                {/* Chọn sao */}
                <div style={styles.section}>
                    <label style={styles.sectionLabel}>Mức độ hài lòng</label>
                    <div style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                style={{
                                    ...styles.star,
                                    color: star <= (hoverRating || rating) ? '#f59e0b' : '#d1d5db',
                                }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                        {(hoverRating || rating) > 0 && (
                            <span style={styles.ratingLabel}>
                                {ratingLabels[hoverRating || rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Nhận xét */}
                <div style={styles.section}>
                    <label style={styles.sectionLabel}>Nhận xét của bạn</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về xe, dịch vụ, tình trạng xe..."
                        maxLength={1000}
                        style={styles.textarea}
                    />
                    <p style={styles.charCount}>{comment.length} / 1000</p>
                </div>

                {/* Thông báo lỗi */}
                {msg && (
                    <p style={{ fontSize: '14px', color: '#a00', marginBottom: '12px' }}>{msg}</p>
                )}

                {/* Nút gửi */}
                <button
                    style={{ ...styles.btnPrimary, opacity: submitting ? 0.7 : 1 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Đang gửi...' : '⭐ GỬI ĐÁNH GIÁ'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        maxWidth: '680px', margin: '40px auto', padding: '0 20px', minHeight: '70vh',
    },
    card: {
        backgroundColor: '#fff', borderRadius: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '32px',
    },
    cardHeader: { marginBottom: '4px' },
    backBtn: {
        background: 'none', border: 'none', color: '#1e3a5f',
        cursor: 'pointer', fontSize: '14px', padding: '0 0 12px 0',
        fontWeight: 'bold',
    },
    cardTitle: { margin: '0 0 6px 0', fontSize: '22px', color: '#1e3a5f' },
    cardSub: { margin: 0, fontSize: '14px', color: '#777' },
    hr: { border: 'none', borderBottom: '1px solid #eee', margin: '20px 0' },

    // Xe
    vehicleRow: { display: 'flex', gap: '16px', alignItems: 'center' },
    vehicleImg: {
        width: '100px', height: '75px', objectFit: 'cover',
        borderRadius: '8px', border: '1px solid #eee', flexShrink: 0,
    },
    vehicleNoImg: {
        width: '100px', height: '75px', backgroundColor: '#f3f4f6',
        borderRadius: '8px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '32px', flexShrink: 0,
    },
    vehicleName: { margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f' },
    vehicleMeta: { margin: '0 0 4px 0', fontSize: '13px', color: '#777' },

    // Sections
    section: { marginBottom: '24px' },
    sectionLabel: { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '10px' },

    // Stars
    starsRow: { display: 'flex', alignItems: 'center', gap: '6px' },
    star: {
        fontSize: '40px', cursor: 'pointer', transition: 'color 0.15s', userSelect: 'none', lineHeight: 1,
    },
    ratingLabel: {
        fontSize: '14px', color: '#f59e0b', fontWeight: 'bold', marginLeft: '8px',
    },

    // Textarea
    textarea: {
        width: '100%', minHeight: '130px', padding: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', resize: 'vertical', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit', color: '#333',
    },
    charCount: { textAlign: 'right', fontSize: '12px', color: '#aaa', margin: '4px 0 0 0' },

    // Buttons
    btnPrimary: {
        width: '100%', padding: '13px', backgroundColor: '#1e3a5f',
        color: '#fff', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
    },

    // Success
    successIcon: { fontSize: '64px', textAlign: 'center', marginBottom: '16px' },
    successTitle: { textAlign: 'center', fontSize: '22px', color: '#1e3a5f', margin: '0 0 8px 0' },
    successSub: { textAlign: 'center', fontSize: '14px', color: '#777', margin: 0 },
};

export default DanhGia;