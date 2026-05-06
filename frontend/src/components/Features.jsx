import React from 'react';

const featuresData = [
  {
    id: 1,
    title: "Xe đa dạng nhiều mẫu mã",
    desc: "Cung cấp nhiều dòng xe máy và xe điện hiện đại phù hợp cho đi làm, đi chơi và du lịch.",
    icon: "images/brand.png"
  },
  {
    id: 2,
    title: "Giá thuê hợp lý",
    desc: "Giá thuê minh bạch, cạnh tranh cùng nhiều ưu đãi hấp dẫn theo ngày và theo tháng.",
    icon: "images/king.png"
  },
  {
    id: 3,
    title: "Thủ tục thuê nhanh chóng",
    desc: "Đăng ký thuê xe đơn giản, xác nhận nhanh, tiết kiệm thời gian cho khách hàng.",
    icon: "images/daily-tasks.png"
  },
  {
    id: 4,
    title: "Xe được bảo dưỡng định kỳ",
    desc: "Tất cả xe đều được kiểm tra kỹ thuật thường xuyên nhằm đảm bảo an toàn khi sử dụng.",
    icon: "images/quality-assurance.png"
  },
  {
    id: 5,
    title: "Hỗ trợ khách hàng 24/7",
    desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp và xử lý sự cố trong suốt quá trình thuê xe.",
    icon: "images/clean.png"
  },
  {
    id: 6,
    title: "Giao nhận xe tận nơi",
    desc: "Hỗ trợ giao và nhận xe tận nơi nhanh chóng giúp khách hàng thuận tiện hơn khi di chuyển.",
    icon: "images/clean.png"
  }
];

const Features = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>
        DỊCH VỤ THUÊ XE MÁY VỚI 6 ƯU ĐIỂM NỔI BẬT
      </h2>

      <div style={styles.grid}>
        {featuresData.map((item, index) => (
          <div key={item.id} style={getGridItemStyle(index, featuresData.length)}>

            <div style={styles.iconWrapper}>
              <img src={item.icon} alt={item.title} style={styles.iconImg} />
            </div>

            <div style={styles.textWrapper}>
              <h3 style={styles.title}>{item.title}</h3>
              <p style={styles.desc}>{item.desc}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '60px auto',
    padding: '0 20px',
  },

  mainTitle: {
    textAlign: 'center',
    color: '#A01515',
    fontSize: '28px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '40px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  iconWrapper: {
    flexShrink: 0,
    marginRight: '20px'
  },

  iconImg: {
    width: '60px',
    height: '60px',
    objectFit: 'contain'
  },

  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },

  title: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '600'
  },

  desc: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6'
  }
};

const getGridItemStyle = (index, totalItems) => {
  const isLeftColumn = index % 2 === 0;
  const isLastRow = index >= totalItems - 2;

  return {
    display: 'flex',
    padding: '30px',
    borderRight: isLeftColumn ? '1px solid #eaeaea' : 'none',
    borderBottom: !isLastRow ? '1px solid #eaeaea' : 'none'
  };
};

export default Features;