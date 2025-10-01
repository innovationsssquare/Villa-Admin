import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";



const MapPicker = ({ coordinates, onCoordinatesChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    isMountedRef.current = true;
    if (!apiKey) {
      setError("Google Maps API key is required");
      setIsLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
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

    const initMap = () => {
      if (!mapRef.current || !window.google || !isMountedRef.current) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: coordinates[1], lng: coordinates[0] },
          zoom: 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: { lat: coordinates[22], lng: coordinates[77] },
          map: map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            onCoordinatesChange([position.lng(), position.lat()]);
          }
        });

        map.addListener("click", (e) => {
          if (e.latLng) {
            marker.setPosition(e.latLng);
            onCoordinatesChange([e.latLng.lng(), e.latLng.lat()]);
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map");
      }
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

      
      // Clear the map container to prevent React from trying to remove Google Maps' nodes
    //   if (mapRef.current) {
    //     try {
    //       mapRef.current.innerHTML = '';
    //     } catch (err) {
    //       // Silently handle cleanup errors
    //     }
    //   }
    };
  }, [apiKey]);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newPos = { lat: coordinates[1], lng: coordinates[0] };
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={coordinates[0]}
            onChange={(e) =>
              onCoordinatesChange([parseFloat(e.target.value) || 0, coordinates[1]])
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={coordinates[1]}
            onChange={(e) =>
              onCoordinatesChange([coordinates[0], parseFloat(e.target.value) || 0])
            }
          />
        </div>
      </div>
      
     <div className="relative w-full h-[300px] rounded-lg border border-border bg-muted">
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  )}
  {/* Map container (React won’t touch this) */}
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