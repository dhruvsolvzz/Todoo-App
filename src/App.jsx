import './App.css'
import QuizContainer from './components/QuizContainer'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Quiz App</h1>
      </header>
      <main>
        <QuizContainer />
      </main>
    </div>
  )
}

export default App