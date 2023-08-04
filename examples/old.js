// var circle = new createjs.Shape();
// circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
// circle.x = 100;
// circle.y = 100;
// stage.addChild(circle);

/**********testing failed************ */

const ImagePath = "assets/womaneyes.jpg";

let manifest = [
  // {
  //   src: "https://naruhodo.repop.jp/wp-content/uploads/2018/01/kitarou.png",
  //   id: "kitarou",
  // },
  // {
  //   src: "https://naruhodo.repop.jp/wp-content/uploads/2018/01/medamaoyaji.png",
  //   id: "medamaoyaji",
  // },
  // { src: "https://s3.envato.com/files/289097391/jju-32.jpg", id: "womaneyes" },
  { src: ImagePath, id: "womaneyes" },
];
let images = [];

function loadImage() {
  loader.removeAllEventListeners(); // Remove any existing event listeners.
  loader.on("progress", handleProgress);
  loader.addEventListener("fileload", fileload);
  loader.addEventListener("complete", handleComplete);
  loader.on("error", handleError);
  loader.loadManifest(manifest, true);
  // loader.loadFile({
  //   id: ="womaneyes"
  //   src: ImagePath,
  //   type: createjs.LoadQueue.IMAGE,
  // });
}

function handleProgress(event) {
  // Handle the loading progress here (e.g., update a progress bar).
  console.log("Progress: " + event.progress * 100 + "%");
}
function fileload(event) {
  if (event.item.type == "image") {
    images[event.item.id] = event.result;
  }
}
function handleComplete(event) {
  // All assets are loaded successfully. You can access your loaded assets through the queue's getResult method.
  var image = loader.getResult("womaneyes");
  console.log("Image loaded:", image);
}
function handleError(event) {
  // Handle errors if any occur during loading.
  console.log("Error loading asset:", event);
}
// function complete(event) {
//   event.target.removeEventListener("fileload", fileload);
//   event.target.removeEventListener("complete", complete);
//   // initExample();
// }

// function loadItem(url) {
//   var queue = new createjs.LoadQueue(true, null, true);
//   //Add the event listener and handler
//   queue.on(
//     "fileload",
//     function (event) {
//       var type = event.item.type;
//       if (type == createjs.LoadQueue.IMAGE) {
//         //make a CreateJS Bitmap object from the result
//         var imgItem = event.result;
//         image = new createjs.Bitmap(imgItem.src);
//         stage.addChild(image);
//         stage.update();
//       }
//     },
//     null,
//     true
//     // options
//   ); //create a LoadItem and set the crossOrigin property
//   var loadItem = new createjs.LoadItem().set({
//     src: url,
//     crossOrigin: "Anonymous",
//   }); //load it
//   queue.loadFile(loadItem);
// }

function initExample() {
  let stage = new createjs.Stage("main");
  let bg = new createjs.Shape();
  bg.graphics.beginFill("black").drawRect(0, 0, 500, 300);
  stage.addChild(bg);

  let kitarou = new createjs.Bitmap(images["kitarou"]);
  stage.addChild(kitarou);
  kitarou.x = 50;
  kitarou.y = 50;
  kitarou.scaleX = 0.2;
  kitarou.scaleY = 0.2;

  let medamaoyaji = new createjs.Bitmap(images["medamaoyaji"]);
  stage.addChild(medamaoyaji);
  medamaoyaji.x = 300;
  medamaoyaji.y = 160;
  medamaoyaji.scaleX = 0.1;
  medamaoyaji.scaleY = 0.1;

  stage.update();
}
