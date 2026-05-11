import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { capnhatthongtin, danxuat, doimatkhau, laythongtin } from '../services/api';

const HoSo = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [activeMenu, setActiveMenu] = useState('profile');

    const [profile, setProfile] = useState(null);
    const [loadingP, setLoadingP] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passMsg, setPassMsg] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoadingP(true);
            try {
                const data = await laythongtin();
                setProfile(data);
                setFullname(data.fullname || '');
                setPhone(data.phone || '');
            } catch (err) {
                setProfileMsg(err.message || 'Không thể tải hồ sơ.');
            } finally {
                setLoadingP(false);
            }
        };
        fetch();
    }, []);

    const handleSaveProfile = async () => {
        setProfileMsg('');
        try {
            await capnhatthongtin({ fullname, phone });
            setProfileMsg('✅ Cập nhật thông tin thành công!');
        } catch (err) {
            setProfileMsg('❌ ' + (err.message || 'Cập nhật thất bại.'));
        }
    };

    const handleChangePassword = async () => {
        setPassMsg('');
        if (newPassword !== confirmPass) {
            setPassMsg('❌ Mật khẩu xác nhận không khớp.');
            return;
        }
        try {
            await doimatkhau({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPass,
            });
            setPassMsg('✅ Đổi mật khẩu thành công!');
            setOldPassword(''); setNewPassword(''); setConfirmPass('');
        } catch (err) {
            setPassMsg('❌ ' + (err.message || 'Đổi mật khẩu thất bại.'));
        }
    };

    const handleLogout = async () => {
        if (!window.confirm('Bạn có chắc muốn đăng xuất không?')) return;
        try { await danxuat(); } catch (_) { }
        logout?.();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                <div style={styles.userInfo}>
                    <div style={styles.avatar}>👤</div>
                    <div style={styles.userDetails}>
                        <h3 style={styles.userName}>{user?.fullname || user?.name || 'Khách hàng'}</h3>
                        <p style={styles.userEmail}>{user?.email || ''}</p>
                    </div>
                </div>
                <ul style={styles.menuList}>
                    <li
                        style={{ ...styles.menuItem, ...(activeMenu === 'profile' ? styles.activeMenuItem : {}) }}
                        onClick={() => setActiveMenu('profile')}
                    >
                        👤 Hồ sơ & Bảo mật
                    </li>
                    <li
                        style={{ ...styles.menuItem, ...(activeMenu === 'rentals' ? styles.activeMenuItem : {}) }}
                        onClick={() => { setActiveMenu('rentals'); navigate('/don-thue'); }}
                    >
                        🚘 Đơn thuê xe
                    </li>
                    <li
                        style={{ ...styles.menuItem, color: '#a00', marginTop: '20px' }}
                        onClick={handleLogout}
                    >
                        🚪 Đăng xuất
                    </li>
                </ul>
            </div>

            {/* NỘI DUNG PHẢI */}
            <div style={styles.mainContent}>
                <div style={styles.viewContainer}>
                    <h2 style={styles.viewTitle}>Hồ Sơ & Bảo Mật</h2>
                    <p style={styles.viewSub}>Quản lý thông tin tài khoản và mật khẩu của bạn</p>
                    <hr style={styles.hr} />

                    {loadingP ? (
                        <p style={{ color: '#888' }}>Đang tải...</p>
                    ) : (
                        <>
                            <div style={styles.formSection}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email</label>
                                    <span style={styles.textStatic}>{profile?.email || user?.email || '---'}</span>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Họ và tên</label>
                                    <input
                                        type="text"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            {profileMsg && (
                                <p style={{
                                    marginTop: '12px', marginLeft: '170px', fontSize: '14px',
                                    color: profileMsg.startsWith('✅') ? '#0b6b2f' : '#a00'
                                }}>
                                    {profileMsg}
                                </p>
                            )}

                            <button style={styles.btnSave} onClick={handleSaveProfile}>
                                LƯU THAY ĐỔI
                            </button>

                            <h3 style={{ ...styles.viewTitle, fontSize: '18px', marginTop: '36px' }}>Đổi mật khẩu</h3>
                            <hr style={styles.hr} />
                            <div style={styles.formSection}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Mật khẩu cũ</label>
                                    <input type="password" value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)} style={styles.input} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Mật khẩu mới</label>
                                    <input type="password" value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)} style={styles.input} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Xác nhận</label>
                                    <input type="password" value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)} style={styles.input} />
                                </div>
                            </div>

                            {passMsg && (
                                <p style={{
                                    marginTop: '12px', marginLeft: '170px', fontSize: '14px',
                                    color: passMsg.startsWith('✅') ? '#0b6b2f' : '#a00'
                                }}>
                                    {passMsg}
                                </p>
                            )}

                            <button style={styles.btnSave} onClick={handleChangePassword}>
                                ĐỔI MẬT KHẨU
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px', margin: '40px auto', padding: '0 20px',
        display: 'flex', gap: '20px', alignItems: 'flex-start', minHeight: '70vh',
    },
    sidebar: {
        flex: '0 0 250px', backgroundColor: '#fff',
        borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden',
    },
    userInfo: {
        display: 'flex', alignItems: 'center', gap: '15px',
        padding: '20px', borderBottom: '1px solid #f0f0f0',
    },
    avatar: {
        fontSize: '28px', backgroundColor: '#eff6ff', borderRadius: '50%',
        width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    userDetails: { flex: 1, overflow: 'hidden' },
    userName: { margin: '0 0 4px 0', fontSize: '15px', color: '#1e3a5f', fontWeight: 'bold' },
    userEmail: { margin: 0, fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    menuList: { listStyle: 'none', padding: '10px 0', margin: 0 },
    menuItem: { padding: '12px 20px', color: '#555', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' },
    activeMenuItem: { color: '#1e3a5f', fontWeight: 'bold', backgroundColor: '#eff6ff' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    viewContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    viewTitle: { margin: '0 0 8px 0', fontSize: '20px', color: '#1e3a5f' },
    viewSub: { fontSize: '14px', color: '#777', marginBottom: '20px' },
    hr: { border: 'none', borderBottom: '1px solid #eee', marginBottom: '24px' },
    formSection: { display: 'flex', flexDirection: 'column', gap: '18px' },
    formGroup: { display: 'flex', alignItems: 'center', gap: '20px' },
    label: { width: '150px', textAlign: 'right', fontSize: '14px', color: '#555' },
    textStatic: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
    input: {
        flex: 1, maxWidth: '400px', padding: '10px',
        border: '1px solid #ddd', borderRadius: '6px', outline: 'none', fontSize: '14px',
    },
    btnSave: {
        marginTop: '24px', marginLeft: '170px',
        backgroundColor: '#1e3a5f', color: '#fff',
        border: 'none', padding: '11px 28px', borderRadius: '6px',
        cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
    },
};

export default HoSo;