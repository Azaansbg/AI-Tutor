import { Quiz } from '../types';

export const quizzes: Record<string, Quiz> = {
  'math-1': {
    id: 'math-1',
    lessonId: 'math-1',
    questions: [
      {
        id: '1',
        text: 'What is a variable in algebra?',
        options: [
          'A fixed number that never changes',
          'A letter that represents an unknown value',
          'A mathematical operation',
          'A geometric shape'
        ],
        correctAnswer: 1
      },
      {
        id: '2',
        text: 'Which of the following is an algebraic expression?',
        options: [
          '2 + 2 = 4',
          'x = 5',
          '2x + 3',
          '> < ='
        ],
        correctAnswer: 2
      },
      {
        id: '3',
        text: 'In the equation x + 5 = 12, what is x?',
        options: [
          '5',
          '7',
          '12',
          '17'
        ],
        correctAnswer: 1
      },
      {
        id: '4',
        text: 'What is the simplified form of 3x + 2x + 5?',
        options: [
          '5x + 5',
          '6x',
          '5x',
          '10x'
        ],
        correctAnswer: 0
      },
      {
        id: '5',
        text: 'Which equation shows that two expressions are equal?',
        options: [
          'An algebraic expression',
          'A variable',
          'A coefficient',
          'An equation'
        ],
        correctAnswer: 3
      }
    ]
  },
  'math-2': {
    id: 'math-2',
    lessonId: 'math-2',
    questions: [
      {
        id: '1',
        text: 'What is the standard form of a linear equation?',
        options: [
          'y = mx + b',
          'ax² + bx + c',
          'a + b = c',
          'x + y = 1'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        text: 'In the equation y = 2x + 3, what is the slope?',
        options: [
          '3',
          '2',
          'x',
          'y'
        ],
        correctAnswer: 1
      },
      {
        id: '3',
        text: 'What does the y-intercept represent?',
        options: [
          'The slope of the line',
          'Where the line crosses the x-axis',
          'Where the line crosses the y-axis',
          'The steepness of the line'
        ],
        correctAnswer: 2
      },
      {
        id: '4',
        text: 'A car travels at 60 mph. How far will it go in 3 hours?',
        options: [
          '120 miles',
          '150 miles',
          '180 miles',
          '200 miles'
        ],
        correctAnswer: 2
      },
      {
        id: '5',
        text: 'Which is NOT a real-world application of linear equations?',
        options: [
          'Converting temperatures',
          'Calculating distance traveled',
          'Finding break-even points',
          'Calculating the area of a circle'
        ],
        correctAnswer: 3
      }
    ]
  }
};