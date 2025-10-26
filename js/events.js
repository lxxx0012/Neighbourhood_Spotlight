document.addEventListener('DOMContentLoaded', () => {
    const eventListContainer = document.getElementById('event-list');
    const neighbourhoodFilter = document.getElementById('filter-neighbourhood');
    const categoryFilter = document.getElementById('filter-category');
    const dateFilter = document.getElementById('filter-date');
    const applyFiltersButton = document.getElementById('apply-filters');

    let allEvents = [];
    let neighbourhoodsData = []; // To store fetched neighbourhood data

    // Function to display events with neighbourhood name
    function displayEvents(events) {
        eventListContainer.innerHTML = '';
        if (events.length === 0) {
            eventListContainer.innerHTML = '<p>No events found matching your criteria.</p>';
            return;
        }

        events.forEach(event => {
            const neighbourhood = neighbourhoodsData.find(n => n.id === event.neighbourhoodId);
            const neighbourhoodName = neighbourhood ? neighbourhood.name : 'Unknown Neighbourhood';

            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p class="event-date">Date: ${event.date}</p>
                <p class="event-time">Time: ${event.time}</p>
                <p class="event-neighbourhood">Neighbourhood: ${neighbourhoodName}</p>
                <p class="event-category">Category: ${event.category}</p>
                <p class="event-location">Location: ${event.location}</p>
                <p class="event-description">${event.description}</p>
            `;
            eventListContainer.appendChild(eventCard);
        });
    }

    // Function to populate the category filter
    function populateCategoryFilter(events) {
    // Add a default "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);
    categoryFilter.value = ''; // Set default selection to "All Categories"

    const categories = [...new Set(events.map(event => event.category))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

    // Function to populate the neighbourhood filter options from neighbourhood data
    function populateNeighbourhoodFilterOptions(neighbourhoods) {
        // Add a default "All Neighbourhoods" option
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'All Neighbourhoods';
        neighbourhoodFilter.appendChild(allOption);
        neighbourhoodFilter.value = ''; // Set default selection to "All Neighbourhoods"

        neighbourhoods.sort((a, b) => a.name.localeCompare(b.name));
        neighbourhoods.forEach(neighbourhood => {
            const option = document.createElement('option');
            option.value = neighbourhood.name;
            option.textContent = neighbourhood.name;
            neighbourhoodFilter.appendChild(option);
        });
    }

    // Event listener for applying filters
    applyFiltersButton.addEventListener('click', () => {
        const selectedDate = dateFilter.value;
        const selectedNeighbourhood = neighbourhoodFilter.value;
        const selectedCategory = categoryFilter.value;

        const filteredEvents = allEvents.filter(event => {
            const dateMatch = !selectedDate || event.date === selectedDate;
            const neighbourhoodMatch = !selectedNeighbourhood || (neighbourhoodsData.find(n => n.id === event.neighbourhoodId)?.name === selectedNeighbourhood);
            const categoryMatch = !selectedCategory || event.category === selectedCategory;

            return dateMatch && neighbourhoodMatch && categoryMatch;
        });

        displayEvents(filteredEvents);
    });

    // Fetch event and neighbourhood data
    Promise.all([
        fetch('../data/events.json').then(response => response.json()),
        fetch('../data/neighbourhoods.json').then(response => response.json())
    ])
        .then(([eventsData, neighbourhoods]) => {
            allEvents = eventsData;
            neighbourhoodsData = neighbourhoods;
            displayEvents(allEvents);
            populateCategoryFilter(allEvents); // Populate category filter
            populateNeighbourhoodFilterOptions(neighbourhoods); // Populate neighbourhood filter
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            eventListContainer.innerHTML = '<p>Error loading events.</p>';
        });
});