/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var roundScore, activePlayer, gameOver, lastRoll, winningValue, inputWarning;
var playerScores = {};
var diceElements = document.querySelectorAll('[id^="dice-"]');
var winningValueInputElement = document.getElementById("winning-score");
var gameStatusMsgElement = document.getElementById("status-msg");

// Set up the game board
newGame();

function newGame(){
    // Reset all variables and styling for a fresh game
    roundScore = 0;
    lastRoll = 0;
    for(var player in [0, 1]){
        setTotalScore(player, 0);
        setRoundScore(player, 0);
        document.getElementById("name-" + player).textContent = "Player " + (Number(player) + 1)
        document.querySelector(".player-" + player + "-panel").classList.remove("winner")
    }
    activePlayer = Math.round(Math.random());
    setActivePlayer(activePlayer);
    setDiceDisplay("none");
    gameStatusMsgElement.style.display = "none"
    gameOver = false;
    inputWarning = false;
    winningValue = winningValueInputElement.value
}

function rollDice(){
    // If game is not over, roll dice and check for any actions based on shown pips
    if(gameOver){return}

    for(var i = 0; i < diceElements.length; i++){
        // Roll a six-sided die
        roll = Math.floor(Math.random() * 6) + 1

        // Update the dice display
        gameStatusMsgElement.style.display = "none"
        diceElements[i].src="dice-" + roll + ".png"
        diceElements[i].style.display = "block"

        // Check the roll is valid
        if(roll === 1){
            roundScore = 0;
            nextPlayer();
            setTurnOverMsg(activePlayer, "You rolled a 1.")
            return
        } else if (roll === 6 && lastRoll === 6) {
            roundScore = 0;
            setTotalScore(activePlayer, 0);
            nextPlayer();
            setTurnOverMsg(activePlayer, "You rolled two sixes in a row!")
            return
        } else {
            roundScore += roll;
            lastRoll = roll;
        }
    }
    // Update the current score display
    setRoundScore(activePlayer, roundScore);
}

function nextPlayer(){
    // If game is not over, set the active players total score and activate the next player
    if(gameOver){return}

    // Update the player total score
    playerScores[activePlayer] = playerScores[activePlayer] + roundScore;
    setTotalScore(activePlayer, playerScores[activePlayer]);

    if(isWinner(activePlayer)){
        setWinner(activePlayer);
    } else {
        // Reset dice and round Scores for the next round
        setDiceDisplay("none")
        roundScore = 0;
        setRoundScore(activePlayer, roundScore)

        // Change the active player
        activePlayer = Number(!activePlayer);
        setActivePlayer(activePlayer);
    }
    lastRoll = 0;
}

function isWinner(player){
    gameOver = (playerScores[player] >= winningValue);
    return gameOver;
}

function setWinner(player){
    // Update underlying html styling to indicate game is over
    document.querySelector(".player-" + player + "-panel").classList.remove("active")
    document.querySelector(".player-" + player + "-panel").classList.add("winner")
    document.getElementById("name-" + player).textContent = "Winner!"
    setDiceDisplay("none")
    gameStatusMsgElement.textContent = "GAME OVER"
    gameStatusMsgElement.style.display = "block"
}

function setTurnOverMsg(player, msg){
    // Provide prompts in the middle of the screen for special events
    setDiceDisplay("none")
    gameStatusMsgElement.innerHTML = msg + "<br>Player " + (Number(player) + 1) + ", it's your turn!"
    gameStatusMsgElement.style.display = "block"
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

function setDiceDisplay(dispType){
    for(var i = 0; i < diceElements.length; i++){
        diceElements[i].style.display = dispType
    }
}


function warnUserBeforeRestart(){
    if(!inputWarning && !gameOver){
        alert("Modifying the Winning Score will restart the game!");
        inputWarning = true;
    }
}

function updateWinningScore(){
    if(winningValueInputElement.value !== winningValue){
        winningValue = winningValueInputElement.value
        newGame()
    }
}


winningValueInputElement.addEventListener("click", warnUserBeforeRestart);
winningValueInputElement.addEventListener("oninput", updateWinningScore);

var newGameButton = document.getElementsByClassName("btn-new")[0];
newGameButton.addEventListener("click", newGame);

var rollButton = document.getElementsByClassName("btn-roll")[0];
rollButton.addEventListener("click", rollDice);

var holdButton = document.getElementsByClassName("btn-hold")[0];
holdButton.addEventListener("click", nextPlayer);