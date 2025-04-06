import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      // Close the sign-in form
      setShowSignIn(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      // Close the sign-up form
      setShowSignUp(false);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Profile</h2>
            <p className="mt-2 text-muted-foreground">
              {isAuthenticated 
                ? `Welcome, ${user?.username || 'User'}!` 
                : 'Sign in to access your profile'}
            </p>
          </div>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium text-foreground mb-2">Account Information</h3>
                <p className="text-muted-foreground">Username: {user?.username}</p>
                <p className="text-muted-foreground">Member since: {new Date().toLocaleDateString()}</p>
              </div>
              
              <button
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!showSignIn && !showSignUp && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                  
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </button>
                </div>
              )}

              {showSignIn && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-foreground">Sign In</h3>
                    <button 
                      onClick={() => setShowSignIn(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-foreground">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showSignUp && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-foreground">Create Account</h3>
                    <button 
                      onClick={() => setShowSignUp(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label htmlFor="signup-username" className="block text-sm font-medium text-foreground">
                        Username
                      </label>
                      <input
                        id="signup-username"
                        name="username"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-foreground">
                        Password
                      </label>
                      <input
                        id="signup-password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 