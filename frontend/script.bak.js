// we use an array to represent lat, lng
//  index 0 is the lat, index 1 is lng
const coordinate = [1.3521, 103.8198];

// the parameter is the id that will contain the map
const map = L.map("map");
// the first parameter is the center point of the map
// the second parameter is the zoom level (larger = more zoomed in)
map.setView(coordinate, 13);

const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    referrerPolicy: 'strict-origin-when-cross-origin'  // prevent from being blocked
});
// a layer is one "thing" being drawn
tileLayer.addTo(map); 

const marker = L.marker([1.35019, 103.99400]);
marker.bindPopup(`<h1>Welcome to Singapore</h1>`);
marker.addTo(map);