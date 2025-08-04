// JavaScript/navigation.js

function updateNavLinkHighlight(activeLinkElement) {
    if (activeLinkElement) {
        activeLinkElement.classList.add('current-page');
    }
}

function getCleanFileName(urlOrPath) {
    let fileName = '';
    
    try {
        const urlObj = new URL(urlOrPath, window.location.origin);
        fileName = urlObj.pathname.split('/').pop();
    } catch (e) {
        fileName = String(urlOrPath).split('/').pop();
    }
    const queryIndex = fileName.indexOf('?');
    if (queryIndex !== -1) {
        fileName = fileName.substring(0, queryIndex);
    }
    const hashIndex = fileName.indexOf('#');
    if (hashIndex !== -1) {
        fileName = fileName.substring(0, hashIndex);
    }
    return fileName.toLowerCase();
}


document.addEventListener('DOMContentLoaded', () => {
    const homeNavLink = document.getElementById('homeNavLink');
    const categoriesNavLink = document.getElementById('categoriesNavLink');
    const flashSaleNavLink = document.getElementById('flashSaleNavLink');
    const topDealNavLink = document.getElementById('topDealNavLink');

    let currentFileName = getCleanFileName(window.location.href);
    if (currentFileName === '') {
        currentFileName = 'index.html';
    }

    if (currentFileName === 'index.html') {
        updateNavLinkHighlight(homeNavLink);
    } else if (currentFileName === 'category.html') {
        updateNavLinkHighlight(categoriesNavLink);
    } else if (currentFileName === 'flash-sale.html') {
        updateNavLinkHighlight(flashSaleNavLink);
    } else if (currentFileName === 'top-deal.html') {
        updateNavLinkHighlight(topDealNavLink);
    }
});