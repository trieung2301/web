// flashSale.js

let countdownInterval;

function updateCountdown() {
    const now = new Date().getTime();
    
    if (typeof GLOBAL_FLASH_SALE_END_TIME === 'undefined' || GLOBAL_FLASH_SALE_END_TIME === null) {
        handleFlashSaleEndedOrInactive();
        return;
    }

    const distance = new Date(GLOBAL_FLASH_SALE_END_TIME).getTime() - now;

    const countdownDays = document.getElementById('countdownDays');
    const countdownHours = document.getElementById('countdownHours');
    const countdownMinutes = document.getElementById('countdownMinutes');
    const countdownSeconds = document.getElementById('countdownSeconds');
    const flashSaleMessage = document.getElementById('flashSaleMessage');
    const flashSaleProductGrid = document.getElementById('flashSaleProductGrid');
    const countdownDiv = document.getElementById('flashSaleCountdown');
    const flashSaleTitle = document.getElementById('flashSaleTitle');

    if (distance < 0) {
        handleFlashSaleEndedOrInactive();
    } else { 
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownDays) countdownDays.textContent = String(days).padStart(2, '0');
        if (countdownHours) countdownHours.textContent = String(hours).padStart(2, '0');
        if (countdownMinutes) countdownMinutes.textContent = String(minutes).padStart(2, '0');
        if (countdownSeconds) countdownSeconds.textContent = String(seconds).padStart(2, '0');

        if (flashSaleMessage) flashSaleMessage.style.display = 'none';
        if (countdownDiv) countdownDiv.style.display = 'flex';
        if (flashSaleTitle) flashSaleTitle.textContent = 'FLASH SALE ĐANG DIỄN RA!'; 
    }
}

function handleFlashSaleEndedOrInactive() {
    clearInterval(countdownInterval); 
    
    const countdownDays = document.getElementById('countdownDays');
    const countdownHours = document.getElementById('countdownHours');
    const countdownMinutes = document.getElementById('countdownMinutes');
    const countdownSeconds = document.getElementById('countdownSeconds');
    const flashSaleMessage = document.getElementById('flashSaleMessage');
    const flashSaleProductGrid = document.getElementById('flashSaleProductGrid');
    const countdownDiv = document.getElementById('flashSaleCountdown');
    const flashSaleTitle = document.getElementById('flashSaleTitle');

    if (countdownDays) countdownDays.textContent = '00';
    if (countdownHours) countdownHours.textContent = '00';
    if (countdownMinutes) countdownMinutes.textContent = '00';
    if (countdownSeconds) countdownSeconds.textContent = '00';

    if (flashSaleMessage) {
        flashSaleMessage.textContent = 'Flash Sale đã kết thúc. Xin quý khách vui lòng quay lại vào đợt Flash Sale tiếp theo!';
        flashSaleMessage.style.display = 'block';
    }
    if (countdownDiv) countdownDiv.style.display = 'none'; 

    if (typeof initializeProductPrices !== 'undefined') {
        initializeProductPrices(); 
    } else {
        console.error("Error: initializeProductPrices is not defined. Make sure products.js is loaded correctly.");
    }
    
    const activeFlashSaleItems = allItemsData.filter(item => item.isFlashSale && item.isFlashSaleActive());
    displayFlashSaleItems(activeFlashSaleItems, 'flashSaleProductGrid');

    if (activeFlashSaleItems.length === 0) {
        if (flashSaleTitle) flashSaleTitle.textContent = 'Không có chương trình Flash Sale nào đang diễn ra.';
        if (flashSaleProductGrid) {
            flashSaleProductGrid.innerHTML = '<p style="text-align: center; color: gray;">Hiện chưa có sản phẩm Flash Sale nào đang hoạt động.</p>';
        }
    }
}

function displayFlashSaleItems(items, elementId) {
    const gridElement = document.getElementById(elementId);
    if (!gridElement) return;

    gridElement.innerHTML = '';

    const trulyActiveItems = items.filter(item => item.isFlashSale && item.isFlashSaleActive());

    if (trulyActiveItems.length === 0) {
        return;
    }

    trulyActiveItems.forEach(item => {
        gridElement.innerHTML += item.toHtmlCard();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const flashSaleGrid = document.getElementById('flashSaleProductGrid');
    const flashSaleTitle = document.getElementById('flashSaleTitle');
    
    const currentPath = location.pathname.split('/').pop();

    if (currentPath === 'flash-sale.html') {
        if (flashSaleGrid) {
            if (typeof GLOBAL_FLASH_SALE_END_TIME !== 'undefined' && GLOBAL_FLASH_SALE_END_TIME !== null && new Date(GLOBAL_FLASH_SALE_END_TIME).getTime() > new Date().getTime()) {
                updateCountdown(); 
                countdownInterval = setInterval(updateCountdown, 1000); 
            } else {
                handleFlashSaleEndedOrInactive();
            }

            const initialActiveFlashSaleItems = allItemsData.filter(item => item.isFlashSale && item.isFlashSaleActive());
            displayFlashSaleItems(initialActiveFlashSaleItems, 'flashSaleProductGrid');

            if (flashSaleTitle) {
                if (initialActiveFlashSaleItems.length > 0) {
                    flashSaleTitle.textContent = 'FLASH SALE ĐANG DIỄN RA!';
                } else {
                    flashSaleTitle.textContent = 'Không có chương trình Flash Sale nào đang diễn ra.';
                }
            }
        }
    }
});

