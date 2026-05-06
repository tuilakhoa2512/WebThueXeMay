// File: src/pages/ThanhToan.jsx
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ThanhToan = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    paymentMethod: 'COD',
  });

  const shippingFee = cartTotal > 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated || !user) {
      setError('Vui lòng đăng nhập để đặt hàng.');
      navigate('/dang-nhap');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    setLoading(true);

    try {

      const addressData = await taodiachi({
        addressDetail: formData.address,
        latitude: 0,
        longitude: 0,
      });

      const addressId = addressData?.data?.id ?? addressData?.data?.Id;
      if (!addressId) {
        throw new Error(addressData?.message || 'Không nhận được ID địa chỉ từ server.');
      }

      // Create order
      const orderData = await thanhtoandonhang({
        userId: user.id,
        addressId,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });

      const orderId = orderData?.data?.id;

      clearCart();
      alert('Đặt hàng thành công!');
      navigate(`/lich-su-don-hang/${orderId}`);
    } catch (err) {
      setError(err.message || 'Lỗi kết nối server. Vui lòng thử lại.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>THANH TOÁN</h1>

      <form onSubmit={handlePlaceOrder} style={styles.checkoutWrapper}>

        <div style={styles.leftCol}>
          <h2 style={styles.sectionTitle}>THÔNG TIN THANH TOÁN</h2>
          {error && <div style={{ color: '#d00', marginBottom: '20px', padding: '12px', backgroundColor: '#fdecea', borderRadius: '4px' }}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Họ và tên người nhận *</label>
            <input
              type="text"
              placeholder="Nhập họ tên đầy đủ"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.rowInput}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Số điện thoại *</label>
              <input
                type="tel"
                placeholder="Ví dụ: 0912345678"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Địa chỉ Email</label>
              <input
                type="email"
                placeholder="Để nhận hóa đơn"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Địa chỉ giao hàng chi tiết *</label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Ghi chú đơn hàng</label>
            <textarea
              placeholder="Ghi chú về giao hàng, ví dụ: Giao giờ hành chính..."
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              style={styles.textarea}
              rows="4"
            ></textarea>
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.orderBox}>
            <h2 style={styles.sectionTitle}>ĐƠN HÀNG CỦA BẠN</h2>

            <table style={styles.orderTable}>
              <thead>
                <tr>
                  <th style={styles.thLeft}>SẢN PHẨM</th>
                  <th style={styles.thRight}>TẠM TÍNH</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id || item.variantId}>
                    <td style={styles.tdLeft}>
                      {item.name} <strong style={{ color: '#8B0000' }}>x {item.qty}</strong>
                    </td>
                    <td style={styles.tdRight}>
                      {(item.price * item.qty).toLocaleString('vi-VN')}₫
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={styles.tdLeft}><strong>Tạm tính giỏ hàng</strong></td>
                  <td style={styles.tdRight}><strong>{cartTotal.toLocaleString('vi-VN')}₫</strong></td>
                </tr>
                <tr>
                  <td style={styles.tdLeft}>Giao hàng</td>
                  <td style={styles.tdRight}>
                    {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...styles.tdLeft, fontSize: '18px' }}><strong>TỔNG TIỀN</strong></td>
                  <td style={{ ...styles.tdRight, fontSize: '20px', color: '#8B0000' }}>
                    <strong>{finalTotal.toLocaleString('vi-VN')}₫</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div style={styles.paymentMethods}>
              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleInputChange}
                  style={styles.radio}
                />
                <label htmlFor="cod" style={styles.radioLabel}>Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div style={styles.paymentDesc}>
                Khách hàng thanh toán bằng tiền mặt khi Shipper giao hàng tới.
              </div>

              <div style={styles.radioGroup}>
                <input
                  type="radio"
                  id="bank"
                  name="paymentMethod"
                  value="BankTransfer"
                  checked={formData.paymentMethod === 'BankTransfer'}
                  onChange={handleInputChange}
                  style={styles.radio}
                />
                <label htmlFor="bank" style={styles.radioLabel}>Chuyển khoản ngân hàng</label>
              </div>
            </div>

            <p style={styles.policyText}>
              Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và hỗ trợ trải nghiệm trên toàn bộ trang web.
            </p>

            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
              disabled={loading}
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    backgroundColor: '#fff',
    minHeight: '60vh'
  },
  pageTitle: {
    fontSize: '24px',
    color: '#8B0000',
    marginBottom: '30px',
    textTransform: 'uppercase',
    borderBottom: '2px solid #8B0000',
    paddingBottom: '10px',
    display: 'inline-block'
  },

  checkoutWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    alignItems: 'flex-start'
  },

  leftCol: {
    flex: '2 1 600px'
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  rowInput: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  mapSection: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#fcf9f2',
    border: '1px dashed #ccc',
    borderRadius: '8px'
  },

  rightCol: {
    flex: '1 1 400px'
  },
  orderBox: {
    border: '2px solid #8B0000',
    padding: '30px 20px',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd'
  },
  orderTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  },
  thLeft: {
    textAlign: 'left',
    padding: '10px 0',
    borderBottom: '2px solid #eaeaea',
    color: '#333'
  },
  thRight: {
    textAlign: 'right',
    padding: '10px 0',
    borderBottom: '2px solid #eaeaea',
    color: '#333'
  },
  tdLeft: {
    textAlign: 'left',
    padding: '15px 0',
    borderBottom: '1px solid #eaeaea',
    color: '#555',
    fontSize: '15px'
  },
  tdRight: {
    textAlign: 'right',
    padding: '15px 0',
    borderBottom: '1px solid #eaeaea',
    color: '#333',
    fontSize: '15px'
  },

  paymentMethods: {
    marginTop: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '15px',
    border: '1px solid #eaeaea',
    borderRadius: '4px'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  radio: {
    marginRight: '10px',
    transform: 'scale(1.2)',
    accentColor: '#8B0000'
  },
  radioLabel: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer'
  },
  paymentDesc: {
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    borderRadius: '4px',
    borderLeft: '3px solid #8B0000'
  },

  policyText: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '20px'
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#D16B4A',
    color: 'white',
    border: 'none',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  }
};

export default ThanhToan;