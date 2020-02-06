import React from "react";
import GoogleMapReact from "google-map-react";
import { MAPS_API_KEY } from "../api_keys";

const Map = ({ height, width }) => {
    const renderMarkers = (map, maps) => {
        const marker = new maps.Marker({
            position: { lat: 62.14478, lng: 25.467761 },
            title: "The place to be",
            map
        });
        return marker;
    };

    return (
        <div style={{ height: height || "100%", width: width || "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={MAPS_API_KEY}
                defaultCenter={{ lat: 62.14478, lng: 25.467761 }}
                defaultZoom={12}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
            ></GoogleMapReact>
        </div>
    );
};

export default Map;
