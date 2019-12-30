/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var diceValue, roundScore, activePlayer, isOver;
var playerScores = {};
var diceElement = document.getElementsByClassName("dice")[0];

// Set up the game board
newGame();

function newGame(){
    roundScore = 0;
    for(var player in [0, 1]){
        playerScores[player] = 0;
        setTotalScore(player, 0);
        setRoundScore(player, 0);
        document.getElementById("name-" + player).textContent = "Player " + (Number(player) + 1)
    }
    activePlayer = Math.round(Math.random());
    setActivePlayer(activePlayer);
    diceElement.style.display = "none"
    document.getElementById("game-over").style.display = "none"
    isOver = false;
}

function rollDice(){
    if(isOver){return}

    // Roll a six-sided die
    roll = Math.floor(Math.random() * 6) + 1

    // Update the dice display
    diceElement = document.getElementsByClassName("dice")[0]
    diceElement.src="dice-" + roll + ".png"
    diceElement.style.display = "block"

    // Check the roll is valid
    if(roll === 1){
        roundScore = 0;
        nextPlayer();
    } else {
        roundScore += roll;
    }

    // Update the current score display
    setRoundScore(activePlayer, roundScore);
}

function nextPlayer(){
    if(isOver){return}

    // Update the player total score
    playerScores[activePlayer] = playerScores[activePlayer] + roundScore;
    setTotalScore(activePlayer, playerScores[activePlayer]);

    if(isWinner(activePlayer)){
        setWinner(activePlayer);
    } else {
        // Reset dice and round Scores for the next round
        diceElement.style.display = "none";
        roundScore = 0;
        setRoundScore(activePlayer, roundScore)

        // Change the active player
        activePlayer = Number(!activePlayer);
        setActivePlayer(activePlayer);
    }
}

function isWinner(player){
    isOver = (playerScores[player] >= 10);
    return isOver;
}

function setWinner(player){
    document.querySelector(".player-" + player + "-panel").classList.remove("active")
    document.querySelector(".player-" + player + "-panel").classList.add("winner")
    diceElement.style.display = "none"
    document.getElementById("game-over").style.display = "block"
}

function setRoundScore(player, score){
    document.getElementById("current-" + player).textContent = score;
}

function setTotalScore(player, score){
    playerScores[player] = score;
    document.getElementById("score-" + player).textContent = playerScores[player];
}

function setActivePlayer(player){
    document.querySelector(".player-" + player + "-panel").classList.add("active")
    document.querySelector(".player-" + Number(!player) + "-panel").classList.remove("active")
}


newGameButton = document.getElementsByClassName("btn-new")[0];
newGameButton.addEventListener("click", newGame);

rollButton = document.getElementsByClassName("btn-roll")[0];
rollButton.addEventListener("click", rollDice);

holdButton = document.getElementsByClassName("btn-hold")[0];
holdButton.addEventListener("click", nextPlayer);