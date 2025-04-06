import { AccessibilitySettings } from '../types';

class AccessibilityService {
  private static instance: AccessibilityService;
  private settings: AccessibilitySettings = {
    highContrast: false,
    textToSpeech: false,
    speechToText: false,
    reducedMotion: false,
    dyslexiaFriendly: false
  };
  
  private speechSynthesis: SpeechSynthesis | null = null;
  private speechRecognition: any | null = null;
  
  private constructor() {
    // Initialize speech synthesis if available
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore - webkitSpeechRecognition is not in the TypeScript definitions
      this.speechRecognition = new window.webkitSpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
    }
  }
  
  static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }
  
  // Apply accessibility settings
  applySettings(settings: AccessibilitySettings): void {
    this.settings = settings;
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Apply dyslexia-friendly font
    if (settings.dyslexiaFriendly) {
      document.documentElement.classList.add('dyslexia-friendly');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
    }
    
    console.log('Accessibility settings applied');
  }
  
  // Get current accessibility settings
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }
  
  // Speak text using text-to-speech
  speakText(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis || !this.settings.textToSpeech) {
      console.warn('Text-to-speech not available or disabled');
      return;
    }
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set up event handlers
    utterance.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };
    
    // Speak the text
    this.speechSynthesis.speak(utterance);
  }
  
  // Start speech recognition
  startSpeechRecognition(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.speechRecognition || !this.settings.speechToText) {
      console.warn('Speech recognition not available or disabled');
      if (onError) {
        onError('Speech recognition not available or disabled');
      }
      return;
    }
    
    // Set up event handlers
    this.speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    
    this.speechRecognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (onError) {
        onError(event.error);
      }
    };
    
    // Start recognition
    this.speechRecognition.start();
  }
  
  // Stop speech recognition
  stopSpeechRecognition(): void {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
  
  // Increase text size
  increaseTextSize(): void {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize + 2}px`;
  }
  
  // Decrease text size
  decreaseTextSize(): void {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`;
  }
  
  // Reset text size
  resetTextSize(): void {
    document.documentElement.style.fontSize = '16px';
  }
  
  // Add keyboard shortcuts
  setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl + Alt + T: Toggle text-to-speech
      if (event.ctrlKey && event.altKey && event.key === 't') {
        this.settings.textToSpeech = !this.settings.textToSpeech;
        console.log(`Text-to-speech ${this.settings.textToSpeech ? 'enabled' : 'disabled'}`);
      }
      
      // Ctrl + Alt + S: Toggle speech-to-text
      if (event.ctrlKey && event.altKey && event.key === 's') {
        this.settings.speechToText = !this.settings.speechToText;
        console.log(`Speech-to-text ${this.settings.speechToText ? 'enabled' : 'disabled'}`);
      }
      
      // Ctrl + Alt + H: Toggle high contrast
      if (event.ctrlKey && event.altKey && event.key === 'h') {
        this.settings.highContrast = !this.settings.highContrast;
        this.applySettings(this.settings);
      }
      
      // Ctrl + Alt + D: Toggle dyslexia-friendly font
      if (event.ctrlKey && event.altKey && event.key === 'd') {
        this.settings.dyslexiaFriendly = !this.settings.dyslexiaFriendly;
        this.applySettings(this.settings);
      }
      
      // Ctrl + Alt + R: Toggle reduced motion
      if (event.ctrlKey && event.altKey && event.key === 'r') {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        this.applySettings(this.settings);
      }
    });
  }
  
  // Add focus indicators to interactive elements
  addFocusIndicators(): void {
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 3px solid #4a90e2 !important;
        outline-offset: 2px !important;
      }
      
      .high-contrast *:focus {
        outline: 3px solid #ffff00 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add skip links for keyboard navigation
  addSkipLinks(): void {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #4a90e2;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.id = 'main-content';
    }
  }
}

export default AccessibilityService; 