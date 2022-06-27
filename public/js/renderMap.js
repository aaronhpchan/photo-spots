mapboxgl.accessToken = mapBoxToken; // mapBoxToken variable comes from details.ejs file
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: spot.geometry.coordinates, // mapBoxToken variable comes from details.ejs file; starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: 'rgb(168 85 247)' })
    .setLngLat(spot.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h2 class="text-base font-semibold">${spot.title}</h2><p>${spot.location}<p>`)) // add popup
    .addTo(map);

