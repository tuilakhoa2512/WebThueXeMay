// File: src/context/VehicleContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  anxe,
  capnhatxe,
  layxe,
  layxebyid,
  taoxe,
} from '../services/api';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== LẤY DANH SÁCH XE =====
  const loadVehicles = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await layxe(params);
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  // ===== LẤY CHI TIẾT XE =====
  const loadVehicleById = async (id) => {
    setLoading(true);
    setError('');
    try {
      const data = await layxebyid(id);
      setSelectedVehicle(data);
      return data;
    } catch (err) {
      setError(err.message || 'Không tìm thấy xe');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===== THÊM XE (Admin) =====
  // formData là FormData object gồm: name, category_id, brand_id,
  // license_plate, price_per_day, description, images[]
  const addVehicle = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const data = await taoxe(formData);
      setVehicles((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm xe');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ===== CẬP NHẬT XE (Admin) =====
  // updateData gồm: name, category_id, brand_id, license_plate, price_per_day, description
  const updateVehicle = async (id, updateData) => {
    setLoading(true);
    setError('');
    try {
      const data = await capnhatxe(id, updateData);
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === id ? data.data : vehicle))
      );
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(data.data);
      }
      return { success: true, data: data.data };
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật xe');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ===== ẨN XE (Admin) =====
  const hideVehicle = async (id) => {
    setLoading(true);
    setError('');
    try {
      await anxe(id);
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Lỗi khi ẩn xe');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ===== TÌM KIẾM & LỌC XE =====
  const searchVehicles = async ({ keyword = '', category_id = '', brand_id = '' }) => {
    await loadVehicles({ keyword, category_id, brand_id });
  };

  // ===== TỰ LOAD KHI KHỞI ĐỘNG =====
  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        loading,
        error,
        loadVehicles,
        loadVehicleById,
        addVehicle,
        updateVehicle,
        hideVehicle,
        searchVehicles,
        setSelectedVehicle,
        setError,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);