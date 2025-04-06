import express from 'express';
import { OpenAIService } from '../services/openai.service';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate content based on prompt
router.post('/generate-content', authenticateToken, async (req, res) => {
  try {
    const { prompt, maxTokens } = req.body;
    const content = await OpenAIService.generateContent(prompt, maxTokens);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Generate quiz
router.post('/generate-quiz', authenticateToken, async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const quiz = await OpenAIService.generateQuiz(topic, difficulty);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Generate explanation
router.post('/generate-explanation', authenticateToken, async (req, res) => {
  try {
    const { topic, concept } = req.body;
    const explanation = await OpenAIService.generateExplanation(topic, concept);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

export default router; 