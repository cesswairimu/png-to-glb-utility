function init(type='glb') {

  function uploadFile(e) {
    
    e.preventDefault();
    e.stopPropagation(); 
    files = e.target.files[0]

    if (e.target && e.target.files) var file = e.target.files[0];
    else var file = e.dataTransfer.files[0];
    if(!file) return;

    var reader = new FileReader();
    reader.onload = () => {
      createGLFTAsset(reader.result, type);
    };
    reader.readAsDataURL(file);
  }

  $('#formFile').on('change', uploadFile); 
}


async function createGLFTAsset(uploadedSpace, type){
  console.log('inside gltf creation-----')
  console.log('type-----' +type);

  let asset = new  GLTFUtils.GLTFAsset({"number": 0, "index": 0});
  let scene = new GLTFUtils.Scene("");
  asset.addScene(scene);

  // create a node
  let node = new GLTFUtils.Node();
  // node.setTranslation(0.1, 0.2, -3);
  // node.setRotationDegrees(20, 30, -40);
  // node.setScale(0.8, 0.8, 0.8);
  scene.addNode(node);

  const  vertices = [0,0,0,0,0, 1,0,0, 1, 0, 1,1,0,1,1, 0,1,0,0,1 ];
  let vertex_hash = [];
  for (let i = 0; i < vertices.length; i += 5) {
    const vertex = new GLTFUtils.Vertex();
    vertex.x = vertices[i];
    vertex.y = vertices[i + 1];
    vertex.z = vertices[i + 2];
    vertex.u = vertices[i + 3]; // texture co-ord
    vertex.v = vertices[i + 4]; // texture co-ord
    vertex_hash.push(vertex);
  }
  var triangles = [0, 1, 2, 2, 3, 0];

    
  const mesh = new GLTFUtils.Mesh();
  const material = new GLTFUtils.Material();
  const texture = new GLTFUtils.Texture(uploadedSpace);
  texture.wrapS = GLTFUtils.WrappingMode.CLAMP_TO_EDGE;
  texture.wrapT = GLTFUtils.WrappingMode.REPEAT;
  material.pbrMetallicRoughness.baseColorTexture = texture;
  material.doubleSided = true;
  material.texture = texture;
  mesh.material = [material];
  
  for (let i = 0; i < triangles.length; i += 3) {
    v1 = vertex_hash[triangles[i]];
    v2 = vertex_hash[triangles[i + 1]];
    v3 = vertex_hash[triangles[i + 2]];
    mesh.addFace(v1, v2, v3, {r: 1, g: 1, b: 1}, 0);
  }
  node.mesh = mesh;
  console.log(asset);
  
  if(type=='glb'){
    let glbFiles = exportGlb(asset);
    glbFiles.then(function(result){
      const arrayBuffer = result;
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'file.glb';
      a.click();
    })
  } else if (type =='gltf'){
    let gltfFiles = exportGltf(asset);

    gltfFiles.then(function(result){
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


async function exportGltf(asset){
  let files =   await GLTFUtils.exportGLTF(asset, {
    bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
    imageOutputType: GLTFUtils.BufferOutputType.DataURI});
  return files;

}

async function exportGlb(asset){
let files = await GLTFUtils.exportGLB(asset);
return files;
}