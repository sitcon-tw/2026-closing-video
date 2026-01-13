import * as THREE from "three";

// const width = outputWidth;
// const height = outputHeight;
const outputWidth = 1920;
const outputHeight = 1080;

// Three.js setup - shared renderer and camera
const container = document.getElementById("three-container")!;
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, outputWidth / outputHeight, 0.1, 1000);
camera.position.z = 30;

export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(outputWidth, outputHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Animation registry - scenes can register their animate functions
type AnimateFunction = (time: number) => void;
const animateFunctions: Set<AnimateFunction> = new Set();

export function registerAnimate(fn: AnimateFunction) {
	animateFunctions.add(fn);
}

export function unregisterAnimate(fn: AnimateFunction) {
	animateFunctions.delete(fn);
}

// Time state - controlled by GSAP timeline
let currentTime = 0;
let isPaused = false;

export function setThreeTime(time: number) {
	currentTime = time;
}

export function setThreePaused(paused: boolean) {
	isPaused = paused;
}

// Main animation loop - only renders, time is controlled externally
function animate() {
	requestAnimationFrame(animate);

	if (!isPaused) {
		animateFunctions.forEach(fn => fn(currentTime));
	}

	renderer.render(scene, camera);
}
animate();

// Handle resize for Three.js
// export function handleResize() {
// 	camera.aspect = outputWidth / outputHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize(outputWidth, outputHeight);
// }
