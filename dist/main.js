//const { imageToArrayBuffer } = require("src/imageutils");

console.log("Main js file!!!");
// let choseFile =  document.getElementById("formFile");
// let imgPreview = document.getElementById("img-preview");
let img = document.getElementById("test-image");
const img1 = document.querySelector("img"); 
//img.src = "https://picsum.photos/200/301";
//let img = document.getElementsByTagName("img"); //("test-image");
console.log(img.src);
//  let convertBtn = document.getElementById("convert-btn");


//-----select image code 

// function getImgData() {
//   const files = choseFile.files[0];
//   if (files) {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(files);
// 		fileReader.addEventListener("load", function(){
// 		imgPreview.style.display = "block";
// 		imgPreview.innerHTML = '<img"' + this.result +'" />';
// 		convertBtn.classList.remove('invisible');
// 										});
// 				}
//       }

      
     
//---------end of image upload


// //------ listener for asset creation
// if (convertBtn){
//   convertBt.addEventListener("click", function(){
//     createGLFTAsset();
//   })
// }
      

// createGLFTAsset();


//================ part 2

// GLFT creation


let gltfFiles;
function createGLFTAsset(){
  console.log("creating a GLFT Asset---")

  let asset = new  GLTFUtils.GLTFAsset({"number": 0, "index": 0});
  let scene = new GLTFUtils.Scene("");
  asset.addScene(scene);
  console.log(scene);

  // create a node
  let node = new GLTFUtils.Node();
  node.setTranslation(0, 0, 0);
  node.setRotationRadians(0, 0, 0);
  node.setScale(1, 1, 1);
  console.log(node);
  scene.addNode(node);

  const material = new GLTFUtils.Material();
  // error 
  //  gltfjsutils.js:617 Uncaught Error: Why is the texture image being unset?
    // at Texture.set (gltfjsutils.js:617:23)
    // at new Texture (gltfjsutils.js:609:20)
    // at createGLFTAsset (main.js:69:19)
    // at main.js:43:1 below
    // console.log(img);
    // console.log("image abovve");
  const texture = new GLTFUtils.Texture(document.getElementById("test-image").src);
  console.log('texture');
  //(img); // HTMLImageElement
  texture.wrapS = GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  //texture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  material.pbrMetallicRoughness.baseColorTexture = texture;
  material.texture = texture;

  const mesh = new GLTFUtils.Mesh();
  const vertices = [
  new GLTFUtils.Vertex(0, 0, 0),
   new GLTFUtils.Vertex(1, 0, 0),
   new GLTFUtils.Vertex(1, 1, 0),
   new GLTFUtils.Vertex(0, 1, 0)
  ];
  mesh.vertices = vertices;
  console.log("vertices added" +mesh);
  

  
  mesh.material = [material];
  node.mesh =mesh;

  console.log(node);
  console.log(mesh);
  console.log("final mesh" + node.mesh);

  // export asset as glb
  const glbFiles =  GLTFUtils.exportGLB(asset);
  console.log("glb-formatted---");
  console.log(glbFiles);


  
  // export asset as  gltf
  gltfFiles = GLTFUtils.exportGLTF(asset);
  console.log("gltf-formatted---");
  console.log(gltfFiles);

  // using async
  // console.log("doing the async thing");

  // let newGltfFiles =  downloadGlb(asset);
  // console.log(newGltfFiles);





  // plain file txt
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(asset)));
  element.setAttribute('download', "test.gltf");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);


  ///  glb download

  // const link = document.createElement("a");
  // link.href = window.URL.createObjectURL(glbFiles);
  // link.download = "test.glb";
  // link.click();




  // gltf download
  const link1 = document.createElement("a");
  const url  = window.URL.createObjectURL(new Blob([gltfFiles]));
  link1.href = url;
  link1.download = "test.gltf";
  link1.click();





  console.log(JSON.stringify(asset));
  console.log(JSON.stringify(gltfFiles));

  // return gltfFiles  + glbFiles;

}


// end of part 2































     // ================================================== initial content  below =============================
   
    
// var asset = new  GLTFUtils.GLTFAsset()



// let gltf = require('gltf-js-utils');
//let imgField = document.getElementById('img-field');

// const { Moment} = Mome
// let moment = require('moment');
// let date = new moment();
// console.log(date.format('ddd'));






//harmony import */ var gltf_js_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gltf_js_utils__WEBPACK_IMPORTED_MODULE_0__);
//let gltfJsUtils = require("gltf-js-utils");
// var asset1 = new gltf.GLTFAsset();
// console.log(asset1);
// var asset = new gltf_js_utils__WEBPACK_IMPORTED_MODULE_0__.GLTFAsset();
// console.log("here now!!");
// console.log(asset);

// import {
//   GLTFAsset, Scene, Node, Material, Texture, Mesh, Vertex, WrappingMode
// } from "gltf-js-utils";
//  const asset = new GLTFAsset();
//  console.log(asset);
// const scene = new Scene();
// asset.addScene(scene);

// const node = new Node();
// node.setTranslation(x, y, z);
// node.setRotationRadians(x, y, z);
// node.setScale(x, y, z);
// scene.addNode(node);

// const material = new Material();
// // Supported texture types: HTMLImageElement | HTMLCanvasElement | ArrayBuffer (PNG) | Data URL (PNG)
// const texture = new Texture(image);
// texture.wrapS = WrappingMode.CLAMP_TO_EDGE;
// texture.wrapT = WrappingMode.REPEAT;
// material.pbrMetallicRoughness.baseColorTexture = texture;
 
// const mesh = new Mesh();
// mesh.material = [material];
// node.mesh = mesh;
 
// const v1 = new Vertex();
// v1.x = 1;
// v1.y = 1;
// v1.z = 1;
// v1.u = 0;
// v1.v = 0;
// const v2 = new Vertex();
// // ...
 
// const faceColor = undefined;
// const faceMaterialIndex = 0;
// mesh.addFace(v1, v2, v3, faceColor, faceMaterialIndex);
// mesh.addFace(v4, v5, v6, faceColor, faceMaterialIndex);
// console.log(node);