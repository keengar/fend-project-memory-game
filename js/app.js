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

// show a card if it doesn't already have open, show, or match classes
// push card to activeCards array
function showCard(a) {
  if (!a.toElement.classList.contains('match') && !a.toElement.classList.contains('open') && !a.toElemnt.classList.contains('show')) {
    a.toElement.classList.add('open', 'show');
    activeCards.push(a);
  }
}

// Check if cards match.  Call winner func if all match.
function cardMatch() {
  for (const card of activeCards) {
    card.toElement.classList.add('match');
    card.toElement.classList.remove('open');
    card.toElement.classList.remove('show');
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
      if (activeCards[0].target.innerHTML === activeCards[1].target.innerHTML) {
        cardMatch();
        activeCards = [];
      } else setTimeout(notMarch, 600);
      countMoves();
    }
  }
}

// Check if cards don't match and remove classes if they don't
// Reset activeCards array to empty
function notMarch() {
  for (const card of activeCards) {
    card.toElement.classList.remove('open', 'show');
    activeCards = [];
  }
}

// count the moves taken
function countMoves() {
  // Get value of moves
  let moves = document.querySelectorAll('.moves');

  // Need a loop since there are two occurances when the winner popup shows
  for (move of moves) {
    move.innerHTML = moveCount;
  }

  // Increment after updating so this func can be used in restarts
  moveCount += 1;
}

// Build the popup with the number of moves
const popupPlace = document.querySelector('.container');
const textOfPopup = `<div class="holder">
  <div class="popup">
    <h1>Congratulations!!!</h1>
    <h2>You have won in <span class="moves">X</span> moves!</h2>
    <button class="restart">Restart <i class="fa fa-repeat"></i></button>
  </div>
</div>`;

// Add winner popup to the page
// Since all cards have match class, clicking cards should do nothing at this point
function winner() {
  popupPlace.insertAdjacentHTML('afterend', textOfPopup);

  // Reapply listeners so popup moves can be incremented
  addListeners();

  // Update move counter in popup
  countMoves();
  console.log(moveCount);
}

// Re-initialize the game
function resetAll() {
  // Remove popup if popup exists
  if (matchCount === 16) {
    let popupHolder = document.querySelector('.holder');
    popupHolder.remove();
  }

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
  countMoves();
}

// Load random deck on page load and restarts
resetAll();
