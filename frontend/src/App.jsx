import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppRouter from './routes/AppRouter';

import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';

// ✅ THÊM DÒNG NÀY
import { AvailableVehicleProvider } from './context/AvailableVehicleContext';

function App() {
  return (
    <AuthProvider>
      <VehicleProvider>

        {/* ✅ THÊM PROVIDER Ở ĐÂY */}
        <AvailableVehicleProvider>
          <Router>
            <AppRouter />
          </Router>
        </AvailableVehicleProvider>

      </VehicleProvider>
    </AuthProvider>
  );
}

export default App;