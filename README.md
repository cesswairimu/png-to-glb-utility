# Png to GLB Utility

A JS utility where you can choose an image(jpg or png), it creates a GLTF asset and inserts the image as the surface (base texture) of the asset, and lets you download it as .glb file.
You have an option add a roughness texture and a normal texture as images to the asset to manipulate the surface. You can also choose how many repeats horizontally and vertically you would like the texture to tile by.
> Demo at https://cesswairimu.github.io/png-to-glb-utility

Example of a tiled textured surface created with the utility and the resulting scene as viewed in Mozilla Hubs.

<img src="examples/glb-lit.gif" height=200 width="400">

## Reuse
- Install from [npm](https://www.npmjs.com/package/png-to-glb-utility)
- Call `createGLFTAsset` [method](https://github.com/cesswairimu/png-to-glb-utility/blob/main/dist/pngToGlbUtility.js#L3) which expects at least a base Image texture
> Accepted formats are HTML Image Element (PNG/JPG), HTML Canvas Element, ArrayBuffer (PNG) and Data URL (PNG)
- Add a roughness and a normal texture with the above accepted formats.
- Specify if you want the texture to repeat/tile on the surface.  Tiles by height 1 and width 1 by default. Expects an number array input like so  `[widthTile, HeightTile]`.
- Specify if you want to download the asset as a glb or gltf it downloads a .glb  file by default
> Example
 ```
const assetProperties = {
  baseTexture: "baseImage",
  roughnessTexture: "",
  normalTexture: "",
  tile: [7, 4],
  type: "gltf"
}
createGLFTAsset(assetProperties)

```

## dependecies
This package uses [GLTFUtils](https://www.npmjs.com/package/gltf-js-utils) library to create the GLTF asset