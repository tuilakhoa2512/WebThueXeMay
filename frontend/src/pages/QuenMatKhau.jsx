import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { datlaimatkhau, guiOtp, xacthucOtp } from "../services/api";

export default function QuenMatKhau() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error"); // "error" | "success"
    const [loading, setLoading] = useState(false);

    const showMsg = (msg, type = "error") => {
        setMessage(msg);
        setMessageType(type);
    };

    const handleGuiOtp = async () => {
        if (!email) return showMsg("Vui lòng nhập email.");
        setLoading(true);
        try {
            const data = await guiOtp({ email });
            showMsg(data.message, "success");
            setStep(2);
        } catch (error) {
            showMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleXacThucOtp = async () => {
        if (!otp) return showMsg("Vui lòng nhập mã OTP.");
        setLoading(true);
        try {
            const data = await xacthucOtp({ email, otp_code: otp });
            showMsg(data.message, "success");
            setStep(3);
        } catch (error) {
            showMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDoiMatKhau = async () => {
        if (!password || !passwordConfirmation) return showMsg("Vui lòng điền đầy đủ.");
        if (password !== passwordConfirmation) return showMsg("Mật khẩu không khớp.");
        setLoading(true);
        try {
            const data = await datlaimatkhau({
                email,
                otp_code: otp,
                password,
                password_confirmation: passwordConfirmation,
            });
            showMsg(data.message, "success");
            setTimeout(() => navigate("/dang-nhap"), 1500);
        } catch (error) {
            showMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: "Email" },
        { num: 2, label: "Xác thực" },
        { num: 3, label: "Mật khẩu" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');

        .qmk-wrapper {
          min-height: 100vh;
          background-color: #f5f3ea;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .qmk-card {
          width: 100%;
          max-width: 460px;
          background: #faf8f4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(139,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid rgba(139,0,0,0.1);
        }

        /* HEADER */
        .qmk-header {
          background: #8B0000;
          padding: 36px 32px 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .qmk-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .qmk-header::after {
          content: '';
          position: absolute;
          bottom: -30px; left: -20px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .qmk-icon {
          width: 52px; height: 52px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          backdrop-filter: blur(4px);
        }
        .qmk-icon svg { width: 24px; height: 24px; color: white; }
        .qmk-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: white;
          letter-spacing: 1px;
          margin: 0 0 4px;
        }
        .qmk-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 300;
          margin: 0;
        }

        /* STEP INDICATOR */
        .qmk-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 32px 0;
          gap: 0;
        }
        .qmk-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .qmk-step-circle {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid #ddd;
          background: white;
          color: #aaa;
          position: relative;
          z-index: 1;
        }
        .qmk-step-circle.active {
          background: #8B0000;
          border-color: #8B0000;
          color: white;
          box-shadow: 0 0 0 4px rgba(139,0,0,0.12);
        }
        .qmk-step-circle.done {
          background: #8B0000;
          border-color: #8B0000;
          color: white;
        }
        .qmk-step-label {
          font-size: 11px;
          color: #aaa;
          font-weight: 500;
          transition: color 0.3s;
        }
        .qmk-step-label.active, .qmk-step-label.done { color: #8B0000; }
        .qmk-step-line {
          flex: 1;
          height: 2px;
          background: #e5e5e5;
          margin-bottom: 18px;
          transition: background 0.3s;
        }
        .qmk-step-line.done { background: #8B0000; }

        /* BODY */
        .qmk-body {
          padding: 24px 32px 32px;
        }

        .qmk-step-title {
          font-size: 15px;
          font-weight: 600;
          color: #3a1a1a;
          margin: 0 0 18px;
        }

        /* FIELD */
        .qmk-field { margin-bottom: 16px; }
        .qmk-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }
        .qmk-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid #e0ddd6;
          background: #fff;
          font-size: 14px;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #333;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .qmk-input:focus {
          border-color: #8B0000;
          box-shadow: 0 0 0 3px rgba(139,0,0,0.08);
        }
        .qmk-input::placeholder { color: #bbb; }

        /* HINT */
        .qmk-hint {
          font-size: 12px;
          color: #999;
          margin-top: 6px;
        }

        /* BUTTONS */
        .qmk-btn-primary {
          width: 100%;
          padding: 14px;
          background: #8B0000;
          color: white;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          margin-top: 8px;
          box-shadow: 0 4px 14px rgba(139,0,0,0.3);
        }
        .qmk-btn-primary:hover:not(:disabled) {
          background: #6e0000;
          box-shadow: 0 6px 18px rgba(139,0,0,0.4);
        }
        .qmk-btn-primary:active:not(:disabled) { transform: translateY(1px); }
        .qmk-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        .qmk-btn-ghost {
          background: none;
          border: 1.5px solid #ddd;
          color: #666;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .qmk-btn-ghost:hover { border-color: #8B0000; color: #8B0000; }

        .qmk-btn-row {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .qmk-btn-row .qmk-btn-primary { flex: 1; margin-top: 0; }

        /* OTP INPUT */
        .qmk-otp-row {
          display: flex;
          gap: 8px;
        }
        .qmk-otp-row .qmk-input {
          letter-spacing: 4px;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
        }

        /* MESSAGE */
        .qmk-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-top: 14px;
          animation: fadeIn 0.3s ease;
        }
        .qmk-message.error {
          background: #fff5f5;
          color: #c0392b;
          border: 1px solid #f5c6cb;
        }
        .qmk-message.success {
          background: #f0faf4;
          color: #27ae60;
          border: 1px solid #c3e6cb;
        }
        .qmk-message svg { width: 16px; height: 16px; flex-shrink: 0; }

        /* DIVIDER */
        .qmk-divider {
          border: none;
          border-top: 1px solid #eee;
          margin: 20px 0 16px;
        }

        /* BACK LINK */
        .qmk-back {
          text-align: center;
        }
        .qmk-back a {
          color: #8B0000;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
        }
        .qmk-back a:hover { opacity: 0.75; text-decoration: underline; }

        /* LOADING SPINNER */
        .qmk-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 6px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            <div className="qmk-wrapper">
                <div className="qmk-card">

                    {/* HEADER */}
                    <div className="qmk-header">
                        <div className="qmk-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="qmk-title">Quên Mật Khẩu</h1>
                        <p className="qmk-subtitle">Khôi phục quyền truy cập tài khoản</p>
                    </div>

                    {/* STEP INDICATOR */}
                    <div className="qmk-steps"> {steps.map((s, i) => (<React.Fragment key={s.num}> <div className="qmk-step-item"> <div className={`qmk-step-circle ${step === s.num ? "active" : step > s.num ? "done" : ""}`} > {step > s.num ? (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }} > <polyline points="20 6 9 17 4 12" /> </svg>) : (s.num)} </div> <span className={`qmk-step-label ${step >= s.num ? "active" : ""}`} > {s.label} </span> </div> {i < steps.length - 1 && (<div className={`qmk-step-line ${step > s.num ? "done" : ""}`} />)} </React.Fragment>))} </div>

                    {/* BODY */}
                    <div className="qmk-body">

                        {/* STEP 1: EMAIL */}
                        {step === 1 && (
                            <>
                                <p className="qmk-step-title">Nhập email đã đăng ký tài khoản</p>
                                <div className="qmk-field">
                                    <label className="qmk-label">Email</label>
                                    <input
                                        type="email"
                                        className="qmk-input"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleGuiOtp()}
                                    />
                                    <p className="qmk-hint">Mã OTP sẽ được gửi đến địa chỉ này.</p>
                                </div>
                                <button className="qmk-btn-primary" onClick={handleGuiOtp} disabled={loading}>
                                    {loading && <span className="qmk-spinner" />}
                                    Gửi mã OTP
                                </button>
                            </>
                        )}

                        {/* STEP 2: OTP */}
                        {step === 2 && (
                            <>
                                <p className="qmk-step-title">Nhập mã OTP đã gửi đến <strong style={{ color: "#8B0000" }}>{email}</strong></p>
                                <div className="qmk-field">
                                    <label className="qmk-label">Mã OTP</label>
                                    <div className="qmk-otp-row">
                                        <input
                                            type="text"
                                            className="qmk-input"
                                            placeholder="------"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                            onKeyDown={(e) => e.key === "Enter" && handleXacThucOtp()}
                                        />
                                    </div>
                                    <p className="qmk-hint">Mã có hiệu lực trong 5 phút. Không nhận được?{" "}
                                        <span
                                            style={{ color: "#8B0000", cursor: "pointer", fontWeight: 600 }}
                                            onClick={handleGuiOtp}
                                        >Gửi lại</span>
                                    </p>
                                </div>
                                <div className="qmk-btn-row">
                                    <button className="qmk-btn-ghost" onClick={() => { setStep(1); setMessage(""); }}>← Quay lại</button>
                                    <button className="qmk-btn-primary" onClick={handleXacThucOtp} disabled={loading}>
                                        {loading && <span className="qmk-spinner" />}
                                        Xác thực OTP
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 3: NEW PASSWORD */}
                        {step === 3 && (
                            <>
                                <p className="qmk-step-title">Tạo mật khẩu mới</p>
                                <div className="qmk-field">
                                    <label className="qmk-label">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="qmk-input"
                                        placeholder="Tối thiểu 8 ký tự"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="qmk-field">
                                    <label className="qmk-label">Nhập lại mật khẩu</label>
                                    <input
                                        type="password"
                                        className="qmk-input"
                                        placeholder="Xác nhận mật khẩu"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleDoiMatKhau()}
                                    />
                                </div>
                                <div className="qmk-btn-row">
                                    <button className="qmk-btn-ghost" onClick={() => { setStep(2); setMessage(""); }}>← Quay lại</button>
                                    <button className="qmk-btn-primary" onClick={handleDoiMatKhau} disabled={loading}>
                                        {loading && <span className="qmk-spinner" />}
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </>
                        )}

                        {/* MESSAGE */}
                        {message && (
                            <div className={`qmk-message ${messageType}`}>
                                {messageType === "success"
                                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                }
                                {message}
                            </div>
                        )}

                        <hr className="qmk-divider" />

                        {/* BACK */}
                        <div className="qmk-back">
                            <Link to="/dang-nhap">← Quay lại đăng nhập</Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
