// File: src/pages/Auth.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dangnhap as apiLogin, dangky as apiRegister } from '../services/api';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');         // ← đổi name → fullname
  const [phone, setPhone] = useState('');               // ← thêm phone
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const mode = searchParams.get('mode');
    setIsLogin(mode !== 'register');
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // ← đổi role === 'Admin' thành role_id === 1
    if (user?.role_id === 1) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const toggleMode = () => {
    setMessage('');
    setSuccess('');
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    // ===== ĐĂNG NHẬP =====
    if (isLogin) {
      try {
        const data = await apiLogin({
          email: trimmedEmail,
          password: password,
        });

        // API trả về { message, token, user }
        if (!data.token) {
          setMessage(data.message || 'Đăng nhập thất bại.');
          return;
        }

        login({ token: data.token, user: data.user });
        setSuccess('Đăng nhập thành công!');
        setMessage('');
        setTimeout(() => {
          // ← dùng role_id thay vì role
          navigate(data.user.role_id === 1 ? '/admin' : '/');
        }, 800);
      } catch (error) {
        // Laravel trả lỗi 401, 403, 422 đều vào đây
        const errMsg = error.response?.data?.message || 'Lỗi kết nối server.';
        setMessage(errMsg);
      }
      return;
    }

    // ===== ĐĂNG KÝ =====
    if (!fullname.trim()) {
      setMessage('Vui lòng nhập họ tên.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      const data = await apiRegister({
        fullname: fullname.trim(),       // ← đổi name → fullname
        email: trimmedEmail,
        password: password,
        password_confirmation: confirmPassword,  // ← thêm field này
        phone: phone.trim() || null,     // ← thêm phone (optional)
      });

      // API trả về { message, token, user }
      if (!data.token) {
        setMessage(data.message || 'Đăng ký thất bại.');
        return;
      }

      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setMessage('');
      setFullname('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/dang-nhap?mode=login');
      }, 800);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Lỗi kết nối server.';
      setMessage(errMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>

        <div style={styles.header}>
          <h2 style={styles.title}>
            {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </h2>
          <p style={styles.subtitle}>
            {isLogin
              ? 'Chào mừng bạn quay lại!'
              : 'Trở thành thành viên để nhận nhiều ưu đãi hấp dẫn.'}
          </p>

          <div style={styles.toggleWrapper}>
            <button
              style={{ ...styles.toggleBtn, ...(isLogin ? styles.activeToggle : {}) }}
              onClick={() => { if (!isLogin) toggleMode(); }}
            >
              Đăng Nhập
            </button>
            <button
              style={{ ...styles.toggleBtn, ...(!isLogin ? styles.activeToggle : {}) }}
              onClick={() => { if (isLogin) toggleMode(); }}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {success && <div style={styles.successMessage}>{success}</div>}
          {message && !success && <div style={styles.message}>{message}</div>}

          {/* Chỉ hiện khi đăng ký */}
          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  style={styles.input}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại (tuỳ chọn)"
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mật khẩu *</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nhập lại mật khẩu *</label>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" style={styles.submitBtn}>
            {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
          </button>

          {isLogin && (
            <div style={styles.forgotPassword}>
              <Link to="/quen-mat-khau" style={styles.linkText}>Quên mật khẩu?</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    backgroundColor: '#FDFCF0',
    padding: '40px 20px'
  },
  authBox: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #eaeaea'
  },
  header: {
    backgroundColor: '#fcf9f2',
    padding: '30px',
    textAlign: 'center',
    borderBottom: '1px solid #eee'
  },
  title: {
    color: '#8B0000',
    fontSize: '24px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 20px 0'
  },
  toggleWrapper: {
    display: 'flex',
    backgroundColor: '#eee',
    borderRadius: '30px',
    padding: '5px',
    position: 'relative'
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
    cursor: 'pointer',
    borderRadius: '25px',
    transition: 'all 0.3s ease'
  },
  activeToggle: {
    backgroundColor: '#8B0000',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  form: {
    padding: '30px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#8B0000',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  },
  successMessage: {
    marginBottom: '20px',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: '#e9f8ef',
    color: '#0b6b2f',
    border: '1px solid #b7e0c7'
  },
  message: {
    marginBottom: '20px',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: '#fdecea',
    color: '#a00',
    border: '1px solid #f5c2c7'
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '20px'
  },
  linkText: {
    color: '#A7665D',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s'
  }
};

export default Auth;