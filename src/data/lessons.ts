export interface Lesson {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites: string[];
  completed: boolean;
  severity: number;
}

export const lessons: Lesson[] = [
  {
    id: 'math-algebra-1',
    title: 'Introduction to Algebra',
    subjectId: 'math',
    content: 'Learn the basics of algebraic expressions and equations.',
    difficulty: 'beginner',
    estimatedTime: 45,
    prerequisites: [],
    completed: false,
    severity: 1
  },
  {
    id: 'math-functions-1',
    title: 'Introduction to Functions',
    subjectId: 'math',
    content: 'Understanding functions, domain, range, and basic function operations.',
    difficulty: 'intermediate',
    estimatedTime: 60,
    prerequisites: ['math-algebra-1'],
    completed: false,
    severity: 2
  },
  {
    id: 'math-functions-2',
    title: 'Linear Functions and Graphs',
    subjectId: 'math',
    content: 'Learn about linear functions, slope, intercepts, and graphing techniques.',
    difficulty: 'intermediate',
    estimatedTime: 75,
    prerequisites: ['math-functions-1'],
    completed: false,
    severity: 2
  },
  {
    id: 'math-functions-3',
    title: 'Quadratic Functions',
    subjectId: 'math',
    content: 'Explore quadratic functions, parabolas, and solving quadratic equations.',
    difficulty: 'intermediate',
    estimatedTime: 90,
    prerequisites: ['math-functions-2'],
    completed: false,
    severity: 2
  },
  {
    id: 'math-functions-4',
    title: 'Exponential and Logarithmic Functions',
    subjectId: 'math',
    content: 'Study exponential growth/decay and logarithmic functions.',
    difficulty: 'advanced',
    estimatedTime: 90,
    prerequisites: ['math-functions-3'],
    completed: false,
    severity: 3
  },
  {
    id: 'math-geometry-1',
    title: 'Basic Geometry Concepts',
    subjectId: 'math',
    content: 'Understand fundamental geometric shapes and their properties.',
    difficulty: 'beginner',
    estimatedTime: 60,
    prerequisites: [],
    completed: false,
    severity: 1
  },
  {
    id: 'physics-mechanics-1',
    title: 'Newton\'s Laws of Motion',
    subjectId: 'physics',
    content: 'Study the fundamental laws that describe the motion of objects.',
    difficulty: 'intermediate',
    estimatedTime: 90,
    prerequisites: ['math-algebra-1'],
    completed: false,
    severity: 2
  },
  {
    id: 'biology-cells-1',
    title: 'Cell Structure and Function',
    subjectId: 'biology',
    content: 'Explore the basic unit of life and its components.',
    difficulty: 'beginner',
    estimatedTime: 60,
    prerequisites: [],
    completed: false,
    severity: 1
  },
  {
    id: 'chemistry-atoms-1',
    title: 'Atomic Structure',
    subjectId: 'chemistry',
    content: 'Learn about the building blocks of matter.',
    difficulty: 'intermediate',
    estimatedTime: 75,
    prerequisites: [],
    completed: false,
    severity: 2
  },
  {
    id: 'cs-programming-1',
    title: 'Introduction to Programming',
    subjectId: 'cs',
    content: 'Get started with basic programming concepts and syntax.',
    difficulty: 'beginner',
    estimatedTime: 120,
    prerequisites: [],
    completed: false,
    severity: 1
  }
];