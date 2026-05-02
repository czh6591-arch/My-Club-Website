/**
 * 主入口文件
 * 整合所有模块，初始化整个网站
 */

import { initThemeSystem } from './theme.js';
import { initProjectsSystem } from './projects.js';
import { initMembersSystem } from './members.js';
import { initTimelineSystem } from './timeline.js';
import { initNavigationSystem } from './navigation.js';
import { initSearchSystem } from './search.js';

/**
 * 初始化整个应用
 */
async function initApp() {
    console.log('🚀 正在初始化编程技术社团网站...');
    
    try {
        // 1. 初始化主题系统（必须最先初始化，因为其他模块可能依赖主题）
        initThemeSystem();
        
        // 2. 初始化导航系统
        initNavigationSystem();
        
        // 3. 并行初始化各个数据模块
        const initPromises = [
            initProjectsSystem(),
            initMembersSystem(),
            initTimelineSystem()
        ];
        
        await Promise.all(initPromises);
        
        // 4. 初始化搜索系统
        initSearchSystem();
        
        // 5. 初始化联系表单
        initContactForm();
        
        // 6. 触发初始动画
        triggerInitialAnimations();
        
        console.log('✅ 网站初始化完成！');
        
    } catch (error) {
        console.error('❌ 网站初始化失败:', error);
        // 即使出错也尽量恢复
        handleInitError(error);
    }
}

/**
 * 初始化联系表单
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // 验证数据
            if (!name || !email || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // 模拟提交
            console.log('表单提交数据:', { name, email, message });
            
            // 显示成功消息
            showNotification('消息已发送！我们会尽快回复您。', 'success');
            
            // 重置表单
            contactForm.reset();
        });
    }
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 设置样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: 'var(--border-radius-md)',
        zIndex: '3000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '300px',
        wordWrap: 'break-word',
        backgroundColor: type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                         type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                         'rgba(59, 130, 246, 0.9)',
        color: 'white',
        fontWeight: '500',
        boxShadow: 'var(--shadow-lg)'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 触发初始动画
 */
function triggerInitialAnimations() {
    // 触发首页元素的动画
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const animatedElements = heroSection.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100);
        });
    }
    
    // 为滚动到顶部的 section 触发动画
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animatedElements = entry.target.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
                    animatedElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        },
        { threshold: 0.2 }
    );
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 处理初始化错误
 */
function handleInitError(error) {
    console.error('初始化过程中出现错误，但网站仍可继续运行:', error);
    
    // 显示错误提示（可选）
    // showNotification('部分功能可能无法正常工作，请刷新页面重试', 'error');
}

/**
 * 添加必要的 CSS 动画样式
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* 阻止弹窗背景滚动 */
        body.modal-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM 已经加载完成
    initApp();
}

// 添加动画样式
addAnimationStyles();

// 导出全局方法（供调试使用）
window.TechClubApp = {
    init: initApp,
    showNotification: showNotification
};

console.log('📦 主入口文件已加载，等待 DOM 就绪...');
