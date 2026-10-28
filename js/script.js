const $ = (s, c = document) => c.querySelector(s),
	$$ = (s, c = document) => [...c.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
$("#yr").textContent = new Date().getFullYear();

// Name rises word by word on load
const h = $(".split");
h.setAttribute("aria-label", h.textContent);
h.innerHTML = h.textContent
	.split(" ")
	.map(
		(w, i) =>
			`<span class="w" aria-hidden="true"><i style="animation-delay:${i * 0.18}s">${w}</i></span> `,
	)
	.join("");

// Mobile menu
const menu = $(".menu"),
	nav = $(".nav nav");
menu.onclick = () => {
	const o = nav.classList.toggle("open");
	menu.setAttribute("aria-expanded", o);
};
$$(".nav nav a").forEach(
	(a) => (a.onclick = () => nav.classList.remove("open")),
);

// Rotating roles
const roles = [
	"content writer",
	"brand strategist",
	"editorial journalist",
	"storyteller",
	"geologist",
];
let ri = 0,
	ci = 0,
	del = false;
const el = $("#role");
(function type() {
	const w = roles[ri];
	ci += del ? -1 : 1;
	el.textContent = w.slice(0, ci);
	let t = del ? 40 : 85;
	if (!del && ci === w.length) {
		del = true;
		t = 1400;
	} else if (del && ci === 0) {
		del = false;
		ri = (ri + 1) % roles.length;
		t = 300;
	}
	setTimeout(type, calm ? 2000 : t);
})();

// Scroll reveal and counters
const count = (e) => {
	const n = +e.dataset.n,
		d = +e.dataset.d || 0,
		s = performance.now();
	(function f(t) {
		const p = Math.min((t - s) / 1400, 1);
		e.textContent = (n * (1 - Math.pow(1 - p, 3))).toFixed(d);
		if (p < 1) requestAnimationFrame(f);
	})(s);
};
const io = new IntersectionObserver(
	(es) =>
		es.forEach((x) => {
			if (x.isIntersecting) {
				x.target.classList.add("in");
				$$("[data-n]", x.target).forEach(count);
				io.unobserve(x.target);
			}
		}),
	{ threshold: 0.15 },
);
$$(".reveal").forEach((e) => io.observe(e));

if (!calm) {
	// Falling petals
	const box = $(".petals");
	for (let i = 0; i < 14; i++) {
		const p = document.createElement("i");
		p.className = "petal";
		p.style.cssText = `left:${Math.random() * 100}%;--dx:${Math.random() * 160 - 80}px;animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;transform:scale(${0.6 + Math.random()})`;
		box.appendChild(p);
	}
	// Soft glow follows cursor
	const g = $(".glow");
	addEventListener("pointermove", (e) => {
		g.style.left = e.clientX + "px";
		g.style.top = e.clientY + "px";
	});
	// Card tilt
	$$(".tilt").forEach((c) => {
		c.addEventListener("pointermove", (e) => {
			const r = c.getBoundingClientRect(),
				x = (e.clientX - r.left) / r.width - 0.5,
				y = (e.clientY - r.top) / r.height - 0.5;
			c.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
		});
		c.addEventListener("pointerleave", () => (c.style.transform = ""));
	});
}
