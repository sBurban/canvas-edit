// import { draw } from "js/zoom.js"; // Or the extension could be just `.js`

const drawScript = {
  stage: null,
  upperCurve: null,
  lowerCurve: null,
  upperCurvePoints: [],
  lowerCurvePoints: [],
  leftIrisArea: null,
  leftIrisShape: null,
  rightIrisArea: null,
  rightIrisShape: null,
  irisOptions: Object.freeze({
    none: "none",
    left: "left",
    right: "right",
  }),
  // Center and radius of the circular path

  loader: null,
  imageOrigin: null,
  testImage: null,
  imageScaler: null,
  baseCircleData: {
    circleCenter: { x: 150, y: 150 },
    circleRadius: 100,
  },
  activeIrisCircle: null,
};

drawScript.currentDrawingStage = drawScript.irisOptions.none;
// const testImageSrc = "https://s3.envato.com/files/289097391/jju-32.jpg";
const testImageSrc = base64Image;

function init() {
  drawScript.stage = new createjs.Stage("demoCanvas");
  drawScript.stage.enableMouseOver(10);
  // draw();

  // var img = new Image();
  // img.crossOrigin = "Anonymous"; // Loaded cross-domain
  // img.src = "https://s3.envato.com/files/289097391/jju-32.jpg";
  // drawScript.testImage = new createjs.Bitmap(img);
  // drawScript.loader = new createjs.LoadQueue(); // Create the LoadQueue instance once.
  // drawScript.testImage = new createjs.Bitmap(base64Image); //Image taken from another js file
  redrawImage(testImageSrc);
  setDrawingControls(false);
}

function redrawImage(url) {
  if (drawScript.testImage) {
    drawScript.stage.addChild(drawScript.testImage);
    drawScript.stage.update();
  } else loadImageAndResize(url);
}

function cancelDrawing() {
  resetCanvas();
  drawScript.currentDrawingStage = drawScript.irisOptions.none;
}

async function completeDrawing() {
  if (drawScript.currentDrawingStage === drawScript.irisOptions.left) {
    drawScript.leftIrisArea = drawScript.upperCurvePoints
      .concat(drawScript.lowerCurvePoints.reverse())
      .map((point) => ({ px: point.x, py: point.y }));
    drawScript.leftIrisShape = drawHexagon(drawScript.leftIrisArea);
  } else if (drawScript.currentDrawingStage === drawScript.irisOptions.right) {
    drawScript.rightIrisArea = drawScript.upperCurvePoints
      .concat(drawScript.lowerCurvePoints.reverse())
      .map((point) => ({ px: point.x, py: point.y }));
    drawScript.rightIrisShape = drawHexagon(drawScript.rightIrisArea);
  }
  resetCanvas();
  if (drawScript.leftIrisArea)
    drawScript.leftIrisShape = drawHexagon(drawScript.leftIrisArea);
  if (drawScript.rightIrisArea)
    drawScript.rightIrisShape = drawHexagon(drawScript.rightIrisArea);

  drawScript.currentDrawingStage = drawScript.irisOptions.none;
}

function drawHexagon(irisArea) {
  const hexagon = new createjs.Shape();

  hexagon.graphics.setStrokeStyle(2).beginStroke("purple"); //.beginFill("red");

  irisArea.forEach((point, idx) => {
    const { px, py } = point;
    if (idx === 0) hexagon.graphics.moveTo(px, py);
    else hexagon.graphics.lineTo(px, py);
  });

  // Close the area
  hexagon.graphics.lineTo(irisArea[0].px, irisArea[0].py);
  drawScript.stage.addChild(hexagon);
  drawScript.stage.update();
  return hexagon;
}

async function resetCanvas() {
  setDrawingControls(false);
  drawScript.stage.removeAllChildren();
  // drawScript.stage.update();
  drawScript.upperCurvePoints = [];
  drawScript.lowerCurvePoints = [];
  drawScript.activeIrisCircle = null;
  redrawImage(testImageSrc);
}

/**
 * Starts drawing the Right Iris circle
 */
async function setIrisRight() {
  resetCanvas();
  drawScript.currentDrawingStage = drawScript.irisOptions.right;
  setIrisCircle();
}

/**
 * Starts drawing the Left Iris circle
 */
async function setIrisLeft() {
  resetCanvas();
  drawScript.currentDrawingStage = drawScript.irisOptions.left;
  setIrisCircle();
}

/**
 * Draws a circle and points that can be manipulated
 */
function setIrisCircle() {
  let { circleCenter, circleRadius } = drawScript.baseCircleData;
  if (drawScript.currentDrawingStage === drawScript.irisOptions.right)
    circleCenter = { x: 350, y: 150 };

  drawScript.upperCurve = new createjs.Shape();
  drawScript.lowerCurve = new createjs.Shape();
  const delimitingCircle = new createjs.Shape();
  delimitingCircle.graphics
    .setStrokeStyle(2)
    .beginStroke("blue")
    // .beginFill("DeepSkyBlue")
    .drawCircle(circleCenter.x, circleCenter.y, circleRadius);

  drawScript.activeIrisCircle = delimitingCircle;

  drawScript.stage.addChild(delimitingCircle);
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

    drawScript.stage.addChild(upperPoint);
    drawScript.upperCurvePoints.push(upperPoint);
    drawScript.stage.addChild(lowerPoint);
    drawScript.lowerCurvePoints.push(lowerPoint);

    setDrawingControls(true);
  }

  // Draw the initial curves
  updateCurve();

  drawScript.stage.update();
}

/**
 * Calls both update curve functions
 */
function updateCurve() {
  upperCurveUpdate();
  lowerCurveUpdate();
}

/**
 * Updates the points that belong to the 'upperCurve' of the circle
 */
function upperCurveUpdate() {
  drawScript.upperCurve.graphics.clear();
  drawScript.upperCurve.graphics.setStrokeStyle(2);
  drawScript.upperCurve.graphics.beginStroke("black");

  const startPoint = drawScript.upperCurvePoints[0];
  const midPoint = drawScript.upperCurvePoints[1];
  const endPoint = drawScript.upperCurvePoints[2];

  // Calculate control points to ensure the curve passes through the center of the middle point
  const controlX1 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  const controlY1 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  drawScript.upperCurve.graphics.moveTo(startPoint.x, startPoint.y);
  drawScript.upperCurve.graphics.quadraticCurveTo(
    controlX1,
    controlY1,
    endPoint.x,
    endPoint.y
  );

  drawScript.stage.addChild(drawScript.upperCurve);
  drawScript.stage.update();
}

/**
 * Updates the points that belong to the 'lowerCurve of the circle
 */
function lowerCurveUpdate() {
  drawScript.lowerCurve.graphics.clear();
  drawScript.lowerCurve.graphics.setStrokeStyle(2);
  drawScript.lowerCurve.graphics.beginStroke("black");

  const startPoint = drawScript.lowerCurvePoints[0];
  const midPoint = drawScript.lowerCurvePoints[1];
  const endPoint = drawScript.lowerCurvePoints[2];

  // Calculate control points to ensure the curve passes through the center of the middle point
  const controlX1 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  const controlY1 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  drawScript.lowerCurve.graphics.moveTo(startPoint.x, startPoint.y);
  drawScript.lowerCurve.graphics.quadraticCurveTo(
    controlX1,
    controlY1,
    endPoint.x,
    endPoint.y
  );

  drawScript.stage.addChild(drawScript.lowerCurve);
  drawScript.stage.update();
}
