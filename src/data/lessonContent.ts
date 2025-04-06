import { LessonContent } from '../types';

export const lessonContents: Record<string, LessonContent> = {
  'math-functions-1': {
    title: 'Introduction to Functions',
    topic: 'Functions and Graphs',
    content: `
      A function is a relation between a set of inputs (domain) and a set of possible outputs (range), where each input corresponds to exactly one output.

      Key Concepts:
      1. Function Definition
      - A rule that assigns each element in the domain to exactly one element in the range
      - Notation: f(x) represents the output of function f for input x

      2. Domain and Range
      - Domain: all possible input values
      - Range: all possible output values
      - Example: For f(x) = x², domain is all real numbers, range is all non-negative real numbers

      3. Function Operations
      - Addition: (f + g)(x) = f(x) + g(x)
      - Subtraction: (f - g)(x) = f(x) - g(x)
      - Multiplication: (f × g)(x) = f(x) × g(x)
      - Composition: (f ∘ g)(x) = f(g(x))
    `,
    examples: [
      {
        problem: 'Determine if y = x² is a function.',
        solution: 'Yes, y = x² is a function because each x-value corresponds to exactly one y-value.',
        explanation: 'For any input x, there is only one possible output (x²). This satisfies the definition of a function.',
        difficulty: 'beginner'
      },
      {
        problem: 'Find the domain and range of f(x) = √x.',
        solution: 'Domain: [0,∞), Range: [0,∞)',
        explanation: 'Since we cannot take the square root of negative numbers, the domain starts at 0. The range also starts at 0 since √0 = 0.',
        difficulty: 'intermediate'
      }
    ],
    interactiveElements: [
      {
        id: 'function-grapher',
        type: 'simulation',
        title: 'Function Grapher',
        content: 'Interactive tool to visualize functions and their graphs.',
        data: {
          defaultFunction: 'x^2',
          xRange: [-10, 10],
          yRange: [-10, 10]
        }
      }
    ],
    voiceCommands: [
      {
        command: 'explain function',
        action: 'explain_concept',
        description: 'Explains what a function is and its basic properties'
      },
      {
        command: 'show example',
        action: 'show_example',
        description: 'Shows a practical example of a function'
      }
    ]
  },
  'math-functions-2': {
    title: 'Linear Functions and Graphs',
    topic: 'Functions and Graphs',
    content: `
      Linear functions are the simplest type of functions, represented by the equation y = mx + b.

      Key Concepts:
      1. Slope (m)
      - Measures the steepness of the line
      - m = (y₂ - y₁)/(x₂ - x₁)
      - Positive slope: line goes up from left to right
      - Negative slope: line goes down from left to right

      2. Y-intercept (b)
      - The point where the line crosses the y-axis
      - Occurs when x = 0
      - Point is always (0, b)

      3. Graphing Linear Functions
      - Plot y-intercept
      - Use slope to find additional points
      - Connect points with a straight line
    `,
    examples: [
      {
        problem: 'Graph y = 2x + 3',
        solution: 'Plot (0,3), then use slope of 2 to plot more points like (1,5) and (2,7).',
        explanation: 'Start at y-intercept (0,3). For each +1 in x, add 2 to y (slope = 2).',
        difficulty: 'beginner'
      },
      {
        problem: 'Find the slope between points (2,5) and (4,9)',
        solution: 'm = (9-5)/(4-2) = 4/2 = 2',
        explanation: 'Use slope formula: m = (y₂-y₁)/(x₂-x₁) = (9-5)/(4-2) = 4/2 = 2',
        difficulty: 'intermediate'
      }
    ],
    interactiveElements: [
      {
        id: 'linear-grapher',
        type: 'simulation',
        title: 'Linear Function Grapher',
        content: 'Plot linear functions and explore slope and y-intercept.',
        data: {
          defaultFunction: '2x + 3',
          showSlope: true,
          showIntercept: true
        }
      }
    ],
    voiceCommands: [
      {
        command: 'explain slope',
        action: 'explain_concept',
        description: 'Explains what slope is and how to calculate it'
      },
      {
        command: 'graph line',
        action: 'show_graph',
        description: 'Shows how to graph a linear function'
      }
    ]
  }
};