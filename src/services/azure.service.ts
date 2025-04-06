import { OpenAI } from 'openai';
import { AzureKeyCredential } from '@azure/core-auth';
import dotenv from 'dotenv';

dotenv.config();

const azureClient = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || '',
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY || '' }
});

export class AzureService {
  static async generateContent(prompt: string, maxTokens: number = 500) {
    try {
      const completion = await azureClient.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor that provides clear, concise, and educational responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content with Azure:', error);
      throw new Error('Failed to generate content with Azure');
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

      const completion = await azureClient.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor that generates educational quizzes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content generated');
      }

      try {
        return JSON.parse(content);
      } catch (error) {
        console.error('Error parsing quiz JSON:', error);
        throw new Error('Failed to parse quiz data');
      }
    } catch (error) {
      console.error('Error generating quiz with Azure:', error);
      throw new Error('Failed to generate quiz with Azure');
    }
  }

  static async generateExplanation(topic: string, concept: string) {
    try {
      const prompt = `Explain the concept of ${concept} in the context of ${topic}. Make it clear and educational, suitable for students.`;

      const completion = await azureClient.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor that provides clear explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating explanation with Azure:', error);
      throw new Error('Failed to generate explanation with Azure');
    }
  }
} 