// Team goal
const goal = 500000;

// Google Apps Script Web App URL
const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbz_0geVTBySLZqVsWYnjkCeBXNqn94SgGrvZDm98wMn0a2nbI7_RKH-NuGLXOWiIB5o/exec";

// Elements
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const toast = document.getElementById("toast");
const cards = document.querySelectorAll(".card");
const introCard = document.querySelector(".intro-card");
const paymentCard = document.querySelector(".payment-card");
const partnerBtn = document.getElementById("partnerBtn");
const backBtn = document.getElementById("backBtn");

let currentRaised = 615;

// ======== Fetch total contributions from Google Sheets ========
async function fetchRaised() {
  try {
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) throw new Error("Sheet API returned " + response.status);
    const data = await response.json();
    updateProgress(Number(data.total || currentRaised));
  } catch (err) {
    console.warn("Could not fetch sheet total:", err);
    updateProgress(currentRaised);
  }
}

// ======== Animate progress bar ========
function updateProgress(newRaised) {
  const start = currentRaised;
  const end = newRaised;
  currentRaised = newRaised;
  const duration = Math.max(1000, Math.min(4000, Math.abs(end - start) * 2));
  let startTime = null;

  function animateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = Math.floor(start + (end - start) * progress);
    const percent = Math.min((current / goal) * 100, 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = `GH₵${current.toLocaleString()} raised out of GH₵${goal.toLocaleString()} goal (${percent.toFixed(1)}%)`;

    if (progress < 1) requestAnimationFrame(animateCounter);
  }

  requestAnimationFrame(animateCounter);
}

// ======== Toast function ========
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

// ======== Copy buttons ========
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!"))
      .catch(err => console.error("Copy failed", err));
  });
});

// ======== USSD buttons ========
document.querySelectorAll(".ussd-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const ussdCode = btn.dataset.ussd;
    window.location.href = `tel:${ussdCode}`;
  });
});

// ======== Toggle between intro and payment cards ========
function fadeOut(element, callback) {
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  element.style.opacity = 0;
  element.style.transform = "translateY(-20px)";
  element.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    element.style.display = "none";
    element.style.opacity = 1;
    element.style.transform = "translateY(0)";
    if (callback) callback();
  }, 400);
}

function fadeIn(element) {
  element.style.display = "flex";
  element.style.opacity = 0;
  element.style.transform = "translateY(20px)";
  element.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    element.style.opacity = 1;
    element.style.transform = "translateY(0)";
  });
}

partnerBtn.addEventListener("click", () => {
  fadeOut(introCard, () => fadeIn(paymentCard));
});

backBtn.addEventListener("click", () => {
  fadeOut(paymentCard, () => fadeIn(introCard));
});

// ======== Initialize ========
window.onload = () => {
  updateProgress(currentRaised);
  fetchRaised();
};