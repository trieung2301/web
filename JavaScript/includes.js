// JavaScript/includes.js

async function loadHtmlIncludes() {
    const includes = document.querySelectorAll('[data-include]');

    for (const include of includes) {
        const filePath = include.dataset.include; // Lấy đường dẫn từ thuộc tính data-include
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                // Log lỗi chi tiết hơn
                console.error(`Error loading HTML include from ${filePath}: ${response.status} ${response.statusText}`);
                include.innerHTML = `<p style="color: red;">Lỗi tải nội dung: ${filePath}</p>`;
                continue; // Chuyển sang include tiếp theo
            }
            const html = await response.text();
            include.innerHTML = html;
        } catch (error) {
            console.error(`Lỗi trong includes.js khi tải ${filePath}:`, error);
            include.innerHTML = `<p style="color: red;">Lỗi tải nội dung: ${filePath}</p>`;
        }
    }
}

// Gọi hàm này khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', loadHtmlIncludes);