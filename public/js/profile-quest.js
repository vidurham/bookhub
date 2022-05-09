const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerEl = document.getElementById('question-container');
const questionEl = document.getElementById('question')
const answerButtonsEl = document.getElementById('answer-buttons');
const feedbackContainerEl = document.getElementById('feedback-container');
const feedbackPEl = document.getElementById('feedback-p')
const startMessageEl = document.getElementById('start-message');
const quizContentContainerEl = document.getElementById('quiz-content-container');
const highscoresEl = document.getElementById('highscores');
const initialFormEl = document.getElementById('log-initials');
const initialInputEl = document.getElementById('initial-input');
const initalSubmitButtonEl = document.getElementById('initial-submit');
const highscoreSectionEl = document.getElementById('highscores');
const highscoreButtonEl = document.getElementById('highscore-button');
const backToQuizButtonEl = document.getElementById('back-to-quiz');
const backToStartButtonEl = document.getElementById('home-btn');
const timerEl = document.getElementById('timer');

var scoreListEL = document.createElement("ul");

let paused = true; 
let quizRunning = false;
let score = 0;
let answered = false;
let shuffledQuestions, currentQuestionIndex;

let userData = {
    initials: '',
    score: 0
}

let highscore = JSON.parse(localStorage.getItem("userData")) || [];

questions = [
  {
    question: "What are/is your favorite fiction genre(s)?",
    answers: [
      {text: "Mystery", correct: true},
      {text: "Crime", correct: false},
      {text: "Thriller", correct: false},
      {text: "Literary Fiction", correct: false},
      {text: "Suspense", correct: true},
      {text: "Horror", correct: false},
      {text: "Historical Fiction", correct: false},
      {text: "Romance", correct: false},
      {text: "Western", correct: true},
      {text: "Science Fiction", correct: false},
      {text: "Fantasy", correct: false},
      {text: "Dystopian", correct: false},
      {text: "Speculative Fiction", correct: true},
      {text: "Historical Fiction", correct: false},
      {text: "Family Saga", correct: false},
      {text: "Magic Realism", correct: false},
      {text: "I don't read fiction", correct: false}
    ]
  },
  {
    question: "What are/is your favorite non-fiction genre(s)?",
    answers: [
      {text: "History", correct: true},
      {text: "Biographies and Autobiographies", correct: false},
      {text: "Memoirs", correct: false},
      {text: "Philosophy", correct: false},
      {text: "Religion and Spirituality", correct: true},
      {text: "Self-Help", correct: false},
      {text: "Science", correct: false},
      {text: "Medical", correct: false},
      {text: "Psychology", correct: true},
      {text: "Art", correct: false},
      {text: "DIY", correct: false},
      {text: "Crafting", correct: false},
      {text: "Photography", correct: true},
      {text: "Gardening", correct: false},
      {text: "Food, Drink & Cooking", correct: false},
      {text: "Computers and Software", correct: false},
      {text: "Health and Fitness", correct: false},
      {text: "Political Science", correct: true},
      {text: "Business and Economics", correct: false},
      {text: "Parenting and Family", correct: false},
      {text: "Education", correct: false},
      {text: "Music", correct: false}
      ]
  }
];

function backToQuiz() {
  highscoreSectionEl.classList.add('hide');
  highscoreButtonEl.classList.remove('hide');
  paused = false;
  if (quizRunning){
      questionContainerEl.classList.remove('hide');
      backToQuizButtonEl.classList.add('hide');
      highscoreSectionEl.classList.add('hide');
      if(answered){
          nextButton.classList.remove('hide');
      }
  } else {
      timerEl.classList.add('hide');
      highscoreButtonEl.classList.remove('hide');
      startMessageEl.classList.remove('hide');
      startButton.classList.remove('hide');
  }
};

// --------------- END GAME HANDLERS --------------- //
function displayHighscores() {
  // check if timer is going: stop it
  scoreListEL.textContent = ''
  highscore = JSON.parse(localStorage.getItem("userData")) || [];

  if (quizRunning){
      paused = true;
      backToQuizButtonEl.textContent = "Back To Quiz"
      backToQuizButtonEl.classList.remove('hide')
  } else {
      backToQuizButtonEl.textContent = "Back To Start"
      backToQuizButtonEl.classList.remove('hide')
  }
  // go back to quiz at question index
  console.log(highscore)
  // append highscores to page
  //hide main message
  highscoreButtonEl.classList.add('hide');
  startButton.classList.add('hide');
  nextButton.classList.add('hide');
  startMessageEl.classList.add('hide');
  initialFormEl.classList.add('hide');
  questionContainerEl.classList.add('hide');
  feedbackContainerEl.classList.add('hide');
  highscoreSectionEl.classList.remove('hide');

  highscoreSectionEl.appendChild(scoreListEL);
  //loop through data append data to page
  highscore.forEach(element => {
      var listItemEl = document.createElement('li');
      listItemEl.className = "highscore-list-item";
      listItemEl.innerHTML = "<p>" + element.initials + ": " + element.score + "</p>"
      // append ul to highscoreSectionEl
      scoreListEL.appendChild(listItemEl);
  });
}

// input score obj for player push to highscore array

function saveScore(){
  // set initials submitted and score to local storage.
  userData.initials = initialInputEl.value;
  userData.score = score;
  highscore.push(userData);
  localStorage.setItem('userData', JSON.stringify(highscore));
  displayHighscores();
}
// =============== END OF END GAME HANDLERS =============== //

// --------------- ANSWER CLICKED HANDLERS --------------- //
// evaluates whether correct or incorrect and executes corresponding actions
function displayFeedback(correct){
  if (correct) {
      // sets feedback text to correct
      feedbackPEl.textContent =  "Correct";
      // reveal the feedback section
      feedbackContainerEl.classList.remove('hide');
      // add time
      time += 5;
      score += 5;
  } else {
      // sets feedback text to incorrect
      feedbackPEl.textContent =  "Incorrect";
      // reveals the feedback section
      feedbackContainerEl.classList.remove('hide');
      // reduce time
      time -= 5;
  }
};

// 5: answer clicked handler: determines whether user has already answered
// if not then feedback is displayed and func. determines if there 
// are more questions to be answered or if this call was the last question
function answerClicked(event) {
  // store button object from event.target
  const selectedButton = event.target;
  // store data-correct value to determine 
  // if button is correct or incorrect answer
  const correct = selectedButton.dataset.correct;
  // if not yet answered then evaluate
  if (answered === false) {
      // question is now answered
      answered = true
      // increment to next question index
      currentQuestionIndex++
      // evaluate if answere was correct or incorrect
      displayFeedback(correct)
  }

  // if the next question index is a valid location in shuffledQuestions
  // then reveal the nextButton
  if (shuffledQuestions.length > currentQuestionIndex) {
      nextButton.classList.remove('hide');
  } 
  // else the last question was answered
  else {
      quizRunning = false;
  };
};
// =============== END OF ANSWER CLICKED HANDLERS =============== //

// --------------- DISPLAY QUESTION AND ANSWERS SECTION --------------- //
// 4: displays the question and answers from the question argument: an object
function showQuestion(question){
  // populates the question container with the question
  questionEl.innerText = question.question;
  quizContentContainerEl.classList.remove('hide');

  // loops through the array of answers and for each creates a button
  question.answers.forEach(answer => {
      // create button
      const button = document.createElement('button')
      // button text is answer
      button.innerText = answer.text
      // style the button
      button.classList.add('btn')
      // if the answer has a correct attribute then
      // attribute that data to the button
      if (answer.correct){
          button.dataset.correct = answer.correct
      }
      // add click event listener to each button, when clicked fires answerClicked
      button.addEventListener('click', answerClicked)
      // appends button to button container
      answerButtonsEl.appendChild(button)
  });
};
// =============== END OF DISPLAY QUESTION AND ANSWERS SECTION =============== //

// --------------- NEXT QUESTION INITALIZATION --------------- //
// removes elements from page so new question elements can take their place
function resetState() {
  // hides the next button
  nextButton.classList.add('hide');
  // while the button container has a first child remove that child
  // this empties the button container
  while (answerButtonsEl.firstChild) {
      answerButtonsEl.removeChild(answerButtonsEl.firstChild)
  }
};

// 3: handles initalizing next question
function setNextQuestion() {
  // removes current items from page
  resetState()
  // passes the current index of the object containing question/answer data
  // to the show question function which displays that data on the page
  showQuestion(shuffledQuestions[currentQuestionIndex]);
};
// =============== END OF NEXT QUESTION INITALIZATION =============== //

// --------------- START-GAME SECTION --------------- //
const startingMinute = 1;
let time = startingMinute * 20;

// 2: Initialized a new game
function startGame(){
  quizRunning = true;
  // shuffles the questions 
  shuffledQuestions = questions.sort(() => Math.random - .5); //make random work
  // starts at the beginning of questions array
  currentQuestionIndex = 0;
  //sets defaults; question is not answered
  answered = false;
  score = 0;

  // hides start-button, answer-feedback, and the starting-message
  startButton.classList.add('hide');
  feedbackContainerEl.classList.add('hide');
  startMessageEl.classList.add('hide');

  // reveals question container element
  questionContainerEl.classList.remove('hide');

  // reveals question according to index
  setNextQuestion();

  // every second countdown function is called
  // countdown();
  paused = false;
  timerEl.classList.remove('hide');
  var countdown = setInterval(function(){
      if (!paused) {
          const minutes = Math.floor(time/60);
          let seconds = time % 60;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          timerEl.innerHTML = `${minutes}:${seconds}`;
          time--
          console.log(shuffledQuestions.length, currentQuestionIndex)
          if (time <= 0) {
              time = 0;
              clearInterval(countdown);
              quizRunning = false;
              quizContentContainerEl.classList.add('hide');
              initialFormEl.classList.remove('hide');
          } else if (shuffledQuestions.length <= currentQuestionIndex){
              clearInterval(countdown);
              quizRunning = false;
              highscoreButtonEl.classList.add('hide')
              quizContentContainerEl.classList.add('hide');
              initialFormEl.classList.remove('hide');
          };
      };
      if (!quizRunning && !paused){
          time = startingMinute * 30;
      };
  }, 1000); 
};
// =============== END OF START GAME SECTION =============== //

// --------------- EVENT LISTENERS SECTION --------------- //
// 1: fire startGame function when start button is clicked
startButton.addEventListener('click', startGame);

nextButton.addEventListener('click', () => {
  answered = false;
  feedbackContainerEl.classList.add('hide')
  setNextQuestion()
});

initalSubmitButtonEl.addEventListener('click', saveScore)

highscoreButtonEl.addEventListener('click', displayHighscores)
backToQuizButtonEl.addEventListener('click', backToQuiz)
// =============== END OF EVENT LISTENERS SECTION =============== //