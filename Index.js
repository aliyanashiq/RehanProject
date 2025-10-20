// ✅ ROUTES
const routes = {
  "#/": "home.html",
  "#/finance": "finance.html",
  "#/fitness": "fitness.html",
  "#/math": "math.html",
  "#/other": "other.html",
  "#/BIMCAL": "BIMCAL.html",
  "#/FuelConsumption": "FuelConsumption.html",
  "#/Days-Calculator": "DayCal.html",
  "#/Interest-Caculator": "Interest.html",
  "#/Calorie-Calculator":"CaloriesCal.html",
  404: "404.html",
};

// ✅ ROUTER HANDLER
const Routermain = (event) => {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  window.location.hash = href;
};

// ✅ LOAD PAGE CONTENT
const handellocation = async (event) => {
  if (event) event.preventDefault();
  const path = window.location.hash || "#/";
  const route = routes[path] || routes[404];

  try {
    const html = await fetch(route).then((res) => res.text());
    document.getElementById("Content").innerHTML = html;

    // ✅ Reinitialize page-specific JS
    initPageScripts(path);
  } catch (err) {
    document.getElementById("Content").innerHTML =
      "<h2>Error loading page.</h2>";
    console.error("Error loading route:", err);
  }
};

window.addEventListener("hashchange", handellocation);
handellocation();
window.route = Routermain;

// ✅ MOBILE MENU
const menu = document.getElementById("mobile-menu");
const openBtn = document.getElementById("OpenMenu");
const closeBtn = document.getElementById("closeMenu");

const openMenu = () => menu?.classList.remove("hidden");
const closeMenu = () => menu?.classList.add("hidden");

if (openBtn && closeBtn) {
  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
}

window.selectMenu = function (event) {
  event.preventDefault();
  closeMenu();
  Routermain(event);
};

// ✅ PAGE-SPECIFIC SCRIPT INITIALIZER
function initPageScripts(path) {
  switch (path) {
    case "#/BIMCAL":
      initBMICalculator();
      break;

    case "#/FuelConsumption":
      initFuelCalculator();
      break;

    case "#/Days-Calculator":
      // Initialize both calculators on the same page
      initDayCalculator();
      initAddSubtractCalculator();
      break;

    case "#/Interest-Caculator":
      initcalculateInvestment();
      break;

    case "#/Calorie-Calculator":
      initcalculateCalories();
      break;
    
    case "#/":
      initMathCalculator();
      break;
      
    default:
      break;
  }
}

// =================================================
//Calculatur
// ==================================================


/* -------------------------------------------------
   ✅ MATH CALCULATOR
--------------------------------------------------*/
function initMathCalculator() {
  const calcDisplay = document.getElementById("calculation");
  const resultDisplay = document.getElementById("result");
  const buttons = document.querySelectorAll(".btn");

  if (!calcDisplay || !resultDisplay || buttons.length === 0) return;

  let calculation = "";
  let memory = 0;
  let lastAnswer = 0;

  const degMode = document.getElementById("deg");
  const radMode = document.getElementById("rad");

  const toRadians = (angle) => (angle * Math.PI) / 180;
  const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

  const updateDisplay = () => {
    calcDisplay.value = calculation;
  };

  const evaluateExpression = (expr) => {
    try {
      expr = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**");

      expr = expr
        .replace(/sin-1\(/g, "Math.asin(")
        .replace(/cos-1\(/g, "Math.acos(")
        .replace(/tan-1\(/g, "Math.atan(")
        .replace(/sin\(/g, degMode?.checked ? "Math.sin(toRadians(" : "Math.sin(")
        .replace(/cos\(/g, degMode?.checked ? "Math.cos(toRadians(" : "Math.cos(")
        .replace(/tan\(/g, degMode?.checked ? "Math.tan(toRadians(" : "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/EXP/g, "Math.exp");

      expr = expr.replace(/(\d+)!/g, (_, n) => `factorial(${n})`);

      const result = Function("factorial", "toRadians", `return ${expr}`)(
        factorial,
        toRadians
      );
      return result;
    } catch {
      return "Error";
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const op = btn.dataset.op;
      const func = btn.dataset.func;

      if (op) {
        calculation += op;
        updateDisplay();
      } else if (func) {
        switch (func) {
          case "ac":
            calculation = "";
            resultDisplay.value = "";
            updateDisplay();
            break;
          case "back":
            calculation = calculation.slice(0, -1);
            updateDisplay();
            break;
          case "=":
            if (!calculation.trim()) return;
            const result = evaluateExpression(calculation);
            resultDisplay.value = result;
            lastAnswer = result;
            break;
          case "±":
            calculation = calculation.startsWith("-")
              ? calculation.slice(1)
              : "-" + calculation;
            updateDisplay();
            break;
          case "rnd":
            calculation += Math.random().toFixed(4);
            updateDisplay();
            break;
          case "ans":
            calculation += lastAnswer;
            updateDisplay();
            break;
          case "m+":
            memory += Number(resultDisplay.value) || 0;
            break;
          case "m-":
            memory -= Number(resultDisplay.value) || 0;
            break;
          case "mr":
            calculation += memory;
            updateDisplay();
            break;
          case "pi":
            calculation += "π";
            updateDisplay();
            break;
          case "e":
            calculation += "e";
            updateDisplay();
            break;
          case "n!":
            calculation += "!";
            updateDisplay();
            break;
          case "x^2":
            calculation += "^2";
            updateDisplay();
            break;
          case "x^3":
            calculation += "^3";
            updateDisplay();
            break;
          case "x^y":
            calculation += "^";
            updateDisplay();
            break;
          case "10^x":
            calculation += "10^";
            updateDisplay();
            break;
          case "e^x":
            calculation += "e^";
            updateDisplay();
            break;
          case "√x":
            calculation += "√(";
            updateDisplay();
            break;
          case "3√x":
            calculation += "Math.cbrt(";
            updateDisplay();
            break;
          case "y√x":
            calculation += "√(";
            updateDisplay();
            break;
          case "ln":
            calculation += "ln(";
            updateDisplay();
            break;
          case "log":
            calculation += "log(";
            updateDisplay();
            break;
          case "sin":
          case "cos":
          case "tan":
          case "sin-1":
          case "cos-1":
          case "tan-1":
            calculation += func + "(";
            updateDisplay();
            break;
          default:
            break;
        }
      }
    });
  });
}


/* -------------------------------------------------
   ✅ BMI CALCULATOR
--------------------------------------------------*/
function initBMICalculator() {
  const metBtn = document.getElementById("metBtn");
  const usBtn = document.getElementById("usBtn");
  const metricInputs = document.getElementById("metricInputs");
  const usInputs = document.getElementById("usInputs");
  const calcBtn = document.getElementById("calcBtn");
  const clearBtn = document.getElementById("clearBtn");
  const bmiValue = document.querySelector(".bmi-value");
  const statusDiv = document.querySelector(".status");
  const extraResults = document.querySelector(".extra-results"); // <--- Add this div in HTML

  if (!(usBtn && metBtn && calcBtn && clearBtn && bmiValue && statusDiv))
    return;

  usBtn.addEventListener("click", () => {
    usBtn.classList.add("active");
    metBtn.classList.remove("active");
    usInputs.style.display = "block";
    metricInputs.style.display = "none";
    clearResults();
  });

  metBtn.addEventListener("click", () => {
    metBtn.classList.add("active");
    usBtn.classList.remove("active");
    metricInputs.style.display = "block";
    usInputs.style.display = "none";
    clearResults();
  });

  calcBtn.addEventListener("click", calculateBMI);
  clearBtn.addEventListener("click", clearResults);

  function calculateBMI() {
    let height, weight;

    if (metBtn.classList.contains("active")) {
      height = parseFloat(document.getElementById("height").value) / 100; // m
      weight = parseFloat(document.getElementById("weight").value); // kg
    } else {
      const feet = parseFloat(document.getElementById("heightFeet").value);
      const inches = parseFloat(document.getElementById("heightInches").value);
      height = (feet * 12 + inches) * 0.0254; // convert to meters
      weight = parseFloat(document.getElementById("weightLbs").value) * 0.453592; // kg
    }

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert("Please enter valid height and weight!");
      return;
    }

    const bmi = weight / (height * height);
    bmiValue.textContent = `BMI = ${bmi.toFixed(1)}`;
    statusDiv.textContent = getStatus(bmi);

    showAdditionalResults(bmi, height, weight); // 👈 new line
  }

  function getStatus(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    if (bmi < 34.9) return "Obesity Class I";
    if (bmi < 39.9) return "Obesity Class II";
    return "Obesity Class III";
  }

  function showAdditionalResults(bmi, height, weight) {
    const healthyBMILow = 18.5;
    const healthyBMIHigh = 25;

    const lowWeight = healthyBMILow * height * height; // kg
    const highWeight = healthyBMIHigh * height * height; // kg

    // convert healthy weight range to lbs
    const lowWeightLbs = lowWeight / 0.453592;
    const highWeightLbs = highWeight / 0.453592;

    // Weight to lose to reach BMI 25
    const targetWeight = healthyBMIHigh * height * height;
    const weightToLoseKg = weight - targetWeight;
    const weightToLoseLbs = weightToLoseKg / 0.453592;

    // BMI Prime
    const bmiPrime = bmi / healthyBMIHigh;

    // Ponderal Index
    const ponderalIndex = weight / Math.pow(height, 3);

    extraResults.innerHTML = `
      <p>Healthy BMI range: ${healthyBMILow} kg/m² - ${healthyBMIHigh} kg/m²</p>
      <p>Healthy weight for the height: ${lowWeightLbs.toFixed(1)} lbs - ${highWeightLbs.toFixed(1)} lbs</p>
      ${
        weightToLoseLbs > 0
          ? `<p>Lose ${weightToLoseLbs.toFixed(
              1
            )} lbs to reach a BMI of 25 kg/m².</p>`
          : `<p>You are within or below the healthy BMI range.</p>`
      }
      <p>BMI Prime: ${bmiPrime.toFixed(2)}</p>
      <p>Ponderal Index: ${ponderalIndex.toFixed(1)} kg/m³</p>
    `;
  }

  function clearResults() {
    bmiValue.textContent = "BMI = 0.0";
    statusDiv.textContent = "(Result)";
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
    if (extraResults) extraResults.innerHTML = ""; // clear new results too
  }
}


/* -------------------------------------------------
   ✅ FUEL CONSUMPTION CALCULATOR
--------------------------------------------------*/
function initFuelCalculator() {
  const calcBtn = document.getElementById("calculateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const distanceUnit = document.getElementById("distanceUnit");
  const efficiencyUnit = document.getElementById("efficiencyUnit");
  const priceUnit = document.getElementById("priceUnit");

  if (!(calcBtn && clearBtn && distanceUnit && efficiencyUnit && priceUnit))
    return;

  calcBtn.addEventListener("click", calculate);
  clearBtn.addEventListener("click", clearFields);
  distanceUnit.addEventListener("change", updatePlaceholders);
  efficiencyUnit.addEventListener("change", updatePlaceholders);
  priceUnit.addEventListener("change", updatePlaceholders);

  updatePlaceholders();

  function updatePlaceholders() {
    const dUnit = distanceUnit.value;
    const eUnit = efficiencyUnit.value;
    const pUnit = priceUnit.value;

    const distanceEl = document.getElementById("distance");
    const efficiencyEl = document.getElementById("efficiency");
    const priceEl = document.getElementById("fuelPrice");

    if (distanceEl)
      distanceEl.placeholder =
        dUnit === "km" ? "Enter distance (km)" : "Enter distance (miles)";

    const effText = {
      mpg: "Enter efficiency (mpg)",
      L100km: "Enter efficiency (L/100km)",
      kml: "Enter efficiency (km/L)",
      Lpermile: "Enter efficiency (L/mile)",
    };

    if (efficiencyEl) efficiencyEl.placeholder = effText[eUnit];
    if (priceEl)
      priceEl.placeholder =
        pUnit === "liter" ? "Enter price per liter" : "Enter price per gallon";
  }

  function calculate() {
    const distance = parseFloat(document.getElementById("distance").value);
    const efficiency = parseFloat(document.getElementById("efficiency").value);
    const fuelPrice = parseFloat(document.getElementById("fuelPrice").value);
    const dUnit = distanceUnit.value;
    const eUnit = efficiencyUnit.value;
    const pUnit = priceUnit.value;
    const output = document.getElementById("output");

    if (isNaN(distance) || isNaN(efficiency) || isNaN(fuelPrice)) {
      if (output)
        output.innerHTML =
          "<p style='color:#f87171;'>⚠️ Please fill in all fields correctly.</p>";
      return;
    }

    const distMiles = dUnit === "km" ? distance * 0.621371 : distance;

    let mpg;
    switch (eUnit) {
      case "mpg":
        mpg = efficiency;
        break;
      case "L100km":
        mpg = 235.215 / efficiency;
        break;
      case "kml":
        mpg = efficiency * 2.35215;
        break;
      case "Lpermile":
        mpg = 235.215 / (efficiency * 100);
        break;
      default:
        mpg = efficiency;
    }

    const costPerGallon = pUnit === "liter" ? fuelPrice * 3.78541 : fuelPrice;

    const gallonsUsed = distMiles / mpg;
    const fuelUsed = pUnit === "liter" ? gallonsUsed * 3.78541 : gallonsUsed;
    const fuelUnit = pUnit === "liter" ? "liters" : "gallons";
    const totalCost = gallonsUsed * costPerGallon;

    if (output) {
      output.innerHTML = `
        <div style="line-height:1.6;">
          <p>🚗 <strong>Trip Distance:</strong> ${distance} ${dUnit}</p>
          <p>⛽ <strong>Fuel Used:</strong> ${fuelUsed.toFixed(2)} ${fuelUnit}</p>
          <p>💰 <strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
        </div>
        <hr style="border:1px solid #38bdf8; margin:10px 0;">
        <p>
          Summary:<br>
          Distance: ${distance} ${dUnit}, Efficiency: ${efficiency} ${eUnit}, Fuel Price: $${fuelPrice}/${pUnit}.
          <br><strong>Estimated Trip Cost: $${totalCost.toFixed(2)}</strong>
        </p>
      `;
    }
  }

  function clearFields() {
    const distanceEl = document.getElementById("distance");
    const efficiencyEl = document.getElementById("efficiency");
    const priceEl = document.getElementById("fuelPrice");
    const output = document.getElementById("output");

    if (distanceEl) distanceEl.value = "";
    if (efficiencyEl) efficiencyEl.value = "";
    if (priceEl) priceEl.value = "";
    if (output) output.innerHTML = "";
  }
}

/* -------------------------------------------------
   ✅ DAY CALCULATOR
--------------------------------------------------*/
// worldHolidays is fine as-is (kept your data)
const worldHolidays = {
  Poland: [
    "01-01", "01-06", "04-09", "05-01", "05-03",
    "05-31", "08-15", "11-01", "11-11", "12-25", "12-26"
  ],
  // ... other countries unchanged
  United_States: ["01-01", "07-04", "11-11", "11-28", "12-25"],
  United_Kingdom: ["01-01", "04-07", "04-10", "05-01", "12-25", "12-26"],
  Canada: ["01-01", "07-01", "09-02", "10-14", "12-25", "12-26"],
  Germany: ["01-01", "04-07", "04-10", "05-01", "10-03", "12-25", "12-26"],
  France: ["01-01", "05-01", "05-08", "07-14", "08-15", "11-01", "12-25"],
  India: ["01-26", "08-15", "10-02", "11-12", "12-25"],
  Japan: ["01-01", "02-11", "04-29", "05-03", "05-05", "11-03", "12-23"],
  Australia: ["01-01", "01-26", "04-25", "12-25", "12-26"],
  Brazil: ["01-01", "04-21", "09-07", "10-12", "11-15", "12-25"],
  China: ["01-01", "02-10", "04-04", "05-01", "10-01"],
  South_Africa: ["01-01", "03-21", "04-27", "05-01", "06-16", "12-25", "12-26"],
  Russia: ["01-01", "01-07", "02-23", "05-09", "06-12", "11-04"]
};

function initDayCalculator() {
  const holidayList = document.getElementById("holidayList");
  const dayCalcBtn = document.getElementById("DayCalButton");
  const clearBtn = document.getElementById("clearBtn");

  if (!(holidayList && dayCalcBtn && clearBtn)) return;

  // Load holidays for Poland by default
  function loadHolidays() {
    holidayList.innerHTML = "";
    const holidays = worldHolidays["Poland"];
    holidays.forEach((holiday) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" class="holiday" data-date="${holiday}" checked />
          ${holiday}
        </label>`;
      holidayList.appendChild(div);
    });
  }

  // Calculate the difference between two dates
  function calculateDays() {
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const inclusive = document.getElementById("inclusive").checked;
    const mode = document.getElementById("mode").value;

    if (!startDateInput || !endDateInput) {
      alert("Please select both start and end dates.");
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
      alert("End date must be after start date.");
      return;
    }

    const totalDays =
      Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) +
      (inclusive ? 1 : 0);

    let businessDays = 0,
      weekendDays = 0,
      holidaysCount = 0;
    const selectedWeekdays = Array.from(
      document.querySelectorAll(".weekday:checked")
    ).map((el) => parseInt(el.getAttribute("data-day")));
    const selectedHolidays = Array.from(
      document.querySelectorAll(".holiday:checked")
    ).map((el) => el.getAttribute("data-date"));
    const holidayNames = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = !selectedWeekdays.includes(dayOfWeek);
      const monthDay = `${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const isHoliday = selectedHolidays.includes(monthDay);

      if (isHoliday) {
        holidaysCount++;
        holidayNames.push(monthDay);
      }
      if (isWeekend) weekendDays++;
      if (!isWeekend && !isHoliday) businessDays++;

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const output = document.getElementById("DayCaloutput");
    if (!output) return;

    output.innerHTML = `
      <div class="result-block">
        <strong>Difference between ${startDate.toDateString()} and ${endDate.toDateString()}:</strong><br>
        ${Math.floor(totalDays / 7)} weeks ${totalDays % 7} days<br>
        or ${totalDays} calendar days
        <table class="result-table">
          <tr><td>Weekend Days</td><td>${weekendDays}</td></tr>
          <tr><td>Holidays</td><td>${holidaysCount}</td></tr>
          <tr><td>Business Days</td><td>${businessDays}</td></tr>
        </table>
        ${
          holidayNames.length > 0
            ? `<p><b>Holidays between dates:</b><br>${holidayNames.join(", ")}</p>`
            : `<p><b>No holidays in this range.</b></p>`
        }
      </div>
    `;
  }

  function clearForm() {
    const startEl = document.getElementById("startDate");
    const endEl = document.getElementById("endDate");
    const inclusiveEl = document.getElementById("inclusive");
    const output = document.getElementById("DayCaloutput");
    if (startEl) startEl.value = "";
    if (endEl) endEl.value = "";
    if (inclusiveEl) inclusiveEl.checked = false;
    if (output) output.innerHTML = "";
  }

  loadHolidays();
  dayCalcBtn.addEventListener("click", calculateDays);
  clearBtn.addEventListener("click", clearForm);
}

// ================================
// ➕➖ Add/Subtract Date Calculator
// ================================
function initAddSubtractCalculator() {
  const calcBtn = document.getElementById("as-calc-btn");
  const clearBtn = document.getElementById("as-clear-btn");

  // Guard: only initialize if DOM elements exist
  if (!(calcBtn && clearBtn)) return;

  function addBusinessDays(date, days, holidays = []) {
    let count = 0;
    const newDate = new Date(date);
    while (count < Math.abs(days)) {
      newDate.setDate(newDate.getDate() + (days > 0 ? 1 : -1));
      const day = newDate.getDay();
      const monthDay = `${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(
        newDate.getDate()
      ).padStart(2, "0")}`;
      if (day !== 0 && day !== 6 && !holidays.includes(monthDay)) count++;
    }
    return newDate;
  }

  calcBtn.addEventListener("click", () => {
    const startInput = document.getElementById("as-start-date").value;
    const operation = document.getElementById("as-operation").value;
    const years = parseInt(document.getElementById("as-years").value) || 0;
    const months = parseInt(document.getElementById("as-months").value) || 0;
    const weeks = parseInt(document.getElementById("as-weeks").value) || 0;
    const days = parseInt(document.getElementById("as-days").value) || 0;
    const businessMode = document.getElementById("as-business").checked;

    if (!startInput) {
      alert("Please select a start date.");
      return;
    }

    const holidays = worldHolidays["Poland"] || [];
    const startDate = new Date(startInput);
    const direction = operation === "subtract" ? -1 : 1;
    const totalDays = days + weeks * 7;

    let resultDate = new Date(startDate);
    resultDate.setFullYear(resultDate.getFullYear() + years * direction);
    resultDate.setMonth(resultDate.getMonth() + months * direction);

    if (businessMode) {
      resultDate = addBusinessDays(resultDate, totalDays * direction, holidays);
    } else {
      resultDate.setDate(resultDate.getDate() + totalDays * direction);
    }

    const resultEl = document.getElementById("as-result");
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="result-block">
          <strong>Starting from:</strong> ${startDate.toDateString()}<br>
          <strong>Resulting Date:</strong> ${resultDate.toDateString()}<br>
          ${
            businessMode
              ? "<em>Business days calculation (excluding weekends & holidays)</em>"
              : "<em>Calendar days calculation</em>"
          }
        </div>
      `;
    }
  });

  clearBtn.addEventListener("click", () => {
    const start = document.getElementById("as-start-date");
    const years = document.getElementById("as-years");
    const months = document.getElementById("as-months");
    const weeks = document.getElementById("as-weeks");
    const days = document.getElementById("as-days");
    const business = document.getElementById("as-business");
    const result = document.getElementById("as-result");

    if (start) start.value = "";
    if (years) years.value = 0;
    if (months) months.value = 0;
    if (weeks) weeks.value = 0;
    if (days) days.value = 0;
    if (business) business.checked = false;
    if (result) result.innerHTML = "";
  });
}

// ==================================================
// Initialize interest calculator in a defensive way
// ==================================================
let chartInstance = null;


function initcalculateInvestment() {
  const calcBtn = document.getElementById("investment-calc-btn");
  const clearBtn = document.getElementById("investment-clear-btn");
  const resultsContainer = document.getElementById("results");
  const scheduleTableBody = document.querySelector("#scheduleTable tbody");
  const chartCanvas = document.getElementById("investmentChart");

  if (!calcBtn) return;

  function computeAndRender() {
    const P = parseFloat(document.getElementById("initialInvestment").value) || 0;
    const annualContribution = parseFloat(document.getElementById("annualContribution").value) || 0;
    const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    const rate = (parseFloat(document.getElementById("interestRate").value) / 100) || 0;
    const compound = document.getElementById("compound").value;
    const years = parseInt(document.getElementById("years").value) || 0;
    const months = parseInt(document.getElementById("months").value) || 0;
    const taxRate = (parseFloat(document.getElementById("taxRate").value) / 100) || 0;
    const inflationRate = (parseFloat(document.getElementById("inflationRate").value) / 100) || 0;

    const totalMonths = years * 12 + months;
    const totalYears = totalMonths / 12;
    const totalContributions = annualContribution * years + monthlyContribution * totalMonths;
    const totalPrincipal = P + totalContributions;

    // --- Separate balances for interest tracking ---
    let balance = P;
    let principalBalance = P;
    let contributionBalance = 0;

    const schedule = [];

    for (let year = 1; year <= years; year++) {
      // Add annual + monthly contributions
      let yearlyContribution = annualContribution + (monthlyContribution * 12);

      // Interest on total balance
      let interestTotal = balance * rate;
      let tax = interestTotal * taxRate;

      // Add new contributions and interest after tax
      balance += interestTotal - tax + yearlyContribution;

      // Track separate parts:
      principalBalance += principalBalance * rate - (principalBalance * rate * taxRate);
      contributionBalance += yearlyContribution + contributionBalance * rate - (contributionBalance * rate * taxRate);

      schedule.push({
        year,
        deposit: (year === 1 ? P : 0) + yearlyContribution,
        interest: interestTotal,
        tax,
        balance
      });
    }

    const totalInterest = schedule.reduce((sum, y) => sum + y.interest, 0);
    const totalTax = schedule.reduce((sum, y) => sum + y.tax, 0);
    const interestAfterTax = totalInterest - totalTax;
    const endBalanceAfterTax = totalPrincipal + interestAfterTax;
    const inflationAdjusted = endBalanceAfterTax / Math.pow(1 + inflationRate, totalYears || 1);

    // Separate interest components
    const interestInitial = principalBalance - P;
    const interestContributions = contributionBalance - totalContributions;

    // --- Display results ---
    if (resultsContainer) resultsContainer.style.display = "block";
    document.getElementById("endingBalance").innerText = "$" + balance.toFixed(2);
    document.getElementById("totalPrincipal").innerText = "$" + totalPrincipal.toFixed(2);
    document.getElementById("totalContributions").innerText = "$" + totalContributions.toFixed(2);
    document.getElementById("totalInterest").innerText = "$" + totalInterest.toFixed(2);
    document.getElementById("totalTax").innerText = "$" + totalTax.toFixed(2);
    document.getElementById("interestAfterTax").innerText = "$" + interestAfterTax.toFixed(2);
    document.getElementById("inflationAdjusted").innerText = "$" + inflationAdjusted.toFixed(2);
    document.getElementById("interestInitial").innerText = "$" + interestInitial.toFixed(2);
    document.getElementById("interestContributions").innerText = "$" + interestContributions.toFixed(2);

    // --- Update schedule table ---
    if (scheduleTableBody) {
      scheduleTableBody.innerHTML = "";
      schedule.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.year}</td>
          <td>$${row.deposit.toFixed(2)}</td>
          <td>$${row.interest.toFixed(2)}</td>
          <td>$${row.tax.toFixed(2)}</td>
          <td>$${row.balance.toFixed(2)}</td>
        `;
        scheduleTableBody.appendChild(tr);
      });
    }

    // --- Draw chart ---
    if (chartCanvas && typeof Chart !== "undefined") {
      const ctx = chartCanvas.getContext("2d");
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Initial Investment",
            "Contributions",
            "Interest on Initial Investment",
            "Interest on Contributions",
            "Tax"
          ],
          datasets: [{
            data: [P, totalContributions, interestInitial, interestContributions, totalTax],
            backgroundColor: ["#1e88e5", "#8bc34a", "#0288d1", "#9ccc65", "#ffb300"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }
  }

  calcBtn.addEventListener("click", computeAndRender);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const fields = [
        "initialInvestment", "annualContribution", "monthlyContribution",
        "interestRate", "years", "months", "taxRate", "inflationRate"
      ];
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });

      if (resultsContainer) resultsContainer.style.display = "none";
      if (scheduleTableBody) scheduleTableBody.innerHTML = "";
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    });
  }
}

// ====================================================
// Caloreis Calculator
// ====================================================


function initcalculateCalories() {
  const calcBtn = document.getElementById("CaloriesCal");
  const resultsDiv = document.getElementById("results");

  if (!calcBtn || !resultsDiv) return;

  // Hide results initially
  resultsDiv.style.display = "none";

  calcBtn.addEventListener("click", () => {
    const gender = document.getElementById("gender")?.value;
    const age = parseFloat(document.getElementById("age")?.value);
    const weight = parseFloat(document.getElementById("weight")?.value);
    const height = parseFloat(document.getElementById("height")?.value);

    if (!gender || isNaN(age) || isNaN(weight) || isNaN(height)) {
      resultsDiv.innerHTML = `<p class="error-msg">⚠️ Please fill out all fields correctly.</p>`;
      resultsDiv.style.display = "block";
      resultsDiv.classList.add("show");
      return;
    }

    // Step 1: Calculate BMR (Mifflin–St Jeor)
      let BMR;
      if (gender === "male") {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // Step 2: Activity multipliers
      const activities = [
        { name: "Sedentary (little or no exercise)", factor: 1.2 },
        { name: "Light (exercise 1–3 days/week)", factor: 1.375 },
        { name: "Moderate (exercise 3–5 days/week)", factor: 1.55 },
        { name: "Very active (exercise 6–7 days/week)", factor: 1.725 },
        { name: "Extra active (hard physical job or training)", factor: 1.9 }
      ];

      // Step 3: Build result tables
      let html = `<h3>Your BMR: ${BMR.toFixed(0)} kcal/day</h3>`;
      html += `<p>This is your resting calorie burn (no activity). Below are your calorie needs for each activity level:</p>`;
      html += `<table>
        <tr>
          <th>Activity Level</th>
          <th>Maintain Weight</th>
          <th>Mild Weight Loss (10%)</th>
          <th>Weight Loss (20%)</th>
          <th>Extreme Loss (39%)</th>
          <th>Weight Gain (+10%)</th>
        </tr>`;

      activities.forEach(a => {
        const maintain = BMR * a.factor;
        const mildLoss = maintain * 0.9;
        const weightLoss = maintain * 0.8;
        const extremeLoss = maintain * 0.61;
        const gain = maintain * 1.1;

        html += `<tr>
          <td>${a.name}</td>
          <td>${maintain.toFixed(0)}</td>
          <td>${mildLoss.toFixed(0)}</td>
          <td>${weightLoss.toFixed(0)}</td>
          <td>${extremeLoss.toFixed(0)}</td>
          <td>${gain.toFixed(0)}</td>
        </tr>`;
      });

      html += `</table>`;

      // Step 4: Weight loss per week estimate
      html += `<h3>Estimated Weight Loss per Week (Based on Activity)</h3>
        <table>
          <tr><th>Activity Level</th><th>Weight Lost per Week (lbs)</th></tr>
          <tr><td>Exercise 1–3 times/week</td><td>≈ 4.2 lb</td></tr>
          <tr><td>Exercise 4–5 times/week</td><td>≈ 6.4 lb</td></tr>
          <tr><td>Daily exercise or intense 3–4 times/week</td><td>≈ 8.4 lb</td></tr>
          <tr><td>Intense exercise 6–7 times/week</td><td>≈ 12.6 lb</td></tr>
          <tr><td>Very intense daily / physical job</td><td>≈ 16.8 lb</td></tr>
        </table>`;

      // Step 5: Zigzag diet explanation and schedules
      html += `
        <h3>Zigzag Calorie Cycling (Zigzag Diet)</h3>
        <p>
          As you keep a low-calorie diet, your body will likely adapt to the new, lower energy environment, which can lead to a plateau in your progress.
          <br><br>
          Zigzag calorie cycling, also known as a "zigzag diet," is a method of calorie consumption that can potentially help you overcome this plateau and get you back on track to meeting your goals.
        </p>
        
        <h3>Zigzag Diet Schedule 1</h3>
        <table>
          <tr><th>Day</th><th>Mild Weight Loss</th><th>Weight Loss</th></tr>
          <tr><td>Sunday</td><td>2,004 Calories</td><td>1,514 Calories</td></tr>
          <tr><td>Monday</td><td>1,654 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Tuesday</td><td>1,654 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Wednesday</td><td>1,654 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Thursday</td><td>1,654 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Friday</td><td>1,654 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Saturday</td><td>2,004 Calories</td><td>1,514 Calories</td></tr>
        </table>

        <h3>Zigzag Diet Schedule 2</h3>
        <table>
          <tr><th>Day</th><th>Mild Weight Loss</th><th>Weight Loss</th></tr>
          <tr><td>Sunday</td><td>1,504 Calories</td><td>1,500 Calories</td></tr>
          <tr><td>Monday</td><td>1,671 Calories</td><td>1,503 Calories</td></tr>
          <tr><td>Tuesday</td><td>1,837 Calories</td><td>1,505 Calories</td></tr>
          <tr><td>Wednesday</td><td>2,004 Calories</td><td>1,508 Calories</td></tr>
          <tr><td>Thursday</td><td>1,921 Calories</td><td>1,507 Calories</td></tr>
          <tr><td>Friday</td><td>1,754 Calories</td><td>1,504 Calories</td></tr>
          <tr><td>Saturday</td><td>1,587 Calories</td><td>1,501 Calories</td></tr>
        </table>
      `;


    // ✅ Show results
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = "block";
    resultsDiv.classList.add("show");
  });
}








