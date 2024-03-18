// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

var catchLimit = 5; // Set a catch limit

var gameOver = function() {

    alert("Game Over! You caught " + monstersCaught + " monsters.");
    monstersCaught = 0 // Resetting the score for a new game, optional
    reset(); // Optionally reset the game to start over
    // Logic to handle game over, like stopping the game or resetting variables
    // You might want to stop the game loop or reset monsterCaught and call reset()
};

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background4.jpeg";


// Edge image
var edgeReady = false;
var edgeImage = new Image();
edgeImage.onload = function () {
    edgeReady = true;
};
edgeImage.src = "images/edges.jpg";

// Edge2 image
var edgeReady2 = false;
var edgeImage2 = new Image();
edgeImage2.onload = function () {
    edgeReady2 = true;
};
edgeImage2.src = "images/edges2.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

//=============== done creating image objects ===========================

// Sound effect paths
var soundgotit = "images/gotit.wav";  // Path for the sound effect played when the monster is caught
var soundGameOver = "images/gameover.mp3"; // Path for the sound effect played when the game is over

//Assign audio to soundEfx
var soundEfx = document.getElementById("soundEfx"); // Assuming this element exists in your HTML

// Later in your code, to play the catch sound effect:
soundEfx.src = soundgotit;
soundEfx.play();

// And, to play the game over sound effect:
soundEfx.src = soundGameOver;
soundEfx.play();

// Game objects
var hero = {
    speed: 250, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var monster = {
// for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};
var monstersCaught = 0;

//======================= done with other variables

// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && hero.y > 32+0) { //  holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (96 + 0)) { //  holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32+0)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (96 + 0)) { // holding right key
        hero.x += hero.speed * modifier;
    }
    
    

        // Are they touching?
        if (
            hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
        ) {
            // play sound when touch
	        soundEfx.src = soundgotit;
	        soundEfx.play();

            ++monstersCaught;       // keep track of our “score”
            console.log('got em');
            soundEfx.src = soundgotit;
            soundEfx.play();
            // play sound when touch
            
            // Here, after updating monstersCaught due to catching a monster
            if (monstersCaught >= catchLimit) {
                soundEfx.src = soundGameOver; // Play game over sound
                soundEfx.play();
                gameOver(); // Call gameOver function if catch limit reached
            } else {
                reset(); // Start a new cycle regardless of game over or not
            }  
        }  
};



// Draw everything in the main render function
var render = function () {

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (edgeReady) {
        ctx.drawImage(edgeImage, 0, 0);
        ctx.drawImage(edgeImage, 0, 968);
    }

    if (edgeReady2) {
        ctx.drawImage(edgeImage2, 0, 0);
        ctx.drawImage(edgeImage2, 968, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

}


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};


// Reset the game when the player catches a monster
var reset = function () {
    hero.x = (canvas.width / 2) -16;
    hero.y = (canvas.height / 2) -16;

//Place the monster somewhere on the screen randomly
// but not in the hedges, Article in wrong, the 64 needs to be 
// hedge 32 + hedge 32 + char 32 = 96
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
};



// Let's play this game!
var then = Date.now();
reset();
main();  // Call the main game loop
