import React from 'react';
import { ExternalLink, Bot, Globe } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const SearchResults: React.FC = () => {
  const { searchResults, isLoading } = useSearch();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 p-4">
      {searchResults.map((result, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2 mb-3">
            {result.source === 'ai' ? (
              <Bot className="w-5 h-5 text-primary" />
            ) : (
              <Globe className="w-5 h-5 text-primary" />
            )}
            <h3 className="text-lg font-semibold">{result.title}</h3>
          </div>
          
          <p className="text-muted-foreground mb-4">{result.content}</p>
          
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Learn more
            </a>
          )}
          
          {result.timestamp && (
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(result.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults; 