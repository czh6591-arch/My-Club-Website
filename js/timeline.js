/**
 * 时间轴模块
 * 负责加载时间轴数据、渲染时间轴和滚动触发动画
 */

let timelineEvents = [];
let showHistorical = false;

/**
 * 加载时间轴数据
 */
export async function loadTimeline() {
    try {
        const response = await fetch('data/timeline.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        timelineEvents = await response.json();
        console.log('时间轴数据加载成功，共', timelineEvents.length, '个事件');
        return timelineEvents;
    } catch (error) {
        console.error('加载时间轴数据失败:', error);
        // 使用硬编码数据作为备份
        timelineEvents = getBackupTimeline();
        console.log('使用备份时间轴数据，共', timelineEvents.length, '个事件');
        return timelineEvents;
    }
}

/**
 * 备份时间轴数据
 */
function getBackupTimeline() {
    return [
        {
            "id": 1,
            "date": "2026-04-15",
            "title": "春季编程马拉松",
            "description": "为期48小时的编程马拉松活动，30支队伍参与。",
            "type": "major",
            "historical": false
        },
        {
            "id": 2,
            "date": "2026-03-20",
            "title": "人工智能技术分享会",
            "description": "邀请了计算机学院李教授进行关于大语言模型的专题分享。",
            "type": "workshop",
            "historical": false
        },
        {
            "id": 3,
            "date": "2026-03-10",
            "title": "新学期招新活动",
            "description": "新学期招新圆满结束，共招收新成员45名。",
            "type": "event",
            "historical": false
        }
    ];
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

/**
 * 获取事件类型图标
 */
function getTypeIcon(type) {
    switch (type) {
        case 'major':
            return '🏆';
        case 'workshop':
            return '📚';
        case 'event':
            return '🎉';
        default:
            return '📅';
    }
}

/**
 * 渲染时间轴
 */
export function renderTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    // 筛选要显示的事件
    let eventsToShow = timelineEvents;
    
    if (!showHistorical) {
        eventsToShow = timelineEvents.filter(event => !event.historical);
    }
    
    if (eventsToShow.length === 0) {
        timeline.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📅</div>
                <h3 class="empty-state-title">暂无活动</h3>
                <p class="empty-state-description">时间轴数据加载中...</p>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = eventsToShow.map((event, index) => `
        <div class="timeline-item ${event.historical ? 'historical' : ''}" data-event-id="${event.id}" data-index="${index}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">
                    ${getTypeIcon(event.type)} ${formatDate(event.date)}
                </div>
                <h3 class="timeline-title">${event.title}</h3>
                <p class="timeline-description">${event.description}</p>
            </div>
        </div>
    `).join('');
    
    // 更新按钮文字
    const toggleButton = document.getElementById('toggle-history');
    if (toggleButton) {
        toggleButton.textContent = showHistorical ? '收起历史活动' : '展开历史活动';
    }
    
    // 设置滚动观察
    setupTimelineScrollObserver();
}

/**
 * 切换历史活动显示
 */
export function toggleHistoricalEvents() {
    showHistorical = !showHistorical;
    renderTimeline();
}

/**
 * 设置时间轴滚动观察器
 */
function setupTimelineScrollObserver() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 延迟显示，创建逐个出现的效果
                    const delay = parseInt(entry.target.dataset.index) * 200 || index * 200;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    // 取消观察，避免重复触发
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.3, // 当30%可见时触发
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * 搜索时间轴事件
 * @param {string} query - 搜索关键词
 */
export function searchTimeline(query) {
    if (!query.trim()) {
        renderTimeline();
        return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results = timelineEvents.filter(event => {
        const titleMatch = event.title.toLowerCase().includes(lowerQuery);
        const descriptionMatch = event.description.toLowerCase().includes(lowerQuery);
        const typeMatch = event.type.toLowerCase().includes(lowerQuery);
        
        return titleMatch || descriptionMatch || typeMatch;
    });
    
    renderSearchResults(results);
    return results;
}

/**
 * 渲染搜索结果
 */
function renderSearchResults(results) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    if (results.length === 0) {
        timeline.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">未找到相关活动</h3>
                <p class="empty-state-description">请尝试其他关键词搜索</p>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = results.map((event, index) => `
        <div class="timeline-item visible search-highlight" data-event-id="${event.id}" data-index="${index}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">
                    ${getTypeIcon(event.type)} ${formatDate(event.date)}
                </div>
                <h3 class="timeline-title">${event.title}</h3>
                <p class="timeline-description">${event.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * 初始化时间轴系统
 */
export async function initTimelineSystem() {
    await loadTimeline();
    renderTimeline();
    
    // 绑定展开/折叠历史活动按钮
    const toggleButton = document.getElementById('toggle-history');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleHistoricalEvents);
    }
    
    console.log('时间轴系统已初始化');
}

export default {
    loadTimeline,
    renderTimeline,
    toggleHistoricalEvents,
    searchTimeline,
    initTimelineSystem
};
