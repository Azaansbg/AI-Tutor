import { Book, Code2, FlaskRound as Flask, Pi } from 'lucide-react';
import { Subject } from '../types';

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Learn fundamental mathematical concepts, from basic arithmetic to advanced calculus.',
    icon: '📐',
    difficulty: 'intermediate',
    curriculum: [
      'Unit 1: Algebra',
      'Unit 2: Functions and Graphs',
      'Unit 3: Geometry',
      'Unit 4: Calculus',
      'Unit 5: Statistics'
    ],
    severity: 2
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Explore the fundamental laws that govern the universe, from mechanics to quantum physics.',
    icon: '⚛️',
    difficulty: 'advanced',
    curriculum: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics'],
    severity: 3
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Study life and living organisms, from cellular processes to ecosystems.',
    icon: '🧬',
    difficulty: 'intermediate',
    curriculum: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology'],
    severity: 2
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Understand the composition, structure, and properties of matter.',
    icon: '🧪',
    difficulty: 'advanced',
    curriculum: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    severity: 3
  },
  {
    id: 'cs',
    name: 'Computer Science',
    description: 'Learn programming, algorithms, and computer systems.',
    icon: '💻',
    difficulty: 'intermediate',
    curriculum: ['Programming', 'Data Structures', 'Algorithms', 'Computer Architecture'],
    severity: 2
  }
];