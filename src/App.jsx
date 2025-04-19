import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import { ToolsProvider } from './context/ToolsContext';

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
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in on app load
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <ToolsProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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
      </ToolsProvider>
    </Router>
  );
}

export default App
