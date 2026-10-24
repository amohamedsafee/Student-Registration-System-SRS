import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Login from './pages/Login'
import Register from './pages/Register'
import UiTestingPage from './pages/UiTestingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test-ui" element={<UiTestingPage />} />
      <Route path="/components-showcase" element={<UiTestingPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
