const Results = ({ questions, userAnswers, score, totalQuestions, onRestart, highScores, difficulty }) => {
  return (
    <div className="results-container" aria-live="polite">
      <h2>Quiz Results</h2>
      <div className="score">
        You scored {score}/{totalQuestions}
      </div>
      
      <div className="answers-summary">
        <h3>Summary</h3>
        {questions.map((question, index) => (
          <div 
            key={index} 
            className={`answer-item ${userAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}
          >
            <p className="question-text">{question.question}</p>
            <p className="user-answer">
              Your answer: <span>{userAnswers[index] || 'Not answered'}</span>
            </p>
            <p className="correct-answer">
              Correct answer: <span>{question.correctAnswer}</span>
            </p>
          </div>
        ))}
      </div>
      
      {highScores.length > 0 && (
        <div className="high-scores-container">
          <h3>High Scores</h3>
          <table aria-label="High Scores Table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {highScores.slice(0, 5).map((score, index) => (
                <tr key={index} className={score.difficulty === difficulty ? 'current-difficulty' : ''}>
                  <td>{index + 1}</td>
                  <td>{score.name}</td>
                  <td>{score.score}/{score.totalQuestions}</td>
                  <td>{score.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button 
        className="restart-button" 
        onClick={onRestart}
        aria-label="Restart Quiz"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default Results;