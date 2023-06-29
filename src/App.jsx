import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import Starter from './starter'
import { nanoid } from '../node_modules/nanoid'
import './App.css'
import Quizapp from './Quizapp'

function App() {
  const [quiz, setQuiz] = useState([])
  const [quizData, setQuizData] = useState([])
  const [userChoice, setUserChoice] = useState([])
  const [isStarted, setIsStarted] = useState(false)
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [score, setScore] = useState(0)
  const [isSelectedStyle, setIsSelectedStyle] = useState({
    backgroundColor: "#D6DBF5", color: "#293264", border: "2px solid #D6DBF5"
  })
  const [leaveStyle, setLeaveStyle] = useState({
    border: "2px solid #979dac"
  })
  
  
  useEffect(()=> {
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setQuiz(data.results)
        setIsEvaluated(prevState => !prevState)
        setIsStarted(prevState => !prevState)
      })
  }, [])

  function makeOptions(arrIncorrect, arrCorrect) {
    const optionArray = arrIncorrect.concat(arrCorrect).sort(() => 0.5 - Math.random()).map(opt => {
      return {
        option: opt,
        isSelected: false,
        isCorrect: false
      }
    }) 
    return optionArray
  }

  useEffect(()=> {
    setQuizData(quiz.map(each => {
      return {
        ...each,
        key: nanoid(),
        id: nanoid(),
        correctAnswer: each.correct_answer,
        options: makeOptions(each.incorrect_answers, each.correct_answer),
        selected: ""
      }
    }))
  }, [quiz])



  console.log(quizData)

  function handleClick () {
    setIsStarted(true)
    
  }

  function swapOptions(option, choice) {
    const newOptions = option.map(value => value.option == choice ? {...value, isSelected: !value.isSelected} : {...value, isSelected: false})
    return newOptions
  }

  const handleChoice = (choice, id) => {
    setUserChoice(prevChoice => {
      return {
        ...prevChoice,
        [id]: choice
      }
    })

    setQuizData(prevData => prevData.map(e => e.id === id ? {...e, selected: choice, options: swapOptions(e.options, choice)} : e))
  }

  const calculator = (value) => {
    value.isSelected && setScore(prevScore => prevScore+1)
    return {...value, isCorrect: true}
  }

  const calculateAnswers = () => {
    setQuizData(prevState => prevState.map(e => {
      return {...e, options: e.options.map(value => value.option == e.correctAnswer ? calculator(value) : value)}
    }))

    setIsSelectedStyle(prevStyle => {
      return {backgroundColor: "#F8BCBC", color: "#293264", border: "2px solid #F8BCBC"}})     

    setLeaveStyle(prevStyle => {
      return {color: "#4D5B9E", border: "2px solid #4D5B9E"}})

    setIsStarted(prevState => !prevState)
    setIsEvaluated(prevState => !prevState)
  }



  const allQuestions = quizData.map(each => 
      <Quizapp key={each.key} 
                question={each.question} 
                option={each.options.map(opt => {
                  return <span className="option" onClick={() => handleChoice(opt.option, each.id)} style={opt.isCorrect ? {backgroundColor: "#7ae582", border: "2px solid #7ae582"} : opt.isSelected && !opt.isCorrect ? isSelectedStyle : leaveStyle}>{opt.option} </span>
                })} />) 

  return (
    <div className="App">
      {!isStarted && !isEvaluated && <Starter />} 
      {isStarted && <div> {allQuestions} </div>}
      {isEvaluated && <div className="final-container">
        {isEvaluated && isStarted && <span>You have scored {score} points</span>}
      </div>}
      <button onClick={!isStarted ? handleClick : calculateAnswers}>{!isStarted && !isEvaluated ? "Start Quiz" : isStarted && !isEvaluated ? "Check answers" : "Play again"}</button>
    </div>
  )
}

// if (!isStarted) {
//   return handleClick
// } else if ()

export default App
