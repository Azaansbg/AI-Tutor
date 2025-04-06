import React from 'react';
import { Lesson } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';
import { subjects } from '../data/subjects';

interface LessonListProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonList({ lessons, onSelectLesson }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No lessons found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => {
        const subject = subjects.find(s => s.id === lesson.subjectId);
        
        return (
          <div
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
                  <span className="text-sm text-gray-500">({subject?.name})</span>
                </div>
                <p className="text-gray-600">{lesson.content}</p>
              </div>
              {lesson.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}