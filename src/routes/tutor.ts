import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { IUser } from '../models/User';
import { LLMService } from '../services/llm.service';

const router = express.Router();
const llmService = new LLMService();

interface AuthRequest extends Request {
  user?: IUser;
}

interface TutorRequest {
  message: string;
  context?: {
    lessonId?: string;
    previousMessages?: Array<{ text: string; sender: 'user' | 'ai' }>;
    difficulty?: string;
    learningStyle?: string;
  };
  providerId?: string;
}

interface AnalysisRequest {
  text: string;
  type: 'sentiment' | 'topic' | 'difficulty';
}

// Generate tutor response
router.post('/chat', auth, async (req: AuthRequest & Request<{}, {}, TutorRequest>, res: Response) => {
  try {
    const { message, context, providerId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const response = await llmService.generateResponse({
      prompt: message,
      context: {
        ...context,
        userProfile: {
          learningStyle: user.learningPreferences.learningStyle,
          difficulty: user.learningPreferences.difficulty,
          interests: user.learningPreferences.interests
        }
      },
      providerId: providerId || user.settings?.preferredProvider
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating tutor response:', error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// Analyze text (sentiment, topic, difficulty)
router.post('/analyze', auth, async (req: AuthRequest & Request<{}, {}, AnalysisRequest>, res: Response) => {
  try {
    const { text, type } = req.body;

    const analysis = await llmService.analyzeText(text, type);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Error analyzing text' });
  }
});

// Get suggested resources
router.get('/resources/:topic', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const resources = await llmService.getSuggestedResources(topic, {
      difficulty: user.learningPreferences.difficulty,
      interests: user.learningPreferences.interests
    });

    res.json(resources);
  } catch (error) {
    console.error('Error getting resources:', error);
    res.status(500).json({ error: 'Error getting resources' });
  }
});

// Generate practice questions
router.post('/questions', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count = 3, type = 'multiple-choice' } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const questions = await llmService.generateQuestions(topic, {
      count,
      type,
      difficulty: user.learningPreferences.difficulty
    });

    res.json(questions);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Error generating questions' });
  }
});

// Get learning path recommendations
router.get('/recommendations', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const recommendations = await llmService.getRecommendations({
      completedLessons: user.progress.completedLessons,
      interests: user.learningPreferences.interests,
      difficulty: user.learningPreferences.difficulty,
      learningStyle: user.learningPreferences.learningStyle
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Error getting recommendations' });
  }
});

export default router; 