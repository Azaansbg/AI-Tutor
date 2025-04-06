import React, { useState, useEffect } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import StorageService from '../services/storage';
import { lessonContents } from '../data/lessonContent';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number) => void;
}

export default function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const storage = StorageService.getInstance();
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== -1;
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;

  // Find relevant explanation from lesson content
  const findExplanation = () => {
    const lessonContent = lessonContents[quiz.lessonId]?.content || '';
    const questionText = currentQuestion.text.toLowerCase();
    
    // Split content into paragraphs and find the most relevant one
    const paragraphs = lessonContent.split('\n\n');
    const relevantParagraph = paragraphs.find(p => 
      p.toLowerCase().includes(questionText) ||
      questionText.split(' ').some(word => 
        word.length > 4 && p.toLowerCase().includes(word.toLowerCase())
      )
    );

    return relevantParagraph || 'Review the lesson content for more information.';
  };

  useEffect(() => {
    const cachedQuizzes = storage.getCachedQuizContent() || {};
    if (!cachedQuizzes[quiz.id]) {
      cachedQuizzes[quiz.id] = quiz;
      storage.cacheQuizContent(cachedQuizzes);
    }

    const savedAnswers = storage.getQuizAnswers(quiz.id);
    if (savedAnswers) {
      setSelectedAnswers(savedAnswers);
    }
  }, [quiz]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return; // Prevent changing answer during feedback

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    storage.saveQuizAnswers(quiz.id, newAnswers);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
    onComplete(finalScore);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
        <div className="text-6xl font-bold text-indigo-600 mb-4">{score}%</div>
        <p className="text-gray-600 mb-4">
          You answered {selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length} out of {quiz.questions.length} questions correctly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
        <div className="text-sm text-gray-500">Progress: {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</div>
      </div>
      
      <div className="mb-8">
        <p className="text-lg text-gray-800 mb-6">{currentQuestion.text}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswers[currentQuestionIndex] === index
                  ? showFeedback
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-600 bg-green-50'
                      : 'border-red-600 bg-red-50'
                    : 'border-indigo-600 bg-indigo-50'
                  : showFeedback && index === currentQuestion.correctAnswer
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && selectedAnswers[currentQuestionIndex] === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center mb-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
            )}
            <h3 className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
          </div>
          <p className="text-gray-700">{findExplanation()}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {!isAnswered ? 'Select an answer to continue' : 'Click Next to continue'}
        </div>
        {showFeedback && (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}