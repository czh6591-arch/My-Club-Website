/**
 * 项目展示模块
 * 负责加载项目数据、筛选、排序、渲染和弹窗详情
 */

let projects = [];
let currentFilter = 'all';
let currentSort = 'newest';

/**
 * 加载项目数据
 */
export async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        projects = await response.json();
        console.log('项目数据加载成功，共', projects.length, '个项目');
        return projects;
    } catch (error) {
        console.error('加载项目数据失败:', error);
        // 使用硬编码数据作为备份
        projects = getBackupProjects();
        console.log('使用备份项目数据，共', projects.length, '个项目');
        return projects;
    }
}

/**
 * 备份项目数据（用于开发和离线访问）
 */
function getBackupProjects() {
    return [
        {
            "id": 1,
            "title": "智能问答系统",
            "description": "基于深度学习的智能问答系统，支持自然语言处理和多轮对话功能。",
            "tags": ["AI", "Web"],
            "popularity": 120,
            "date": "2026-03-15",
            "image": "",
            "features": ["支持多轮对话上下文理解", "集成知识图谱API"],
            "links": {"github": "#", "demo": "#"},
            "team": ["张三", "李四"],
            "technologies": ["Python", "TensorFlow"]
        },
        {
            "id": 2,
            "title": "校园二手交易平台",
            "description": "专为大学生设计的二手物品交易平台，支持物品发布、在线聊天。",
            "tags": ["Web", "Data"],
            "popularity": 95,
            "date": "2026-02-20",
            "image": "",
            "features": ["实时即时通讯", "智能推荐系统"],
            "links": {"github": "#", "demo": "#"},
            "team": ["赵六", "钱七"],
            "technologies": ["Vue.js", "Node.js"]
        },
        {
            "id": 3,
            "title": "2D像素冒险游戏",
            "description": "一款基于Unity开发的2D像素风格冒险游戏，包含丰富的关卡设计。",
            "tags": ["Game"],
            "popularity": 150,
            "date": "2026-04-01",
            "image": "",
            "features": ["50+精心设计关卡", "角色技能树系统"],
            "links": {"github": "#", "demo": "#"},
            "team": ["周九", "吴十"],
            "technologies": ["Unity", "C#"]
        }
    ];
}

/**
 * 筛选项目
 * @param {string} tag - 筛选标签 ('all', 'AI', 'Web', 'Game', 'Data')
 */
export function filterProjects(tag) {
    currentFilter = tag;
    renderProjects();
    updateFilterButtons();
}

/**
 * 排序项目
 * @param {string} sortBy - 排序方式 ('newest' 或 'popular')
 */
export function sortProjects(sortBy) {
    currentSort = sortBy;
    renderProjects();
}

/**
 * 获取筛选和排序后的项目列表
 */
function getFilteredAndSortedProjects() {
    let filteredProjects = [...projects];
    
    // 筛选
    if (currentFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => 
            project.tags.includes(currentFilter)
        );
    }
    
    // 排序
    if (currentSort === 'newest') {
        filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'popular') {
        filteredProjects.sort((a, b) => b.popularity - a.popularity);
    }
    
    return filteredProjects;
}

/**
 * 渲染项目卡片
 */
export function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const filteredProjects = getFilteredAndSortedProjects();
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">暂无项目</h3>
                <p class="empty-state-description">该分类下暂无项目，请尝试其他分类</p>
            </div>
        `;
        return;
    }
    
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card scale-in" data-project-id="${project.id}">
            <div class="project-image">
                <div style="width: 100%; height: 100%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: bold;">
                    ${getProjectIcon(project.tags)}
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    <div class="project-meta">
                        <span>❤️ ${project.popularity}</span>
                        <span>📅 ${formatDate(project.date)}</span>
                    </div>
                    <button class="view-details-btn" style="background: none; border: none; color: var(--accent-primary); cursor: pointer; font-weight: 500;">
                        查看详情 →
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // 绑定项目卡片点击事件
    bindProjectCardEvents();
    
    // 触发滚动动画
    setTimeout(() => {
        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

/**
 * 获取项目图标
 */
function getProjectIcon(tags) {
    if (tags.includes('AI')) return '🤖';
    if (tags.includes('Game')) return '🎮';
    if (tags.includes('Data')) return '📊';
    if (tags.includes('Web')) return '🌐';
    return '💻';
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 更新筛选按钮状态
 */
function updateFilterButtons() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        if (tag.dataset.tag === currentFilter) {
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
        }
    });
}

/**
 * 绑定项目卡片事件
 */
function bindProjectCardEvents() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = parseInt(card.dataset.projectId);
            const project = projects.find(p => p.id === projectId);
            if (project) {
                openProjectModal(project);
            }
        });
    });
}

/**
 * 打开项目详情弹窗
 */
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-project-image">
            <div style="width: 100%; height: 100%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 5rem; font-weight: bold;">
                ${getProjectIcon(project.tags)}
            </div>
        </div>
        <div class="modal-body">
            <h2 class="modal-project-title">${project.title}</h2>
            <div class="modal-project-tags">
                ${project.tags.map(tag => `<span class="modal-project-tag">${tag}</span>`).join('')}
            </div>
            <div class="modal-project-meta">
                <span>❤️ ${project.popularity} 热度</span>
                <span>📅 ${formatDate(project.date)}</span>
                <span>👥 ${project.team.length} 位成员</span>
            </div>
            <p class="modal-project-description">${project.description}</p>
            
            ${project.features && project.features.length > 0 ? `
                <div class="modal-project-features">
                    <h3>主要功能</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${project.technologies && project.technologies.length > 0 ? `
                <div class="modal-project-features">
                    <h3>技术栈</h3>
                    <div class="skills-list">
                        ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${project.team && project.team.length > 0 ? `
                <div class="modal-project-features">
                    <h3>团队成员</h3>
                    <div class="skills-list">
                        ${project.team.map(member => `<span class="skill-tag">${member}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-project-links">
                ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="modal-project-link">🐙 GitHub</a>` : ''}
                ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="modal-project-link secondary">🚀 在线演示</a>` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭项目详情弹窗
 */
export function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * 搜索项目
 * @param {string} query - 搜索关键词
 */
export function searchProjects(query) {
    if (!query.trim()) {
        renderProjects();
        return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results = projects.filter(project => {
        const titleMatch = project.title.toLowerCase().includes(lowerQuery);
        const descriptionMatch = project.description.toLowerCase().includes(lowerQuery);
        const tagsMatch = project.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        const teamMatch = project.team.some(member => member.toLowerCase().includes(lowerQuery));
        const techMatch = project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery));
        
        return titleMatch || descriptionMatch || tagsMatch || teamMatch || techMatch;
    });
    
    renderSearchResults(results);
    return results;
}

/**
 * 渲染搜索结果
 */
function renderSearchResults(results) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    if (results.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">未找到相关项目</h3>
                <p class="empty-state-description">请尝试其他关键词搜索</p>
            </div>
        `;
        return;
    }
    
    // 保存原始筛选和排序状态
    const originalFilter = currentFilter;
    const originalSort = currentSort;
    
    // 临时设置为显示全部
    currentFilter = 'all';
    
    projectsGrid.innerHTML = results.map(project => `
        <div class="project-card scale-in visible search-highlight" data-project-id="${project.id}">
            <div class="project-image">
                <div style="width: 100%; height: 100%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: bold;">
                    ${getProjectIcon(project.tags)}
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    <div class="project-meta">
                        <span>❤️ ${project.popularity}</span>
                        <span>📅 ${formatDate(project.date)}</span>
                    </div>
                    <button class="view-details-btn" style="background: none; border: none; color: var(--accent-primary); cursor: pointer; font-weight: 500;">
                        查看详情 →
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    bindProjectCardEvents();
    
    // 恢复原始状态（但不重新渲染，保持搜索结果）
    currentFilter = originalFilter;
    currentSort = originalSort;
}

/**
 * 初始化项目展示系统
 */
export async function initProjectsSystem() {
    await loadProjects();
    renderProjects();
    
    // 绑定筛选按钮事件
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterProjects(tag.dataset.tag);
        });
    });
    
    // 绑定排序选择事件
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProjects(e.target.value);
        });
    }
    
    // 绑定弹窗关闭事件
    const modalClose = document.querySelector('.modal-close');
    const modal = document.getElementById('project-modal');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }
    
    // 键盘事件关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
    
    console.log('项目展示系统已初始化');
}

export default {
    loadProjects,
    filterProjects,
    sortProjects,
    renderProjects,
    openProjectModal,
    closeProjectModal,
    searchProjects,
    initProjectsSystem
};
