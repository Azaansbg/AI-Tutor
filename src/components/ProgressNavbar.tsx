import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjects } from '../data/subjects';
import { lessons } from '../data/lessons';
import { BarChart2, BookOpen, CheckCircle, Circle, Clock, Award } from 'lucide-react';
import StorageService from '../services/storage';

const ProgressNavbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const storage = StorageService.getInstance();

  // Get progress for all lessons
  const lessonProgress = lessons.reduce((acc, lesson) => {
    const progress = storage.getProgress(lesson.id);
    if (progress) {
      acc[lesson.id] = progress;
    }
    return acc;
  }, {} as Record<string, any>);

  // Calculate overall progress
  const totalLessons = lessons.length;
  const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Calculate progress per subject
  const subjectProgress = subjects.map(subject => {
    const subjectLessons = lessons.filter(lesson => lesson.subjectId === subject.id);
    const completedSubjectLessons = subjectLessons.filter(lesson => lessonProgress[lesson.id]?.completed).length;
    const percentage = Math.round((completedSubjectLessons / subjectLessons.length) * 100);
    
    // Calculate average score for completed lessons
    const completedScores = subjectLessons
      .map(lesson => lessonProgress[lesson.id]?.quizScore)
      .filter(score => score !== undefined);
    const averageScore = completedScores.length > 0
      ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
      : 0;

    // Calculate total time spent
    const timeSpent = subjectLessons
      .reduce((total, lesson) => total + (lessonProgress[lesson.id]?.timeSpent || 0), 0);

    return {
      ...subject,
      progress: percentage,
      completedLessons: completedSubjectLessons,
      totalLessons: subjectLessons.length,
      averageScore,
      timeSpent
    };
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-card border-r border-border p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            Overall Progress
          </h2>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedLessons} of {totalLessons} lessons
            </span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Subjects
          </h3>
          {subjectProgress.map(subject => (
            <div
              key={subject.id}
              className="space-y-2 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
              onClick={() => navigate(`/subjects/${subject.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{subject.icon}</span>
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {subject.averageScore > 0 && (
                    <span className="text-sm font-medium text-primary">
                      {subject.averageScore}%
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {subject.progress}%
                  </span>
                </div>
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  {subject.completedLessons}/{subject.totalLessons}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {subject.timeSpent}m
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {subjectProgress
              .filter(subject => subject.progress === 100)
              .map(subject => (
                <div key={subject.id} className="text-sm text-muted-foreground">
                  Completed {subject.name} with {subject.averageScore}% average
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressNavbar; 