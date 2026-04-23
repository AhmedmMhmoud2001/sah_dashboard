import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyCourses from './pages/MyCourses'
import CourseDetails from './pages/CourseDetails'
import CourseLearn from './pages/CourseLearn'
import Quiz from './pages/Quiz'
import AdminDashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Courses from './pages/admin/Courses'
import Subscriptions from './pages/admin/Subscriptions'
import Videos from './pages/admin/Videos'
import Questions from './pages/admin/Questions'
import Reports from './pages/admin/Reports'
import AboutEditor from './pages/admin/About'
import Contact from './pages/admin/Contact'
import Orders from './pages/admin/Orders'
import Coupons from './pages/admin/Coupons'
import RBAC from './pages/admin/RBAC'
import PublicAbout from './pages/About'
import './App.css'




function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/app" />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Student Routes with Layout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course/:id/learn" element={<CourseLearn />} />
        <Route path="/course/:id/quiz/:quizId" element={<Quiz />} />
        <Route path="/about" element={<PublicAbout />} />
      </Route>

      
      {/* Admin Routes */}
      <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/subscriptions" element={<Subscriptions />} />
        <Route path="/admin/videos" element={<Videos />} />
        <Route path="/admin/questions" element={<Questions />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/rbac" element={<RBAC />} />
        <Route path="/admin/about" element={<AboutEditor />} />
        <Route path="/admin/contact" element={<Contact />} />
      </Route>



    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}