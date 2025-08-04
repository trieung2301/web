// JavaScript/searchResults.js

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    const noResultsMessage = document.getElementById('noResultsMessage');

    const searchQueryFilter = document.getElementById('searchQueryFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPriceFilter = document.getElementById('minPriceFilter');
    const maxPriceFilter = document.getElementById('maxPriceFilter');
    const sortOrderFilter = document.getElementById('sortOrderFilter');
    const flashSaleFilter = document.getElementById('flashSaleFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    function populateCategories() {
        const categories = [...new Set(allItemsData.map(item => item.category))];
        categoryFilter.innerHTML = '<option value="">Tất cả</option>'; 
        categories.forEach(category => {
            if (category) { 
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            }
        });
    }

    function renderProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        if (productsToDisplay.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
            productsToDisplay.forEach(item => {
                productGrid.innerHTML += item.toHtmlCard();
            });
        }
    }

    function performSearch() {
        let filteredItems = [...allItemsData];
        const query = searchQueryFilter.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const minPrice = parseFloat(minPriceFilter.value);
        const maxPrice = parseFloat(maxPriceFilter.value);
        const sortOrder = sortOrderFilter.value;
        const isFlashSaleOnly = flashSaleFilter.checked;

        if (query) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }
        if (category) {
            filteredItems = filteredItems.filter(item =>
                item.category === category
            );
        }
        if (!isNaN(minPrice)) {
            filteredItems = filteredItems.filter(item => item.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filteredItems = filteredItems.filter(item => item.price <= maxPrice);
        }
        if (isFlashSaleOnly) {
            filteredItems = filteredItems.filter(item => item.isFlashSale && item.isFlashSaleActive());
        }

        if (sortOrder) {
            filteredItems.sort((a, b) => {
                let priceA = a.price;
                let priceB = b.price;

                if (a.isFlashSale && a.isFlashSaleActive() && a.salePrice !== null) {
                    priceA = a.salePrice;
                }
                if (b.isFlashSale && b.isFlashSaleActive() && b.salePrice !== null) {
                    priceB = b.salePrice;
                }

                if (sortOrder === 'asc') {
                    return priceA - priceB;
                } else if (sortOrder === 'desc') {
                    return priceB - priceA;
                }
                return 0;
            });
        }

        renderProducts(filteredItems);
    }

    function loadFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);

        const query = urlParams.get('query');
        const category = urlParams.get('category');
        const minPrice = urlParams.get('minPrice');
        const maxPrice = urlParams.get('maxPrice');
        const sortOrder = urlParams.get('sortOrder');
        const flashSale = urlParams.get('flashSale');

        if (query) {
            searchQueryFilter.value = query;
            searchResultsTitle.textContent = `Kết quả tìm kiếm cho: "${query}"`;
        } else {
            searchResultsTitle.textContent = 'Kết quả tìm kiếm';
        }

        if (category) categoryFilter.value = category;
        if (minPrice) minPriceFilter.value = minPrice;
        if (maxPrice) maxPriceFilter.value = maxPrice;
        if (sortOrder) sortOrderFilter.value = sortOrder;
        if (flashSale === 'true') flashSaleFilter.checked = true;

        performSearch();
    }

    function updateUrlParams() {
        const params = new URLSearchParams();

        if (searchQueryFilter.value.trim()) {
            params.set('query', searchQueryFilter.value.trim());
        }
        if (categoryFilter.value) {
            params.set('category', categoryFilter.value);
        }
        if (minPriceFilter.value) {
            params.set('minPrice', minPriceFilter.value);
        }
        if (maxPriceFilter.value) {
            params.set('maxPrice', maxPriceFilter.value);
        }
        if (sortOrderFilter.value) {
            params.set('sortOrder', sortOrderFilter.value);
        }
        if (flashSaleFilter.checked) {
            params.set('flashSale', 'true');
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl); 
    }

    applyFiltersBtn.addEventListener('click', () => {
        updateUrlParams();
        performSearch();
    });

    resetFiltersBtn.addEventListener('click', () => {
        searchQueryFilter.value = '';
        categoryFilter.value = '';
        minPriceFilter.value = '';
        maxPriceFilter.value = '';
        sortOrderFilter.value = '';
        flashSaleFilter.checked = false;
        updateUrlParams(); 
        performSearch(); 
    });


    populateCategories();
    loadFiltersFromUrl();
});