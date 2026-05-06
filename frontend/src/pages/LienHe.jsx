// File: src/pages/LienHe.jsx
const LienHe = () => {
  return (
    <div style={styles.container}>

      <div style={styles.headerSection}>
        <h1 style={styles.title}>LIÊN HỆ VỚI CHÚNG TÔI</h1>
        <div style={styles.blueLine}></div>
        <p style={styles.subtitle}>
          Để lại lời nhắn hoặc đến trực tiếp — chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>
      </div>

      <div style={styles.contactWrapper}>

        {/* Cột thông tin */}
        <div style={styles.infoCol}>
          <h2 style={styles.colTitle}>THÔNG TIN LIÊN HỆ</h2>

          <div style={styles.infoItem}>
            <strong>📍 Địa chỉ:</strong>
            <p style={styles.infoText}>180 Cao Lỗ, P4, Thành phố Hồ Chí Minh</p>
          </div>
          <div style={styles.infoItem}>
            <strong>📞 Điện thoại:</strong>
            <p style={styles.infoText}>077 744 6789</p>
          </div>
          <div style={styles.infoItem}>
            <strong>✉️ Email:</strong>
            <p style={styles.infoText}>contact@thuexe.vn</p>
          </div>
          <div style={styles.infoItem}>
            <strong>⏰ Giờ làm việc:</strong>
            <p style={styles.infoText}>
              Thứ 2 – Thứ 7: 7:30 Sáng – 18:00 Tối<br />
              Chủ nhật: 8:00 Sáng – 12:00 Trưa
            </p>
          </div>
        </div>

        {/* Cột form */}
        <div style={styles.formCol}>
          <h2 style={styles.colTitle}>GỬI LỜI NHẮN CHO CHÚNG TÔI</h2>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Họ và tên của bạn *"
              style={styles.input}
            />
            <div style={styles.rowInput}>
              <input
                type="email"
                placeholder="Email *"
                style={{ ...styles.input, flex: 1, marginBottom: 0 }}
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                style={{ ...styles.input, flex: 1, marginBottom: 0 }}
              />
            </div>
            <textarea
              placeholder="Nội dung lời nhắn..."
              style={styles.textarea}
              rows="5"
            />
            <button style={styles.submitBtn}>GỬI ĐI</button>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#fff',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '32px',
    color: '#1e3a5f',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    textTransform: 'uppercase',
  },
  blueLine: {
    width: '80px',
    height: '4px',
    backgroundColor: '#1e3a5f',
    margin: '0 auto 20px auto',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    maxWidth: '600px',
    margin: '0 auto',
  },
  contactWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    marginBottom: '60px',
  },
  infoCol: {
    flex: '1 1 350px',
    backgroundColor: '#eff6ff',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #dbeafe',
  },
  colTitle: {
    fontSize: '18px',
    color: '#1e3a5f',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  infoItem: {
    marginBottom: '18px',
    fontSize: '15px',
    color: '#333',
  },
  infoText: {
    margin: '5px 0 0 25px',
    color: '#555',
    lineHeight: '1.6',
  },
  formCol: { flex: '1 1 500px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  rowInput: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitBtn: {
    backgroundColor: '#1e3a5f',
    color: '#fff',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s',
  },
};

export default LienHe;