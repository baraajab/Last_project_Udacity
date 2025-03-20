
const tripData = {};
const locationData = {};
const formatCityName = (city) => encodeURIComponent(city);
const calculateDaysUntilTrip = (departureDate) => {
  const today = new Date();
  const travelDay = new Date(departureDate);
  return Math.ceil((travelDay - today) / (1000 * 60 * 60 * 24));
};

const fetchLocationDetails = async (city) => {
  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=baraa00`
    );
    const data = await response.json();
    const { lat, lng } = data.geonames[0];
    locationData.lat = lat;
    locationData.lng = lng;
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
};

const fetchWeatherData = async (lat, lng) => {
  const apiKey = "f9720339199b43d0896b098bb3e8e311";
  const apiUrl =
    tripData.daysUntil <= 7
      ? `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apiKey}&include=minutely`
      : `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    tripData.temperature =
      tripData.daysUntil <= 7
        ? data.data[0].app_temp
        : data.data[0].app_max_temp;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const fetchCityImage = async (city) => {
  const apiKey = "49425021-4ccb9ab92174c33cc6e88088e";
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${city}&image_type=photo&min_width=800&min_height=800`
    );
    const data = await response.json();
    tripData.imageUrl = data.hits[0].previewURL;
  } catch (error) {
    console.error("Error fetching city image:", error);
  }
};

const calculateTripDuration = (departureDate, returnDate) => {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  tripData.tripDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const displayTripDetails = () => {
  const imgElement = document.getElementById("weather-image");
  const durationElement = document.getElementById("trip-length");
  const countdownElement = document.getElementById("trip-countdown");
  const weatherElement = document.getElementById("weather-forecast");


  if (imgElement && tripData.imageUrl) imgElement.src = tripData.imageUrl;
  if (durationElement) durationElement.textContent = `Trip Length: ${tripData.tripDuration} days`;
  if (countdownElement) countdownElement.textContent = `Trip Countdown: ${tripData.daysUntil} days`;
  if (weatherElement) weatherElement.textContent = `Weather forecast: ${tripData.temperature} °C`;
};

export {
  formatCityName,
  calculateDaysUntilTrip,
  calculateTripDuration,
  fetchLocationDetails,
  fetchWeatherData,
  fetchCityImage,
  displayTripDetails,
  tripData,
  locationData,
};
