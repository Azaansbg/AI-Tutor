import { 
  Lesson, 
  LessonContent, 
  Question, 
  UserProfile, 
  Progress, 
  AITutorPersona,
  AIModel,
  OfflineData
} from '../types';
import { 
  AITutorResponse, 
  AITutorContext, 
  AITutorSettings,
  AITutorMessage,
  AITutorSession
} from '../types/aiTutor';
import { v4 as uuidv4 } from 'uuid';
import LLMService, { LLMRequest } from './llmService';
import OfflineDataManager from './offlineDataManager';

class AITutorService {
  private static instance: AITutorService;
  private currentPersona: AITutorPersona | null = null;
  private userProfile: UserProfile | null = null;
  private offlineData: OfflineData | null = null;
  private loadedModels: Record<string, any> = {};
  private currentSession: AITutorSession | null = null;
  private settings: AITutorSettings = {
    persona: {
      id: 'default',
      name: 'Alex',
      personality: 'Friendly and encouraging',
      teachingStyle: 'Interactive and adaptive',
      voiceId: 'en-US-Neural2-F',
      avatar: '/avatars/default.png'
    },
    voiceEnabled: true,
    autoSpeak: false,
    typingSpeed: 50,
    responseLength: 'detailed',
    difficulty: 'intermediate'
  };
  private llmService = LLMService.getInstance();
  private offlineDataManager = OfflineDataManager.getInstance();
  
  private constructor() {
    // Initialize with default persona
    this.currentPersona = {
      id: 'default',
      name: 'Alex',
      personality: 'Friendly and encouraging',
      teachingStyle: 'Interactive and adaptive',
      voiceId: 'en-US-Neural2-F',
      avatar: '/avatars/default.png'
    };
    // Initialize offline data
    this.loadOfflineData();
  }

  static getInstance(): AITutorService {
    if (!AITutorService.instance) {
      AITutorService.instance = new AITutorService();
    }
    return AITutorService.instance;
  }

  private async loadOfflineData(): Promise<void> {
    try {
      this.offlineData = await this.offlineDataManager.loadOfflineData();
      console.log('Offline data loaded successfully');
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  // Initialize the AI tutor with offline data
  initialize(offlineData: OfflineData): void {
    this.offlineData = offlineData;
    console.log('AI Tutor initialized with offline data');
  }

  // Set the current AI tutor persona
  setPersona(persona: AITutorPersona): void {
    this.currentPersona = persona;
    this.settings.persona = persona;
    console.log(`AI Tutor persona set to ${persona.name}`);
  }

  // Get the current AI tutor persona
  getCurrentPersona(): AITutorPersona | null {
    return this.currentPersona;
  }

  // Set the user profile
  setUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
    console.log(`User profile set for ${profile.name}`);
  }

  // Get the user profile
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  // Load an AI model for offline use
  async loadModel(modelId: string): Promise<boolean> {
    if (!this.offlineData) {
      console.error('Offline data not initialized');
      return false;
    }

    const model = this.offlineData.aiModels.find(m => m.id === modelId);
    if (!model) {
      console.error(`Model ${modelId} not found in offline data`);
      return false;
    }

    try {
      // In a real implementation, this would load the model from IndexedDB or a local file
      // For now, we'll just simulate loading the model
      console.log(`Loading model ${model.name} (${model.size}MB)`);
      
      // Simulate model loading
      this.loadedModels[modelId] = {
        type: model.type,
        capabilities: model.capabilities,
        version: model.version
      };
      
      return true;
    } catch (error) {
      console.error(`Failed to load model ${modelId}:`, error);
      return false;
    }
  }

  // Generate a personalized response based on the user's question
  async generateResponse(
    userInput: string,
    context: AITutorContext = {}
  ): Promise<string> {
    const persona = this.currentPersona || this.settings.persona;
    
    // Prepare context for the LLM
    let contextString = '';
    if (context.lessonId && this.offlineData?.lessonContents[context.lessonId]) {
      const lessonContent = this.offlineData.lessonContents[context.lessonId];
      contextString = `Lesson: ${lessonContent.title}\nTopic: ${lessonContent.topic}\nContent: ${lessonContent.content.substring(0, 1000)}...`;
    }
    
    if (context.previousMessages && context.previousMessages.length > 0) {
      contextString += '\n\nPrevious conversation:\n';
      context.previousMessages.forEach(msg => {
        contextString += `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}\n`;
      });
    }
    
    if (context.userProfile) {
      contextString += `\n\nUser profile:\nLearning style: ${context.userProfile.learningStyle || 'Not specified'}\nDifficulty: ${context.userProfile.difficulty || 'Not specified'}\nInterests: ${context.userProfile.interests?.join(', ') || 'Not specified'}`;
    }
    
    // Create LLM request
    const llmRequest: LLMRequest = {
      prompt: this.formatPrompt(userInput, persona, contextString),
      context: contextString,
      temperature: 0.7,
      providerId: this.settings.llmProviderId // Use the selected LLM provider
    };
    
    try {
      // Get response from LLM service
      const llmResponse = await this.llmService.generateResponse(llmRequest);
      
      // Format the response based on the persona
      const formattedResponse = this.formatResponse(llmResponse.text, persona);
      
      // Add to session history if active
      if (this.currentSession) {
        this.addMessage({
          text: userInput,
          sender: 'user',
          metadata: {
            llmProvider: llmResponse.provider,
            confidence: llmResponse.confidence
          }
        });
        
        this.addMessage({
          text: formattedResponse,
          sender: 'ai',
          metadata: {
            llmProvider: llmResponse.provider,
            confidence: llmResponse.confidence
          }
        });
      }
      
      return formattedResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return `I apologize, but I'm having trouble generating a response right now. Please try again later.`;
    }
  }

  private formatPrompt(userInput: string, persona: AITutorPersona, context: string): string {
    return `You are ${persona.name}, an AI tutor with a ${persona.personality} personality and a ${persona.teachingStyle} teaching style.
    
Your task is to help the user learn and understand the material. Be helpful, encouraging, and adapt your explanations to the user's level of understanding.

${context ? `Context:\n${context}\n\n` : ''}

User question: ${userInput}

Please provide a helpful response that aligns with your personality and teaching style.`;
  }

  private formatResponse(response: string, persona: AITutorPersona): string {
    // Remove any provider prefixes that might be in the response
    const cleanResponse = response.replace(/^\[(GPT-4|GPT-3\.5|Claude|Gemini|Llama)\]\s*/i, '');
    
    // Add persona-specific formatting if needed
    if (persona.id === 'professor') {
      return `As your professor, I'd like to explain this in detail. ${cleanResponse}`;
    } else if (persona.id === 'coach') {
      return `Alright, let's tackle this together! ${cleanResponse}`;
    }
    
    return cleanResponse;
  }

  // Generate personalized learning recommendations
  generateRecommendations(): string[] {
    if (!this.userProfile || !this.offlineData) {
      return [];
    }

    // In a real implementation, this would use ML to generate personalized recommendations
    // For now, we'll return some basic recommendations
    return [
      'Complete the next lesson in your current subject',
      'Review concepts from your last lesson',
      'Try a quiz to test your knowledge',
      'Explore a new subject that interests you'
    ];
  }

  // Analyze user progress and provide feedback
  analyzeProgress(progress: Progress): string {
    if (!this.userProfile) {
      return 'User profile not set.';
    }

    // In a real implementation, this would use ML to analyze progress
    // For now, we'll return a basic analysis
    const strengths = progress.strengths.length > 0 
      ? `You're doing well with: ${progress.strengths.join(', ')}.` 
      : '';
    
    const weaknesses = progress.weaknesses.length > 0 
      ? `Areas to improve: ${progress.weaknesses.join(', ')}.` 
      : '';
    
    return `${strengths} ${weaknesses}`.trim() || 'Keep up the good work!';
  }

  // Generate a personalized quiz based on the user's learning history
  generatePersonalizedQuiz(lessonId: string): Question[] {
    if (!this.offlineData) {
      return [];
    }

    // In a real implementation, this would use ML to generate personalized questions
    // For now, we'll return some basic questions
    return [
      {
        id: 'q1',
        text: 'What is the main concept covered in this lesson?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This concept is fundamental to understanding the topic.',
        difficulty: 'beginner',
        type: 'multiple-choice'
      },
      {
        id: 'q2',
        text: 'True or False: This concept applies to all situations.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'This concept has specific applications and limitations.',
        difficulty: 'intermediate',
        type: 'true-false'
      }
    ];
  }

  // Provide voice-based tutoring
  async speakResponse(text: string): Promise<void> {
    if (!this.currentPersona) {
      return;
    }

    // In a real implementation, this would use the Web Speech API or a local TTS engine
    console.log(`Speaking: ${text} with voice ${this.currentPersona.voiceId}`);
  }

  // Process voice commands
  async processVoiceCommand(audioData: any): Promise<string> {
    if (!this.currentPersona) {
      return 'Voice processing not available.';
    }

    // In a real implementation, this would use a local speech recognition model
    // For now, we'll return a simulated response
    return 'Voice command processed. What would you like to learn about?';
  }

  // Adapt content difficulty based on user performance
  adaptDifficulty(currentDifficulty: 'beginner' | 'intermediate' | 'advanced', performance: number): 'beginner' | 'intermediate' | 'advanced' {
    // Simple adaptation logic
    if (performance < 0.6 && currentDifficulty !== 'beginner') {
      return 'beginner';
    } else if (performance > 0.8 && currentDifficulty !== 'advanced') {
      return 'advanced';
    }
    return currentDifficulty;
  }

  public getSettings(): AITutorSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AITutorSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public startSession(context: AITutorContext = {}): AITutorSession {
    const session: AITutorSession = {
      id: uuidv4(),
      startTime: Date.now(),
      messages: [],
      context,
      settings: { ...this.settings }
    };
    
    this.currentSession = session;
    return session;
  }

  public endSession(): void {
    if (this.currentSession) {
      // Here you would typically save the session data
      this.currentSession = null;
    }
  }

  public addMessage(message: Omit<AITutorMessage, 'timestamp'>): void {
    if (this.currentSession) {
      this.currentSession.messages.push({
        ...message,
        timestamp: Date.now()
      });
    }
  }

  public getSessionMessages(): AITutorMessage[] {
    return this.currentSession?.messages || [];
  }

  public async analyzeUserInput(input: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    suggestedTopics?: string[];
  }> {
    // Use LLM service to analyze the input
    const llmRequest: LLMRequest = {
      prompt: `Analyze the following user input and determine the sentiment (positive, negative, or neutral) and suggest related topics for further learning. Format your response as JSON with the following structure: {"sentiment": "positive|negative|neutral", "confidence": 0.0-1.0, "suggestedTopics": ["topic1", "topic2", "topic3"]}\n\nUser input: ${input}`,
      temperature: 0.3
    };
    
    try {
      const llmResponse = await this.llmService.generateResponse(llmRequest);
      
      // Parse the JSON response
      try {
        const analysis = JSON.parse(llmResponse.text);
        return {
          sentiment: analysis.sentiment || 'neutral',
          confidence: analysis.confidence || 0.8,
          suggestedTopics: analysis.suggestedTopics || []
        };
      } catch (e) {
        console.error('Failed to parse LLM response as JSON:', e);
        return {
          sentiment: 'neutral',
          confidence: 0.8,
          suggestedTopics: ['related topic 1', 'related topic 2']
        };
      }
    } catch (error) {
      console.error('Error analyzing user input:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.8,
        suggestedTopics: ['related topic 1', 'related topic 2']
      };
    }
  }

  public async getSuggestedResources(topic: string): Promise<string[]> {
    // Use LLM service to suggest resources
    const llmRequest: LLMRequest = {
      prompt: `Suggest 3 educational resources (books, websites, videos, etc.) for learning about "${topic}". Format your response as a JSON array of strings.`,
      temperature: 0.5
    };
    
    try {
      const llmResponse = await this.llmService.generateResponse(llmRequest);
      
      // Parse the JSON response
      try {
        const resources = JSON.parse(llmResponse.text);
        return Array.isArray(resources) ? resources : [
          `Resource 1 about ${topic}`,
          `Resource 2 about ${topic}`,
          `Resource 3 about ${topic}`
        ];
      } catch (e) {
        console.error('Failed to parse LLM response as JSON:', e);
        return [
          `Resource 1 about ${topic}`,
          `Resource 2 about ${topic}`,
          `Resource 3 about ${topic}`
        ];
      }
    } catch (error) {
      console.error('Error getting suggested resources:', error);
      return [
        `Resource 1 about ${topic}`,
        `Resource 2 about ${topic}`,
        `Resource 3 about ${topic}`
      ];
    }
  }

  public async generateFollowUpQuestions(topic: string): Promise<string[]> {
    // Use LLM service to generate follow-up questions
    const llmRequest: LLMRequest = {
      prompt: `Generate 3 follow-up questions about "${topic}" that would help a student deepen their understanding. Format your response as a JSON array of strings.`,
      temperature: 0.7
    };
    
    try {
      const llmResponse = await this.llmService.generateResponse(llmRequest);
      
      // Parse the JSON response
      try {
        const questions = JSON.parse(llmResponse.text);
        return Array.isArray(questions) ? questions : [
          `Can you tell me more about ${topic}?`,
          `How does ${topic} relate to what we learned earlier?`,
          `What are some practical applications of ${topic}?`
        ];
      } catch (e) {
        console.error('Failed to parse LLM response as JSON:', e);
        return [
          `Can you tell me more about ${topic}?`,
          `How does ${topic} relate to what we learned earlier?`,
          `What are some practical applications of ${topic}?`
        ];
      }
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [
        `Can you tell me more about ${topic}?`,
        `How does ${topic} relate to what we learned earlier?`,
        `What are some practical applications of ${topic}?`
      ];
    }
  }
}

export default AITutorService; 