// JavaScript/categoryPage.js

document.addEventListener('DOMContentLoaded', () => {
    const storedItemsData = JSON.parse(localStorage.getItem('allItemsData')) || [];
    const allItems = storedItemsData.map(data => new Item(
        data.id, data.name, data.price, data.imageUrl, data.description,
        data.category, data.stock, data.isFlashSale, data.originalPrice,
        data.salePrice, data.soldQuantity
    ));

    const categoryCards = document.querySelectorAll('.category-card');
    const productSectionTitle = document.getElementById('productSectionTitle');
    const categoryNavLink = document.getElementById('categoryNavLink');
    const homepageNavLink = document.getElementById('homepageNavLink'); 

    displayItems(allItems, 'productGrid');
    updateNavLinkHighlight(categoryNavLink); 

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            let filteredItems;
            let titleText = 'Danh sách sản phẩm';

            if (category === 'all') {
                filteredItems = allItems; 
                titleText = 'Tất cả sản phẩm';
                updateNavLinkHighlight(homepageNavLink); 
            } else {
                filteredItems = allItems.filter(item => item.category === category);
                titleText = `Sản phẩm thuộc danh mục: ${category}`;
                updateNavLinkHighlight(categoryNavLink); 
            }

            displayItems(filteredItems, 'productGrid');
            productSectionTitle.textContent = titleText;
        });
    });

    if (categoryNavLink) {
        categoryNavLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            displayItems(allItems, 'productGrid'); 
            productSectionTitle.textContent = 'Tất cả sản phẩm';
            updateNavLinkHighlight(categoryNavLink); 
        });
    }

    function displayItems(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Không tìm thấy container với ID: ${containerId}`);
            return;
        }

        if (items.length === 0) {
            container.innerHTML = '<p>Không có sản phẩm nào trong danh mục này.</p>';
            return;
        }

        container.innerHTML = items.map(item => item.toHtmlCard()).join('');

        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                addToCart(productId, 1); 
            });
        });

        container.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                const product = allItems.find(p => p.id === productId);

                if (product) {
                    if (product.stock > 0) {
                        addToCart(productId, 1); 

                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        const itemInCartIndex = cart.findIndex(item => item.id === productId);
                        if (itemInCartIndex !== -1) {
                            cart[itemInCartIndex].autoSelected = true;
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.location.href = 'cart.html'; 
                    } else {
                        alert('Sản phẩm này đã hết hàng.');
                    }
                }
            });
        });
    }

    function updateNavLinkHighlight(activeLink) {
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.classList.remove('current-page');
        });
        if (activeLink) {
            activeLink.classList.add('current-page');
        }
    }
});