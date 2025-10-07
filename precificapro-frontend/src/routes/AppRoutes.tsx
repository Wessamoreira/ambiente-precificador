import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductsPage } from '../pages/ProductsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { CostItemsPage } from '../pages/CostItemsPage';
import { PricingProfilesPage } from '../pages/PricingProfilesPage';
import { SimulationPage } from '../pages/SimulationPage';
import { RecordSalePage } from '../pages/RecordSalePage';
import { SalesHistoryPage } from '../pages/SalesHistoryPage'; // Importe a nova página

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/simulations" element={<SimulationPage />} />
            <Route path="/sales/record" element={<RecordSalePage />} />
            <Route path="/sales/history" element={<SalesHistoryPage />} /> {/* Adicione a nova rota */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/cost-items" element={<CostItemsPage />} />
            <Route path="/pricing-profiles" element={<PricingProfilesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};