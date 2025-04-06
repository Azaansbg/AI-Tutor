import { OfflineData, AIModel, LessonContent } from '../types';

class OfflineDataManager {
  private static instance: OfflineDataManager;
  private offlineData: OfflineData | null = null;
  private db: IDBDatabase | null = null;
  private dbName = 'aiTutorDB';
  private dbVersion = 1;
  
  private constructor() {}
  
  static getInstance(): OfflineDataManager {
    if (!OfflineDataManager.instance) {
      OfflineDataManager.instance = new OfflineDataManager();
    }
    return OfflineDataManager.instance;
  }
  
  // Initialize the IndexedDB database
  async initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('Failed to open database');
        reject(false);
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('Database opened successfully');
        resolve(true);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('subjects')) {
          db.createObjectStore('subjects', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('lessons')) {
          db.createObjectStore('lessons', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('topics')) {
          db.createObjectStore('topics', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('lessonContents')) {
          db.createObjectStore('lessonContents', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('quizzes')) {
          db.createObjectStore('quizzes', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('aiModels')) {
          db.createObjectStore('aiModels', { keyPath: 'id' });
        }
        
        console.log('Database schema upgraded');
      };
    });
  }
  
  // Load offline data from IndexedDB
  async loadOfflineData(): Promise<OfflineData | null> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const subjects = await this.getAllFromStore('subjects');
      const lessons = await this.getAllFromStore('lessons');
      const topics = await this.getAllFromStore('topics');
      const lessonContentsArray = await this.getAllFromStore('lessonContents');
      const quizzes = await this.getAllFromStore('quizzes');
      const aiModels = await this.getAllFromStore('aiModels');
      
      // Convert lessonContents array to Record<string, LessonContent>
      const lessonContents: Record<string, LessonContent> = {};
      lessonContentsArray.forEach((content: any) => {
        if (content.id) {
          lessonContents[content.id] = content;
        }
      });
      
      this.offlineData = {
        subjects,
        lessons,
        topics,
        lessonContents,
        quizzes,
        aiModels
      };
      
      return this.offlineData;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }
  
  // Save offline data to IndexedDB
  async saveOfflineData(data: OfflineData): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }
    
    try {
      // Clear existing data
      await this.clearAllStores();
      
      // Save new data
      await this.saveToStore('subjects', data.subjects);
      await this.saveToStore('lessons', data.lessons);
      await this.saveToStore('topics', data.topics);
      
      // Convert lessonContents Record to array for storage
      const lessonContentsArray = Object.entries(data.lessonContents).map(([id, content]) => ({
        id,
        ...content
      }));
      await this.saveToStore('lessonContents', lessonContentsArray);
      
      await this.saveToStore('quizzes', data.quizzes);
      await this.saveToStore('aiModels', data.aiModels);
      
      this.offlineData = data;
      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  }
  
  // Import offline data from a file
  async importFromFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as OfflineData;
          const success = await this.saveOfflineData(data);
          resolve(success);
        } catch (error) {
          console.error('Failed to parse offline data file:', error);
          reject(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Failed to read file');
        reject(false);
      };
      
      reader.readAsText(file);
    });
  }
  
  // Export offline data to a file
  async exportToFile(): Promise<Blob | null> {
    if (!this.offlineData) {
      console.error('No offline data to export');
      return null;
    }
    
    try {
      const json = JSON.stringify(this.offlineData, null, 2);
      return new Blob([json], { type: 'application/json' });
    } catch (error) {
      console.error('Failed to export offline data:', error);
      return null;
    }
  }
  
  // Get the current offline data
  getOfflineData(): OfflineData | null {
    return this.offlineData;
  }
  
  // Check if a specific AI model is available offline
  isModelAvailableOffline(modelId: string): boolean {
    if (!this.offlineData) {
      return false;
    }
    
    return this.offlineData.aiModels.some(model => model.id === modelId);
  }
  
  // Get the size of the offline data
  getOfflineDataSize(): number {
    if (!this.offlineData) {
      return 0;
    }
    
    // Calculate approximate size in MB
    const json = JSON.stringify(this.offlineData);
    return Math.round(json.length / (1024 * 1024) * 100) / 100;
  }
  
  // Helper method to get all items from a store
  private getAllFromStore(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to get items from ${storeName}`));
      };
    });
  }
  
  // Helper method to save items to a store
  private saveToStore(storeName: string, items: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      items.forEach(item => {
        store.put(item);
      });
      
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = () => {
        reject(new Error(`Failed to save items to ${storeName}`));
      };
    });
  }
  
  // Helper method to clear all stores
  private clearAllStores(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const storeNames = Array.from(this.db.objectStoreNames);
      let completed = 0;
      let hasError = false;
      
      storeNames.forEach(storeName => {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          completed++;
          if (completed === storeNames.length && !hasError) {
            resolve();
          }
        };
        
        request.onerror = () => {
          hasError = true;
          reject(new Error(`Failed to clear ${storeName}`));
        };
      });
    });
  }
}

export default OfflineDataManager; 