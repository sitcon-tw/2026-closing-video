import { gsap } from "gsap";
import { controlTimeline } from "./control";
import { intro } from "./scenes/intro";
import { names } from "./scenes/names";
import { outro } from "./scenes/outro";
import { setThreePaused, setThreeTime } from "./three-setup";

// Handle resize
if (!new URLSearchParams(location.search).get("export")) {
	const resize = () => {
		const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080, 2);
		const mainContainer = document.querySelector("main");
		mainContainer!.style.transform = `translate(-50%, -50%) scale(${scale})`;

		// Update Three.js
		// handleResize();
	};
	window.addEventListener("resize", resize);
	resize();
}

const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

// Sync Three.js time with GSAP timeline
timeline.eventCallback("onUpdate", () => {
	setThreeTime(timeline.time());
});

// Track pause state
const originalPause = timeline.pause.bind(timeline);
const originalPlay = timeline.play.bind(timeline);

timeline.pause = (...args: Parameters<typeof originalPause>) => {
	setThreePaused(true);
	return originalPause(...args);
};

timeline.play = (...args: Parameters<typeof originalPlay>) => {
	setThreePaused(false);
	return originalPlay(...args);
};

controlTimeline(timeline);

intro(timeline);
names(timeline);
outro(timeline);
