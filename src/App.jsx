import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import { getReadingPreferences } from './features/preferences/preferencesSlice';
import { ToolsProvider } from './context/ToolsContext';
import ThemeProvider from './components/ThemeProvider';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookshelf from './pages/Bookshelf';
import Reader from './pages/Reader';
import Statistics from './pages/Statistics';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Share from './pages/Share';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in on app load
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
      dispatch(getReadingPreferences());
    }
  }, [dispatch]);

  return (
    <Router>
      <ToolsProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col themed-bg-secondary">
            <Navbar />
            <main className="flex-grow">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/share/:shareId" element={<Share />} />

            {/* Protected Routes */}
            <Route
              path="/bookshelf"
              element={
                <ProtectedRoute>
                  <Bookshelf />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reader/:id"
              element={
                <ProtectedRoute>
                  <Reader />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ToolsProvider>
    </Router>
  );
}

export default App
