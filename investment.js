let investments = JSON.parse(localStorage.getItem("investments")) || [];

let pieChart, lineChart;

// INPUT + COUNTER
const nameInput = document.getElementById("name");
const nameCount = document.getElementById("nameCount");

// 🔥 CHARACTER COUNTER
nameInput.addEventListener("input", () => {
  const len = nameInput.value.length;
  nameCount.textContent = `${len}/30`;

  if (len >= 25) {
    nameCount.style.color = "#ef4444";
  } else {
    nameCount.style.color = "#64748b";
  }
});

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// ADD INVESTMENT
function addInvestment() {
  const fileInput = document.getElementById("pdfUpload");
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function () {

    const inv = {
      name: nameInput.value.trim(),
      amount: +document.getElementById("amount").value,
      rate: +document.getElementById("rate").value,
      years: +document.getElementById("years").value,
      category: document.getElementById("category").value,
      risk: document.getElementById("risk").value,
      pdf: file ? reader.result : null
    };

    if (!inv.name || !inv.amount || !inv.rate || !inv.years) {
      alert("Fill all fields");
      return;
    }

    inv.future = inv.amount * Math.pow(1 + inv.rate / 100, inv.years);
    inv.profit = inv.future - inv.amount;

    investments.push(inv);
    save();

    // RESET
    nameInput.value = "";
    nameCount.textContent = "0/30";
    document.getElementById("amount").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("years").value = "";
    fileInput.value = "";
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}

// SAVE
function save() {
  localStorage.setItem("investments", JSON.stringify(investments));
  updateUI();
}

// UI
function updateUI() {
  const container = document.getElementById("investmentList");
  container.innerHTML = "";

  let totalInvested = 0;
  let totalValue = 0;

  investments.forEach((inv, index) => {
    totalInvested += inv.amount;
    totalValue += inv.future;

    const div = document.createElement("div");
    div.className = "investment-item";

    div.innerHTML = `
      <strong>${inv.name}</strong> (${inv.category})<br>
      ₹${inv.amount} → ₹${inv.future.toFixed(0)}<br>
      Risk: ${inv.risk}
      <br>
      <span class="${inv.profit >= 0 ? "profit" : "loss"}">
        ${inv.profit >= 0 ? "+" : ""}₹${inv.profit.toFixed(0)}
      </span>
      <br>
      ${inv.pdf ? `<button onclick="openPDF('${inv.pdf}')">PDF</button>` : ""}
      <button onclick="deleteInvestment(${index})">Delete</button>
    `;

    container.appendChild(div);
  });

  document.getElementById("totalInvested").innerText = "₹" + totalInvested;
  document.getElementById("totalValue").innerText = "₹" + totalValue.toFixed(0);
  document.getElementById("returns").innerText =
    "₹" + (totalValue - totalInvested).toFixed(0);

  updateCharts();
}

// DELETE
function deleteInvestment(index) {
  investments.splice(index, 1);
  save();
}

// PDF
function openPDF(base64) {
  const win = window.open();
  win.document.write(`<iframe src="${base64}" style="width:100%; height:100%"></iframe>`);
}

// CHARTS
function updateCharts() {
  const labels = investments.map(i => i.name);
  const amounts = investments.map(i => i.amount);
  const futureValues = investments.map(i => i.future);

  if (pieChart) pieChart.destroy();
  if (lineChart) lineChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: { labels, datasets: [{ data: amounts }] }
  });

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Growth", data: futureValues, tension: 0.4 }]
    }
  });
}

// INIT
updateUI();