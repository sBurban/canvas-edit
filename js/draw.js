var stage;
var upperCurve;
var lowerCurve;
var delimitingCircle;
var upperCurvePoints = [];
var lowerCurvePoints = [];

var leftIrisArea;
var rightIrisArea;

// Center and radius of the circular path
const circleCenter = { x: 150, y: 150 };
const circleRadius = 100;

function init() {
  stage = new createjs.Stage("demoCanvas");
  stage.enableMouseOver(10);
}

function cancelDrawing() {
  resetCanvas();
}

function completeDrawing() {
  leftIrisArea = upperCurvePoints
    .concat(lowerCurvePoints.reverse())
    .map((point) => ({ px: point.x, py: point.y }));
  console.log(
    "🚀 ~ file: draw.js:31 ~ completeDrawing ~ leftIrisArea:",
    leftIrisArea
  );

  resetCanvas();
  drawHexagon(leftIrisArea);
}

function drawHexagon(irisArea) {
  const hexagon = new createjs.Shape();

  hexagon.graphics.setStrokeStyle(2).beginStroke("purple").beginFill("red");

  irisArea.forEach((point, idx) => {
    const { px, py } = point;
    if (idx === 0) hexagon.graphics.moveTo(px, py);
    else hexagon.graphics.lineTo(px, py);
  });

  // Close the area
  hexagon.graphics.lineTo(irisArea[0].px, irisArea[0].py);
  stage.addChild(hexagon);
  stage.update();
}

function resetCanvas() {
  setDrawingArea(false);
  stage.removeAllChildren();
  stage.update();
  upperCurvePoints = [];
  lowerCurvePoints = [];
}

function setDrawingArea(isDrawing) {
  document.querySelector(".controls").innerHTML = "";
  if (!isDrawing) {
    const button1 = $(
      `<button onClick="setIrisLeft();">Set Iris Left</button>`
    ).appendTo(".controls");
    const button2 = $(
      `<button onClick="setIrisRight();">Set Iris Right</button>`
    ).appendTo(".controls");
    const button3 = $(`<button onClick="test(3)">3</button>`).appendTo(
      ".controls"
    );
    const button4 = $(`<button onClick="test(4);">4</button>`).appendTo(
      ".controls"
    );
  } else {
    const button1 = $(
      `<button onClick="completeDrawing();">Accept</button>`
    ).appendTo(".controls");
    const button2 = $(
      `<button onClick="cancelDrawing();">Cancel</button>`
    ).appendTo(".controls");
  }
}

function setIrisLeft() {
  resetCanvas();
  setIrisCircle();
}

function setIrisCircle() {
  upperCurve = new createjs.Shape();
  lowerCurve = new createjs.Shape();
  delimitingCircle = new createjs.Shape();
  delimitingCircle.graphics
    .setStrokeStyle(2)
    .beginStroke("blue")
    // .beginFill("DeepSkyBlue")
    .drawCircle(circleCenter.x, circleCenter.y, circleRadius);

  stage.addChild(delimitingCircle);
  const colors = ["grey", "red", "green", "yellow"];

  // Create the control points and add them to the stage
  for (let i = 1; i < 4; i++) {
    const upperPoint = new createjs.Shape();
    upperPoint.graphics.beginFill(colors[i]).drawCircle(0, 0, 12);
    upperPoint.cursor = "pointer";

    const lowerPoint = new createjs.Shape();
    lowerPoint.graphics.beginFill(colors[i]).drawCircle(0, 0, 12);
    lowerPoint.cursor = "pointer";

    let angleValue = 0;
    if (i == 1) {
      angleValue = (Math.PI * 5) / 6;
    } else if (i == 3) {
      angleValue = Math.PI / 6;
    }

    if (i == 2) {
      // Middle points
      upperPoint.x = circleCenter.x + circleRadius * Math.cos(Math.PI / 2);
      upperPoint.y =
        circleCenter.y + circleRadius * Math.sin(-(Math.PI * 5) / 6);
      upperPoint.on("pressmove", function (evt) {
        this.x = evt.stageX;
        this.y = evt.stageY;
        // console.log("coords: ", this.x, this.y);
        upperCurveUpdate();
      });

      lowerPoint.x = circleCenter.x + circleRadius * Math.cos(Math.PI / 2);
      lowerPoint.y =
        circleCenter.y + circleRadius * Math.sin((Math.PI * 5) / 6);
      lowerPoint.on("pressmove", function (evt) {
        this.x = evt.stageX;
        this.y = evt.stageY;
        // console.log("coords: ", this.x, this.y);
        lowerCurveUpdate();
      });
    } else {
      // Start and end points
      upperPoint.x = circleCenter.x + circleRadius * Math.cos(-angleValue);
      upperPoint.y = circleCenter.y + circleRadius * Math.sin(-angleValue);
      upperPoint.on("pressmove", function (evt) {
        // Calculate the angle and distance from the center to the current position
        const dx = evt.stageX - circleCenter.x;
        const dy = evt.stageY - circleCenter.y;
        const angle = Math.atan2(dy, dx);
        // const distance = Math.min(circleRadius, Math.sqrt(dx * dx + dy * dy));
        const distance = circleRadius;
        // Update the control point's position to stay within the circular path
        this.x = circleCenter.x + distance * Math.cos(angle);
        this.y = circleCenter.y + distance * Math.sin(angle);
        upperCurveUpdate();
      });

      lowerPoint.x = circleCenter.x + circleRadius * Math.cos(angleValue);
      lowerPoint.y = circleCenter.y + circleRadius * Math.sin(angleValue);
      lowerPoint.on("pressmove", function (evt) {
        // Calculate the angle and distance from the center to the current position
        const dx = evt.stageX - circleCenter.x;
        const dy = evt.stageY - circleCenter.y;
        const angle = Math.atan2(dy, dx);
        // const distance = Math.min(circleRadius, Math.sqrt(dx * dx + dy * dy));
        const distance = circleRadius;
        // Update the control point's position to stay within the circular path
        this.x = circleCenter.x + distance * Math.cos(angle);
        this.y = circleCenter.y + distance * Math.sin(angle);
        lowerCurveUpdate();
      });
    }

    stage.addChild(upperPoint);
    upperCurvePoints.push(upperPoint);
    stage.addChild(lowerPoint);
    lowerCurvePoints.push(lowerPoint);

    setDrawingArea(true);
  }

  // Draw the initial curves
  updateCurve();

  stage.update();
}

function updateCurve() {
  upperCurveUpdate();
  lowerCurveUpdate();
}

function upperCurveUpdate() {
  upperCurve.graphics.clear();
  upperCurve.graphics.setStrokeStyle(2);
  upperCurve.graphics.beginStroke("black");

  const startPoint = upperCurvePoints[0];
  const midPoint = upperCurvePoints[1];
  const endPoint = upperCurvePoints[2];

  // Calculate control points to ensure the curve passes through the center of the middle point
  const controlX1 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  const controlY1 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  upperCurve.graphics.moveTo(startPoint.x, startPoint.y);
  upperCurve.graphics.quadraticCurveTo(
    controlX1,
    controlY1,
    endPoint.x,
    endPoint.y
  );

  stage.addChild(upperCurve);
  stage.update();
}

function lowerCurveUpdate() {
  lowerCurve.graphics.clear();
  lowerCurve.graphics.setStrokeStyle(2);
  lowerCurve.graphics.beginStroke("black");

  const startPoint = lowerCurvePoints[0];
  const midPoint = lowerCurvePoints[1];
  const endPoint = lowerCurvePoints[2];

  // Calculate control points to ensure the curve passes through the center of the middle point
  const controlX1 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  const controlY1 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  lowerCurve.graphics.moveTo(startPoint.x, startPoint.y);
  lowerCurve.graphics.quadraticCurveTo(
    controlX1,
    controlY1,
    endPoint.x,
    endPoint.y
  );

  stage.addChild(lowerCurve);
  stage.update();
}

// init();
