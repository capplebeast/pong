/*
This is a JavaScript (JS) file.
JavaScript is the programming language that powers the web.

To use this file, place the following <script> tag just before the closing </body> tag in your HTML file, making sure that the filename after "src" matches the name of your file...

    <script src="script.js"></script>

Learn more about JavaScript at https://developer.mozilla.org/en-US/Learn/JavaScript

When you're done, you can delete all of this grey text, it's just a comment.
*/

var width=800, height=800
var canvas, ctx, keystate;
var player1, computer, ball;


player1 = {
  x: null,
  y: null,
  width: 20,
  height: 100,
  
  update: function(){},
  draw: function(){
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

computer = {
  x: null,
  y: null,
  width: 20, 
  height: 100,

  update: function(){},
  draw: function(){
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

ball = {
  x: null,
  y: null,
  side: 20,

  update: function(){},
  draw: function(){
    ctx.fillRect(this.x, this.y, this.side, this.side);
  }
}





function main() {
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  
  init();
  
  var loop = function () {
    update();
    draw();
    window.requestAnimationFrame(loop, canvas);
  }
  window.requestAnimationFrame(loop, canvas);
}

function init(){
  player1.x = player1.width;
  player1.y = (height - player1.height)/2;
  
  computer.x = width - (player1.width + computer.width);
  computer.y = (height - computer.height)/2;
  
  ball.x = (width - ball.side)/2;
  ball.y = (height - ball.side)/2;
  
  
}

function update(){
  ball.update();
  player1.update();
  computer.update();
}

function draw(){
  //ctx.fillRect(0,0, width, height);
  
  //ctx.save();
  //ctx.fillStyle = "wfff";
  ball.draw();
  player1.draw();
  computer.draw();
  
  ctx.restore();
}


main();