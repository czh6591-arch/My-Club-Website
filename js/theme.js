/**
 * 主题切换模块
 * 支持深色/浅色模式切换，状态保存在localStorage
 */

const THEME_KEY = 'techclub-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * 获取当前主题
 * @returns {string} 当前主题 ('dark' 或 'light')
 */
export function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        return savedTheme;
    }
    
    // 如果没有保存的主题，检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return LIGHT_THEME;
    }
    
    return DARK_THEME;
}

/**
 * 应用主题
 * @param {string} theme - 要应用的主题 ('dark' 或 'light')
 */
export function applyTheme(theme) {
    const body = document.body;
    
    if (theme === LIGHT_THEME) {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
    
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * 切换主题
 */
export function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
    return newTheme;
}

/**
 * 初始化主题系统
 */
export function initThemeSystem() {
    // 应用保存的主题
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);
    
    // 绑定主题切换按钮
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            toggleTheme();
        });
    }
    
    // 监听系统主题变化（可选）
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // 只有当用户没有手动设置主题时才响应系统变化
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
            }
        });
    }
    
    console.log('主题系统已初始化，当前主题:', savedTheme);
}

export default {
    getCurrentTheme,
    applyTheme,
    toggleTheme,
    initThemeSystem
};
