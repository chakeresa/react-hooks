// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Moves({currentStep, onStepClick}) {
  function renderStep(stepIndex) {
    const isCurrentStep = stepIndex === currentStep
    const buttonText = stepIndex === 0 ? "Go to game start" : `Go to move #${stepIndex}`

    return (
      <li key={stepIndex}>
        <button disabled={isCurrentStep} onClick={() => onStepClick(stepIndex)}>
          {buttonText} {isCurrentStep ? "(current)" : null}
        </button>
      </li>
    )
  }

  const moves = [...Array(currentStep + 1).keys()].map(stepIndex => renderStep(stepIndex))

  return (
    <div>
      <ol>
        {moves}
      </ol>
    </div>
  )
}
function Board({squares, onSquareClick}) {
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const initialHistory = [Array(9).fill(null)]

  const [currentStep, setCurrentStep] = useLocalStorageState("currentStep", 0)
  const [history, setHistory] = useLocalStorageState("history", initialHistory)

  const currentSquares = history[currentStep]
  console.log("history", history)
  console.log("currentSquares", currentSquares)
  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function restart() {
    setCurrentStep(0)
    setHistory(initialHistory)
  }

  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || currentSquares[square]) {
      return
    }

    let updatedSquares = [...currentSquares]
    updatedSquares[square] = nextValue

    let updatedHistory = [...history]
    updatedHistory.push(updatedSquares)

    console.log("updatedHistory", updatedHistory)

    setHistory(updatedHistory)
    setCurrentStep(currentStep + 1)
  }

  function selectStep(index) {
    setCurrentStep(index)
    const newHistory = history.slice(0, index + 1)
    setHistory(newHistory)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onSquareClick={selectSquare}/>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves currentStep={currentStep} onStepClick={selectStep} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length

  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
