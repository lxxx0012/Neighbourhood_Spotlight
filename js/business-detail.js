document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id');

    if (businessId) {
        fetch('../data/businesses.json') // Adjust path if needed
            .then(response => response.json())
            .then(businessData => {
                const business = businessData.find(b => b.id === businessId);

                if (business) {
                    document.getElementById('business-name').textContent = business.name;
                    document.getElementById('business-description').textContent = business.description;
                    document.getElementById('business-address').textContent = business.address; // Assuming you have an address field
                    document.getElementById('business-category').textContent = business.category;
                    document.getElementById('business-neighbourhood').textContent = business.neighbourhood;

                    // *** START CONTACT INFO CODE ***
                    const contactElement = document.getElementById('business-contact');
                    if (business.contact) {
                        contactElement.textContent = business.contact;
                    } else {
                        contactElement.textContent = 'Contact information not available.';
                    }

                    const websiteElement = document.getElementById('business-website');
                    if (business.website) {
                        const websiteLink = document.createElement('a');
                        websiteLink.href = business.website;
                        websiteLink.textContent = 'Visit Website';
                        websiteLink.target = '_blank'; // Open in a new tab
                        websiteElement.appendChild(websiteLink);
                    } else {
                        websiteElement.textContent = 'Website not available.';
                    }
                    // *** END CONTACT INFO CODE ***

                    // *** START IMAGE GALLERY CODE ***
                    if (business.images && business.images.length > 0) {
                        const galleryContainer = document.querySelector('.gallery-container');

                        business.images.forEach(imageUrl => { // Loop through each image URL
                            const img = document.createElement('img');
                            img.src = imageUrl; // Use the current imageUrl from the array
                            img.classList.add('gallery-image');
                            galleryContainer.appendChild(img);
                        });
                    }
                    // *** END IMAGE GALLERY CODE ***

                    const businessMapContainer = document.getElementById('business-map-container');

                    if (businessMapContainer && business.latitude && business.longitude) {
                        const map = L.map(businessMapContainer).setView([business.latitude, business.longitude], 15); // Adjust zoom

                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);

                        // Add a market with a popup for the business
                        L.marker([business.latitude, business.longitude]).addTo(map)
                            .bindPopup(`${business.name}</b><br>${business.address}`) // Customize popup content
                            .openPopup();
                    } else {
                        console.error('Business map container not found or coordinates missing.');
                    }

                } else {
                    document.getElementById('business-detail').innerHTML = '<p>Business not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching business data:', error);
                document.getElementById('business-detail').innerHTML = '<p>Error loading business data.</p>';
            });
    } else {
        document.getElementById('business-detail').innerHTML = '<p>No business selected.</p>';
    }
});