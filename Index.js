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
  404: "404.html",
};

// ✅ ROUTER HANDLER
const Routermain = (event) => {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  window.location.hash = href;
};

// ✅ LOAD PAGE CONTENT
const handellocation = async () => {
  const path = window.location.hash || "#/";
  const route = routes[path] || routes[404];

  try {
    const html = await fetch(route).then((res) => res.text());
    document.getElementById("Content").innerHTML = html;

    // ✅ Reinitialize page-specific JS
    initPageScripts(path);
  } catch (err) {
    document.getElementById("Content").innerHTML = "<h2>Error loading page.</h2>";
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
      // ✅ Initialize both calculators on the same page
      initDayCalculator();
      initAddSubtractCalculator();
      break;

    default:
      break;
  }
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

  if (!(usBtn && metBtn && calcBtn && clearBtn)) return;

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
      height = parseFloat(document.getElementById("height").value) / 100;
      weight = parseFloat(document.getElementById("weight").value);
    } else {
      const feet = parseFloat(document.getElementById("heightFeet").value);
      const inches = parseFloat(document.getElementById("heightInches").value);
      height = (feet * 12 + inches) * 0.0254;
      weight = parseFloat(document.getElementById("weightLbs").value) * 0.453592;
    }

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert("Please enter valid height and weight!");
      return;
    }

    const bmi = weight / (height * height);
    bmiValue.textContent = `BMI = ${bmi.toFixed(1)}`;
    statusDiv.textContent = getStatus(bmi);
  }

  function getStatus(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    if (bmi < 34.9) return "Obesity Class I";
    if (bmi < 39.9) return "Obesity Class II";
    return "Obesity Class III";
  }

  function clearResults() {
    bmiValue.textContent = "BMI = 0.0";
    statusDiv.textContent = "(Result)";
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
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

  if (!(calcBtn && clearBtn && distanceUnit && efficiencyUnit && priceUnit)) return;

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

    document.getElementById("distance").placeholder =
      dUnit === "km" ? "Enter distance (km)" : "Enter distance (miles)";

    const effText = {
      mpg: "Enter efficiency (mpg)",
      L100km: "Enter efficiency (L/100km)",
      kml: "Enter efficiency (km/L)",
      Lpermile: "Enter efficiency (L/mile)",
    };

    document.getElementById("efficiency").placeholder = effText[eUnit];
    document.getElementById("fuelPrice").placeholder =
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
      output.innerHTML =
        "<p style='color:#f87171;'>⚠️ Please fill in all fields correctly.</p>";
      return;
    }

    const distMiles = dUnit === "km" ? distance * 0.621371 : distance;

    let mpg;
    switch (eUnit) {
      case "mpg": mpg = efficiency; break;
      case "L100km": mpg = 235.215 / efficiency; break;
      case "kml": mpg = efficiency * 2.35215; break;
      case "Lpermile": mpg = 235.215 / (efficiency * 100); break;
      default: mpg = efficiency;
    }

    const costPerGallon = pUnit === "liter" ? fuelPrice * 3.78541 : fuelPrice;

    const gallonsUsed = distMiles / mpg;
    const fuelUsed = pUnit === "liter" ? gallonsUsed * 3.78541 : gallonsUsed;
    const fuelUnit = pUnit === "liter" ? "liters" : "gallons";
    const totalCost = gallonsUsed * costPerGallon;

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

  function clearFields() {
    document.getElementById("distance").value = "";
    document.getElementById("efficiency").value = "";
    document.getElementById("fuelPrice").value = "";
    document.getElementById("output").innerHTML = "";
  }
}

/* -------------------------------------------------
   ✅ DAY CALCULATOR
--------------------------------------------------*/
// ================================
// 🌍 World Holidays
// ================================
const worldHolidays = {
  Poland: [
    "01-01", "01-06", "04-09", "05-01", "05-03",
    "05-31", "08-15", "11-01", "11-11", "12-25", "12-26"
  ],
  United_States: [
    "01-01", "07-04", "11-11", "11-28", "12-25"
  ],
  United_Kingdom: [
    "01-01", "04-07", "04-10", "05-01", "12-25", "12-26"
  ],
  Canada: [
    "01-01", "07-01", "09-02", "10-14", "12-25", "12-26"
  ],
  Germany: [
    "01-01", "04-07", "04-10", "05-01", "10-03", "12-25", "12-26"
  ],
  France: [
    "01-01", "05-01", "05-08", "07-14", "08-15", "11-01", "12-25"
  ],
  India: [
    "01-26", "08-15", "10-02", "11-12", "12-25"
  ],
  Japan: [
    "01-01", "02-11", "04-29", "05-03", "05-05", "11-03", "12-23"
  ],
  Australia: [
    "01-01", "01-26", "04-25", "12-25", "12-26"
  ],
  Brazil: [
    "01-01", "04-21", "09-07", "10-12", "11-15", "12-25"
  ],
  China: [
    "01-01", "02-10", "04-04", "05-01", "10-01"
  ],
  South_Africa: [
    "01-01", "03-21", "04-27", "05-01", "06-16", "12-25", "12-26"
  ],
  Russia: [
    "01-01", "01-07", "02-23", "05-09", "06-12", "11-04"
  ]
};

// ================================
// 🧮 Initialize the Day Calculator
// ================================
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
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("inclusive").checked = false;
    document.getElementById("DayCaloutput").innerHTML = "";
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

  function addBusinessDays(date, days, holidays) {
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

    const holidays = worldHolidays["Poland"];
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

    document.getElementById("as-result").innerHTML = `
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
  });

  clearBtn.addEventListener("click", () => {
    document.getElementById("as-start-date").value = "";
    document.getElementById("as-years").value = 0;
    document.getElementById("as-months").value = 0;
    document.getElementById("as-weeks").value = 0;
    document.getElementById("as-days").value = 0;
    document.getElementById("as-business").checked = false;
    document.getElementById("as-result").innerHTML = "";
  });
}

// Initialize both calculators
document.addEventListener("DOMContentLoaded", () => {
  initDayCalculator();
  initAddSubtractCalculator();
});

