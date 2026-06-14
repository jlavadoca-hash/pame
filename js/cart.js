// Gestión del carrito con soporte para imágenes personalizadas
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
    }

    /**
     * Agrega un producto personalizado al carrito capturando la vista previa visual.
     * @param {Object} product - Objeto base del producto del catálogo.
     * @param {Object} customization - Datos de color, talla, material y qty.
     */
    async addItem(product, customization) {
        // 1. Generar clave única para agrupar personalizaciones idénticas
        const uniqueKey = `${product.id}-${customization.color}-${customization.size}-${customization.material}`;
        
        // 2. Capturar la imagen personalizada desde el visualizador
        let customImage = product.image; // Fallback por defecto
        
        try {
            const previewContainer = document.querySelector('.preview-main-image');
            
            // Opción A: Si usas Canvas para la vista previa
            if (previewContainer && previewContainer.tagName === 'CANVAS') {
                customImage = previewContainer.toDataURL('image/png');
            } 
            // Opción B: Si usas SVG superpuesto sobre una imagen
            else if (document.getElementById('polo-svg-preview')) {
                customImage = await this.convertSvgToImage(document.getElementById('polo-svg-preview'));
            }
        } catch (error) {
            console.warn("No se pudo capturar la vista previa, usando imagen original:", error);
        }

        // 3. Buscar si ya existe este item exacto en el carrito
        const existing = this.items.find(item => item.uniqueKey === uniqueKey);
        
        if (existing) {
            existing.qty += customization.qty;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price + productManager.getMaterialPrice(customization.material),
                qty: customization.qty,
                color: customization.color,
                size: customization.size,
                material: customization.material,
                pattern: customization.pattern,
                notes: customization.notes,
                image: customImage, // <--- AQUÍ SE GUARDA LA IMAGEN PERSONALIZADA
                uniqueKey: uniqueKey,
                stripeLink: product.stripeLink
            });
        }
        
        this.save();
        return true;
    }

    removeItem(uniqueKey) {
        this.items = this.items.filter(item => item.uniqueKey !== uniqueKey);
        this.save();
    }

    updateQuantity(uniqueKey, delta) {
        const item = this.items.find(i => i.uniqueKey === uniqueKey);
        if (item) {
            item.qty = Math.max(1, item.qty + delta);
            this.save();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    save() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.items));
    }

    clear() {
        this.items = [];
        this.save();
    }

    /**
     * Utilidad: Convierte un elemento SVG a DataURL para guardarlo en el carrito
     */
    convertSvgToImage(svgElement) {
        return new Promise((resolve, reject) => {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            // Dimensiones estándar para miniaturas de carrito
            canvas.width = 500; 
            canvas.height = 600; 
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/png'));
            };
            
            img.onerror = reject;
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        });
    }
}

// Instancia global
const cartManager = new CartManager();