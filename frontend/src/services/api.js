import { API_URL } from '../apiConfig.js';

// ==================== HELPER ====================
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    Accept: 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === 'object' && payload?.message) ||
      (typeof payload === 'string' && payload) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.response = { data: payload, status: response.status };
    throw error;
  }
  return payload;
};

// ==================== AUTH ====================

// POST /api/login
export const dangnhap = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// POST /api/logout
export const danxuat = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/admin/login
export const dangnhapAdmin = async (credentials) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// POST /api/register
export const dangky = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    // userData gồm: { fullname, email, password, password_confirmation, phone }
  });
  return handleResponse(response);
};

// GET /api/profile
export const laythongtin = async () => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// PUT /api/profile
export const capnhatthongtin = async (data) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    // data gồm: { fullname, phone }
  });
  return handleResponse(response);
};

// POST /api/profile/avatar
export const uploadAvatar = async (formData) => {
  const response = await fetch(`${API_URL}/profile/avatar`, {
    method: 'POST',
    headers: getAuthHeaders(true), // không set Content-Type để browser tự set boundary
    body: formData,
    // formData gồm: { image: file }
  });
  return handleResponse(response);
};

// POST /api/profile/change-password
export const doimatkhau = async (data) => {
  const response = await fetch(`${API_URL}/profile/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    // data gồm: { old_password, new_password, new_password_confirmation }
  });
  return handleResponse(response);
};

// ==================== OTP ====================

// POST /api/otp/send

// POST /api/otp/send
export const guiOtp = async (data) => {

  const response = await fetch(`${API_URL}/otp/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

// POST /api/otp/verify
export const xacthucOtp = async (data) => {

  const response = await fetch(`${API_URL}/otp/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

// POST /api/otp/reset-password
export const datlaimatkhau = async (data) => {

  const response = await fetch(`${API_URL}/otp/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};


// ==================== NOTIFICATION ====================

// GET /api/notifications
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// GET /api/notifications/unread-count
export const getUnreadCount = async () => {
  const response = await fetch(`${API_URL}/notifications/unread-count`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// PUT /api/notifications/{id}/read
export const markNotificationRead = async (id) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
// ==================== VEHICLE ====================

// GET /api/vehicles?keyword=&category_id=&brand_id=
export const layxe = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.keyword) query.append('keyword', params.keyword);
  if (params.category_id) query.append('category_id', params.category_id);
  if (params.brand_id) query.append('brand_id', params.brand_id);

  const response = await fetch(`${API_URL}/vehicles?${query.toString()}`);
  return handleResponse(response);
};
/////////
export const layXeTrong = async (params = {}) => {
  const query = new URLSearchParams();

  // 👉 CHỈ append khi có đủ 2 ngày
  if (params.start_date && params.end_date) {
    query.append('start_date', params.start_date);
    query.append('end_date', params.end_date);
  }

  if (params.keyword) query.append('keyword', params.keyword);
  if (params.category_id) query.append('category_id', params.category_id);
  if (params.brand_id) query.append('brand_id', params.brand_id);

  const response = await fetch(`${API_URL}/vehicles/available?${query.toString()}`);
  return handleResponse(response);
};
// GET /api/vehicles/{id}
export const layxebyid = async (id) => {
  const response = await fetch(`${API_URL}/vehicles/${id}`);
  return handleResponse(response);
};

// POST /api/vehicles (multipart/form-data)
export const taoxe = async (formData) => {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
    // formData gồm: { name, category_id, brand_id, license_plate, price_per_day, description, images[] }
  });
  return handleResponse(response);
};

// PUT /api/vehicles/{id}
export const capnhatxe = async (id, data) => {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    // data gồm: { name, category_id, brand_id, license_plate, price_per_day, description }
  });
  return handleResponse(response);
};

// DELETE /api/vehicles/{id}
export const anxe = async (id) => {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
// =======================Xe yêu thích=========//
export const layDanhSachYeuThich = async () => {
  const response = await fetch(`${API_URL}/favorites`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/favorites/{vehicleId} — thêm xe vào yêu thích
export const themYeuThich = async (vehicleId) => {
  const response = await fetch(`${API_URL}/favorites/${vehicleId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// DELETE /api/favorites/{vehicleId} — bỏ xe khỏi yêu thích
export const boYeuThich = async (vehicleId) => {
  const response = await fetch(`${API_URL}/favorites/${vehicleId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
// ==================== RENTAL ====================

// POST /api/rentals
export const datxe = async (data) => {
  const response = await fetch(`${API_URL}/rentals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    // data gồm: { vehicle_id, start_date, end_date }
  });
  return handleResponse(response);
};

// GET /api/rentals/my
export const laydonthueculatoi = async () => {
  const response = await fetch(`${API_URL}/rentals/my`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// GET /api/rentals/{id}
export const laydonthuebyid = async (id) => {
  const response = await fetch(`${API_URL}/rentals/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/rentals/{id}/cancel
export const huydonthue = async (id) => {
  const response = await fetch(`${API_URL}/rentals/${id}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// GET /api/admin/rentals
export const laytatcadonthue = async () => {
  const response = await fetch(`${API_URL}/admin/rentals`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/admin/rentals/{id}/confirm
export const xacnhandonthuê = async (id) => {
  const response = await fetch(`${API_URL}/admin/rentals/${id}/confirm`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/admin/rentals/{id}/reject
export const tuchoidonthuê = async (id) => {
  const response = await fetch(`${API_URL}/admin/rentals/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/admin/rentals/{id}/start
export const batdauchothue = async (id) => {
  const response = await fetch(`${API_URL}/admin/rentals/${id}/start`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST /api/admin/rentals/{id}/complete
export const hoantthanhdonthuê = async (id) => {
  const response = await fetch(`${API_URL}/admin/rentals/${id}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ==================== PAYMENTS ====================

// POST /api/payments/cash — Xác nhận thanh toán tiền mặt / chuyển khoản
// Body: { rental_id }
export const thanhToanTienMat = async (rentalId) => {
  const response = await fetch(`${API_URL}/payments/cash`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rental_id: rentalId }),
  });
  return handleResponse(response);
};

// GET /api/payments/vnpay/:rental_id — Lấy link thanh toán VNPay
export const layLinkVNPay = async (rentalId) => {

  const response = await fetch(

    `${API_URL}/vnpay/create/${rentalId}`,

    {
      method: 'GET',

      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// ==================== NOTIFICATION ====================

// GET /api/notifications
export const laythongbao = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// PUT /api/notifications/{id}/read
export const danhDaDocthongbao = async (id) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// GET /api/notifications/unread-count
export const demthongbaochuadoc = async () => {
  const response = await fetch(`${API_URL}/notifications/unread-count`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const taoRental = datxe;
export const layRental = laydonthuebyid;