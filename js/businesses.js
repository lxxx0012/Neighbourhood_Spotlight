document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('../data/businesses.json').then(response => response.json()),
        fetch('../data/neighbourhoods.json').then(response => response.json())
    ])
    .then(([businessesData, neighbourhoodsData]) => {
        const businessCardsContainer = document.querySelector('.business-cards');
        if (businessCardsContainer) {
            // Create a map of neighbourhood IDs to names for easy lookup
            const neighbourhoodMap = {};
            neighbourhoodsData.forEach(neighbourhood => {
                neighbourhoodMap[neighbourhood.id] = neighbourhood.name;
            });

            businessesData.forEach(business => {
                const card = document.createElement('div');
                card.classList.add('business-card');
                card.dataset.id = business.id;

                const title = document.createElement('h3');
                title.textContent = business.name;

                const category = document.createElement('p');
                category.classList.add('category');
                category.textContent = business.category;

                const neighbourhood = document.createElement('p');
                neighbourhood.classList.add('neighbourhood');
                neighbourhood.textContent = `Neighbourhood: ${neighbourhoodMap[business.neighbourhoodId] || 'Unknown'}`;

                const link = document.createElement('a');
                link.href = `business-detail.html?id=${business.id}`;
                link.textContent = 'View Details';

                card.appendChild(title);
                card.appendChild(category);
                card.appendChild(neighbourhood);
                card.appendChild(link);

                businessCardsContainer.appendChild(card);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});