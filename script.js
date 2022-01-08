'use strict';
const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game__field');
const filedRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.popup');
const popUpText = document.querySelector('.popup_message');
const popUpRefresh = document.querySelector('.popup__refresh');

let started = false; 
let score = 0;
let timer = undefined;

const carrotSound = new Audio('/sound/carrot_pull.mp3');
const bugSound = new Audio('/sound/bug_pull.mp3');
const alertSound = new Audio('/sound/alert.wav');
const bgSound = new Audio('/sound/bg.mp3');
const winSound = new Audio('/sound/game_win.mp3');

gameBtn.addEventListener('click', () => {
  if(started){ 
    stopGame();
  }else{
    startGame();
  }
})
popUpRefresh.addEventListener('click', () =>{
  startGame();
  hidePopup();
})

function stopGame(){
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopup('REPLAY?😎');
  stopSound(bgSound);
  playSound(alertSound);
}
function startGame(){
  started = true;
  initGame();
  startGameTimer();
  showStopBtn();
  showTimerAndScore();
  playSound(bgSound);
}
function finishGame(win){
  started = false;
  hideGameBtn();
  stopGameTimer();
  showPopup(win? 'YOU WON🥳' : 'YOU LOST😵');
  if(win){
    playSound(winSound);
  }else{
    playSound(bugSound);
  }
  stopSound(bgSound);
}

function showStopBtn(){
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = "visible";
}
function showTimerAndScore(){
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}
function hideGameBtn(){
  gameBtn.style.visibility = "hidden";
}
function startGameTimer(){
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval( () => {
    if(remainingTimeSec <= 0){
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec)
  }, 1000) 
}
function stopGameTimer(){
  clearInterval(timer);
}

function updateTimerText(time){
  const minutes = Math.floor(time / 60);
  const seconds = time;
  gameTimer.textContent = `${minutes}:${seconds}`;
}
function showPopup(text){
  popUpText.textContent = text;
  popUp.classList.remove('popup-hidden');
}
function hidePopup(){
  popUp.classList.add('popup-hidden');
}

function initGame(){
  field.innerHTML = '';
  gameScore.textContent = CARROT_COUNT;
  score = 0;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');

}
function addItem(className, count, imgPath){
  const x1 = 0;
  const y1 = 0;
  const x2 = filedRect.width - CARROT_SIZE;
  const y2 = filedRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i ++){
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}
function randomNumber(min, max){
  return Math.random() * (max - min) + min;
}

field.addEventListener('click', onFieldClick);
function onFieldClick(event){
  if(!started){
    return;
  }
  const target = event.target;
  if(target.matches('.carrot')){
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if(score === CARROT_COUNT){
      finishGame(true);
    }
  }else if(target.matches('.bug')){
    finishGame(false);
  }
}
function updateScoreBoard(){
  gameScore.textContent = CARROT_COUNT - score;
}
function playSound(sound){
  sound.play();
  sound.currentTime = 0;
}
function stopSound(sound){
  sound.pause();
}
