// GitHub配置 - 只保留用户名和仓库名
const GITHUB_USERNAME = 'fooone'; // 你的GitHub用户名
const REPO_NAME = 'fooone.github.io'; // 你的仓库名

// 从本地存储获取Token
function getAccessToken() {
    return localStorage.getItem('github_access_token');
}

// 检查是否已配置Token
function checkTokenConfigured() {
    const token = getAccessToken();
    if (!token) {
        alert('请先配置GitHub Token！即将跳转到配置页面...');
        window.location.href = 'config.html';
        return false;
    }
    return true;
}

async function uploadPost() {
    // 先检查Token是否配置
    if (!checkTokenConfigured()) {
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }

    // 创建文件名 - 保存到 posts 文件夹
    const date = new Date().toISOString().split('T')[0];
    
    // 清理标题，移除特殊字符，用做文件名
    const cleanTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    const filename = `posts/${date}-${cleanTitle}.md`;
    
    // 文件内容（添加Front Matter）
    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
---

${content}
`;

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filename}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `发布新文章: ${title}`,
                content: btoa(unescape(encodeURIComponent(fileContent)))
            })
        });

        if (response.ok) {
            alert(`文章发布成功！\n保存位置: ${filename}`);
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
        } else {
            const errorData = await response.json();
            alert('发布失败: ' + (errorData.message || '未知错误'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('发布失败：' + error.message);
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('github_access_token');
    window.location.href = 'index.html';
}

// 页面加载时检查权限和Token
if (localStorage.getItem('isAdmin') !== 'true') {
    alert('请先登录！');
    window.location.href = 'index.html';
}
