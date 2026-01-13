import * as THREE from "three";
import { registerAnimate, scene, unregisterAnimate } from "../three-setup";

// Names: Floating particles / spheres with teal/green theme
interface ParticleData {
	mesh: THREE.Mesh;
	velocity: THREE.Vector3;
	originalPos: THREE.Vector3;
}

const particles: ParticleData[] = [];
const lights: THREE.Light[] = [];
const particleColors = [0x06b6d4, 0x14b8a6, 0x10b981, 0x22d3ee];

// Create particles (small spheres)
for (let i = 0; i < 50; i++) {
	const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.2, 16, 16);
	const material = new THREE.MeshPhongMaterial({
		color: particleColors[Math.floor(Math.random() * particleColors.length)],
		transparent: true,
		opacity: 0,
		shininess: 150,
		emissive: particleColors[Math.floor(Math.random() * particleColors.length)],
		emissiveIntensity: 0.3,
	});
	const particle = new THREE.Mesh(geometry, material);

	const pos = new THREE.Vector3(
		(Math.random() - 0.5) * 60,
		(Math.random() - 0.5) * 40,
		(Math.random() - 0.5) * 30 - 5
	);
	particle.position.copy(pos);

	scene.add(particle);
	particles.push({
		mesh: particle,
		velocity: new THREE.Vector3(
			(Math.random() - 0.5) * 0.05,
			(Math.random() - 0.5) * 0.05,
			(Math.random() - 0.5) * 0.02
		),
		originalPos: pos.clone(),
	});
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
lights.push(ambientLight);

const pointLight1 = new THREE.PointLight(0x06b6d4, 1.5, 100);
pointLight1.position.set(15, 15, 25);
scene.add(pointLight1);
lights.push(pointLight1);

const pointLight2 = new THREE.PointLight(0x10b981, 1.5, 100);
pointLight2.position.set(-15, -15, 25);
scene.add(pointLight2);
lights.push(pointLight2);

function animateNames(time: number) {
	particles.forEach((p) => {
		// Swirling motion
		p.mesh.position.x = p.originalPos.x + Math.sin(time * 0.5 + p.originalPos.y * 0.1) * 3;
		p.mesh.position.y = p.originalPos.y + Math.cos(time * 0.3 + p.originalPos.x * 0.1) * 2;
		p.mesh.position.z = p.originalPos.z + Math.sin(time * 0.4) * 1;

		// Pulse scale
		const scale = 1 + Math.sin(time * 2 + p.originalPos.x) * 0.2;
		p.mesh.scale.setScalar(scale);
	});

	// Rotate lights
	pointLight1.position.x = Math.sin(time * 0.5) * 20;
	pointLight1.position.y = Math.cos(time * 0.5) * 20;
}

function cleanup() {
	unregisterAnimate(animateNames);
	particles.forEach((p) => scene.remove(p.mesh));
	lights.forEach((light) => scene.remove(light));
}

export function names(tl: gsap.core.Timeline) {
	// Register animation at start of names section
	tl.call(() => registerAnimate(animateNames), [], 4);

	// Change background color
	tl.to("main", { backgroundColor: "#0d1b2a", duration: 1 }, 3.5);

	// Fade in particles
	tl.to(".names-section", { opacity: 1, duration: 0.5 }, 4);
	particles.forEach((p, i) => {
		tl.to((p.mesh.material as THREE.MeshPhongMaterial), { opacity: 0.8, duration: 0.5 }, 4 + i * 0.02);
	});

	tl.to(".names", { opacity: 1, y: 0, duration: 2 }, 4);

	// Hide names section and particles
	tl.to(".names", { opacity: 0, y: -50, duration: 1.5 }, 8);

	particles.forEach((p) => {
		tl.to((p.mesh.material as THREE.MeshPhongMaterial), { opacity: 0, duration: 1 }, 8.5);
	});

	tl.to(".names-section", { opacity: 0, duration: 0.5 }, 9);
	tl.call(cleanup, [], 9.5);
}