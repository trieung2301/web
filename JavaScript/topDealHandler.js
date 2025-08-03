// JavaScript/topDealHandler.js

document.addEventListener('DOMContentLoaded', () => {
    const top3ProductsContainer = document.getElementById('top3ProductsContainer');
    const otherTopDealsContainer = document.getElementById('otherTopDealsContainer');

    if (!top3ProductsContainer || !otherTopDealsContainer) {
        console.error("Không tìm thấy container cho Top Deal. Vui lòng kiểm tra lại ID HTML.");
        return;
    }

    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    const sortedProducts = [...allItems].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));

    const top3Products = sortedProducts.slice(0, 3);
    const otherProducts = sortedProducts.slice(3);

    if (top3Products.length >= 3) {
        top3ProductsContainer.innerHTML = ''; 

        const actualTop2Card = createProductCardElement(top3Products[1]);
        actualTop2Card.classList.add('top-2');
        top3ProductsContainer.appendChild(actualTop2Card);

        const actualTop1Card = createProductCardElement(top3Products[0]);
        actualTop1Card.classList.add('top-1');
        top3ProductsContainer.appendChild(actualTop1Card);

        const actualTop3Card = createProductCardElement(top3Products[2]);
        actualTop3Card.classList.add('top-3');
        top3ProductsContainer.appendChild(actualTop3Card);

    } else if (top3Products.length > 0) {
        top3ProductsContainer.innerHTML = ''; 
        top3Products.forEach(product => {
            const actualCard = createProductCardElement(product);
            top3ProductsContainer.appendChild(actualCard);
        });
        top3ProductsContainer.style.justifyContent = 'center'; 
        top3ProductsContainer.style.gap = '20px'; 
    } else {
        top3ProductsContainer.innerHTML = "<p style='text-align: center; width: 100%;'>Chưa có sản phẩm nào được bán.</p>";
    }

    if (otherProducts.length > 0) {
        otherTopDealsContainer.innerHTML = ''; 
        otherProducts.forEach(product => {
            otherTopDealsContainer.appendChild(createProductCardElement(product));
        });
    } else {
        otherTopDealsContainer.innerHTML = "<p style='text-align: center; width: 100%;'>Không có sản phẩm bán chạy khác.</p>";
    }

    attachProductActionListeners(top3ProductsContainer);
    attachProductActionListeners(otherTopDealsContainer);
});

function createProductCardElement(product) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = product.toHtmlCard();
    return tempDiv.firstElementChild; 
}

function attachProductActionListeners(container) {
    container.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.removeEventListener('click', handleAddToCartClick); 
        button.addEventListener('click', handleAddToCartClick);
    });

    container.querySelectorAll('.buy-now-btn').forEach(button => {
        button.removeEventListener('click', handleBuyNowClick);
        button.addEventListener('click', handleBuyNowClick);
    });
}

function handleAddToCartClick(event) {
    const productId = parseInt(event.target.dataset.productId);
    addToCart(productId, 1); 
    showAddedToCartMessage(); 
}

function handleBuyNowClick(event) {
    const productId = parseInt(event.target.dataset.productId);
    addToCart(productId, 1); 

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCartIndex = cart.findIndex(item => item.id === productId);
    if (itemInCartIndex !== -1) {
        cart[itemInCartIndex].autoSelected = true;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html'; 
}