// ==========================================
// VARIABLES GLOBALES
// ==========================================
let allProducts = [];
let categoriesData = {};
let currentProduct = null;
let selectedColorSuffix = null;
let isCustomizationActive = false;

// Elementos DOM - Catálogo
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const productsCount = document.getElementById('productsCount');
const noResults = document.getElementById('noResults');

// Elementos DOM - Modal Personalización
const customizationModal = document.getElementById('customizationModal');
const mainProductImage = document.getElementById('mainProductImage');
const customizationZone = document.getElementById('customizationZone');
const uploadSection = document.getElementById('uploadSection');
const btnToggleUpload = document.getElementById('btnToggleUpload');

// Logos
const logoWrapper1 = document.getElementById('logoWrapper1');
const uploadedLogoImg1 = document.getElementById('uploadedLogoImg1');

// Inputs e Info
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalProductDesc = document.getElementById('modalProductDesc');
const colorSelector = document.getElementById('colorSelector');
const quantityInput = document.getElementById('quantityInput');
const sizeSelector = document.getElementById('sizeSelector');

// Descuentos
const tier1 = document.getElementById('tier-1');
const tier2 = document.getElementById('tier-2');
const tier3 = document.getElementById('tier-3');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const savingsDisplay = document.getElementById('savingsDisplay');

const BESTSELLER_IDS = [1, 2, 5, 12];

// ==========================================
// 1. CARGA Y RENDERIZADO
// ==========================================
async function loadCatalogData() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Error al cargar el catálogo');
        
        const data = await response.json();
        allProducts = data.products;
        categoriesData = data.categories || {};
        
        // Asegurar minOrder
        allProducts.forEach(p => p.minOrder = p.minOrder || 50);
        
        renderProducts(allProducts);
        updateProductCount(allProducts.length);
    } catch (error) {
        console.error('Error:', error);
        if(productsGrid) productsGrid.innerHTML = `<div class="no-results"><h3>Error cargando productos. Verifica data/products.json</h3></div>`;
    }
}

function renderProducts(products) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        if (noResults) noResults.style.display = 'block';
        updateProductCount(0);
        return;
    }

    if (noResults) noResults.style.display = 'none';
    updateProductCount(products.length);

    products.forEach(product => {
        const categoryName = categoriesData[product.category] || product.category;
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let tagHtml = '';
        if (BESTSELLER_IDS.includes(product.id)) tagHtml = '<span class="product-tag">Best Seller</span>';
        else if (product.isNew) tagHtml = '<span class="product-tag" style="background-color: #10b981;">Nuevo</span>';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${tagHtml}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">$${product.price.toFixed(2)} USD</span>
                    <span class="product-min-order">Min: ${product.minOrder} uds</span>
                </div>
                <button class="btn-customize" onclick="openCustomizationModal(${product.id})">
                    <i class="fas fa-paint-brush"></i> Personalizar
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function updateProductCount(count) {
    if(productsCount) productsCount.textContent = `Mostrando ${count} producto${count !== 1 ? 's' : ''}`;
}

// ==========================================
// 2. MODAL PROFESIONAL (LÓGICA ALLOW UPLOADS)
// ==========================================
window.openCustomizationModal = function(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    if (!currentProduct) return;

    // 1. Llenar datos básicos
    modalProductName.textContent = currentProduct.name;
    modalProductPrice.textContent = `$${currentProduct.price.toFixed(2)} USD`;
    modalProductDesc.textContent = currentProduct.description;

    // 2. Imagen Inicial
    const initialColor = currentProduct.availableColors ? currentProduct.availableColors[0] : null;
    mainProductImage.src = initialColor ? initialColor.image : currentProduct.image;
    selectedColorSuffix = initialColor ? initialColor.name : null;

    // 3. LÓGICA CLAVE: allowLogoUpload
    const allowLogos = currentProduct.allowLogoUpload === true;

    if (allowLogos) {
        // Mostrar botón toggle
        if(btnToggleUpload) btnToggleUpload.style.display = 'flex';
        // Ocultar zona y uploads por defecto hasta que el usuario haga click
        if(uploadSection) uploadSection.classList.add('hidden');
        if(customizationZone) customizationZone.classList.add('hidden');
        isCustomizationActive = false; // Estado inicial inactivo
    } else {
        // Si NO permite logos, ocultar TODO (LIMPIEZA TOTAL)
        if(btnToggleUpload) btnToggleUpload.style.display = 'none';
        if(uploadSection) uploadSection.classList.add('hidden');
        if(customizationZone) customizationZone.classList.add('hidden');
        isCustomizationActive = false;
    }

    // 4. Resetear Logos y Inputs
    resetLogo(logoWrapper1);
    if(quantityInput) quantityInput.value = 50;
    if(sizeSelector) sizeSelector.value = 'M';
    const up1 = document.getElementById('imageUpload1'); if(up1) up1.value = '';

    // 5. Renderizar Colores y Calcular Precio
    renderColorSelector();
    calculateDiscounts();

    // 6. Abrir Modal
    customizationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeCustomizationModal = function() {
    customizationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
};

// Toggle para Activar/Desactivar la Zona de Diseño
window.toggleCustomizationZone = function() {
    if (!currentProduct || !currentProduct.allowLogoUpload) return;
    
    isCustomizationActive = !isCustomizationActive;

    if (isCustomizationActive) {
        customizationZone.classList.remove('hidden');
        uploadSection.classList.remove('hidden');
        btnToggleUpload.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar área de diseño';
        btnToggleUpload.classList.add('active-toggle');
    } else {
        customizationZone.classList.add('hidden');
        uploadSection.classList.add('hidden');
        if(logoWrapper1) logoWrapper1.style.display = 'none';
        btnToggleUpload.innerHTML = '<i class="fas fa-paint-brush"></i> ¿Quieres añadir tu propio diseño? Click aquí';
        btnToggleUpload.classList.remove('active-toggle');
    }
};

// ==========================================
// 3. SELECTOR DE COLORES DINÁMICO
// ==========================================
function renderColorSelector() {
    if(!colorSelector) return;
    colorSelector.innerHTML = '';
    
    if (currentProduct.availableColors && Array.isArray(currentProduct.availableColors)) {
        currentProduct.availableColors.forEach(colorObj => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = colorObj.hex;
            swatch.title = colorObj.name;
            
            if (colorObj.name === selectedColorSuffix) swatch.classList.add('selected');
            
            swatch.onclick = () => selectColor(colorObj, swatch);
            colorSelector.appendChild(swatch);
        });
    } else {
        colorSelector.innerHTML = '<p style="font-size:0.9rem; color:#666;">Color estándar único.</p>';
    }
}

function selectColor(colorObj, swatchElement) {
    selectedColorSuffix = colorObj.name;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    swatchElement.classList.add('selected');
    
    if(mainProductImage) mainProductImage.src = colorObj.image || currentProduct.image;
}

// ==========================================
// 4. SUBIDA DE IMÁGENES Y DRAG & DROP (CORREGIDO)
// ==========================================
window.handleImageUpload = function(input, wrapperId, imgId) {
    if (!isCustomizationActive) {
        alert("Primero activa el área de diseño.");
        return;
    }
    
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const wrapper = document.getElementById(wrapperId);
        const img = document.getElementById(imgId);
        
        if(img) img.src = event.target.result;
        
        if(wrapper) {
            wrapper.style.display = 'block';
            
            // POSICIONAMIENTO INICIAL: Centro de la ZONA PUNTEADA
            const zone = document.getElementById('customizationZone');
            const zoneRect = zone.getBoundingClientRect();
            const containerRect = document.getElementById('mainPreviewContainer').getBoundingClientRect();
            
            // Calculamos posición relativa al contenedor principal
            // Centro de la zona - Mitad del logo (aprox 50px de ancho inicial)
            const relativeLeft = (zoneRect.left - containerRect.left) + (zoneRect.width / 2) - 50;
            const relativeTop = (zoneRect.top - containerRect.top) + (zoneRect.height / 2) - 50;

            wrapper.style.left = `${relativeLeft}px`;
            wrapper.style.top = `${relativeTop}px`;
            wrapper.style.transform = 'scale(1)';
            wrapper.dataset.scale = 1;
            
            // Iniciar eventos de arrastre PASANDO LA ZONA COMO LÍMITE
            initDragEvents(wrapper, zone);
        }
    };
    reader.readAsDataURL(file);
};

window.adjustZoom = function(wrapperId, change) {
    const wrapper = document.getElementById(wrapperId);
    if(!wrapper) return;
    
    let scale = parseFloat(wrapper.dataset.scale) || 1;
    scale += change;
    
    if (scale < 0.2) scale = 0.2;
    if (scale > 3.0) scale = 3.0;
    
    wrapper.dataset.scale = scale;
    wrapper.style.transform = `scale(${scale})`;
};

window.removeLogo = function(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if(wrapper) wrapper.style.display = 'none';
    
    const inputId = wrapperId === 'logoWrapper1' ? 'imageUpload1' : 'imageUpload2';
    const inputEl = document.getElementById(inputId);
    if(inputEl) inputEl.value = '';
};

function resetLogo(wrapper) {
    if(!wrapper) return;
    wrapper.style.display = 'none';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
    wrapper.dataset.scale = 1;
}

// Lógica de Arrastre Confinada a la Zona Punteada y con Soporte de Zoom
function initDragEvents(element, limitZone) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, {passive: false});
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        
        const containerRect = document.getElementById('mainPreviewContainer').getBoundingClientRect();
        const elemRect = element.getBoundingClientRect();
        
        initialLeft = elemRect.left - containerRect.left;
        initialTop = elemRect.top - containerRect.top;
        
        element.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // REFERENCIAS ACTUALES
        const container = document.getElementById('mainPreviewContainer');
        const zone = document.getElementById('customizationZone');
        
        // Escala actual del logo
        const scale = parseFloat(element.dataset.scale) || 1;
        
        // Dimensiones REALES del logo considerando el zoom
        const elemWidth = element.offsetWidth * scale;
        const elemHeight = element.offsetHeight * scale;

        // LÍMITES DE LA ZONA PUNTEADA (Relativos al contenedor principal)
        const zoneRect = zone.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const minLeft = zoneRect.left - containerRect.left;
        const minTop = zoneRect.top - containerRect.top;
        const maxLeft = (zoneRect.right - containerRect.left) - elemWidth;
        const maxTop = (zoneRect.bottom - containerRect.top) - elemHeight;

        // RESTRICCIÓN MATEMÁTICA (Clamping)
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop < minTop) newTop = minTop;
        if (newLeft > maxLeft) newLeft = maxLeft;
        if (newTop > maxTop) newTop = maxTop;

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
    }

    function endDrag() {
        isDragging = false;
        element.style.cursor = 'grab';
    }
}

// ==========================================
// 5. CANTIDAD Y DESCUENTOS
// ==========================================
window.adjustQuantity = function(change) {
    if(!quantityInput) return;
    let val = parseInt(quantityInput.value) || 50;
    val += change;
    if (val < 50) val = 50;
    quantityInput.value = val;
    calculateDiscounts();
};

function calculateDiscounts() {
    if (!currentProduct) return;
    
    const qty = parseInt(quantityInput.value) || 50;
    const pricePerUnit = currentProduct.price;
    let discountPercent = 0;
    let activeTierId = '';

    // Reset clases
    if(tier1) tier1.classList.remove('active-tier');
    if(tier2) tier2.classList.remove('active-tier');
    if(tier3) tier3.classList.remove('active-tier');

    // Lógica de tramos
    if (qty >= 200) { 
        discountPercent = 0.15; 
        activeTierId = 'tier-3'; 
    } else if (qty >= 100) { 
        discountPercent = 0.10; 
        activeTierId = 'tier-2'; 
    } else if (qty >= 50) { 
        discountPercent = 0.05; 
        activeTierId = 'tier-1'; 
    }

    if (activeTierId) {
        const activeEl = document.getElementById(activeTierId);
        if(activeEl) activeEl.classList.add('active-tier');
    }

    const subtotal = qty * pricePerUnit;
    const savings = subtotal * discountPercent;
    const total = subtotal - savings;

    if(modalTotalPrice) modalTotalPrice.textContent = `$${total.toFixed(2)} USD`;
    
    if(savingsDisplay) {
        if (savings > 0) {
            savingsDisplay.style.display = 'inline-block';
            savingsDisplay.textContent = `¡Ahorras $${savings.toFixed(2)}!`;
        } else {
            savingsDisplay.style.display = 'none';
        }
    }
}

// ==========================================
// 6. CARRITO
// ==========================================
window.addCustomizedToCart = function() {
    if (!currentProduct) return;
    
    const qty = parseInt(quantityInput.value);
    if (qty < 50) { alert('El pedido mínimo es de 50 unidades.'); return; }
    
    let discountPercent = 0;
    if (qty >= 200) discountPercent = 0.15;
    else if (qty >= 100) discountPercent = 0.10;
    else if (qty >= 50) discountPercent = 0.05;

    const finalPrice = currentProduct.price * (1 - discountPercent);

    const customizedProduct = {
        ...currentProduct,
        customColor: selectedColorSuffix || 'Estándar',
        customSize: sizeSelector.value,
        customQuantity: qty,
        unitPrice: currentProduct.price,
        finalUnitPrice: finalPrice,
        discountApplied: discountPercent * 100,
        isCustomized: isCustomizationActive,
        // Solo guardar logo si está activo y visible
        logo1: (isCustomizationActive && logoWrapper1 && logoWrapper1.style.display !== 'none') ? { src: uploadedLogoImg1.src } : null
    };

    if (typeof window.addItemToCart === 'function') window.addItemToCart(customizedProduct);
    closeCustomizationModal();
};

// Event Listeners Globales
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogData();
    
    if(filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.dataset.filter;
                const filteredProducts = filterValue === 'all' ? allProducts : allProducts.filter(p => p.category === filterValue);
                renderProducts(filteredProducts);
            });
        });
    }

    if(searchInput) {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
            let filtered = activeFilter === 'all' ? allProducts : allProducts.filter(p => p.category === activeFilter);
            if(term) filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }

    if(quantityInput) {
        quantityInput.addEventListener('input', calculateDiscounts);
        quantityInput.addEventListener('change', calculateDiscounts);
    }

    if(customizationModal) {
        customizationModal.addEventListener('click', function(e) {
            if (e.target === this) closeCustomizationModal();
        });
    }
});