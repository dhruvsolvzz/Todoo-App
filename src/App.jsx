import './App.css'
import QuizContainer from './components/QuizContainer'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Q U I Z  -  A P P</h1>
      </header>
      <main>
        <QuizContainer />
      </main>
    </div>
  )
}

export default App