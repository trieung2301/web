// JavaScript/navigation.js

// logic xử lý cho các link điều hướng

function updateNavLinkHighlight(activeLinkElement) {
    // Xóa class 'current-page' khỏi TẤT CẢ các nav links trước
    
    // Thêm class 'current-page' vào link được chọn
    if (activeLinkElement) {
        activeLinkElement.classList.add('current-page');
    }
}

// Hàm để lấy tên file đã được làm sạch và chuyển về chữ thường từ một URL hoặc đường dẫn
// Đây là hàm quan trọng nhất để đảm bảo so sánh chính xác
function getCleanFileName(urlOrPath) {
    let fileName = '';
    
    try {
        // Sử dụng đối tượng URL để phân tích URL một cách đáng tin cậy.
        // Dùng window.location.origin làm base URL để xử lý các đường dẫn tương đối (ví dụ: "category.html")
        const urlObj = new URL(urlOrPath, window.location.origin);
        fileName = urlObj.pathname.split('/').pop(); // Lấy phần cuối cùng của pathname
    } catch (e) {
        // Nếu không thể tạo đối tượng URL (ví dụ: chuỗi truyền vào không giống URL),
        // thì cố gắng lấy tên file trực tiếp từ chuỗi
        fileName = String(urlOrPath).split('/').pop();
    }

    // Loại bỏ mọi thứ sau dấu '?' (query string) hoặc '#' (hash)
    const queryIndex = fileName.indexOf('?');
    if (queryIndex !== -1) {
        fileName = fileName.substring(0, queryIndex);
    }
    const hashIndex = fileName.indexOf('#');
    if (hashIndex !== -1) {
        fileName = fileName.substring(0, hashIndex);
    }
    
    // Chuyển toàn bộ tên file về chữ thường để đảm bảo so sánh không phân biệt hoa/thường
    return fileName.toLowerCase();
}


document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử link điều hướng bằng ID của chúng
    const homeNavLink = document.getElementById('homeNavLink');
    const categoriesNavLink = document.getElementById('categoriesNavLink');
    const flashSaleNavLink = document.getElementById('flashSaleNavLink');
    const topDealNavLink = document.getElementById('topDealNavLink');

    // Lấy tên file của trang hiện tại đã được làm sạch và chuyển về chữ thường
    let currentFileName = getCleanFileName(window.location.href);

    // Xử lý trường hợp đặc biệt cho trang chủ:
    // Nếu URL kết thúc bằng "/" (không có tên file rõ ràng, ví dụ: http://127.0.0.1:5500/Html/)
    // thì getCleanFileName có thể trả về chuỗi rỗng. Trong trường hợp đó, chúng ta coi nó là "index.html".
    if (currentFileName === '') {
        currentFileName = 'index.html';
    }

    // Áp dụng highlight dựa trên tên file hiện tại đã được chuẩn hóa
    if (currentFileName === 'index.html') {
        updateNavLinkHighlight(homeNavLink);
    } else if (currentFileName === 'category.html') {
        updateNavLinkHighlight(categoriesNavLink);
    } else if (currentFileName === 'flash-sale.html') {
        updateNavLinkHighlight(flashSaleNavLink);
    } else if (currentFileName === 'top-deal.html') {
        updateNavLinkHighlight(topDealNavLink);
    }
});