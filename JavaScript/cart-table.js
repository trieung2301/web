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

        // Nếu có autoSelected thì checkbox sẽ được tick sẵn
        const isChecked = cartItem.autoSelected ? 'checked' : '';

        const row = `
<tr data-index="${index}">
    <td>
        <input type="checkbox" class="item-checkbox" data-index="${index}" ${outOfStock ? 'disabled' : ''} ${isChecked}>
    </td>
    <td class="item-name">
        <img src="${item.imageUrl}" alt="${item.name}" style="width:50px; vertical-align: middle;">
        <div style="display:inline-block; margin-left: 10px;">
            ${item.name}
            ${outOfStockText}
        </div>
    </td>
    <td class="item-price">₫${item.price.toLocaleString('vi-VN')}</td>
    <td><input type="number" class="item-quantity" value="${quantity}" min="1" data-index="${index}"></td>

    <td class="item-total">₫${subtotal.toLocaleString('vi-VN')}</td>
    <td><button onclick="removeFromCart(${index})">Xoá</button></td>
</tr>
`;

        cartBody.innerHTML += row;

        // Xoá autoSelected sau khi render để không lưu mãi
        if (cartItem.autoSelected) {
            cartItem.autoSelected = false;
        }
    });

    // Cập nhật cart sau khi xóa autoSelected
    localStorage.setItem('cart', JSON.stringify(cartItems));

    cartTotalEl.textContent = `₫${total.toLocaleString('vi-VN')}`;
    attachCheckboxListeners();
    attachQuantityListeners();
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
function attachQuantityListeners() {
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(input.getAttribute('data-index'));
            const newQuantity = parseInt(e.target.value);
            if (newQuantity < 1 || isNaN(newQuantity)) {
                alert("Số lượng không hợp lệ.");
                renderCartTable(); // render lại để khôi phục số lượng cũ
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartTable();
            updateCartCount();
            updateSummary();
        });
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
            const cartItem = cart[index];
            const item = allItemsData.find(p => p.id === cartItem.id); // 💡 sửa chỗ này

            if (!item) return;

            totalItems += cartItem.quantity;
            totalAmount += item.price * cartItem.quantity; // 💡 dùng item.price từ allItemsData
        }
    });

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalAmount').textContent = `₫${totalAmount.toLocaleString('vi-VN')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartTable();
    updateSummary();
});
function checkout() {
    const checkboxes = document.querySelectorAll('#cartBody input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để mua.");
        return;
    }

    const selectedItems = [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const index = parseInt(row.getAttribute('data-index'));
        const selectedItem = cart[index];
        if (selectedItem) {
            selectedItems.push(selectedItem);
        }
    });

    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    localStorage.setItem('allItemsData', JSON.stringify(allItemsData));
    window.location.href = 'purchase.html';
}


