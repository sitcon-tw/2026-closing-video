import * as THREE from "three";
import { registerAnimate, scene, unregisterAnimate } from "../three-setup";

// Outro: Ring of spinning torus shapes with warm orange/red theme
interface TorusData {
	mesh: THREE.Mesh;
	angle: number;
	radius: number;
	speed: number;
	rotationSpeed: { x: number; y: number };
}

const toruses: TorusData[] = [];
const lights: THREE.Light[] = [];
const torusColors = [0xf59e0b, 0xef4444, 0xf97316, 0xfbbf24];

// Create torus ring
for (let i = 0; i < 12; i++) {
	const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 32);
	const material = new THREE.MeshPhongMaterial({
		color: torusColors[Math.floor(Math.random() * torusColors.length)],
		transparent: true,
		opacity: 0,
		shininess: 100,
		emissive: torusColors[Math.floor(Math.random() * torusColors.length)],
		emissiveIntensity: 0.2,
	});
	const torus = new THREE.Mesh(geometry, material);

	const angle = (i / 12) * Math.PI * 2;
	const radius = 15;

	torus.position.x = Math.cos(angle) * radius;
	torus.position.y = Math.sin(angle) * radius;
	torus.position.z = -5;

	scene.add(torus);
	toruses.push({
		mesh: torus,
		angle: angle,
		radius: radius,
		speed: 0.3 + Math.random() * 0.2,
		rotationSpeed: {
			x: (Math.random() - 0.5) * 0.05,
			y: (Math.random() - 0.5) * 0.05,
		},
	});
}

// Center glowing sphere
const centerGeometry = new THREE.SphereGeometry(3, 32, 32);
const centerMaterial = new THREE.MeshPhongMaterial({
	color: 0xfbbf24,
	transparent: true,
	opacity: 0,
	emissive: 0xf59e0b,
	emissiveIntensity: 0.5,
});
const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
centerSphere.position.z = -5;
scene.add(centerSphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
lights.push(ambientLight);

const pointLight1 = new THREE.PointLight(0xf59e0b, 2, 100);
pointLight1.position.set(0, 0, 20);
scene.add(pointLight1);
lights.push(pointLight1);

const pointLight2 = new THREE.PointLight(0xef4444, 1, 100);
pointLight2.position.set(0, 0, -20);
scene.add(pointLight2);
lights.push(pointLight2);

function animateOutro(time: number) {
	toruses.forEach((t) => {
		// Orbit around center
		t.angle += t.speed * 0.016;
		t.mesh.position.x = Math.cos(t.angle) * t.radius;
		t.mesh.position.y = Math.sin(t.angle) * t.radius;

		// Self rotation
		t.mesh.rotation.x += t.rotationSpeed.x;
		t.mesh.rotation.y += t.rotationSpeed.y;

		// Pulse radius
		const pulseRadius = t.radius + Math.sin(time * 2) * 2;
		t.mesh.position.x = Math.cos(t.angle) * pulseRadius;
		t.mesh.position.y = Math.sin(t.angle) * pulseRadius;
	});

	// Pulse center sphere
	const scale = 1 + Math.sin(time * 3) * 0.2;
	centerSphere.scale.setScalar(scale);
	centerSphere.rotation.y += 0.01;
}

function cleanup() {
	unregisterAnimate(animateOutro);
	toruses.forEach((t) => scene.remove(t.mesh));
	scene.remove(centerSphere);
	lights.forEach((light) => scene.remove(light));
}

export function outro(tl: gsap.core.Timeline) {
	// Register animation
	tl.call(() => registerAnimate(animateOutro), [], 10);

	// Change background to warm dark
	tl.to("main", { backgroundColor: "#1a0a0a", duration: 1 }, 9);

	// Fade in toruses and center sphere
	tl.to(".outro-section", { opacity: 1, duration: 0.5 }, 10);

	toruses.forEach((t, i) => {
		tl.to((t.mesh.material as THREE.MeshPhongMaterial), { opacity: 0.8, duration: 0.5 }, 10 + i * 0.05);
	});
	tl.to(centerMaterial, { opacity: 0.9, duration: 1 }, 10);

	tl.to(".outro", { opacity: 1, scale: 1.1, duration: 2 }, 10);

	// Fade out
	tl.to(".outro", { opacity: 0, scale: 1.3, duration: 2 }, 13);

	toruses.forEach((t) => {
		tl.to((t.mesh.material as THREE.MeshPhongMaterial), { opacity: 0, duration: 1.5 }, 13);
	});
	tl.to(centerMaterial, { opacity: 0, duration: 1.5 }, 13);

	tl.to(".outro-section", { opacity: 0, duration: 1 }, 14);
	tl.to("main", { backgroundColor: "#000000", duration: 1.5 }, 14);
	tl.call(cleanup, [], 15);
}