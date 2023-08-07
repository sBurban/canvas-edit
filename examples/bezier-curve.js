var stage;
var curve;
var controlPoints = [];

function init() {
  stage = new createjs.Stage("canvas");
  curve = new createjs.Shape();
  stage.enableMouseOver(10);

  // Create the control points and add them to the stage
  for (let i = 0; i < 3; i++) {
    const point = new createjs.Shape();
    point.graphics.beginFill("red").drawCircle(0, 0, 6);
    point.x = 50 + i * 100;
    point.y = 150;
    point.cursor = "pointer";

    point.on("pressmove", function (evt) {
      this.x = evt.stageX;
      this.y = evt.stageY;
      updateCurve();
    });

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
  //   const controlX2 = 2 * midPoint.x - (startPoint.x + endPoint.x) / 2;
  //   const controlY2 = 2 * midPoint.y - (startPoint.y + endPoint.y) / 2;

  curve.graphics.moveTo(startPoint.x, startPoint.y);
  curve.graphics.bezierCurveTo(
    midPoint.x,
    midPoint.y,
    controlX1,
    controlY1,
    endPoint.x,
    endPoint.y
  );

  // To pass through the center always, you need this instead
  //   curve.graphics.quadraticCurveTo(controlX1, controlY1, endPoint.x, endPoint.y);

  stage.addChild(curve);
  stage.update();
}

// init();
