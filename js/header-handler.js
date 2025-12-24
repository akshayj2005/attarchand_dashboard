// Header User Profile Handler
document.addEventListener('DOMContentLoaded', () => {
    initializeHeaderUserProfile();
});

// Also initialize when partials are loaded
window.addEventListener('partialsLoaded', () => {
    setTimeout(() => {
        initializeHeaderUserProfile();
    }, 100);
});

function initializeHeaderUserProfile() {
    // Load user data and update header
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Set defaults if no data
    if (!userData.userId) {
        userData.userId = 'ADM001';
        userData.fullName = 'Admin User';
        userData.email = 'admin@example.com';
        userData.role = 'Administrator';
        userData.avatar = '';
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Update header user info
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const userAvatarText = document.getElementById('userAvatarText');
    
    if (userNameDisplay) {
        userNameDisplay.textContent = userData.fullName || 'Admin User';
    }
    if (userRoleDisplay) {
        userRoleDisplay.textContent = userData.role || 'Administrator';
    }
    if (userData.avatar && userAvatarImg) {
        userAvatarImg.src = userData.avatar;
        userAvatarImg.style.display = 'block';
        if (userAvatarText) userAvatarText.style.display = 'none';
    } else if (userAvatarText) {
        const initial = (userData.fullName || 'A').charAt(0).toUpperCase();
        userAvatarText.textContent = initial;
        if (userAvatarImg) userAvatarImg.style.display = 'none';
        userAvatarText.style.display = 'block';
    }
    
    // User profile dropdown
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    const profileSettingsBtn = document.getElementById('profileSettingsBtn');
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
    const headerLogoutBtn = document.getElementById('headerLogoutBtn');
    
    // Toggle dropdown
    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
            userProfileBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
                userProfileBtn.classList.remove('active');
            }
        });
    }
    
    // Profile Settings
    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', () => {
            window.location.href = 'profile-settings.html';
        });
    }
    
    // View Profile
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
    
    // Logout from dropdown
    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Logout from header icon
    if (headerLogoutBtn) {
        headerLogoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }
}


