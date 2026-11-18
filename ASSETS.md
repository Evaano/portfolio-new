# Asset notes

## Aemeath character

The user supplied `_fbx_aemeath_wuthering_waves_3d_model_dl_by_nekopixil_dljo1jv.rar` and its extracted folder, including `Aemeath.fbx`, texture PNGs, and material JSON files. The archive and FBX are kept outside this repository. The local source archive name attributes the download to Nekopixil; this is an attribution from the filename, not verification of authorship or a license grant.

The extracted folder contained no separate license or usage notes among its files. The terms for redistribution and use of the character, model, and textures are unknown; obtain appropriate rights before publishing or redistributing. Aemeath and Wuthering Waves are third-party intellectual property. This project is an independent fan-inspired work, not an official game location.

The FBX was inspected in Blender and contained a skeleton but no animation actions. The FBX was imported into Blender and the supplied MainTex color maps were relinked. Textures larger than 1024 pixels were resized, shape keys were removed, and the armature and skinning were retained. The exported `public/models/aemeath.glb` is a self-contained web model. Do not claim an idle or walking clip is included. The original archive and FBX should remain unchanged and outside Git.

## Portfolio project images

`src/assets/work/workImgThree.jpg`, `workImgOne.jpg`, `workImgTwo.png`, and `workImgSix.jpg` were already present in the repository and are used as project previews. Their independent licensing status was not established during this rebuild.

## Fonts

DM Sans and Cormorant Garamond are supplied locally through their `@fontsource` npm packages. See the licenses distributed with those packages.


The locally authored animated version, `public/models/aemeath-animated.glb`, adds Idle and TabGesture skeletal clips using `scripts/animate-aemeath.py`; they are not original game animations.

Current avatar: pixiv, https://github.com/pixiv/three-vrm. Usage terms are embedded in character.vrm.

Animations: Overte, converted by Hanami, https://github.com/Undi95/Hanami/tree/main/vrma. Apache 2.0 license included in public/motions/LICENSE.txt.
