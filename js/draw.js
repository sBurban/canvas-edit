var stage;
var curve;
var controlPoints = [];

// Center and radius of the circular path
const circleCenter = { x: 150, y: 150 };
const circleRadius = 100;

function init() {
  stage = new createjs.Stage("demoCanvas");
  curve = new createjs.Shape();
  stage.enableMouseOver(10);

  const delimitingCircle = new createjs.Shape();
  delimitingCircle.graphics
    .setStrokeStyle(2)
    .beginStroke("blue")
    // .beginFill("DeepSkyBlue")
    .drawCircle(circleCenter.x, circleCenter.y, circleRadius);

  stage.addChild(delimitingCircle);

  // Create the control points and add them to the stage
  for (let i = 1; i < 4; i++) {
    const point = new createjs.Shape();
    point.graphics.beginFill("red").drawCircle(0, 0, 12);
    // point.x = 50 + i * 100;
    // point.y = 150;
    point.cursor = "pointer";
    // point.x = circleCenter.x + circleRadius * Math.cos((2 * Math.PI * i) / 3);
    // point.y = circleCenter.y + circleRadius * Math.sin((2 * Math.PI * i) / 3);
    // point.x = circleCenter.x + circleRadius * Math.cos(-1 * Math.PI * i);
    // point.y = circleCenter.y + circleRadius * Math.sin((Math.PI / 2) * i);

    let angleValue = 0;
    if (i == 1) angleValue = Math.PI / 6;
    else if (i == 3) angleValue = (Math.PI * 5) / 6;

    if (i == 2) {
      // Middle point
      point.x = circleCenter.x + circleRadius * Math.cos(Math.PI / 2);
      point.y = circleCenter.y + circleRadius * Math.sin((Math.PI * 5) / 6);
      point.on("pressmove", function (evt) {
        this.x = evt.stageX;
        this.y = evt.stageY;
        // console.log("coords: ", this.x, this.y);
        updateCurve();
      });
    } else {
      // Start and end points
      point.x = circleCenter.x + circleRadius * Math.cos(angleValue);
      point.y = circleCenter.y + circleRadius * Math.sin(angleValue);
      point.on("pressmove", function (evt) {
        // Calculate the angle and distance from the center to the current position
        const dx = evt.stageX - circleCenter.x;
        const dy = evt.stageY - circleCenter.y;
        const angle = Math.atan2(dy, dx);
        // const distance = Math.min(circleRadius, Math.sqrt(dx * dx + dy * dy));
        const distance = circleRadius;
        // Update the control point's position to stay within the circular path
        this.x = circleCenter.x + distance * Math.cos(angle);
        this.y = circleCenter.y + distance * Math.sin(angle);
        updateCurve();
      });
    }

    stage.addChild(point);
    controlPoints.push(point);
  }

  // Draw the initial curve
  updateCurve();

  stage.update();
}

function updateCurve() {
  curve.graphics.clear();
  curve.graphics.setStrokeStyle(2);
  curve.graphics.beginStroke("black");

  const startPoint = controlPoints[0];
  const midPoint = controlPoints[1];
  const endPoint = controlPoints[2];

  // Calculate control points to ensure the curve passes through the center of the middle point
  const controlX1 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  const controlY1 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  curve.graphics.moveTo(startPoint.x, startPoint.y);
  curve.graphics.quadraticCurveTo(controlX1, controlY1, endPoint.x, endPoint.y);

  stage.addChild(curve);
  stage.update();
}

// init();
