// logic cụ thể cho trang category.html

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử cần thiết
    const categoryCards = document.querySelectorAll('.category-card');
    const productSectionTitle = document.getElementById('productSectionTitle');
    const categoryNavLink = document.getElementById('categoryNavLink');
    const homepageNavLink = document.getElementById('homepageNavLink');

    displayItems(allItemsData, 'productGrid'); 
    updateNavLinkHighlight(categoryNavLink); // Sử dụng hàm từ navigation.js

    // Gắn sự kiện click cho từng thẻ danh mục
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category; // Lấy giá trị data-category
            let filteredItems;
            let titleText = 'Danh sách sản phẩm';

            if (category === 'all') {
                filteredItems = allItemsData;
                titleText = 'Danh sách sản phẩm'; // Khi click "Tất cả"
                updateNavLinkHighlight(homepageNavLink); // Highlight "Trang chủ"
            } else {
                filteredItems = allItemsData.filter(item => item.category === category);
                titleText = `Sản phẩm thuộc danh mục: ${category}`;
                updateNavLinkHighlight(categoryNavLink); // Highlight "Danh mục" khi lọc
            }

            displayItems(filteredItems, 'productGrid');
            productSectionTitle.textContent = titleText; // Cập nhật tiêu đề
        });
    });

    // Xử lý click vào link "Danh mục" trên navigation bar
    if (categoryNavLink) {
        categoryNavLink.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)
            displayItems(allItemsData, 'productGrid'); // Hiển thị tất cả sản phẩm
            productSectionTitle.textContent = 'Danh sách sản phẩm'; // Đặt lại tiêu đề
            updateNavLinkHighlight(categoryNavLink); // Highlight "Danh mục" khi click vào nó
        });
    }

});