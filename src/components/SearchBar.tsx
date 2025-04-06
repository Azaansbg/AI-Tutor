import React, { useState } from 'react';
import { Search, Bot, Globe, Loader2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const SearchBar: React.FC = () => {
  const { searchMode, setSearchMode, search, isLoading, clearResults } = useSearch();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    }
  };

  const handleModeChange = (mode: 'ai' | 'web' | 'both') => {
    setSearchMode(mode);
    clearResults();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleModeChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            searchMode === 'ai'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-primary/10'
          }`}
          disabled={isLoading}
        >
          <Bot className="w-4 h-4" />
          AI Only
        </button>
        <button
          onClick={() => handleModeChange('web')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            searchMode === 'web'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-primary/10'
          }`}
          disabled={isLoading}
        >
          <Globe className="w-4 h-4" />
          Web Only
        </button>
        <button
          onClick={() => handleModeChange('both')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            searchMode === 'both'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-primary/10'
          }`}
          disabled={isLoading}
        >
          <Bot className="w-4 h-4" />
          <Globe className="w-4 h-4" />
          Both
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything or search for topics..."
          className="w-full px-4 py-3 pl-12 bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        {isLoading ? (
          <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        <button
          type="submit"
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;