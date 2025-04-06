import React, { useState, useEffect } from 'react';
import { LessonContent as LessonContentType } from '../types';
import ReactMarkdown from 'react-markdown';
import Quiz from './Quiz';
import { quizzes } from '../data/quizzes';
import StorageService from '../services/storage';

interface LessonContentProps {
  content: LessonContentType;
}

export default function LessonContent({ content }: LessonContentProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const storage = StorageService.getInstance();
  const quiz = quizzes[content.title.toLowerCase().replace(/\s+/g, '-')];

  useEffect(() => {
    // Cache the lesson content when it's loaded
    const cachedContent = storage.getCachedLessonContent() || {};
    if (!cachedContent[content.title]) {
      cachedContent[content.title] = content;
      storage.cacheLessonContent(cachedContent);
    }
  }, [content]);

  const handleQuizComplete = (score: number) => {
    storage.saveProgress(content.title, {
      lessonId: content.title,
      completed: true,
      quizScore: score,
      lastAttempt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8">
      {!showQuiz ? (
        <>
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h1>
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown>{content.content}</ReactMarkdown>
            </div>
            {content.examples.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h2>
                <div className="space-y-6">
                  {content.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Problem:</h3>
                      <p className="text-gray-700 mb-4">{example.problem}</p>
                      <h3 className="font-semibold text-gray-900 mb-2">Solution:</h3>
                      <p className="text-gray-700 mb-4">{example.solution}</p>
                      <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
                      <p className="text-gray-700 whitespace-pre-line">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
            </button>
          </div>
        </>
      ) : (
        quiz && <Quiz quiz={quiz} onComplete={handleQuizComplete} />
      )}
    </div>
  );
}