import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const CheckIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <circle cx="30" cy="30" r="28" stroke="#8B1A1A" strokeWidth="2.5" />
    <path d="M16 30.5L25.5 40L44 21" stroke="#8B1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rentalId = searchParams.get("rental_id");
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) { navigate("/"); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div style={styles.page}>
      {/* Grain overlay */}
      <div style={styles.grain} />
      {/* Decorative orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      {/* Subtle grid */}
      <div style={styles.grid} />

      <div style={{ ...styles.card, ...(visible ? styles.cardVisible : {}) }}>
        <div style={styles.accentTop} />
        <div style={styles.accentBottom} />

        <div style={{ ...styles.iconWrap, ...(visible ? styles.iconVisible : {}) }}>
          <CheckIcon />
        </div>

        <p style={{ ...styles.label, ...(visible ? styles.fadeIn : {}) }}>
          GIAO DỊCH THÀNH CÔNG
        </p>

        <h1 style={{ ...styles.heading, ...(visible ? styles.fadeIn : {}), animationDelay: "0.15s" }}>
          Thanh toán<br />hoàn tất
        </h1>

        <div style={{ ...styles.divider, ...(visible ? styles.fadeIn : {}), animationDelay: "0.25s" }} />

        {rentalId && (
          <div style={{ ...styles.infoRow, ...(visible ? styles.fadeIn : {}), animationDelay: "0.3s" }}>
            <span style={styles.infoKey}>Mã đặt xe</span>
            <span style={styles.infoVal}>#{rentalId}</span>
          </div>
        )}

        <div style={{ ...styles.infoRow, ...(visible ? styles.fadeIn : {}), animationDelay: "0.35s" }}>
          <span style={styles.infoKey}>Phương thức</span>
          <span style={styles.infoVal}>VNPay</span>
        </div>

        <div style={{ ...styles.infoRow, ...(visible ? styles.fadeIn : {}), animationDelay: "0.4s" }}>
          <span style={styles.infoKey}>Trạng thái</span>
          <span style={{ ...styles.infoVal, color: "#8B1A1A", fontWeight: 600 }}>Đã xác nhận</span>
        </div>

        <div style={{ ...styles.btnGroup, ...(visible ? styles.fadeIn : {}), animationDelay: "0.5s" }}>
          <button
            style={styles.btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.background = "#6e1414"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(139,26,26,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#8B1A1A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,26,26,0.2)"; }}
            onClick={() => navigate("/don-thue")}
          >
            Xem đặt xe của tôi
          </button>
          <button
            style={styles.btnGhost}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#8B1A1A"; e.currentTarget.style.color = "#8B1A1A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,26,26,0.25)"; e.currentTarget.style.color = "#7a5c5c"; }}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </button>
        </div>

        <p style={{ ...styles.countdown, ...(visible ? styles.fadeIn : {}), animationDelay: "0.6s" }}>
          Tự động chuyển trang sau{" "}
          <span style={styles.countdownNum}>{countdown}s</span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconPop {
          0%   { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          70%  { transform: scale(1.08) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(12px, -16px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f0e8",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  grain: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
    opacity: 0.06,
    mixBlendMode: "multiply",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(139,26,26,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,26,26,0.05) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
  },
  orb: {
    position: "absolute", borderRadius: "50%", filter: "blur(80px)",
    animation: "orbFloat 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  orb1: {
    width: 400, height: 400,
    background: "radial-gradient(circle, rgba(139,26,26,0.18) 0%, transparent 65%)",
    top: "-120px", right: "-100px",
    animationDelay: "0s",
  },
  orb2: {
    width: 300, height: 300,
    background: "radial-gradient(circle, rgba(180,80,20,0.12) 0%, transparent 70%)",
    bottom: "-80px", left: "-60px",
    animationDelay: "4s",
  },
  card: {
    position: "relative", zIndex: 1,
    background: "rgba(255,252,248,0.92)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(139,26,26,0.12)",
    borderRadius: "20px",
    padding: "52px 48px 40px",
    width: "100%", maxWidth: "440px",
    opacity: 0,
    boxShadow: "0 24px 60px rgba(139,26,26,0.1), 0 4px 16px rgba(0,0,0,0.06)",
  },
  cardVisible: {
    animation: "cardSlide 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
  },
  accentTop: {
    position: "absolute", top: 0, left: "40px", right: "40px",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #8B1A1A, transparent)",
    borderRadius: "0 0 4px 4px",
  },
  accentBottom: {
    position: "absolute", bottom: 0, left: "40px", right: "40px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(139,26,26,0.3), transparent)",
  },
  iconWrap: {
    width: 60, height: 60,
    marginBottom: "28px",
    opacity: 0,
  },
  iconVisible: {
    animation: "iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s forwards",
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px", letterSpacing: "0.18em",
    color: "#8B1A1A", fontWeight: 600,
    marginBottom: "10px", opacity: 0,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "38px", fontWeight: 800,
    color: "#2a1010", lineHeight: 1.15,
    marginBottom: "28px", opacity: 0,
  },
  divider: {
    height: "1px",
    background: "rgba(139,26,26,0.1)",
    marginBottom: "24px", opacity: 0,
  },
  infoRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "14px", opacity: 0,
  },
  infoKey: {
    fontSize: "13px", color: "#9a7a7a", fontWeight: 400,
  },
  infoVal: {
    fontSize: "14px", color: "#3a1a1a", fontWeight: 500,
    letterSpacing: "0.02em",
  },
  btnGroup: {
    display: "flex", flexDirection: "column", gap: "10px",
    marginTop: "32px", opacity: 0,
  },
  btnPrimary: {
    background: "#8B1A1A",
    color: "#fff",
    border: "none", borderRadius: "10px",
    padding: "14px 20px", fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(139,26,26,0.2)",
    letterSpacing: "0.02em",
  },
  btnGhost: {
    background: "transparent",
    color: "#7a5c5c",
    border: "1px solid rgba(139,26,26,0.25)",
    borderRadius: "10px",
    padding: "13px 20px", fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
    cursor: "pointer", transition: "all 0.2s",
  },
  countdown: {
    textAlign: "center", marginTop: "20px",
    fontSize: "12px", color: "rgba(120,80,80,0.5)",
    opacity: 0,
  },
  countdownNum: {
    color: "#8B1A1A", fontWeight: 600,
  },
  fadeIn: {
    animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
  },
};
