function renderCartTable() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cartBody');
    const cartTotalEl = document.getElementById('cartTotal');
    cartBody.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="6">Giỏ hàng trống</td></tr>';
        cartTotalEl.textContent = '₫0';
        return;
    }

    cartItems.forEach((cartItem, index) => {
        const item = allItemsData.find(p => p.id === cartItem.id);
        if (!item) {
            console.warn('Không tìm thấy item:', cartItem.id);
            return;
        }

        const quantity = cartItem.quantity;
        const subtotal = item.price * quantity;
        total += subtotal;

        const outOfStock = item.stock === 0 || quantity === 0;
        const outOfStockText = outOfStock ? `<div class="out-of-stock">Hết hàng</div>` : '';

        const row = `
        <tr>
            <td>
                <input type="checkbox" class="item-checkbox" data-index="${index}" ${outOfStock ? 'disabled' : ''}>
            </td>
            <td>
                <img src="${item.imageUrl}" alt="${item.name}" style="width:50px; vertical-align: middle;">
                <div style="display:inline-block; margin-left: 10px;">
                    ${item.name}
                    ${outOfStockText}
                </div>
            </td>
            <td>₫${item.price.toLocaleString('vi-VN')}</td>
            <td>${quantity}</td>
            <td>₫${subtotal.toLocaleString('vi-VN')}</td>
            <td><button onclick="removeFromCart(${index})">Xoá</button></td>
        </tr>
        `;

        cartBody.innerHTML += row;
    });

    cartTotalEl.textContent = `₫${total.toLocaleString('vi-VN')}`;
    attachCheckboxListeners();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartTable();
    updateCartCount();
    updateSummary();
}

function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => {
        if (!cb.disabled) cb.checked = checkbox.checked;
    });
    updateSummary();
}

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateSummary);
    });
}

function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let totalItems = 0;
    let totalAmount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) {
            const index = parseInt(cb.getAttribute('data-index'));
            const item = cart[index];
            totalItems += item.quantity;
            totalAmount += item.price * item.quantity;
        }
    });

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalAmount').textContent = `₫${totalAmount.toLocaleString('vi-VN')}`;
}

function checkout() {
    alert("Bạn đã nhấn nút Mua hàng!");
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartTable();
    updateSummary();
});
