const { AlphaMode } = require("gltf-js-utils");

function init(type = 'gltf') {

  function uploadFile(e) {

    e.preventDefault();
    e.stopPropagation();
    files = e.target.files[0]

    if (e.target && e.target.files) var file = e.target.files[0];
    else var file = e.dataTransfer.files[0];
    if (!file) return;
    let textureImg = document.getElementById('test-image');

    var reader = new FileReader();
    reader.onload = () => {
      document.querySelector("#display-image").src = reader.result;
      createGLFTAsset(reader.result, textureImg, type);
    };
    reader.readAsDataURL(file);
  }

  $('#displayInput').on('change', uploadFile);
  // (//$('#displayInput').on('change') && )
  // $('#submit').on('click', uploadFile)
}


function prerequisite() {
  $('#displayInput').on('change', $('#submit').removeAttr('disabled'));

  console.log("Here---")
}

function enableButton() {
  $('#submit').removeAttr('disabled');
}
$('#submit').on('click', checkInputs)

function checkInputs() {
  console.log("I checked the inputs");

}


async function createGLFTAsset(uploadedSpace, textureImage, type) {
  let repeatTexture = true;
  let doubleSize = false;

  let asset = new GLTFUtils.GLTFAsset({ "number": 0, "index": 0 });
  let scene = new GLTFUtils.Scene("");
  asset.addScene(scene);
  let node = new GLTFUtils.Node("PngGlb");
  scene.addNode(node);

  const vertices1 = [[0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 2, 1, 0, 2, 0, 0, 1, 0, 0, 0]]

  const vertices = [[0, 0, 0, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 1, 4, 0, 0, 1, 1, 4, 4, 0, 1, 0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 4, 4, 0, 4, 0, 0, 4, 0, 0, 0]]
  var meshVertices = repeatTexture ? vertices[2] : doubleSize ? vertices[1] : vertices[0];


  let vertex_hash = [];
  for (let i = 0; i < meshVertices.length; i += 5) {
    const vertex = new GLTFUtils.Vertex();
    vertex.x = meshVertices[i];
    vertex.y = meshVertices[i + 1];
    vertex.z = meshVertices[i + 2];
    vertex.u = meshVertices[i + 3]; // texture co-ord
    vertex.v = meshVertices[i + 4]; // texture co-ord
    vertex_hash.push(vertex);
  }
  var triangles = [0, 1, 2, 2, 3, 0];


  const mesh = new GLTFUtils.Mesh();
  const material = new GLTFUtils.Material();


  let baseTexture = "";
  try {
    baseTexture = new GLTFUtils.Texture(uploadedSpace);
  } catch (err) {
    console.log(err);
    baseTexture = new GLTFUtils.Texture(await fetchJpgImage());
  }
  let roughnessTexture = new GLTFUtils.Texture(textureImage)
  repeatTexture || doubleSize ? baseTexture.wrapS = GLTFUtils.WrappingMode.REPEAT : baseTexture.wrapS = GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  baseTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  roughnessTexture.wrapS = GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  roughnessTexture.wrapT = GLTFUtils.WrappingMode.CLAMP_TO_EDGE;

  material.texture = [baseTexture, roughnessTexture];
  material.pbrMetallicRoughness.baseColorTexture = baseTexture;
  material.pbrMetallicRoughness.texture = roughnessTexture;
  material.pbrMetallicRoughness.roughnessTexture = roughnessTexture;
  // material.pbrMetallicRoughness = {
  //   baseColorTexture: { index: 0, texCoord: 0 },
  //   metallicRoughnessTexture: { index: 1, texCoord: 0 }
  // };
  material.roughnessFactor = 1.0;
  material.metallicFactor = 0.0;
  material.alphaCutoff = 0.5;
  material.alphaMode = GLTFUtils.AlphaMode.MASK;
  material.doubleSided = true;
  material.texture = [baseTexture, roughnessTexture]
  console.log(material);

  for (let i = 0; i < triangles.length; i += 3) {
    v1 = vertex_hash[triangles[i]];
    v2 = vertex_hash[triangles[i + 1]];
    v3 = vertex_hash[triangles[i + 2]];
    mesh.addFace(v1, v2, v3, { r: 1, g: 1, b: 1 }, 0);
  }
  mesh.material = [material];
  console.log(mesh)
  node.mesh = mesh;

  console.log(asset);

  if (type == 'glb') {
    let glbFiles = exportGlb(asset);
    console.log(glbFiles);

    glbFiles.then(function (result) {
      const arrayBuffer = result;
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'file.glb';
      a.click();
    })
  } else if (type == 'gltf') {
    let gltfFiles = exportGltf(asset);
    console.log(gltfFiles);

    gltfFiles.then(function (result) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        result['model.gltf']);
      element.setAttribute('download', "file.gltf");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })
  }
}


async function exportGltf(asset) {
  let files = await GLTFUtils.exportGLTF(asset, {
    bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
    imageOutputType: GLTFUtils.BufferOutputType.DataURI
  });
  return files;

}

async function exportGlb(asset) {
  let files = await GLTFUtils.exportGLB(asset);
  return files;
}

async function fetchJpgImage() {
  return document.getElementById("display-image");
}