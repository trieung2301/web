// adminProducts.js

let adminItems = [];

function loadProducts() {
    let storedData = JSON.parse(localStorage.getItem('allItemsData'));

    if (storedData && storedData.length > 0) {
        adminItems = storedData.map(data => new Item(
            data.id, data.name, data.price, data.imageUrl, data.description,
            data.category, data.stock, data.isFlashSale, data.originalPrice,
            data.salePrice, data.soldQuantity
        ));
    } else {
        adminItems = allItemsData.map(data => new Item(
            data.id, data.name, data.price, data.imageUrl, data.description,
            data.category, data.stock, data.isFlashSale, data.originalPrice,
            data.salePrice, data.soldQuantity
        ));
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('allItemsData', JSON.stringify(adminItems));
}

function getUniqueCategories() {
    const categories = new Set();
    adminItems.forEach(item => {
        if (item.category) {
            categories.add(item.category);
        }
    });
    return Array.from(categories).sort();
}

function renderAdminProductTable() {
    const productTableBody = document.getElementById('productTableBody');
    if (!productTableBody) {
        console.error("Lỗi: Không tìm thấy phần tử tbody với id 'productTableBody'.");
        return;
    }

    productTableBody.innerHTML = '';

    adminItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">${item.name}</td>
            <td>${item.getFormattedPrice(item.price)}</td>
            <td>${item.stock}</td>
            <td>${item.category || 'N/A'}</td>
            <td>
                <button class="edit-btn" data-id="${item.id}">Sửa</button>
                <button class="delete-btn" data-id="${item.id}">Xóa</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.id);
            const productToEdit = adminItems.find(p => p.id === productId);
            if (productToEdit) {
                openProductForm(productToEdit);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.id);
            deleteProduct(productId);
        });
    });
}

function openProductForm(item = null) {
    const productFormContainer = document.getElementById('productFormContainer');
    const productForm = document.getElementById('productForm');
    const productFormTitle = document.getElementById('productFormTitle');
    const productIdField = document.getElementById('productId');
    const productNameField = document.getElementById('productName');
    const productPriceField = document.getElementById('productPrice');
    const productImageUrlField = document.getElementById('productImageUrl');
    const productDescriptionField = document.getElementById('productDescription');
    const productCategorySelect = document.getElementById('productCategory');
    const productStockField = document.getElementById('productStock');
    const isFlashSaleCheckbox = document.getElementById('isFlashSale');
    const originalPriceField = document.getElementById('originalPrice');
    const salePriceField = document.getElementById('salePrice');
    const soldQuantityField = document.getElementById('soldQuantity');
    const flashSalePriceFields = document.getElementById('flashSalePriceFields');
    const productListSection = document.querySelector('.admin-content-area > div');

    if (!productFormContainer || !productForm || !productFormTitle || !productIdField || !productNameField || !productPriceField || !productImageUrlField || !productDescriptionField || !productCategorySelect || !productStockField || !isFlashSaleCheckbox || !originalPriceField || !salePriceField || !soldQuantityField || !flashSalePriceFields) {
        console.error("Lỗi: Một hoặc nhiều phần tử trong form sản phẩm không tìm thấy.");
        return;
    }

    if (productListSection) {
        productListSection.style.display = 'none';
    }

    productFormContainer.style.display = 'block';

    const categories = getUniqueCategories();
    productCategorySelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        productCategorySelect.appendChild(option);
    });


    if (item) {
        productFormTitle.textContent = 'Sửa Sản Phẩm';
        productIdField.value = item.id;
        productNameField.value = item.name;
        productPriceField.value = item.price;
        productImageUrlField.value = item.imageUrl;
        productDescriptionField.value = item.description;
        productCategorySelect.value = item.category || '';
        productStockField.value = item.stock;
        isFlashSaleCheckbox.checked = item.isFlashSale;
        originalPriceField.value = item.originalPrice !== null ? item.originalPrice : '';
        salePriceField.value = item.salePrice !== null ? item.salePrice : '';
        soldQuantityField.value = item.soldQuantity;

        flashSalePriceFields.style.display = isFlashSaleCheckbox.checked ? 'block' : 'none';

    } else {
        productFormTitle.textContent = 'Thêm Sản Phẩm Mới';
        productForm.reset();
        productIdField.value = '';
        productStockField.value = 100;
        soldQuantityField.value = 0;
        isFlashSaleCheckbox.checked = false;
        flashSalePriceFields.style.display = 'none';
        productCategorySelect.value = '';
    }
}

function closeProductForm() {
    const productFormContainer = document.getElementById('productFormContainer');
    const productForm = document.getElementById('productForm');
    const productListSection = document.querySelector('.admin-content-area > div');

    if (productFormContainer) {
        productFormContainer.style.display = 'none';
        productForm.reset();
    }
    if (productListSection) {
        productListSection.style.display = 'block';
    }
}

function handleProductFormSubmit(event) {
    event.preventDefault();

    const productIdField = document.getElementById('productId');
    const productNameField = document.getElementById('productName');
    const productPriceField = document.getElementById('productPrice');
    const productImageUrlField = document.getElementById('productImageUrl');
    const productDescriptionField = document.getElementById('productDescription');
    const productCategorySelect = document.getElementById('productCategory');
    const productStockField = document.getElementById('productStock');
    const isFlashSaleCheckbox = document.getElementById('isFlashSale');
    const originalPriceField = document.getElementById('originalPrice');
    const salePriceField = document.getElementById('salePrice');
    const soldQuantityField = document.getElementById('soldQuantity');

    const id = productIdField.value ? parseInt(productIdField.value) : null;
    const name = productNameField.value;
    const imageUrl = productImageUrlField.value;
    const description = productDescriptionField.value;
    const category = productCategorySelect.value;
    const stock = parseInt(productStockField.value);
    const isFlashSale = isFlashSaleCheckbox.checked;
    const soldQuantity = parseInt(soldQuantityField.value);

    const rawOriginalPrice = parseFloat(originalPriceField.value);
    const rawSalePrice = parseFloat(salePriceField.value);

    let finalOriginalPrice = isNaN(rawOriginalPrice) ? null : rawOriginalPrice;
    let finalSalePrice = isNaN(rawSalePrice) ? null : rawSalePrice;

    if (!name || isNaN(stock) || !imageUrl || !category) {
        alert('Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc (Tên, Số lượng, URL ảnh, Danh mục).');
        return;
    }

    if (isFlashSale) {
        if (isNaN(rawOriginalPrice) || isNaN(rawSalePrice)) {
            alert('Vui lòng điền đầy đủ giá gốc và giá khuyến mãi cho sản phẩm Flash Sale.');
            return;
        }
    } else {
        finalSalePrice = null;
        if (isNaN(rawOriginalPrice)) {
             finalOriginalPrice = null;
        }
    }

    let finalPrice;
    if (isFlashSale) {
        finalPrice = (finalSalePrice !== null) ? finalSalePrice : finalOriginalPrice;
        if (finalPrice === null) {
            finalPrice = parseFloat(productPriceField.value) || 0;
        }
    } else {
        finalPrice = (finalOriginalPrice !== null) ? finalOriginalPrice : parseFloat(productPriceField.value);
        if (isNaN(finalPrice)) {
            finalPrice = 0;
        }
    }


    if (id) {
        const index = adminItems.findIndex(item => item.id === id);
        if (index !== -1) {
            adminItems[index].name = name;
            adminItems[index].price = finalPrice;
            adminItems[index].imageUrl = imageUrl;
            adminItems[index].description = description;
            adminItems[index].category = category;
            adminItems[index].stock = stock;
            adminItems[index].isFlashSale = isFlashSale;
            adminItems[index].originalPrice = finalOriginalPrice;
            adminItems[index].salePrice = finalSalePrice;
            adminItems[index].soldQuantity = soldQuantity;
        }
        alert('Sản phẩm đã được cập nhật thành công!');
    } else {
        const newId = adminItems.length > 0 ? Math.max(...adminItems.map(item => item.id)) + 1 : 1;
        const newItem = new Item(
            newId, name, finalPrice, imageUrl, description,
            category, stock, isFlashSale, finalOriginalPrice, finalSalePrice, soldQuantity
        );
        adminItems.push(newItem);
        alert('Sản phẩm mới đã được thêm thành công!');
    }

    saveProducts();
    renderAdminProductTable();
    closeProductForm();
}

function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
        adminItems = adminItems.filter(item => item.id !== id);
        saveProducts();
        renderAdminProductTable();
        alert('Sản phẩm đã được xóa thành công!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.');
        window.location.href = 'login.html';
        return;
    }

    loadProducts();
    renderAdminProductTable();

    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductForm());
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }

    const cancelProductFormBtn = document.getElementById('cancelProductFormBtn');
    if (cancelProductFormBtn) {
        cancelProductFormBtn.addEventListener('click', closeProductForm);
    }
    
    const isFlashSaleCheckbox = document.getElementById('isFlashSale');
    const flashSalePriceFields = document.getElementById('flashSalePriceFields');
    if (isFlashSaleCheckbox && flashSalePriceFields) {
        isFlashSaleCheckbox.addEventListener('change', () => {
            flashSalePriceFields.style.display = isFlashSaleCheckbox.checked ? 'block' : 'none';
        });
    }
});