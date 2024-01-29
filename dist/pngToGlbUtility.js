/*
var assetDetails = {
  baseTexture: "baseImage",
  roughnessTexture: "",
  normalTexture: "",
  tile: [1, 1],
  type: "glb"
}
*/


let repeatTexture = false;
async function createGLFTAsset(assetDetails) {
  assetDetails.tile == null ? assetDetails.tile = [1, 1] : assetDetails.tile
  repeatTexture = assetDetails.tile.some(el => el > 1);

  // create GLTF asset, scene and node
  const asset = new GLTFUtils.GLTFAsset({ "number": 0, "index": 0 });
  const scene = new GLTFUtils.Scene("");
  asset.addScene(scene);
  const node = new GLTFUtils.Node("PngGlb");
  scene.addNode(node);

  var vertices = [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0]

  let vertex_hash = [];
  for (let i = 0; i < vertices.length; i += 5) {
    const vertex = new GLTFUtils.Vertex();
    var widthTile = assetDetails.tile[0];
    var heightTile = assetDetails.tile[1];
    vertex.x = vertices[i] * widthTile;
    vertex.y = vertices[i + 1] * heightTile;
    vertex.z = vertices[i + 2];
    vertex.u = vertices[i + 3] * widthTile; // texture co-ord
    vertex.v = vertices[i + 4] * heightTile; // texture co-ord
    vertex_hash.push(vertex);
  }

  // create mesh and add faces
  var triangles = [0, 1, 2, 2, 3, 0];
  const mesh = new GLTFUtils.Mesh();
  for (let i = 0; i < triangles.length; i += 3) {
    v1 = vertex_hash[triangles[i]];
    v2 = vertex_hash[triangles[i + 1]];
    v3 = vertex_hash[triangles[i + 2]];
    mesh.addFace(v1, v2, v3, { r: 1, g: 1, b: 1 }, 0);
  }

  // create material
  const material = await createMaterial(assetDetails.baseTexture, assetDetails.roughnessTexture, assetDetails.normalTexture);
  mesh.material = [material];
  node.mesh = mesh;
  console.log(asset);

  // export asset as GLB or GLTF
  if (assetDetails.type == 'gltf') {
    exportGltf(asset);
  } else {
    exportGlb(asset);
  }
}

async function createMaterial(baseImage, textureImage, normalImage) {
  const material = new GLTFUtils.Material();

  // Base texture handling
  let baseTexture = "";
  try {
    baseTexture = new GLTFUtils.Texture(baseImage);
  } catch (err) {
    console.log(err);
  }
  let wrapMode = repeatTexture ? GLTFUtils.WrappingMode.REPEAT : GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  baseTexture.wrapS = wrapMode;
  baseTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  material.pbrMetallicRoughness.baseColorTexture = baseTexture;

  // Roughness texture handling
  let roughnessTexture = "";
  if (textureImage != "") {
    try {
      roughnessTexture = new GLTFUtils.Texture(textureImage);
    } catch (err) {
      console.log(err);
    }
    roughnessTexture.wrapS = wrapMode;
    roughnessTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
    material.pbrMetallicRoughness.metallicRoughnessTexture = roughnessTexture;
  }

  // Normal texture handling
  let normalTexture = "";
  if (normalImage != "") {
    try {
      normalTexture = new GLTFUtils.Texture(normalImage);
    } catch (err) {
      console.log(err);
    }
    normalTexture.wrapS = wrapMode;
    normalTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
    material.normalTexture = normalTexture;
  }
  // other material properties
  material.pbrMetallicRoughness.roughnessFactor = 0.5;
  material.pbrMetallicRoughness.metallicFactor = 0.5;
  material.doubleSided = true;
  return material;
}

async function exportGltf(asset) {
  let files = await GLTFUtils.exportGLTF(asset, {
    bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
    imageOutputType: GLTFUtils.BufferOutputType.DataURI
  });
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + files['model.gltf']);
  element.setAttribute('download', "file.gltf");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

async function exportGlb(asset) {
  let files = await GLTFUtils.exportGLB(asset);
  const arrayBuffer = files;
  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'file.glb';
  a.click();
}