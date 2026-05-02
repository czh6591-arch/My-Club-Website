/**
 * 成员展示模块
 * 负责加载成员数据、渲染成员卡片和3D交互效果
 */

let members = [];

/**
 * 加载成员数据
 */
export async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        members = await response.json();
        console.log('成员数据加载成功，共', members.length, '位成员');
        return members;
    } catch (error) {
        console.error('加载成员数据失败:', error);
        // 使用硬编码数据作为备份
        members = getBackupMembers();
        console.log('使用备份成员数据，共', members.length, '位成员');
        return members;
    }
}

/**
 * 备份成员数据
 */
function getBackupMembers() {
    return [
        {
            "id": 1,
            "name": "张三",
            "role": "社团主席",
            "avatar": "👨‍💻",
            "bio": "热爱编程，专注于人工智能领域，有丰富的项目经验。",
            "skills": ["Python", "TensorFlow", "机器学习"],
            "contributions": ["组织20+技术分享会", "领导智能问答系统项目"]
        },
        {
            "id": 2,
            "name": "李四",
            "role": "技术负责人",
            "avatar": "👩‍💻",
            "bio": "全栈开发工程师，擅长前后端开发和系统架构设计。",
            "skills": ["React", "Node.js", "TypeScript"],
            "contributions": ["设计社团管理系统架构", "优化校园二手平台性能"]
        },
        {
            "id": 3,
            "name": "王五",
            "role": "前端开发组长",
            "avatar": "🧑‍💻",
            "bio": "专注于前端技术，追求极致的用户体验和界面设计。",
            "skills": ["Vue.js", "CSS3", "JavaScript"],
            "contributions": ["设计社团官网UI界面", "开发校园导航小程序"]
        }
    ];
}

/**
 * 渲染成员卡片
 */
export function renderMembers() {
    const membersGrid = document.getElementById('members-grid');
    if (!membersGrid) return;
    
    if (members.length === 0) {
        membersGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3 class="empty-state-title">暂无成员</h3>
                <p class="empty-state-description">成员数据加载中...</p>
            </div>
        `;
        return;
    }
    
    membersGrid.innerHTML = members.map((member, index) => `
        <div class="member-card scale-in" data-member-id="${member.id}" style="animation-delay: ${index * 100}ms;">
            <div class="member-card-inner">
                <div class="member-card-front">
                    <div class="member-avatar">
                        ${member.avatar}
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">${member.name}</h3>
                        <p class="member-role">${member.role}</p>
                        <p class="member-bio">${member.bio}</p>
                        <p style="margin-top: 10px; font-size: 0.85rem; color: var(--accent-primary);">
                            💡 点击查看详情
                        </p>
                    </div>
                </div>
                <div class="member-card-back">
                    <h3 class="member-back-title">${member.name} - 详细信息</h3>
                    
                    <div class="member-skills">
                        <h4 class="skills-title">技术栈</h4>
                        <div class="skills-list">
                            ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="member-contribution">
                        <h4 class="contribution-title">主要贡献</h4>
                        <ul class="contribution-list">
                            ${member.contributions.map(contribution => `<li>${contribution}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 0.85rem; color: var(--accent-primary);">
                        💡 点击返回正面
                    </p>
                </div>
            </div>
        </div>
    `).join('');
    
    // 绑定成员卡片事件
    bindMemberCardEvents();
    
    // 触发滚动动画
    setTimeout(() => {
        const cards = membersGrid.querySelectorAll('.member-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }, 100);
}

/**
 * 绑定成员卡片事件
 */
function bindMemberCardEvents() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // 点击翻转
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        
        // 鼠标悬停3D倾斜效果
        card.addEventListener('mousemove', (e) => {
            handleCardTilt(e, card);
        });
        
        // 鼠标离开恢复
        card.addEventListener('mouseleave', () => {
            resetCardTilt(card);
        });
    });
}

/**
 * 处理卡片3D倾斜效果
 */
function handleCardTilt(e, card) {
    const cardInner = card.querySelector('.member-card-inner');
    if (!cardInner) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 计算中心点
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 计算倾斜角度（最大15度）
    const tiltX = ((y - centerY) / centerY) * 15;
    const tiltY = ((centerX - x) / centerX) * 15;
    
    // 应用3D变换
    cardInner.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    cardInner.style.transition = 'transform 0.1s ease-out';
}

/**
 * 重置卡片倾斜
 */
function resetCardTilt(card) {
    const cardInner = card.querySelector('.member-card-inner');
    if (!cardInner) return;
    
    // 恢复原始状态
    if (card.classList.contains('flipped')) {
        cardInner.style.transform = 'rotateY(180deg)';
    } else {
        cardInner.style.transform = 'rotateY(0deg)';
    }
    cardInner.style.transition = 'transform 0.3s ease-out';
}

/**
 * 搜索成员
 * @param {string} query - 搜索关键词
 */
export function searchMembers(query) {
    if (!query.trim()) {
        renderMembers();
        return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results = members.filter(member => {
        const nameMatch = member.name.toLowerCase().includes(lowerQuery);
        const roleMatch = member.role.toLowerCase().includes(lowerQuery);
        const bioMatch = member.bio.toLowerCase().includes(lowerQuery);
        const skillsMatch = member.skills.some(skill => skill.toLowerCase().includes(lowerQuery));
        const contributionsMatch = member.contributions.some(contribution => 
            contribution.toLowerCase().includes(lowerQuery)
        );
        
        return nameMatch || roleMatch || bioMatch || skillsMatch || contributionsMatch;
    });
    
    renderSearchResults(results);
    return results;
}

/**
 * 渲染搜索结果
 */
function renderSearchResults(results) {
    const membersGrid = document.getElementById('members-grid');
    if (!membersGrid) return;
    
    if (results.length === 0) {
        membersGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">未找到相关成员</h3>
                <p class="empty-state-description">请尝试其他关键词搜索</p>
            </div>
        `;
        return;
    }
    
    membersGrid.innerHTML = results.map((member, index) => `
        <div class="member-card scale-in visible search-highlight" data-member-id="${member.id}" style="animation-delay: ${index * 100}ms;">
            <div class="member-card-inner">
                <div class="member-card-front">
                    <div class="member-avatar">
                        ${member.avatar}
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">${member.name}</h3>
                        <p class="member-role">${member.role}</p>
                        <p class="member-bio">${member.bio}</p>
                        <p style="margin-top: 10px; font-size: 0.85rem; color: var(--accent-primary);">
                            💡 点击查看详情
                        </p>
                    </div>
                </div>
                <div class="member-card-back">
                    <h3 class="member-back-title">${member.name} - 详细信息</h3>
                    
                    <div class="member-skills">
                        <h4 class="skills-title">技术栈</h4>
                        <div class="skills-list">
                            ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="member-contribution">
                        <h4 class="contribution-title">主要贡献</h4>
                        <ul class="contribution-list">
                            ${member.contributions.map(contribution => `<li>${contribution}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 0.85rem; color: var(--accent-primary);">
                        💡 点击返回正面
                    </p>
                </div>
            </div>
        </div>
    `).join('');
    
    bindMemberCardEvents();
}

/**
 * 初始化成员展示系统
 */
export async function initMembersSystem() {
    await loadMembers();
    renderMembers();
    
    console.log('成员展示系统已初始化');
}

export default {
    loadMembers,
    renderMembers,
    searchMembers,
    initMembersSystem
};
