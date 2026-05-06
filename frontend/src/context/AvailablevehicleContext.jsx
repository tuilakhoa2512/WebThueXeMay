// File: src/context/AvailableVehicleContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { layXeTrong, layxebyid } from '../services/api';

export const AvailableVehicleContext = createContext();

export const AvailableVehicleProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ===== LẤY DANH SÁCH XE CHO USER =====
    const loadAvailableVehicles = async ({
        keyword = '',
        category_id = '',
        brand_id = '',
        start_date = '',
        end_date = '',
    } = {}) => {
        setLoading(true);
        setError('');

        try {
            let data = await layXeTrong({
                keyword,
                category_id,
                brand_id,
                start_date,
                end_date,
            });

            // 👉 FE chỉ lấy status 0,1
            data = Array.isArray(data)
                ? data.filter(v => v.status === 0 || v.status === 1)
                : [];

            setVehicles(data);
        } catch (err) {
            setError(err.message || 'Lỗi khi tải xe');
        } finally {
            setLoading(false);
        }
    };

    // ===== CHI TIẾT XE =====
    const loadAvailableVehicleById = async (id, params = {}) => {
        setLoading(true);
        setError('');
        try {
            const data = await layxebyid(id, params);
            setSelectedVehicle(data);
            return data;
        } catch (err) {
            setError(err.message || 'Không tìm thấy xe');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // load mặc định (không ngày)
    useEffect(() => {
        loadAvailableVehicles();
    }, []);

    return (
        <AvailableVehicleContext.Provider
            value={{
                vehicles,
                selectedVehicle,
                loading,
                error,
                loadAvailableVehicles,
                loadAvailableVehicleById,
                setSelectedVehicle,
                setError,
            }}
        >
            {children}
        </AvailableVehicleContext.Provider>
    );
};

export const useAvailableVehicle = () => useContext(AvailableVehicleContext);