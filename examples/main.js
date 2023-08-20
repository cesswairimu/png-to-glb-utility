		
			let gltfFiles;
			let glbFiles;
			
			async function createGLFTAsset(uploadedSpace){
        let asset = new  GLTFUtils.GLTFAsset({"number": 0, "index": 0});
				let scene = new GLTFUtils.Scene("");
				asset.addScene(scene);

				// create a node
				let node = new GLTFUtils.Node();
				node.setTranslation(0.1, 0.2, -3);
				node.setRotationDegrees(20, 30, -40);
				node.setScale(0.8, 0.8, 0.8);
				scene.addNode(node);

				const  vertices = [-0.5, 0.0, 0.0, 0.5, 0.0, 0.0, -0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 1.0, 0.0, 0.5, 1.0, 0.0, -0.5, 1.5, 0.0, 0.5, 1.5, 0.0, -0.5, 2.0, 0.0, 0.5, 2.0, 0.0];
        let vertex_hash = [];
        for (let i = 0; i < vertices.length; i += 3) {
          const vertex = new GLTFUtils.Vertex();
          vertex.x = vertices[i];
          vertex.y = [i + 1];
          vertex.z = vertices[i + 2];
          vertex_hash.push(vertex);
        }
        var triangles = [0, 1, 3, 0, 3, 2, 2, 3, 5, 2, 5, 4, 4, 5, 7, 4, 7, 6, 6, 7, 9, 6, 9, 8];
        
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
				
				glbFiles = downloadGlb(asset);
        gltfFiles = downloadGltf(asset);
        
        glbFiles.then(function(result){
          const arrayBuffer = result;
          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'file.glb';
          a.click();
        })

				gltfFiles.then(function(result){
					// console.log("result------");
					// console.log(result['model.gltf'])
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
			

			async function downloadGltf(asset){
				let files =   await GLTFUtils.exportGLTF(asset, {
					bufferOutputType: GLTFUtils.BufferOutputType.DataURI,
					imageOutputType: GLTFUtils.BufferOutputType.DataURI});
				return files;

			}

			async function downloadGlb(asset){
			let files = await GLTFUtils.exportGLB(asset);
			return files;
      }