import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { layDanhSachYeuThich } from '../services/api';
import VehicleCard from './VehicleCard';

const HomePageIntro = () => {
  const [favoriteVehicles, setFavoriteVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // check login
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchFavorites = async () => {

      // chưa login thì khỏi call api
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await layDanhSachYeuThich();

        setFavoriteVehicles(
          Array.isArray(data) ? data : []
        );

      } catch (err) {
        setError('Không thể tải danh sách yêu thích.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);

  return (
    <div style={styles.wrapper}>

      {/* TOP */}
      <div style={styles.topSection}>

        {/* LEFT */}
        <div style={styles.leftCol}>
          <img
            src="/images/trangchu1.jpg"
            alt="Thuê xe"
            style={styles.posterImg}
          />
        </div>

        {/* RIGHT */}
        <div style={styles.rightCol}>
          <h2 style={styles.heading}>
            THUÊ XE DỄ DÀNG —
            <br />
            DI CHUYỂN THOẢI MÁI MỌI LÚC MỌI NƠI
          </h2>

          <p style={styles.paragraph}>
            Chúng tôi cung cấp dịch vụ thuê xe máy và xe điện đa dạng,
            phù hợp cho mọi nhu cầu di chuyển — từ công việc hằng ngày
            đến những chuyến khám phá cuối tuần.
          </p>

          <p style={styles.paragraph}>
            Quy trình đặt xe nhanh gọn, xe được kiểm định kỹ thuật định kỳ,
            giá niêm yết minh bạch. Chỉ cần vài bước trên điện thoại,
            bạn đã có ngay chiếc xe ưng ý.
          </p>
        </div>
      </div>

      {/* FAVORITES */}
      <div style={styles.favoriteSection}>

        <div style={styles.divider}></div>

        <h3 style={styles.subHeading}>
          ❤️ Danh sách xe yêu thích
        </h3>

        {/* chưa login */}
        {!isLoggedIn ? (
          <div style={styles.loginBox}>



            <h4 style={styles.loginTitle}>
              Đăng nhập để xem xe yêu thích
            </h4>

            <p style={styles.loginText}>
              Lưu lại những chiếc xe bạn thích để dễ dàng thuê lại sau này.
            </p>

            <Link to="/dang-nhap" style={styles.loginBtn}>
              ĐĂNG NHẬP NGAY
            </Link>

          </div>

        ) : (
          <>
            <div style={styles.vehicleGrid}>

              {loading ? (
                <p style={styles.centerMsg}>
                  Đang tải danh sách xe...
                </p>

              ) : error ? (
                <p style={{
                  ...styles.centerMsg,
                  color: '#dc2626'
                }}>
                  {error}
                </p>

              ) : favoriteVehicles.length === 0 ? (
                <p style={styles.centerMsg}>
                  Bạn chưa có xe yêu thích nào.
                </p>

              ) : (
                favoriteVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                  />
                ))
              )}

            </div>

            <Link to="/vehicle" style={styles.viewAllBtn}>
              XEM TẤT CẢ XE →
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

const styles = {

  wrapper: {
    maxWidth: '1300px',
    margin: '50px auto',
    padding: '0 20px',
  },

  topSection: {
    display: 'flex',
    gap: '45px',
    alignItems: 'flex-start',
    marginBottom: '35px',
    flexWrap: 'wrap',
  },

  leftCol: {
    flex: '0 0 420px',
  },

  posterImg: {
    width: '100%',
    borderRadius: '24px',
    objectFit: 'cover',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  },

  rightCol: {
    flex: 1,
    paddingTop: '10px',
  },

  heading: {
    color: '#123462',
    fontSize: '42px',
    lineHeight: '1.3',
    fontWeight: '800',
    marginBottom: '24px',
  },

  paragraph: {
    color: '#555',
    lineHeight: '1.9',
    fontSize: '17px',
    marginBottom: '18px',
  },

  favoriteSection: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  divider: {
    height: '4px',
    width: '70px',
    backgroundColor: '#123462',
    borderRadius: '20px',
    marginBottom: '18px',
  },

  subHeading: {
    fontSize: '30px',
    fontWeight: '800',
    color: '#123462',
    marginBottom: '28px',
  },

  vehicleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'start',
  },

  centerMsg: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#777',
    padding: '30px 0',
    fontSize: '16px',
  },

  loginBox: {
    width: '100%',
    maxWidth: '650px',
    background: '#fff',
    borderRadius: '24px',
    padding: '50px 40px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  },

  loginIcon: {
    width: '70px',
    marginBottom: '18px',
  },

  loginTitle: {
    fontSize: '28px',
    color: '#123462',
    marginBottom: '14px',
    fontWeight: '800',
  },

  loginText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '26px',
  },

  loginBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 30px',
    borderRadius: '14px',
    backgroundColor: '#123462',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
  },

  viewAllBtn: {
    marginTop: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    backgroundColor: '#123462',
    color: '#fff',
    borderRadius: '14px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
  },
};

export default HomePageIntro;