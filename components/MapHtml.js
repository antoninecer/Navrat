import React from "react";
export default function MapHtml({
  latitude,
  longitude,
  zoom,
  points,
  returnPoint,
}) {
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <style>
        #map {
          width: 100%;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], ${zoom});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        var currentIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        var returnIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        var interestIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        var selectedInterestIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        var currentLocationMarker = L.marker([${latitude}, ${longitude}], {icon: currentIcon}).addTo(map);
        currentLocationMarker.bindPopup("<b>You are here!</b>").openPopup();
        ${
          returnPoint
            ? `var returnPointMarker = L.marker([${returnPoint.latitude}, ${returnPoint.longitude}], {icon: returnIcon}).addTo(map);
               returnPointMarker.bindPopup("<b>${returnPoint.title}</b>").openPopup();`
            : ""
        }
        ${points
          .map(
            (point, index) => `
          var marker${index} = L.marker([${point.location.latitude}, ${
              point.location.longitude
            }], {icon: interestIcon}).addTo(map);
          marker${index}.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              markerIndex: ${index},
              point: {
                latitude: ${point.location.latitude},
                longitude: ${point.location.longitude},
                description: "${point.description}",
                details: "${point.details || ""}",
                image: "${point.image || ""}"
              }
            }));
          });
        `
          )
          .join("")}
      </script>
    </body>
    </html>
  `;
  return leafletHtml;
}
