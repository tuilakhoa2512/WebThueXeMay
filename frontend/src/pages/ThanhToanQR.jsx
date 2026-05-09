// src/pages/ThanhToanQR.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    taoRental,
    layLinkVNPay
} from '../services/api';

export default function ThanhToanQR() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [step, setStep] = useState('creating');

    // =========================================================
    // FORMAT
    // =========================================================

    const formatPrice = (price) => {

        return Number(price).toLocaleString('vi-VN') + ' đ';
    };

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString('vi-VN');
    };

    // =========================================================
    // VALIDATE
    // =========================================================

    useEffect(() => {

        if (!state?.vehicle) {

            navigate('/xe');

            return;
        }

        handleVNPay();

    }, []);

    // =========================================================
    // HANDLE VNPAY
    // =========================================================

    const handleVNPay = async () => {

        try {

            // =================================================
            // STEP 1 - CREATE RENTAL
            // =================================================

            setStep('creating');

            const rentalResponse = await taoRental({

                vehicle_id: state.vehicle.id,

                start_date: state.startDate,

                end_date: state.endDate
            });

            const rental =
                rentalResponse?.rental ||
                rentalResponse?.data ||
                rentalResponse;

            if (!rental?.id) {

                throw new Error(
                    'Không tạo được đơn thuê'
                );
            }

            // =================================================
            // STEP 2 - GET VNPAY URL
            // =================================================

            setStep('payment');

            const paymentResponse =
                await layLinkVNPay(rental.id);

            if (!paymentResponse?.payment_url) {

                throw new Error(
                    'Không lấy được link VNPay'
                );
            }

            // =================================================
            // STEP 3 - REDIRECT
            // =================================================

            setStep('redirect');

            setTimeout(() => {

                window.location.href =
                    paymentResponse.payment_url;

            }, 1500);

        } catch (err) {

            console.error(err);

            setLoading(false);

            setError(
                err?.message ||
                'Không thể kết nối VNPay'
            );
        }
    };

    // =========================================================
    // NO STATE
    // =========================================================

    if (!state?.vehicle) {

        return null;
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div style={styles.page}>

            <div style={styles.container}>

                {/* LEFT */}
                <div style={styles.leftCard}>

                    <img
                        src={
                            state.vehicle.images?.[0]?.image_url ||
                            state.vehicle.image ||
                            '/no-image.png'
                        }
                        alt={state.vehicle.name}
                        style={styles.image}
                    />

                    <h2 style={styles.vehicleName}>
                        {state.vehicle.name}
                    </h2>

                    <div style={styles.line} />

                    <div style={styles.infoRow}>
                        <span>Ngày nhận</span>

                        <strong>
                            {formatDate(state.startDate)}
                        </strong>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Ngày trả</span>

                        <strong>
                            {formatDate(state.endDate)}
                        </strong>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Số ngày thuê</span>

                        <strong>
                            {state.days} ngày
                        </strong>
                    </div>

                    <div style={styles.infoRow}>
                        <span>Đơn giá</span>

                        <strong>
                            {formatPrice(
                                state.vehicle.price_per_day
                            )} / ngày
                        </strong>
                    </div>

                    <div style={styles.line} />

                    <div style={styles.totalRow}>

                        <span>Tổng cộng</span>

                        <span style={styles.totalPrice}>
                            {formatPrice(state.total)}
                        </span>

                    </div>
                </div>

                {/* RIGHT */}
                <div style={styles.rightCard}>

                    {!error && (
                        <>
                            <div style={styles.spinner} />

                            <h2 style={styles.title}>
                                Đang chuyển đến VNPay
                            </h2>

                            <p style={styles.desc}>
                                Vui lòng chờ trong giây lát...
                            </p>

                            {/* STEPS */}
                            <div style={styles.steps}>

                                <Step
                                    active={step === 'creating'}
                                    text="Tạo đơn thuê"
                                />

                                <Step
                                    active={step === 'payment'}
                                    text="Khởi tạo thanh toán"
                                />

                                <Step
                                    active={step === 'redirect'}
                                    text="Chuyển đến VNPay"
                                />

                            </div>
                        </>
                    )}

                    {/* ERROR */}
                    {error && (
                        <>

                            <div style={styles.errorIcon}>
                                ⚠️
                            </div>

                            <h2 style={styles.errorTitle}>
                                Thanh toán thất bại
                            </h2>

                            <p style={styles.errorText}>
                                {error}
                            </p>

                            <button
                                style={styles.backBtn}
                                onClick={() => navigate(-1)}
                            >
                                ← Quay lại
                            </button>

                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

// =========================================================
// STEP ITEM
// =========================================================

function Step({ active, text }) {

    return (

        <div
            style={{
                ...styles.stepItem,
                ...(active ? styles.stepActive : {})
            }}
        >

            <div
                style={{
                    ...styles.stepDot,
                    ...(active ? styles.stepDotActive : {})
                }}
            />

            <span>{text}</span>

        </div>
    );
}

// =========================================================
// STYLES
// =========================================================

const styles = {

    page: {
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI'
    },

    container: {
        width: '100%',
        maxWidth: 1100,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24
    },

    leftCard: {
        background: '#fff',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 10px 30px rgba(0,0,0,.06)'
    },

    rightCard: {
        background: '#fff',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 10px 30px rgba(0,0,0,.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },

    image: {
        width: '100%',
        height: 260,
        objectFit: 'cover',
        borderRadius: 18,
        marginBottom: 20
    },

    vehicleName: {
        margin: 0,
        fontSize: 28,
        fontWeight: 800,
        color: '#0f172a'
    },

    line: {
        borderTop: '1px solid #e2e8f0',
        margin: '20px 0'
    },

    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 14,
        color: '#334155',
        fontSize: 15
    },

    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 24,
        fontWeight: 800
    },

    totalPrice: {
        color: '#dc2626'
    },

    spinner: {
        width: 80,
        height: 80,
        border: '7px solid #dbeafe',
        borderTop: '7px solid #2563eb',
        borderRadius: '50%',
        marginBottom: 28,
        animation: 'spin 1s linear infinite'
    },

    title: {
        margin: 0,
        fontSize: 32,
        fontWeight: 800,
        color: '#0f172a'
    },

    desc: {
        marginTop: 12,
        color: '#64748b',
        marginBottom: 28
    },

    steps: {
        width: '100%',
        marginTop: 12
    },

    stepItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        background: '#f8fafc',
        marginBottom: 12,
        color: '#64748b'
    },

    stepActive: {
        background: '#dbeafe',
        color: '#1d4ed8',
        fontWeight: 700
    },

    stepDot: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: '#cbd5e1'
    },

    stepDotActive: {
        background: '#2563eb'
    },

    errorIcon: {
        fontSize: 60,
        marginBottom: 20
    },

    errorTitle: {
        margin: 0,
        color: '#dc2626',
        fontSize: 30,
        fontWeight: 800
    },

    errorText: {
        marginTop: 12,
        marginBottom: 24,
        color: '#64748b'
    },

    backBtn: {
        border: 'none',
        background: '#1e3a8a',
        color: '#fff',
        padding: '14px 22px',
        borderRadius: 12,
        fontWeight: 700,
        cursor: 'pointer'
    }
};