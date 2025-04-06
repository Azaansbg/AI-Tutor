import React from 'react';
import { Book, Code2, FlaskRound as Flask, Pi } from 'lucide-react';
import { Subject } from '../types';

const iconMap = {
  Book,
  Code2,
  Flask,
  Pi,
};

interface SubjectCardProps {
  subject: Subject;
  onClick: (id: string) => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const Icon = iconMap[subject.icon as keyof typeof iconMap];

  return (
    <div 
      onClick={() => onClick(subject.id)}
      className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
          <p className="text-gray-500">{subject.description}</p>
        </div>
      </div>
    </div>
  );
}