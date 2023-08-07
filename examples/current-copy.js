var canvas, stage;
var loader;

var mouseTarget; // the display object currently under the mouse, or being dragged
var dragStarted; // indicates whether we are currently in a drag operation
var offset;
var update = true;

// LOGIC HANDLERS

// SETUP

function init() {
  // create stage and point it to the canvas:
  canvas = document.getElementById("demoCanvas");
  stage = new createjs.Stage(canvas);

  loader = new createjs.LoadQueue(); // Create the LoadQueue instance once.
  let testImage = new createjs.Bitmap(base64Image); //Image taken from another js file

  stage.addChild(testImage);
  testImage.x = 20;
  testImage.y = 20;
  testImage.scaleX = 0.9;
  testImage.scaleY = 0.7;

  stage.update();
}

var circle1;
var circle2;
var circle3;

function setIrisLeft() {
  var container = new createjs.Container();
  stage.addChild(container);

  circle1 = circle1 ?? createCircle(container, 1);
  circle2 = circle2 ?? createCircle(container, 2);
  circle3 = circle3 ?? createCircle(container, 3);

  drawLine(circle1.x, circle1.y, circle2.x, circle2.y);

  // enable touch interactions if supported on the current device:
  createjs.Touch.enable(stage);

  // enabled mouse over / out events
  stage.enableMouseOver(10);
  stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

  createjs.Ticker.addEventListener("tick", tick);
}

function drawLine(x1, y1, x2, y2) {
  const line = new createjs.Shape();
  line.graphics.setStrokeStyle(2); // Set the line thickness (you can adjust this value as needed).
  line.graphics.beginStroke("black"); // Set the line color.
  line.graphics.moveTo(x1, y1); // Move to the starting point (x1, y1).
  line.graphics.lineTo(x2, y2); // Draw a line to the ending point (x2, y2).
  // line.graphics.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2); // Draw the Bezier curve.
  stage.addChild(line); // Add the line to the stage (assuming you have already created the stage).
  stage.update(); // Update the stage to see the changes.
}

// Actions carried out each tick (aka frame)
function tick(event) {
  // This set makes it so the stage only re-renders when an event handler indicates a change has happened.
  if (update) {
    update = false; // only update once
    stage.update(event);
  }
}

function stop() {
  createjs.Ticker.removeEventListener("tick", tick);
}

function createCircle(container, index) {
  const newShape = new createjs.Shape();
  container.addChild(newShape);
  var myGraphics = newShape.graphics;
  var fillCommand = myGraphics.beginFill("DeepSkyBlue").command;
  myGraphics.drawCircle(0, 0, 10);

  if (!index || index == 1) {
    fillCommand.style = "DeepSkyBlue";
    newShape.x = 50;
    newShape.y = 50;
  } else if (index == 2) {
    fillCommand.style = "red";
    newShape.x = 100;
    newShape.y = 100;
  } else if (index == 3) {
    fillCommand.style = "green";
    newShape.x = 150;
    newShape.y = 150;
  }
  // newShape.regX = 50; // left offset
  // newShape.regY = 50; // y offset
  newShape.name = "circle_" + index;
  newShape.cursor = "pointer";
  const originalScale = newShape.scale;

  // using "on" binds the listener to the scope of the currentTarget by default
  // in this case that means it executes in the scope of the button.
  newShape.on("mousedown", function (evt) {
    const o = evt.target;
    // Move the clicked shape to the top of its parent's display list (z-index).
    o.parent.addChild(o);
    // this.parent.addChild(o);

    // Calculate the offset between the mouse cursor position and the newShape's position.
    this.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };
    // o.offset = { x: o.x - evt.stageX, y: o.y - evt.stageY };
  });

  // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
  newShape.on("pressmove", function (evt) {
    const o = evt.target;
    o.x = evt.stageX + o.offset.x;
    o.y = evt.stageY + o.offset.y;
    // this.x = evt.stageX + this.offset.x;
    // this.y = evt.stageY + this.offset.y;
    // indicate that the stage should be updated on the next tick:
    update = true;
  });

  // Increases size while mouse is over the Shape
  newShape.on("rollover", function (evt) {
    const o = evt.target;
    o.scale = o.scale * 1.2;
    // this.scale = this.scale * 1.2;
    update = true;
  });

  // Returns size to normal when mouse is out of Shape
  newShape.on("rollout", function (evt) {
    const o = evt.target;
    o.scale = originalScale;
    update = true;
  });

  stage.addChild(newShape);
  stage.update();
  return newShape;
}
