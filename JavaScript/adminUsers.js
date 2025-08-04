document.addEventListener("DOMContentLoaded", function () {
    const userTableBody = document.getElementById("userTableBody");
    const mockUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const enrichedUsers = mockUsers.map(user => {
        const matchingOrder = orders.find(order => order.userId === user.username);
        const customerInfo = matchingOrder?.customerInfo || {};

        return {
            ...user,
            firstName: user.firstName || customerInfo.firstName || "",
            lastName: user.lastName || customerInfo.lastName || "",
            email: user.email || customerInfo.email || ""
        };
    });

    enrichedUsers.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.lastName || ""} ${user.firstName || ""}</td>
      <td>${user.email || "Không rõ"}</td>
      <td>${user.role || "Khách Hàng"}</td>
      <td>
        <button onclick="editUser(${user.id})" class="edit-btn">Sửa</button>
        <button onclick="deleteUser(${user.id})" class="delete-btn">Xóa</button>
      </td>
    `;
        userTableBody.appendChild(tr);
    });
});

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem("mockUsers")) || [];
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return;

    const user = {
        ...users[index],
        firstName: users[index].firstName || "",
        lastName: users[index].lastName || "",
        email: users[index].email || ""
    };

    const newFirstName = prompt("Nhập tên mới:", user.firstName);
    const newLastName = prompt("Nhập họ mới:", user.lastName);
    let newEmail = prompt("Nhập email mới:", user.email);

    if (newFirstName !== null && newLastName !== null && newEmail !== null) {
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail.trim())) {
            alert("Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: ten@example.com)");
            return;
        }

        user.firstName = newFirstName.trim();
        user.lastName = newLastName.trim();
        user.email = newEmail.trim();

        users[index] = user;
        localStorage.setItem("mockUsers", JSON.stringify(users));
        location.reload();
    }
}


