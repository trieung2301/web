document.addEventListener('DOMContentLoaded', () => {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    const allItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];

    const itemsBody = document.getElementById('itemsBody');
    const totalPriceEl = document.getElementById('totalPrice');
    const subtotalSpan = document.getElementById('subtotal'); // nếu có

    if (selectedItems.length === 0) {
        itemsBody.innerHTML = '<tr><td colspan="5">Không có sản phẩm nào được chọn.</td></tr>';
        totalPriceEl.textContent = '₫0';
        if (subtotalSpan) subtotalSpan.textContent = '₫0';
        return;
    }

    let total = 0;

    selectedItems.forEach(cartItem => {
        const item = allItemsData.find(p => p.id === cartItem.id);
        if (!item) return;

        const subTotal = item.price * cartItem.quantity;
        total += subTotal;

        itemsBody.innerHTML += `
    <tr>
        <td>${item.name}${cartItem.quantity > 1 ? ` x${cartItem.quantity}` : ''}</td>
        <td>₫${subTotal.toLocaleString('vi-VN')}</td>
    </tr>
`;
    });

    totalPriceEl.textContent = `₫${total.toLocaleString('vi-VN')}`;
    if (subtotalSpan) subtotalSpan.textContent = `₫${total.toLocaleString('vi-VN')}`;
});


function submitOrder() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address1").value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (!firstName || !lastName || !address || !paymentMethod) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    // Thông tin đơn hàng
    const orderInfo = {
        name: `${lastName} ${firstName}`,
        phone,
        address,
        paymentMethod,
        date: new Date().toLocaleString('vi-VN'),
        items: JSON.parse(localStorage.getItem("selectedItems")) || [],
        allItemsData: JSON.parse(localStorage.getItem("allItemsData")) || [],
    };

    // Lưu vào history
    const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
    history.push(orderInfo);
    localStorage.setItem("purchaseHistory", JSON.stringify(history));

    // Cập nhật giỏ hàng
    const selected = orderInfo.items;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (selected.length === cart.length) {
        localStorage.removeItem("cart");
    } else {
        const remaining = cart.filter(ci => !selected.find(si => si.id === ci.id));
        localStorage.setItem("cart", JSON.stringify(remaining));
    }

    localStorage.removeItem("selectedItems");
    alert("Đặt hàng thành công!");
    window.location.href = "index.html";
}
