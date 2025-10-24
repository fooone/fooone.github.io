// 增强版文章加载器
const GITHUB_USERNAME = 'fooone'; // 你的用户名
const REPO_NAME = 'fooone.github.io'; // 你的仓库名

async function loadPosts() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/posts`);
        
        if (!response.ok) {
            throw new Error('无法加载文章列表');
        }
        
        const files = await response.json();
        document.getElementById('loading').style.display = 'none';
        
        // 过滤出.md文件并按日期倒序排列
        const postFiles = files
            .filter(file => file.name.endsWith('.md'))
            .sort((a, b) => {
                // 按文件名排序（新的在前）
                return b.name.localeCompare(a.name);
            });
        
        await displayPosts(postFiles);
        
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('loading').innerHTML = `
            <p>加载文章失败，请刷新页面重试</p>
            <p><small>错误信息: ${error.message}</small></p>
        `;
    }
}

async function displayPosts(postFiles) {
    const container = document.getElementById('posts-container');
    
    if (postFiles.length === 0) {
        container.innerHTML = '<div class="post-item"><p>还没有发布任何文章。</p></div>';
        return;
    }
    
    let html = '';
    
    for (const file of postFiles) {
        try {
            const postResponse = await fetch(file.download_url);
            const content = await postResponse.text();
            const post = parsePostContent(content, file.name);
            html += createPostHTML(post);
            
        } catch (error) {
            console.error(`加载文章 ${file.name} 失败:`, error);
            // 即使单个文章加载失败，也继续显示其他文章
            html += `
                <div class="post-item">
                    <h2 class="post-title">${file.name}</h2>
                    <div class="post-content">文章加载失败</div>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}

function parsePostContent(content, filename) {
    let title = filename.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    let date = filename.substring(0, 10); // 从文件名提取日期
    let postContent = content;
    
    // 解析Front Matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        postContent = frontMatterMatch[2];
        
        const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
        const dateMatch = frontMatter.match(/date:\s*"([^"]*)"/);
        
        if (titleMatch) title = titleMatch[1];
        if (dateMatch) date = dateMatch[1].split('T')[0];
    }
    
    // 如果文件名中有日期，优先使用文件名中的日期
    if (/^\d{4}-\d{2}-\d{2}/.test(filename)) {
        date = filename.substring(0, 10);
    }
    
    return {
        title: title,
        date: date,
        content: postContent
    };
}

function createPostHTML(post) {
    // 将Markdown内容转换为HTML（简单版本）
    const formattedContent = formatContent(post.content);
    
    return `
        <div class="post-item">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-date">📅 ${post.date}</div>
            <div class="post-content">${formattedContent}</div>
            <div class="post-read-more">
                <a href="#" onclick="readFullPost('${post.title}')">阅读全文</a>
            </div>
        </div>
    `;
}

function formatContent(content) {
    // 简单的Markdown转HTML
    return content
        .split('\n').slice(0, 5).join('\n') // 显示前5行作为摘要
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);
