// ✅ Routes
// ✅ Define routes using hash
const routes = {
  "#/": "home.html",

  "#/finance": "finance.html",
  "#/fitness": "fitness.html",
  "#/math": "math.html",
  "#/other": "other.html",
  "#/BIMCAL": "BIMCAL.html",

  404: "404.html", // fallback
};

// ✅ Router function
const Routermain = (event) => {
  event.preventDefault();
  const href = event.target.getAttribute("href");
  window.location.hash = href; // Update hash
};

// ✅ Handle location
const handellocation = async () => {
  const path = window.location.hash || "#/"; // Default page = home
  const route = routes[path] || routes[404];

  try {
    const html = await fetch(route).then((res) => res.text());
    document.getElementById("Content").innerHTML = html;
  } catch (err) {
    document.getElementById("Content").innerHTML =
      "<h2>Error loading page.</h2>";
  }
};

// ✅ Handle back/forward
window.addEventListener("hashchange", handellocation);

// ✅ First load
handellocation();

// ✅ Attach globally for onclick
window.route = Routermain;

// menu open and close function
const menu = document.getElementById("mobile-menu"); //defive menu that open and close
const openBtn = document.getElementById("OpenMenu"); //define open button
const closeBtn = document.getElementById("closeMenu"); // defuine close

// open gunctiom
const openMenu = () => {
  menu.classList.remove("hidden");
};
// close menu
const closeMenu = () => {
  menu.classList.add("hidden");
};

openBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);

// with help of this user select menu item menu close auto
window.selectMenu = function (event) {
  event.preventDefault();
  closeMenu();
  Routermain(event); // your routing logic
};

// BMI Calculator JS
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements
  const metBtn = document.getElementById("metBtn");
  const usBtn = document.getElementById("usBtn");
  const metricInputs = document.getElementById("metricInputs");
  const usInputs = document.getElementById("usInputs");
  const calcBtn = document.getElementById("calcBtn");
  const clearBtn = document.getElementById("clearBtn");
  
  const bmiValue = document.querySelector(".bmi-value");
  const statusDiv = document.querySelector(".status");

  // Toggle between metric and US units
if (usBtn && metBtn && calcBtn && clearBtn) {
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
}


  function calculateBMI() {
    let height, weight;

    if (metBtn.classList.contains("active")) {
      height = parseFloat(document.getElementById("height").value) / 100; // cm to m
      weight = parseFloat(document.getElementById("weight").value);
    } else {
      const feet = parseFloat(document.getElementById("heightFeet").value);
      const inches = parseFloat(document.getElementById("heightInches").value);
      height = (feet * 12 + inches) * 0.0254; // inches to m
      weight =
        parseFloat(document.getElementById("weightLbs").value) * 0.453592; // lbs to kg
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
});
