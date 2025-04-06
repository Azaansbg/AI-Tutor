import React, { useEffect } from 'react';
import { Moon, Sun, Type, Languages } from 'lucide-react';
import StorageService from '../services/storage';
import { UserSettings } from '../types';

export default function SettingsPage() {
  const storage = StorageService.getInstance();
  const settings = storage.getSettings();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    storage.saveSettings({ ...settings, theme });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    storage.saveSettings({ ...settings, fontSize });
  };

  const handleLanguageChange = (language: 'en') => {
    storage.saveSettings({ ...settings, language });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    settings.theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Sun className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-900 dark:text-white">Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    settings.theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Moon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-900 dark:text-white">Dark</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Text Size</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      settings.fontSize === size
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Type className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    <span className="capitalize text-gray-900 dark:text-white">{size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language</h3>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value as 'en')}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                </select>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                More languages coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}