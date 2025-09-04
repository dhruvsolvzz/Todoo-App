const Navigation = ({ 
  showPrevious, 
   
  disableNext, 
  onPrevious, 
  onNext, 
  isLastQuestion 
}) => {
  return (
    <div className="navigation">
      {showPrevious && (
        <button className="nav-button prev" onClick={onPrevious}>
          Previous
        </button>
      )}
      <button 
        className="nav-button next" 
        onClick={onNext} 
        disabled={disableNext}
      >
        {isLastQuestion ? 'Finish' : 'Next'}
      </button>
    </div>
  );
};

export default Navigation;