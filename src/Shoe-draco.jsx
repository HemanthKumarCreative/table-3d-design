import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { TextureLoader, Color } from "three";
import { useControls } from "leva";
import SheoDraco from "../public/models/shoe-draco.glb";

export function Model(props) {
  const { nodes, materials } = useGLTF(SheoDraco);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  // Load textures
  const textureLoader = new TextureLoader();
  const texturePaths = [
    "blanket_diffuse.png",
    "blanket_normal.png",
    "blanket_rough.png",
    "BrushFabricStitches08_ALPHA_2K.psd",
    "BrushFabricStitches08_MASK_2K.png",
    "Fabric036_2K_Color.jpg",
    "Fabric036_2K_Normal.jpg",
    "Fabric036_2K_Roughness.jpg",
    "FabricUpholsteryBrightAnglePattern001_AO_3K.jpg",
    "FabricUpholsteryBrightAnglePattern001_COL_VAR2_3K.jpg",
    "FabricUpholsteryBrightAnglePattern001_COL_VAR3_3K.jpg",
    "FabricUpholsteryBrightAnglePattern001_DISP16_3K.tif",
    "FabricUpholsteryBrightAnglePattern001_GLOSS_3K.jpg",
    "FabricUpholsteryBrightAnglePattern001_MASK_3K.tif",
  ];
  const textures = texturePaths.map((path) =>
    textureLoader.load("../public/textures" + path)
  );

  // Function to apply the texture to the materials
  const applyTexture = (materialName, texture) => {
    if (materials[materialName]) {
      materials[materialName].map = texture;
      materials[materialName].needsUpdate = true;
    }
  };

  const controls = {};
  Object.keys(materials).forEach((m) => {
    controls[m + " Color"] = {
      value:
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
      onChange: (v) => {
        materials[m].color = new Color(v);
      },
    };
    controls[m + " Texture"] = {
      options: texturePaths,
      onChange: (path) => {
        const selectedTexture = textures[texturePaths.indexOf(path)];
        applyTexture(m, selectedTexture);
      },
    };
  });

  useControls("Shoe", () => controls);

  return (
    <group
      {...props}
      dispose={null}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        document.getElementById("Shoe." + e.object.material.name).focus();
      }}
    >
      <mesh geometry={nodes.shoe.geometry} material={materials.laces} />
      <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} />
      <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} />
      <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} />
      <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} />
      <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} />
      <mesh geometry={nodes.shoe_6.geometry} material={materials.band} />
      <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} />
    </group>
  );
}

useGLTF.preload(SheoDraco);
