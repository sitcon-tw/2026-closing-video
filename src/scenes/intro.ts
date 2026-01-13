import * as THREE from "three";
import { registerAnimate, scene, unregisterAnimate } from "../three-setup";

// Intro: Floating cubes with purple/blue theme
interface CubeData {
	mesh: THREE.Mesh;
	rotationSpeed: { x: number; y: number; z: number };
	floatSpeed: number;
	floatOffset: number;
	originalY: number;
}

const cubes: CubeData[] = [];
const lights: THREE.Light[] = [];
const cubeColors = [0x6366f1, 0x8b5cf6, 0xa855f7, 0x7c3aed];

// Create cubes
for (let i = 0; i < 15; i++) {
	const size = Math.random() * 2 + 1;
	const geometry = new THREE.BoxGeometry(size, size, size);
	const material = new THREE.MeshPhongMaterial({
		color: cubeColors[Math.floor(Math.random() * cubeColors.length)],
		transparent: true,
		opacity: 0,
		shininess: 100
	});
	const cube = new THREE.Mesh(geometry, material);

	cube.position.x = (Math.random() - 0.5) * 50;
	cube.position.y = (Math.random() - 0.5) * 30;
	cube.position.z = (Math.random() - 0.5) * 20 - 10;
	cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

	scene.add(cube);
	cubes.push({
		mesh: cube,
		rotationSpeed: {
			x: (Math.random() - 0.5) * 0.02,
			y: (Math.random() - 0.5) * 0.02,
			z: (Math.random() - 0.5) * 0.01
		},
		floatSpeed: Math.random() * 0.5 + 0.5,
		floatOffset: Math.random() * Math.PI * 2,
		originalY: cube.position.y
	});
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
lights.push(ambientLight);

const pointLight1 = new THREE.PointLight(0x6366f1, 1, 100);
pointLight1.position.set(20, 20, 20);
scene.add(pointLight1);
lights.push(pointLight1);

const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 100);
pointLight2.position.set(-20, -20, 20);
scene.add(pointLight2);
lights.push(pointLight2);

function animateIntro(time: number) {
	cubes.forEach(cube => {
		cube.mesh.rotation.x += cube.rotationSpeed.x;
		cube.mesh.rotation.y += cube.rotationSpeed.y;
		cube.mesh.rotation.z += cube.rotationSpeed.z;
		cube.mesh.position.y = cube.originalY + Math.sin(time * cube.floatSpeed + cube.floatOffset) * 2;
	});
}

function cleanup() {
	unregisterAnimate(animateIntro);
	cubes.forEach(cube => scene.remove(cube.mesh));
	lights.forEach(light => scene.remove(light));
}

export function intro(tl: gsap.core.Timeline) {
	// Register animation
	registerAnimate(animateIntro);

	tl.set("main", { backgroundColor: "#0d1b2a" }, 0);

	// Fade in cubes
	tl.to(".intro-section", { opacity: 1, duration: 0.5 }, 0);
	cubes.forEach((cube, i) => {
		tl.to(cube.mesh.material as THREE.MeshPhongMaterial, { opacity: 0.7, duration: 1 }, i * 0.1);
	});

	tl.to(".title", { opacity: 1, y: -100, duration: 2 }, 0);
	tl.to(".subtitle", { opacity: 1, duration: 1 }, 1);

	// Hide intro section and cubes
	tl.to(".title", { opacity: 0, scale: 0.8, duration: 1 }, 3);
	tl.to(".subtitle", { opacity: 0, duration: 0.8 }, 3);

	cubes.forEach(cube => {
		tl.to(cube.mesh.material as THREE.MeshPhongMaterial, { opacity: 0, duration: 1 }, 3);
	});

	tl.to(".intro-section", { opacity: 0, duration: 0.5 }, 3.5);
	tl.call(cleanup, [], 4);
}
