// JavaScript/topDealHandler.js

document.addEventListener('DOMContentLoaded', () => {
    const top3ProductsContainer = document.getElementById('top3ProductsContainer');
    const otherTopDealsContainer = document.getElementById('otherTopDealsContainer');

    if (!top3ProductsContainer || !otherTopDealsContainer) {
        console.error("Không tìm thấy container cho Top Deal. Vui lòng kiểm tra lại ID HTML.");
        return;
    }

    // Đảm bảo allItemsData đã được load từ products.js
    if (typeof allItemsData === 'undefined' || !Array.isArray(allItemsData)) {
        console.error("Dữ liệu sản phẩm (allItemsData) chưa được định nghĩa hoặc không hợp lệ.");
        top3ProductsContainer.innerHTML = "<p>Không thể tải dữ liệu sản phẩm.</p>";
        otherTopDealsContainer.innerHTML = "<p>Không thể tải dữ liệu sản phẩm.</p>";
        return;
    }

    // Sắp xếp tất cả sản phẩm theo soldQuantity giảm dần
    const sortedProducts = [...allItemsData].sort((a, b) => b.soldQuantity - a.soldQuantity);

    // Lấy 3 sản phẩm bán chạy nhất
    const top3Products = sortedProducts.slice(0, 3);
    const otherProducts = sortedProducts.slice(3);

    // Hiển thị Top 3 sản phẩm
    if (top3Products.length >= 3) {
        // Thứ tự chèn để hiển thị: Top 2, Top 1, Top 3
        // Mục tiêu: Trái (Top 2), Giữa (Top 1), Phải (Top 3)

        // Top 2 (bên trái)
        const top2CardHtml = top3Products[1].toHtmlCard(); // Lấy HTML của sản phẩm top 2
        const tempTop2Div = document.createElement('div');
        tempTop2Div.innerHTML = top2CardHtml;
        const actualTop2Card = tempTop2Div.firstElementChild;
        actualTop2Card.classList.add('top-2');
        top3ProductsContainer.appendChild(actualTop2Card);

        // Top 1 (ở giữa, cao nhất)
        const top1CardHtml = top3Products[0].toHtmlCard(); // Lấy HTML của sản phẩm top 1
        const tempTop1Div = document.createElement('div');
        tempTop1Div.innerHTML = top1CardHtml;
        const actualTop1Card = tempTop1Div.firstElementChild;
        // SỬA LỖI Ở ĐÂY: Tên biến đúng là actualTop1Card
        actualTop1Card.classList.add('top-1');
        top3ProductsContainer.appendChild(actualTop1Card);


        // Top 3 (bên phải)
        const top3CardHtml = top3Products[2].toHtmlCard(); // Lấy HTML của sản phẩm top 3
        const tempTop3Div = document.createElement('div');
        tempTop3Div.innerHTML = top3CardHtml;
        const actualTop3Card = tempTop3Div.firstElementChild;
        actualTop3Card.classList.add('top-3');
        top3ProductsContainer.appendChild(actualTop3Card);

    } else if (top3Products.length > 0) {
        // Trường hợp có ít hơn 3 sản phẩm bán chạy (>0)
        // Hiển thị tất cả những gì có, không áp dụng bố cục Top 3 đặc biệt
        top3ProductsContainer.innerHTML = ''; // Xóa nội dung cũ
        top3Products.forEach(product => {
            const cardHtml = product.toHtmlCard();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHtml;
            const actualCard = tempDiv.firstElementChild;
            // Không thêm class top-1, top-2, top-3 nếu không đủ 3 sản phẩm
            top3ProductsContainer.appendChild(actualCard);
        });
        top3ProductsContainer.style.justifyContent = 'center'; // Căn giữa nếu ít sản phẩm
        top3ProductsContainer.style.gap = '20px';
    } else {
        top3ProductsContainer.innerHTML = "<p style='text-align: center; width: 100%;'>Chưa có sản phẩm nào được bán.</p>";
    }

    // Hiển thị các sản phẩm còn lại (vẫn sắp xếp từ lớn đến bé)
    if (otherProducts.length > 0) {
        otherTopDealsContainer.innerHTML = ''; // Xóa nội dung cũ
        otherProducts.forEach(product => {
            otherTopDealsContainer.innerHTML += product.toHtmlCard();
        });
    } else {
        otherTopDealsContainer.innerHTML = "<p style='text-align: center; width: 100%;'>Không có sản phẩm bán chạy khác.</p>";
    }
});