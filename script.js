// Team goal
const goal = 500000;

// Deployed Google Apps Script Web App URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz_0geVTBySLZqVsWYnjkCeBXNqn94SgGrvZDm98wMn0a2nbI7_RKH-NuGLXOWiIB5o/exec";

// Fetch total contributions from Google Sheets
async function fetchRaised() {
  try {
    const response = await fetch(SHEET_API_URL);
    const data = await response.json();
    updateProgress(data.total);
  } catch (err) {
    console.error("Error fetching contributions:", err);
  }
}

// Animate progress bar
function updateProgress(newRaised) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  let start = 0;
  let end = newRaised;
  let duration = 2000;
  let startTime = null;

  function animateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = Math.min((timestamp - startTime) / duration, 1);
    let current = Math.floor(start + (end - start) * progress);
    let percent = Math.min((current / goal) * 100, 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = 
      `₵${current.toLocaleString()} raised out of GH₵${goal.toLocaleString()} goal (${percent.toFixed(1)}%)`;

    if (progress < 1) requestAnimationFrame(animateCounter);
  }

  requestAnimationFrame(animateCounter);
}

// Run on page load
window.onload = fetchRaised;
