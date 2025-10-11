// Total goal
const goal = 10000;

// Initial raised value
let raised = 0;

// Animate counter + progress
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
      `₵${current.toLocaleString()} raised out of ₵${goal.toLocaleString()} goal (${percent.toFixed(1)}%)`;

    if (progress < 1) {
      requestAnimationFrame(animateCounter);
    }
}

  requestAnimationFrame(animateCounter);
}
// Run when page is fully loaded
window.onload = updateProgress(920);