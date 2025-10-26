document.addEventListener('DOMContentLoaded', () => {
    // Fetch featured neighbourhoods
    fetch('data/neighbourhoods.json')
        .then(response => response.json())
        .then(data => {
            const featuredContainer = document.getElementById('featured-neighbourhoods-container');
            if (featuredContainer && data.length > 0) {
                // Display the first 5 neighbourhoods as featured
                const featured = data.slice(0, 5);
                featured.forEach(neighbourhood => {
                    const link = document.createElement('a');
                    link.href = `neighbourhoods.html#${neighbourhood.id}`; // Link to the full neighbourhoods page, maybe anchor to the specific section
                    link.textContent = neighbourhood.name;
                    featuredContainer.appendChild(link);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching featured neighbourhoods:', error);
        });

    // We'll add the featured businesses logic here in the next step
    fetch('data/businesses.json')
        .then(response => response.json())
        .then(data => {
            const featuredBusinessesContainer = document.getElementById('featured-businesses-container');
            if (featuredBusinessesContainer && data.length > 0) {
                const featuredBusinesses = data.slice(0, 5);
                featuredBusinesses.forEach(business => {
                    const businessItem = document.createElement('div');
                    businessItem.classList.add('business-item');
                    businessItem.textContent = business.name;
                    featuredBusinessesContainer.appendChild(businessItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching featured businesses:', error);
        });
});