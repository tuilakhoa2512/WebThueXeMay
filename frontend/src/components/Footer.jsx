import React from "react";

const Footer = () => {
  const serviceLinks = [
    "Thuê xe máy",
    "Thuê xe ô tô",
    "Thuê xe theo ngày",
    "Thuê xe dài hạn",
  ];

  const supportLinks = [
    "Hướng dẫn đặt xe",
    "Chính sách thanh toán",
    "Chính sách huỷ xe",
    "Câu hỏi thường gặp",
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Cột 1 */}
        <div>
          <h3 style={styles.title}>DỊCH VỤ</h3>
          <div style={styles.line}></div>
          <ul style={styles.list}>
            {serviceLinks.map((item, i) => (
              <li key={i}>
                <a href="#" style={styles.link}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 style={styles.title}>HỖ TRỢ</h3>
          <div style={styles.line}></div>
          <ul style={styles.list}>
            {supportLinks.map((item, i) => (
              <li key={i}>
                <a href="#" style={styles.link}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 style={styles.title}>LIÊN HỆ</h3>
          <div style={styles.line}></div>

          <div style={styles.contact}>
            <p><strong>RENTAL BIKE</strong></p>
            <p>Địa chỉ: Đức Trọng, Lâm Đồng</p>
            <p>Hotline: 0777 444 678</p>
            <p>Email: rentalbike@gmail.com</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div style={styles.bottom}>
        © 2026 Rental Bike. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#111",
    color: "#fff",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  title: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  line: {
    width: "40px",
    height: "2px",
    backgroundColor: "#e63946",
    marginBottom: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    marginBottom: "10px",
  },
  contact: {
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.6",
  },
  bottom: {
    textAlign: "center",
    padding: "15px",
    borderTop: "1px solid #333",
    fontSize: "13px",
    color: "#888",
  },
};

export default Footer;