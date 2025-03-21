import "./styles/style.scss";
import {
  formatCityName,
  calculateDaysUntilTrip,
  calculateTripDuration,
  fetchLocationDetails,
  fetchWeatherData,
  fetchCityImage,
  displayTripDetails,
  tripData
} from './js/app.js';

// Handle form submission
window.onload = function () {
  try {
    // Get form element
    const form = document.querySelector("form");
    if (!form) {
      console.error("Form element not found in the DOM");
      return;
    }
    
    // Add Save and Remove buttons to the UI
    const outputsDiv = document.querySelector(".outputs");
    if (!outputsDiv) {
      console.error("Outputs div not found in the DOM");
      return;
    }
    
    // Check if buttons container already exists to avoid duplicates
    if (!document.querySelector(".buttons-container")) {
      // Create buttons container
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "buttons-container";
      
      // Create Save button
      const saveButton = document.createElement("button");
      saveButton.innerHTML = '<i class="fas fa-save"></i> Save';
      saveButton.className = "save-button";
      saveButton.type = "button";
      
      // Create Remove button
      const removeButton = document.createElement("button");
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove';
      removeButton.className = "remove-button";
      removeButton.type = "button";
      
      // Add buttons to container
      buttonsContainer.appendChild(saveButton);
      buttonsContainer.appendChild(removeButton);
      
      // Add container to outputs
      outputsDiv.appendChild(buttonsContainer);
      
      // Function to handle Save button click
      saveButton.addEventListener("click", async () => {
        try {
          if (Object.keys(tripData).length > 0) {
            // Save trip data to localStorage
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
            savedTrips.push({...tripData, savedAt: new Date().toISOString()});
            localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
            
            // Create dialog options for what to do next
            const actionDialog = document.createElement("div");
            actionDialog.className = "action-dialog";
            actionDialog.innerHTML = `
              <div class="dialog-content">
                <h4><i class="fas fa-check-circle"></i> Trip saved successfully!</h4>
                <p>What would you like to do next?</p>
                <div class="dialog-buttons">
                  <button id="preview-trip"><i class="fas fa-eye"></i> Preview Trip</button>
                  <button id="print-trip"><i class="fas fa-print"></i> Print Trip</button>
                  <button id="close-dialog"><i class="fas fa-times"></i> Close</button>
                </div>
              </div>
            `;
            
            // Add dialog to the body
            document.body.appendChild(actionDialog);
            
            // Add event listeners to dialog buttons
            document.getElementById('preview-trip').addEventListener('click', () => {
              // Create trip preview
              createTripPreview(tripData);
              actionDialog.remove();
            });
            
            document.getElementById('print-trip').addEventListener('click', () => {
              // Print trip details
              printTripDetails(tripData);
              actionDialog.remove();
            });
            
            document.getElementById('close-dialog').addEventListener('click', () => {
              actionDialog.remove();
            });
            
          } else {
            alert('No trip details to save. Please search for a trip first.');
          }
        } catch (error) {
          console.error("Error saving trip:", error);
          alert('Failed to save trip. Please try again.');
        }
      });
      
      // Function to create a trip preview
      function createTripPreview(tripData) {
        // Create preview container
        const previewContainer = document.createElement("div");
        previewContainer.className = "trip-preview-overlay";
        
        // Format date strings for better display
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        };
        
        // Create HTML content
        previewContainer.innerHTML = `
          <div class="trip-preview">
            <div class="preview-header">
              <h2><i class="fas fa-plane-departure"></i> Trip to ${tripData.destination}</h2>
              <button class="close-preview"><i class="fas fa-times"></i></button>
            </div>
            <div class="preview-content">
              <div class="preview-image">
                <img src="${tripData.imageUrl}" alt="Image of ${tripData.destination}">
              </div>
              <div class="preview-details">
                <p><i class="fas fa-calendar-alt"></i> <strong>Departure:</strong> ${formatDate(tripData.departureDate)}</p>
                <p><i class="fas fa-calendar-check"></i> <strong>Return:</strong> ${formatDate(tripData.returnDate)}</p>
                <p><i class="fas fa-clock"></i> <strong>Trip Duration:</strong> ${tripData.tripDuration} days</p>
                <p><i class="fas fa-hourglass-half"></i> <strong>Trip Countdown:</strong> ${tripData.daysUntil} days</p>
                <p><i class="fas fa-temperature-high"></i> <strong>Temperature:</strong> ${tripData.temperature} °C</p>
                <hr>
                <div class="preview-actions">
                  <button class="print-from-preview"><i class="fas fa-print"></i> Print</button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add to body
        document.body.appendChild(previewContainer);
        
        // Add event listener to close button
        previewContainer.querySelector('.close-preview').addEventListener('click', () => {
          previewContainer.remove();
        });
        
        // Add event listener to print button
        previewContainer.querySelector('.print-from-preview').addEventListener('click', () => {
          printTripDetails(tripData);
        });
      }
      
      // Function to print trip details
      function printTripDetails(tripData) {
        // Format date strings for better display
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        };
        
        // Create print content
        const printContent = `
          <html>
          <head>
            <title>Trip to ${tripData.destination}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              .print-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
              .print-content { display: flex; flex-wrap: wrap; }
              .print-image { margin-right: 20px; margin-bottom: 20px; }
              .print-image img { max-width: 100%; height: auto; max-height: 300px; }
              .print-details { flex: 1; min-width: 300px; }
              .print-details p { margin: 10px 0; }
              h1 { color: #3498db; }
              .print-footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center; font-size: 0.8em; }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Trip to ${tripData.destination}</h1>
            </div>
            <div class="print-content">
              <div class="print-image">
                <img src="${tripData.imageUrl}" alt="Image of ${tripData.destination}">
              </div>
              <div class="print-details">
                <p><strong>Destination:</strong> ${tripData.destination}</p>
                <p><strong>Departure Date:</strong> ${formatDate(tripData.departureDate)}</p>
                <p><strong>Return Date:</strong> ${formatDate(tripData.returnDate)}</p>
                <p><strong>Trip Duration:</strong> ${tripData.tripDuration} days</p>
                <p><strong>Days Until Departure:</strong> ${tripData.daysUntil} days</p>
                <p><strong>Temperature at Destination:</strong> ${tripData.temperature} °C</p>
              </div>
            </div>
            <div class="print-footer">
              <p>This trip was planned using Travel Planner on ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
          </html>
        `;
        
        // Open a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for resources to load before printing
        printWindow.onload = function() {
          printWindow.print();
          // Don't close the window immediately to allow the print dialog to complete
        };
      }
      
      // Function to handle Remove button click
      removeButton.addEventListener("click", () => {
        try {
          // Clear displayed trip data
          const tripLengthEl = document.getElementById("trip-length");
          const tripCountdownEl = document.getElementById("trip-countdown");
          const weatherForecastEl = document.getElementById("weather-forecast");
          const weatherImageEl = document.getElementById("weather-image");
          
          if (tripLengthEl) tripLengthEl.textContent = "";
          if (tripCountdownEl) tripCountdownEl.textContent = "";
          if (weatherForecastEl) weatherForecastEl.textContent = "";
          if (weatherImageEl) weatherImageEl.src = "";
          
          // Reset form
          form.reset();
          
          // Clear tripData object
          Object.keys(tripData).forEach(key => delete tripData[key]);
          
          alert('Trip removed!');
        } catch (error) {
          console.error("Error removing trip:", error);
          alert('Failed to remove trip. Please try again.');
        }
      });
    }

    // Add form submission event listener
    form.addEventListener("submit", async (event) => {
      try {
        event.preventDefault();
        
        // Show loading indicator
        const resultsArea = document.querySelector(".outputs");
        if (resultsArea) {
          resultsArea.classList.add("loading");
        }
        
        // Get form values
        let cityName = document.getElementById("country").value;
        const departureDate = document.getElementById("travel-date").value;
        const returnDate = document.getElementById("return-date").value;
        
        // Validate form inputs
        if (!cityName) {
          throw new Error("Please enter a destination");
        }
        
        if (!departureDate) {
          throw new Error("Please select a departure date");
        }
        
        if (!returnDate) {
          throw new Error("Please select a return date");
        }
        
        // Store original city name for display
        tripData.destination = cityName;
        
        // Process the trip information
        cityName = formatCityName(cityName);
        tripData.daysUntil = calculateDaysUntilTrip(departureDate);
        calculateTripDuration(departureDate, returnDate);
        
        // Add departure and return dates to tripData
        tripData.departureDate = departureDate;
        tripData.returnDate = returnDate;
        
        // Chain API calls with proper error handling
        await fetchLocationDetails(cityName)
          .then(locationData => fetchWeatherData(locationData.lat, locationData.lng))
          .catch(error => {
            console.error("Error in location/weather data chain:", error);
            // Continue with default or partial data
          });
        
        // Fetch city image
        await fetchCityImage(cityName)
          .catch(error => {
            console.error("Error fetching city image:", error);
            // Continue with default or no image
          });
        
        // Display whatever data we have
        displayTripDetails();
        
        // Remove loading indicator
        if (resultsArea) {
          resultsArea.classList.remove("loading");
        }
      } catch (error) {
        console.error("Error processing trip:", error);
        alert(`Error: ${error.message || 'Failed to process trip'}`);
        
        // Remove loading indicator in case of error
        const resultsArea = document.querySelector(".outputs");
        if (resultsArea) {
          resultsArea.classList.remove("loading");
        }
      }
    });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};