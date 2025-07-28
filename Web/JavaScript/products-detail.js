
document.addEventListener('DOMContentLoaded', () => {
    const productId = parseInt(getUrlParameter('id'));
    const product = allItemsData.find(item => item.id === productId);
    const productDetailContainer = document.getElementById('productDetailContainer');

    if (product) {
        productDetailContainer.innerHTML = product.toDetailHtml();

        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');

        addToCartBtn?.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0 && quantity <= product.stock) {
                addToCart(product, quantity);
                updateCartCount();
                showAddedToCartMessage();
            } else {
                alert(`Số lượng phải từ 1 đến ${product.stock}`);
            }
        });

        buyNowBtn?.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0 && quantity <= product.stock) {
                alert(`Mua ngay ${quantity} ${product.name}! (Chuyển đến trang thanh toán)`);
            } else {
                alert(`Số lượng phải từ 1 đến ${product.stock}`);
            }
        });

        quantityInput?.addEventListener('change', () => {
            let val = parseInt(quantityInput.value);
            if (isNaN(val) || val < 1) {
                quantityInput.value = 1;
            } else if (val > product.stock) {
                quantityInput.value = product.stock;
                alert(`Số lượng tối đa có thể mua là ${product.stock}`);
            }
        });
    } else {
        productDetailContainer.innerHTML = '<p>Không tìm thấy sản phẩm này.</p>';
    }
});
function showAddedToCartMessage() {
    const box = document.createElement('div');
    box.textContent = 'Đã thêm vào giỏ hàng';
    box.style.position = 'fixed';
    box.style.bottom = '40px';
    box.style.left = '50%';
    box.style.transform = 'translateX(-50%)';
    box.style.background = '#28a745'; // Màu xanh lá nhẹ (có thể đổi thành cam nếu muốn)
    box.style.color = '#fff';
    box.style.padding = '10px 20px';
    box.style.borderRadius = '20px';
    box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    box.style.fontSize = '14px';
    box.style.opacity = '0';
    box.style.transition = 'opacity 0.3s ease';
    box.style.zIndex = '9999';
    document.body.appendChild(box);

    requestAnimationFrame(() => {
        box.style.opacity = '1';
    });

    setTimeout(() => {
        box.style.opacity = '0';
        setTimeout(() => box.remove(), 300);
    }, 1500);
}
function addToCart(product, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tìm sản phẩm đã có
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}