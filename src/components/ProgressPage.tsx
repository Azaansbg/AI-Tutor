import React from 'react';
import { subjects } from '../data/subjects';
import { lessons } from '../data/lessons';
import { BarChart2, Award, BookOpen, Clock } from 'lucide-react';

interface CompletedLesson {
  completed: boolean;
  score: number;
  completedAt: string;
}

export default function ProgressPage() {
  const completedLessons: Record<string, CompletedLesson> = JSON.parse(
    localStorage.getItem('completedLessons') || '{}'
  );

  const stats = {
    totalLessons: lessons.length,
    completedLessons: Object.keys(completedLessons).length,
    averageScore: Object.values(completedLessons).reduce((acc, curr) => acc + curr.score, 0) / 
      (Object.keys(completedLessons).length || 1),
    lastCompleted: Object.values(completedLessons).length > 0 
      ? new Date(Math.max(...Object.values(completedLessons).map(l => new Date(l.completedAt).getTime())))
      : null
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
          <p className="mt-2 text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completedLessons}/{stats.totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart2 className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(stats.averageScore)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((stats.completedLessons / stats.totalLessons) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Activity</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.lastCompleted 
                    ? stats.lastCompleted.toLocaleDateString()
                    : 'No activity'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Progress */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Progress</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {subjects.map((subject) => {
              const subjectLessons = lessons.filter(l => l.subjectId === subject.id);
              const completedSubjectLessons = subjectLessons.filter(
                l => completedLessons[l.title]?.completed
              );

              return (
                <div key={subject.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                    <span className="text-sm text-gray-500">
                      {completedSubjectLessons.length}/{subjectLessons.length} completed
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {Math.round((completedSubjectLessons.length / subjectLessons.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${(completedSubjectLessons.length / subjectLessons.length) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {subjectLessons.map((lesson) => {
                      const lessonProgress = completedLessons[lesson.title];
                      return (
                        <div key={lesson.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{lesson.title}</span>
                          {lessonProgress ? (
                            <span className="font-medium text-indigo-600">
                              {lessonProgress.score}%
                            </span>
                          ) : (
                            <span className="text-gray-400">Not started</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}