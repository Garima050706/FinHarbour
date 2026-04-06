// INPUTS
const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const titleCount = document.getElementById("titleCount");

// LOAD FROM STORAGE
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// FIXED INCOME
const totalIncome = 50000;

// CHARTS
let barChart, pieChart;

// 🌙 DARK MODE TOGGLE (FIXED)
function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark");

  // Save properly
  if (body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// LOAD SAVED THEME (RUN AFTER PAGE LOAD)
window.onload = function () {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark"); // 👈 IMPORTANT
  }
};

// CHARACTER COUNTER
titleInput.addEventListener("input", () => {
  const length = titleInput.value.length;
  titleCount.textContent = `${length}/30`;
  titleCount.style.color = length >= 25 ? "#ef4444" : "#64748b";
});

// ADD EXPENSE
function addExpense() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!title || !amount) {
    alert("Fill all fields");
    return;
  }

  expenses.push({ title, amount, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  titleInput.value = "";
  amountInput.value = "";
  titleCount.textContent = "0/30";

  render();
}

// RENDER
function render() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  let total = 0;
  let categoryTotals = {};

  expenses.forEach(e => {
    total += e.amount;

    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${e.title} (${e.category})</span>
      <span>₹${e.amount}</span>
    `;
    list.appendChild(li);
  });

  document.getElementById("totalExpense").innerText = `₹${total}`;
  document.getElementById("balance").innerText = `₹${totalIncome - total}`;

  drawCharts(categoryTotals);
}

// CHARTS
function drawCharts(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: "#2563eb"
      }]
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#2563eb",
          "#7c3aed",
          "#22c55e",
          "#f59e0b",
          "#ef4444"
        ]
      }]
    }
  });
}

// INITIAL LOAD
render();

// 🌍 CURRENCY CONVERTER
async function convertCurrency() {
  const amount = document.getElementById("convertAmount").value;
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const resultText = document.getElementById("conversionResult");

  if (!amount) {
    alert("Enter amount");
    return;
  }

  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${from}`
    );

    const data = await response.json();

    if (data.result === "success") {
      const rate = data.rates[to];
      const converted = amount * rate;

      resultText.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    } else {
      resultText.innerText = "Conversion failed";
    }

  } catch (error) {
    resultText.innerText = "Error fetching rates";
    console.error(error);
  }
}
