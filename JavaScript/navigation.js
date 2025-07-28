// JavaScript/navigation.js

// logic xử lý cho các link điều hướng

function updateNavLinkHighlight(activeLinkElement) {
    // Xóa class 'current-page' khỏi TẤT CẢ các nav links trước
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.classList.remove('current-page');
    });
    // Thêm class 'current-page' vào link được chọn
    if (activeLinkElement) {
        activeLinkElement.classList.add('current-page');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử link điều hướng bằng ID của chúng
    const homeNavLink = document.getElementById('homeNavLink');
    const flashSaleNavLink = document.getElementById('flashSaleNavLink');
    const categoriesNavLink = document.getElementById('categoriesNavLink');
    const topDealNavLink = document.getElementById('topDealNavLink');
    const contactNavLink = document.getElementById('contactNavLink'); // Lấy link Liên hệ

    // Lấy phần cuối của đường dẫn URL hiện tại (tên file HTML)
    const currentPath = location.pathname.split('/').pop();

    // Áp dụng highlight dựa trên đường dẫn hiện tại
    // (Không cần highlight Contact ở đây vì nó là modal, trừ khi bạn muốn nó luôn sáng)
    if (currentPath === '' || currentPath === 'index.html') {
        updateNavLinkHighlight(homeNavLink);
    } else if (currentPath === 'flash-sale.html') {
        updateNavLinkHighlight(flashSaleNavLink);
    } else if (currentPath === 'categories.html') {
        updateNavLinkHighlight(categoriesNavLink);
    } else if (currentPath === 'top-deal.html') {
        updateNavLinkHighlight(topDealNavLink);
    }
});