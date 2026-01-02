// ===== Global State =====
let currentLang = 'en';
let currentTheme = 'light';
let currentAccessLevel = 'user';

// ===== Initialize =====


function initUserHeader() {
    const username = sessionStorage.getItem("username");

    // If user opened the system page directly — send back to login
    if (!username) {
        window.location.href = "../index.html";
        return;
    }

    // Update username text
    const headerName = document.getElementById("headerUsername");
    if (headerName) {
        headerName.textContent = username;
    }

    // OPTIONAL: avatar (if you added avatarCircle earlier)
    const avatar = document.getElementById("avatarCircle");
    if (avatar) {
        avatar.textContent = username.charAt(0).toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initNavigation();
    initTabs();
    initCharts();
    initFormHandlers();
    setupEventListeners();
    animateStats();

    initUserHeader(); 

    
});



// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const lightIcon = document.querySelector('.icon-light');
    const darkIcon = document.querySelector('.icon-dark');
    
    if (theme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    
    // Redraw all charts
    setTimeout(() => {
        drawSalesChart();
        drawRevenueChart();
        drawMonthlyComparisonChart();
        drawUserActivityChart();
        drawPaymentMethodsChart();
        drawWeeklySalesChart();
    }, 100);
}

// ===== Language Management =====
function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    currentLang = savedLang;
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const placeholderAttr = `data-placeholder-${lang}`;
            if (el.hasAttribute(placeholderAttr)) {
                el.placeholder = el.getAttribute(placeholderAttr);
            }
        } else if (el.tagName === 'OPTION') {
            el.textContent = text;
        } else {
            el.textContent = text;
        }
    });
    
    localStorage.setItem('language', lang);
    
    // Redraw charts
    setTimeout(() => {
        drawSalesChart();
        drawRevenueChart();
        drawMonthlyComparisonChart();
        drawUserActivityChart();
        drawPaymentMethodsChart();
        drawWeeklySalesChart();
    }, 100);
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(currentLang);
}

// ===== Navigation =====
function initNavigation() {
    const btnDashboard = document.getElementById('btnDashboard');
    const btnUserManagement = document.getElementById('btnUserManagement');
    
    btnDashboard.addEventListener('click', () => switchView('viewDashboard', btnDashboard));
    btnUserManagement.addEventListener('click', () => switchView('viewUserManagement', btnUserManagement));
}

function switchView(viewId, button) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    if (viewId === 'viewDashboard') {
        setTimeout(() => {
            drawSalesChart();
            drawRevenueChart();
            drawMonthlyComparisonChart();
            drawUserActivityChart();
            drawPaymentMethodsChart();
            drawWeeklySalesChart();
        }, 100);
    }
}

// ===== Tabs Management =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab, tab);
        });
    });
}

function switchTab(tabId, button) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// ===== Form Handlers =====
function initFormHandlers() {
    // Generate Code Button
    const btnGenerateCode = document.getElementById('btnGenerateCode');
    if (btnGenerateCode) {
        btnGenerateCode.addEventListener('click', generateOperatorCode);
    }
    
    // Save Button
    const btnSave = document.getElementById('btnSave');
    if (btnSave) {
        btnSave.addEventListener('click', saveUserData);
    }
    
    // Access Level Change
    const accessLevel = document.getElementById('accessLevel');
    if (accessLevel) {
        accessLevel.addEventListener('change', handleAccessLevelChange);
    }
    
    // Job Role Change
    const jobRole = document.getElementById('jobRole');
    if (jobRole) {
        jobRole.addEventListener('change', applyRolePermissions);
    }
    
    // File Pickers
    const reportPathInput = document.getElementById('reportPathInput');
    const excelPathInput = document.getElementById('excelPathInput');
    
    if (reportPathInput) {
        reportPathInput.addEventListener('change', (e) => handleFolderSelect(e, 'reportPath'));
    }
    
    if (excelPathInput) {
        excelPathInput.addEventListener('change', (e) => handleFolderSelect(e, 'excelPath'));
    }
}

function generateOperatorCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const code = `OP-${year}-${random}`;
    
    const input = document.getElementById('operatorCode');
    if (input) {
        input.value = code;
        showNotification(
            currentLang === 'ar' ? 'تم إنشاء الكود بنجاح' : 'Code generated successfully',
            'success'
        );
    }
}

function saveUserData() {
    showNotification(
        currentLang === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully',
        'success'
    );
}

function handleAccessLevelChange(e) {
    currentAccessLevel = e.target.value;
    // Advanced tab is always visible now
}

function applyRolePermissions(e) {
    const role = e.target.value;
    const toggles = document.querySelectorAll('#tabAccount .toggle input[type="checkbox"]');
    
    const permissions = {
        sales: [true, true, false, false, false, true],
        accountant: [true, false, false, true, false, true],
        cashier: [false, true, false, false, false, false],
        manager: [true, true, true, true, true, true]
    };
    
    const rolePerms = permissions[role] || [false, false, false, false, false, false];
    
    toggles.forEach((toggle, index) => {
        if (rolePerms[index] !== undefined) {
            toggle.checked = rolePerms[index];
        }
    });
}

function handleFolderSelect(e, targetId) {
    const files = e.target.files;
    if (files.length > 0) {
        const path = files[0].webkitRelativePath || files[0].name;
        const folderPath = path.split('/')[0];
        
        const target = document.getElementById(targetId);
        if (target) {
            target.value = folderPath || 'Selected folder';
        }
    }
}

// ===== Charts =====
function initCharts() {
    drawSalesChart();
    drawRevenueChart();
    drawMonthlyComparisonChart();
    drawUserActivityChart();
    drawPaymentMethodsChart();
    drawWeeklySalesChart();
}

function drawSalesChart() {
    const canvas = document.getElementById('salesTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const months = currentLang === 'ar' 
        ? ['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const data = [42000, 52000, 48000, 60000, 57000, 68000];
    
    const bgColor = isDark ? '#1E293B' : '#FFFFFF';
    const gridColor = isDark ? '#334155' : '#E5E7EB';
    const textColor = isDark ? '#94A3B8' : '#6B7280';
    const lineColor = '#1E90FF';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...data);
    const minValue = 0;
    const range = maxValue - minValue;
    
    // Grid and Y-axis
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        const value = maxValue - (range / 5) * i;
        
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText((value / 1000).toFixed(0) + 'K', padding.left - 10, y);
    }
    
    // Draw line with gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, lineColor);
    gradient.addColorStop(1, '#00CED1');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    const points = [];
    data.forEach((value, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
        points.push({ x, y, value });
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points with glow
    points.forEach(point => {
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = lineColor;
        
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    months.forEach((month, index) => {
        const x = padding.left + (chartWidth / (months.length - 1)) * index;
        ctx.fillText(month, x, height - padding.bottom + 10);
    });
}

function drawRevenueChart() {
    const canvas = document.getElementById('revenueCategoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const categories = currentLang === 'ar'
        ? [
            { name: 'إلكترونيات', value: 35, color: '#1E90FF' },
            { name: 'ملابس', value: 25, color: '#10B981' },
            { name: 'منزل وحديقة', value: 20, color: '#F59E0B' },
            { name: 'طعام', value: 12, color: '#EC4899' },
            { name: 'أخرى', value: 8, color: '#8B5CF6' }
        ]
        : [
            { name: 'Electronics', value: 35, color: '#1E90FF' },
            { name: 'Clothing', value: 25, color: '#10B981' },
            { name: 'Home & Garden', value: 20, color: '#F59E0B' },
            { name: 'Food', value: 12, color: '#EC4899' },
            { name: 'Others', value: 8, color: '#8B5CF6' }
        ];
    
    const bgColor = isDark ? '#1E293B' : '#FFFFFF';
    const textColor = isDark ? '#94A3B8' : '#6B7280';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const radius = Math.min(width, height) / 3;
    
    let currentAngle = -Math.PI / 2;
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    
    categories.forEach(category => {
        const sliceAngle = (category.value / total) * Math.PI * 2;
        
        // Draw slice with shadow
        ctx.shadowBlur = 15;
        ctx.shadowColor = category.color;
        ctx.fillStyle = category.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius + 50;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        ctx.fillStyle = textColor;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(category.name, labelX, labelY);
        
        ctx.font = '12px sans-serif';
        ctx.fillText(category.value + '%', labelX, labelY + 16);
        
        currentAngle += sliceAngle;
    });
}

function drawMonthlyComparisonChart() {
    const canvas = document.getElementById('monthlyComparisonChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const months = currentLang === 'ar' 
        ? ['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const thisYear = [42, 52, 48, 60, 57, 68];
    const lastYear = [35, 45, 42, 50, 48, 55];
    
    const bgColor = isDark ? '#1E293B' : '#FFFFFF';
    const gridColor = isDark ? '#334155' : '#E5E7EB';
    const textColor = isDark ? '#94A3B8' : '#6B7280';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...thisYear, ...lastYear);
    const barWidth = chartWidth / months.length / 3;
    
    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // Draw bars
    months.forEach((month, index) => {
        const x = padding.left + (chartWidth / months.length) * index + barWidth / 2;
        
        // This year
        const height1 = (thisYear[index] / maxValue) * chartHeight;
        const gradient1 = ctx.createLinearGradient(0, padding.top, 0, height);
        gradient1.addColorStop(0, '#1E90FF');
        gradient1.addColorStop(1, '#00CED1');
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(x, padding.top + chartHeight - height1, barWidth, height1);
        
        // Last year
        const height2 = (lastYear[index] / maxValue) * chartHeight;
        const gradient2 = ctx.createLinearGradient(0, padding.top, 0, height);
        gradient2.addColorStop(0, '#A855F7');
        gradient2.addColorStop(1, '#EC4899');
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(x + barWidth + 5, padding.top + chartHeight - height2, barWidth, height2);
    });
    
    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
        const x = padding.left + (chartWidth / months.length) * index + (chartWidth / months.length) / 2;
        ctx.fillText(month, x, height - padding.bottom + 15);
    });
    
    // Legend
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(padding.left, height - 20, 12, 12);
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(currentLang === 'ar' ? 'هذا العام' : 'This Year', padding.left + 18, height - 10);
    
    ctx.fillStyle = '#A855F7';
    ctx.fillRect(padding.left + 100, height - 20, 12, 12);
    ctx.fillStyle = textColor;
    ctx.fillText(currentLang === 'ar' ? 'العام الماضي' : 'Last Year', padding.left + 118, height - 10);
}

function drawUserActivityChart() {
    const canvas = document.getElementById('userActivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const hours = currentLang === 'ar'
        ? ['12ص', '4ص', '8ص', '12م', '4م', '8م']
        : ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'];
    
    const data = [15, 8, 25, 45, 60, 40];
    
    const bgColor = isDark ? '#1E293B' : '#FFFFFF';
    const gridColor = isDark ? '#334155' : '#E5E7EB';
    const textColor = isDark ? '#94A3B8' : '#6B7280';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...data);
    
    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // Draw area chart
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, height - padding.bottom);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach((value, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    hours.forEach((hour, index) => {
        const x = padding.left + (chartWidth / (hours.length - 1)) * index;
        ctx.fillText(hour, x, height - padding.bottom + 15);
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    const btnTheme = document.getElementById('btnTheme');
    if (btnTheme) {
        btnTheme.addEventListener('click', toggleTheme);
    }
    
    const btnLanguage = document.getElementById('btnLanguage');
    if (btnLanguage) {
        btnLanguage.addEventListener('click', toggleLanguage);
    }
    
    window.addEventListener('resize', () => {
        if (document.getElementById('viewDashboard').classList.contains('active')) {
            drawSalesChart();
            drawRevenueChart();
            drawMonthlyComparisonChart();
            drawUserActivityChart();
            drawPaymentMethodsChart();
            drawWeeklySalesChart();
        }
    });
}

// ===== Animations =====
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.,]/g, '');
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current).toLocaleString();
                if (suffix.includes('K')) {
                    displayValue = displayValue + 'K';
                }
                stat.textContent = suffix.includes('$') ? '$' + displayValue : displayValue;
            }, 20);
        }
    });
}

// ===== Notifications =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    const bgColor = type === 'success' ? '#10B981' : '#EF4444';
    
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        ${currentLang === 'ar' ? 'left' : 'right'}: 24px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(${currentLang === 'ar' ? '-' : ''}100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

function drawPaymentMethodsChart() {
    const canvas = document.getElementById('paymentMethodsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const methods = currentLang === 'ar'
        ? [
            { name: 'نقدي', value: 40, color: '#5186f7' },
            { name: 'بطاقة', value: 35, color: '#6ed1d8' },
            { name: 'تحويل', value: 15, color: '#F59E0B' },
            { name: 'أخرى', value: 10, color: '#8B5CF6' }
        ]
        : [
            { name: 'Cash', value: 40, color: '#5186f7' },
            { name: 'Card', value: 35, color: '#6ed1d8' },
            { name: 'Transfer', value: 15, color: '#F59E0B' },
            { name: 'Others', value: 10, color: '#8B5CF6' }
        ];
    
    const bgColor = isDark ? 'oklch(0.12 0.01 270)' : '#FFFFFF';
    const textColor = isDark ? 'oklch(0.75 0.03 270)' : '#6B7280';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 3;
    const innerRadius = outerRadius * 0.6;
    
    let currentAngle = -Math.PI / 2;
    const total = methods.reduce((sum, m) => sum + m.value, 0);
    
    methods.forEach(method => {
        const sliceAngle = (method.value / total) * Math.PI * 2;
        
        // Draw donut slice
        ctx.fillStyle = method.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = outerRadius + 40;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(method.name, labelX, labelY);
        
        ctx.font = '11px sans-serif';
        ctx.fillText(method.value + '%', labelX, labelY + 14);
        
        currentAngle += sliceAngle;
    });
}

function drawWeeklySalesChart() {
    const canvas = document.getElementById('weeklySalesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = currentTheme === 'dark';
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    const days = currentLang === 'ar'
        ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
        : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    const data = [8500, 9200, 11000, 10500, 12800, 13500, 9800];
    
    const bgColor = isDark ? 'oklch(0.12 0.01 270)' : '#FFFFFF';
    const gridColor = isDark ? 'oklch(0.15 0.02 260)' : '#E5E7EB';
    const textColor = isDark ? 'oklch(0.75 0.03 270)' : '#6B7280';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.6;
    const barGap = chartWidth / data.length * 0.4;
    
    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((value, index) => {
        const x = padding.left + (chartWidth / data.length) * index + barGap / 2;
        const barHeight = (value / maxValue) * chartHeight;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, '#6ed1d8');
        gradient.addColorStop(1, '#5186f7');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, padding.top + chartHeight - barHeight, barWidth, barHeight);
    });
    
    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    
    days.forEach((day, index) => {
        const x = padding.left + (chartWidth / days.length) * index + (chartWidth / days.length) / 2;
        ctx.fillText(day, x, height - padding.bottom + 15);
    });
}

// ===== Real-time Updates (Simulation) =====
setInterval(() => {
    if (document.getElementById('viewDashboard').classList.contains('active')) {
        // Simulate real-time stat updates
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            if (Math.random() > 0.7) {
                const currentValue = stat.textContent;
                // Add subtle animation
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
}, 5000);


