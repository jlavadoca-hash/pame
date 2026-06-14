// js/main.js - Lógica Global (Carrito, UI, Checkout con Descuentos)
const CONFIG = {
    appName: "D'Pame",
    whatsappNumber: "51999999999",
    currency: "USD"
};

const DISCOUNT_TIERS = [
    { minQty: 200, percent: 0.15, label: "15% OFF (Mayorista)" },
    { minQty: 100, percent: 0.10, label: "10% OFF" },
    { minQty: 50,  percent: 0.05, label: "5% OFF" }
];

let cart = JSON.parse(localStorage.getItem('dpame_cart')) || [];

window.addItemToCart = function(product) {
    const existingItemIndex = cart.findIndex(item =>
        item.id === product.id &&
        item.customColor === product.customColor &&
        item.customSize === product.customSize
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].customQuantity += product.customQuantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            customColor: product.customColor || 'original',
            customSize: product.customSize || 'M',
            customQuantity: product.customQuantity || 50,
            isCustomized: product.isCustomized || false,
            logo1: product.logo1 || null,
            finalUnitPrice: product.finalUnitPrice || product.price,
            discountApplied: product.discountApplied || 0
        });
    }
    saveCart();
    updateCartUI();
    alert(`✅ "${product.name}" agregado al carrito.\nCantidad: ${product.customQuantity} uds.`);
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

window.updateCartItemQty = function(index, change) {
    if (cart[index]) {
        const newQty = cart[index].customQuantity + change;
        if (newQty >= 50) {
            cart[index].customQuantity = newQty;
            saveCart();
            updateCartUI();
        } else {
            alert("El pedido mínimo es de 50 unidades.");
        }
    }
};

function saveCart() {
    localStorage.setItem('dpame_cart', JSON.stringify(cart));
}

function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.customQuantity), 0);
}

function getTotalItemsCount() {
    return cart.reduce((count, item) => count + item.customQuantity, 0);
}

function calculateDiscount(subtotal, totalQty) {
    for (let tier of DISCOUNT_TIERS) {
        if (totalQty >= tier.minQty) {
            return {
                percent: tier.percent,
                amount: subtotal * tier.percent,
                label: tier.label
            };
        }
    }
    return { percent: 0, amount: 0, label: "" };
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const totalItems = getTotalItemsCount();
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total-price');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    const discountDisplay = document.getElementById('discount-display');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        if (cartTotalEl) cartTotalEl.textContent = '$0.00 USD';
        if (discountDisplay) discountDisplay.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (emptyCartMsg) emptyCartMsg.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;
    let totalQty = 0;

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const itemTotal = item.finalUnitPrice * item.customQuantity;
        subtotal += itemTotal;
        totalQty += item.customQuantity;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="item-meta">Color: ${item.customColor === 'original' ? 'Estándar' : item.customColor} | Talla: ${item.customSize}</p>
                    <div class="item-controls">
                        <button onclick="updateCartItemQty(${index}, -1)" class="qty-btn">-</button>
                        <span>${item.customQuantity}</span>
                        <button onclick="updateCartItemQty(${index}, 1)" class="qty-btn">+</button>
                    </div>
                    <p class="item-price">$${itemTotal.toFixed(2)} USD ${item.discountApplied > 0 ? `<small style="color:green;">(${item.discountApplied}% OFF)</small>` : ''}</p>
                    ${item.logo1 ? '<small>🖼️ Incluye Logo</small>' : ''}
                </div>
                <button onclick="removeFromCart(${index})" class="remove-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    const discount = calculateDiscount(subtotal, totalQty);
    const finalTotal = subtotal - discount.amount;

    if (cartTotalEl) {
        if (discount.percent > 0) {
            cartTotalEl.innerHTML = `<span style="text-decoration: line-through; color: #999; font-size: 0.9em;">$${subtotal.toFixed(2)}</span> <span style="color: var(--success-color); margin-left: 10px; font-weight:bold;">$${finalTotal.toFixed(2)} USD</span>`;
            if (discountDisplay) {
                discountDisplay.style.display = 'block';
                discountDisplay.textContent = `🎉 ¡Aplicado: ${discount.label}! Ahorraste $${discount.amount.toFixed(2)}`;
                discountDisplay.style.color = 'var(--success-color)';
                discountDisplay.style.fontWeight = 'bold';
            }
        } else {
            cartTotalEl.textContent = `$${subtotal.toFixed(2)} USD`;
            if (discountDisplay) discountDisplay.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }

    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    if (cartOverlay && cartSidebar) {
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processWhatsAppCheckout);
    }
});

function processWhatsAppCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let subtotal = 0;
    let totalQty = 0;
    let message = `Hola D'Pame! 👋 Quiero realizar el siguiente pedido:\n\n`;

    cart.forEach((item, index) => {
        const itemTotal = item.finalUnitPrice * item.customQuantity;
        subtotal += itemTotal;
        totalQty += item.customQuantity;

        message += `*${index + 1}. ${item.name}*\n`;
        message += `   🎨 Color: ${item.customColor === 'original' ? 'Estándar' : item.customColor}\n`;
        message += `   📏 Talla Base: ${item.customSize}\n`;
        message += `   🔢 Cantidad: ${item.customQuantity} uds\n`;
        message += `   💰 Subtotal: $${itemTotal.toFixed(2)} USD\n`;
        if (item.logo1) message += `   🖼️ Incluye Logo Personalizado\n`;
        message += `\n`;
    });

    const discount = calculateDiscount(subtotal, totalQty);
    const finalTotal = subtotal - discount.amount;

    message += `--------------------------------\n`;
    message += `📦 *Cantidad Total: ${totalQty} unidades*\n`;
    if (discount.percent > 0) {
        message += `🎉 *Descuento Aplicado: ${discount.label} (-$${discount.amount.toFixed(2)})*\n`;
        message += `💵 *TOTAL A PAGAR: $${finalTotal.toFixed(2)} USD*\n`;
    } else {
        message += `💵 *TOTAL A PAGAR: $${subtotal.toFixed(2)} USD*\n`;
    }
    message += `--------------------------------\n\nPor favor, indíquenme los pasos para el pago y envío.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}