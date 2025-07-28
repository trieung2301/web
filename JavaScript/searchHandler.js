//Xử lý form tìm kiếm ở header (có trên mọi trang).

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Ngăn chặn form submit mặc định

            const query = searchInput.value.trim();
            if (query) {
                // Chuyển hướng đến trang search-results.html với query trên URL
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            } else {
                // Nếu ô tìm kiếm trống, vẫn chuyển hướng nhưng không có query
                window.location.href = `search-results.html`;
            }
        });
    }
});