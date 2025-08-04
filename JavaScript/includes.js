// JavaScript/includes.js

async function loadHtmlIncludes() {
    const includes = document.querySelectorAll('[data-include]');

    for (const include of includes) {
        const filePath = include.dataset.include;
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error(`Error loading HTML include from ${filePath}: ${response.status} ${response.statusText}`);
                include.innerHTML = `<p style="color: red;">Lỗi tải nội dung: ${filePath}</p>`;
            }
            const html = await response.text();
            include.innerHTML = html;
        } catch (error) {
            console.error(`Lỗi trong includes.js khi tải ${filePath}:`, error);
            include.innerHTML = `<p style="color: red;">Lỗi tải nội dung: ${filePath}</p>`;
        }
    }
}
document.addEventListener('DOMContentLoaded', loadHtmlIncludes);