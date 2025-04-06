import { Lesson, Progress, Quiz, UserSettings } from '../types';

class StorageService {
  private static instance: StorageService;
  
  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Settings management
  saveSettings(settings: UserSettings): void {
    localStorage.setItem('settings', JSON.stringify(settings));
    this.applyTheme(settings.theme);
    this.applyFontSize(settings.fontSize);
  }

  getSettings(): UserSettings {
    const defaultSettings: UserSettings = {
      theme: 'light',
      fontSize: 'medium',
      language: 'en'
    };
    
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : defaultSettings;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }

  private applyFontSize(size: 'small' | 'medium' | 'large'): void {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizes[size];
  }

  // Progress tracking
  saveProgress(lessonId: string, progress: Progress): void {
    const progressData = this.getAllProgress();
    progressData[lessonId] = progress;
    localStorage.setItem('progress', JSON.stringify(progressData));
  }

  getProgress(lessonId: string): Progress | null {
    const progressData = this.getAllProgress();
    return progressData[lessonId] || null;
  }

  getAllProgress(): Record<string, Progress> {
    const progressData = localStorage.getItem('progress');
    return progressData ? JSON.parse(progressData) : {};
  }

  // Quiz answers
  saveQuizAnswers(quizId: string, answers: number[]): void {
    const quizData = this.getAllQuizAnswers();
    quizData[quizId] = answers;
    localStorage.setItem('quizAnswers', JSON.stringify(quizData));
  }

  getQuizAnswers(quizId: string): number[] | null {
    const quizData = this.getAllQuizAnswers();
    return quizData[quizId] || null;
  }

  private getAllQuizAnswers(): Record<string, number[]> {
    const quizData = localStorage.getItem('quizAnswers');
    return quizData ? JSON.parse(quizData) : {};
  }

  // Lesson content caching
  cacheLessonContent(lessons: Record<string, any>): void {
    localStorage.setItem('lessonContent', JSON.stringify(lessons));
  }

  getCachedLessonContent(): Record<string, any> | null {
    const content = localStorage.getItem('lessonContent');
    return content ? JSON.parse(content) : null;
  }

  // Quiz content caching
  cacheQuizContent(quizzes: Record<string, Quiz>): void {
    localStorage.setItem('quizContent', JSON.stringify(quizzes));
  }

  getCachedQuizContent(): Record<string, Quiz> | null {
    const content = localStorage.getItem('quizContent');
    return content ? JSON.parse(content) : null;
  }

  // Clear all cached data
  clearCache(): void {
    const settings = this.getSettings();
    localStorage.clear();
    this.saveSettings(settings);
  }
}

export default StorageService;