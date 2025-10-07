// ✅ ROUTES
const routes = {
  "#/": "home.html",
  
  "#/finance": "finance.html",
  "#/fitness": "fitness.html",
  "#/math": "math.html",
  "#/other": "other.html",
  "#/BIMCAL": "BIMCAL.html",
  "#/FuelConsumption": "FuelConsumption.html",
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

const openMenu = () => menu.classList.remove("hidden");
const closeMenu = () => menu.classList.add("hidden");

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
  if (path === "#/BIMCAL") initBMICalculator();
  if (path === "#/FuelConsumption") calculate();
}

// ✅ BMI CALCULATOR
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

  usBtn.addEventListener("click", function () {
    usBtn.classList.add("active");
    metBtn.classList.remove("active");
    usInputs.style.display = "block";
    metricInputs.style.display = "none";
    clearResults();
  });

  metBtn.addEventListener("click", function () {
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
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("heightFeet").value = "";
    document.getElementById("heightInches").value = "";
    document.getElementById("weightLbs").value = "";
  }
}



// Fuel consuption

document
      .getElementById("calculateBtn")
      .addEventListener("click", calculate);
    document
      .getElementById("clearBtn")
      .addEventListener("click", clearFields);

    document
      .getElementById("distanceUnit")
      .addEventListener("change", updatePlaceholders);
    document
      .getElementById("efficiencyUnit")
      .addEventListener("change", updatePlaceholders);
    document
      .getElementById("priceUnit")
      .addEventListener("change", updatePlaceholders);

    // Update input placeholders dynamically
    function updatePlaceholders() {
      const distanceUnit = document.getElementById("distanceUnit").value;
      const efficiencyUnit = document.getElementById("efficiencyUnit").value;
      const priceUnit = document.getElementById("priceUnit").value;

      document.getElementById("distance").placeholder =
        distanceUnit === "km"
          ? "Enter distance (km)"
          : "Enter distance (miles)";

      const effPlaceholder = {
        mpg: "Enter efficiency (mpg)",
        L100km: "Enter efficiency (L/100km)",
        kml: "Enter efficiency (km/L)",
        Lpermile: "Enter efficiency (L/mile)",
      };
      document.getElementById("efficiency").placeholder =
        effPlaceholder[efficiencyUnit];

      document.getElementById("fuelPrice").placeholder =
        priceUnit === "liter"
          ? "Enter price per liter"
          : "Enter price per gallon";
    }

    // Calculation logic
    function calculate() {
      const distance = parseFloat(document.getElementById("distance").value);
      const efficiency = parseFloat(
        document.getElementById("efficiency").value
      );
      const fuelPrice = parseFloat(
        document.getElementById("fuelPrice").value
      );
      const distanceUnit = document.getElementById("distanceUnit").value;
      const efficiencyUnit = document.getElementById("efficiencyUnit").value;
      const priceUnit = document.getElementById("priceUnit").value;
      const output = document.getElementById("output");

      // Validate inputs
      if (isNaN(distance) || isNaN(efficiency) || isNaN(fuelPrice)) {
        output.innerHTML =
          "<p style='color:#f87171;'>⚠️ Please fill in all fields correctly.</p>";
        return;
      }

      // Convert distance to miles if needed
      const distMiles =
        distanceUnit === "km" ? distance * 0.621371 : distance;

      // Convert all efficiency units to miles per gallon (mpg)
      let mpg;
      switch (efficiencyUnit) {
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

      // Convert price to per gallon if given in per liter
      const costPerGallon =
        priceUnit === "liter" ? fuelPrice * 3.78541 : fuelPrice;

      // Calculate fuel used (in gallons)
      const gallonsUsed = distMiles / mpg;

      // Convert fuel used to liters if needed
      const fuelUsed =
        priceUnit === "liter" ? gallonsUsed * 3.78541 : gallonsUsed;

      // Determine the correct fuel unit
      const fuelUnit = priceUnit === "liter" ? "liters" : "gallons";

      // Total cost
      const totalCost = gallonsUsed * costPerGallon;

      // Display results
      let resultHTML = `
      <div style="display:flex; flex-direction:row; gap:6px; line-height:1.6;">
        <p>🚗 Trip Distance: <strong>${distance}</strong> ${distanceUnit}</p>
        <p>⛽ Fuel Used: <strong>${fuelUsed.toFixed(2)}</strong> ${fuelUnit}</p>
        <p>💰 Total Cost: <strong>$${totalCost.toFixed(2)}</strong></p>
      </div>
      <hr style="border: 1px solid #38bdf8; margin: 10px 0;">
      <p>📊 Summary:</p>
      <p>
        The total distance is <strong>${distance}</strong> ${distanceUnit}, 
        fuel efficiency is <strong>${efficiency}</strong> ${efficiencyUnit}, 
        and fuel price is <strong>$${fuelPrice}</strong> per ${priceUnit}.
        <br/>💰 Estimated total trip cost: <strong>$${totalCost.toFixed(
        2
      )}</strong>.
      </p>
    `;

      output.innerHTML = resultHTML;
    }

    // Clear all fields
    function clearFields() {
      document.getElementById("distance").value = "";
      document.getElementById("efficiency").value = "";
      document.getElementById("fuelPrice").value = "";
      document.getElementById("output").innerHTML = "";
    }

    // Initialize placeholders on load
    updatePlaceholders();
