

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

export const PropertySearchSuggestions = () => {
  // State management
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [suggestionData, setSuggestionData] = useState({
    cities: new Set(),
    localities: new Set(),
    sectors: new Set(),
    projectNames: new Set(),
    propertyTypes: new Set(),
    apartmentTypes: new Set(),
    bhkTypes: new Set(), // New: BHK types
    // Combined suggestions
    combinedLocations: new Set(),
    advancedCombinations: new Set(),
    bhkCombinations: new Set() // New: BHK-specific combinations
  });
  
  const suggestionsRef = useRef(null);
  
  // Fetch property data from API
  useEffect(() => {
    const fetchPropertyData = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.propertydekho247.com/post/all-property/');
        const properties = await response.json();
        setPropertyData(properties?.properties);
        populateSuggestionData(properties?.properties);
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyData(); // Uncomment when API is ready
    
    // Add sample data for testing
    
  }, []);
  
  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const results = getSuggestions(query, selectedFilters);
    setSuggestions(results);
  }, [query, selectedFilters]);
  
  // Populate suggestion data from property list
  const populateSuggestionData = (properties) => {
    const newSuggestionData = {
      cities: new Set(),
      localities: new Set(),
      sectors: new Set(),
      projectNames: new Set(),
      propertyTypes: new Set(),
      apartmentTypes: new Set(),
      bhkTypes: new Set(), // New: store BHK types
      combinedLocations: new Set(),
      advancedCombinations: new Set(),
      bhkCombinations: new Set() // New: BHK-specific combinations
    };
    
    properties.forEach(property => {
      // Extract location values
      const city = property.LocationDetails?.City;
      const locality = property.LocationDetails?.Locality;
      const sector = property.LocationDetails?.Landmark;
      const projectName = property.LocationDetails?.ProjectName;
      
      // Extract property type values
      const propertyType = property.BasicDetails?.PropertyType;
      const apartmentType = property.BasicDetails?.ApartmentType;
      const bedrooms = property.BasicDetails?.Bedrooms;
      
      // Add individual values to sets
      if (city) newSuggestionData.cities.add(city);
      if (locality) newSuggestionData.localities.add(locality);
      if (sector) newSuggestionData.sectors.add(sector);
      if (projectName) newSuggestionData.projectNames.add(projectName);
      if (propertyType) newSuggestionData.propertyTypes.add(propertyType);
      if (apartmentType) newSuggestionData.apartmentTypes.add(apartmentType);
      
      // Add BHK types if bedrooms exist
      if (bedrooms) {
        const bhkLabel = `${bedrooms} BHK`;
        newSuggestionData.bhkTypes.add(bhkLabel);
        
        // Create BHK specific combinations
        if (apartmentType) {
          // BHK + Apartment Type (e.g., "3 BHK Apartment")
          newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType}`);
          
          // BHK + Apartment Type + City (e.g., "3 BHK Apartment in Gurgaon")
          if (city) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${city}`);
          }
          
          // BHK + Apartment Type + Locality (e.g., "3 BHK Apartment in New Gurgaon")
          if (locality) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${locality}`);
          }
          
          // BHK + Apartment Type + Sector (e.g., "3 BHK Apartment in Sector 82 A")
          if (sector) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${sector}`);
          }
          
          // BHK + Apartment Type + Project Name (e.g., "3 BHK Apartment in DLF The Primus")
          if (projectName) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${projectName}`);
          }
          
          // BHK + Apartment Type + Locality + City (e.g., "3 BHK Apartment in New Gurgaon, Gurgaon")
          if (locality && city) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${locality}, ${city}`);
          }
          
          // BHK + Apartment Type + Sector + City (e.g., "3 BHK Apartment in Sector 82 A, Gurgaon")
          if (sector && city) {
            newSuggestionData.bhkCombinations.add(`${bhkLabel} ${apartmentType} in ${sector}, ${city}`);
          }
          
          // BHK + Property Status combinations (e.g., "Ready to move 3 BHK Apartment")
          if (property.BasicDetails?.PropertyStatus) {
            const status = property.BasicDetails.PropertyStatus;
            newSuggestionData.bhkCombinations.add(`${status} ${bhkLabel} ${apartmentType}`);
            
            // With location
            if (city) {
              newSuggestionData.bhkCombinations.add(`${status} ${bhkLabel} ${apartmentType} in ${city}`);
            }
            
            if (sector) {
              newSuggestionData.bhkCombinations.add(`${status} ${bhkLabel} ${apartmentType} in ${sector}`);
            }
            
            if (locality) {
              newSuggestionData.bhkCombinations.add(`${status} ${bhkLabel} ${apartmentType} in ${locality}`);
            }
          }
        }
        
        // Create additional plain BHK combinations without apartment type
        if (city) {
          newSuggestionData.bhkCombinations.add(`${bhkLabel} in ${city}`);
        }
        
        if (locality) {
          newSuggestionData.bhkCombinations.add(`${bhkLabel} in ${locality}`);
        }
        
        if (sector) {
          newSuggestionData.bhkCombinations.add(`${bhkLabel} in ${sector}`);
        }
      }
      
      // Create basic location combinations
      if (sector && city) {
        newSuggestionData.combinedLocations.add(`${sector} ${city}`);
      }
      
      if (locality && city) {
        newSuggestionData.combinedLocations.add(`${locality} ${city}`);
      }
      
      if (sector && locality) {
        newSuggestionData.combinedLocations.add(`${sector} ${locality}`);
      }
      
      if (projectName && city) {
        newSuggestionData.combinedLocations.add(`${projectName} ${city}`);
      }
      
      if (projectName && sector) {
        newSuggestionData.combinedLocations.add(`${projectName} ${sector}`);
      }
      
      // Property type combinations
      if (apartmentType) {
        // Add natural language combinations
        if (city) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} in ${city}`);
        }
        
        if (locality) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} in ${locality}`);
        }
        
        if (sector) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} in ${sector}`);
        }
        
        if (locality && city) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} in ${locality}, ${city}`);
        }
        
        // Apartment Type + Sector + City (e.g., "Apartment Sector 82 A Gurgaon")
        if (sector && city) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} ${sector} ${city}`);
        }
        
        // Apartment Type + Project Name (e.g., "Apartment DLF The Primus")
        if (projectName) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} ${projectName}`);
        }
        
        // Apartment Type + Locality + City (e.g., "Apartment New Gurgaon Gurgaon")
        if (locality && city) {
          newSuggestionData.advancedCombinations.add(`${apartmentType} ${locality} ${city}`);
        }
      }
      
      if (propertyType) {
        // Add natural language combinations
        if (city) {
          newSuggestionData.advancedCombinations.add(`${propertyType} property in ${city}`);
        }

        if (locality) {
          newSuggestionData.advancedCombinations.add(`${propertyType} property in ${locality}`);
        }
        
        if (sector) {
          newSuggestionData.advancedCombinations.add(`${propertyType} property in ${sector}`);
        }
        
        // Property Type + Sector + City (e.g., "Residential Sector 82 A Gurgaon")
        if (sector && city) {
          newSuggestionData.advancedCombinations.add(`${propertyType} ${sector} ${city}`);
        }
        
        // Property Type + Project Name (e.g., "Residential DLF The Primus")
        if (projectName) {
          newSuggestionData.advancedCombinations.add(`${propertyType} ${projectName}`);
        }
      }
      
      // Three-part combinations including sector, project, and city
      if (projectName && sector && city) {
        newSuggestionData.advancedCombinations.add(`${projectName} ${sector} ${city}`);
      }
      
      // Very advanced combinations with apartment type, project, sector, and city
      if (apartmentType && projectName && sector && city) {
        newSuggestionData.advancedCombinations.add(`${apartmentType} ${projectName} ${sector} ${city}`);
      }
      
      // Property type, apartment type, sector, city combinations
      if (propertyType && apartmentType && sector && city) {
        newSuggestionData.advancedCombinations.add(`${propertyType} ${apartmentType} ${sector} ${city}`);
      }
      
      // Natural language search phrases for properties
      if (propertyType && city) {
        newSuggestionData.advancedCombinations.add(`${propertyType} properties for sale in ${city}`);
        newSuggestionData.advancedCombinations.add(`${propertyType} properties to buy in ${city}`);
      }
      
      if (apartmentType && city) {
        newSuggestionData.advancedCombinations.add(`${apartmentType} for sale in ${city}`);
        newSuggestionData.advancedCombinations.add(`${apartmentType} to buy in ${city}`);
      }
      
      if (property.BasicDetails?.PropertyStatus) {
        const status = property.BasicDetails.PropertyStatus;
        if (city) {
          newSuggestionData.advancedCombinations.add(`${status} properties in ${city}`);
        }
        
        if (apartmentType && city) {
          newSuggestionData.advancedCombinations.add(`${status} ${apartmentType} in ${city}`);
        }
      }
    });
    
    setSuggestionData(prevData => {
      const mergedData = { ...prevData };
      Object.keys(newSuggestionData).forEach(key => {
        mergedData[key] = new Set([...prevData[key], ...newSuggestionData[key]]);
      });
      return mergedData;
    });
  };
  
  // Get suggestions based on user input and already selected values
  const getSuggestions = (query, selectedFilters) => {
    if (!query || query.trim() === '') return [];
    
    query = query.toLowerCase().trim();
    const exactStartMatchResults = [];
    const containsMatchResults = [];
    
    // Function to check if a suggestion starts with the query
    const startsWithQuery = (text) => {
      return text.toLowerCase().startsWith(query);
    };
    
    // Function to check if a suggestion contains the query but doesn't start with it
    const containsQuery = (text) => {
      return text.toLowerCase().includes(query) && !text.toLowerCase().startsWith(query);
    };
    
    // First check BHK combinations
    Array.from(suggestionData.bhkCombinations).forEach(combination => {
      // Check if any part of this combination is already selected
      const combinationParts = combination.split(' ');
      let alreadySelected = false;
      
      for (const part of combinationParts) {
        if (Object.values(selectedFilters).some(filter => 
          filter.toLowerCase() === part.toLowerCase()
        )) {
          alreadySelected = true;
          break;
        }
      }
      
      if (!alreadySelected) {
        if (startsWithQuery(combination)) {
          exactStartMatchResults.push({
            value: combination,
            type: 'bhkCombination',
            display: `${combination}`
          });
        } else if (containsQuery(combination)) {
          containsMatchResults.push({
            value: combination,
            type: 'bhkCombination',
            display: `${combination}`
          });
        }
      }
    });
    
    // Then check advanced combinations
    Array.from(suggestionData.advancedCombinations).forEach(combination => {
      // Check if any part of this combination is already selected
      const combinationParts = combination.split(' ');
      let alreadySelected = false;
      
      for (const part of combinationParts) {
        if (Object.values(selectedFilters).some(filter => 
          filter.toLowerCase() === part.toLowerCase()
        )) {
          alreadySelected = true;
          break;
        }
      }
      
      if (!alreadySelected) {
        if (startsWithQuery(combination)) {
          exactStartMatchResults.push({
            value: combination,
            type: 'advancedCombination',
            display: `${combination}`
          });
        } else if (containsQuery(combination)) {
          containsMatchResults.push({
            value: combination,
            type: 'advancedCombination',
            display: `${combination}`
          });
        }
      }
    });
    
    // Then check combined location suggestions
    Array.from(suggestionData.combinedLocations).forEach(location => {
      // Check if any part of this combined location is already selected
      const locationParts = location.split(' ');
      let alreadySelected = false;
      
      for (const part of locationParts) {
        if (Object.values(selectedFilters).some(filter => 
          filter.toLowerCase() === part.toLowerCase()
        )) {
          alreadySelected = true;
          break;
        }
      }
      
      if (!alreadySelected) {
        if (startsWithQuery(location)) {
          exactStartMatchResults.push({
            value: location,
            type: 'combinedLocation',
            display: `${location}`
          });
        } else if (containsQuery(location)) {
          containsMatchResults.push({
            value: location,
            type: 'combinedLocation',
            display: `${location}`
          });
        }
      }
    });
    
    // Add BHK types
    if (!selectedFilters.bhkType) {
      Array.from(suggestionData.bhkTypes).forEach(bhkType => {
        if (startsWithQuery(bhkType)) {
          exactStartMatchResults.push({
            value: bhkType,
            type: 'bhkType',
            display: `${bhkType}`
          });
        } else if (containsQuery(bhkType)) {
          containsMatchResults.push({
            value: bhkType,
            type: 'bhkType',
            display: `${bhkType}`
          });
        }
      });
    }
    
    // Then add individual field suggestions
    if (!selectedFilters.city) {
      Array.from(suggestionData.cities).forEach(city => {
        if (startsWithQuery(city)) {
          exactStartMatchResults.push({
            value: city,
            type: 'city',
            display: `City: ${city}`
          });
        } else if (containsQuery(city)) {
          containsMatchResults.push({
            value: city,
            type: 'city',
            display: `City: ${city}`
          });
        }
      });
    }
    
    if (!selectedFilters.locality) {
      Array.from(suggestionData.localities).forEach(locality => {
        if (startsWithQuery(locality)) {
          exactStartMatchResults.push({
            value: locality,
            type: 'locality',
            display: `Locality: ${locality}`
          });
        } else if (containsQuery(locality)) {
          containsMatchResults.push({
            value: locality,
            type: 'locality',
            display: `Locality: ${locality}`
          });
        }
      });
    }
    
    if (!selectedFilters.sector) {
      Array.from(suggestionData.sectors).forEach(sector => {
        if (startsWithQuery(sector)) {
          exactStartMatchResults.push({
            value: sector, 
            type: 'sector',
            display: `Sector: ${sector}`
          });
        } else if (containsQuery(sector)) {
          containsMatchResults.push({
            value: sector, 
            type: 'sector',
            display: `Sector: ${sector}`
          });
        }
      });
    }
    
    if (!selectedFilters.projectName) {
      Array.from(suggestionData.projectNames).forEach(projectName => {
        if (startsWithQuery(projectName)) {
          exactStartMatchResults.push({
            value: projectName,
            type: 'projectName',
            display: `Project: ${projectName}`
          });
        } else if (containsQuery(projectName)) {
          containsMatchResults.push({
            value: projectName,
            type: 'projectName',
            display: `Project: ${projectName}`
          });
        }
      });
    }
    
    if (!selectedFilters.propertyType) {
      Array.from(suggestionData.propertyTypes).forEach(propertyType => {
        if (startsWithQuery(propertyType)) {
          exactStartMatchResults.push({
            value: propertyType,
            type: 'propertyType',
            display: `Property Type: ${propertyType}`
          });
        } else if (containsQuery(propertyType)) {
          containsMatchResults.push({
            value: propertyType,
            type: 'propertyType',
            display: `Property Type: ${propertyType}`
          });
        }
      });
    }
    
    if (!selectedFilters.apartmentType) {
      Array.from(suggestionData.apartmentTypes).forEach(apartmentType => {
        if (startsWithQuery(apartmentType)) {
          exactStartMatchResults.push({
            value: apartmentType,
            type: 'apartmentType',
            display: `Apartment Type: ${apartmentType}`
          });
        } else if (containsQuery(apartmentType)) {
          containsMatchResults.push({
            value: apartmentType,
            type: 'apartmentType',
            display: `Apartment Type: ${apartmentType}`
          });
        }
      });
    }
    
    // Combine results with exact matches first, ensuring at least first 3 are exact matches if available
    const combinedResults = [...exactStartMatchResults, ...containsMatchResults];
    
    // Limit results for performance
    return combinedResults.slice(0, 15); // Increased limit to show more suggestions
  };
  
  // Parse combination into filter components
  const parseCombination = (combination) => {
    const combinationParts = combination.split(' ');
    const newFilters = { ...selectedFilters };
    
    // Check for BHK type
    suggestionData.bhkTypes.forEach(bhkType => {
      if (combination.includes(bhkType)) {
        newFilters.bhkType = bhkType;
      }
    });
    
    // Check for property type
    suggestionData.propertyTypes.forEach(propertyType => {
      if (combination.includes(propertyType)) {
        newFilters.propertyType = propertyType;
      }
    });
    
    // Check for apartment type
    suggestionData.apartmentTypes.forEach(apartmentType => {
      if (combination.includes(apartmentType)) {
        newFilters.apartmentType = apartmentType;
      }
    });
    
    // Check for city
    suggestionData.cities.forEach(city => {
      if (combinationParts.includes(city) || combination.includes(` in ${city}`)) {
        newFilters.city = city;
      }
    });
    
    // Check for sector/landmark - more complex because it might contain spaces
    suggestionData.sectors.forEach(sector => {
      if (combination.includes(sector)) {
        newFilters.sector = sector;
      }
    });
    
    // Check for locality
    suggestionData.localities.forEach(locality => {
      if (combination.includes(locality)) {
        newFilters.locality = locality;
      }
    });
    
    // Check for project name - more complex because it might contain spaces
    suggestionData.projectNames.forEach(project => {
      if (combination.includes(project)) {
        newFilters.projectName = project;
      }
    });
    
    // Check for property status if present in the text
    const statusRegex = /(ready to move|under construction)/i;
    const statusMatch = combination.match(statusRegex);
    if (statusMatch) {
      newFilters.propertyStatus = statusMatch[0].charAt(0).toUpperCase() + statusMatch[0].slice(1);
    }
    
    return newFilters;
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    if (suggestion.type === 'combinedLocation' || suggestion.type === 'advancedCombination' || suggestion.type === 'bhkCombination') {
      // Parse the combined string into its component parts
      const newFilters = parseCombination(suggestion.value);
      setSelectedFilters(newFilters);
    } else {
      // For single value suggestions, just add to filters
      setSelectedFilters(prev => ({
        ...prev,
        [suggestion.type]: suggestion.value
      }));
    }

      
    setQuery('');

    setSuggestions([]);
  };
  useEffect(() => {
    console.log("Updated selectedFilters:", selectedFilters);
    const fetchProppertyData = async () => {
        setIsLoading(true);
        try {
          // Replace with your actual API endpoint
          const response = await axios.get(`https://api.propertydekho247.com/post/allpost?LocationDetails.ProjectName=${selectedFilters?.projectName}&BasicDetails.PropertyAdType=Rent&PropertyDetails.BHKType=&BasicDetails.ApartmentType=${selectedFilters.apartmentType ===undefined ? "":selectedFilters.apartmentType}&BasicDetails.PropertyStatus=&AmenitiesDetails.Furnishing=`);
         
          if(response.data.success){
            alert("data is fetched success fully");
          }
          console.log(response)
        } catch (error) {
          console.error('Error fetching property data:', error);
        } finally {
          setIsLoading(false);
        }
      };
  

          fetchProppertyData(); // Uncomment when API is ready
      
      
    

}, [selectedFilters]);

  // Remove selected filter
  const handleRemoveFilter = (filterType) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType];
      return newFilters;
    });
  };
  
  return (
    <div className="property-search-container">
      <h2>Find Your Dream Property</h2>
      
      {/* Search Input */}
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for properties, locations, projects..."
          className="search-input"
        />
        {isLoading && <span className="loading-indicator">Loading...</span>}
      </div>
      
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="suggestions-container" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.value}-${index}`}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.display}
            </div>
          ))}
        </div>
      )}
      
      {/* Selected Filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="selected-filters-container">
          <div className="selected-filters-header">
            <span>Selected Filters:</span>
            <button onClick={handleRemoveFilter} className="reset-filters-btn">Reset All</button>
          </div>
          <div className="filter-tags">
            {Object.entries(selectedFilters).map(([type, value]) => (
              <div key={type} className="filter-tag">
                <span className="filter-type">{type === 'city' ? 'City' : 
                  type === 'locality' ? 'Locality' : 
                  type === 'sector' ? 'Sector' : 
                  type === 'projectName' ? 'Project' : 
                  type === 'propertyType' ? 'Property Type' : 
                  type === 'apartmentType' ? 'Apartment Type' : type}:</span>
                <span className="filter-value">{value}</span>
                <button
                  onClick={() => handleRemoveFilter(type)}
                  className="remove-filter-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search button */}
      <button className="search-button">
        Search Properties
      </button>
    </div>
  );
};

export default PropertySearchSuggestions;