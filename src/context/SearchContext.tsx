import React, { createContext, useContext, useState } from 'react';

interface SearchResult {
  source: 'ai' | 'web';
  title: string;
  content: string;
  url?: string;
  timestamp?: string;
  error?: string;
}

interface SearchContextType {
  searchResults: SearchResult[];
  isLoading: boolean;
  searchMode: 'ai' | 'web' | 'both';
  setSearchMode: (mode: 'ai' | 'web' | 'both') => void;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'ai' | 'web' | 'both'>('both');

  const clearResults = () => {
    setSearchResults([]);
  };

  const search = async (query: string) => {
    setIsLoading(true);
    clearResults(); // Clear previous results before new search

    try {
      const searchPromises = [];

      if (searchMode === 'ai' || searchMode === 'both') {
        // Call AI Search API
        searchPromises.push(
          fetch('http://localhost:5000/api/search/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          })
            .then(async response => {
              if (!response.ok) throw new Error('AI search failed');
              const aiData = await response.json();
              return {
                source: 'ai' as const,
                title: 'AI Response',
                content: aiData.response,
                timestamp: new Date().toISOString()
              };
            })
            .catch(error => ({
              source: 'ai' as const,
              title: 'AI Search Error',
              content: 'Failed to get AI response',
              error: error.message,
              timestamp: new Date().toISOString()
            }))
        );
      }

      if (searchMode === 'web' || searchMode === 'both') {
        // Call Web Search API
        searchPromises.push(
          fetch('http://localhost:5000/api/search/web', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          })
            .then(async response => {
              if (!response.ok) throw new Error('Web search failed');
              const webData = await response.json();
              return webData.results.map((result: any) => ({
                source: 'web' as const,
                title: result.title,
                content: result.snippet,
                url: result.url,
                timestamp: new Date().toISOString()
              }));
            })
            .catch(error => [{
              source: 'web' as const,
              title: 'Web Search Error',
              content: 'Failed to get web results',
              error: error.message,
              timestamp: new Date().toISOString()
            }])
        );
      }

      // Wait for all search promises to complete
      const results = await Promise.all(searchPromises);
      
      // Flatten and sort results by timestamp
      const flattenedResults = results
        .flat()
        .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime());

      setSearchResults(flattenedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([{
        source: 'web',
        title: 'Search Error',
        content: 'An unexpected error occurred during the search',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, isLoading, searchMode, setSearchMode, search, clearResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 