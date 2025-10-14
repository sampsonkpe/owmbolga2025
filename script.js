// Team goal
const goal = 500000;

// Google Apps Script Web App URL
const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbz_0geVTBySLZqVsWYnjkCeBXNqn94SgGrvZDm98wMn0a2nbI7_RKH-NuGLXOWiIB5o/exec";

// Fetch total contributions from Google Sheets
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

// Animate progress bar
function updateProgress(newRaised) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

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

// ======== Toast ========
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

// ======== Copy-to-clipboard logic ========
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!"))
      .catch((err) => console.error("Copy failed", err));
  });
});

// ======== Modal logic ========
const modal = document.getElementById("pay-modal");
const openBtn = document.getElementById("partner-btn");
const closeBtns = [document.getElementById("done-btn"), document.getElementById("modal-backdrop")];

openBtn.onclick = () => (modal.style.display = "flex");
closeBtns.forEach(btn => btn.onclick = () => (modal.style.display = "none"));

// Optional: click outside modal-panel closes modal
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Run on page load
window.onload = fetchRaised;