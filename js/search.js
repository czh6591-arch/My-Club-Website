/**
 * 搜索模块
 * 负责实时搜索项目和成员
 */

import { searchProjects, renderProjects } from './projects.js';
import { searchMembers, renderMembers } from './members.js';
import { searchTimeline, renderTimeline } from './timeline.js';

let searchTimeout = null;
const SEARCH_DELAY = 300; // 300ms 防抖延迟

/**
 * 初始化搜索系统
 */
export function initSearchSystem() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        // 实时搜索（防抖）
        searchInput.addEventListener('input', (e) => {
            // 清除之前的定时器
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // 设置新的定时器
            const query = e.target.value.trim();
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, SEARCH_DELAY);
        });
        
        // 回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                const query = e.target.value.trim();
                performSearch(query);
            }
        });
        
        // 聚焦时显示搜索状态
        searchInput.addEventListener('focus', () => {
            const searchBox = searchInput.closest('.search-box');
            if (searchBox) {
                searchBox.style.boxShadow = 'var(--shadow-glow)';
            }
        });
        
        searchInput.addEventListener('blur', () => {
            const searchBox = searchInput.closest('.search-box');
            if (searchBox) {
                searchBox.style.boxShadow = '';
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput ? searchInput.value.trim() : '';
            performSearch(query);
        });
    }
    
    console.log('搜索系统已初始化');
}

/**
 * 执行搜索
 */
function performSearch(query) {
    console.log('执行搜索:', query);
    
    // 如果搜索词为空，恢复原始显示
    if (!query) {
        resetSearch();
        return;
    }
    
    // 在所有数据中搜索
    const projectResults = searchProjects(query);
    const memberResults = searchMembers(query);
    // const timelineResults = searchTimeline(query);
    
    console.log(`搜索结果: 项目 ${projectResults.length} 个, 成员 ${memberResults.length} 个`);
    
    // 如果有搜索结果，滚动到相应的 section
    if (projectResults.length > 0) {
        scrollToSection('projects');
    } else if (memberResults.length > 0) {
        scrollToSection('members');
    }
    // else if (timelineResults.length > 0) {
    //     scrollToSection('timeline');
    // }
}

/**
 * 重置搜索，恢复原始显示
 */
function resetSearch() {
    console.log('重置搜索');
    renderProjects();
    renderMembers();
    renderTimeline();
}

/**
 * 滚动到指定 section
 */
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const navbarHeight = 80;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * 清除搜索框内容
 */
export function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        resetSearch();
    }
}

/**
 * 获取当前搜索词
 */
export function getCurrentSearchQuery() {
    const searchInput = document.getElementById('search-input');
    return searchInput ? searchInput.value.trim() : '';
}

export default {
    initSearchSystem,
    clearSearch,
    getCurrentSearchQuery
};
