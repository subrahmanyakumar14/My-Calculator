// ---- State ----
let current = "0";      // number being typed
let previous = "";      // first operand
let operator = null;    // + - * /
let justEvaluated = false;

const currEl = document.getElementById("curr");
const prevEl = document.getElementById("prev");
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// ---- Core functions ----
function appendNumber(n) {
  if (justEvaluated) { current = "0"; justEvaluated = false; }
  if (n === "." && current.includes(".")) return;   // only one decimal
  current = (current === "0" && n !== ".") ? n : current + n;
}

function chooseOperator(op) {
  if (operator && !justEvaluated) compute();        // chain: 2 + 3 + ...
  previous = current;
  operator = op;
  current = "0";
  justEvaluated = false;
}

function compute() {
  if (!operator) return;
  const a = parseFloat(previous), b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? "Error" : a / b; break;
  }
  // fix floating point issues like 0.1 + 0.2
  current = result === "Error" ? "Error" : String(parseFloat(result.toFixed(10)));
  previous = "";
  operator = null;
  justEvaluated = true;
}

function clearAll() { current = "0"; previous = ""; operator = null; justEvaluated = false; }

function deleteLast() {
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() { current = String(parseFloat(current) / 100); }

function updateDisplay() {
  currEl.textContent = current;
  prevEl.textContent = operator ? `${previous} ${symbols[operator]}` : "";
}

// ---- Button clicks (event delegation) ----
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (current === "Error") clearAll();

  if (btn.dataset.num !== undefined) appendNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") compute();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();

  updateDisplay();
});

// ---- Keyboard support ----
document.addEventListener("keydown", (e) => {
  if (current === "Error") clearAll();
  if (/^[0-9.]$/.test(e.key)) appendNumber(e.key);
  else if ("+-*/".includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); compute(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
  else return;
  updateDisplay();
});
