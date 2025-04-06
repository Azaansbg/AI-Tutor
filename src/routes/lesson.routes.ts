import express from 'express';
import { auth } from '../middleware/auth';
import { Lesson } from '../models/Lesson';
import { User } from '../models/User';

const router = express.Router();

// Get all lessons
router.get('/', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('subjectId');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// Get lesson by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('subjectId');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson' });
  }
});

// Complete a lesson
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { quizScore, timeSpent } = req.body;
    const userId = req.user.id;

    // Update user's progress
    await User.findByIdAndUpdate(userId, {
      $push: {
        completedLessons: {
          lessonId: req.params.id,
          quizScore,
          timeSpent,
          completedAt: new Date()
        }
      }
    });

    res.json({ message: 'Lesson completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing lesson' });
  }
});

export default router; 