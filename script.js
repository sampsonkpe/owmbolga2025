// Team goal
const goal = 500000;

// Google Apps Script Web App URL
const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbz_0geVTBySLZqVsWYnjkCeBXNqn94SgGrvZDm98wMn0a2nbI7_RKH-NuGLXOWiIB5o/exec";

// Elements
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const toast = document.getElementById("toast");
const introCard = document.querySelector(".intro-card");
const paymentCard = document.querySelector(".payment-card");
const partnerBtn = document.getElementById("partnerBtn");
const backBtn = document.getElementById("backBtn");

// ======== Fetch total contributions from Google Sheets ========
async function fetchRaised() {
  try {
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) throw new Error("Sheet API returned " + response.status);
    const data = await response.json();
    updateProgress(Number(data.total || 0));
  } catch (err) {
    console.warn("Could not fetch sheet total:", err);
    updateProgress(0);
  }
}

// ======== Animate progress bar ========
function updateProgress(newRaised) {
  let start = 0;
  let end = newRaised;
  let duration = 1000;
  let startTime = null;

  function animateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = Math.min((timestamp - startTime) / duration, 1);
    let current = Math.floor(start + (end - start) * progress);
    let percent = Math.min((current / goal) * 100, 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = `₵${current.toLocaleString()} raised out of GH₵${goal.toLocaleString()} goal (${percent.toFixed(1)}%)`;

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
  element.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  element.style.opacity = 0;
  element.style.transform = "translateY(-20px)";
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
  requestAnimationFrame(() => {
    element.style.transition = "opacity 0.4s ease, transform 0.4s ease";
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
window.onload = fetchRaised;