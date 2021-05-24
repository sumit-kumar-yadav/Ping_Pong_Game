var ball = document.getElementById('ball');
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');


const storeName = "PPName";
const storeScore = "PPMaxScore";
const player1Name = "Player 1";
const player2Name = "Player 2";


let score,
    maxScore,
    movement,
    player,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;



(function () {
    player = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (player === "null" || maxScore === "null") {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        player = "Player1"
    } else {
        alert(
            "*Use left & right arrows to control the rod.                                             " + 
            "*" + 
            player + " has maximum score of " + maxScore * 100
        );
    }

    resetBoard(player);
})();



function resetBoard(playerName) {

    player1.style.left = (window.innerWidth - player1.offsetWidth) / 2 + 'px';
    player2.style.left = (window.innerWidth - player2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Lossing player gets the ball
    if (playerName === player2Name) {
        ball.style.top = (player1.offsetTop + player1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (playerName === player1Name) {
        ball.style.top = (player2.offsetTop - player2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;

}



function storeWin(player, score) {

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, player);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(movement);
    resetBoard(player);
    document.getElementById("score").innerHTML = 0;

    alert(player + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));

}




window.addEventListener('keydown', function(){
    console.log("event.code", event.code);
    let playerSpeed = 20;
    var playerLeft = player1.offsetLeft;
    var playerWidth = player1.offsetWidth;
    var playerHeight = player1.offsetHeight;
    // let playerRect = player1.getBoundingClientRect();  --->> in solution

    if ((event.code === "KeyD" || event.code === "ArrowRight") && ((playerLeft + playerWidth) < windowWidth)) {
        player1.style.left = (playerLeft) + playerSpeed + 'px';
        player2.style.left = player1.style.left;
    } else if ((event.code === "KeyA" || event.code === "ArrowLeft") && (playerLeft > 0)) {
        player1.style.left = (playerLeft) - playerSpeed + 'px';
        player2.style.left = player1.style.left;
    }

    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let player1Height = player1.offsetHeight;
            let player2Height = player2.offsetHeight;
            let player1Width = player1.offsetWidth;
            let player2Width = player2.offsetWidth;


            movement = setInterval(function () {
                // Move ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                var player1X = player1.getBoundingClientRect().x;
                var player2X = player2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Player 1
                if (ballY <= player1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;
                    document.getElementById("score").innerHTML = score*100;

                    // Check if the game ends
                    if ((ballPos < player1X) || (ballPos > (player1X + player1Width))) {
                        storeWin(player2Name, score);
                    }
                }

                // Check for Player 2
                else if ((ballY + ballDia) >= (windowHeight - player2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;
                    document.getElementById("score").innerHTML = score*100;

                    // Check if the game ends
                    if ((ballPos < player2X) || (ballPos > (player2X + player2Width))) {
                        storeWin(player1Name, score);
                    }
                }

            }, 10);

        }
        else{
            alert("Press Enter again to continue the game");
        }
    }

})