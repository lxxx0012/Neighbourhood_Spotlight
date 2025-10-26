document.addEventListener("DOMContentLoaded", () => {
    fetch('../data/neighbourhoods.json')
    .then(response => response.json())
    .then(data => {
        const neighbourhoodCardsContainer = document.querySelector('.neighbourhood-cards');
        if (neighbourhoodCardsContainer) {
            data.forEach(neighbourhood => {
                const card = document.createElement('div');
                card.classList.add('neighbourhood-card');
                card.dataset.id = neighbourhood.id;

                const title = document.createElement('h3');
                title.textContent = neighbourhood.name;

                const description = document.createElement('p');
                description.textContent = neighbourhood.description.substring(0, 100) + '...';

                const link = document.createElement('a');
                link.href = `neighbourhood-detail.html?id=${neighbourhood.id}`;
                link.textContent = 'Learn More';

                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(link);

                neighbourhoodCardsContainer.appendChild(card);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching neighbourhoods:', error);
    });
});