import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import SubjectPage from './components/SubjectPage';
import Navbar from './components/Navbar';
import ProgressNavbar from './components/ProgressNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <ProgressNavbar />
            <div className="pl-64">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/subjects/:subjectId"
                  element={
                    <ProtectedRoute>
                      <SubjectPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;