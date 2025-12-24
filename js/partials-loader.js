// Partial Loader Utility
async function loadPartial(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            // Re-initialize after loading
            if (elementId === 'sidebar-placeholder') {
                initializeNavigation();
            }
            if (elementId === 'header-placeholder') {
                initializeHamburger();
            }
        }
    } catch (error) {
        console.error(`Error loading partial ${filePath}:`, error);
    }
}

// Load all partials
async function loadPartials() {
    try {
        await Promise.all([
            loadPartial('header-placeholder', 'partials/header.html'),
            loadPartial('footer-placeholder', 'partials/footer.html'),
            loadPartial('sidebar-placeholder', 'partials/sidebar.html')
        ]);
        
        // Ensure dashboard is visible after partials load
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) {
            dashboardPage.style.display = 'flex';
        }
        
        // Dispatch event to notify that partials are loaded
        window.dispatchEvent(new Event('partialsLoaded'));
    } catch (error) {
        console.error('Error loading partials:', error);
        // Still show dashboard even if partials fail
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) {
            dashboardPage.style.display = 'flex';
        }
        // Dispatch event anyway
        window.dispatchEvent(new Event('partialsLoaded'));
    }
}

// Initialize Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    navItems.forEach(item => {
        const page = item.dataset.page;
        if (currentPage === page) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', () => {
            if (page) {
                window.location.href = page;
            }
        });
    });
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Initialize Hamburger Menu
function initializeHamburger() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (hamburgerBtn && sidebar) {
        // Check if already initialized
        if (!hamburgerBtn.hasAttribute('data-initialized')) {
            hamburgerBtn.setAttribute('data-initialized', 'true');
            
            hamburgerBtn.addEventListener('click', () => {
                // On mobile, toggle mobile-open class instead of minimized
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('mobile-open');
                    // Add overlay when sidebar opens on mobile
                    if (sidebar.classList.contains('mobile-open')) {
                        const overlay = document.createElement('div');
                        overlay.className = 'sidebar-overlay';
                        overlay.id = 'sidebarOverlay';
                        document.body.appendChild(overlay);
                        overlay.addEventListener('click', () => {
                            sidebar.classList.remove('mobile-open');
                            overlay.remove();
                        });
                    } else {
                        const overlay = document.getElementById('sidebarOverlay');
                        if (overlay) overlay.remove();
                    }
                } else {
                    sidebar.classList.toggle('minimized');
                    updateMainContentMargin();
                }
            });
            
            // Initialize margin on load
            updateMainContentMargin();
        }
    }
    
    function updateMainContentMargin() {
        if (mainContent && sidebar) {
            if (sidebar.classList.contains('minimized')) {
                mainContent.style.marginLeft = '80px';
                mainContent.style.width = 'calc(100vw - 80px)';
                mainContent.classList.add('sidebar-minimized');
            } else {
                mainContent.style.marginLeft = '260px';
                mainContent.style.width = 'calc(100vw - 260px)';
                mainContent.classList.remove('sidebar-minimized');
            }
        } else if (mainContent) {
            // If sidebar doesn't exist yet, set default margin
            mainContent.style.marginLeft = '260px';
            mainContent.style.width = 'calc(100vw - 260px)';
        }
    }
    
    // Update margin when sidebar loads
    setTimeout(() => {
        updateMainContentMargin();
    }, 500);
    
    // Update on window resize
    window.addEventListener('resize', () => {
        updateMainContentMargin();
    });
}

// Load partials when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPartials);
} else {
    loadPartials();
}

