function test(num) {
  console.log("num: ", num);
}

// function scaleFace() {
//   faceContainer.scaleX =
//     faceContainer.scaleY =
//     faceContainer.scale =
//       parseFloat($("#sldScale").val()) / sldScaleFactor;
//   stage.update();
// }
// function setSldSclaeVal(n) {
//   $("#sldScale").val(parseInt(n * sldScaleFactor));
//   $("#sldScale").trigger("change");
// }
// $("#sldScale").val(parseInt(faceContainer.scale * sldScaleFactor));

function buildScale({ id, containerClass, min = 20, max = 2000 }) {
  const checkExisting = document.getElementById(id);
  if (!checkExisting) {
    document.querySelector(`.${containerClass}`).innerHTML = "";
    const container = $(`.${containerClass}`);
    const labelParent = $(`<div class="col-xs-2 col-sm-1 col-md-1"></div>`);
    const label = $(`<label for="${id}">scale</label>`);
    const scaleParent = $(`<div class="col-xs-10 col-sm-11 col-md-11"></div>`);
    const scale = $(
      `<input id="${id}" type="range" min="${min}" max="${max}" value="200" step="2" style="width: 100%;">`
    ).on("change", function (e) {
      const bitmap = drawScript.testImage;
      const image = drawScript.imageOrigin;
      const scaleElem = e.currentTarget;

      sldScaleFactor = 100;

      // bitmap.scale = parseFloat(scaleElem.value) / sldScaleFactor;
      // drawScript.stage.update();
      const newScale = parseFloat(scaleElem.value) / sldScaleFactor;

      resizeImage({
        bitmap,
        image,
        scale: newScale,
      });
    });

    labelParent.append(label);
    scaleParent.append(scale);
    container.append(labelParent).append(scaleParent);
    return scale;
  }

  return checkExisting;
}

function setDrawingControls(isDrawing) {
  document.querySelector(".controls").innerHTML = "";
  const scaleElem = buildScale({
    id: "sldScale",
    containerClass: "bottomSlider",
  });
  drawScript.imageScaler = scaleElem;

  if (!isDrawing) {
    const button1 = $(
      `<button onClick="setIrisLeft();">Set Iris Left</button>`
    ).appendTo(".controls");
    const button2 = $(
      `<button onClick="setIrisRight();">Set Iris Right</button>`
    ).appendTo(".controls");
    const button3 = $(
      `<button onClick="testColor()">Set Color</button>`
    ).appendTo(".controls");
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

function loadImageAndResize(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function () {
      if (image.naturalWidth) {
        if (image.naturalWidth + image.naturalHeight === 0) {
          image.onerror();
          return;
        }
      } else if (image.width + image.height === 0) {
        image.onerror();
        return;
      }
      const bitmap = new createjs.Bitmap(image);
      // Add an offset attribute to make dragging smoother
      bitmap.offset = { x: 0, y: 0 };

      drawScript.stage.addChild(bitmap);

      enableDrag(bitmap);

      // bitmap.on("pressmove", function (evt) {
      //   this.x = evt.stageX + this.offset.x;
      //   this.y = evt.stageY + this.offset.y;
      //   drawScript.stage.update();
      // });
      // bitmap.on("pressup", function (evt) {
      //   this.offset.x = this.x - evt.stageX;
      //   this.offset.y = this.y - evt.stageY;
      // });

      resizeImage({ bitmap, image });

      drawScript.imageOrigin = image;
      drawScript.testImage = bitmap;
      resolve(true);
    };
    image.onerror = function () {
      reject("Failed to load image");
    };
    image.src = url;
  });
}

function resizeImage({ bitmap, image, scale = null }) {
  // Calculate scale factors to fit the image inside the canvas
  const maxWidth = drawScript.stage.canvas.width;
  const maxHeight = drawScript.stage.canvas.height;

  if (!scale) {
    scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  }

  bitmap.scaleX = scale;
  bitmap.scaleY = scale;

  // Center the image on the canvas
  bitmap.x = (maxWidth - image.width * scale) / 2;
  bitmap.y = (maxHeight - image.height * scale) / 2;

  if (drawScript.activeIrisCircle) {
    const { command } = drawScript.activeIrisCircle.graphics;
    // x,y:150 - r: 100
    bitmap.x = (maxWidth - command.radius * 2 * scale) / 2;
    bitmap.y = (maxHeight - command.radius * 2 * scale) / 2;
  }

  drawScript.stage.update();
}

// loadImageAndResize("path/to/your/image.jpg");
var dragging = false;

function enableDrag(obj) {
  obj.on("mousedown", dragstart);
  obj.on("pressmove", drag);
}
function dragstart(evt) {
  dragging = false;
}
function drag(evt) {
  // register object starting point and mousedrag (stage) starting point
  if (!dragging || !dragging.startCoords || !dragging.stageCoords) {
    dragging = evt.currentTarget;
    dragging.startCoords = { x: dragging.x, y: dragging.y };
    dragging.stageCoords = { x: evt.stageX, y: evt.stageY };
  }

  // calculate mouse offset after move, relative to starting point, subtract this movement from object coords (move)
  dragging.stageMove = {
    x: dragging.stageCoords.x - evt.stageX,
    y: dragging.stageCoords.y - evt.stageY,
  };
  dragging.objectMove = {
    x: dragging.startCoords.x - dragging.stageMove.x,
    y: dragging.startCoords.y - dragging.stageMove.y,
  };

  // apply movement to object
  evt.currentTarget.x = dragging.objectMove.x;
  evt.currentTarget.y = dragging.objectMove.y;

  drawScript.stage.update(); //update stage without passing through ticker for higher FPS
}
