var suits = ["S", "H", "D", "C"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = [];
var players = new Array();
var currentPlayer = 0;

function createDeck() {
  deck = [];
  for (var i = 0; i < values.length; i++) {
    for (var x = 0; x < suits.length; x++) {
      var weight = parseInt(values[i]);
      if (values[i] == "J" || values[i] == "Q" || values[i] == "K") weight = 10;
      if (values[i] == "A") weight = 11;
      var card = { Value: values[i], Suit: suits[x], Weight: weight };
      deck.push(card);
    }
  }
}

function createPlayers(num) {
  players = [];
  for (var i = 1; i <= num; i++) {
    var hand = [];
    var player = { Name: "Player " + i, ID: i, Points: 0, Hand: hand };
    players.push(player);
  }
}

function createPlayersUI() {
  document.getElementById("players").innerHTML = "";
  for (var i = 0; i < players.length; i++) {
    var div_player = document.createElement("div");
    var div_playerid = document.createElement("div");
    var div_hand = document.createElement("div");
    var div_points = document.createElement("div");

    div_points.className = "points";
    div_points.id = "points_" + i;
    div_player.id = "player_" + i;
    div_player.className = "player";
    div_hand.id = "hand_" + i;

    div_playerid.innerHTML = "Player " + players[i].ID;
    div_player.appendChild(div_playerid);
    div_player.appendChild(div_hand);
    div_player.appendChild(div_points);
    document.getElementById("players").appendChild(div_player);
  }
}

function shuffle() {
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
}

function startblackjack() {
  document.getElementById("btnStart").value = "Restart";
  document.getElementById("status").style.display = "none";
  document.getElementById("hitbutton").disabled = false;
  document.getElementById("status").classList.remove("lost");

  // deal 2 cards to every player object
  currentPlayer = 0;
  createDeck();
  shuffle();
  createPlayers(2);
  createPlayersUI();
  dealHands();
  document.getElementById("player_" + currentPlayer).classList.add("active");
}

function dealHands() {
  for (var i = 0; i < 2; i++) {
    for (var x = 0; x < players.length; x++) {
      var card = deck.pop();
      players[x].Hand.push(card);
      renderCard(card, x);
      updatePoints();
    }
  }

  updateDeck();
}

function renderCard(card, player) {
  var hand = document.getElementById("hand_" + player);
  hand.appendChild(getCardUI(card));
}

function getCardUI(card) {
  var el = document.createElement("img");
  var path = `./cards/${card.Value}${card.Suit}.png`;
  el.src = path;
  el.id = "image";
  //   el.width = "50px";

  //card.Value
  //card.Suit
  return el;
}
function numberOfAces(player) {
  let count = 0;
  for (var i = 0; i < players[player].Hand.length; i++) {
    if (players[player].Hand[i].Weight == 11) {
      count++;
    }
  }
  return count;
}
// returns the number of points that a player has in hand
function getPoints(player) {
  var points = 0;
  for (var i = 0; i < players[player].Hand.length; i++) {
    points += players[player].Hand[i].Weight;
  }
  players[player].Points = points;
  if (points > 21) {
    let count = numberOfAces(player);
    if (count > 0) {
      points -= count * 11;
    }
  }
  return points;
}

function updatePoints() {
  for (var i = 0; i < players.length; i++) {
    getPoints(i);
    document.getElementById("points_" + i).innerHTML = players[i].Points;
  }
}

function hit() {
  // pop a card from the deck to the current player
  // check if current player new points are over 21
  var card = deck.pop();
  players[currentPlayer].Hand.push(card);
  renderCard(card, currentPlayer);
  updatePoints();
  updateDeck();
  check();
}

function stay() {
  // move on to next player, if any
  if (currentPlayer != players.length - 1) {
    document
      .getElementById("player_" + currentPlayer)
      .classList.remove("active");
    currentPlayer += 1;
    document.getElementById("player_" + currentPlayer).classList.add("active");
  } else {
    end();
  }
}

function end() {
  var winner = -1;
  var score = 0;

  for (var i = 0; i < players.length; i++) {
    if (players[i].Points > score && players[i].Points < 22) {
      winner = i;
    }

    score = players[i].Points;
  }

  var status = document.getElementById("status");
  status.innerHTML = "Winner: Player " + players[winner].ID;
  status.style.display = "inline-block";
  document.getElementById("hitbutton").disabled = true;
}

function check() {
  if (players[currentPlayer].Points > 21) {
    document.getElementById("status").innerHTML =
      "Player: " + players[currentPlayer].ID + " LOST";
    document.getElementById("status").classList.add("lost");
    document.getElementById("hitbutton").disabled = true;

    document.getElementById("status").style.display = "inline-block";
    end();
  }
}

function updateDeck() {
  document.getElementById("deckcount").innerHTML = deck.length;
}

window.addEventListener("load", function () {
  createDeck();
  shuffle();
  createPlayers(1);
});
