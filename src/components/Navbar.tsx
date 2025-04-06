import React from 'react';
import { BookOpen, BarChart2, Settings, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const currentPage = location.pathname.slice(1) || 'home';

  return (
    <nav className="bg-card text-card-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <BookOpen className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold">AI Tutor</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`hover:bg-accent px-3 py-2 rounded-md ${
                currentPage === 'home' ? 'bg-accent' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/progress')}
              className={`hover:bg-accent px-3 py-2 rounded-md flex items-center ${
                currentPage === 'progress' ? 'bg-accent' : ''
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Progress
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`hover:bg-accent px-3 py-2 rounded-md flex items-center ${
                currentPage === 'settings' ? 'bg-accent' : ''
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`hover:bg-accent px-3 py-2 rounded-md flex items-center ${
                currentPage === 'profile' ? 'bg-accent' : ''
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              {isAuthenticated ? 'Profile' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}