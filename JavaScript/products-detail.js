// JavaScript/product-detail.js

document.addEventListener('DOMContentLoaded', () => {
    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    const productId = parseInt(getUrlParameter('id'));
    const product = allItems.find(item => item.id === productId);
    const productDetailContainer = document.getElementById('productDetailContainer');

    if (product) {
        productDetailContainer.innerHTML = product.toDetailHtml();

        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');

        const handleProductAction = (isBuyNow = false) => {
            const quantity = parseInt(quantityInput.value);

            if (isNaN(quantity) || quantity <= 0) {
                alert("Vui lòng nhập số lượng hợp lệ (lớn hơn 0).");
                return;
            }

            if (quantity > product.stock) {
                alert(`Số lượng bạn muốn mua (${quantity}) vượt quá số lượng tồn kho (${product.stock}) của sản phẩm này.`);
                quantityInput.value = product.stock;
                return;
            }
            
            addToCart(product.id, quantity); 
            
            if (isBuyNow) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemInCartIndex = cart.findIndex(item => item.id === product.id);
                if (itemInCartIndex !== -1) {
                    cart[itemInCartIndex].autoSelected = true;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.href = 'cart.html'; 
            } else {
                updateCartCount(); 
                showAddedToCartMessage(); 
            }
        };

        addToCartBtn?.addEventListener('click', () => handleProductAction(false));

        buyNowBtn?.addEventListener('click', () => handleProductAction(true));

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
    box.style.background = '#28a745'; 
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