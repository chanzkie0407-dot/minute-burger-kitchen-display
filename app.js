// === GLOBAL STATE ===
let currentShift = null;
let ticketCounter = 1;
let currentOrder = [];
let currentPrepTime = 10;
let preparingTickets = [];
let readyTickets = [];
let historyLog = [];
let draggedTicket = null;
let editingItemIndex = null;

// === SHIFT LOGIN ===
const SHIFTS = {
  "1111": { name: "Morning", start: "06:00", end: "14:00" },
  "2222": { name: "Swing", start: "14:00", end: "22:00" },
  "3333": { name: "Graveyard", start: "22:00", end: "06:00" }
};

function loginShift() {
  const pin = document.getElementById("shiftPin").value.trim();
  if (SHIFTS[pin]) {
    currentShift = SHIFTS[pin];
    document.getElementById("shiftLogin").classList.remove("active");
    document.getElementById("mainApp").classList.add("active");
    document.getElementById("currentShiftLabel").textContent = currentShift.name;
    loadProducts();
    loadSavedData();
  } else {
    document.getElementById("loginError").textContent = "Maling PIN — Subukan muli";
  }
}

// === TABS ===
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// === LOAD PRODUCTS ===
function loadProducts() {
  const categories = {
    Sulit: "catSulit", Chicken: "catChicken", Hotdog: "catHotdog",
    Drinks: "catDrinks", Extras: "catExtras", Bigtime: "catBigtime"
  };
  
  Object.entries(categories).forEach(([cat, id]) => {
    const container = document.getElementById(id);
    container.innerHTML = "";
    Object.entries(PRODUCTS).forEach(([code, prod]) => {
      if (prod.category === cat) {
        const btn = document.createElement("button");
        btn.textContent = prod.name;
        btn.onclick = () => addToOrder(code);
        container.appendChild(btn);
      }
    });
  });
}

// === ORDER FUNCTIONS ===
function addToOrder(code) {
  const prod = PRODUCTS[code];
  const existing = currentOrder.find(i => i.code === code);
  if (existing) {
    existing.qty++;
  } else {
    currentOrder.push({ code, qty: 1, instructions: [] });
  }
  // Auto-update prep time based on first item
  if (currentOrder.length === 1) {
    currentPrepTime = prod.defaultTime;
    document.getElementById("prepTimeDisplay").textContent = currentPrepTime;
  }
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("currentOrderList");
  list.innerHTML = "";
  currentOrder.forEach((item, idx) => {
    const prod = PRODUCTS[item.code];
    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
      <span><span class="qty">${item.qty}×</span>${prod.name}
        ${item.instructions.length ? `<span class="inst">⚠️ ${item.instructions.length}</span>` : ""}
      </span>
      <div>
        <button onclick="openInstructions(${idx})" title="Instructions">✏️</button>
        <button onclick="changeQty(${idx}, -1)">−</button>
        <button onclick="changeQty(${idx}, 1)">+</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function changeQty(idx, delta) {
  currentOrder[idx].qty += delta;
  if (currentOrder[idx].qty <= 0) currentOrder.splice(idx, 1);
  renderOrder();
}

function adjustTime(min) {
  currentPrepTime = Math.max(1, currentPrepTime + min);
  document.getElementById("prepTimeDisplay").textContent = currentPrepTime;
}

function clearOrder() {
  currentOrder = [];
  currentPrepTime = 10;
  document.getElementById("prepTimeDisplay").textContent = "10";
  renderOrder();
}

function submitOrder() {
  if (!currentOrder.length) return alert("Walang order!");
  
  const ticket = {
    id: String(ticketCounter).padStart(3, "0"),
    items: [...currentOrder],
    prepTime: currentPrepTime,
    submittedAt: new Date(),
    status: "preparing",
    readyAt: null,
    shift: currentShift.name
  };
  
  preparingTickets.push(ticket);
  historyLog.push({
    ...ticket,
    submittedAtStr: formatTime(new Date())
  });
  
  ticketCounter++;
  document.getElementById("ticketNumber").textContent = String(ticketCounter).padStart(3, "0");
  
  clearOrder();
  saveData();
  renderKitchen();
  renderHistory();
  
  // Switch to kitchen tab
  document.querySelector('[data-tab="kitchen"]').click();
}

// === INSTRUCTIONS MODAL ===
function openInstructions(idx) {
  editingItemIndex = idx;
  const item = currentOrder[idx];
  document.getElementById("modalItemName").textContent = PRODUCTS[item.code].name;
  renderInstructionOptions(item);
  document.getElementById("instructionModal").classList.add("active");
}

function renderInstructionOptions(item) {
  const container = document.getElementById("instructionOptions");
  container.innerHTML = "";
  
  // Sauce options
  INSTRUCTIONS.sauce.forEach(opt => {
    const isSel = item.instructions.some(i => i.id === opt.id);
    const div = document.createElement("div");
    div.className = "option-item";
    div.style.background = isSel ? "#e8f5e9" : "transparent";
    div.innerHTML = `<input type="checkbox" ${isSel ? "checked" : ""}> ${opt.label}`;
    div.onclick = () => toggleInstruction(item, opt);
    container.appendChild(div);
  });
  
  // Prep options
  INSTRUCTIONS.prep.forEach(opt => {
    const isSel = item.instructions.some(i => i.id === opt.id);
    const div = document.createElement("div");
    div.className = "option-item";
    div.style.background = isSel ? "#e8f5e9" : "transparent";
    div.innerHTML = `<input type="checkbox" ${isSel ? "checked" : ""}> ${opt.label}`;
    div.onclick = () => toggleInstruction(item, opt);
    container.appendChild(div);
  });
  
  // Remove options
  INSTRUCTIONS.remove.forEach(opt => {
    const isSel = item.instructions.some(i => i.id === opt.id);
    const div = document.createElement("div");
    div.className = "option-item";
    div.style.background = isSel ? "#e8f5e9" : "transparent";
    div.innerHTML = `<input type="checkbox" ${isSel ? "checked" : ""}> ${opt.label}`;
    div.onclick = () => toggleInstruction(item, opt);
    container.appendChild(div);
  });
}

function toggleInstruction(item, opt) {
  const idx = item.instructions.findIndex(i => i.id === opt.id);
  if (idx >= 0) item.instructions.splice(idx, 1);
  else item.instructions.push({ ...opt });
  renderInstructionOptions(item);
}

function saveInstructions() {
  editingItemIndex = null;
  closeModal();
  renderOrder();
}

function closeModal() {
  document.getElementById("instructionModal").classList.remove("active");
}

// === KITCHEN DISPLAY & DRAG-DROP ===
function renderKitchen() {
  const prepList = document.getElementById("preparingList");
  const readyList = document.getElementById("readyList");
  
  prepList.innerHTML = "";
  readyList.innerHTML = "";
  
  preparingTickets.forEach(ticket => {
    const card = createTicketCard(ticket, "preparing");
    prepList.appendChild(card);
  });
  
  readyTickets.forEach(ticket => {
    const card = createTicketCard(ticket, "ready");
    readyList.appendChild(card);
  });
  
  setupDragDrop();
}

function createTicketCard(ticket, status) {
  const elapsed = Math.floor((Date.now() - ticket.submittedAt.getTime()) / 1000);
  const limit = ticket.prepTime * 60;
  const remaining = limit - elapsed;
  
  let timerClass = "green";
  if (remaining <= 60 && remaining > 0) timerClass = "yellow";
  if (remaining <= 0) timerClass = "red";
  
  const mins = Math.max(0, Math.floor(remaining / 60));
  const secs = String(Math.max(0, remaining % 60)).padStart(2, "0");
  
  const div = document.createElement("div");
  div.className = "ticket-card";
  div.draggable = true;
  div.dataset.ticketId = ticket.id;
  
  div.innerHTML = `
    <div class="ticket-header">
      <span class="ticket-number">#${ticket.id}</span>
      <span class="timer ${timerClass}">${mins}:${secs}</span>
    </div>
    ${ticket.items.map(item => `
      <div class="ticket-item">
        ${item.qty}× ${PRODUCTS[item.code].name}
        ${item.instructions.length ? `<br><span class="inst">⚠️ ${item.instructions.map(i => i.label).join(", ")}</span>` : ""}
      </div>
    `).join("")}
  `;
  
  if (status === "ready") {
    div.onclick = () => removeTicket(ticket.id);
    div.style.cursor = "pointer";
  }
  
  return div;
}

function setupDragDrop() {
  document.querySelectorAll(".ticket-card").forEach(card => {
    card.addEventListener("dragstart", (e) => {
      draggedTicket = card.dataset.ticketId;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      draggedTicket = null;
      card.classList.remove("dragging");
    });
  });
  
  const prepCol = document.getElementById("preparingList").parentNode;
  const readyCol = document.getElementById("readyList").parentNode;
  
  [prepCol, readyCol].forEach(col => {
    col.addEventListener("dragover", (e) => e.preventDefault());
    col.addEventListener("drop", () => {
      if (!draggedTicket) return;
      
      if (col.classList.contains("ready")) {
        // Move to Ready
        const idx = preparingTickets.findIndex(t => t.id === draggedTicket);
        if (idx >= 0) {
          const ticket = preparingTickets.splice(idx, 1)[0];
          ticket.status = "ready";
          ticket.readyAt = new Date();
          readyTickets.push(ticket);
          
          // Update history
          const hist = historyLog.find(h => h.id === ticket.id);
          if (hist) hist.readyAtStr = formatTime(new Date());
          
          // Auto-remove after 2 min
          setTimeout(() => {
            const ridx = readyTickets.findIndex(t => t.id === draggedTicket);
            if (ridx >= 0) {
              readyTickets.splice(ridx, 1);
              renderKitchen();
            }
          }, 120000);
        }
      } else if (col.classList.contains("preparing")) {
        // Move back to Preparing
        const idx = readyTickets.findIndex(t => t.id === draggedTicket);
        if (idx >= 0) {
          const ticket = readyTickets.splice(idx, 1)[0];
          ticket.status = "preparing";
          preparingTickets.push(ticket);
        }
      }
      
      saveData();
      renderKitchen();
      renderHistory();
    });
  });
}

function removeTicket(ticketId) {
  if (!confirm("Tinanggal na ba ng customer?")) return;
  const idx = readyTickets.findIndex(t => t.id === ticketId);
  if (idx >= 0) readyTickets.splice(idx, 1);
  saveData();
  renderKitchen();
}

// === HISTORY ===
function renderHistory() {
  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = "";
  historyLog.slice().reverse().forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${h.id}</td>
      <td>${h.submittedAtStr}</td>
      <td>${h.readyAtStr || "—"}</td>
      <td>${h.status === "ready" ? "✅ Handa" : "⏳ Naghahanda"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// === UTILITIES ===
function formatTime(date) {
  return date.toLocaleTimeString("tl-PH", { hour: "2-digit", minute: "2-digit" });
}

// Update timers every second
setInterval(() => {
  if (!document.getElementById("mainApp").classList.contains("active")) return;
  if (preparingTickets.length) renderKitchen();
}, 1000);

// === SAVE / LOAD DATA ===
function saveData() {
  const data = {
    ticketCounter,
    preparingTickets,
    readyTickets,
    historyLog,
    lastDate: new Date().toDateString()
  };
  localStorage.setItem("mbKdsData", JSON.stringify(data));
}

function loadSavedData() {
  const saved = localStorage.getItem("mbKdsData");
  if (!saved) return;
  
  const data = JSON.parse(saved);
  
  // Reset if new day
  if (data.lastDate !== new Date().toDateString()) {
    ticketCounter = 1;
    preparingTickets = [];
    readyTickets = [];
    historyLog = [];
    localStorage.removeItem("mbKdsData");
    return;
  }
  
  ticketCounter = data.ticketCounter || 1;
  document.getElementById("ticketNumber").textContent = String(ticketCounter).padStart(3, "0");
  
  // Restore dates
  preparingTickets = (data.preparingTickets || []).map(t => ({
    ...t,
    submittedAt: new Date(t.submittedAt)
  }));
  readyTickets = (data.readyTickets || []).map(t => ({
    ...t,
    submittedAt: new Date(t.submittedAt),
    readyAt: t.readyAt ? new Date(t.readyAt) : null
  }));
  historyLog = data.historyLog || [];
  
  renderKitchen();
  renderHistory();
}
