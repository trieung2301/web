let orders = JSON.parse(localStorage.getItem('orders')) || [];
let selectedOrderId = null;

function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('ordersTableBody');

    if (!tableBody) return;

    tableBody.innerHTML = '';

    orders.forEach(order => {
        const customerName = order.customerInfo
            ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}`
            : 'Không rõ';

        const row = `
            <tr>
                <td>${order.userId || 'Không có'}</td>
                <td>${order.orderId}</td>
                <td>${customerName}</td>
                <td>${order.orderDate || 'Không xác định'}</td>
                <td>${order.status || 'Không xác định'}</td>
                <td><button onclick="viewOrderDetail('${order.orderId}')">Xem chi tiết</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}



function getOrderStatusText(status) {
    switch (status) {
        case 'Chờ xử lý': return 'Chờ xử lý';
        case 'Đã xác nhận': return 'Đã xác nhận';
        case 'Đã giao': return 'Đã giao';
        case 'Đã hủy': return 'Đã hủy';
        default: return 'Không xác định';
    }
}

function viewOrderDetail(orderId) {
    // Cập nhật lại orders từ localStorage để chắc chắn không rỗng
    orders = JSON.parse(localStorage.getItem('orders')) || [];

    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    selectedOrderId = orderId;

    const content = document.getElementById('orderDetailContent');
    const statusSelect = document.getElementById('orderStatusSelect');
    statusSelect.value = order.status || "pending";

    let itemsHtml = '<ul>';
    order.items.forEach(item => {
        itemsHtml += `<li>${item.name} - SL: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')} VNĐ</li>`;
    });
    itemsHtml += '</ul>';

    const formattedDate = order.orderDate || order.date
        ? order.orderDate || new Date(order.date).toLocaleString('vi-VN')
        : "Không rõ";

    const customerName = order.customerInfo
        ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}`.trim() ||
        order.customerInfo.fullName || order.customerInfo.name || 'Không rõ'
        : 'Không rõ';

    content.innerHTML = `
        <p><strong>Người đặt:</strong> ${customerName}</p>
        <p><strong>Ngày đặt:</strong> ${formattedDate}</p>
        <p><strong>Sản phẩm:</strong> ${itemsHtml}</p>
        <p><strong>Tổng tiền:</strong> ${(order.totalAmount || order.total || 0).toLocaleString('vi-VN')} VNĐ</p>
    `;

    document.getElementById('orderDetailModal').style.display = 'block';
}



function updateOrderStatus() {
    const status = document.getElementById('orderStatusSelect').value;
    const index = orders.findIndex(o => o.orderId === selectedOrderId);
    if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        alert('Cập nhật trạng thái đơn hàng thành công.');
        renderOrders();
        closeOrderDetail();
    }
}

function closeOrderDetail() {
    document.getElementById('orderDetailModal').style.display = 'none';
    selectedOrderId = null;
}

// Gọi khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
});

