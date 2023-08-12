function test(num) {
  console.log("num: ", num);
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
