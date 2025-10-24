// GitHub配置 - 需要改成你的信息
const GITHUB_USERNAME = '541';
const REPO_NAME = 'fooone.github.io'; // 比如 fooone.github.io


function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

async function uploadPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }

    // 创建文件名（用日期+标题）
    const date = new Date().toISOString().split('T')[0];
    const filename = `posts/${date}-${title.replace(/\s+/g, '-')}.md`;
    
    // 文件内容（添加Front Matter）
    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
---

${content}
`;

    try {
        // 调用GitHub API上传文件
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filename}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `发布新文章: ${title}`,
                content: btoa(unescape(encodeURIComponent(fileContent))) //  base64编码
            })
        });

        if (response.ok) {
            alert('文章发布成功！');
            // 清空表单
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
        } else {
            alert('发布失败，请检查token配置');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('发布失败：' + error.message);
    }
}

// 页面加载时检查权限
if (localStorage.getItem('isAdmin') !== 'true') {
    alert('请先登录！');
    window.location.href = 'index.html';
}