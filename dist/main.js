function init(type = 'gltf') {

  function uploadFile(e) {

    e.preventDefault();
    e.stopPropagation();
    files = e.target.files[0]

    if (e.target && e.target.files) var file = e.target.files[0];
    else var file = e.dataTransfer.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = () => {
      document.querySelector("#display-image").src = reader.result;
      createGLFTAsset(reader.result, type);
    };
    reader.readAsDataURL(file);
  }

  $('#textureInput').on('change', uploadTexture);
  $('#displayInput').on('change', uploadFile);
}


let repeatTexture = false;
let textureImg = "";

async function createGLFTAsset(uploadedSpace, type) {
  let doubleSize = false;
  if ($('#textureRepeat').is(':checked')) { repeatTexture = true }

  let asset = new GLTFUtils.GLTFAsset({ "number": 0, "index": 0 });
  let scene = new GLTFUtils.Scene("");
  asset.addScene(scene);
  let node = new GLTFUtils.Node("PngGlb");
  scene.addNode(node);
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
  for (let i = 0; i < triangles.length; i += 3) {
    v1 = vertex_hash[triangles[i]];
    v2 = vertex_hash[triangles[i + 1]];
    v3 = vertex_hash[triangles[i + 2]];
    mesh.addFace(v1, v2, v3, { r: 1, g: 1, b: 1 }, 0);
  }

  var material = await createMaterial(uploadedSpace);
  mesh.material = [material];
  node.mesh = mesh;
  console.log(asset);
  if (type == 'glb') {
    exportGlb(asset);
  } else if (type == 'gltf') {
    exportGltf(asset);
  }
}

async function createMaterial(uploadedSpace) {
  let doubleSize = false;
  const material = new GLTFUtils.Material();

  let baseTexture = "";
  try {
    baseTexture = new GLTFUtils.Texture(uploadedSpace);
  } catch (err) {
    console.log(err);
    baseTexture = new GLTFUtils.Texture(await fetchJpgImage("display-image"));
  }
  let wrapMode = repeatTexture || doubleSize ? GLTFUtils.WrappingMode.REPEAT : GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  baseTexture.wrapS = wrapMode;
  baseTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  material.pbrMetallicRoughness.baseColorTexture = baseTexture;

  let roughnessTexture = "";
  if (textureImg != "") {
    try {
      roughnessTexture = new GLTFUtils.Texture(textureImg);
    } catch (err) {
      console.log(err);
      roughnessTexture = new GLTFUtils.Texture(await fetchJpgImage("texture-image"));
    }
    roughnessTexture.wrapS = wrapMode;
    roughnessTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
    material.pbrMetallicRoughness.metallicRoughnessTexture = roughnessTexture;
  }
  material.pbrMetallicRoughness.roughnessFactor = 0.5;
  material.pbrMetallicRoughness.metallicFactor = 0.5;
  material.doubleSided = true;
  material.pbrMetallicRoughness.metallicRoughnessTexture = roughnessTexture;

  if (normalImg != "") {
    let normalImg = document.getElementById('test-image');
    let normalTexture = new GLTFUtils.Texture(normalImg);
    material.normalTexture = normalTexture;
  }
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
  console.log(files);
  const arrayBuffer = files;
  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'file.glb';
  a.click();
}

async function fetchJpgImage(name) {
  return document.getElementById(name);
}

function uploadTexture(e) {
  e.preventDefault();
  e.stopPropagation();
  files = e.target.files[0]

  if (e.target && e.target.files) var file = e.target.files[0];
  else var file = e.dataTransfer.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = () => {
    document.querySelector("#texture-image").src = reader.result;
    textureImg = reader.result;
  };
  reader.readAsDataURL(file);
}