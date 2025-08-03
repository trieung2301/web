// JavaScript/cart.js

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo giỏ hàng và mini-cart khi trang tải
    updateCartCount();
    renderMiniCart(); // Đảm bảo mini-cart hiển thị đúng ngay từ đầu

    const cartIcon = document.getElementById('cart-icon');
    const miniCart = document.getElementById('mini-cart');

    if (cartIcon && miniCart) {
        // Hiển thị mini-cart khi di chuột vào biểu tượng giỏ hàng
        cartIcon.addEventListener('mouseenter', () => {
            renderMiniCart(); // Cập nhật nội dung mini-cart mỗi khi hiển thị
            miniCart.style.display = 'block';
        });

        // Ẩn mini-cart khi di chuột ra khỏi biểu tượng giỏ hàng (nếu không di sang mini-cart)
        cartIcon.addEventListener('mouseleave', (e) => {
            // Kiểm tra xem con trỏ chuột có di vào mini-cart không
            // Dùng setTimeout để tạo độ trễ nhỏ, tránh nhấp nháy khi di nhanh qua
            setTimeout(() => {
                if (!miniCart.contains(e.relatedTarget) && !cartIcon.contains(e.relatedTarget)) {
                    miniCart.style.display = 'none';
                }
            }, 100); // 100ms delay
        });

        // Ẩn mini-cart khi di chuột ra khỏi mini-cart
        miniCart.addEventListener('mouseleave', () => {
            miniCart.style.display = 'none';
        });

        // Giữ mini-cart hiển thị khi di chuột vào mini-cart
        miniCart.addEventListener('mouseenter', () => {
            miniCart.style.display = 'block';
        });
    }
});

/**
 * Cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng.
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = `(${cartCount})`;
    }
}

/**
 * Render nội dung của mini-cart (giỏ hàng nhỏ) trong header.
 * Lấy dữ liệu sản phẩm từ allItemsData trong localStorage.
 */
function renderMiniCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const miniCart = document.getElementById('mini-cart');

    if (!miniCart) return;

    // Lấy dữ liệu sản phẩm từ localStorage (đã được lưu bởi products.js)
    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    // Chuyển đổi dữ liệu thô thành các đối tượng Item để sử dụng các phương thức của lớp
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    // Tạo một instance Item tạm thời để sử dụng getFormattedPrice cho tổng tiền
    const tempItemInstance = new Item(0, '', 0);

    if (cart.length === 0) {
        miniCart.innerHTML = '<p style="padding: 10px; text-align: center;">Giỏ hàng trống</p>';
        return;
    }

    let totalPrice = 0;

    const itemsHTML = cart.map(cartItem => {
        // Tìm sản phẩm trong danh sách allItems đã được chuyển thành đối tượng Item
        const matchedItem = allItems.find(p => p.id == cartItem.id);

        let itemHtml = '';
        if (matchedItem) {
            const itemTotal = matchedItem.price * cartItem.quantity;
            totalPrice += itemTotal;
            itemHtml = `
                <div class="mini-cart-item" style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${matchedItem.imageUrl}" alt="${matchedItem.name}" class="mini-cart-img"
                         style="width: 50px; height: 50px; object-fit: cover; margin-right: 8px; border-radius: 4px;">
                    <div class="mini-cart-info" style="flex-grow: 1;">
                        <p style="margin: 0;"><strong>${matchedItem.name}</strong></p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">SL: ${cartItem.quantity}</p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">Giá: ${tempItemInstance.getFormattedPrice(matchedItem.price)}</p>
                    </div>
                </div>
            `;
        } else {
            // Sản phẩm không tìm thấy, hiển thị thông báo
            // Vẫn có thể cộng giá nếu cartItem có lưu giá (ví dụ: từ lần thêm trước)
            const fallbackPrice = cartItem.price || 0; // Sử dụng giá đã lưu trong cartItem nếu có
            totalPrice += fallbackPrice * cartItem.quantity;

            itemHtml = `
                <div class="mini-cart-item" style="display: flex; margin-bottom: 10px; opacity: 0.7;">
                    <div style="width: 50px; height: 50px; background-color: #eee; margin-right: 8px; display: flex; align-items: center; justify-content: center; border-radius: 4px; color: #888; font-size: 0.8em;">No Img</div>
                    <div class="mini-cart-info" style="flex-grow: 1;">
                        <p style="margin: 0;"><strong>Sản phẩm không khả dụng (ID: ${cartItem.id})</strong></p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">SL: ${cartItem.quantity}</p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">Giá: ${tempItemInstance.getFormattedPrice(fallbackPrice)}</p>
                    </div>
                </div>
            `;
        }
        return itemHtml;
    }).join('');

    miniCart.innerHTML = `
        <div style="padding: 10px;">
            ${itemsHTML}
            <div class="mini-cart-total" style="border-top: 1px solid #eee; padding-top: 10px; text-align: right; margin-top: 10px;">
                <strong>Tổng cộng:</strong>
                <span style="color: red; font-weight: bold;">${tempItemInstance.getFormattedPrice(totalPrice)}</span>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <a href="cart.html" style="background-color: #007bff; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; display: inline-block;">Xem giỏ hàng</a>
            </div>
        </div>
    `;
}

/**
 * Thêm sản phẩm vào giỏ hàng và cập nhật số lượng tồn kho.
 * @param {number} productId ID của sản phẩm cần thêm.
 * @param {number} quantity Số lượng sản phẩm muốn thêm (mặc định là 1).
 */
function addToCart(productId, quantity = 1) {
    // Lấy dữ liệu sản phẩm từ localStorage
    let allItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];

    // Tạo lại các đối tượng Item từ dữ liệu thô để đảm bảo các phương thức được bảo toàn
    const allItems = allItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    const productIndex = allItems.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        alert('Sản phẩm không tồn tại.');
        return;
    }

    let productToUpdate = allItems[productIndex];

    if (productToUpdate.stock <= 0) {
        alert('Sản phẩm này đã hết hàng.');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        // Sản phẩm đã có trong giỏ hàng, tăng số lượng
        if (cart[existingItemIndex].quantity + quantity <= productToUpdate.stock) {
            cart[existingItemIndex].quantity += quantity;
            alert(`Đã tăng số lượng ${productToUpdate.name} trong giỏ hàng lên ${cart[existingItemIndex].quantity}.`);
        } else {
            alert(`Bạn chỉ có thể thêm tối đa ${productToUpdate.stock} sản phẩm "${productToUpdate.name}" vào giỏ hàng (hiện có ${cart[existingItemIndex].quantity}).`);
            return;
        }
    } else {
        // Sản phẩm chưa có trong giỏ hàng, thêm mới
        if (quantity <= productToUpdate.stock) {
            // Khi thêm vào giỏ hàng, lưu cả giá hiện tại của sản phẩm vào cartItem
            // để đảm bảo giá trong giỏ hàng không bị thay đổi nếu giá sản phẩm gốc thay đổi
            cart.push({
                id: productId,
                quantity: quantity,
                price: productToUpdate.price // Lưu giá tại thời điểm thêm vào giỏ
            });
            alert(`Đã thêm ${productToUpdate.name} vào giỏ hàng.`);
        } else {
            alert(`Số lượng bạn muốn thêm (${quantity}) vượt quá số lượng tồn kho (${productToUpdate.stock}) của sản phẩm "${productToUpdate.name}".`);
            return;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderMiniCart(); // Cập nhật mini-cart ngay lập tức sau khi thêm sản phẩm
}