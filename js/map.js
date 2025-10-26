window.addEventListener('load', () => {
    console.log("Leaflet object (on window load):", typeof L);

    const mapContainer = document.getElementById('map-container');

    if (mapContainer) {
        const newmarketCoordinates = [44.0520, -79.4674];
        const map = L.map('map-container').setView(newmarketCoordinates, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        console.error('Map container element not found.');
    }
});