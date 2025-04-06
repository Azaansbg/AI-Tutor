import { v4 as uuidv4 } from 'uuid';

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  isAvailable: boolean;
  apiKeyRequired: boolean;
  apiKey?: string;
  endpoint?: string;
  modelName: string;
  icon: string;
}

export interface LLMResponse {
  text: string;
  provider: string;
  confidence: number;
  tokensUsed: number;
  processingTime: number;
  metadata?: Record<string, any>;
}

export interface LLMRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
  providerId?: string;
}

class LLMService {
  private static instance: LLMService;
  private providers: LLMProvider[] = [
    {
      id: 'openai-gpt-4',
      name: 'GPT-4',
      description: 'OpenAI\'s most advanced model, capable of understanding and generating human-like text across a wide range of topics.',
      capabilities: ['text generation', 'code generation', 'mathematical reasoning', 'creative writing'],
      maxTokens: 8192,
      temperature: 0.7,
      isAvailable: true,
      apiKeyRequired: true,
      modelName: 'gpt-4',
      icon: '/icons/openai.svg'
    },
    {
      id: 'openai-gpt-3.5',
      name: 'GPT-3.5 Turbo',
      description: 'A faster and more cost-effective model, good for general-purpose tasks and quick responses.',
      capabilities: ['text generation', 'code generation', 'general knowledge'],
      maxTokens: 4096,
      temperature: 0.7,
      isAvailable: true,
      apiKeyRequired: true,
      modelName: 'gpt-3.5-turbo',
      icon: '/icons/openai.svg'
    },
    {
      id: 'anthropic-claude',
      name: 'Claude',
      description: 'Anthropic\'s Claude model, known for its helpful and harmless responses with strong reasoning capabilities.',
      capabilities: ['text generation', 'reasoning', 'analysis', 'creative writing'],
      maxTokens: 100000,
      temperature: 0.7,
      isAvailable: true,
      apiKeyRequired: true,
      modelName: 'claude-3-opus-20240229',
      icon: '/icons/anthropic.svg'
    },
    {
      id: 'google-gemini',
      name: 'Gemini',
      description: 'Google\'s multimodal model capable of understanding text, code, and images with strong reasoning abilities.',
      capabilities: ['text generation', 'code generation', 'multimodal', 'reasoning'],
      maxTokens: 32768,
      temperature: 0.7,
      isAvailable: true,
      apiKeyRequired: true,
      modelName: 'gemini-pro',
      icon: '/icons/google.svg'
    },
    {
      id: 'local-llama',
      name: 'Llama 3',
      description: 'Meta\'s open-source model that can run locally on your device for privacy and offline use.',
      capabilities: ['text generation', 'code generation', 'general knowledge'],
      maxTokens: 4096,
      temperature: 0.7,
      isAvailable: true,
      apiKeyRequired: false,
      modelName: 'llama-3-8b',
      icon: '/icons/meta.svg'
    }
  ];
  
  private activeProvider: LLMProvider | null = null;
  private requestHistory: Array<{ request: LLMRequest; response: LLMResponse; timestamp: number }> = [];
  
  private constructor() {
    // Set default provider
    this.activeProvider = this.providers.find(p => p.id === 'openai-gpt-3.5') || this.providers[0];
  }
  
  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }
  
  public getProviders(): LLMProvider[] {
    return [...this.providers];
  }
  
  public getActiveProvider(): LLMProvider | null {
    return this.activeProvider;
  }
  
  public setActiveProvider(providerId: string): boolean {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      this.activeProvider = provider;
      return true;
    }
    return false;
  }
  
  public setApiKey(providerId: string, apiKey: string): boolean {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.apiKey = apiKey;
      return true;
    }
    return false;
  }
  
  public async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    const provider = request.providerId 
      ? this.providers.find(p => p.id === request.providerId) 
      : this.activeProvider;
    
    if (!provider) {
      throw new Error('No LLM provider available');
    }
    
    if (provider.apiKeyRequired && !provider.apiKey) {
      throw new Error(`API key required for ${provider.name}`);
    }
    
    // In a real implementation, this would call the actual LLM API
    // For now, we'll simulate a response based on the provider
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const response: LLMResponse = {
      text: this.generateMockResponse(request, provider),
      provider: provider.id,
      confidence: 0.85 + Math.random() * 0.15,
      tokensUsed: Math.floor(50 + Math.random() * 200),
      processingTime: Date.now() - startTime,
      metadata: {
        model: provider.modelName,
        temperature: request.temperature || provider.temperature
      }
    };
    
    // Save to history
    this.requestHistory.push({
      request,
      response,
      timestamp: Date.now()
    });
    
    return response;
  }
  
  private generateMockResponse(request: LLMRequest, provider: LLMProvider): string {
    const prompt = request.prompt.toLowerCase();
    const context = request.context || '';
    
    // Different response styles based on provider
    switch (provider.id) {
      case 'openai-gpt-4':
        return `[GPT-4] I'm analyzing your question about "${prompt.substring(0, 30)}..." with my advanced capabilities. Based on the context provided, I can offer a comprehensive explanation. ${this.generateDetailedResponse(prompt)}`;
      
      case 'openai-gpt-3.5':
        return `[GPT-3.5] Let me help you with that. ${this.generateConciseResponse(prompt)}`;
      
      case 'anthropic-claude':
        return `[Claude] I'm Claude, and I'm here to help. Let me think about your question regarding "${prompt.substring(0, 30)}..." ${this.generateHelpfulResponse(prompt)}`;
      
      case 'google-gemini':
        return `[Gemini] I've analyzed your query about "${prompt.substring(0, 30)}..." and here's what I found: ${this.generateAnalyticalResponse(prompt)}`;
      
      case 'local-llama':
        return `[Llama] I'm running locally on your device. Here's my response to your question about "${prompt.substring(0, 30)}...": ${this.generateSimpleResponse(prompt)}`;
      
      default:
        return `I'm an AI assistant. Here's my response to your question about "${prompt.substring(0, 30)}...": ${this.generateDefaultResponse(prompt)}`;
    }
  }
  
  private generateDetailedResponse(prompt: string): string {
    return `This is a detailed response that would be generated by GPT-4. It would include comprehensive explanations, examples, and possibly references to research or studies. The response would be well-structured with clear sections and would address the question thoroughly.`;
  }
  
  private generateConciseResponse(prompt: string): string {
    return `This is a more concise response that would be generated by GPT-3.5. It would get straight to the point while still being informative and helpful.`;
  }
  
  private generateHelpfulResponse(prompt: string): string {
    return `I aim to be helpful and harmless in my responses. I'll provide information that's accurate and useful, while being mindful of potential biases or harmful content. I'll also acknowledge the limitations of my knowledge when appropriate.`;
  }
  
  private generateAnalyticalResponse(prompt: string): string {
    return `Based on my analysis, I can provide insights about this topic. I'll break down the key components, examine the relationships between different elements, and offer a structured explanation of the concepts involved.`;
  }
  
  private generateSimpleResponse(prompt: string): string {
    return `This is a simpler response that would be generated by a local model like Llama. It would be straightforward and to the point, without as much nuance or complexity as cloud-based models.`;
  }
  
  private generateDefaultResponse(prompt: string): string {
    return `This is a default response that would be generated if the specific provider's response style couldn't be determined. It would provide a general answer to the question.`;
  }
  
  public getRequestHistory(): Array<{ request: LLMRequest; response: LLMResponse; timestamp: number }> {
    return [...this.requestHistory];
  }
  
  public clearRequestHistory(): void {
    this.requestHistory = [];
  }
}

export default LLMService; 