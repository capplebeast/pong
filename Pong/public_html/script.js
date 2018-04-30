var
/**
 * Constants
 */
WIDTH  = 750,
HEIGHT = 650,
pi = Math.PI,
UpArrow   = 87,
DownArrow = 83,

//difficulty Setting
diff = .1,
//total Wins
aiWins = 0,
playerWins = 0,
//Current Game Scores
aiScore = 0,
playerScore = 0,
/**
 * Game elements
 */
canvas,
ctx,
keystate,
/**
 * The player paddle
 * 
 * @type {Object}
 */
player = {
	x: null,
	y: null,
	width:  14,
	height: 110,
	/**
	 * Update the position depending on pressed keys
	 */
	update: function() {
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	/**
	 * Draw the player paddle to the canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},
/**
 * The ai paddle
 * 
 * @type {Object}
 */
ai = {
	x: null,
	y: null,
	width:  14,
	height: 110,
	/**
	 * Update the position depending on the ball position
	 */
	update: function() {
		// calculate ideal position
		var desty = ball.y - (this.height - ball.side)*0.5;
		// ease the movement towards the ideal position
		this.y += (desty - this.y) * diff;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	/**
	 * Draw the ai paddle to the canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},
/**	
 * The ball object
 * 
 * @type {Object}
 */
ball = {
	x:   null,
	y:   null,
	vel: null,
	side:  13,
	speed: 14,
	/**
	 * Serves the ball towards the specified side
	 * 
	 * @param  {number} side 1 right
	 *                       -1 left
	 */
	serve: function(side) {
		// set the x and y position
		var r = Math.random();
		this.x = side===1 ? player.x+player.width : ai.x - this.side;
		this.y = (HEIGHT - this.side)*r;
		// calculate out-angle, higher/lower on the y-axis =>
		// steeper angle
		var phi = 0.1*pi*(1 - 2*r);
		// set velocity direction and magnitude
		this.vel = {
			x: side*this.speed*Math.cos(phi),
			y: this.speed*Math.sin(phi)
		}
	},
	/**
	 * Update the ball position and keep it within the canvas
	 */
	update: function() {
		// update position with current velocity
		this.x += this.vel.x;
		this.y += this.vel.y;
		// check if out of the canvas in the y direction
		if (0 > this.y || this.y+this.side > HEIGHT) {
			// calculate and add the right offset, i.e. how far
			// inside of the canvas the ball is
			var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side);
			this.y += 2*offset;
			// mirror the y velocity
			this.vel.y *= -1;
		}
		// helper function to check intesectiont between two
		// axis aligned bounding boxex (AABB)
		var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};
		// check against target paddle to check collision in x
		// direction
		var pdle = this.vel.x < 0 ? player : ai;
		if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
				this.x, this.y, this.side, this.side)
		) {	
                        playAudioBlip();
			// set the x position and calculate reflection angle
			this.x = pdle===player ? player.x+player.width : ai.x - this.side;
			var n = (this.y+this.side - pdle.y)/(pdle.height+this.side);
			var phi = 0.25*pi*(2*n - 1); // pi/4 = 45
			// calculate smash value and update velocity
			var smash = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
			this.vel.x = smash*(pdle===player ? 1 : -1)*this.speed*Math.cos(phi);
			this.vel.y = smash*this.speed*Math.sin(phi);
		}
		// reset the ball when ball outside of the canvas in the
		// x direction
                
               
            
                //PLAYER LOSES ROUND
		if (0 > this.x+this.side) {
                    this.serve(pdle===player ? 1 : -1);
                    aiScore +=1;
		}
                //COMPUTER LOSES ROUND
                if(this.x > WIDTH){
                    this.serve(pdle===player ? 1 : -1);
                    playerScore +=1;
                    
                }
	},
	/**
	 * Draw the ball to the canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
};
/**
 * Starts the game
 */
function main() {
	// create, initiate and append game canvas
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	keystate = {};
	// keep track of keyboard presses
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	initialize(); // initiate game objects
        
	// game loop function
	var loop = function() {
		update();
		draw();
                if(playerScore>5){
                    playerWins += 1;
                    ball.speed = 0;
                    document.getElementById("Menu").style.visibility = "visible";
                    document.getElementById("StartButton").style.visibility = "hidden";
                    document.getElementById("PlayAgainButton").style.visibility = "visible";
                    var str = "Player Wins: "+playerWins;
                    document.getElementById("playerWinsTag").innerHTML = str;
                    var str = "AI Wins: "+aiWins;
                    document.getElementById("aiWinsTag").innerHTML = str;
                    playerScore = 0;
                    aiScore = 0;
                    window.requestAnimationFrame(loop, canvas);
                }
                else if (aiScore>5){
                    aiWins +=1;
                    ball.speed = 0;
                    document.getElementById("Menu").style.visibility = "visible";
                    document.getElementById("StartButton").style.visibility = "hidden";
                    document.getElementById("PlayAgainButton").style.visibility = "visible";
                    var str = "Player Wins: "+playerWins;
                    document.getElementById("playerWinsTag").innerHTML = str;
                    var str = "AI Wins: "+aiWins;
                    document.getElementById("aiWinsTag").innerHTML = str;
                    playerScore = 0;
                    aiScore = 0;
                    window.requestAnimationFrame(loop, canvas);
                }
                else{
                    window.requestAnimationFrame(loop, canvas);
                }
	};
    
	window.requestAnimationFrame(loop, canvas);

}
/**
 * Initatite game objects and set start positions
 */
function initialize() {
	player.x = player.width;
	player.y = (HEIGHT - player.height)/2;
	ai.x = WIDTH - (player.width + ai.width);
	ai.y = (HEIGHT - ai.height)/2;
	ball.serve(1);
}
/**
 * Update all game objects
 */
function update() {
	ball.update();
	player.update();
	ai.update();
}
/**
 * Clear canvas and draw all game objects and net
 */
function draw() {
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.save();
	ctx.fillStyle = "Tan";
        ctx.font = "30px Arial";
        ctx.fillText("Player Score: " + playerScore, 50, 50);
        ctx.fillText("AI Score: " + aiScore, 460, 50);
	ball.draw();
	player.draw();
	ai.draw();
	// draw the net
	var w = 3;
	var x = (WIDTH - w)*0.5;
	var y = 0;
	var step = HEIGHT/40; // how many net segments
	while (y < HEIGHT) {
		ctx.fillRect(x, y+step*0.25, w, step*0.5);
		y += step;
	}
	ctx.restore();
}
// start and run the game

function startGame(){
        main();
        document.getElementById("Menu").style.visibility = "hidden";
}

function playAgain(){
    ball.speed = 14;
    aiScore = 0;
    playerScore = 0;
    ball.serve(1);
}

function increaseDiff(){
    diff += .015;
}
function decreaseDiff(){
    diff -= .015;
}

function playAudioBlip(){
    var x = document.getElementById("Blip");
    x.play();
}

function playAudio(){
    var x = document.getElementById("Avicii");
    x.play();
}

playAudio();

