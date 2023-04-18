const API_KEY = "TTR10lvd9HhFHL4vUSpQBA";
console.log("hi");
const makesDropdown = document.querySelector('select[name="make"]');
const modelsDropdown = document.querySelector('select[name="models"]');
const makexSpan = document.getElementById("makex");
const modelxSpan = document.getElementById("modelx");

// Function to get list of makes from API
async function getMakes() {
  const url = "https://www.carboninterface.com/api/v1/vehicle_makes";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

// Function to get list of models for a given make ID from API
async function getModels(makeId) {
  const url = `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

// Function to update the makes dropdown with options from API
async function updateMakesDropdown() {
  const makes = await getMakes();
  makesDropdown.innerHTML = "<option value=''>Choose a Make</option>";
  for (const make of makes) {
    const option = document.createElement("option");
    option.value = make.data.id;
    option.text = make.data.attributes.name;
    makesDropdown.appendChild(option);
  }
}

// Function to update the models dropdown with options for a given make ID
async function updateModelsDropdown(makeId) {
  const models = await getModels(makeId);
  modelsDropdown.disabled = false;
  modelsDropdown.innerHTML = "<option value=''>Choose a Model</option>";
  for (const model of models) {
    const option = document.createElement("option");
    option.value = model.data.id;
    option.text = model.data.attributes.name;
    modelsDropdown.appendChild(option);
  }
}

// Event listener for when a make is selected
makesDropdown.addEventListener("change", async (event) => {
  const makeId = event.target.value;
  if (makeId) {
    updateModelsDropdown(makeId);
    makexSpan.innerText =
      makesDropdown.options[makesDropdown.selectedIndex].text;
    modelxSpan.innerText = "";
  } else {
    modelsDropdown.disabled = true;
    modelxSpan.innerText = "";
  }
});

async function getEstimate(ESTIMATE_ID) {
  const result = await fetch(
    `https://www.carboninterface.com/api/v1/estimates`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "vehicle",
        distance_unit: "km",
        distance_value: 100,
        vehicle_model_id: ESTIMATE_ID,
      }),
    }
  );

  data = await result.json();
  return data;
}

// Event listener for when a model is selected
modelsDropdown.addEventListener("change", async (event) => {
  modelxSpan.innerText =
    modelsDropdown.options[modelsDropdown.selectedIndex].text;
  const ESTIMATE_ID =
    modelsDropdown.options[modelsDropdown.selectedIndex].value;
  console.log(ESTIMATE_ID);
  const vehicleEstimate = await getEstimate(ESTIMATE_ID);
  console.log(vehicleEstimate);
  // Display the relevant information
  const distance = vehicleEstimate.data.attributes.distance_value;
  const make = vehicleEstimate.data.attributes.vehicle_make;
  const model = vehicleEstimate.data.attributes.vehicle_model;
  const year = vehicleEstimate.data.attributes.vehicle_year;
  const carbon = vehicleEstimate.data.attributes.carbon_kg;

  console.log(`Vehicle: ${year} ${make} ${model}`);
  console.log(
    `Distance: ${distance} ${vehicleEstimate.data.attributes.distance_unit}`
  );
  console.log(`Carbon emissions: ${carbon} kg`);
});
window.onload = updateMakesDropdown;
