import { useState, useEffect } from 'react';
import Question from './Question';
import Navigation from './Navigation';
import ProgressTracker from './ProgressTracker';
import Results from './Results';
// Import local questions instead of the API service
import questionsData from '../data/questions.json';

const QuizContainer = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for bonus features
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [highScores, setHighScores] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('quizHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Load questions from local JSON file instead of API
  useEffect(() => {
    if (!quizStarted) return;
    
    try {
      setLoading(true);
      // Use the imported questions data directly
      setQuestions(questionsData);
      setUserAnswers(new Array(questionsData.length).fill(null));
      setLoading(false);
      // Start the timer when questions are loaded
      setTimeLeft(30);
      setTimerActive(true);
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      setLoading(false);
    }
  }, [quizStarted]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);
  
  // Auto-lock answer when timer runs out
  useEffect(() => {
    if (timeLeft <= 0 && timerActive) {
      setTimerActive(false);
      // If no answer selected, move to next question
      if (userAnswers[currentQuestionIndex] === null) {
        handleNext();
      }
    }
  }, [timeLeft, timerActive, currentQuestionIndex, userAnswers]);

  const handleAnswerSelect = (selectedOption) => {
    // Only allow selection if timer is active
    if (!timerActive && timeLeft === 0) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Reset timer for next question
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
      saveScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Reset timer when going back
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizStarted(false);
    setTimerActive(false);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };
  
  // Save score to localStorage
  const saveScore = () => {
    if (!userName) return;
    
    const score = calculateScore();
    const newScore = {
      name: userName,
      score,
      difficulty,
      date: new Date().toISOString(),
      totalQuestions: questions.length
    };
    
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10 scores
    
    setHighScores(updatedScores);
    localStorage.setItem('quizHighScores', JSON.stringify(updatedScores));
  };
  
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };
  
  const handleStartQuiz = (e) => {
    e.preventDefault();
    setQuizStarted(true);
  };

  // Show settings form if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="quiz-settings" role="form" aria-labelledby="settings-heading">
        <h2 id="settings-heading">Quiz Settings</h2>
        <form onSubmit={handleStartQuiz}>
          <div className="form-group">
            <label htmlFor="userName">Your Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select 
              id="difficulty" 
              value={difficulty} 
              onChange={handleDifficultyChange}
              aria-describedby="difficulty-help"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <p id="difficulty-help" className="help-text">
              Easy: Basic questions, Medium: Moderate difficulty, Hard: Challenging questions
            </p>
          </div>
          
          {highScores.length > 0 && (
            <div className="high-scores">
              <h3>High Scores</h3>
              <ul>
                {highScores.slice(0, 5).map((score, index) => (
                  <li key={index}>
                    {score.name}: {score.score}/{score.totalQuestions} ({score.difficulty})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            type="submit" 
            className="start-button"
            aria-label="Start Quiz"
          >
            Start Quiz
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div aria-live="polite">Loading questions...</div>;
  if (error) return <div aria-live="assertive">Error: {error}</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <div className="timer-container" aria-live="polite" aria-atomic="true">
            <div className="timer-text">Time left: {timeLeft} seconds</div>
            <div className="timer-bar-container">
              <div 
                className="timer-bar" 
                style={{ width: `${(timeLeft / 30) * 100}%` }}
                aria-hidden="true"
              ></div>
            </div>
          </div>
          
          <ProgressTracker 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={questions.length} 
          />
          
          <Question
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            onSelectAnswer={handleAnswerSelect}
            timeLeft={timeLeft}
            timerActive={timerActive}
          />
          
          <Navigation
            showPrevious={currentQuestionIndex > 0}
            showNext={true}
            disableNext={userAnswers[currentQuestionIndex] === null && timeLeft > 0}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </>
      ) : (
        <Results
          questions={questions}
          userAnswers={userAnswers}
          score={calculateScore()}
          totalQuestions={questions.length}
          onRestart={restartQuiz}
          highScores={highScores}
          difficulty={difficulty}
        />
      )}
    </div>
  );
};

export default QuizContainer;