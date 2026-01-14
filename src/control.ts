export function controlTimeline(timeline: gsap.core.Timeline) {
	const params = new URLSearchParams(window.location.search);
	const isExport = params.get("export") === "true";

	const controls = document.getElementById("controls")!;
	if (isExport) controls.style.display = "none";

	const playBtn = document.getElementById("play-pause")!;
	playBtn.textContent = "⏸";

	const scrubber = document.getElementById("scrub") as HTMLInputElement;
	scrubber?.addEventListener("input", () => {
		const t = parseFloat(scrubber.value);
		timeline.pause().seek(t);
		playBtn.textContent = "▶︎";
	});

	const syncScrubber = () => {
		if (!scrubber) return;
		if (!timeline.isActive()) return;

		scrubber.value = timeline.time().toFixed(2);
		requestAnimationFrame(syncScrubber);
	};

	timeline.eventCallback("onUpdate", syncScrubber);
	timeline.eventCallback("onStart", syncScrubber);

	// Pause at end and update button
	timeline.eventCallback("onComplete", () => {
		timeline.pause();
		playBtn.textContent = "🔄";
	});

	playBtn.addEventListener("click", () => {
		if (timeline.isActive()) {
			timeline.pause();
			playBtn.textContent = "▶︎";
		} else {
			// If at the end, restart from beginning
			if (timeline.progress() >= 1) {
				timeline.restart();
			} else {
				timeline.play();
			}
			playBtn.textContent = "⏸";
		}
	});
}
