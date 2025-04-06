import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjects } from '../data/subjects';
import { lessons } from '../data/lessons';
import { ArrowLeft, CheckCircle, Circle, Clock, BarChart2 } from 'lucide-react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { SearchProvider } from '../context/SearchContext';
import StorageService from '../services/storage';

const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const storage = StorageService.getInstance();

  const subject = subjects.find(s => s.id === subjectId);
  const subjectLessons = lessons.filter(l => l.subjectId === subjectId);
  
  // Get progress for all lessons in this subject
  const lessonProgress = subjectLessons.reduce((acc, lesson) => {
    const progress = storage.getProgress(lesson.id);
    if (progress) {
      acc[lesson.id] = progress;
    }
    return acc;
  }, {} as Record<string, any>);

  // Calculate subject progress
  const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;
  const progressPercentage = Math.round((completedLessons / subjectLessons.length) * 100);

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <SearchProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
            <p className="text-muted-foreground">{subject.description}</p>
          </div>
        </div>

        {/* Subject Progress Overview */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Progress Overview
            </h2>
            <span className="text-lg font-medium">{progressPercentage}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {completedLessons} of {subjectLessons.length} lessons completed
          </p>
        </div>

        <SearchBar />
        <SearchResults />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Available Lessons</h2>
          <div className="space-y-4">
            {subjectLessons.map(lesson => {
              const progress = lessonProgress[lesson.id];
              return (
                <div
                  key={lesson.id}
                  className="p-6 bg-card text-card-foreground rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{lesson.title}</h3>
                        {progress?.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{lesson.content}</p>
                    </div>
                    {progress && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {progress.quizScore ? `${progress.quizScore}%` : 'In Progress'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progress.timeSpent} minutes spent
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.estimatedTime} minutes
                      </span>
                      <span className={`text-sm font-medium ${
                        lesson.difficulty === 'beginner'
                          ? 'text-green-500'
                          : lesson.difficulty === 'intermediate'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}>
                        {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/lessons/${lesson.id}`)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      {progress?.completed ? 'Review' : 'Start Lesson'}
                    </button>
                  </div>
                  {lesson.prerequisites.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Prerequisites:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {lesson.prerequisites.map(prereq => {
                          const prerequisiteLesson = lessons.find(l => l.id === prereq);
                          const prereqProgress = lessonProgress[prereq];
                          return (
                            <li key={prereq} className="flex items-center gap-2">
                              <span>{prerequisiteLesson?.title || prereq}</span>
                              {prereqProgress?.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
};

export default SubjectPage; 