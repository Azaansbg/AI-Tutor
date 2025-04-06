export interface AITutorPersona {
  id: string;
  name: string;
  personality: string;
  teachingStyle: string;
  voiceId: string;
  avatar: string;
}

export interface AITutorResponse {
  text: string;
  confidence: number;
  suggestedResources?: string[];
  followUpQuestions?: string[];
  metadata?: {
    llmProvider?: string;
    confidence?: number;
    [key: string]: any;
  };
}

export interface AITutorContext {
  lessonId?: string;
  previousMessages?: AITutorMessage[];
  userProfile?: {
    learningStyle?: string;
    difficulty?: string;
    interests?: string[];
  };
}

export interface AITutorSettings {
  persona: AITutorPersona;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  typingSpeed: number;
  responseLength: 'brief' | 'detailed' | 'comprehensive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  llmProviderId?: string;
}

export interface AITutorMessage {
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  metadata?: {
    llmProvider?: string;
    confidence?: number;
    [key: string]: any;
  };
}

export interface AITutorSession {
  id: string;
  startTime: number;
  messages: AITutorMessage[];
  context: AITutorContext;
  settings: AITutorSettings;
} 