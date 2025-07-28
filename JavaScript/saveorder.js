document.addEventListener("DOMContentLoaded", () => {
    const viewIndex = localStorage.getItem("viewOrderIndex");

    if (viewIndex !== null) {
        const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
        const order = history[parseInt(viewIndex)];

        if (order) {
            // Gán dữ liệu vào các input
            document.getElementById("firstName").value = order.name.split(" ").slice(-1).join(" ");
            document.getElementById("lastName").value = order.name.split(" ").slice(0, -1).join(" ");
            document.getElementById("address1").value = order.address;
            document.getElementById("phone").value = order.phone;

            document.querySelectorAll('input[name="payment"]').forEach(radio => {
                if (radio.value === order.paymentMethod) radio.checked = true;
            });

            // Render lại sản phẩm
            const itemsBody = document.getElementById('itemsBody');
            let total = 0;

            order.items.forEach(item => {
                const allItemsData = JSON.parse(localStorage.getItem("allItemsData")) || [];
                const product = allItemsData.find(p => p.id === item.id);
                if (product) {
                    const subTotal = product.price * item.quantity;
                    total += subTotal;

                    itemsBody.innerHTML += `
                                <tr>
                                    <td>${product.name} x ${item.quantity}</td>
                                    <td>₫${subTotal.toLocaleString('vi-VN')}</td>
                                </tr>
                            `;
                }
            });

            document.getElementById("subtotal").textContent = `₫${total.toLocaleString('vi-VN')}`;
            document.getElementById("totalPrice").textContent = `₫${total.toLocaleString('vi-VN')}`;

            // Ẩn nút đặt hàng
            document.querySelector(".place-order")?.remove();
        }

        localStorage.removeItem("viewOrderIndex");
    }
});