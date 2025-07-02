import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ContactMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    // Define coordinates as tuples with exactly two elements [lng, lat]
    const bangaloreCoordinates: [number, number] = [77.6107, 13.0031]; // Bangalore coordinates

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: bangaloreCoordinates,
      zoom: 14,
    });

    // Add marker at Frazer Town
    const frazerTownCoordinates: [number, number] = [77.6128, 13.0061]; // Approximate coordinates for Frazer Town

    new mapboxgl.Marker({ color: "#1E6F5C" })
      .setLngLat(frazerTownCoordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>Hijama Healing</strong><p>Paramount Avenue, 63/1, 3rd floor,<br>Mosque Road Cross, Frazer Town,<br>Bangalore 560005</p>`,
        ),
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="w-full">
      {!mapboxToken ? (
        <div className="mb-4">
          <label
            htmlFor="mapbox-token"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Mapbox Public Token to Display Map
          </label>
          <div className="flex">
            <input
              type="text"
              id="mapbox-token"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="Enter your Mapbox public token"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <button
              className="bg-brand-green text-white px-4 py-2 rounded-r-md hover:bg-brand-green/90"
              onClick={() => {
                if (mapboxToken) {
                  console.log("Map token set");
                }
              }}
            >
              Set
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You can get a free token at{" "}
            <a
              href="https://www.mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      ) : null}

      <div
        ref={mapContainer}
        className={`w-full h-64 rounded-lg border border-gray-300 ${!mapboxToken ? "bg-gray-100 flex items-center justify-center" : ""}`}
      >
        {!mapboxToken && (
          <p className="text-gray-500">Enter Mapbox token to display map</p>
        )}
      </div>
    </div>
  );
};

export default ContactMap;
