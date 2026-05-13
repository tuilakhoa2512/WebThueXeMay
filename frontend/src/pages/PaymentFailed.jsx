import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const XIcon = () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="30" cy="30" r="28" stroke="#8B1A1A" strokeWidth="2.5" />
        <path d="M20 20L40 40M40 20L20 40" stroke="#8B1A1A" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const RetryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

export default function PaymentFailed() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (countdown <= 0) { navigate("/"); return; }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    const isError = window.location.pathname.includes("error");

    return (
        <div style={styles.page}>
            <div style={styles.grain} />
            <div style={{ ...styles.orb, ...styles.orb1 }} />
            <div style={{ ...styles.orb, ...styles.orb2 }} />
            <div style={styles.grid} />

            <div style={{ ...styles.card, ...(visible ? styles.cardVisible : {}) }}>
                <div style={styles.accentTop} />
                <div style={styles.accentBottom} />

                <div style={{ ...styles.iconWrap, ...(visible ? styles.iconVisible : {}) }}>
                    <XIcon />
                </div>

                <p style={{ ...styles.label, ...(visible ? styles.fadeIn : {}) }}>
                    {isError ? "LỖI XÁC THỰC" : "GIAO DỊCH THẤT BẠI"}
                </p>

                <h1 style={{ ...styles.heading, ...(visible ? styles.fadeIn : {}), animationDelay: "0.15s" }}>
                    {isError ? "Xác thực\nthất bại" : "Thanh toán\nkhông thành công"}
                </h1>

                <p style={{ ...styles.subtext, ...(visible ? styles.fadeIn : {}), animationDelay: "0.25s" }}>
                    {isError
                        ? "Chữ ký giao dịch không hợp lệ. Vui lòng không thử lại và liên hệ bộ phận hỗ trợ."
                        : "Giao dịch của bạn đã bị huỷ hoặc không được xử lý. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác."}
                </p>

                <div style={{ ...styles.divider, ...(visible ? styles.fadeIn : {}), animationDelay: "0.3s" }} />

                <div style={{ ...styles.reasonBox, ...(visible ? styles.fadeIn : {}), animationDelay: "0.35s" }}>
                    <span style={styles.reasonDot} />
                    <span style={styles.reasonText}>
                        {isError
                            ? "Phiên thanh toán không hợp lệ hoặc đã bị giả mạo"
                            : "Ngân hàng từ chối hoặc hết thời gian giao dịch"}
                    </span>
                </div>

                <div style={{ ...styles.btnGroup, ...(visible ? styles.fadeIn : {}), animationDelay: "0.45s" }}>
                    {!isError && (
                        <button
                            style={styles.btnPrimary}
                            onMouseEnter={e => { e.currentTarget.style.background = "#6e1414"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(139,26,26,0.35)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#8B1A1A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,26,26,0.2)"; }}
                            onClick={() => navigate(-1)}
                        >
                            <RetryIcon />
                            Thử lại thanh toán
                        </button>
                    )}
                    <button
                        style={styles.btnGhost}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#8B1A1A"; e.currentTarget.style.color = "#8B1A1A"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,26,26,0.25)"; e.currentTarget.style.color = "#7a5c5c"; }}
                        onClick={() => navigate("/")}
                    >
                        Về trang chủ
                    </button>

                </div>

                <p style={{ ...styles.countdown, ...(visible ? styles.fadeIn : {}), animationDelay: "0.55s" }}>
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
        @keyframes iconShake {
          0%   { opacity: 0; transform: scale(0.6); }
          50%  { transform: scale(1.06) rotate(-4deg); }
          65%  { transform: scale(0.97) rotate(3deg); }
          80%  { transform: scale(1.02) rotate(-2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(-10px, 14px); }
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
        animation: "orbFloat 9s ease-in-out infinite",
        pointerEvents: "none",
    },
    orb1: {
        width: 420, height: 420,
        background: "radial-gradient(circle, rgba(139,26,26,0.16) 0%, transparent 65%)",
        top: "-140px", right: "-100px",
        animationDelay: "0s",
    },
    orb2: {
        width: 260, height: 260,
        background: "radial-gradient(circle, rgba(160,40,20,0.1) 0%, transparent 70%)",
        bottom: "-60px", left: "-40px",
        animationDelay: "4.5s",
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
        marginBottom: "28px", opacity: 0,
    },
    iconVisible: {
        animation: "iconShake 0.65s cubic-bezier(0.36,0.07,0.19,0.97) 0.2s forwards",
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
        fontSize: "36px", fontWeight: 800,
        color: "#2a1010", lineHeight: 1.15,
        whiteSpace: "pre-line",
        marginBottom: "16px", opacity: 0,
    },
    subtext: {
        fontSize: "13.5px", color: "#9a7878",
        lineHeight: 1.65, marginBottom: "24px", opacity: 0,
        fontWeight: 300,
    },
    divider: {
        height: "1px",
        background: "rgba(139,26,26,0.1)",
        marginBottom: "20px", opacity: 0,
    },
    reasonBox: {
        display: "flex", alignItems: "flex-start", gap: "10px",
        background: "rgba(139,26,26,0.05)",
        border: "1px solid rgba(139,26,26,0.15)",
        borderRadius: "10px",
        padding: "14px 16px",
        marginBottom: "28px", opacity: 0,
    },
    reasonDot: {
        width: 7, height: 7, borderRadius: "50%",
        background: "#8B1A1A", flexShrink: 0,
        marginTop: "5px",
    },
    reasonText: {
        fontSize: "13px", color: "#7a5252",
        lineHeight: 1.55,
    },
    btnGroup: {
        display: "flex", flexDirection: "column", gap: "10px",
        opacity: 0,
    },
    btnPrimary: {
        background: "#8B1A1A", color: "#fff",
        border: "none", borderRadius: "10px",
        padding: "14px 20px", fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: "8px",
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
    btnLink: {
        background: "transparent", border: "none",
        color: "rgba(120,80,80,0.45)",
        fontSize: "13px", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        padding: "6px", textDecoration: "underline",
        textDecorationColor: "rgba(139,26,26,0.2)",
        textUnderlineOffset: "3px",
        transition: "all 0.2s",
    },
    countdown: {
        textAlign: "center", marginTop: "20px",
        fontSize: "12px", color: "rgba(120,80,80,0.45)",
        opacity: 0,
    },
    countdownNum: {
        color: "#8B1A1A", fontWeight: 600,
    },
    fadeIn: {
        animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
    },
};
