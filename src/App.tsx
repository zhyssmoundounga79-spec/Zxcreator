/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import IdeaGenerator from './pages/dashboard/IdeaGenerator';
import ScriptGenerator from './pages/dashboard/ScriptGenerator';
import HookGenerator from './pages/dashboard/HookGenerator';
import ThumbnailGenerator from './pages/dashboard/ThumbnailGenerator';
import VideoGenerator from './pages/dashboard/VideoGenerator';
import HashtagGenerator from './pages/dashboard/HashtagGenerator';
import Analytics from './pages/dashboard/Analytics';
import AdminDashboard from './pages/admin/AdminDashboard';
import PricingPage from './pages/PricingPage';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
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
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="/admin" element={
            <AdminRoute>
              <DashboardLayout isAdmin />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

