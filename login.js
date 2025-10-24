// 密码验证（为了安全，这个密码应该是加密的）
const ADMIN_PASSWORD = "0114Wsy$"; // 改成你自己的密码

function openAdmin() {
    // 检查是否已经登录
    if (localStorage.getItem('isAdmin') === 'true') {
        window.location.href = 'admin.html';
        return;
    }
    
    // 弹出密码输入框
    const password = prompt('请输入管理员密码:');
    if (password === ADMIN_PASSWORD) {
        // 登录成功，保存状态到本地存储
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
    } else if (password) {
        alert('密码错误！');
    }
}

// 页面加载时检查登录状态（可选）
function checkAdminStatus() {
    if (localStorage.getItem('isAdmin') === 'true') {
        document.querySelector('.admin-btn').textContent = '管理后台';
    }
}

// 调用检查函数
checkAdminStatus();