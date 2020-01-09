import React from "react";
import GoogleMapReact from "google-map-react";
import MAPS_API_KEY from "../api_keys";

const Map = ({ height, width }) => {
    return (
        <div style={{ height: height || "100%", width: width || "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={MAPS_API_KEY}
                defaultCenter={{ lat: 60, lng: 30 }}
                defaultZoom={11}
            ></GoogleMapReact>
        </div>
    );
};

export default Map;
