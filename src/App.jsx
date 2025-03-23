// import { useEffect, useState } from 'react';
// import './App.css';
// const properties = [
//   {
//     projectName: "DLF The Primus",
//     apartmentType: "Apartment",
//     sector: "Sector 82 A",
//     city: "Gurgaon",
//     locality: "New Gurgaon",
//   },
//   {
//     projectName: "Spaze Privvy The Address",
//     apartmentType: "2,3,4,5 BHK Apartment",
//     sector: "Sector 93",
//     city: "Gurgaon",
//     locality: "New Gurgaon",
//   },
//   {
//     projectName: "Godrej Oasis",
//     apartmentType: "2,3,4 BHK Apartment",
//     sector: "Sector 88 A",
//     city: "Gurgaon",
//     locality: "New Gurgaon",
//   },
// ];

// function App() {

  
//     const [query, setQuery] = useState("");
//     const [selectedFilters, setSelectedFilters] = useState({
//       city: "",
//       sector: "",
//       projectName: "",
//       apartmentType: "",
//     });
  
//     const filteredSuggestions = properties
//       .filter((property) =>
//         query
//           ? property.projectName.toLowerCase().includes(query.toLowerCase()) ||
//             property.apartmentType.toLowerCase().includes(query.toLowerCase()) ||
//             property.sector.toLowerCase().includes(query.toLowerCase()) ||
//             property.city.toLowerCase().includes(query.toLowerCase()) ||
//             property.locality.toLowerCase().includes(query.toLowerCase())
//           : false
//       )
//       .map((property) => ({
//         projectName: selectedFilters.projectName ? null : property.projectName,
//         apartmentType: selectedFilters.apartmentType ? null : property.apartmentType,
//         sector: selectedFilters.sector ? null : property.sector,
//         city: selectedFilters.city ? null : property.city,
//       }))
//       .flatMap((obj) => Object.values(obj).filter(Boolean));
  
//     const handleSelect = (value, type) => {
//       setSelectedFilters((prev) => ({ ...prev, [type]: value }));
//       setQuery("");
//     };
  
//     return (
//       <div className="w-full max-w-lg mx-auto p-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by Project Name, Sector, Apartment Type..."
//           className="w-full p-2 border rounded"
//         />
//         {query && (
//           <ul className="border rounded mt-2 p-2 bg-white shadow-lg">
//             {filteredSuggestions.length > 0 ? (
//               filteredSuggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   onClick={() => handleSelect(suggestion, Object.keys(selectedFilters).find((key) => !selectedFilters[key]))}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                 >
//                   {suggestion}
//                 </li>
//               ))
//             ) : (
//               <li className="p-2 text-gray-500">No suggestions found</li>
//             )}
//           </ul>
//         )}
//         <div className="mt-4">
//           {Object.entries(selectedFilters).map(([key, value]) =>
//             value ? (
//               <span
//                 key={key}
//                 className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm m-1"
//               >
//                 {value} ✕
//               </span>
//             ) : null
//           )}
//         </div>
//       </div>
//     );
//   };
  
// export default App;



// // Data structure to store all possible values for each field
// const suggestionData = {
//   cities: new Set(),
//   localities: new Set(),
//   sectors: new Set(),
//   projectNames: new Set(),
//   propertyTypes: new Set(),
//   apartmentTypes: new Set()
// };

// // Function to populate the suggestion data from API response
// function populateSuggestionData(properties) {
//   properties.forEach(property => {
//     // Extract values from each property
//     if (property.LocationDetails) {
//       if (property.LocationDetails.City) suggestionData.cities.add(property.LocationDetails.City);
//       if (property.LocationDetails.Locality) suggestionData.localities.add(property.LocationDetails.Locality);
//       if (property.LocationDetails.Landmark) suggestionData.sectors.add(property.LocationDetails.Landmark);
//       if (property.LocationDetails.ProjectName) suggestionData.projectNames.add(property.LocationDetails.ProjectName);
//     }
    
//     if (property.BasicDetails) {
//       if (property.BasicDetails.PropertyType) suggestionData.propertyTypes.add(property.BasicDetails.PropertyType);
//       if (property.BasicDetails.ApartmentType) suggestionData.apartmentTypes.add(property.BasicDetails.ApartmentType);
//     }
//   });
// }

// // Function to get suggestions based on user input and already selected values
// function getSuggestions(query, selectedFilters = {}) {
//   if (!query || query.trim() === '') return [];
  
//   query = query.toLowerCase().trim();
//   const results = [];
  
//   // Only add suggestions for fields that haven't been selected yet
//   if (!selectedFilters.city) {
//     suggestionData.cities.forEach(city => {
//       if (city.toLowerCase().includes(query)) {
//         results.push({
//           value: city,
//           type: 'city',
//           display: `City: ${city}`
//         });
//       }
//     });
//   }
  
//   if (!selectedFilters.locality) {
//     suggestionData.localities.forEach(locality => {
//       if (locality.toLowerCase().includes(query)) {
//         results.push({
//           value: locality,
//           type: 'locality',
//           display: `Locality: ${locality}`
//         });
//       }
//     });
//   }
  
//   if (!selectedFilters.sector) {
//     suggestionData.sectors.forEach(sector => {
//       if (sector.toLowerCase().includes(query)) {
//         results.push({
//           value: sector, 
//           type: 'sector',
//           display: `Sector: ${sector}`
//         });
//       }
//     });
//   }
  
//   if (!selectedFilters.projectName) {
//     suggestionData.projectNames.forEach(projectName => {
//       if (projectName.toLowerCase().includes(query)) {
//         results.push({
//           value: projectName,
//           type: 'projectName',
//           display: `Project: ${projectName}`
//         });
//       }
//     });
//   }
  
//   if (!selectedFilters.propertyType) {
//     suggestionData.propertyTypes.forEach(propertyType => {
//       if (propertyType.toLowerCase().includes(query)) {
//         results.push({
//           value: propertyType,
//           type: 'propertyType',
//           display: `Property Type: ${propertyType}`
//         });
//       }
//     });
//   }
  
//   if (!selectedFilters.apartmentType) {
//     suggestionData.apartmentTypes.forEach(apartmentType => {
//       if (apartmentType.toLowerCase().includes(query)) {
//         results.push({
//           value: apartmentType,
//           type: 'apartmentType',
//           display: `Apartment Type: ${apartmentType}`
//         });
//       }
//     });
//   }
  
//   // Limit results for performance
//   return results.slice(0, 10);
// }

// // Initialize suggestion data with sample property
// const sampleProperties = [
//   {
//     "BasicDetails": {
//       "PropertyType": "Residential",
//       "ApartmentType": "Apartment",
//       "PropertyStatus": "Ready to move"
//     },
//     "LocationDetails": {
//       "City": "Gurgaon",
//       "Locality": "New Gurgaon",
//       "Landmark": "Sector 82 A",
//       "ProjectName": "DLF The Primus"
//     }
//   }
// ];

// // Example of how to use the suggestion system
// populateSuggestionData(sampleProperties);

// // Example usage 1: Searching for "gur" with no filters selected
// console.log("Searching for 'gur' with no filters:");
// console.log(getSuggestions('gur'));

// // Example usage 2: Searching for "gur" when city is already selected
// console.log("Searching for 'gur' with city already selected:");
// console.log(getSuggestions('gur', { city: 'Gurgaon' }));

// // Function to handle user input and display suggestions
// function handleSearchInput(inputValue, selectedFilters) {
//   const suggestions = getSuggestions(inputValue, selectedFilters);
//   displaySuggestions(suggestions);
// }

// // Function to display suggestions in UI
// function displaySuggestions(suggestions) {
//   const suggestionsContainer = document.getElementById('suggestions-container');
//   suggestionsContainer.innerHTML = '';
  
//   if (suggestions.length === 0) {
//     suggestionsContainer.style.display = 'none';
//     return;
//   }
  
//   suggestionsContainer.style.display = 'block';
  
//   suggestions.forEach(suggestion => {
//     const suggestionItem = document.createElement('div');
//     suggestionItem.className = 'suggestion-item';
//     suggestionItem.textContent = suggestion.display;
//     suggestionItem.dataset.value = suggestion.value;
//     suggestionItem.dataset.type = suggestion.type;
    
//     suggestionItem.addEventListener('click', () => {
//       selectSuggestion(suggestion);
//     });
    
//     suggestionsContainer.appendChild(suggestionItem);
//   });
// }

// // Function to handle when user selects a suggestion
// function selectSuggestion(suggestion) {
//   // Update selected filters
//   const selectedFilters = getSelectedFilters();
//   selectedFilters[suggestion.type] = suggestion.value;
  
//   // Update UI to show the selected filter
//   updateSelectedFiltersUI(selectedFilters);
  
//   // Clear search input
//   document.getElementById('search-input').value = '';
  
//   // Hide suggestions
//   document.getElementById('suggestions-container').style.display = 'none';
// }

// // Function to get currently selected filters
// function getSelectedFilters() {
//   // In a real implementation, this would retrieve the selected filters from your app state
//   // For this example, we'll return a mock object
//   return window.selectedFilters || {};
// }

// // Function to update UI with selected filters
// function updateSelectedFiltersUI(selectedFilters) {
//   // Store selected filters
//   window.selectedFilters = selectedFilters;
  
//   // Update UI (implementation depends on your UI design)
//   const selectedFiltersContainer = document.getElementById('selected-filters');
//   selectedFiltersContainer.innerHTML = '';
  
//   Object.entries(selectedFilters).forEach(([type, value]) => {
//     const filterTag = document.createElement('div');
//     filterTag.className = 'filter-tag';
//     filterTag.textContent = `${type}: ${value}`;
    
//     const removeButton = document.createElement('span');
//     removeButton.className = 'remove-filter';
//     removeButton.textContent = '×';
//     removeButton.addEventListener('click', () => {
//       // Remove filter
//       delete selectedFilters[type];
//       updateSelectedFiltersUI(selectedFilters);
//     });
    
//     filterTag.appendChild(removeButton);
//     selectedFiltersContainer.appendChild(filterTag);
//   });
// }

// // Example of integrating with search input
// document.addEventListener('DOMContentLoaded', () => {
//   const searchInput = document.getElementById('search-input');
  
//   searchInput.addEventListener('input', (e) => {
//     handleSearchInput(e.target.value, getSelectedFilters());
//   });
// });

// // Function to fetch and process property data from the API
// async function fetchPropertyData() {
//   try {
//     const response = await fetch('/api/properties');
//     const properties = await response.json();
    
//     // Populate our suggestion data
//     populateSuggestionData(properties);
//   } catch (error) {
//     console.error('Error fetching property data:', error);
//   }
// }

// // Initialize the suggestion system
// function initSuggestionSystem() {
//   // Fetch property data
//   fetchPropertyData();
  
//   // Set up initial UI
//   window.selectedFilters = {};
//   updateSelectedFiltersUI({});
// }

// // Call initialization function
// initSuggestionSystem();