import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import AITutorService from '../services/aiTutor';
import AccessibilityService from '../services/accessibilityService';
import { AITutorPersona, AITutorMessage, AITutorSettings } from '../types/aiTutor';
import LLMService from '../services/llmService';
import { LLMProvider } from '../services/llmService';

interface AITutorInterfaceProps {
  lessonId?: string;
  onClose?: () => void;
}

const AITutorInterface: React.FC<AITutorInterfaceProps> = ({ lessonId, onClose }) => {
  const [messages, setMessages] = useState<AITutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [personas, setPersonas] = useState<AITutorPersona[]>([
    {
      id: 'default',
      name: 'Alex',
      personality: 'Friendly and encouraging',
      teachingStyle: 'Interactive and adaptive',
      voiceId: 'en-US-Neural2-F',
      avatar: '/avatars/default.png'
    },
    {
      id: 'professor',
      name: 'Dr. Smith',
      personality: 'Academic and thorough',
      teachingStyle: 'Detailed explanations with examples',
      voiceId: 'en-US-Neural2-M',
      avatar: '/avatars/professor.png'
    },
    {
      id: 'coach',
      name: 'Coach Mike',
      personality: 'Energetic and motivational',
      teachingStyle: 'Practice-focused with lots of encouragement',
      voiceId: 'en-US-Neural2-M',
      avatar: '/avatars/coach.png'
    }
  ]);
  const [selectedPersona, setSelectedPersona] = useState<AITutorPersona | null>(null);
  const [settings, setSettings] = useState<AITutorSettings | null>(null);
  const [llmProviders, setLlmProviders] = useState<LLMProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiTutorService = AITutorService.getInstance();
  const accessibilityService = AccessibilityService.getInstance();
  const llmService = LLMService.getInstance();
  
  useEffect(() => {
    // Load initial settings and persona
    const currentSettings = aiTutorService.getSettings();
    setSettings(currentSettings);
    setSelectedPersona(currentSettings.persona);
    setSelectedProvider(currentSettings.llmProviderId || '');

    // Load available LLM providers
    const providers = llmService.getProviders();
    setLlmProviders(providers);

    // Start a new session
    aiTutorService.startSession();
    
    // Initialize with default persona
    const currentPersona = aiTutorService.getCurrentPersona();
    if (currentPersona) {
      setSelectedPersona(currentPersona);
    } else if (personas.length > 0) {
      setSelectedPersona(personas[0]);
      aiTutorService.setPersona(personas[0]);
    }
    
    // Add welcome message
    setMessages([
      {
        text: `Hello! I'm ${selectedPersona?.name || 'your AI tutor'}. How can I help you learn today?`,
        sender: 'ai',
        timestamp: Date.now()
      }
    ]);
    
    // Setup accessibility features
    accessibilityService.addFocusIndicators();
    accessibilityService.addSkipLinks();
    accessibilityService.setupKeyboardShortcuts();
    
    // Cleanup
    return () => {
      if (isListening) {
        accessibilityService.stopSpeechRecognition();
      }
      if (isSpeaking) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
      }
      aiTutorService.endSession();
    };
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AITutorMessage = {
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiTutorService.generateResponse(input);
      
      const aiMessage: AITutorMessage = {
        text: response,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if text-to-speech is enabled
      const settings = accessibilityService.getSettings();
      if (settings.textToSpeech) {
        setIsSpeaking(true);
        accessibilityService.speakText(response, () => {
          setIsSpeaking(false);
        });
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: AITutorMessage = {
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      accessibilityService.stopSpeechRecognition();
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    accessibilityService.startSpeechRecognition(
      (text) => {
        setInput(text);
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  };
  
  // Handle persona selection
  const handlePersonaChange = (persona: AITutorPersona) => {
    setSelectedPersona(persona);
    aiTutorService.setPersona(persona);
    
    // Add system message about persona change
    setMessages(prev => [
      ...prev,
      {
        text: `I've switched to ${persona.name}. ${persona.personality}. I'll teach you using a ${persona.teachingStyle} approach.`,
        sender: 'ai',
        timestamp: Date.now()
      }
    ]);
  };
  
  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    if (settings) {
      const newSettings = { ...settings, llmProviderId: providerId };
      setSettings(newSettings);
      aiTutorService.updateSettings(newSettings);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          {selectedPersona && (
            <img 
              src={selectedPersona.avatar} 
              alt={selectedPersona.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/avatars/default.png';
              }}
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {selectedPersona?.name || 'AI Tutor'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedPersona?.personality || 'Your personal learning assistant'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <HelpCircle className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-border bg-muted">
          <h3 className="text-md font-semibold mb-2">Tutor Settings</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Select Tutor Persona</label>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {personas.map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaChange(persona)}
                    className={`flex flex-col items-center p-2 rounded-lg ${
                      selectedPersona?.id === persona.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="w-12 h-12 rounded-full mb-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/avatars/default.png';
                      }}
                    />
                    <span className="text-xs">{persona.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select LLM Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
              >
                <option value="">Select LLM Provider</option>
                {llmProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p>{message.text}</p>
              {message.metadata?.llmProvider && (
                <div className="text-xs text-muted-foreground">
                  Powered by {message.metadata.llmProvider}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
              <div className="typing-indicator">...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ${
              isListening ? 'bg-red-500 text-white' : 'hover:bg-muted'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or type a command..."
            className="flex-1 p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Send message"
            disabled={isTyping}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorInterface; 