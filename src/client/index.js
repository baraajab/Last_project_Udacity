import "./styles/style.scss";

import {
  formatCityName,
  calculateDaysUntilTrip,
  calculateTripDuration,
  fetchLocationDetails,
  fetchWeatherData,
  fetchCityImage,
  displayTripDetails,
  tripData,
  locationData
} from './js/app.js';

// Handle form submission
window.onload = function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let cityName = document.getElementById("country").value;
    const departureDate = document.getElementById("travel-date").value;
    const returnDate = document.getElementById("return-date").value;
    
    cityName = formatCityName(cityName);
    tripData.daysUntil = calculateDaysUntilTrip(departureDate);
    calculateTripDuration(departureDate, returnDate);
    
    await fetchLocationDetails(cityName);
    await fetchWeatherData(locationData.lat, locationData.lng);
    await fetchCityImage(cityName);
    
    displayTripDetails();
  });
};
