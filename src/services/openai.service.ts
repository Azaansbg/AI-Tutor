import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  static async generateContent(prompt: string, maxTokens: number = 500) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor that provides clear, concise, and educational responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  static async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    try {
      const prompt = `Generate a ${difficulty} difficulty quiz about ${topic} with 5 multiple choice questions. Format the response as a JSON object with the following structure:
      {
        "questions": [
          {
            "question": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "correct option",
            "explanation": "explanation of the correct answer"
          }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor that creates educational quizzes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  static async generateExplanation(topic: string, concept: string) {
    try {
      const prompt = `Explain the concept of ${concept} in the context of ${topic}. Make it clear and educational, suitable for students.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor that provides clear explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating explanation:', error);
      throw new Error('Failed to generate explanation');
    }
  }
} 