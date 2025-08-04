// searchHandler.js

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `search-results.html`;
            }
        });
    }
});