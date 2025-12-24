// Units Sync - Sync units data to localStorage and update dropdowns
function syncUnitsToStorage() {
    const units = {
        industries: [],
        subCategories: [],
        sizes: [],
        colors: [],
        shapes: [],
        neckTypes: [],
        materials: [],
        fragrances: [],
        jarsBottles: []
    };
    
    // Get all units from the page
    const industryList = document.getElementById('industryList');
    const subCategoryList = document.getElementById('subCategoryList');
    const sizeList = document.getElementById('sizeList');
    const colorList = document.getElementById('colorList');
    const shapeList = document.getElementById('shapeList');
    const neckTypeList = document.getElementById('neckTypeList');
    const materialList = document.getElementById('materialList');
    const fragrancesList = document.getElementById('fragrancesList');
    const jarsBottlesList = document.getElementById('jarsBottlesList');
    
    if (industryList) {
        units.industries = Array.from(industryList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (subCategoryList) {
        units.subCategories = Array.from(subCategoryList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (sizeList) {
        units.sizes = Array.from(sizeList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (colorList) {
        units.colors = Array.from(colorList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (shapeList) {
        units.shapes = Array.from(shapeList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (neckTypeList) {
        units.neckTypes = Array.from(neckTypeList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (materialList) {
        units.materials = Array.from(materialList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (fragrancesList) {
        units.fragrances = Array.from(fragrancesList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    if (jarsBottlesList) {
        units.jarsBottles = Array.from(jarsBottlesList.querySelectorAll('.unit-item-text')).map(el => el.textContent);
    }
    
    // Save to localStorage
    localStorage.setItem('unitsData', JSON.stringify(units));
}

// Load units from localStorage
function loadUnitsFromStorage() {
    const units = JSON.parse(localStorage.getItem('unitsData') || '{}');
    return units;
}

// Update dropdowns on add-product page
function updateAddProductDropdowns() {
    const units = loadUnitsFromStorage();
    
    // Update industry dropdown (single select)
    const industrySelect = document.getElementById('industry');
    if (industrySelect && units.industries) {
        const currentValue = industrySelect.value;
        industrySelect.innerHTML = '<option value="">Select Industry</option>' + 
            units.industries.map(ind => `<option value="${ind}">${ind}</option>`).join('');
        if (currentValue && units.industries.includes(currentValue)) {
            industrySelect.value = currentValue;
        }
    }
    
    // Update multi-select dropdowns when opened
    // This will be handled by the updateDropdownOptions function
}

// Initialize units sync
document.addEventListener('DOMContentLoaded', () => {
    // Sync units when on units page
    if (document.getElementById('industryList')) {
        // Initial sync
        syncUnitsToStorage();
        
        // Watch for changes
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                syncUnitsToStorage();
                window.dispatchEvent(new Event('unitsUpdated'));
            }, 100);
        });
        
        // Observe all unit lists
        ['industryList', 'subCategoryList', 'sizeList', 'colorList', 'shapeList', 
         'neckTypeList', 'materialList', 'fragrancesList', 'jarsBottlesList'].forEach(listId => {
            const list = document.getElementById(listId);
            if (list) {
                observer.observe(list, { childList: true, subtree: true });
            }
        });
    }
    
    // Update dropdowns when on add-product page
    if (document.getElementById('industry')) {
        setTimeout(() => {
            updateAddProductDropdowns();
        }, 500);
    }
    
    // Listen for units updates
    window.addEventListener('unitsUpdated', () => {
        if (document.getElementById('industry')) {
            setTimeout(() => {
                updateAddProductDropdowns();
            }, 100);
        }
    });
});

