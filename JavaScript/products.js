// products.js

class Item {
    constructor(id, name, price, imageUrl, description, category, stock = 100, isFlashSale = false, originalPrice = null, salePrice = null, soldQuantity = 0) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.category = category;
        this.stock = stock;
        this.isFlashSale = isFlashSale;
        this.originalPrice = originalPrice;
        this.salePrice = salePrice;
        this.soldQuantity = soldQuantity;
    }

    getFormattedPrice(price) {
        if (price === null || isNaN(price)) {
            return 'Liên hệ';
        }
        return `${price.toLocaleString('vi-VN')}₫`;
    }

    isFlashSaleActive() {
        if (!this.isFlashSale || GLOBAL_FLASH_SALE_END_TIME === null) {
            return false;
        }

        const now = new Date();
        const endTime = new Date(GLOBAL_FLASH_SALE_END_TIME);
        return now < endTime;
    }

    toHtmlCard() {
        const linkUrl = `product-detail.html?id=${this.id}`;
        let priceHtml = '';
        let badgeHtml = '';
        let soldQuantityHtml = '';

        if (this.isFlashSale && this.isFlashSaleActive() && this.salePrice !== null && this.originalPrice !== null) {
            const percentageOff = Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
            badgeHtml = `<span class="flash-sale-badge-inline">-${percentageOff}%</span>`;

            priceHtml = `
                <p class="original-price-card">
                    ${this.getFormattedPrice(this.originalPrice)} ${badgeHtml}
                </p>
                <p class="price-card">${this.getFormattedPrice(this.salePrice)}</p>
            `;
        } else {
            priceHtml = `
                <p class="original-price-card" style="visibility: hidden; height: 1.2em;"></p>
                <p class="price-card">${this.getFormattedPrice(this.price)}</p>
            `;
        }

        if (this.soldQuantity > 0) {
            soldQuantityHtml = `<p class="sold-quantity">Đã bán: ${this.soldQuantity}</p>`; 
        }

        return `
            <div class="product-card">
                <a href="${linkUrl}"><img src="${this.imageUrl}" alt="${this.name}"></a>
                <h3 class="title"><a href="${linkUrl}">${this.name}</a></h3>
                ${priceHtml}
                ${soldQuantityHtml}
            </div>
        `;
    }

    toDetailHtml() {
        let priceDetailHtml = '';
        let soldQuantityDetailHtml = '';

        if (this.isFlashSale && this.isFlashSaleActive() && this.salePrice !== null && this.originalPrice !== null) {
            priceDetailHtml = `
                <p class="product-price-large original-price-detail" style="text-decoration: line-through; color: #999; font-size: 0.8em;">${this.getFormattedPrice(this.originalPrice)}</p>
                <p class="product-price-large sale-price-detail" style="color: #FF5722; font-weight: bold; font-size: 1.8em;">${this.getFormattedPrice(this.salePrice)}</p>
            `;
        } else {
            priceDetailHtml = `<p class="product-price-large">${this.getFormattedPrice(this.price)}</p>`;
        }

        if (this.soldQuantity > 0) {
            soldQuantityDetailHtml = `<p class="product-sold-detail">Đã bán: ${this.soldQuantity}</p>`;
        }

        return `
            <div class="product-image-large">
                <img src="${this.imageUrl}" alt="${this.name}">
            </div>
            <div class="product-info">
                <h1 class="product-name">${this.name}</h1>
                ${priceDetailHtml}
                <p class="product-description">
                    ${this.description}
                </p>
                <p class="product-stock">Tồn kho: ${this.stock} sản phẩm</p>
                ${soldQuantityDetailHtml} <div class="quantity-selector">
                    <label for="quantity">Số lượng:</label>
                    <input type="number" id="quantity" name="quantity" value="1" min="1" max="${this.stock}">
                </div>

                <div class="action-buttons">
                    <button id="addToCartBtn" class="add-to-cart-btn">🛒 Thêm vào giỏ hàng</button>
                    <button id="buyNowBtn" class="buy-now-btn">Mua ngay</button>
                </div>
            </div>
        `;
    }
}

const GLOBAL_FLASH_SALE_END_TIME = new Date(2025, 8 - 1, 8, 19, 59, 59).toISOString();

// Sửa đổi phần này để tải dữ liệu từ localStorage
let allItemsData = [];

function loadInitialProductData() {
    let storedData = JSON.parse(localStorage.getItem('allItemsData'));
    if (storedData && storedData.length > 0) {
        allItemsData = storedData.map(data => new Item(
            data.id, data.name, data.price, data.imageUrl, data.description,
            data.category, data.stock, data.isFlashSale, data.originalPrice,
            data.salePrice, data.soldQuantity
        ));
    } else {
        // Dữ liệu mẫu ban đầu nếu localStorage trống
        allItemsData = [
            new Item(1, "Set áo thun nam thời trang", 433000, "https://tse1.mm.bing.net/th/id/OIP.1sms3hTuDDg9BhIntSl9LQHaHa?pid=Api&P=0&h=220", "Set áo thun nam cao cấp, chất liệu cotton thoáng mát, phù hợp mặc đi chơi, đi làm. Nhiều màu sắc lựa chọn.", "Thời trang nam", 100, true, 433000, 350000, 50),
            new Item(2, "Quạt mini cầm tay đa năng", 200000, "https://chiaki.vn/upload/seller/1748403703-muc.jpg", "Quạt mini nhỏ gọn, tiện lợi mang theo bên người. Có 3 chế độ gió, pin sạc bền bỉ.", "Thiết bị điện gia dụng", 100, true, 200000, 150000, 80),
            new Item(4, "Đồ chơi lắp ghép sáng tạo", 39000, "https://sudospaces.com/babycuatoi/2023/01/a213-7-bo-ban-ghe-lego-da-nang-342-chi-tiet-xep-hinh-co-lon-medium.jpg", "Bộ đồ chơi lắp ghép giúp phát triển tư duy, sáng tạo cho bé. Chất liệu nhựa an toàn.", "Đồ chơi", 100, true, 39000, 29000, 30),
            new Item(3, "Gấu bông mềm mại", 150000, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROKJpRs5ke0FGnBcP1Y2ABWIE9F_03uDZMRQ&s", "Gấu bông chất liệu nhung mềm mại, an toàn cho trẻ em. Thích hợp làm quà tặng.", "Đồ chơi", 150, false, null, null, 120),
            new Item(5, "Card Màn Hình VGA MSI GeForce RTX 5090 32G VENTUS 3X OC", 96400000, "https://m.media-amazon.com/images/I/715PJSwhFBL._AC_UY218_.jpg", "Card đồ họa hiệu năng cực cao dành cho game thủ và người làm đồ họa chuyên nghiệp.", "Thiết bị điện tử", 50, false, null, null, 5),
            new Item(6, "Bộ vi xử lý AMD Ryzen 9 9900X3D", 20355000, "https://m.media-amazon.com/images/I/51iH16H8wgL._AC_UY218_.jpg", "CPU mạnh mẽ từ AMD, tối ưu cho gaming và các tác vụ đa nhiệm nặng.", "Thiết bị điện tử", 75, false, null, null, 15),
            new Item(7, "Tai nghe Bluetooth không dây cao cấp", 450000, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUP6CFsGPCB1d-T9FjBZRy_3VuryA-S00DwQ&s", "Tai nghe không dây chất lượng âm thanh HD, pin trâu, kết nối ổn định.", "Thiết bị điện tử", 200, false, null, null, 90),
            new Item(8, "Loa Bluetooth di động chống nước", 899000, "https://tse4.mm.bing.net/th/id/OIP.SbxVrTEVJ5vyu1mMPrKDkwHaEV?pid=Api&P=0&h=220", "Loa di động mạnh mẽ, chống nước, âm thanh sống động, phù hợp dã ngoại.", "Thiết bị điện tử", 120, false, null, null, 60),
            new Item(9, "Bàn phím cơ RGB gaming chuyên nghiệp", 1200000, "https://tse2.mm.bing.net/th/id/OIP.1b63DDBAU-n2_5kmAwvqjwHaHa?pid=Api&P=0&h=220", "Bàn phím cơ với đèn LED RGB tùy chỉnh, switch bền bỉ, mang lại trải nghiệm gõ tuyệt vời.", "Thiết bị điện tử", 90, false, null, null, 40),
            new Item(10, "Chuột gaming không dây siêu nhẹ", 750000, "https://sp.yimg.com/ib/th/id/OIP.-xQWv5mSmsFtAIIORaUdsgHaHa?pid=Api&w=148&h=148&c=7&dpr=2&rs=1", "Chuột gaming không dây, cảm biến chính xác, thiết kế công thái học.", "Thiết bị điện tử", 180, false, null, null, 100),
            new Item(11, "Màn hình cong tần số quét cao 27 inch", 6500000, "https://m.media-amazon.com/images/I/71WKX1WCbtL._AC_UY218_.jpg", "Màn hình cong 27 inch, độ phân giải Full HD, tần số quét 144Hz, hình ảnh mượt mà.", "Thiết bị điện tử", 60, false, null, null, 20),
            new Item(12, "Máy chiếu mini Full HD tiện dụng", 2990000, "https://tse2.mm.bing.net/th/id/OIP.oylucW2L05TewXGdlcjXwAHaFL?pid=Api&P=0&h=220", "Máy chiếu mini bỏ túi, độ phân giải Full HD, kết nối đa dạng, xem phim mọi lúc mọi nơi.", "Thiết bị điện gia dụng", 40, false, null, null, 10),
            new Item(13, "Camera an ninh wifi xoay 360 độ", 790000, "https://m.media-amazon.com/images/I/61KJet9WuiL._AC_UL320_.jpg", "Camera giám sát thông minh, xoay 360 độ, đàm thoại 2 chiều, báo động chuyển động.", "Thiết bị điện gia dụng", 110, false, null, null, 70),
            new Item(14, "Robot hút bụi thông minh tự động", 3500000, "https://tse1.mm.bing.net/th/id/OIP.bOxl5eUZakwI12uFrtljEAHaHa?pid=Api&P=0&h=220", "Robot hút bụi tự động, lực hút mạnh mẽ, có chế độ lau nhà, điều khiển qua app.", "Thiết bị điện gia dụng", 30, false, null, null, 25),
            new Item(15, "Máy lọc không khí gia đình thông minh", 1800000, "https://tse2.mm.bing.net/th/id/OIP.O6Pd7mYLSdavItdkTPNJjwHaHa?pid=Api&P=0&h=220", "Máy lọc không khí công nghệ HEPA, loại bỏ bụi mịn, vi khuẩn, mùi hôi, mang lại không khí trong lành.", "Thiết bị điện gia dụng", 80, false, null, null, 45),
            new Item(16, "Nồi chiên không dầu điện tử đa năng", 1250000, "https://bizweb.dktcdn.net/100/435/504/products/nichienkhongdudintdanang8litro.jpg?v=1667787759633", "Nồi chiên không dầu dung tích lớn, màn hình cảm ứng, chế độ nấu đa dạng, tốt cho sức khỏe.", "Thiết bị điện gia dụng", 70, false, null, null, 55),
            new Item(17, "Máy pha cà phê tự động chuyên nghiệp", 4200000, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpfyctmWxhDxIvJFd-hZn9m1G6nr5yApWanA&s", "Máy pha cà phê tự động, pha được nhiều loại đồ uống, dễ sử dụng và vệ sinh.", "Thiết bị điện gia dụng", 25, false, null, null, 18),
            new Item(18, "Bàn ủi hơi nước cầm tay tiện lợi", 680000, "https://tse2.mm.bing.net/th/id/OIP.uuiSr1R7tlnRW7X_3CyHjgAAAA?pid=Api&P=0&h=220", "Bàn ủi hơi nước nhỏ gọn, làm phẳng quần áo nhanh chóng, tiện lợi mang đi du lịch.", "Thiết bị điện gia dụng", 160, false, null, null, 110),
            new Item(19, "Máy xay sinh tố đa năng công suất lớn", 950000, "https://tse1.mm.bing.net/th/id/OIP.0FnxcrfQXDbYYom0ChDb4wHaHa?pid=Api&P=0&h=220", "Máy xay sinh tố công suất cao, xay được đá, làm các loại sinh tố, sữa hạt dễ dàng.", "Thiết bị điện gia dụng", 95, false, null, null, 65),
            new Item(20, "Bếp từ đôi hồng ngoại cao cấp", 2700000, "https://tse4.mm.bing.net/th/id/OIP.xxv83oj5ZL5jmhe0LOSyiQHaHa?pid=Api&P=0&h=220", "Bếp từ đôi kết hợp hồng ngoại, tiết kiệm điện, nấu nhanh, mặt kính chịu nhiệt.", "Thiết bị điện gia dụng", 55, false, null, null, 30),
            new Item(21, "Máy rửa chén độc lập thông minh", 8500000, "https://tse1.mm.bing.net/th/id/OIP.dj46ikldCGLjqjFopot10AHaEI?pid=Api&P=0&h=220", "Máy rửa chén tự động, nhiều chế độ rửa, diệt khuẩn, tiết kiệm nước.", "Thiết bị điện gia dụng", 20, false, null, null, 10),
            new Item(22, "Tủ lạnh Inverter 2 cánh tiết kiệm điện", 11000000, "https://dienmayhanhung.vn/wp-content/uploads/2024/09/1-8s8t6o.jpg", "Tủ lạnh công nghệ Inverter, dung tích lớn, làm lạnh nhanh, không đóng tuyết.", "Thiết bị điện gia dụng", 15, false, null, null, 8),
            new Item(23, "Máy giặt cửa ngang 9kg đa năng", 7800000, "https://cdn2.cellphones.com.vn/x/media/catalog/product/f/r/frame_16_11_.png", "Máy giặt cửa ngang 9kg, nhiều chương trình giặt, công nghệ giặt sạch sâu.", "Thiết bị điện gia dụng", 22, false, null, null, 12),
            new Item(24, "Điều hòa Inverter 1.5 HP tiết kiệm điện", 9200000, "https://shop.nagakawa.com.vn/media/lib/22-04-2022/infor2h124.jpg", "Điều hòa Inverter 1.5 HP, làm lạnh nhanh, vận hành êm ái, tiết kiệm điện năng.", "Thiết bị điện gia dụng", 18, false, null, null, 7),
            new Item(25, "Tivi thông minh 55 inch 4K Ultra HD", 15500000, "https://viethansecurity.com/media/product/8746_android_tivi_thong_minh_55inch_4k_uhd_coocaa_55v8_chat_luong.jpg", "Smart Tivi 55 inch, độ phân giải 4K, hình ảnh sắc nét, tích hợp trợ lý ảo.", "Thiết bị điện tử", 10, false, null, null, 3),
            new Item(26, "Đồng hồ thông minh theo dõi sức khỏe", 2100000, "https://cf.shopee.vn/file/74f6d6719ef3697f1e3b43e078c3516f", "Đồng hồ thông minh theo dõi nhịp tim, giấc ngủ, tập luyện thể thao, nhận thông báo.", "Đồng hồ", 250, false, null, null, 150),
        ];
        localStorage.setItem('allItemsData', JSON.stringify(allItemsData.map(item => ({
            id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, description: item.description,
            category: item.category, stock: item.stock, isFlashSale: item.isFlashSale, originalPrice: item.originalPrice,
            salePrice: item.salePrice, soldQuantity: item.soldQuantity
        }))));
    }
}

// Gọi hàm này khi tải products.js
loadInitialProductData();


function initializeProductPrices() {
    allItemsData.forEach(item => {
        if (item.isFlashSale && item.isFlashSaleActive()) {
            item.price = item.salePrice;
        } else {
            item.price = item.originalPrice !== null ? item.originalPrice : item.price;
        }
    });
}

initializeProductPrices();

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += item.toHtmlCard();
        });
    } else {
        console.error(`Error: Element with ID '${containerId}' not found.`);
    }
}

function findItemById(id) {
    return allItemsData.find(item => item.id == id);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}