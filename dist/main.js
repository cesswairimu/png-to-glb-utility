function init() {
  toggleSection("checkboxRoughness", "roughness-section");
  toggleSection("normalTexture", "normal-section");

  // display uploads
  const inputFiles = ['fileInput', 'fileInput1', 'fileInput2'];
  const outputFiles = ['fileNameOutput', 'fileNameOutput1', 'fileNameOutput2'];
  inputFiles.forEach((elem) => {
    const input = document.getElementById(elem);
    const output = document.getElementById(outputFiles[inputFiles.indexOf(elem)]);
    input.addEventListener("change", (event) => {
      const fileName = event.target.files[0].name;
      output.value = fileName;
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (elem === "fileInput") {
          document.getElementById('imagePreview').src = e.target.result;
          $("#submitBtn").removeClass("disabled");
        }
      };
      reader.readAsDataURL(file);
    });
  });

//submit form
  const form = document.getElementById("inputForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitForm(form)

    form.reset();
    resetForm();
  });
}


async function submitForm(form) {
  const formData = new FormData(form);
  const displayImg = formData.get('fileInput1');
  const textureImg = formData.get('fileInput2');
  const normalImg = formData.get('fileInput3');
  const repeatImage = formData.get('repeatImage');

  await Promise.all([
    readFileAsDataURL(displayImg),
    readFileAsDataURL(textureImg),
    readFileAsDataURL(normalImg)
  ]).then(([baseImage, textureImage, normalImage]) => {
    document.querySelector("#display-image").src = baseImage;
    document.querySelector("#texture-image").src = textureImage;
    document.querySelector("#normal-image").src = normalImage;

    // console.log('Calling createGLTFAsset ---');
    createGLFTAsset(baseImage, textureImage, normalImage, "glb");
  });
}
let repeatTexture = false;
async function createGLFTAsset(uploadedSpace, textureImage = "", normalImage = "", type = "gltf") {
  // console.log("inside create gltf --- ");
  // console.log(uploadedSpace);
  // console.log(textureImage);

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

  var material = await createMaterial(uploadedSpace, textureImage, normalImage);
  // console.log("material--")
  // console.log(material);
  mesh.material = [material];
  node.mesh = mesh;
  console.log(asset);
  if (type == 'glb') {
    exportGlb(asset);
  } else if (type == 'gltf') {
    exportGltf(asset);
  }
}

async function createMaterial(uploadedSpace, textureImage, normalImage) {
  let doubleSize = false;
  const material = new GLTFUtils.Material();

  let baseTexture = "";
  let base = document.getElementById('display-image');
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
  if (textureImage != "data:application/octet-stream;base64,") {
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
  if (normalImage != "data:application/octet-stream;base64,") {
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

function resetForm() {
  document.getElementById('imagePreview').src = "";
  $("#submitBtn").addClass("disabled");

}

function toggleSection(checkboxId, sectionId) {
  const checkbox = document.getElementById(checkboxId);
  const section = document.getElementById(sectionId);

  checkbox.addEventListener("change", () => {
    section.style.display = checkbox.checked ? 'block' : 'none';
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
