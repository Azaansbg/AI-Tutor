import { Achievement, UserProfile, Progress } from '../types';
import StorageService from './storage';

class GamificationService {
  private static instance: GamificationService;
  private storage = StorageService.getInstance();
  private userProfile: UserProfile | null = null;
  
  private constructor() {}
  
  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }
  
  // Set the user profile
  setUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
    console.log(`Gamification profile set for ${profile.name}`);
  }
  
  // Get the user profile
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }
  
  // Add points to the user's profile
  addPoints(points: number): void {
    if (!this.userProfile) {
      console.error('User profile not set');
      return;
    }
    
    // In a real implementation, this would update the user's points
    console.log(`Added ${points} points to user profile`);
  }
  
  // Award an achievement to the user
  awardAchievement(achievement: Achievement): void {
    if (!this.userProfile) {
      console.error('User profile not set');
      return;
    }
    
    // Check if the achievement is already awarded
    const existingAchievement = this.userProfile.achievements.find(a => a.id === achievement.id);
    if (existingAchievement) {
      console.log(`Achievement ${achievement.title} already awarded`);
      return;
    }
    
    // Add the achievement to the user's profile
    this.userProfile.achievements.push(achievement);
    console.log(`Awarded achievement: ${achievement.title}`);
    
    // Save the updated profile
    this.saveUserProfile();
  }
  
  // Check if an achievement is awarded
  hasAchievement(achievementId: string): boolean {
    if (!this.userProfile) {
      return false;
    }
    
    return this.userProfile.achievements.some(a => a.id === achievementId);
  }
  
  // Get all achievements
  getAchievements(): Achievement[] {
    if (!this.userProfile) {
      return [];
    }
    
    return [...this.userProfile.achievements];
  }
  
  // Update the user's learning path
  updateLearningPath(completedLessonId: string): void {
    if (!this.userProfile) {
      console.error('User profile not set');
      return;
    }
    
    // Add the completed lesson to the user's learning path
    if (!this.userProfile.learningPath.completedLessons.includes(completedLessonId)) {
      this.userProfile.learningPath.completedLessons.push(completedLessonId);
      
      // Remove from recommended lessons if present
      this.userProfile.learningPath.recommendedLessons = this.userProfile.learningPath.recommendedLessons.filter(
        id => id !== completedLessonId
      );
      
      console.log(`Updated learning path: completed lesson ${completedLessonId}`);
      
      // Save the updated profile
      this.saveUserProfile();
    }
  }
  
  // Get recommended lessons
  getRecommendedLessons(): string[] {
    if (!this.userProfile) {
      return [];
    }
    
    return [...this.userProfile.learningPath.recommendedLessons];
  }
  
  // Add recommended lessons
  addRecommendedLessons(lessonIds: string[]): void {
    if (!this.userProfile) {
      console.error('User profile not set');
      return;
    }
    
    // Add new recommended lessons
    lessonIds.forEach(id => {
      if (!this.userProfile!.learningPath.recommendedLessons.includes(id)) {
        this.userProfile!.learningPath.recommendedLessons.push(id);
      }
    });
    
    console.log(`Added ${lessonIds.length} recommended lessons`);
    
    // Save the updated profile
    this.saveUserProfile();
  }
  
  // Check for achievements based on progress
  checkAchievements(progress: Progress): void {
    if (!this.userProfile) {
      console.error('User profile not set');
      return;
    }
    
    // Example achievement checks
    this.checkCompletionAchievements();
    this.checkStreakAchievements();
    this.checkPerformanceAchievements(progress);
  }
  
  // Check completion-based achievements
  private checkCompletionAchievements(): void {
    if (!this.userProfile) {
      return;
    }
    
    const completedLessons = this.userProfile.learningPath.completedLessons.length;
    
    // Award achievements based on completion milestones
    if (completedLessons >= 5 && !this.hasAchievement('complete-5-lessons')) {
      this.awardAchievement({
        id: 'complete-5-lessons',
        title: 'Getting Started',
        description: 'Complete 5 lessons',
        icon: '🎓',
        dateEarned: new Date().toISOString()
      });
    }
    
    if (completedLessons >= 10 && !this.hasAchievement('complete-10-lessons')) {
      this.awardAchievement({
        id: 'complete-10-lessons',
        title: 'Dedicated Learner',
        description: 'Complete 10 lessons',
        icon: '📚',
        dateEarned: new Date().toISOString()
      });
    }
    
    if (completedLessons >= 25 && !this.hasAchievement('complete-25-lessons')) {
      this.awardAchievement({
        id: 'complete-25-lessons',
        title: 'Knowledge Seeker',
        description: 'Complete 25 lessons',
        icon: '🔍',
        dateEarned: new Date().toISOString()
      });
    }
  }
  
  // Check streak-based achievements
  private checkStreakAchievements(): void {
    // In a real implementation, this would check for consecutive days of learning
    // For now, we'll just log a message
    console.log('Checking streak achievements');
  }
  
  // Check performance-based achievements
  private checkPerformanceAchievements(progress: Progress): void {
    if (!this.userProfile) {
      return;
    }
    
    // Check for high quiz scores
    if (progress.quizScore && progress.quizScore >= 90 && !this.hasAchievement('perfect-score')) {
      this.awardAchievement({
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Achieve a score of 90% or higher on a quiz',
        icon: '🌟',
        dateEarned: new Date().toISOString()
      });
    }
    
    // Check for improvement
    if (progress.strengths.length > 0 && !this.hasAchievement('improving-learner')) {
      this.awardAchievement({
        id: 'improving-learner',
        title: 'On the Rise',
        description: 'Show improvement in your learning',
        icon: '📈',
        dateEarned: new Date().toISOString()
      });
    }
  }
  
  // Save the user profile
  private saveUserProfile(): void {
    if (!this.userProfile) {
      return;
    }
    
    // In a real implementation, this would save the profile to a database
    // For now, we'll just log a message
    console.log('Saving user profile');
  }
  
  // Get the user's level
  getLevel(): number {
    if (!this.userProfile) {
      return 1;
    }
    
    return this.userProfile.learningPath.currentLevel;
  }
  
  // Update the user's level
  updateLevel(): void {
    if (!this.userProfile) {
      return;
    }
    
    // Simple level calculation based on completed lessons
    const completedLessons = this.userProfile.learningPath.completedLessons.length;
    const newLevel = Math.floor(completedLessons / 5) + 1;
    
    if (newLevel > this.userProfile.learningPath.currentLevel) {
      this.userProfile.learningPath.currentLevel = newLevel;
      console.log(`Level up! Now at level ${newLevel}`);
      
      // Award level-up achievement
      this.awardAchievement({
        id: `level-${newLevel}`,
        title: `Level ${newLevel}`,
        description: `Reach level ${newLevel}`,
        icon: '🏆',
        dateEarned: new Date().toISOString()
      });
      
      // Save the updated profile
      this.saveUserProfile();
    }
  }
}

export default GamificationService; 