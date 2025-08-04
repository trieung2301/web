// JavaScript/saveorder.js

document.addEventListener('DOMContentLoaded', () => {
    const viewOrderId = localStorage.getItem('viewOrderId');
    const checkoutForm = document.getElementById('checkoutForm');
    const orderDetailsContainer = document.getElementById('orderDetailsContainer');

    if (viewOrderId) {
        if (checkoutForm) checkoutForm.style.display = 'none';
        displaySpecificOrder(viewOrderId);
        localStorage.removeItem('viewOrderId');
    } else {
        if (checkoutForm) checkoutForm.style.display = 'block';
        renderOrderSummary();
    }
    populateUserInfo();
    updateCartCount();
});

function renderOrderSummary() {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    const itemsBody = document.getElementById('itemsBody');
    const subtotalEl = document.getElementById('subtotal');
    const totalPriceEl = document.getElementById('totalPrice');

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    let currentSubtotal = 0;

    if (!itemsBody) {
        console.error("Element with ID 'itemsBody' not found.");
        return;
    }

    itemsBody.innerHTML = '';

    if (selectedItems.length === 0) {
        itemsBody.innerHTML = '<tr><td colspan="2">Không có sản phẩm nào được chọn để thanh toán.</td></tr>';
        if (subtotalEl) subtotalEl.textContent = '₫0';
        if (totalPriceEl) totalPriceEl.textContent = '₫0';
        return;
    }

    selectedItems.forEach(cartItem => {
        const item = allItems.find(p => p.id === cartItem.id);
        if (!item) {
            console.warn('Sản phẩm không tìm thấy trong dữ liệu gốc (ID):', cartItem.id);
            const row = `
                <tr>
                    <td>Không tìm thấy sản phẩm (ID: ${cartItem.id}) × ${cartItem.quantity}</td>
                    <td>${new Item().getFormattedPrice(cartItem.price * cartItem.quantity)}</td>
                </tr>
            `;
            itemsBody.innerHTML += row;
            currentSubtotal += (cartItem.price || 0) * cartItem.quantity;
            return;
        }

        const itemSubtotal = item.price * cartItem.quantity;
        currentSubtotal += itemSubtotal;

        const row = `
            <tr>
                <td>${item.name} × ${cartItem.quantity}</td>
                <td>${item.getFormattedPrice(itemSubtotal)}</td>
            </tr>
        `;
        itemsBody.innerHTML += row;
    });

    const formatter = allItems.length > 0 ? allItems[0] : new Item(0, '', 0);

    if (subtotalEl) subtotalEl.textContent = formatter.getFormattedPrice(currentSubtotal);
    if (totalPriceEl) totalPriceEl.textContent = formatter.getFormattedPrice(currentSubtotal);
}

function populateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === currentUser.username);
        if (user) {
            document.getElementById('lastName').value = user.lastName || '';
            document.getElementById('firstName').value = user.firstName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('address1').value = user.address1 || '';
            document.getElementById('address2').value = user.address2 || '';
            document.getElementById('city').value = user.city || '';
            document.getElementById('zipcode').value = user.zipcode || '';
        }
    }
}

function submitOrder() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm.checkValidity()) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
        checkoutForm.reportValidity();
        return;
    }

    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    if (selectedItems.length === 0) {
        alert("Không có sản phẩm nào để đặt hàng.");
        return;
    }

    let allItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = allItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    let orderTotal = 0;
    const itemsForOrder = [];

    for (const cartItem of selectedItems) {
        const itemInMasterList = allItems.find(p => p.id === cartItem.id);
        if (!itemInMasterList) {
            alert(`Sản phẩm (ID: ${cartItem.id}) không tồn tại trong danh sách sản phẩm. Vui lòng kiểm tra lại giỏ hàng.`);
            return;
        }
        if (itemInMasterList.stock < cartItem.quantity) {
            alert(`Sản phẩm "${itemInMasterList.name}" không đủ số lượng tồn kho. Chỉ còn ${itemInMasterList.stock} sản phẩm.`);
            return;
        }
        
        itemInMasterList.stock -= cartItem.quantity;
        itemInMasterList.soldQuantity = (itemInMasterList.soldQuantity || 0) + cartItem.quantity;

        orderTotal += itemInMasterList.price * cartItem.quantity;

        itemsForOrder.push({
            id: itemInMasterList.id,
            name: itemInMasterList.name,
            imageUrl: itemInMasterList.imageUrl,
            price: itemInMasterList.price,
            quantity: cartItem.quantity
        });
    }

    localStorage.setItem('allItemsData', JSON.stringify(allItems.map(item => item.toPlainObject())));

    const customerInfo = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        country: document.getElementById('country').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value,
        zipcode: document.getElementById('zipcode').value,
        city: document.getElementById('city').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        note: document.getElementById('note').value,
    };

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser && currentUser.username ? currentUser.username : 'guest';

    const order = {
        orderId: `ORD-${Date.now()}`,
        userId: userId,
        customerInfo: customerInfo,
        items: itemsForOrder,
        totalAmount: orderTotal,
        paymentMethod: paymentMethod,
        orderDate: new Date().toLocaleString('vi-VN'),
        status: 'Đang chờ xác nhận'
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const remainingCartItems = currentCart.filter(cartItem =>
        !selectedItems.some(selected => selected.id === cartItem.id)
    );
    localStorage.setItem('cart', JSON.stringify(remainingCartItems));
    updateCartCount();

    localStorage.removeItem('selectedItems');

    alert("Đặt hàng thành công!");

    displayConfirmedOrder(order);

    if (checkoutForm) checkoutForm.style.display = 'none';
}

function displayConfirmedOrder(order, isFromHistory = false) {
    const orderDetailsContainer = document.getElementById('orderDetailsContainer');
    if (!orderDetailsContainer) {
        console.error("Không tìm thấy orderDetailsContainer.");
        return;
    }

    const tempItemInstance = new Item(0, '', 0);

    let itemsHtml = order.items.map(item => {
        const imageUrl = item.imageUrl || 'https://via.placeholder.com/80?text=No+Image';
        const priceDisplay = tempItemInstance.getFormattedPrice(item.price);
        const subtotalDisplay = tempItemInstance.getFormattedPrice(item.price * item.quantity);

        return `
            <div class="product-detail-item" style="display: flex; align-items: center; margin-bottom: 15px; border: 1px solid #eee; padding: 10px; border-radius: 5px; background-color: #fff;">
                <img src="${imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px; border-radius: 4px;">
                <div class="info">
                    <p style="margin: 0;"><strong>${item.name}</strong></p>
                    <p style="margin: 0; font-size: 0.9em; color: #555;">Số lượng: ${item.quantity}</p>
                    <p style="margin: 0; font-size: 0.9em; color: #555;">Giá đơn vị: ${priceDisplay}</p>
                    <p style="margin: 0; font-weight: bold; color: #333;">Thành tiền: ${subtotalDisplay}</p>
                </div>
            </div>
        `;
    }).join('');

    let buttonsHtml = '';
    if (isFromHistory) {
        buttonsHtml = `
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="window.location.href='purchasehistory.html'" 
                        style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em;">
                    Quay lại lịch sử mua hàng
                </button>
            </div>
        `;
    } else {
        buttonsHtml = `
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="window.location.href='index.html'" 
                        style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em;">
                    Tiếp tục mua sắm
                </button>
                <button onclick="window.location.href='purchasehistory.html'" 
                        style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px; font-size: 1.1em;">
                    Xem lịch sử đơn hàng
                </button>
            </div>
        `;
    }

    orderDetailsContainer.innerHTML = `
        <div class="order-details-display" style="max-width: 800px; margin: 30px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background-color: #fff;">
            <h2 style="text-align: center; color: #333; margin-bottom: 25px;">${isFromHistory ? 'Chi tiết đơn hàng' : 'Đơn hàng của bạn đã được đặt thành công!'}</h2>
            
            <p style="margin-bottom: 8px;"><strong>Mã đơn hàng:</strong> <span style="color: #007bff; font-weight: bold;">#${order.orderId}</span></p>
            <p style="margin-bottom: 8px;"><strong>Ngày đặt hàng:</strong> ${order.orderDate}</p>
            <p style="margin-bottom: 20px;"><strong>Trạng thái:</strong> <span style="color: ${order.status === 'Đang chờ xác nhận' ? 'orange' : 'green'}; font-weight: bold;">${order.status}</span></p>
            
            <h3 style="color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 25px; margin-bottom: 15px;">Thông tin người nhận:</h3>
            <p style="margin-bottom: 5px;"><strong>Họ tên:</strong> ${order.customerInfo.lastName} ${order.customerInfo.firstName}</p>
            <p style="margin-bottom: 5px;"><strong>Địa chỉ:</strong> ${order.customerInfo.address1}, ${order.customerInfo.address2 ? order.customerInfo.address2 + ', ' : ''} ${order.customerInfo.city}, ${order.customerInfo.country}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p style="margin-bottom: 15px;"><strong>Điện thoại:</strong> ${order.customerInfo.phone}</p>
            ${order.customerInfo.note ? `<p style="font-style: italic; color: #777;"><strong>Ghi chú:</strong> ${order.customerInfo.note}</p>` : ''}

            <h3 style="color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 25px; margin-bottom: 15px;">Sản phẩm đã mua:</h3>
            <div class="order-products-list">
                ${itemsHtml}
            </div>
            
            <p style="font-size: 1.3em; font-weight: bold; text-align: right; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                Tổng cộng: <span style="color: #dc3545;">${tempItemInstance.getFormattedPrice(order.totalAmount)}</span>
            </p>
            <p style="text-align: right; font-size: 1em; color: #666; margin-top: 10px;">Phương thức thanh toán: ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</p>
            
            ${buttonsHtml}
        </div>
    `;
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.style.display = 'none';
}

function displaySpecificOrder(orderId) {
    const orderDetailsContainer = document.getElementById('orderDetailsContainer');
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = allOrders.find(o => o.orderId === orderId);

    if (!orderDetailsContainer) {
        console.error("Không tìm thấy orderDetailsContainer.");
        return;
    }

    if (order) {
        displayConfirmedOrder(order, true);
    } else {
        orderDetailsContainer.innerHTML = `
            <div class="order-details-display" style="max-width: 600px; margin: 50px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; text-align: center; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <h2 style="color: #dc3545; margin-bottom: 20px;">Đơn hàng không tìm thấy.</h2>
                <p style="margin-bottom: 30px; font-size: 1.1em;">Không tìm thấy thông tin chi tiết cho đơn hàng này.</p>
                <button onclick="window.location.href='purchasehistory.html'" 
                        style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em;">
                    Quay lại lịch sử mua hàng
                </button>
            </div>
        `;
    }
}

if (typeof Item !== 'undefined' && !Item.prototype.toPlainObject) {
    Item.prototype.toPlainObject = function() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            imageUrl: this.imageUrl,
            description: this.description,
            category: this.category,
            stock: this.stock,
            isFlashSale: this.isFlashSale,
            originalPrice: this.originalPrice,
            salePrice: this.salePrice,
            soldQuantity: this.soldQuantity
        };
    };
}