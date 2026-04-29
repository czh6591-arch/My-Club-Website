/**
 * 导航模块
 * 负责导航栏滚动高亮、滚动驱动动画和移动端菜单
 */

let currentSection = 'home';
const sections = ['home', 'about', 'projects', 'members', 'timeline', 'contact'];

/**
 * 初始化导航系统
 */
export function initNavigationSystem() {
    // 设置滚动观察器
    setupScrollObserver();
    
    // 绑定导航链接点击事件
    bindNavigationLinks();
    
    // 绑定移动端菜单
    bindMobileMenu();
    
    // 绑定导航栏滚动效果
    bindNavbarScroll();
    
    console.log('导航系统已初始化');
}

/**
 * 设置滚动观察器
 */
function setupScrollObserver() {
    // 创建 Intersection Observer 用于观察各个 section
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    updateActiveNavLink(sectionId);
                    currentSection = sectionId;
                    
                    // 触发该 section 的滚动动画
                    triggerSectionAnimations(entry.target);
                }
            });
        },
        {
            threshold: 0.3, // 当30%可见时触发
            rootMargin: '-50px 0px -50px 0px'
        }
    );
    
    // 观察所有 section
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
    
    // 为需要动画的元素添加类
    addAnimationClasses();
}

/**
 * 添加动画类
 */
function addAnimationClasses() {
    // 为统计卡片添加缩放动画
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.classList.add('scale-in');
        item.style.transitionDelay = `${index * 100}ms`;
    });
    
    // 为功能卡片添加淡入动画
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = `${index * 150}ms`;
    });
    
    // 为联系信息卡片添加淡入动画
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.classList.add('scale-in');
        item.style.transitionDelay = `${index * 100}ms`;
    });
}

/**
 * 触发 section 的动画
 */
function triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    
    animatedElements.forEach((element, index) => {
        // 使用延迟创建逐个出现的效果
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
}

/**
 * 更新导航链接高亮状态
 */
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 绑定导航链接点击事件
 */
function bindNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 阻止默认跳转
            e.preventDefault();
            
            // 获取目标 section ID
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 平滑滚动到目标位置
                smoothScrollTo(targetSection);
                
                // 关闭移动端菜单（如果打开）
                closeMobileMenu();
            }
        });
    });
    
    // 绑定页脚导航链接
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });
}

/**
 * 平滑滚动到目标元素
 */
function smoothScrollTo(targetElement) {
    // 计算目标位置（考虑导航栏高度）
    const navbarHeight = 80;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    
    // 使用 scrollTo 方法
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * 绑定移动端菜单
 */
function bindMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

/**
 * 关闭移动端菜单
 */
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        navLinks.classList.remove('active');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
    }
}

/**
 * 绑定导航栏滚动效果
 */
function bindNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 添加滚动阴影效果
        if (currentScrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '15px 0';
        }
        
        // 可选：滚动时隐藏/显示导航栏
        // if (currentScrollY > lastScrollY && currentScrollY > 200) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * 获取当前所在的 section
 */
export function getCurrentSection() {
    return currentSection;
}

/**
 * 滚动到指定 section
 */
export function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        smoothScrollTo(targetSection);
    }
}

export default {
    initNavigationSystem,
    getCurrentSection,
    scrollToSection
};
