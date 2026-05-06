// File: src/pages/GioiThieu.jsx
const GioiThieu = () => {
  return (
    <div style={styles.container}>

      <div style={styles.headerSection}>
        <h1 style={styles.title}>VỀ CHÚNG TÔI</h1>
        <div style={styles.blueLine}></div>
        <p style={styles.subtitle}>
          Dịch vụ thuê xe uy tín — đa dạng phương tiện, giá minh bạch, thủ tục nhanh gọn.
        </p>
      </div>

      <div style={styles.contentWrapper}>
        <div style={styles.textContent}>
          <h2 style={styles.heading}>Di chuyển dễ dàng — Trải nghiệm trọn vẹn</h2>
          <p style={styles.paragraph}>
            Ra đời từ nhu cầu thực tế của người dùng, chúng tôi cung cấp dịch vụ{' '}
            <strong>thuê xe máy và xe đạp điện</strong> với đa dạng chủng loại, phù hợp cho
            cả di chuyển hằng ngày lẫn những chuyến dã ngoại cuối tuần.
          </p>
          <p style={styles.paragraph}>
            Khác với các mô hình truyền thống, chúng tôi vận hành hoàn toàn trực tuyến — đặt
            xe, xác nhận và thanh toán chỉ trong vài phút. Đội ngũ kiểm định kỹ thuật đảm bảo
            mỗi chiếc xe đến tay bạn đều trong tình trạng tốt nhất, an toàn nhất.
          </p>
          <p style={styles.paragraph}>
            Từ những mẫu xe số tiết kiệm nhiên liệu đến xe ga cao cấp hay xe điện thân thiện
            môi trường, chúng tôi cam kết mang đến sự lựa chọn phong phú với mức giá{' '}
            <em>rõ ràng, không phát sinh</em>.
          </p>

          <h3 style={styles.subHeading}>Cam kết của chúng tôi:</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✔</span>
              <div><strong>Xe chất lượng cao:</strong> Kiểm tra kỹ thuật định kỳ, bảo dưỡng thường xuyên trước mỗi lần cho thuê.</div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✔</span>
              <div><strong>Giá minh bạch:</strong> Niêm yết giá rõ ràng theo ngày, không phí ẩn, không phát sinh ngoài hợp đồng.</div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✔</span>
              <div><strong>Thủ tục nhanh gọn:</strong> Đặt xe online 24/7, xác nhận trong vòng 15 phút, nhận xe tận nơi hoặc tại điểm.</div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✔</span>
              <div><strong>Hỗ trợ tận tâm:</strong> Đội ngũ hỗ trợ khách hàng sẵn sàng giải đáp mọi thắc mắc trong suốt hành trình.</div>
            </li>
          </ul>
        </div>

        <div style={styles.imageContent}>
          <img
            src="/images/gioithieu.jpg"
            alt="Dịch vụ thuê xe"
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://placehold.co/500x400/1e3a5f/FFF?text=Thue+Xe';
            }}
          />
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
    fontStyle: 'italic',
  },
  contentWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '50px',
    alignItems: 'flex-start',
  },
  textContent: { flex: '1 1 500px' },
  heading: {
    fontSize: '22px',
    color: '#1e3a5f',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  subHeading: {
    fontSize: '18px',
    color: '#333',
    marginTop: '30px',
    marginBottom: '15px',
  },
  paragraph: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.7',
    marginBottom: '15px',
    textAlign: 'justify',
  },
  list: { listStyleType: 'none', padding: 0, margin: 0 },
  listItem: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    lineHeight: '1.5',
  },
  checkIcon: {
    color: '#1e3a5f',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '2px',
  },
  imageContent: {
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
};

export default GioiThieu;