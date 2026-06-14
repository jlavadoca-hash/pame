// Chatbot Inteligente D'Pame - NLP Básico en Español + Quick Replies
class IntelligentChatbot {
    constructor() {
        this.currentContext = null;
        this.conversationHistory = [];
        this.userName = null;

        // Opciones rápidas principales (Menú inicial)
        this.mainOptions = [
            { text: "📦 Envíos", value: "envios" },
            { text: "💰 Precios", value: "precios" },
            { text: "🎨 Personalización", value: "personalizacion" },
            { text: " Tallas", value: "tallas" },
            { text: "💳 Pagos", value: "metodos_pago" },
            { text: "👤 Contacto Humano", value: "contacto_humano" }
        ];

        // Base de conocimiento con múltiples variaciones (INTACTA)
        this.intents = {
            saludo: {
                patterns: [
                    'hola', 'buenas', 'buenos días', 'buenas tardes ', 'buenas noches',
                    'hey', 'qué tal', 'qué onda', 'saludos', 'hi', 'hello',
                    'buen día', 'qué pasa', 'cómo estás', 'como estas'
                ],
                 response: () => this.getSaludoResponse()
            },
            envios: {
                patterns: [
                    'envío', 'envios', 'enviar', 'mandar', 'entrega', 'entregan',
                    'cuánto tarda', 'cuanto tarda', 'tiempo de entrega', 'llega',
                    'shipping', 'delivery', 'transporte', 'despacho',
                    'dónde envían', 'lugar de entrega',
                     'tiempo de envío', 'demora', 'cuándo llega', 'cuando llega',
                    'paquetería', 'guía', 'rastreo', 'tracking'
                ],
                response: () => this.getEnviosResponse()
            },
            precios: {
                patterns: [
                    'precio', 'precios', 'cuánto cuesta', 'cuanto cuesta', 'valor',
                    'costo', 'costa', 'cuánto es', 'cuanto es', 'cuánto sale',
                    'cuanto sale', 'tarifa', 'budget', 'rango de precio',
                    'cuánto cobran', 'cuanto cobran', 'cuánto pagan',
                    'precio mínimo', 'precio mayorista', 'descuento'
                ],
                response: () => this.getPreciosResponse()
            },
            pedidos_minimos: {
                patterns: [
                    'mínimo', 'minimo', 'cantidad mínima', 'cantidad minima',
                     'pedido mínimo', 'pedido minimo', 'cuántos mínimo',
                    'cuantos mínimo', 'mínima cantidad', 'minima cantidad',
                    'orden mínima', 'orden minima', 'compra mínima', 'compra minima',
                    'minimum order', 'moq', 'mínimo de compra'
                ],
                response: () => this.getPedidosMinimosResponse()
            },
            personalizacion: {
                patterns: [
                    'personalizar', 'personalización', 'personalizacion', 'customizar', 
                    'custom', 'diseño', 'diseno', 'diseñar',
                    'disenar', 'estampar', 'estampado', 'bordar', 'bordado',
                    'logo', 'marca', 'branding', 'cómo personalizo',
                    'como personalizo', 'cómo diseño', 'como diseño',
                    'puedo poner', 'quiero diseñar', 'quiero personalizar',
                    'colores',  'tallas', 'tamaños', 'medidas', 'modificar'
                ],
                response: () => this.getPersonalizacionResponse()
            },
            metodos_pago: {
                patterns: [
                    'pago', 'pagos', 'pagar', 'cómo pago', 'como pago',
                    'forma de pago', 'método de pago', 'metodo de pago',
                    'tarjeta', 'credit card', 'débito', 'debito', 'transferencia',
                    'paypal', 'stripe', 'wompi', 'mercadopago', 'mercado pago',
                    'contra entrega', 'contraentrega', 'cash', 'efectivo',
                    'pago seguro', 'checkout', 'pagar ahora', 'abonar',
                     'cuáles aceptan', 'cuales aceptan', 'puedo pagar con'
                ],
                response: () => this.getMetodosPagoResponse()
            },
            devoluciones: {
                patterns: [
                    'devolución', 'devolucion', 'devolver', 'retornar', 'retorno',
                     'cambio', 'cambiar', 'reembolso', 'reintegro', 'garantía',
                    'garantia', 'si no me queda', 'talla incorrecta', 'error',
                    'producto dañado', 'defectuoso', 'no me gustó', 'no me gusto',
                    'política de devolución', 'politica de devolucion', 'return',
                    'puedo devolver', 'puedo cambiar', 'cómo devuelvo', 'como devuelvo'
                ],
                response: () => this.getDevolucionesResponse()
            },
            tallas: {
                patterns: [
                    'talla', 'tallas', 'size', 'sizes', 'medidas', 'medida',
                    'qué talla soy', 'que talla soy', 'guía de tallas',
                    'guia de tallas', 'tabla de tallas', 'xs', 'sm', 'small',
                    'medium', 'large', 'xl', 'xxl', 'cómo escojo', 'como escojo',
                    'no sé mi talla', 'no se mi talla', 'cuál elijo', 'cual elijo'
                ],
                response: () => this.getTallasResponse()
            },
            materiales: {
                patterns: [
                    'material', 'materiales', 'tela', 'telas', 'algodón',
                    'algodon',  'qué tela usan', 'que tela usan', 'composición',
                    'composicion', 'orgánico', 'organico', 'dry fit', 'dry-fit',
                    'pima', 'lino', 'linen', 'calidad', 'qué material', 'que material',
                    'es 100% algodón', 'es 100 algodon', 'polyester', 'poliéster'
                ],
                response: () => this.getMaterialesResponse()
            },
            contacto_humano: {
                patterns: [
                    'hablar con alguien', 'hablar con una persona', 'persona',
                     'asesor', 'atención al cliente', 'soporte', 'ayuda humana',
                    'no entiendo', 'no me ayudaste', 'quiero hablar', 'llamar',
                    'teléfono', 'whatsapp',  'correo', 'email', 'escribir',
                    'contactar', 'contacto', 'comunicar', 'hablar con humano',
                    'persona real', 'agente', 'representante'
                ],
                 response: () => this.getContactoHumanoResponse()
            },
            gracias: {
                patterns: [
                    'gracias', 'thank you', 'thanks', 'te agradezco', 'agradecido',
                     'muy amable', 'excelente', 'perfecto', 'listo', 'ok', 'okay',
                    'entendido', 'queda claro', 'me ayudaste', 'ayuda'
                ],
                response: () => this.getGraciasResponse()
            },
            despedida: {
                patterns: [
                    'adiós', 'adios', 'chao', 'chau', 'hasta luego', 'nos vemos',
                    'bye', 'goodbye', 'hasta pronto', 'que estés bien', 'cuídate',
                    'cuidate', 'fin', 'terminar', 'cerrar', 'salir'
                ],
                response: () => this.getDespedidaResponse()
            }
        };
        
        // Entidades para extraer información (INTACTO)
        this.entities = {
            numeros: /\b(\d+)\b/g,
            productos: /(polo|camiseta|top|crop|tank|oversized|polo shirt)/gi,
            colores: /(blanco|negro|gris|azul|rojo|verde|amarillo|rosa|morado|naranja)/gi
        };
        
        this.init();
    }

    init() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        
        if (toggle) toggle.addEventListener('click', () => this.toggle());
        if (close) close.addEventListener('click', () => this.close());
        if (send) send.addEventListener('click', () => this.sendMessage());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        // Mensaje de bienvenida con opciones rápidas
        setTimeout(() => {
            this.addMessage(
                 "¡Hola! 👋 Soy el asistente virtual de <strong>D'Pame</strong>. Estoy aquí para ayudarte con tus dudas sobre nuestros polos personalizados, envíos, pagos o personalización. ¿En qué puedo ayudarte hoy?",
                false
            );
            // Mostrar botones de ayuda inmediatamente después del saludo
            this.showQuickReplies(this.mainOptions);
        }, 500);
    }

    toggle() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                const input = document.getElementById('chat-input');
                if (input) setTimeout(() => input.focus(), 100);
            }
        }
    }

    close() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) chatWindow.classList.remove('active');
    }

    addMessage(text, isUser) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        div.innerHTML = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        
        this.conversationHistory.push({ text, isUser, timestamp: new Date() });
    }

    // NUEVA FUNCIÓN: Mostrar botones de opciones rápidas
    showQuickReplies(options) {
        const container = document.getElementById('chat-messages');
        if (!container || !options || options.length === 0) return;

        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies-container';
        
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = option.text;
            btn.onclick = () => {
                // Simular que el usuario escribió esa opción
                this.addMessage(option.text, true);
                this.processIntent(option.value);
                // Eliminar las opciones anteriores para no saturar
                const oldReplies = container.querySelectorAll('.quick-replies-container');
                oldReplies.forEach(el => el.remove());
            };
            quickRepliesDiv.appendChild(btn);
        });

        container.appendChild(quickRepliesDiv);
        container.scrollTop = container.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, true);
        input.value = '';
        
        // Eliminar opciones anteriores si el usuario escribe manualmente
        const container = document.getElementById('chat-messages');
        if (container) {
            const oldReplies = container.querySelectorAll('.quick-replies-container');
            oldReplies.forEach(el => el.remove());
        }

        this.showTypingIndicator();
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.processMessage(text);
            this.addMessage(response, false);
            
            // Si el usuario escribe algo que no entiende, volver a mostrar menú principal
            if (response.includes("Déjame ayudarte mejor") || response.includes("Puedes darme más detalles")) {
                setTimeout(() => this.showQuickReplies(this.mainOptions), 600);
            }
        }, 800 + Math.random() * 400);
    }

    processMessage(text) {
        const lowerText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const entities = this.extractEntities(text);
        const intentMatch = this.findBestIntent(lowerText);
        
        if (intentMatch && intentMatch.score > 0.3) {
            return this.customizeResponse(intentMatch.intent, entities);
        }
        
        return this.getFallbackResponse(lowerText, entities);
    }

    // Procesar intención directamente desde los botones
    processIntent(intentKey) {
        this.showTypingIndicator();
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.customizeResponse(intentKey, {});
            this.addMessage(response, false);
            
            // Ofrecer sub-opciones según el contexto
            let nextOptions = this.mainOptions;
            if (intentKey === 'envios') {
                nextOptions = [
                    { text: "🌍 Internacional", value: "envios_internacionales" },
                    { text: "🇵🇪 Nacional", value: "envios_nacionales" },
                    { text: "🔙 Volver al Menú", value: "menu_principal" }
                ];
            } else if (intentKey === 'precios') {
                nextOptions = [
                    { text: "📊 Pedidos Mínimos", value: "pedidos_minimos" },
                    { text: "💳 Métodos de Pago", value: "metodos_pago" },
                    { text: "🔙 Volver al Menú", value: "menu_principal" }
                ];
            } else if (intentKey === 'personalizacion') {
                nextOptions = [
                    { text: "🧵 Materiales", value: "materiales" },
                    { text: "🔄 Devoluciones", value: "devoluciones" },
                    { text: "🔙 Volver al Menú", value: "menu_principal" }
                ];
            } else if (intentKey === 'contacto_humano') {
                nextOptions = [
                    { text: "📞 WhatsApp", value: "whatsapp_contact" },
                    { text: "✉️ Email", value: "email_contact" },
                    { text: "🔙 Volver al Menú", value: "menu_principal" }
                ];
            }
            
            setTimeout(() => this.showQuickReplies(nextOptions), 600);
        }, 800 + Math.random() * 400);
    }

    extractEntities(text) {
        const entities = {};
        const numbers = text.match(this.entities.numeros);
        if (numbers) entities.numeros = numbers.map(n => parseInt(n));
        const productos = text.match(this.entities.productos);
        if (productos) entities.productos = [...new Set(productos.map(p => p.toLowerCase()))];
        const colores = text.match(this.entities.colores);
        if (colores) entities.colores = [...new Set(colores.map(c => c.toLowerCase()))];
        return entities;
    }

    findBestIntent(text) {
        let bestMatch = null;
        let bestScore = 0;
        for (const [intentName, intentData] of Object.entries(this.intents)) {
            const score = this.calculateSimilarity(text, intentData.patterns);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = { intent: intentName, score };
            }
        }
        return bestMatch;
    }

    calculateSimilarity(text, patterns) {
         let maxScore = 0;
        for (const pattern of patterns) {
            const normalizedPattern = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (text.includes(normalizedPattern)) {
                maxScore = Math.max(maxScore, 1.0);
                continue;
            }
            const textWords = text.split(/\s+/);
            const patternWords = normalizedPattern.split(/\s+/);
            const matches = patternWords.filter(word => textWords.includes(word));
            const partialScore = matches.length / patternWords.length;
            if (partialScore > 0.5) {
                maxScore = Math.max(maxScore, partialScore * 0.8);
            }
            const levenshteinScore = this.levenshteinSimilarity(text, normalizedPattern);
            if (levenshteinScore > 0.8) {
                maxScore = Math.max(maxScore, levenshteinScore * 0.9);
            }
        }
        return maxScore;
    }

    levenshteinSimilarity(str1, str2) {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
        for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                     track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        const distance = track[str2.length][str1.length];
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLength);
    }

    customizeResponse(intent, entities) {
        const responses = {
            saludo: this.getSaludoResponse(),
             envios: this.getEnviosResponse(entities),
            precios: this.getPreciosResponse(entities),
            pedidos_minimos: this.getPedidosMinimosResponse(entities),
            personalizacion: this.getPersonalizacionResponse(entities),
            metodos_pago: this.getMetodosPagoResponse(),
            devoluciones: this.getDevolucionesResponse(),
            tallas:  this.getTallasResponse(entities),
            materiales: this.getMaterialesResponse(entities),
            contacto_humano: this.getContactoHumanoResponse(),
            gracias: this.getGraciasResponse(),
            despedida: this.getDespedidaResponse()
        };
        return responses[intent] ||  "Entiendo. ¿Puedes darme más detalles para ayudarte mejor?";
    }

    getFallbackResponse(text, entities) {
        if (entities.numeros && (text.includes('cuesta') || text.includes('precio'))) {
            return this.getPreciosResponse(entities);
        }
        if (entities.productos) {
            return `Entiendo que te interesa <strong>${entities.productos.join(', ')}</strong>. ${this.getPersonalizacionResponse(entities)}`;
        }
        return "🤔 Déjame ayudarte mejor. Puedo responderte sobre: <br><br>" +
             "•  <strong>Envíos y entregas</strong><br>" +
             "• 💰 <strong>Precios y pedidos mínimos</strong><br>" +
             "• 🎨 <strong>Personalización de diseños</strong><br>" +
             "• 💳 <strong>Métodos de pago</strong><br>" +
             "• 📏 <strong>Tallas y materiales</strong><br><br>" +
             "¿Sobre qué tema te gustaría saber más?";
    }

    // ========== RESPUESTAS ESPECÍFICAS (INTACTAS) ==========
    getSaludoResponse() {
        const saludos = [
             "¡Hola! 👋 Bienvenido a <strong>D'Pame</strong>. Soy tu asistente virtual. ¿Tienes alguna pregunta sobre nuestros polos personalizados?",
             "¡Buenas! 😊 Me da gusto saludarte. En <strong>D'Pame</strong> nos especializamos en polos personalizados de alta calidad. ¿En qué puedo asistirte hoy?",
             "¡Hola! 🌟 Gracias por contactarnos. Estoy aquí para resolver todas tus dudas sobre nuestros productos, envíos o personalización. ¿Qué te gustaría saber?"
        ];
        return saludos[Math.floor(Math.random() * saludos.length)];
    }

    getEnviosResponse(entities = {}) {
        return "📦 <strong>Información de Envíos:</strong><br><br>" +
             "<strong>Tiempos de entrega:</strong><br>" +
             "• 🇨🇴 <strong>Colombia:</strong> 5-7 días hábiles<br>" +
             "• 🌎 <strong>Resto de Latinoamérica:</strong> 7-12 días hábiles<br>" +
             "• 🌍 <strong>Internacional:</strong> 10-15 días hábiles<br><br>" +
             "<strong>Costos:</strong><br>" +
             "• Envío estándar: $8-15 USD según destino<br>" +
             "• 🎁 <strong>¡ENVÍO GRATIS</strong> en pedidos mayores a $150 USD!<br><br>" +
             "<strong>Seguimiento:</strong><br>" +
             "✓ Recibirás número de tracking por email<br>" +
             "✓ Rastreo en tiempo real disponible<br>" +
             "✓ Empaque seguro y profesional<br><br>" +
             "¿Tienes un pedido específico? ¡Cuéntame más!";
    }

    getPreciosResponse(entities = {}) {
        return "💰 <strong>Nuestros Precios:</strong><br><br>" +
             "<strong>Rango por producto:</strong><br>" +
             "• T-Shirts básicos: desde $12.50 USD<br>" +
             "• Crop Tops: desde $11.50 USD<br>" +
             "• Oversized: desde $14.00 USD<br>" +
             "• Polos: desde $16.50 USD<br>" +
             "• Tank Tops: desde $10.00 USD<br>" +
             "• Manga Larga: desde $15.50 USD<br><br>" +
             "<strong>Descuentos por volumen:</strong><br>" +
             "• 50-99 unidades: 5% de descuento<br>" +
             "• 100-199 unidades: 10% de descuento<br>" +
             "• 200+ unidades: 15% de descuento<br><br>" +
             "💡 <em>¿Te gustaría una cotización específica?</em>";
    }

    getPedidosMinimosResponse(entities = {}) {
        return "📊 <strong>Pedidos Mínimos:</strong><br><br>" +
             "<strong>Por categoría:</strong><br>" +
             "• 🎯 <strong>50 unidades:</strong> T-Shirts, Oversized, Manga Larga<br>" +
             "• 🎯 <strong>80 unidades:</strong> Crop Tops, Tank Tops<br>" +
             "• 🎯 <strong>100 unidades:</strong> Polos corporativos<br><br>" +
             "<strong>¿Por qué hay mínimos?</strong><br>" +
             "✓ Garantizamos calidad de producción<br>" +
             "✓ Optimizamos costos para mejores precios<br>" +
             "✓ Permitimos personalización completa<br><br>" +
             "💡 <em>Consejo: Pedidos más grandes = Mejores precios + Envío gratis</em>";
    }

    getPersonalizacionResponse(entities = {}) {
        return "🎨 <strong>Personalización Total:</strong><br><br>" +
             "<strong>¿Qué puedes personalizar?</strong><br>" +
             "✓ <strong>Colores:</strong> 18+ opciones<br>" +
             "✓ <strong>Tallas:</strong> XS, S, M, L, XL, XXL<br>" +
             "✓ <strong>Materiales:</strong> Algodón Pima, Orgánico, Dry-Fit, Lino<br>" +
             "✓ <strong>Estampados:</strong> Ubicación, tamaño y diseño a tu gusto<br>" +
             "✓ <strong>Bordados:</strong> Logos, textos, símbolos<br>" +
             "✓ <strong>Etiquetas:</strong> Personalización de marca<br><br>" +
             "<strong>¿Cómo funciona?</strong><br>" +
             "1️ Selecciona tu producto favorito<br>" +
             "2️⃣ Elige color, talla y material<br>" +
             "3️ Sube tu diseño o logo (PNG, SVG, PDF)<br>" +
             "4️ ¡Nosotros nos encargamos del resto!<br><br>" +
             "⏱️ Tiempo de producción: 7-10 días hábiles + envío";
    }

    getMetodosPagoResponse() {
        return "💳 <strong>Métodos de Pago:</strong><br><br>" +
             "<strong>Coordinación Personalizada:</strong><br>" +
             "Para garantizar seguridad y flexibilidad en pedidos de exportación o mayoristas, todos nuestros medios de pago se coordinan directamente vía WhatsApp Business.<br><br>" +
             "<strong>Opciones disponibles (previa coordinación):</strong><br>" +
             "💳 <strong>Tarjetas de Crédito/Débito:</strong> Visa, Mastercard, Amex<br>" +
             "🏦 <strong>Transferencia Bancaria:</strong> Cuentas locales e internacionales<br>" +
             "💵 <strong>Contra Entrega:</strong> Disponible solo en Bogotá (pedidos >100 uds)<br>" +
             "📱 <strong>Billeteras Digitales:</strong> Yape, Plin, Nequi (según país)<br><br>" +
             "<strong>¿Cómo funciona?</strong><br>" +
             "1️⃣ Escríbenos al WhatsApp con tu pedido<br>" +
             "2️⃣ Te enviamos la cotización formal y datos de pago<br>" +
             "3️⃣ Confirma tu transferencia o pago seguro<br>" +
             "4️⃣ ¡Iniciamos producción inmediatamente!<br><br>" +
             "✅ <em>Pagos 100% seguros • Factura electrónica incluida • Sin intermediarios</em>";
    }

    getDevolucionesResponse() {
        return "🔄 <strong>Política de Devoluciones:</strong><br><br>" +
             "<strong>Garantía de satisfacción:</strong><br>" +
             "✓ 15 días calendario después de recibido<br>" +
             "✓ Producto debe estar sin usar y con etiquetas<br>" +
             "✓ Empaque original intacto<br><br>" +
             "<strong>¿Qué cubrimos?</strong><br>" +
             "✅ Defectos de fabricación<br>" +
             "✅ Errores en personalización (nuestra responsabilidad)<br>" +
             "✅ Talla incorrecta (si seguiste nuestra guía)<br>" +
             "✅ Daños durante el transporte<br><br>" +
             "<strong>Proceso:</strong><br>" +
             "1️⃣ Contáctanos dentro de los 15 días<br>" +
             "2️⃣ Envía fotos del producto<br>" +
             "3️⃣ Te damos solución en 24-48h<br>" +
             "4️⃣ Reembolso o reemplazo según caso";
    }

    getTallasResponse(entities = {}) {
        return "📏 <strong>Guía de Tallas:</strong><br><br>" +
             "<strong>Tallas disponibles:</strong> XS, S, M, L, XL, XXL<br><br>" +
             "<strong>Medidas aproximadas (cm):</strong><br>" +
             "• <strong>XS:</strong> Pecho 86-91 | Largo 66<br>" +
             "• <strong>S:</strong> Pecho 91-96 | Largo 69<br>" +
             "• <strong>M:</strong> Pecho 96-101 | Largo 71<br>" +
             "• <strong>L:</strong> Pecho 101-106 | Largo 74<br>" +
             "• <strong>XL:</strong> Pecho 106-111 | Largo 76<br>" +
             "• <strong>XXL:</strong> Pecho 111-116 | Largo 79<br><br>" +
             "<strong>¿Cómo medir?</strong><br>" +
             "📐 <strong>Pecho:</strong> Contorno más amplio del busto<br>" +
             "📐 <strong>Largo:</strong> Desde el hombro hasta el borde inferior<br><br>" +
             "💡 <em>Si estás entre tallas, elige la mayor</em>";
    }

    getMaterialesResponse(entities = {}) {
        return "🧵 <strong>Materiales Premium:</strong><br><br>" +
             "<strong>1. Algodón Pima 100%</strong> (Estándar)<br>" +
             "✓ Fibra extra larga, súper suave<br>" +
             "✓ Transpirable y duradero<br>" +
             "✓ Precio base<br><br>" +
             "<strong>2. Algodón Orgánico</strong> (+$2.50 USD)<br>" +
             "✓ Certificado GOTS, 100% sostenible<br>" +
             "✓ Sin químicos ni pesticidas<br><br>" +
             "<strong>3. Dry-Fit Technology</strong> (+$1.50 USD)<br>" +
             "✓ Anti-humedad y secado rápido<br>" +
             "✓ Ideal para deporte<br><br>" +
             "<strong>4. Premium Linen Blend</strong> (+$3.50 USD)<br>" +
             "✓ Fresco y elegante, perfecto para verano";
    }

    getContactoHumanoResponse() {
        return "👤 <strong>Atención Personalizada:</strong><br><br>" +
             "Entiendo que prefieres hablar con una persona. ¡Con gusto te conectamos!<br><br>" +
             "<strong>Opciones de contacto:</strong><br>" +
             "📱 <strong>WhatsApp Business:</strong><br>" +
             "&nbsp;&nbsp;&nbsp;+51 906 577 730<br>" +
             "&nbsp;&nbsp;&nbsp;⏰ Lun-Vie: 9am - 6pm (GMT-5)<br>" +
             "&nbsp;&nbsp;&nbsp;💬 Respuesta en menos de 2 horas<br><br>" +
             "📧 <strong>Email:</strong><br>" +
             "&nbsp;&nbsp;&nbsp;ventas@dpame.com<br>" +
             "&nbsp;&nbsp;&nbsp;⏰ Respuesta en 24 horas hábiles<br><br>" +
             "🚀 <em>¿Urgente? Escríbenos por WhatsApp.</em>";
    }

    getGraciasResponse() {
        const respuestas = [
             "¡De nada! 😊 Estoy aquí para lo que necesites. ¿Hay algo más en lo que pueda ayudarte?",
             "¡Con gusto! 🌟 Si tienes más dudas, no dudes en preguntar. ¡Estamos para servirte!",
             "¡Me alegra haber ayudado!  Cuando quieras, estoy aquí. ¿Necesitas algo más sobre D'Pame?"
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    getDespedidaResponse() {
        return "¡Hasta pronto!  Gracias por contactar a <strong>D'Pame</strong>. Si tienes más preguntas, aquí estaremos. ¡Que tengas un excelente día! 🌟";
    }

    showTypingIndicator() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new IntelligentChatbot();
});