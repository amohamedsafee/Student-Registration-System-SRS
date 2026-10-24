import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UiTestingPage from './pages/UiTestingPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Catalog Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />

        {/* Authentication & Account Recovery Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* UI System Testing Lab */}
        <Route path="/test-ui" element={<UiTestingPage />} />
        <Route path="/components-showcase" element={<UiTestingPage />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  )
}
