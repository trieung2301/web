//Xử lý hiển thị và lọc kết quả trên trang search-results.html
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

    // Hàm để điền các tùy chọn danh mục vào select box
    function populateCategories() {
        const categories = [...new Set(allItemsData.map(item => item.category))];
        categoryFilter.innerHTML = '<option value="">Tất cả</option>'; // Luôn có tùy chọn "Tất cả"
        categories.forEach(category => {
            if (category) { // Đảm bảo category không rỗng
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            }
        });
    }

    // Hàm hiển thị sản phẩm
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

    // Hàm thực hiện tìm kiếm và lọc
    function performSearch() {
        let filteredItems = [...allItemsData]; // Bắt đầu với tất cả sản phẩm

        const query = searchQueryFilter.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const minPrice = parseFloat(minPriceFilter.value);
        const maxPrice = parseFloat(maxPriceFilter.value);
        const sortOrder = sortOrderFilter.value;
        const isFlashSaleOnly = flashSaleFilter.checked;

        // Lọc theo tên sản phẩm
        if (query) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }

        // Lọc theo danh mục
        if (category) {
            filteredItems = filteredItems.filter(item =>
                item.category === category
            );
        }

        // Lọc theo khoảng giá
        if (!isNaN(minPrice)) {
            filteredItems = filteredItems.filter(item => item.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filteredItems = filteredItems.filter(item => item.price <= maxPrice);
        }

        // Lọc theo đang giảm giá (Flash Sale)
        if (isFlashSaleOnly) {
            filteredItems = filteredItems.filter(item => item.isFlashSale && item.isFlashSaleActive());
        }

        // Sắp xếp
        if (sortOrder) {
            filteredItems.sort((a, b) => {
                let priceA = a.price;
                let priceB = b.price;

                // Nếu là flash sale đang hoạt động, sử dụng salePrice để sắp xếp
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

    // Hàm đọc URL parameters và điền vào các bộ lọc
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

        // Sau khi điền, thực hiện tìm kiếm ban đầu
        performSearch();
    }

    // Hàm cập nhật URL parameters khi áp dụng bộ lọc
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
        window.history.pushState({ path: newUrl }, '', newUrl); // Cập nhật URL mà không reload trang
    }

    // Xử lý sự kiện khi nút "Áp dụng bộ lọc" được click
    applyFiltersBtn.addEventListener('click', () => {
        updateUrlParams();
        performSearch();
    });

    // Xử lý sự kiện khi nút "Đặt lại bộ lọc" được click
    resetFiltersBtn.addEventListener('click', () => {
        searchQueryFilter.value = '';
        categoryFilter.value = '';
        minPriceFilter.value = '';
        maxPriceFilter.value = '';
        sortOrderFilter.value = '';
        flashSaleFilter.checked = false;
        updateUrlParams(); // Cập nhật URL để loại bỏ params
        performSearch(); // Thực hiện tìm kiếm lại với các bộ lọc trống
    });


    // Khởi tạo trang: điền danh mục và tải bộ lọc từ URL
    populateCategories();
    loadFiltersFromUrl();
});