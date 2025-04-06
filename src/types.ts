import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  curriculum: string[]; // Array of curriculum topics
  severity: number; // Difficulty level from 1-3
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites: string[]; // IDs of lessons that should be completed first
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subjectId: string;
}

export interface LessonContent {
  title: string;
  topic: string;
  content: string;
  examples: Example[];
  interactiveElements: InteractiveElement[];
  voiceCommands: VoiceCommand[];
}

export interface Example {
  problem: string;
  solution: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'simulation' | 'experiment' | 'project';
  title: string;
  content: string;
  data: any; // Specific data for the interactive element
}

export interface VoiceCommand {
  command: string;
  action: string;
  description: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface Progress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  lastAttempt: string;
  timeSpent: number; // in minutes
  mistakes: Mistake[];
  strengths: string[];
  weaknesses: string[];
}

export interface Mistake {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  timestamp: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  voiceEnabled: boolean;
  accessibility: AccessibilitySettings;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  reducedMotion: boolean;
  dyslexiaFriendly: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  subjects: string[]; // Subject IDs the user is interested in
  learningGoals: string[];
  achievements: Achievement[];
  learningPath: LearningPath;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
}

export interface LearningPath {
  currentLevel: number;
  completedLessons: string[];
  recommendedLessons: string[];
  adaptiveDifficulty: boolean;
}

export interface AITutorPersona {
  id: string;
  name: string;
  personality: string;
  teachingStyle: string;
  voiceId: string;
  avatar: string;
}

export interface OfflineData {
  subjects: Subject[];
  lessons: Lesson[];
  topics: Topic[];
  lessonContents: Record<string, LessonContent>;
  quizzes: Quiz[];
  aiModels: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  type: 'nlp' | 'math' | 'science' | 'language';
  size: number; // in MB
  version: string;
  capabilities: string[];
}