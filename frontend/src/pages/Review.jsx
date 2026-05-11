
const reviews = [
  {
    id: 1,
    name: "Nguyễn Minh",
    avatar: "https://i.pravatar.cc/100?img=11",
    rating: 5,
    date: "10/05/2026",
    comment: "Xe rất sạch và chạy êm. Chủ xe hỗ trợ nhiệt tình, giao xe đúng giờ.",
  },
  {
    id: 2,
    name: "Trần Quốc",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 4,
    date: "08/05/2026",
    comment: "Trải nghiệm ổn, giá hợp lý. Mong app bổ sung thêm nhiều dòng xe hơn.",
  },
  {
    id: 3,
    name: "Lê Hoàng",
    avatar: "https://i.pravatar.cc/100?img=13",
    rating: 5,
    date: "05/05/2026",
    comment: "Dịch vụ tốt, giao diện app dễ dùng và đặt xe khá nhanh.",
  },
  {
    id: 4,
    name: "Phạm Bình",
    avatar: "https://i.pravatar.cc/100?img=14",
    rating: 5,
    date: "01/05/2026",
    comment: "Rất hài lòng với dịch vụ chăm sóc khách hàng của đội ngũ.",
  },
];

export default function Review() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Đánh giá khách hàng</h1>
          <p style={styles.subtitle}>Những trải nghiệm thực tế từ cộng đồng người dùng</p>
        </div>

        <div style={styles.reviewGrid}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
              }}
            >
              <div style={styles.cardTop}>
                <img src={review.avatar} alt={review.name} style={styles.avatar} />
                <div style={styles.stars}>
                  {"★".repeat(review.rating)}
                  <span style={{ color: '#ccc' }}>{"★".repeat(5 - review.rating)}</span>
                </div>
              </div>

              <div style={styles.userInfo}>
                <h2 style={styles.name}>{review.name}</h2>
                <span style={styles.date}>{review.date}</span>
              </div>

              <p style={styles.comment}>"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    padding: "60px 20px",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  headerSection: {
    textAlign: "center",
    marginBottom: "50px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    color: "#6c757d",
    fontSize: "16px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  reviewGrid: {
    display: "grid",
    // Chia làm 4 cột đều nhau
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px", // Bo tròn góc kiểu hiện đại
    padding: "24px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(0,0,0,0.03)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "16px", // Bo góc ảnh theo style thẻ
    objectFit: "cover",
    border: "2px solid #fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  stars: {
    color: "#ffc107",
    fontSize: "14px",
    background: "#fff9e6",
    padding: "4px 8px",
    borderRadius: "8px",
  },

  userInfo: {
    marginBottom: "12px",
  },

  name: {
    fontSize: "18px",
    color: "#2d3436",
    fontWeight: "700",
    margin: "0 0 4px 0",
  },

  date: {
    color: "#adb5bd",
    fontSize: "12px",
    fontWeight: "500",
  },

  comment: {
    color: "#4a4a4a",
    lineHeight: "1.6",
    fontSize: "14.5px",
    fontStyle: "italic",
    margin: 0,
    flex: 1, // Đẩy comment giãn đều
  },
};