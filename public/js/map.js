
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl()); // for full screen
map.addControl(new mapboxgl.NavigationControl()); // nav control

const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(/images/homeicon.png)';
el.style.backgroundSize = 'cover';
el.style.width = '50px';
el.style.height = '50px';
el.style.cursor = 'pointer';
el.style.opacity = '0.75rem';

const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25,anchor: 'top' })
    .setHTML("<p>Designed & Developed by <b>Aman Memon &hearts; !</b></p>"))
    .addTo(map);


