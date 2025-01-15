// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UrlShortener from './components/url/UrlShortener';
import UrlList from './components/url/UrlList';
import UrlAnalytics from './components/url/UrlAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <UrlShortener />
                    <UrlList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/:shortId"
                element={
                  <ProtectedRoute>
                    <UrlAnalytics />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
