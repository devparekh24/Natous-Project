/* eslint-disable */
const locatios = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locatios)

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2MDM4IiwiYSI6ImNsb2d1ZmpqdTB6anMycW8zdnV2OGU5cm8ifQ.-dXmXJsE7o0f2A_-COtM5A';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dev038/cloh4z1l8000j01pbap452lxn', // style URL
    scrollZoom: false,
    // center: [-74.5, 40], // starting position [lng, lat]
    // zoom: 9, // starting zoom
});


const bound = new mapboxgl.LngLatBounds()

locatios.forEach(loc => {
    //create marker
    const el = document.createElement('div')
    el.className = 'marker'

    //adding marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates)
        .addTo(map)

    //add popup msg
    new mapboxgl.Popup({ offset: 30 }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)

    //extends map bounds to include current location
    bound.extend(loc.coordinates);
});

map.fitBounds(bound, {
    padding: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
    }
})