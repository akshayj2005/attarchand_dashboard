// Profile Settings JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initializeProfileSettings();
});

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Set default values if no user data exists
    if (!userData.userId) {
        userData.userId = 'ADM001';
        userData.fullName = 'Admin User';
        userData.email = 'admin@example.com';
        userData.phone = '';
        userData.role = 'Administrator';
        userData.bio = '';
        userData.avatar = '';
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Populate form fields
    document.getElementById('userId').value = userData.userId || 'ADM001';
    document.getElementById('fullName').value = userData.fullName || 'Admin User';
    document.getElementById('email').value = userData.email || 'admin@example.com';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('role').value = userData.role || 'Administrator';
    document.getElementById('bio').value = userData.bio || '';
    
    // Update display
    document.getElementById('profileDisplayName').textContent = userData.fullName || 'Admin User';
    document.getElementById('profileDisplayRole').textContent = userData.role || 'Administrator';
    
    // Update avatar
    const avatarImg = document.getElementById('profileAvatarImg');
    const avatarText = document.getElementById('profileAvatarText');
    if (userData.avatar) {
        avatarImg.src = userData.avatar;
        avatarImg.style.display = 'block';
        avatarText.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        avatarText.style.display = 'block';
        avatarText.textContent = (userData.fullName || 'A').charAt(0).toUpperCase();
    }
}

function initializeProfileSettings() {
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    
    // Avatar upload
    if (avatarUploadBtn && avatarFileInput) {
        avatarUploadBtn.addEventListener('click', () => {
            avatarFileInput.click();
        });
        
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const avatarImg = document.getElementById('profileAvatarImg');
                    const avatarText = document.getElementById('profileAvatarText');
                    avatarImg.src = event.target.result;
                    avatarImg.style.display = 'block';
                    avatarText.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form submission
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate password if provided
            if (newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    alert('New passwords do not match!');
                    return;
                }
                if (newPassword.length < 6) {
                    alert('Password must be at least 6 characters long!');
                    return;
                }
            }
            
            // Save user data
            const userData = {
                userId: document.getElementById('userId').value,
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                role: document.getElementById('role').value,
                bio: document.getElementById('bio').value,
                avatar: document.getElementById('profileAvatarImg').src || ''
            };
            
            // Update avatar if changed
            const avatarImg = document.getElementById('profileAvatarImg');
            if (avatarImg.style.display === 'block') {
                userData.avatar = avatarImg.src;
            }
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show success message
            const successMsg = document.getElementById('profileSaveSuccess');
            successMsg.textContent = 'Profile updated successfully!';
            successMsg.style.display = 'block';
            
            setTimeout(() => {
                successMsg.style.display = 'none';
                // Update header user info
                updateHeaderUserInfo();
            }, 2000);
        });
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
}

function updateHeaderUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Update header elements if they exist
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
    if (userAvatarImg && userData.avatar) {
        userAvatarImg.src = userData.avatar;
        userAvatarImg.style.display = 'block';
        if (userAvatarText) userAvatarText.style.display = 'none';
    } else if (userAvatarText) {
        userAvatarText.textContent = (userData.fullName || 'A').charAt(0).toUpperCase();
        if (userAvatarImg) userAvatarImg.style.display = 'none';
        userAvatarText.style.display = 'block';
    }
}


