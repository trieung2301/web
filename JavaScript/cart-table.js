// JavaScript/cart-table.js

function renderCartTable() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cartBody');
    const cartTotalEl = document.getElementById('cartTotal');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');

    cartBody.innerHTML = ''; 
    let total = 0; 

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    if (cartItems.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Giỏ hàng trống</td></tr>';
        if (cartTotalEl) cartTotalEl.textContent = '₫0';
        if (selectAllCheckbox) selectAllCheckbox.checked = false; 
        updateSummary(); 
        return;
    }

    cartItems.forEach((cartItem, index) => {
        const item = allItems.find(p => p.id === cartItem.id);

        if (!item) {
            console.warn(`Không tìm thấy sản phẩm với ID: ${cartItem.id} trong dữ liệu.`);
            return;
        }

        const quantity = cartItem.quantity;
        const subtotal = item.price * quantity; 
        total += subtotal;

        const isOutOfStock = item.stock <= 0; 
        const quantityExceedsStock = quantity > item.stock && item.stock > 0; 

        let outOfStockText = '';
        let quantityWarningText = '';
        let disableCheckbox = false;

        if (isOutOfStock) {
            outOfStockText = `<div class="out-of-stock" style="color: red; font-size: 0.8em;">Hết hàng!</div>`;
            disableCheckbox = true;
            cartItem.autoSelected = false; 
        } else if (quantityExceedsStock) {
            quantityWarningText = `<div class="quantity-warning" style="color: orange; font-size: 0.8em;">Chỉ còn ${item.stock} sản phẩm!</div>`;
        }

        const isChecked = cartItem.autoSelected && !isOutOfStock ? 'checked' : '';

        const row = `
            <tr data-index="${index}">
                <td>
                    <input type="checkbox" class="item-checkbox" data-index="${index}" ${disableCheckbox ? 'disabled' : ''} ${isChecked}>
                </td>
                <td class="item-name">
                    <img src="${item.imageUrl}" alt="${item.name}" style="width:50px; height:50px; object-fit: cover; vertical-align: middle;">
                    <div style="display:inline-block; margin-left: 10px;">
                        <a href="product-detail.html?id=${item.id}">${item.name}</a>
                        ${outOfStockText}
                        ${quantityWarningText}
                    </div>
                </td>
                <td class="item-price">${item.getFormattedPrice(item.price)}</td>
                <td>
                    <input type="number" class="item-quantity" value="${quantity}" min="1" max="${item.stock}" data-index="${index}" ${isOutOfStock ? 'disabled' : ''}>
                </td>
                <td class="item-total">${item.getFormattedPrice(subtotal)}</td>
                <td><button class="delete-button" onclick="removeFromCart(${index})">Xoá</button></td>
            </tr>
        `;

        cartBody.innerHTML += row;

        if (cartItem.autoSelected) {
            cartItem.autoSelected = false;
        }
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));

    if (cartTotalEl) cartTotalEl.textContent = `${total.toLocaleString('vi-VN')}₫`;

    attachCheckboxListeners();
    attachQuantityListeners();
    updateSummary(); 
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartTable(); 
        updateCartCount(); 
    }
}

function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => {
        if (!cb.disabled) {
            cb.checked = checkbox.checked;
        }
    });
    updateSummary(); 
}

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => {
        cb.removeEventListener('change', updateSummary); 
        cb.addEventListener('change', updateSummary);
    });
}

function attachQuantityListeners() {
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.removeEventListener('change', handleQuantityChange); 
        input.addEventListener('change', handleQuantityChange);
    });
}

function handleQuantityChange(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    let newQuantity = parseInt(input.value);

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItem = cart[index];
    const product = allItems.find(p => p.id === cartItem.id);

    if (!product) {
        alert("Sản phẩm không còn tồn tại.");
        renderCartTable();
        return;
    }

    if (isNaN(newQuantity) || newQuantity < 1) {
        alert("Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn 0.");
        input.value = cartItem.quantity; 
        return;
    }

    if (newQuantity > product.stock) {
        alert(`Số lượng bạn muốn mua (${newQuantity}) vượt quá số lượng tồn kho (${product.stock}) của sản phẩm "${product.name}".`);
        newQuantity = product.stock; 
        input.value = newQuantity;
        if (newQuantity === 0) { 
            const checkbox = document.querySelector(`.item-checkbox[data-index="${index}"]`);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.disabled = true;
            }
        }
    }

    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));

    renderCartTable(); 
}

function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let totalItems = 0;
    let totalAmount = 0;

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    checkboxes.forEach(cb => {
        if (cb.checked && !cb.disabled) { 
            const index = parseInt(cb.getAttribute('data-index'));
            const cartItem = cart[index];
            
            const item = allItems.find(p => p.id === cartItem.id);

            if (item) { 
                totalItems += cartItem.quantity;
                totalAmount += item.price * cartItem.quantity; 
            }
        }
    });

    const totalItemsEl = document.getElementById('totalItems');
    const totalAmountEl = document.getElementById('totalAmount');

    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalAmountEl) totalAmountEl.textContent = `${totalAmount.toLocaleString('vi-VN')}₫`;
}

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
        
        if (selectedItem && !checkbox.disabled) {
            selectedItems.push(selectedItem);
        }
    });

    if (selectedItems.length === 0) {
        alert("Không có sản phẩm hợp lệ nào được chọn để thanh toán.");
        return;
    }

    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    window.location.href = 'purchase.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartTable(); 
});