document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const neighbourhoodId = urlParams.get('id');

    if (neighbourhoodId) {
        fetch('../data/neighbourhoods.json')
            .then(response => response.json())
            .then(data => {
                const neighbourhood = data.find(n => n.id === neighbourhoodId);

                if (neighbourhood) {
                    document.getElementById('neighbourhood-name').textContent = neighbourhood.name;
                    document.getElementById('neighbourhood-description').textContent = neighbourhood.description;

                    const landmarksList = document.getElementById('neighbourhood-landmarks');
                    landmarksList.innerHTML = ''; // Clear any existing list items
                    neighbourhood.landmarks.forEach(landmark => {
                        const listItem = document.createElement('li');
                        if (typeof landmark === 'object' && landmark.name && landmark.url) {
                            const landmarkLink = document.createElement('a');
                            landmarkLink.href = landmark.url;
                            landmarkLink.textContent = landmark.name;
                            landmarkLink.target = '_blank'; // Open in a new tab
                            listItem.appendChild(landmarkLink);
                        } else {
                            listItem.textContent = typeof landmark === 'object' ? landmark.name : landmark;
                        }
                        landmarksList.appendChild(listItem);
                    });

                    const neighbourhoodMapContainer = document.getElementById('neighbourhood-map-container');

                    if (neighbourhoodMapContainer && neighbourhood.latitude && neighbourhood.longitude) {
                        const map = L.map(neighbourhoodMapContainer).setView([neighbourhood.latitude, neighbourhood.longitude], 10);

                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);

                        if (neighbourhood.boundary) {
                            L.geoJSON(neighbourhood.boundary).addTo(map);
                        } else {
                            L.marker([neighbourhood.latitude, neighbourhood.longitude]).addTo(map)
                                .bindPopup(`You are viewing the area of ${neighbourhood.name || 'this neighbourhood'}`).openPopup();
                        }

                        // Fetch and display local businesses
                        fetch('../data/businesses.json') // Adjust path if needed
                            .then(response => response.json())
                            .then(businessesData => {
                                const localBusinesses = businessesData.filter(business => business.neighbourhoodId === neighbourhood.id);
                                const businessesList = document.getElementById('neighbourhood-businesses-list');
                                businessesList.innerHTML = ''; // Clear any existing list

                                if (localBusinesses.length > 0) {
                                    localBusinesses.forEach(business => {
                                        const listItem = document.createElement('li');
                                        const businessLink = document.createElement('a');
                                        businessLink.href = `business-detail.html?id=${encodeURIComponent(business.id)}`;
                                        businessLink.textContent = business.name;
                                        listItem.appendChild(businessLink);
                                        businessesList.appendChild(listItem);

                                        // Add a marker for each business
                                        L.marker([business.latitude, business.longitude]).addTo(map)
                                        .bindPopup(`<a href="business-detail.html?id=${encodeURIComponent(business.id)}">${business.name}</a>`) // Link to business detail
                                        .openPopup();
                                    });
                                } else {
                                    const listItem = document.createElement('li');
                                    listItem.textContent = 'No local businesses found in this neighbourhood.';
                                    businessesList.appendChild(listItem);
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching businesses data:', error);
                                const businessesList = document.getElementById('neighbourhood-businesses-list');
                                const listItem = document.createElement('li');
                                listItem.textContent = 'Error loading local businesses.';
                                businessesList.appendChild(listItem);
                            });

                    } else {
                        console.error('Neighbourhood map container element not found or neighbourhood coordinates are missing.');
                    }

                } else {
                    document.getElementById('neighbourhood-detail').innerHTML = '<p>Neighbourhood not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching neighbourhood data:', error);
                document.getElementById('neighbourhood-detail').innerHTML = '<p>Error loading neighbourhood data.</p>';
            });
    } else {
        document.getElementById('neighbourhood-detail').innerHTML = '<p>No neighbourhood selected.</p>';
    }
});