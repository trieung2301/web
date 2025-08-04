document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderMiniCart();

    const cartIcon = document.getElementById('cart-icon');
    const miniCart = document.getElementById('mini-cart');

    if (cartIcon && miniCart) {
        cartIcon.addEventListener('mouseenter', () => {
            renderMiniCart();
            miniCart.style.display = 'block';
        });

        cartIcon.addEventListener('mouseleave', (e) => {
            setTimeout(() => {
                if (!miniCart.contains(e.relatedTarget) && !cartIcon.contains(e.relatedTarget)) {
                    miniCart.style.display = 'none';
                }
            }, 10);
        });

        miniCart.addEventListener('mouseleave', () => {
            miniCart.style.display = 'none';
        });
        miniCart.addEventListener('mouseenter', () => {
            miniCart.style.display = 'block';
        });
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = `(${cartCount})`;
    }
}

function renderMiniCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const miniCart = document.getElementById('mini-cart');

    if (!miniCart) return;

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));
    const tempItemInstance = new Item(0, '', 0);

    if (cart.length === 0) {
        miniCart.innerHTML = '<p style="padding: 10px; text-align: center;">Giỏ hàng trống</p>';
        return;
    }

    let totalPrice = 0;

    const itemsHTML = cart.map(cartItem => {
        const matchedItem = allItems.find(p => p.id == cartItem.id);

        let itemHtml = '';
        if (matchedItem) {
            const itemPrice = matchedItem.isFlashSale ? matchedItem.salePrice : matchedItem.price;
            const itemTotal = itemPrice * cartItem.quantity;
            totalPrice += itemTotal;
            itemHtml = `
                <div class="mini-cart-item" style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${matchedItem.imageUrl}" alt="${matchedItem.name}" class="mini-cart-img"
                         style="width: 50px; height: 50px; object-fit: cover; margin-right: 8px; border-radius: 4px;">
                    <div class="mini-cart-info" style="flex-grow: 1;">
                        <p style="margin: 0;"><strong>${matchedItem.name}</strong></p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">SL: ${cartItem.quantity}</p>
                        <p style="margin: 0; font-size: 0.9em; color: #555;">Giá: ${tempItemInstance.getFormattedPrice(itemPrice)}</p>
                    </div>
                </div>
            `;
        } else {
            const fallbackPrice = cartItem.price || 0;
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

function addToCart(productId, quantity = 1) {
    let allItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];

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
        if (cart[existingItemIndex].quantity + quantity <= productToUpdate.stock) {
            cart[existingItemIndex].quantity += quantity;
            alert(`Đã tăng số lượng ${productToUpdate.name} trong giỏ hàng lên ${cart[existingItemIndex].quantity}.`);
        } else {
            alert(`Bạn chỉ có thể thêm tối đa ${productToUpdate.stock} sản phẩm "${productToUpdate.name}" vào giỏ hàng (hiện có ${cart[existingItemIndex].quantity}).`);
            return;
        }
    } else {
        if (quantity <= productToUpdate.stock) {
            cart.push({
                id: productId,
                quantity: quantity,
                price: productToUpdate.price
            });
            alert(`Đã thêm ${productToUpdate.name} vào giỏ hàng.`);
        } else {
            alert(`Số lượng bạn muốn thêm (${quantity}) vượt quá số lượng tồn kho (${productToUpdate.stock}) của sản phẩm "${productToUpdate.name}".`);
            return;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderMiniCart();
}

function checkout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('cart.js - checkout(): Giá trị currentUser khi nhấn Mua Hàng:', currentUser);

    if (!currentUser) {
        alert('Vui lòng đăng nhập để tiếp tục mua hàng.');
        window.location.href = 'login.html';
        return;
    }

    const selectedRows = document.querySelectorAll('#cartBody input[type="checkbox"]:checked');
    const selectedItems = [];
    selectedRows.forEach(checkbox => {
        const row = checkbox.closest('tr');
        if (row) {
            const productId = row.dataset.productId;
            const quantity = parseInt(row.querySelector('.quantity-input').value);
            const itemPrice = parseFloat(row.dataset.itemPrice);
            selectedItems.push({ id: productId, quantity: quantity, price: itemPrice });
        }
    });

    if (selectedItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
        return;
    }

    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));

    window.location.href = 'checkout.html';
}