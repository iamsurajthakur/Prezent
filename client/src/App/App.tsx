import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '@/pages/Register';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { useAuthStore } from '@/States/auth.states';
import { useEffect, useState } from 'react';
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

  // App stays invisible until Loading's curtain fully opens
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    getMe()
      .then((res) => setAuth(res.data.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Loading screen — signals us via onComplete when curtain is fully open */}
      <Loading
        done={!isLoading}
        onComplete={() => setAppReady(true)}
      />

      {/*
        App is in the DOM the whole time (so it's pre-rendered under the curtain)
        but invisible until onComplete fires.
        The opacity transition gives a smooth fade-in as the curtain finishes splitting.
      */}
      <div
        style={{
          opacity: appReady ? 1 : 0,
          transition: appReady ? "opacity 0.4s ease" : "none",
          
        }}
      >
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
      </div>
    </>
  );
};

export default App;