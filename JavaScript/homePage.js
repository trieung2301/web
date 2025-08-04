document.addEventListener('DOMContentLoaded', () => {
    const homepageNavLink = document.getElementById('homepageNavLink');
    const itemsToDisplayOnHomepage = allItemsData;
    displayItems(itemsToDisplayOnHomepage, 'productGrid');
    const currentPath = location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === 'index.html') {
        updateNavLinkHighlight(homepageNavLink);
    }

});