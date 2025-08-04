let users = JSON.parse(localStorage.getItem('mockUsers')) || [];

if (!users.some(u => u.username === 'admin')) {
    users.push({ id: 999, username: 'admin', passwordHash: 'hashed_admin123', role: 'admin' });
    localStorage.setItem('mockUsers', JSON.stringify(users));
}

class User {
    constructor(id, username, passwordHash, role = 'user') {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static hashPassword(password) {
        return `hashed_${password}`;
    }

    static async authenticate(username, password) {
        return new Promise(resolve => {
            setTimeout(() => {
                const user = users.find(u => u.username === username);
                if (user && user.passwordHash === User.hashPassword(password)) {
                    resolve({ success: true, user: { id: user.id, username: user.username, role: user.role } });
                } else {
                    resolve({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
                }
            }, 300);
        });
    }

    static async register(username, password) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (users.some(u => u.username === username)) {
                    resolve({ success: false, message: 'Tên đăng nhập đã tồn tại.' });
                    return;
                }
                const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
                const newUser = { id: newId, username: username, passwordHash: User.hashPassword(password), role: 'user' };
                users.push(newUser);
                localStorage.setItem('mockUsers', JSON.stringify(users));
                resolve({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role } });
            }, 300);
        });
    }

    static async changePassword(username, oldPassword, newPassword) {
        return new Promise(resolve => {
            setTimeout(() => {
                const userIndex = users.findIndex(u => u.username === username);
                if (userIndex === -1) {
                    resolve({ success: false, message: 'Người dùng không tồn tại.' });
                    return;
                }
                const user = users[userIndex];
                if (user.passwordHash !== User.hashPassword(oldPassword)) {
                    resolve({ success: false, message: 'Mật khẩu cũ không đúng.' });
                    return;
                }
                user.passwordHash = User.hashPassword(newPassword);
                localStorage.setItem('mockUsers', JSON.stringify(users));
                resolve({ success: true, message: 'Đổi mật khẩu thành công.' });
            }, 300);
        });
    }

    static saveCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem('currentUser');
        console.log('User.clearCurrentUser: currentUser ĐÃ được xóa khỏi localStorage.');
        console.log('User.clearCurrentUser: Giá trị localStorage.getItem("currentUser") sau khi xóa:', localStorage.getItem('currentUser'));
    }

    static getCurrentUserRole() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser ? currentUser.role : null;
    }

    static isAdmin() {
        return User.getCurrentUserRole() === 'admin';
    }
}

function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminPanelLink = document.getElementById('adminPanelLink');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (loginLink && registerLink && logoutLink) {
        if (currentUser) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutLink.style.display = 'inline';
            if (adminPanelLink) {
                adminPanelLink.style.display = User.isAdmin() ? 'inline' : 'none';
            }
        } else {
            loginLink.style.display = 'inline';
            registerLink.style.display = 'inline';
            logoutLink.style.display = 'none';
            if (adminPanelLink) {
                adminPanelLink.style.display = 'none';
            }
        }
    }

    const adminFunctionalityDiv = document.getElementById('adminFunctionality');
    if (adminFunctionalityDiv) {
        if (User.isAdmin()) {
            adminFunctionalityDiv.style.display = 'block';
        } else {
            adminFunctionalityDiv.style.display = 'none';
        }
    }
}

function handleLogout() {
    console.log('handleLogout: Bắt đầu quá trình đăng xuất.');
    User.clearCurrentUser();
    updateAuthUI();
    alert('Bạn đã đăng xuất.');
    console.log('handleLogout: Đã hoàn tất đăng xuất và chuyển hướng.');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const messageElement = document.getElementById('loginMessage');
            messageElement.textContent = '';

            const result = await User.authenticate(username, password);
            if (result.success) {
                User.saveCurrentUser(result.user);
                updateAuthUI();
                alert('Đăng nhập thành công!');
                window.location.href = 'index.html';
            } else {
                messageElement.textContent = result.message;
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageElement = document.getElementById('registerMessage');
            messageElement.textContent = '';

            if (password !== confirmPassword) {
                messageElement.textContent = 'Mật khẩu xác nhận không khớp.';
                return;
            }
            if (password.length < 6) {
                messageElement.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
                return;
            }

            const result = await User.register(username, password);
            if (result.success) {
                User.saveCurrentUser(result.user);
                updateAuthUI();
                alert('Đăng ký thành công và đã đăng nhập!');
                window.location.href = 'index.html';
            } else {
                messageElement.textContent = result.message;
            }
        });
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        const changePassUsernameInput = document.getElementById('changePassUsername');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && changePassUsernameInput) {
            changePassUsernameInput.value = currentUser.username;
            changePassUsernameInput.readOnly = true;
        }

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('changePassUsername').value;
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const messageElement = document.getElementById('changePasswordMessage');
            messageElement.textContent = '';

            if (newPassword !== confirmNewPassword) {
                messageElement.textContent = 'Mật khẩu mới xác nhận không khớp.';
                return;
            }
            if (newPassword.length < 6) {
                messageElement.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
                return;
            }
            if (oldPassword === newPassword) {
                messageElement.textContent = 'Mật khẩu mới không được giống mật khẩu cũ.';
                return;
            }

            const result = await User.changePassword(username, oldPassword, newPassword);
            if (result.success) {
                alert(result.message);
                messageElement.style.color = 'green';
                messageElement.textContent = result.message;
                User.clearCurrentUser();
                updateAuthUI();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                messageElement.textContent = result.message;
                messageElement.style.color = 'red';
            }
        });
    }
});