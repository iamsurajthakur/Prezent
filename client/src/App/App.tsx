import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '@/pages/Register';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { useAuthStore } from '@/States/auth.states';
import { useEffect } from 'react';
import { getMe } from '@/Api/auth';
import SmartSlide from '@/pages/SmartSlide';
import Library from '@/pages/Library';
import Dashboard from '@/pages/Dashboard';
import Loading from '@/components/ui/Loading';

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth         = useAuthStore((state) => state.setAuth);
  const isLoading       = useAuthStore((state) => state.isLoading);
  const logout          = useAuthStore((state) => state.logout);
  const setLoading      = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    getMe()
      .then((res) => setAuth(res.data.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      
      <Loading done={!isLoading} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="slide" element={<SmartSlide />} />
            <Route path="library" element={<Library />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;