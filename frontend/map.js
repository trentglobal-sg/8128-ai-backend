function initMap(lat, lng, mapElementID) {
    const coordinate = [lat, lng];
    const map = L.map(mapElementID);
    map.setView(coordinate, 13);

    console.log(L.gridLayer)
    const googleLayer = L.gridLayer.googleMutant({
        type: "roadmap"
    });
    googleLayer.addTo(map);

    // a layer group is a layer that can contain other layers
    // one layer = one graphics (marker, rectangle)
    // the search result layer will be displayed all the markers for each search result
    const searchResultLayer = L.layerGroup();
    searchResultLayer.addTo(map);

    return {
        map, searchResultLayer, googleLayer
    }
}
/**
 * 
 * @param {{map, searchResultLayer, googleLayer}} mapConfig
 * @param {{
 * locations:[*]
 * groundingSupport:[*]}} results 
 */
function displayResults(mapConfig, results) {
    const locations = results.locations;
    for (let l of locations.locations) {
        const marker = L.marker([l.lat, l.lng]);
        marker.bindPopup(`
                <h1>${l.name}</h1>
                <ul>
                <li>Address: ${l.address}</li>
                <li>description: ${l.description}</li>
                </ul>
            `)
        marker.addTo(mapConfig.searchResultLayer)
    }
}