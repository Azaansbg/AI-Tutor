import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, BookOpen, BarChart2, Settings, LogIn } from 'lucide-react';
import { subjects } from '../data/subjects';
import { Subject } from '../types';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { SearchProvider } from '../context/SearchContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showAITutor, setShowAITutor] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/profile');
  };

  const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {isAuthenticated ? `Welcome, ${user?.username}!` : 'Welcome to AI Tutor'}
            </h1>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </button>
            )}
          </div>

          <SearchBar />
          <SearchResults />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <button
              onClick={() => isAuthenticated ? setShowAITutor(!showAITutor) : navigate('/profile')}
              className="p-6 bg-card text-card-foreground rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-8 h-8 mb-4" />
              <h2 className="text-xl font-semibold mb-2">AI Tutor</h2>
              <p className="text-muted-foreground">
                Get help from your personal AI tutor
              </p>
            </button>

            {subjects.map((subject: Subject) => (
              <div
                key={subject.id}
                className="p-6 bg-card text-card-foreground rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{subject.icon}</span>
                  <span className={`text-sm font-medium ${getDifficultyColor(subject.difficulty)}`}>
                    {subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
                <p className="text-muted-foreground mb-4">{subject.description}</p>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Curriculum:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {subject.curriculum.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => isAuthenticated ? navigate(`/subjects/${subject.id}`) : navigate('/profile')}
                  className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
};

export default Dashboard; 