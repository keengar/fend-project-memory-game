/*
 * Create a list that holds all of your cards
 *   - shuffle the list of cards using the provided "shuffle" method below
 */
const items = ['fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-bomb', 'fa-cube', 'fa-diamond', 'fa-leaf', 'fa-paper-plane-o'];

/*
 * Display the cards on the page
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Builds a new deck on page load or reset
function buildDeck() {
  let newDeck = [];
  /* Build deck
    Added here to allow use of the same function at restarts */
  for (const card of deck) {
    let thisCard = `<li class="card">
    <i class="fa ${card}"></i></li>`;
    newDeck.push(thisCard);
  }
  document.querySelector('.deck').innerHTML = newDeck.join('');
  //Add event listeners on loads and restarts
  addListeners();
};

// Build initial 7 stars
function buildStars() {
  let stars = [];
  let newStar = `<li><i class="fa fa-star"></i></li>`;

  for (let index = 0; index < 5; index++) {
    stars.push(newStar);
  }

  document.querySelector('.stars').innerHTML = stars.join('');
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let moveCount = 0;
let matchCount = 0;
let activeCards = [];

// Remove a star from list
function removeStar() {
  if (moveCount > 15 & moveCount % 4 == 0) {
    let currentStars = document.querySelector('.stars');
    currentStars.removeChild(currentStars.childNodes[0]);
  }
}

function addListeners() {
  let cardList = document.querySelectorAll('li.card');
  let restarts = document.querySelectorAll('.restart');

  for (const oneCard of cardList) {
    oneCard.addEventListener('click', clickCard);
  }
  for (const restart of restarts) {
    restart.addEventListener('click', resetAll);
  }
}

// start a timmer and update the innerHTML for the minutes and seconds
function beginTimer() {
  let seconds = 0;
	timer = setInterval(function() {
    seconds ++;
    let minutes = document.querySelector('.minutes');
    let secs = document.querySelector('.seconds');

    minutes.innerHTML = Math.floor(seconds / 60);  // 
    secs.innerHTML = seconds % 60; // Just need the remainder after devided by 60
    }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// show a card if it doesn't already have open, show, or match classes
// push card to activeCards array
function showCard(a) {
  console.log(a.target);
  let card = a.target;

  if (!card.classList.contains('match') && !card.classList.contains('open') && !card.classList.contains('show')) {
    card.classList.add('open', 'show');
    activeCards.push(a);
  }
}

// Check if cards match.  Call winner func if all match.
function cardMatch() {
  for (const card of activeCards) {
    card.target.classList.add('match');
    card.target.classList.remove('open', 'show');
    matchCount += 1;
    if (matchCount === 16) {
      winner();
    }
  }
}

function clickCard(a) {
  if (activeCards.length === 0) {
    showCard(a);
  } else if (activeCards.length === 1) {
    showCard(a);
    if (activeCards.length === 2) {
      countMoves();
      if (activeCards[0].target.innerHTML === activeCards[1].target.innerHTML) {
        cardMatch();
        activeCards = [];
      } else setTimeout(notMarch, 600);
    }
  }
}

// Check if cards don't match and remove classes if they don't
// Reset activeCards array to empty
function notMarch() {
  for (const card of activeCards) {
    card.target.classList.remove('open', 'show');
    activeCards = [];
  }
}

// count the moves taken
function countMoves() {
  let move = document.querySelector('.moves');
  moveCount += 1
  move.innerHTML = moveCount;
  removeStar();  // Change stars after updating moveCountsssssssss
}

// Build the popup with the number of moves
const popupPlace = document.querySelector('.container');
let textOfPopup = `<div class="holder">
  <div class="win popup">
    <h1>Congratulations!!!</h1>
    <h1 class="starlist"></h1>
    <h2>You have won in <span class="moves">X</span> moves!</h2>
    <h2>Your time was <span class="time">0</span>.</h2>
    <button class="restart">Restart <i class="fa fa-repeat"></i></button>
  </div>
</div>`;

// Add winner popup to the page
// Since all cards have match class, clicking cards should do nothing at this point
function winner() {
  popupPlace.insertAdjacentHTML('afterend', textOfPopup);
  stopTimer();

  // Reapply listeners so popup moves can be incremented
  addListeners();

  // Update move counter in popup
  let moves = document.querySelectorAll('.moves');
  for (move of moves) {
    move.innerHTML = moveCount;
  }

  let finishTime = document.querySelector('.timer');
  let popupTime = document.querySelector('.time');
  popupTime.innerHTML = finishTime.innerHTML;

  let finalStars = document.querySelector('.stars');
  let winnerStars = document.querySelector('.starlist');
  winnerStars.innerHTML = finalStars.innerHTML;
}

// Re-initialize the game
function resetAll() {
  let popupHolder = document.querySelector('.holder');
  popupHolder.remove(); // Remove popup
  // Reset variables
  matchCount = 0;
  moveCount = 0;
  activeCards = [];
    // Remove the old deck
  let oldDeck = document.querySelectorAll('li.card');
  for (listItem of oldDeck) {
    listItem.remove();
  }
  // Rebuild Deck
  deck = shuffle(items.concat(items));
  buildDeck();
  let moves = document.querySelectorAll('.moves'); // reset moves
  moves.innerHTML = moveCount;
  buildStars();
  beginTimer();
}
