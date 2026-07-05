const WHATSAPP_NUMBER = '573001234567';
const CART_KEY = 'aurum_cart';
const FAVORITES_KEY = 'aurum_favorites';
const NOTES_KEY = 'aurum_notes';

const PRODUCT_CATEGORIES = {
  relojes: 'Relojes',
  'ropa-hombre': 'Ropa para Hombre',
  'ropa-mujer': 'Ropa para Mujer',
  zapatos: 'Zapatos',
  accesorios: 'Accesorios',
};

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const PRODUCTS = [
  {
    id: 'reloj-classic',
    name: 'Chrono Classic',
    category: 'relojes',
    price: 289000,
    badge: 'Nuevo',
    description: 'Reloj de pulsera con diseño minimalista, acabado satinado y presencia elegante.',
    variants: 'Negro · 40 mm',
    image: 'assets/images/reloj-classic.svg',
  },
  {
    id: 'reloj-sport',
    name: 'Milano Sport',
    category: 'relojes',
    price: 319000,
    badge: 'Más vendido',
    description: 'Versión deportiva con correa ligera y resistencia diaria.',
    variants: 'Azul · 42 mm',
    image: 'assets/images/reloj-sport.svg',
  },
  {
    id: 'camisa-lino',
    name: 'Camisa Atlas',
    category: 'ropa-hombre',
    price: 149000,
    badge: 'Temporada',
    description: 'Camisa de lino con corte relajado y tono cálido para looks urbanos.',
    variants: 'Beige · Estilo premium',
    image: 'assets/images/camisa-lino.svg',
  },
  {
    id: 'abrigo-urbano',
    name: 'Abrigo Norte',
    category: 'ropa-hombre',
    price: 229000,
    badge: 'Edición',
    description: 'Abrigo urbano de estructura limpia y silueta sofisticada.',
    variants: 'Marrón · Corte estructurado',
    image: 'assets/images/abrigo-urbano.svg',
  },
  {
    id: 'vestido-emilia',
    name: 'Vestido Emilia',
    category: 'ropa-mujer',
    price: 189000,
    badge: 'Colección',
    description: 'Diseño fluido con caída elegante y detalle de cinturón.',
    variants: 'Crema · Silueta refinada',
    image: 'assets/images/vestido-emilia.svg',
  },
  {
    id: 'blazer-sofia',
    name: 'Blazer Sofía',
    category: 'ropa-mujer',
    price: 219000,
    badge: 'Premium',
    description: 'Blazer estructurado ideal para looks de oficina y eventos.',
    variants: 'Negro · Corte moderno',
    image: 'assets/images/blazer-sofia.svg',
  },
  {
    id: 'zapato-casual',
    name: 'Zapato Urbano',
    category: 'zapatos',
    price: 239000,
    badge: 'Nuevo',
    description: 'Zapato casual con suela cómoda y diseño contemporáneo.',
    variants: 'Taupe · Estilo diario',
    image: 'assets/images/zapato-casual.svg',
  },
  {
    id: 'zapato-elegante',
    name: 'Zapato de Noche',
    category: 'zapatos',
    price: 269000,
    badge: 'Editorial',
    description: 'Modelo elegante con acabado pulido y línea refinada.',
    variants: 'Negro · Acabado premium',
    image: 'assets/images/zapato-elegante.svg',
  },
  {
    id: 'zapato-runner',
    name: 'Runner Atelier',
    category: 'zapatos',
    price: 219000,
    badge: 'Sport',
    description: 'Zapatilla ligera para desplazamientos con un toque sofisticado.',
    variants: 'Blanco · Comodidad diaria',
    image: 'assets/images/zapato-runner.svg',
  },
  {
    id: 'pulsera-atelier',
    name: 'Pulsera Atelier',
    category: 'accesorios',
    price: 99000,
    badge: 'Accesorio',
    description: 'Pulsera fina con acabado metálico y toque minimalista.',
    variants: 'Oro · Único',
    image: 'assets/images/pulsera-atelier.svg',
  },
  {
    id: 'cinturon-milano',
    name: 'Cinturón Milano',
    category: 'accesorios',
    price: 109000,
    badge: 'Nuevo',
    description: 'Cinturón de cuero con hebilla refinada y cierre seguro.',
    variants: 'Negro · 95 cm',
    image: 'assets/images/cinturon-milano.svg',
  },
];

const state = {
  activeFilter: 'all',
  favoritesOnly: false,
  cart: loadCart(),
  favorites: loadFavorites(),
  notes: loadNotes(),
};

const categoryGrid = document.getElementById('categoryGrid');
const catalog = document.getElementById('catalog');
const filterButtons = document.querySelectorAll('.filter-chip[data-filter]');
const favoritesToggle = document.getElementById('favoritesToggle');
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotalValue = document.getElementById('cartSubtotalValue');
const cartDiscountValue = document.getElementById('cartDiscountValue');
const cartGrandTotalValue = document.getElementById('cartGrandTotalValue');
const orderNotes = document.getElementById('orderNotes');
const whatsappBtn = document.getElementById('whatsappBtn');
const emptyCartBtn = document.getElementById('emptyCartBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const cartBadge = document.getElementById('cartBadge');
const toast = document.getElementById('toast');

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('toast--visible'), 2500);
}

function loadCart() {
  try {
    return (JSON.parse(localStorage.getItem(CART_KEY) || '[]')).map((item) => ({
      ...item,
      cartKey: item.cartKey || `${item.id}-${item.size || 'default'}`,
    }));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
}

function loadNotes() {
  return localStorage.getItem(NOTES_KEY) || '';
}

function saveNotes() {
  localStorage.setItem(NOTES_KEY, state.notes);
}

function isFavorite(productId) {
  return state.favorites.includes(productId);
}

function toggleFavorite(productId) {
  if (isFavorite(productId)) {
    state.favorites = state.favorites.filter((id) => id !== productId);
    showToast('Producto quitado de favoritos');
  } else {
    state.favorites.push(productId);
    showToast('Producto agregado a favoritos');
  }
  saveFavorites();
  renderCatalog();
}

function requiresSize(product) {
  return ['ropa-hombre', 'ropa-mujer', 'zapatos'].includes(product.category);
}

function getAvailableSizes(product) {
  if (product.category === 'zapatos') return SHOE_SIZES;
  if (product.category === 'ropa-hombre' || product.category === 'ropa-mujer') return CLOTHING_SIZES;
  return [];
}

function getFilteredProducts() {
  return PRODUCTS.filter((product) => {
    const categoryMatch = state.activeFilter === 'all' || product.category === state.activeFilter;
    const favoriteMatch = !state.favoritesOnly || state.favorites.includes(product.id);
    return categoryMatch && favoriteMatch;
  });
}

function renderCategoryCards() {
  categoryGrid.innerHTML = Object.entries(PRODUCT_CATEGORIES)
    .map(([key, label]) => `
      <article class="category-card">
        <span class="category-card__badge">${label}</span>
        <h3 class="category-card__title">${label}</h3>
        <p class="category-card__text">Selecciona piezas de ${label.toLowerCase()} con un estilo premium y versátil.</p>
      </article>
    `)
    .join('');
}

function renderCatalog() {
  const products = getFilteredProducts();

  if (products.length === 0) {
    catalog.innerHTML = '<p class="cart-empty">No hay productos para mostrar con estos filtros.</p>';
    return;
  }

  catalog.innerHTML = products
    .map((product) => {
      const favorite = isFavorite(product.id);
      const sizeMarkup = requiresSize(product)
        ? `
          <div class="product-card__size">
            <label class="product-card__size-label" for="size-${product.id}">Talla</label>
            <select class="product-card__select" id="size-${product.id}" data-size-select="${product.id}">
              ${getAvailableSizes(product).map((size) => `<option value="${size}">${size}</option>`).join('')}
            </select>
          </div>
        `
        : '';

      return `
        <article class="product-card">
          <div class="product-card__image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-card__body">
            <div class="product-card__top">
              <div>
                <span class="product-card__badge">${product.badge}</span>
                <h3>${product.name}</h3>
              </div>
              <button class="icon-btn ${favorite ? 'icon-btn--active' : ''}" data-favorite="${product.id}" type="button" aria-label="Marcar favorito">
                ♥
              </button>
            </div>
            <p class="product-card__meta">${PRODUCT_CATEGORIES[product.category]} · ${product.variants}</p>
            <p>${product.description}</p>
            ${sizeMarkup}
            <div class="product-card__price">${formatPrice(product.price)}</div>
            <div class="product-card__actions">
              <button class="btn btn--primary" data-add="${product.id}" type="button">Agregar al carrito</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.add));
  });

  document.querySelectorAll('[data-favorite]').forEach((button) => {
    button.addEventListener('click', () => toggleFavorite(button.dataset.favorite));
  });
}

function getSelectedSize(productId) {
  const select = document.querySelector(`[data-size-select="${productId}"]`);
  return select ? select.value : null;
}

function buildCartItemKey(product, size) {
  return `${product.id}-${size || 'default'}`;
}

function addToCart(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  let selectedSize = null;
  if (requiresSize(product)) {
    selectedSize = getSelectedSize(productId);
    if (!selectedSize) {
      showToast('Selecciona una talla para continuar');
      return;
    }
  }

  const cartKey = buildCartItemKey(product, selectedSize);
  const existing = state.cart.find((item) => item.cartKey === cartKey);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      ...product,
      quantity: 1,
      size: selectedSize,
      categoryLabel: PRODUCT_CATEGORIES[product.category],
      cartKey,
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} agregado al carrito`);
}

function updateQuantity(productKey, delta) {
  const existing = state.cart.find((item) => item.cartKey === productKey);
  if (!existing) return;

  existing.quantity += delta;
  if (existing.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.cartKey !== productKey);
  }
  saveCart();
  renderCart();
}

function removeFromCart(productKey) {
  state.cart = state.cart.filter((item) => item.cartKey !== productKey);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const grandTotal = subtotal - discount;

  cartBadge.textContent = totalItems;
  cartBadge.hidden = totalItems === 0;

  if (state.cart.length === 0) {
    cartEmpty.hidden = false;
    cartSummary.hidden = true;
    cartItems.innerHTML = '';
  } else {
    cartEmpty.hidden = true;
    cartSummary.hidden = false;
    cartItems.innerHTML = state.cart
      .map((item) => `
        <li class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <div class="cart-item__title">${item.name}</div>
            <div class="cart-item__meta">${item.categoryLabel}</div>
            ${item.size ? `<div class="cart-item__size">Talla: ${item.size}</div>` : ''}
            <div class="cart-item__qty">
              <button class="qty-btn" data-qty="${item.cartKey}" data-delta="-1" type="button">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-qty="${item.cartKey}" data-delta="1" type="button">+</button>
            </div>
            <div class="cart-item__price-row">
              <span>${formatPrice(item.price)} c/u</span>
              <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            <button class="cart-item__remove" data-remove="${item.cartKey}" type="button">Eliminar</button>
          </div>
        </li>
      `)
      .join('');
  }

  cartCount.textContent = `${totalItems} artículo${totalItems === 1 ? '' : 's'}`;
  cartTotal.textContent = formatPrice(subtotal);
  cartSubtotalValue.textContent = formatPrice(subtotal);
  cartDiscountValue.textContent = formatPrice(discount);
  cartGrandTotalValue.textContent = formatPrice(grandTotal);

  document.querySelectorAll('[data-qty]').forEach((button) => {
    button.addEventListener('click', () => {
      updateQuantity(button.dataset.qty, Number(button.dataset.delta));
    });
  });

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(button.dataset.remove));
  });
}

function openCart() {
  cartPanel.classList.add('cart-modal--open');
  cartPanel.setAttribute('aria-hidden', 'false');
  cartToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartPanel.classList.remove('cart-modal--open');
  cartPanel.setAttribute('aria-hidden', 'true');
  cartToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function buildWhatsAppMessage() {
  const itemsText = state.cart
    .map((item) => {
      const sizeText = item.size ? ` · Talla: ${item.size}` : '';
      return `• ${item.name}${sizeText} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
    })
    .join('\n');
  const notes = state.notes.trim();
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `Hola, quiero realizar el siguiente pedido:\n\n${itemsText}\n\nTotal: ${formatPrice(total)}${notes ? `\n\nNotas: ${notes}` : ''}`;
}

function clearCart() {
  state.cart = [];
  saveCart();
  renderCart();
  showToast('Carrito vaciado');
}

function initEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('filter-chip--active'));
      button.classList.add('filter-chip--active');
      state.activeFilter = button.dataset.filter;
      renderCatalog();
    });
  });

  favoritesToggle.addEventListener('click', () => {
    state.favoritesOnly = !state.favoritesOnly;
    favoritesToggle.classList.toggle('filter-chip--active', state.favoritesOnly);
    renderCatalog();
  });

  cartToggle.addEventListener('click', () => {
    openCart();
  });

  cartOverlay.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);
  continueShoppingBtn.addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
    }
  });

  orderNotes.value = state.notes;
  orderNotes.addEventListener('input', (event) => {
    state.notes = event.target.value;
    saveNotes();
  });

  whatsappBtn.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Agrega productos antes de confirmar');
      return;
    }
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');
    closeCart();
    showToast('Pedido preparado para WhatsApp');
  });

  emptyCartBtn.addEventListener('click', clearCart);
}

renderCategoryCards();
renderCatalog();
renderCart();
initEvents();
