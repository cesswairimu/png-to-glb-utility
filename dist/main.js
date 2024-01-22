let baseImage;
let textureImage = "";
let normalImage = "";

function preInputs() {
  let inputFiles = ['fileInput', 'fileInput1', 'fileInput2']
  let outputFiles = ['fileNameOutput', 'fileNameOutput1', 'fileNameOutput2']


  inputFiles.forEach(function (elem) {
    var input = document.getElementById(elem);
    var ouput = document.getElementById(outputFiles[inputFiles.indexOf(elem)]);
    input.addEventListener("change", (event) => {
      const fileName = event.target.files[0].name;
      ouput.value = fileName;

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        // console.log(input.name);
        // input.name.value = e.target.result;
        // console.log(input.name.value);
        if (elem == "fileInput") {
          const previewImage = document.getElementById('imagePreview');
          previewImage.src = e.target.result;

        }
      };
      reader.readAsDataURL(file);

    });
  });

  // collapse sections
  const toggleCheckbox = document.getElementById("checkboxRoughness");
  const collapsibleSection = document.getElementById("roughness-section");

  toggleCheckbox.addEventListener("change", () => {
    collapsibleSection.style.display = toggleCheckbox.checked ? 'block' : 'none';
  });

  const normalCheckbox = document.getElementById("normalTexture");
  const normalSection = document.getElementById("normal-section");

  normalCheckbox.addEventListener("change", () => {
    normalSection.style.display = normalCheckbox.checked ? 'block' : 'none';
  });

  // form submission
  const form = document.getElementById("inputForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('submitting form');

    const formData = new FormData(form);
    const displayImg = formData.get('fileInput1');
    const textureImg = formData.get('fileInput2');
    const normalImg = formData.get('fileInput3');

    console.log(displayImg);
    console.log(textureImg);
    console.log(normalImg);
    console.log(formData.get('repeatImage'))

    const reader = new FileReader();
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader.readAsDataURL(displayImg);
    reader1.readAsDataURL(textureImg);
    reader2.readAsDataURL(normalImg);
    // console.log(res);

    reader.onload = () => {
      const uriFile = reader.result;
      document.querySelector("#display-image").src = reader.result;
      baseImage = reader.result;
      console.log("input base");
      console.log(baseImage);
    }

    reader1.onload = () => {
      textureImage = reader1.result;
      document.querySelector("#texture-image").src = reader1.result;
      console.log("input texture");

      console.log(textureImage)
    }

    reader2.onload = () => {
      normalImage = reader2.result;
      document.querySelector("#normal-image").src = reader2.result;
      console.log("input normal");
      console.log(normalImage);
    }
    createGLFTAsset();
  });
}











// --- end  of submit form




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
// let textureImg = "";

async function createGLFTAsset(type = "gltf") {
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

  var material = await createMaterial();
  mesh.material = [material];
  node.mesh = mesh;
  console.log(asset);
  if (type == 'glb') {
    exportGlb(asset);
  } else if (type == 'gltf') {
    exportGltf(asset);
  }
}

async function createMaterial() {
  let doubleSize = false;
  const material = new GLTFUtils.Material();

  let baseTexture = "";
  try {
    baseTexture = new GLTFUtils.Texture(baseImage);
  } catch (err) {
    console.log(err);
    baseTexture = new GLTFUtils.Texture(await fetchJpgImage("display-image"));
  }
  let wrapMode = repeatTexture || doubleSize ? GLTFUtils.WrappingMode.REPEAT : GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  baseTexture.wrapS = wrapMode;
  baseTexture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  material.pbrMetallicRoughness.baseColorTexture = baseTexture;

  let roughnessTexture = "";
  if (textureImage != "") {
    try {
      roughnessTexture = new GLTFUtils.Texture(textureImage);
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

  let normalTexture = "";
  if (normalImage != "") {
    try {
      normalTexture = new GLTFUtils.Texture(normalImage);
    } catch (err) {
      console.log(err);
      normalTexture = new GLTFUtils.Texture(await fetchJpgImage("normal-image"));
    }
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