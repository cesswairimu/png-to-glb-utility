async function createAsset(){

const asset = new GLTFUtils.GLTFAsset();
const scene = new GLTFUtils.Scene();
asset.addScene(scene);
let v1;
let v2;
let v3;


const node = new GLTFUtils.Node();
scene.addNode(node);

const vertices = [1,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0,1,0];
let vertex_hash = [];
for (let i = 0; i < vertices.length; i += 3) {
  const vertex = new GLTFUtils.Vertex();
  vertex.x = vertices[i];
  vertex.y = [i + 1];
  vertex.z = vertices[i + 2];
  vertex_hash.push(vertex);
}

var triangles = [0,1,2,2,3,0,4,5,1,1,0,4,6,7,5,5,4,6,3,2,7,7,6,3,7,1,5,7,2,1,4,0,6,0,3,6];
const mesh = new GLTFUtils.Mesh();
mesh.material = [new GLTFUtils.Material()];
for (let i = 0; i < triangles.length; i += 3) {
   v1 = vertex_hash[triangles[i]];
   v2 = vertex_hash[triangles[i + 1]];
   v3 = vertex_hash[triangles[i + 2]];
  mesh.addFace(v1, v2, v3, {r: 1, g: 1, b: 1}, 0);
}
node.mesh = mesh;

const object = GLTFUtils.exportGLTF(asset, {
  bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
  imageOutputType: GLTFUtils.BufferOutputType.DataURI,
});

// const { obj, res }  = await GLTFUtils.exportGLTF(asset, {
//   bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
//   imageOutputType: GLTFUtils.BufferOutputType.DataURI,
// }).then(result => result.data);

const { obj, res } = await GLTFUtils.exportGLTF(asset, {
  bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
  imageOutputType: GLTFUtils.BufferOutputType.DataURI,
});


// const { width, height } = await pdfDoc.getPages()[0].getSize();

// const files = GLTFUtils.exportGLTF(asset, {
//   bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
//   imageOutputType: GLTFUtils.BufferOutputType.DataURI,
// });

console.log(object);

console.log("moment---of--truth!!--");
console.log({obj, res})
}

// async function dwd(asset){
//   await GLTFUtils.exportGLTF(asset, {
//     bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
//     imageOutputType: GLTFUtils.BufferOutputType.DataURI,
//   });
  
// }


/// ============= wait imgae to load code ===============

//let lightboxElem = document.querySelector("#lightbox");
// let imgElem = document.querySelector("img");

//let lightboxControlsElem = lightboxElem.querySelector(".toolbar");

// async function loadImage(url, elem) {
//   return new Promise((resolve, reject) => {
//     elem.onload = () => resolve(elem);
//     elem.onerror = reject;
//     elem.src = url;
//   });
// }

// let count = 0;
// function loadImg() {
//   if (imgElem.complete) {
//     //fixRedEye(lightboxImgElem);
//     // $('#asset-btn').on('click', function(event) {
//     //   createAsset();
//     // });	
//     console.log("img now loaded!!!");

//   } else {
//     console.log("waiting for image to load ---- "+ count+1);
//     /* can't start doing this until the image is fully loaded */
//   }
// }
//// --- sandbox -----

// let lightboxElem = document.querySelector("#lightbox");
// let lightboxImgElem = lightboxElem.querySelector("img");
// let lightboxControlsElem = lightboxElem.querySelector(".toolbar");

// // async function loadImage(url, elem) {
//   return new Promise((resolve, reject) => {
//     elem.onload = () => resolve(elem);
//     elem.onerror = reject;
//     elem.src = url;
//   });
// }

// async function lightBox(url) {
//   lightboxElem.style.display = "block";
//   await loadImage("https://somesite.net/huge-image.jpg", lightboxImgElem);
//   lightboxControlsElem.disabled = false;
// }


// let count = 0;
// function fixRedEyeCommand() {
//   if (lightboxElem.style.display === "block" && lightboxImgElem.complete) {
//     fixRedEye(lightboxImgElem);
//   } else {
//     console.log("waiting for image to load ---- "+ count+1);
//     /* can't start doing this until the image is fully loaded */
//   }
// }



/// ------///


//  ================== fire the create asset function ===============
// $('#asset-btn').on('click', function(event) {
//   	createAsset();
//   });	