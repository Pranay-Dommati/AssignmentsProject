import React, { useState, useEffect, useCallback } from "react";
import "../styles/location-search.css";


const LocationSearch = ({ onSelectLocation }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    // Create a function to load the Google Maps script
    const loadGoogleMapsScript = useCallback(() => {
        return new Promise((resolve, reject) => {
            // If already loaded, resolve immediately
            if (window.google && window.google.maps) {
                resolve(window.google);
                return;
            }

            // If script is already being loaded, wait for it
            const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.google));
                existingScript.addEventListener('error', () => reject(new Error('Google Maps load failed')));
                return;
            }

            // Create and load the script
            const script = document.createElement("script");
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDS99B9V5AsT4YPZmkc80PMjPZ07dZ3s-A&libraries=places&callback=initMap`;
            script.async = true;
            script.defer = true;

            // Define the callback function
            window.initMap = () => {
                resolve(window.google);
            };

            script.addEventListener('error', () => {
                reject(new Error('Google Maps load failed'));
            });

            document.head.appendChild(script);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initializeGoogleMaps = async () => {
            try {
                await loadGoogleMapsScript();
                if (isMounted) {
                    setGoogleLoaded(true);
                }
            } catch (error) {
                if (isMounted) {
                    setLoadError("Failed to load Google Maps API");
                    setGoogleLoaded(false);
                }
            }
        };

        initializeGoogleMaps();

        return () => {
            isMounted = false;
        };
    }, [loadGoogleMapsScript]);

    const fetchLocations = useCallback((searchQuery) => {
        if (!searchQuery || !googleLoaded || !window.google?.maps) return;

        const service = new window.google.maps.places.AutocompleteService();
        
        service.getPlacePredictions(
            {
                input: searchQuery,
                componentRestrictions: { country: 'IN' },
                types: ['geocode']
            },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [googleLoaded]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length >= 3) {
                fetchLocations(query);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, fetchLocations]);

    const handleSelectLocation = (place) => {
        if (!window.google?.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ placeId: place.place_id }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                const location = {
                    name: place.description,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                onSelectLocation(location);
                setQuery("");
                setSuggestions([]);
            }
        });
    };

    if (loadError) {
        return <div className="error-message">{loadError}</div>;
    }

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
                    {suggestions.map((place) => (
                        <li
                            key={place.place_id}
                            className="suggestion-item"
                            onClick={() => handleSelectLocation(place)}
                        >
                            {place.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearch;