// State
let products = JSON.parse(localStorage.getItem('products') || '[]');
let currentUser = null;
let selectedImages = [];
let multiSelectData = {
    subCategory: [],
    size: [],
    color: [],
    shape: [],
    neckSize: [],
    neckType: [],
    material: [],
    usage: []
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for partials to load if they exist
    if (document.getElementById('header-placeholder')) {
        // Wait for partials to load
        window.addEventListener('partialsLoaded', () => {
            setTimeout(() => {
                initializeApp();
            }, 300);
        });
        // Also try to initialize after a delay in case event doesn't fire
        setTimeout(() => {
            initializeApp();
        }, 1500);
    } else {
        // No partials, initialize immediately
        setTimeout(() => {
            initializeApp();
        }, 100);
    }
});
});

function initializeApp() {
    // Page Elements
    const loginPage = document.getElementById('loginPage');
    const forgotPasswordPage = document.getElementById('forgotPasswordPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');

    // Login Form
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLogin = document.getElementById('backToLogin');

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetSuccess = document.getElementById('resetSuccess');

    // Navigation
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    const logoutBtn = document.getElementById('logoutBtn');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    // Product Form
    const addProductForm = document.getElementById('addProductForm');
    const imageUpload = document.getElementById('imageUpload');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const addProductSuccess = document.getElementById('addProductSuccess');
    const cancelAddProduct = document.getElementById('cancelAddProduct');

    // Product List
    const productTableBody = document.getElementById('productTableBody');
    const searchProducts = document.getElementById('searchProducts');

    // Units
    const addIndustryBtn = document.getElementById('addIndustry');
    const addSubCategoryBtn = document.getElementById('addSubCategory');
    const addSizeBtn = document.getElementById('addSize');
    const addColorBtn = document.getElementById('addColor');
    const addShapeBtn = document.getElementById('addShape');
    const addNeckSizeBtn = document.getElementById('addNeckSize');
    const addNeckTypeBtn = document.getElementById('addNeckType');
    const addMaterialBtn = document.getElementById('addMaterial');
    const addUsageBtn = document.getElementById('addUsage');

    // Update main content margin based on sidebar state (helper function)
    function updateMainContentMargin() {
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.getElementById('sidebar');
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
            mainContent.style.marginLeft = '260px';
            mainContent.style.width = 'calc(100vw - 260px)';
        }
    }

    // Hamburger Menu Toggle - Fixed (only if elements exist)
    if (hamburgerBtn && sidebar) {
        // Check if hamburger is already initialized by partials-loader
        if (!hamburgerBtn.hasAttribute('data-initialized')) {
            hamburgerBtn.setAttribute('data-initialized', 'true');
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('minimized');
                updateMainContentMargin();
            });

            // Initialize margin on load
            updateMainContentMargin();
        }
    }

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Demo login credentials
            const validUsername = 'admin@example.com';
            const validPassword = 'akshay@123';

            if (username === validUsername && password === validPassword) {
                currentUser = { username };
                if (loginPage) loginPage.style.display = 'none';
                if (dashboardPage) {
                    dashboardPage.style.display = 'flex';
                    // Wait a bit for DOM to update, then update margin
                    setTimeout(() => {
                        updateMainContentMargin();
                    }, 100);
                }
                updateDashboardStats();
                if (loginError) loginError.style.display = 'none';
            } else {
                if (loginError) {
                    loginError.textContent = 'Invalid credentials. Please use: admin@example.com / akshay@123';
                    loginError.style.display = 'block';
                }
            }
        });
    }

    // Forgot Password
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', () => {
            if (loginPage) loginPage.style.display = 'none';
            if (forgotPasswordPage) forgotPasswordPage.style.display = 'flex';
        });
    }

    if (backToLogin) {
        backToLogin.addEventListener('click', () => {
            if (forgotPasswordPage) forgotPasswordPage.style.display = 'none';
            if (loginPage) loginPage.style.display = 'flex';
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            if (resetSuccess) {
                resetSuccess.textContent = `Password reset link sent to ${email}`;
                resetSuccess.style.display = 'block';
            }
            setTimeout(() => {
                if (forgotPasswordPage) forgotPasswordPage.style.display = 'none';
                if (loginPage) loginPage.style.display = 'flex';
                if (resetSuccess) resetSuccess.style.display = 'none';
            }, 3000);
        });
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            updatePageHeader(sectionId);
        });
    });

    function updatePageHeader(sectionId) {
        const titles = {
            'dashboard': { title: 'Dashboard', subtitle: 'Overview of your products' },
            'add-product': { title: 'Add Product', subtitle: 'Create a new product listing' },
            'products': { title: 'Product List', subtitle: 'Manage your products' },
            'units': { title: 'Modify Units', subtitle: 'Manage categories and attributes' }
        };
        
        const header = titles[sectionId];
        if (pageTitle && header) pageTitle.textContent = header.title;
        if (pageSubtitle && header) pageSubtitle.textContent = header.subtitle;
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            if (dashboardPage) dashboardPage.style.display = 'none';
            if (loginPage) loginPage.style.display = 'flex';
            if (loginForm) loginForm.reset();
        });
    }

    // Image Upload - Multiple Images
    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const readers = [];
                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        selectedImages.push(event.target.result);
                        if (index === files.length - 1) {
                            renderImagePreview();
                        }
                    };
                    reader.readAsDataURL(file);
                    readers.push(reader);
                });
            }
        });
    }

    function renderImagePreview() {
        if (!imagePreview) return;
        imagePreview.innerHTML = '';
        selectedImages.forEach((img, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${img}" alt="Preview ${index + 1}">
                <button class="preview-remove" data-index="${index}">×</button>
            `;
            imagePreview.appendChild(previewItem);
        });

        document.querySelectorAll('.preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                selectedImages.splice(index, 1);
                renderImagePreview();
            });
        });
    }

    // Multi-Select Functionality
    function initMultiSelect() {
        const multiSelectDisplays = document.querySelectorAll('.multi-select-display');
        
        if (multiSelectDisplays.length === 0) {
            return;
        }
        
        multiSelectDisplays.forEach(display => {
            // Skip if already initialized
            if (display.hasAttribute('data-initialized')) {
                return;
            }
            display.setAttribute('data-initialized', 'true');
            
            const target = display.dataset.target;
            const dropdown = display.nextElementSibling;
            
            if (!dropdown || !dropdown.classList.contains('multi-select-dropdown')) {
                return;
            }
            
            display.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Close other dropdowns
                document.querySelectorAll('.multi-select-dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('open');
                        const prevDisplay = d.previousElementSibling;
                        if (prevDisplay && prevDisplay.classList.contains('multi-select-display')) {
                            prevDisplay.classList.remove('open');
                        }
                    }
                });
                
                dropdown.classList.toggle('open');
                display.classList.toggle('open');
                
                if (dropdown.classList.contains('open')) {
                    updateDropdownOptions(target, dropdown);
                }
            });
        });
        
        // Close dropdowns when clicking outside (only add once)
        if (!window.dropdownOutsideListenerAdded) {
            window.dropdownOutsideListenerAdded = true;
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.multi-select-wrapper')) {
                    document.querySelectorAll('.multi-select-dropdown').forEach(d => {
                        d.classList.remove('open');
                        const prevDisplay = d.previousElementSibling;
                        if (prevDisplay && prevDisplay.classList.contains('multi-select-display')) {
                            prevDisplay.classList.remove('open');
                        }
                    });
                }
            });
        }
    }

    function updateDropdownOptions(target, dropdown) {
        // First try to get from localStorage (for add-product page)
        const unitsData = JSON.parse(localStorage.getItem('unitsData') || '{}');
        let options = [];
        
        // Map target names to storage keys
        const targetMap = {
            'subCategory': 'subCategories',
            'size': 'sizes',
            'color': 'colors',
            'shape': 'shapes',
            'neckSize': 'neckSizes',
            'neckType': 'neckTypes',
            'material': 'materials',
            'usage': 'usage'
        };
        
        const storageKey = targetMap[target];
        if (storageKey && unitsData[storageKey]) {
            options = unitsData[storageKey];
        } else {
            // Fallback to DOM if on units page
            const listId = target + 'List';
            const list = document.getElementById(listId);
            if (list) {
                options = Array.from(list.querySelectorAll('.unit-item-text')).map(el => el.textContent);
            }
        }
        
        if (options.length === 0) {
            dropdown.innerHTML = '<div class="multi-select-option disabled">No options available</div>';
            return;
        }
        
        dropdown.innerHTML = options.map(option => {
            const isSelected = multiSelectData[target].includes(option);
            return `<div class="multi-select-option ${isSelected ? 'selected' : ''}" data-value="${option}" data-target="${target}">${option}</div>`;
        }).join('');
        
        // Add click handlers to options
        dropdown.querySelectorAll('.multi-select-option:not(.disabled)').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const target = option.dataset.target;
                
                if (multiSelectData[target].includes(value)) {
                    multiSelectData[target] = multiSelectData[target].filter(v => v !== value);
                    option.classList.remove('selected');
                } else {
                    multiSelectData[target].push(value);
                    option.classList.add('selected');
                }
                
                updateMultiSelectDisplay(target);
            });
        });
    }

    function updateMultiSelectDisplay(target) {
        const display = document.querySelector(`.multi-select-display[data-target="${target}"]`);
        if (!display) return;
        
        const selected = multiSelectData[target];
        
        if (selected.length === 0) {
            const placeholder = target === 'subCategory' ? 'Select sub categories' : `Select ${target}`;
            display.innerHTML = `<span class="multi-select-placeholder">${placeholder}</span>`;
        } else {
            display.innerHTML = selected.map(value => 
                `<span class="selected-tag">${value}<span class="remove-tag" data-target="${target}" data-value="${value}">×</span></span>`
            ).join('');
            
            // Add remove handlers
            display.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const target = btn.dataset.target;
                    const value = btn.dataset.value;
                    multiSelectData[target] = multiSelectData[target].filter(v => v !== value);
                    updateMultiSelectDisplay(target);
                });
            });
        }
    }

    // Populate Industry Dropdown - Fixed (Single Selection)
    function populateIndustryDropdown() {
        const industrySelect = document.getElementById('industry');
        if (!industrySelect) return;
        
        // Get industries from localStorage first
        const unitsData = JSON.parse(localStorage.getItem('unitsData') || '{}');
        let industries = [];
        
        if (unitsData.industries && unitsData.industries.length > 0) {
            industries = unitsData.industries;
        } else {
            // Fallback to DOM if on units page
            const industryList = document.getElementById('industryList');
            if (industryList) {
                industries = Array.from(industryList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
            }
        }
        
        const currentValue = industrySelect.value;
        industrySelect.innerHTML = '<option value="">Select Industry</option>' + 
            industries.map(ind => `<option value="${ind}">${ind}</option>`).join('');
        
        // Restore selected value if it still exists
        if (currentValue && industries.includes(currentValue)) {
            industrySelect.value = currentValue;
        }
    }

    // Initialize multi-select and industry dropdown on page load
    function initializeDropdowns() {
        // Remove initialization flags to allow re-initialization
        document.querySelectorAll('.multi-select-display').forEach(display => {
            display.removeAttribute('data-initialized');
        });
        
        initMultiSelect();
        populateIndustryDropdown();
    }
    
    // Try multiple times to ensure elements are ready
    setTimeout(() => {
        initializeDropdowns();
    }, 200);
    
    setTimeout(() => {
        initializeDropdowns();
    }, 600);
    
    setTimeout(() => {
        initializeDropdowns();
    }, 1200);
    
    // Update dropdowns when units data changes
    window.addEventListener('unitsUpdated', () => {
        setTimeout(() => {
            populateIndustryDropdown();
            // Re-initialize multi-select to pick up new options
            document.querySelectorAll('.multi-select-display').forEach(display => {
                display.removeAttribute('data-initialized');
            });
            initMultiSelect();
        }, 100);
    });
    
    // Also update when page becomes visible (user navigated from units page)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                populateIndustryDropdown();
                document.querySelectorAll('.multi-select-display').forEach(display => {
                    display.removeAttribute('data-initialized');
                });
                initMultiSelect();
            }, 200);
        }
    });
    
    // Re-initialize when partials load
    window.addEventListener('partialsLoaded', () => {
        setTimeout(() => {
            initializeDropdowns();
        }, 400);
    });

    // Add Product Form
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (selectedImages.length === 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Please upload at least one product image';
                addProductForm.insertBefore(errorDiv, addProductForm.firstChild);
                setTimeout(() => errorDiv.remove(), 3000);
                return;
            }

            const product = {
                id: Date.now(),
                name: document.getElementById('productName').value,
                images: [...selectedImages],
                subCategory: multiSelectData.subCategory.join(', '),
                description: document.getElementById('description').value,
                size: multiSelectData.size.join(', '),
                industry: document.getElementById('industry').value,
                capacity: document.getElementById('capacity').value,
                height: document.getElementById('height').value,
                width: document.getElementById('width').value,
                weight: document.getElementById('weight').value,
                color: multiSelectData.color.join(', '),
                shape: multiSelectData.shape.join(', '),
                neckSize: multiSelectData.neckSize.join(', '),
                neckType: multiSelectData.neckType.join(', '),
                material: multiSelectData.material.join(', '),
                usage: multiSelectData.usage.join(', '),
                outofstock: document.getElementById('outofstock').checked,
                active: document.getElementById('active').checked,
                featured: document.getElementById('featured').checked,
                topRated: document.getElementById('topRated') ? document.getElementById('topRated').checked : false,
                bestSeller: document.getElementById('bestSeller') ? document.getElementById('bestSeller').checked : false,
                onSale: document.getElementById('onSale') ? document.getElementById('onSale').checked : false
            };

            // Get existing products from localStorage
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            existingProducts.push(product);
            localStorage.setItem('products', JSON.stringify(existingProducts));
            products = existingProducts;
            
            if (addProductSuccess) {
                addProductSuccess.textContent = 'Product added successfully!';
                addProductSuccess.style.display = 'block';
                setTimeout(() => {
                    addProductSuccess.style.display = 'none';
                    // Redirect to products page after success
                    window.location.href = 'products.html';
                }, 2000);
            }

            addProductForm.reset();
            selectedImages = [];
            if (imagePreview) imagePreview.innerHTML = '';
            
            // Reset multi-select data
            Object.keys(multiSelectData).forEach(key => {
                multiSelectData[key] = [];
                updateMultiSelectDisplay(key);
            });
            
            updateDashboardStats();
            renderProductList();
        });
    }

    if (cancelAddProduct) {
        cancelAddProduct.addEventListener('click', () => {
            if (addProductForm) addProductForm.reset();
            selectedImages = [];
            if (imagePreview) imagePreview.innerHTML = '';
            Object.keys(multiSelectData).forEach(key => {
                multiSelectData[key] = [];
                updateMultiSelectDisplay(key);
            });
        });
    }

    // Render Product List
    function renderProductList(searchTerm = '') {
        if (!productTableBody) return;
        
        // Get products from localStorage
        const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.industry.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            productTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        ${searchTerm ? 'No products found' : 'No products added yet'}
                    </td>
                </tr>
            `;
            return;
        }

        productTableBody.innerHTML = filteredProducts.map(product => {
            let badges = '';
            if (product.active) badges += '<span class="badge badge-active">Active</span>';
            else badges += '<span class="badge badge-inactive">Inactive</span>';
            if (product.featured) badges += '<span class="badge badge-featured">Featured</span>';
            
            return `
            <tr>
                <td>
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image-cell">
                </td>
                <td>${product.name}</td>
                <td>${product.industry}</td>
                <td>${product.size}</td>
                <td>${badges}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editProduct(${product.id})">Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }

    if (searchProducts) {
        searchProducts.addEventListener('input', (e) => {
            renderProductList(e.target.value);
        });
    }

    // Product Actions
    window.editProduct = (id) => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#FFD700;color:#000;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;';
        messageDiv.textContent = 'Edit functionality will be implemented';
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 2000);
    };

    window.deleteProduct = (id) => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:20px 28px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.2);z-index:9999;text-align:center;';
        messageDiv.innerHTML = `
            <p style="margin-bottom:16px;color:#fff;font-size:15px;">Are you sure you want to delete this product?</p>
            <button id="confirmDelete" style="padding:8px 20px;background:#FFD700;color:#000;border:none;border-radius:4px;margin-right:8px;cursor:pointer;font-weight:600;">Delete</button>
            <button id="cancelDelete" style="padding:8px 20px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
        `;
        document.body.appendChild(messageDiv);
        
        document.getElementById('confirmDelete').onclick = () => {
            const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
            const updatedProducts = allProducts.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            products = updatedProducts;
            renderProductList();
            updateDashboardStats();
            messageDiv.remove();
        };
        
        document.getElementById('cancelDelete').onclick = () => {
            messageDiv.remove();
        };
    };

    // Update Dashboard Stats
    function updateDashboardStats() {
        const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const stats = {
            total: allProducts.length,
            active: allProducts.filter(p => p.active).length,
            featured: allProducts.filter(p => p.featured).length,
            outOfStock: allProducts.filter(p => p.outofstock).length
        };

        const statCards = document.querySelectorAll('.stat-value');
        if (statCards.length >= 4) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.active;
            statCards[2].textContent = stats.featured;
            statCards[3].textContent = stats.outOfStock;
        }
    }

    // Unit Management
    function addUnitItem(listId, inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const value = input.value.trim();
        
        if (value) {
            const list = document.getElementById(listId);
            if (!list) return;
            
            const li = document.createElement('li');
            li.className = 'unit-item';
            li.innerHTML = `
                <span class="unit-item-text">${value}</span>
                <button class="btn-remove">×</button>
            `;
            list.appendChild(li);
            input.value = '';
            
            li.querySelector('.btn-remove').addEventListener('click', () => {
                li.remove();
                // Sync to localStorage
                if (typeof syncUnitsToStorage === 'function') {
                    syncUnitsToStorage();
                }
                // Update dropdowns
                if (listId === 'industryList') {
                    populateIndustryDropdown();
                }
                // Dispatch event
                window.dispatchEvent(new Event('unitsUpdated'));
            });
            
            // Sync to localStorage
            if (typeof syncUnitsToStorage === 'function') {
                syncUnitsToStorage();
            }
            
            // Update dropdowns
            if (listId === 'industryList') {
                populateIndustryDropdown();
            }
            
            // Dispatch event to notify other pages
            window.dispatchEvent(new Event('unitsUpdated'));
        }
    }

    if (addIndustryBtn) {
        addIndustryBtn.addEventListener('click', () => addUnitItem('industryList', 'newIndustry'));
    }
    if (addSubCategoryBtn) {
        addSubCategoryBtn.addEventListener('click', () => addUnitItem('subCategoryList', 'newSubCategory'));
    }
    if (addSizeBtn) {
        addSizeBtn.addEventListener('click', () => addUnitItem('sizeList', 'newSize'));
    }
    if (addColorBtn) {
        addColorBtn.addEventListener('click', () => addUnitItem('colorList', 'newColor'));
    }
    if (addShapeBtn) {
        addShapeBtn.addEventListener('click', () => addUnitItem('shapeList', 'newShape'));
    }
    if (addNeckSizeBtn) {
        addNeckSizeBtn.addEventListener('click', () => addUnitItem('neckSizeList', 'newNeckSize'));
    }
    if (addNeckTypeBtn) {
        addNeckTypeBtn.addEventListener('click', () => addUnitItem('neckTypeList', 'newNeckType'));
    }
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', () => addUnitItem('materialList', 'newMaterial'));
    }
    if (addUsageBtn) {
        addUsageBtn.addEventListener('click', () => addUnitItem('usageList', 'newUsage'));
    }

    // Initialize remove buttons for existing units
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const listItem = e.target.parentElement;
            const list = listItem.parentElement;
            listItem.remove();
            
            // Sync to localStorage
            if (typeof syncUnitsToStorage === 'function') {
                syncUnitsToStorage();
            }
            
            // Update dropdowns
            if (list && list.id === 'industryList') {
                populateIndustryDropdown();
            }
            
            // Dispatch event
            window.dispatchEvent(new Event('unitsUpdated'));
        });
    });
}

