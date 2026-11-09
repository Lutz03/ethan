// Paste your Google Apps Script Web App URL here (see README.md).
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz4MR1qJZrQzx9XJm2uoMw9VL2dAnKyzKf88rurZtiPk_kPFNdTHwqjXQm2sktpWS1Tww/exec";

// Party start, Philippine time (UTC+8). Adjust the time if needed.
const PARTY_DATE = new Date("2026-11-22T10:00:00+08:00");

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
    } catch {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("err");
    } finally {
      button.disabled = false;
    }
  });
}

wire("rsvp-form", "Thank you! Your RSVP has been received. 💙");
