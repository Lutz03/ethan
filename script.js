// Paste your Google Apps Script Web App URL here (see README.md).
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz4MR1qJZrQzx9XJm2uoMw9VL2dAnKyzKf88rurZtiPk_kPFNdTHwqjXQm2sktpWS1Tww/exec";

// Party start, Philippine time (UTC+8). Adjust the time if needed.
const PARTY_DATE = new Date("2026-11-22T10:00:00+08:00");

document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Countdown
const pad = (n) => String(n).padStart(2, "0");
function tick() {
  const diff = Math.max(0, PARTY_DATE - Date.now());
  const s = Math.floor(diff / 1000);
  document.getElementById("cd-days").textContent = Math.floor(s / 86400);
  document.getElementById("cd-hours").textContent = pad(Math.floor(s / 3600) % 24);
  document.getElementById("cd-mins").textContent = pad(Math.floor(s / 60) % 60);
  document.getElementById("cd-secs").textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

// Forms -> Google Sheets
function wire(formId, successMsg) {
  const form = document.getElementById(formId);
  const status = form.querySelector(".status");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "status";

    if (!form.checkValidity()) {
      status.textContent = "Please fill in the required fields.";
      status.classList.add("err");
      return;
    }

    button.disabled = true;
    status.textContent = "Sending…";

    try {
      // no-cors: Apps Script doesn't send CORS headers; the request still lands in the sheet.
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(new FormData(form)),
      });
      form.reset();
      status.textContent = successMsg;
      status.classList.add("ok");
      confetti(button);
    } catch {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("err");
    } finally {
      button.disabled = false;
    }
  });
}

wire("rsvp-form", "Thank you! Your RSVP has been received. ❤️");

// Game plan: slide steps in on scroll
const steps = document.querySelectorAll(".program li");
if ("IntersectionObserver" in window && !reduceMotion) {
  steps.forEach((li) => li.classList.add("hide"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = [...steps].indexOf(entry.target);
      entry.target.style.transitionDelay = `${(i % 7) * 90}ms`;
      entry.target.classList.remove("hide");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  steps.forEach((li) => io.observe(li));
}

// Confetti from Jollibee
const BITS = ["🏀", "🎉", "🎈", "⭐", "🍗", "🏀"];
function confetti(el) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  for (let i = 0; i < 26; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    bit.textContent = BITS[i % BITS.length];
    bit.style.left = `${x}px`;
    bit.style.top = `${y}px`;
    document.body.appendChild(bit);
    const dx = (Math.random() - 0.5) * 420;
    const up = 120 + Math.random() * 220;
    const spin = (Math.random() - 0.5) * 720;
    bit.animate([
      { transform: "translate(-50%, -50%) scale(.4)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% - ${up}px)) rotate(${spin / 2}deg) scale(1)`, opacity: 1, offset: 0.4 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${up}px)) rotate(${spin}deg) scale(.9)`, opacity: 0 },
    ], { duration: 1400 + Math.random() * 600, easing: "cubic-bezier(.2,.6,.4,1)" }).onfinish = () => bit.remove();
  }
}

const jolli = document.querySelector(".fun-gif-btn");
if (jolli) {
  jolli.addEventListener("click", () => {
    jolli.classList.remove("jump");
    void jolli.offsetWidth; // restart the animation on repeated taps
    jolli.classList.add("jump");
    confetti(jolli);
  });
  jolli.addEventListener("animationend", () => jolli.classList.remove("jump"));
}
