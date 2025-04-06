import React from 'react';
import { Topic } from '../types';
import { ChevronRight } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (topicId: string) => void;
}

export default function Sidebar({ topics, selectedTopic, onSelectTopic }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Topics</h2>
      <div className="space-y-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center justify-between ${
              selectedTopic === topic.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span>{topic.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
}