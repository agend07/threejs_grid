import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";
// import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "jsm/postprocessing/RenderPass.js";
// import { GTAOPass } from 'jsm/postprocessing/GTAOPass.js';
// import { OutputPass } from 'jsm/postprocessing/OutputPass.js';

import {Tween, Easing} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

const width = window.innerWidth, height = window.innerHeight;

// init
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 40);
camera.position.z = 9;
camera.position.y = -2;

const scene = new THREE.Scene();

const boxGroup = new THREE.Group();
scene.add(boxGroup);
boxGroup.update = (t) => {
	boxGroup.rotation.z = t;
};

const geometry = new THREE.BoxGeometry();
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const geometry = new THREE.SphereGeometry(0.3, 16, 16);
const spacing = 1.1;
const palette = [0x780000, 0xc1121f, 0xfdf0d5, 0x003049, 0x669bbc];

const gridSize = 2;
const startPos = {x: -2, y: -2,	z: 0};

function createBox({ color = 0x00ff00, index = 0, x = 0, y = 0, z = 0, scale = 1 }) {
	const material = new THREE.MeshStandardMaterial({ color })
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = startPos.x + x * spacing;
	mesh.position.y = startPos.y + y * spacing;
	mesh.position.z = z + (Math.floor(Math.random() * 3) + 1) * 0.2;
	mesh.rotation.z = Math.PI * 0.25;

	mesh.scale.setScalar(scale);
	return mesh;
}


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// const ctrls = new OrbitControls(camera, renderer.domElement);
// ctrls.enableDamping = true;


for (let x = 0; x < gridSize; x += 1) {
	for (let y = 0; y < gridSize; y += 1) {
		const hex = palette[Math.floor(Math.random() * palette.length)];
		const color = new THREE.Color(hex);
		const scale = 1.1 + Math.random() * 0.2 - 0.1;
		const z = -1 + Math.random() * 0.2 - 0.1;
		const box = createBox({ color, index: x + y, x, y, z, scale });
		boxGroup.add(box);
	}
}

// for (let x = 0; x < gridSize; x += 1) {
//   for (let y = 0; y < gridSize; y += 1) {
//     const hex = palette[Math.floor(Math.random() * palette.length)];
//     const color = new THREE.Color(hex);
//     const scale = (Math.floor(Math.random() * 8) + 1) * 0.2;
//     const z = Math.random() * 0.2 - 0.1;
//     const box = createBox({ color, index: x + y, x, y, z, scale });
//     boxGroup.add(box);
//   }
// }

scene.add(boxGroup);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
// scene.add(hemiLight);

const directLight = new THREE.DirectionalLight(0xffffff, 1);
directLight.position.set(1, 1, 1);
scene.add(directLight);

// const pointlight = new THREE.PointLight(0xffffff, 3);

// pointlight.position.x = 1;
// pointlight.position.z = 2;
// scene.add(pointlight);

const raycaster = new THREE.Raycaster();

let tween = null

function onClick(event) {
    const mouse = {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    }
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(boxGroup.children, false)
    if (intersects.length > 0) {
        const obj = intersects[0].object;

        const targetPos = new THREE.Vector3();
        obj.getWorldPosition(targetPos);

        targetPos.z += 4;

        tween = new Tween(camera.position, false)
        .to(targetPos, 500)
        .onComplete(() => {
          console.log("Tween stopped");
          tween = null;
        })
        .start()

        return
    }
}

renderer.domElement.addEventListener('click', onClick, false);

// function animateCamera() {
//   if (!cameraTarget) return;
//   camera.position.lerpVectors(camera.position, cameraTarget, 0.001);
//   camera.lookAt(cameraLookAt);
//   if (camera.position.distanceTo(cameraTarget) < 0.1) {
//     cameraTarget = null;
//   }
// }

function animate() {
  renderer.render(scene, camera);
  // if (tween) {
  //   tween.update();
  //   console.log("Tween updating");
  // }
  // ctrls.update();
  requestAnimationFrame(animate);
}

animate();
