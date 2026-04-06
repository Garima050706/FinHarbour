// Load goals from localStorage
let goals = JSON.parse(localStorage.getItem("goals")) || [];

/* =========================
   THEME TOGGLE
========================= */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* =========================
   CHARACTER COUNTER (ASSIGNMENT)
========================= */
document.addEventListener("DOMContentLoaded", function () {
  const goalInput = document.getElementById("goalName");
  const charCount = document.getElementById("charCount");

  if (goalInput && charCount) {
    goalInput.addEventListener("input", function () {
      let length = goalInput.value.length;
      charCount.textContent = length + " / 30";

      // Color change near limit
      charCount.style.color = length > 25 ? "red" : "gray";
    });
  }
});

/* =========================
   ADD GOAL
========================= */
function addGoal() {
  const name = document.getElementById("goalName").value.trim();
  const target = +document.getElementById("targetAmount").value;
  const saved = +document.getElementById("initialSavings").value || 0;
  const deadline = document.getElementById("deadline").value;

  if (!name || !target || !deadline) {
    alert("Please fill all required fields");
    return;
  }

  const goal = {
    name,
    target,
    saved,
    deadline,
    history: []
  };

  goals.push(goal);
  saveGoals();
  clearInputs();
}

/* =========================
   SAVE + UPDATE UI
========================= */
function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
  updateUI();
}

/* =========================
   CLEAR INPUTS (FIXED)
========================= */
function clearInputs() {
  document.getElementById("goalName").value = "";
  document.getElementById("targetAmount").value = "";
  document.getElementById("initialSavings").value = "";
  document.getElementById("deadline").value = "";

  // Reset counter
  const charCount = document.getElementById("charCount");
  if (charCount) {
    charCount.textContent = "0 / 30";
    charCount.style.color = "gray";
  }
}

/* =========================
   UPDATE UI
========================= */
function updateUI() {
  const container = document.getElementById("goalsContainer");
  container.innerHTML = "";

  goals.forEach((g, index) => {
    const percent = Math.min((g.saved / g.target) * 100, 100);

    const div = document.createElement("div");
    div.className = "goal-item";

    div.innerHTML = `
      <strong>${g.name}</strong><br>
      ₹${g.saved} / ₹${g.target}

      <div class="progress">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>

      <small>Deadline: ${g.deadline}</small><br>

      <input type="number" placeholder="Add savings" id="add-${index}">
      <button onclick="addSavings(${index})">Add</button>
      <button onclick="deleteGoal(${index})">Delete</button>
    `;

    container.appendChild(div);
  });

  updateCharts();
}

/* =========================
   ADD SAVINGS
========================= */
function addSavings(index) {
  const input = document.getElementById(`add-${index}`);
  const amount = +input.value;

  if (!amount) return;

  goals[index].saved += amount;
  goals[index].history.push(amount);

  saveGoals();
}

/* =========================
   DELETE GOAL
========================= */
function deleteGoal(index) {
  goals.splice(index, 1);
  saveGoals();
}

/* =========================
   CHARTS
========================= */
let barChart, lineChart;

function updateCharts() {
  const names = goals.map(g => g.name);
  const savedData = goals.map(g => g.saved);

  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: names,
      datasets: [{
        label: "Savings",
        data: savedData
      }]
    }
  });

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: names,
      datasets: [{
        label: "Progress",
        data: savedData
      }]
    }
  });
}

/* =========================
   INITIAL LOAD
========================= */
updateUI();