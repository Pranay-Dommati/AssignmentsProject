import React, { useState, useEffect, useCallback } from "react";
import "../styles/location-search.css"; // Import CSS file for styling

const LocationSearch = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDS99B9V5AsT4YPZmkc80PMjPZ07dZ3s-A&libraries=places`;
        script.async = true;
        script.onload = () => setGoogleLoaded(true);
        document.body.appendChild(script);
      } else {
        setGoogleLoaded(true);
      }
    };
    loadGoogleMaps();
  }, []);

  const fetchLocations = useCallback((query) => {
    if (!query || !googleLoaded) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: query }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      }
    });
  }, [googleLoaded]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchLocations(query), 300);
    return () => clearTimeout(delayDebounce);
  }, [query, fetchLocations]);

  const handleSelect = (place) => {
    onSelectLocation({ name: place.description });
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="location-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a location"
        className="form-control"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((place, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleSelect(place)}>
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
