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
            if (!cartIcon.contains(e.relatedTarget)) {
                miniCart.style.display = 'none';
            }
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

    if (cart.length === 0) {
        miniCart.innerHTML = '<p>Giỏ hàng trống</p>';
        return;
    }

    let totalPrice = 0;

    const itemsHTML = cart.map(cartItem => {
        const matchedItem = allItemsData.find(p => p.id == cartItem.id);
        if (!matchedItem) return '';

        const itemTotal = matchedItem.price * cartItem.quantity;
        totalPrice += itemTotal;

        return `
            <div class="mini-cart-item" style="display: flex; margin-bottom: 10px;">
                <img src="${matchedItem.imageUrl}" alt="${matchedItem.name}" class="mini-cart-img" 
                     style="width: 50px; height: 50px; object-fit: cover; margin-right: 8px;">
                <div class="mini-cart-info">
                    <p><strong>${matchedItem.name}</strong></p>
                    <p>SL: ${cartItem.quantity}</p>
                    <p>Giá: ${matchedItem.price.toLocaleString('vi-VN')}₫</p>
                </div>
            </div>
        `;
    }).join('');

    miniCart.innerHTML = `
        ${itemsHTML}
        <div class="mini-cart-total" style="border-top: 1px solid #ccc; padding-top: 10px; text-align: right;">
            <strong>Tổng cộng:</strong> 
            <span style="color: red;">${totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
    `;
}

