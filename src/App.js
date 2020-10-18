import React, {useState, useEffect} from 'react'
import Header from './components/Header';
import Footer from './components/Footer'
import QuestionCard from './components/QuestionCard'
// import TopMenu from "./components/TopMenu";
import WelcomeScreen from './components/WelcomeScreen';
import ResultScreen from './components/ResultScreen';

// const API_URL ='https://quizapi.io/api/v1/questions?apiKey={}&category{}&limit{}&tags={}';API_URL.format(Apikey, category, limit, name)
const API='https://opentdb.com/api.php?amount=10';
function App() {

    // const name = 'JavaScript';
    // const category = 'code';
    // const limit = 10;
    // // const startIndex = 0;
    // // const index = 0;
    // const Apikey = 'Ol8s0X2iWFe8w6p1L7Nckl9qM99YVH1mab9gjH3E';
    const [Questions, setQuestions] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [QuizInfo, setQuizInfo] = useState([]);
    const [Result, setResult] = useState(0);
    const [GameEnded, setGameEnded] = useState(false);
    const [scoreCard, setScoreCard] = useState([])
    
    useEffect(() => {
      document.title = QuizInfo.quizName ? QuizInfo.quizName : "Loading";
   }, []);
  useEffect(() => {
      fetch(API)
      .then(res=> res.json())
      .then((data) =>{
        setQuestions(data.results);
        setQuizInfo(
          {"quizName": "MCQ: " + data.results[currentIndex].category.split(':')[0],
           "difficulty" : "Level: " + capitalizeFirstLetter(data.results[currentIndex].difficulty),
           "totalQuestion": data.results.length,
           "QuestionNumber": 1}
        )
        console.log(data.results);
      });
  },[])

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const handleAnswer = (answer) => {
    console.log("handleAnswer " + answer, Questions[currentIndex].category);
      if(answer === Questions[currentIndex].correct_answer)
      {
        console.log("correct " + answer , "   ", Questions[currentIndex].correct_answer);
        setResult(Result +1);
      }
      timeout(3000);
      // if(currentIndex >= Questions.length)
      // {
      //   setGameEnded(true);
      // }
      ShuffleQuestion();

  }

  function timeout(number) {
    return new Promise( res => setTimeout(res, number) );}

  const ShuffleQuestion = (ind) => {
    setCurrentIndex(currentIndex +1)
    console.log(currentIndex," ShuffleQuestion called");
    setQuizInfo(
      {"quizName": "MCQ: " + Questions[currentIndex].category.split(':')[0],
      "difficulty" : "Level: " + capitalizeFirstLetter(Questions[currentIndex].difficulty),
       "totalQuestion": Questions.length,
       "QuestionNumber": currentIndex + 1}
    )
    document.title = QuizInfo.quizName ? QuizInfo.quizName : "Loading";
    if(currentIndex >= Questions.length -1)
    {
      setScoreCard({
        "score": Result,
        "total": Questions.length
      })
      setGameEnded(true);
      // document.title = "Result: " + scoreCard.score + " of " + scoreCard.total;
    }
    console.log("done");
}

const restartQuiz =() =>{
  window.location.reload(false);
}
  return (
    GameEnded ? 
    (<ResultScreen restartQuiz={restartQuiz} data={scoreCard}/>) :
    ( Questions.length > 0 ?
      (<div className="border">
        {/* <TopMenu/> */}
        <Header data={QuizInfo} /> 
          <QuestionCard data={Questions[currentIndex]} handleAnswer={handleAnswer}></QuestionCard>
        <Footer index={currentIndex} ShuffleQuestion={ShuffleQuestion} ></Footer>
      </div>):(<WelcomeScreen/>))
  )
}


export default App
