// logic trang index.html

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử cần thiết
    const homepageNavLink = document.getElementById('homepageNavLink');

    // Hiển thị một số sản phẩm lên trang chủ
    const itemsToDisplayOnHomepage = allItemsData;
    displayItems(itemsToDisplayOnHomepage, 'productGrid'); // Hiển thị vào #productGrid

    // Kiểm tra URL và thêm class cho link Trang chủ
    const currentPath = location.pathname.split('/').pop(); // Lấy phần cuối của đường dẫn
});