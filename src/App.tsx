/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import IdeaGenerator from './pages/dashboard/IdeaGenerator';
import ScriptGenerator from './pages/dashboard/ScriptGenerator';
import HookGenerator from './pages/dashboard/HookGenerator';
import ThumbnailGenerator from './pages/dashboard/ThumbnailGenerator';
import VideoGenerator from './pages/dashboard/VideoGenerator';
import HashtagGenerator from './pages/dashboard/HashtagGenerator';
import WalletPage from './pages/dashboard/Wallet';
import AffiliateProgram from './pages/dashboard/AffiliateProgram';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Support from './pages/dashboard/Support';
import AdminDashboard from './pages/admin/AdminDashboard';
import PricingPage from './pages/PricingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import CookieConsent from './components/CookieConsent';
import OnboardingModal from './components/OnboardingModal';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <CookieConsent />
          <OnboardingModal />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="ideas" element={<IdeaGenerator />} />
              <Route path="scripts" element={<ScriptGenerator />} />
              <Route path="hooks" element={<HookGenerator />} />
              <Route path="thumbnails" element={<ThumbnailGenerator />} />
              <Route path="video" element={<VideoGenerator />} />
              <Route path="hashtags" element={<HashtagGenerator />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="affiliate" element={<AffiliateProgram />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
            </Route>

            <Route path="/admin" element={
              <AdminRoute>
                <DashboardLayout isAdmin />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Catch all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

