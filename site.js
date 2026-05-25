const d = document.getElementById("display");
let justCalculated = false;

// לחיצות כפתורים
document.querySelector(".keys").addEventListener("click", e => {
  const b = e.target;
  if (!b.dataset) return;

  if (b.dataset.v) add(b.dataset.v);

  if (b.dataset.f === "sqrt") add("√(");
  if (b.dataset.f === "cbrt") add("∛(");
  if (b.dataset.f === "root") add("√");

  switch (b.dataset.a) {
    case "clear": clearDisplay(); break;
    case "del": deleteLastChar(); break;
    case "pow": add("**"); break;
    case "frac": handleFraction(); break;
    case "eq": calc(); break;
  }
});

// הוספת ערך
function add(v) {
  if (justCalculated) {
    d.value = "";
    justCalculated = false;
  }
  d.value += v;
}

// ניקוי
function clearDisplay() {
  d.value = "";
  justCalculated = false;
}

// מחיקה
function deleteLastChar() {
  d.value = d.value.slice(0, -1);
}

// שבר
function handleFraction() {
  if (d.value !== "") add("/");
}

// חישוב
function calc() {
  try {
    let x = d.value;

    // המרת סימנים
    x = x
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/π/g, "Math.PI");

    x = balanceParentheses(x);
    x = replaceFactorials(x);
    x = replaceRoots(x);

    const result = Function("return " + x)();

    d.value = toFraction(result);
    justCalculated = true;

  } catch (e) {
    d.value = "ERROR";
  }
}

// איזון סוגריים
function balanceParentheses(x) {
  const open = (x.match(/\(/g) || []).length;
  const close = (x.match(/\)/g) || []).length;
  return x + ")".repeat(open - close);
}

// עצרת
function replaceFactorials(x) {
  return x.replace(/(\d+|\([^()]+\))!/g, "factorial($1)");
}

// שורשים
function replaceRoots(x) {
  // √(x)
  x = x.replace(/√\(/g, "Math.sqrt(");

  // ∛(x)
  x = x.replace(/∛\(/g, "Math.cbrt(");

  // n√x
  x = x.replace(/(\d+|\([^()]+\))√(\d+|\([^()]+\))/g, "Math.pow($2,1/$1)");

  return x;
}

// המרה לשבר
function toFraction(x) {
  if (Number.isInteger(x)) return x.toString();

  const s = x.toString();
  if (!s.includes(".")) return s;

  const dec = s.split(".")[1].length;
  const den = 10 ** dec;
  const num = Math.round(x * den);

  const g = gcd(Math.abs(num), den);
  return (num / g) + "/" + (den / g);
}

// עצרת
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw "err";
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// GCD
function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

// מקלדת
document.addEventListener("keydown", e => {
  const k = e.key;

  if (/[0-9.]/.test(k)) add(k);
  else if ("+-*/()!".includes(k)) add(k);
  else if (k === "Enter") calc();
  else if (k === "Backspace") deleteLastChar();
  else if (k === "Delete") clearDisplay();
});