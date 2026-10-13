import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Default coordinates: Lonavala, Maharashtra (lng, lat)
const DEFAULT_LNG = 73.4149859407758;
const DEFAULT_LAT = 18.754284332995855;

const getSafeLatLng = (coords) => {
  const rawLng = Array.isArray(coords) ? Number(coords[0]) : NaN;
  const rawLat = Array.isArray(coords) ? Number(coords[1]) : NaN;
  const lng = Number.isFinite(rawLng) ? rawLng : DEFAULT_LNG;
  const lat = Number.isFinite(rawLat) ? rawLat : DEFAULT_LAT;
  return { lat, lng };
};

const MapPicker = ({ coordinates, onCoordinatesChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    isMountedRef.current = true;
    if (!apiKey) {
      setError("Google Maps API key is required");
      setIsLoading(false);
      return;
    }

    const initMap = () => {
      if (!mapRef.current || !window.google || !isMountedRef.current) return;

      try {
        const { lat, lng } = getSafeLatLng(coordinates);
        const position = { lat, lng };

        const map = new window.google.maps.Map(mapRef.current, {
          center: position,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (pos && typeof onCoordinatesChange === "function") {
            onCoordinatesChange([pos.lng(), pos.lat()]);
          }
        });

        map.addListener("click", (e) => {
          if (e.latLng) {
            marker.setPosition(e.latLng);
            if (typeof onCoordinatesChange === "function") {
              onCoordinatesChange([e.latLng.lng(), e.latLng.lat()]);
            }
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map");
      }
    };

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoading(false);
        initMap();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com"]`
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          setIsLoading(false);
          initMap();
        });
        return;
      }

      // Load the script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoading(false);
        initMap();
      };
      script.onerror = () => {
        setError("Failed to load Google Maps. Please check your API key.");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      isMountedRef.current = false;

      if (markerRef.current) {
        try {
          if (window.google && window.google.maps) {
            markerRef.current.setMap(null);
          }
        } catch (err) {}
        markerRef.current = null;
      }

      if (mapInstanceRef.current) {
        try {
          if (window.google && window.google.maps) {
            window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
          }
        } catch (err) {}
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const { lat, lng } = getSafeLatLng(coordinates);
      const newPos = { lat, lng };
      markerRef.current.setPosition(newPos);
      mapInstanceRef.current.setCenter(newPos);
    }
  }, [coordinates]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const { lat: safeLat, lng: safeLng } = getSafeLatLng(coordinates);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={coordinates?.[0] ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (typeof onCoordinatesChange === "function") {
                onCoordinatesChange([Number.isFinite(val) ? val : 0, safeLat]);
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={coordinates?.[1] ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (typeof onCoordinatesChange === "function") {
                onCoordinatesChange([safeLng, Number.isFinite(val) ? val : 0]);
              }
            }}
          />
        </div>
      </div>

      <div className="relative w-full h-[300px] rounded-lg border border-border bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground">Loading map...</div>
          </div>
        )}
        {/* Map container */}
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ position: "relative" }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Click on the map or drag the marker to set coordinates
      </p>
    </div>
  );
};

export default MapPicker;