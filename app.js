// --------- LISTA DE PRODUCTOS (puedes editar y ampliar) ---------
const products = [
  {
    id: 1,
    nombre: "Cemento Portland Tipo I 42.5kg",
    categoria: "cementos",
    precio: 32.9,
    oferta: true,
    imagen: "img/cemento.jpg"
  },
  {
    id: 2,
    nombre: "Fierro corrugado 1/2\" x 9m",
    categoria: "fierros",
    precio: 46.5,
    oferta: true,
    imagen: "img/fierro.jpg"
  },
  {
    id: 3,
    nombre: "Taladro percutor 750W",
    categoria: "herramientas",
    precio: 259.9,
    oferta: false,
    imagen: "img/taladro.jpg"
  },
  {
    id: 4,
    nombre: "Esmeril angular 4 1/2\"",
    categoria: "herramientas",
    precio: 199.9,
    oferta: false,
    imagen: "img/esmeril.jpg"
  },
  {
    id: 5,
    nombre: "Cable eléctrico 2x2.5mm rollo 100m",
    categoria: "electricidad",
    precio: 349.0,
    oferta: true,
    imagen: "img/cable.jpg"
  },
  {
    id: 6,
    nombre: "Pintura látex interior 1 galón blanco",
    categoria: "pinturas",
    precio: 79.9,
    oferta: false,
    imagen: "img/pintura.jpg"
  }
];

// --------- CARRITO (localStorage) ---------
const CART_KEY = "cart_ferreteria_lescano";

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.cantidad += 1;
  } else {
    cart.push({ id: productId, cantidad: 1 });
  }
  saveCart(cart);
  renderCartItems();
  openCart();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartItems();
}

function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    const filtered = cart.filter((i) => i.id !== productId);
    saveCart(filtered);
  } else {
    saveCart(cart);
  }
  renderCartItems();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalEl.textContent = "0.00";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const producto = products.find((p) => p.id === item.id);
    if (!producto) return;

    const subtotal = producto.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${producto.nombre}</div>
        <div>S/ ${producto.precio.toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="updateQuantity(${producto.id}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button class="cart-qty-btn" onclick="updateQuantity(${producto.id}, 1)">+</button>
      </div>
      <div>S/ ${subtotal.toFixed(2)}</div>
      <button class="cart-qty-btn" onclick="removeFromCart(${producto.id})">✕</button>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function openCart() {
  const panel = document.getElementById("cart-panel");
  if (panel) panel.classList.add("open");
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");
  if (panel) panel.classList.toggle("open");
}

// WhatsApp del carrito (inventado por ahora)
const WHATSAPP_NUMERO = "51987654321";

function enviarCarritoWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero hacer este pedido en Ferretería Lescano:%0A%0A";
  cart.forEach((item) => {
    const producto = products.find((p) => p.id === item.id);
    if (!producto) return;
    mensaje += `- ${producto.nombre} (x${item.cantidad}) - S/ ${producto.precio.toFixed(
      2
    )}%0A`;
  });

  const total = cart
    .reduce((sum, item) => {
      const p = products.find((prod) => prod.id === item.id);
      return sum + (p ? p.precio * item.cantidad : 0);
    }, 0)
    .toFixed(2);

  mensaje += `%0ATotal aproximado: S/ ${total}`;
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
  window.open(url, "_blank");
}

// --------- RENDER DE PRODUCTOS ---------

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  const destacados = products.filter((p) => p.oferta);
  container.innerHTML = "";

  destacados.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image" style="background-image:url('${p.imagen}')"></div>
      <div class="product-info">
        <div class="product-title">${p.nombre}</div>
        <div class="product-category">Categoría: ${p.categoria}</div>
        <div class="product-price-row">
          <span class="product-price">S/ ${p.precio.toFixed(2)}</span>
          ${
            p.oferta
              ? '<span class="product-badge">Oferta</span>'
              : ""
          }
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary full-width" onclick="addToCart(${p.id})">
          Agregar al carrito
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderCatalog(productsToRender = products) {
  const container = document.getElementById("catalog-products");
  if (!container) return;

  container.innerHTML = "";
  if (productsToRender.length === 0) {
    container.innerHTML = "<p>No se encontraron productos con ese filtro.</p>";
    return;
  }

  productsToRender.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image" style="background-image:url('${p.imagen}')"></div>
      <div class="product-info">
        <div class="product-title">${p.nombre}</div>
        <div class="product-category">Categoría: ${p.categoria}</div>
        <div class="product-price-row">
          <span class="product-price">S/ ${p.precio.toFixed(2)}</span>
          ${
            p.oferta
              ? '<span class="product-badge">Oferta</span>'
              : ""
          }
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary full-width" onclick="addToCart(${p.id})">
          Agregar al carrito
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Filtros en el catálogo
function filtrarCatalogo() {
  const select = document.getElementById("filter-category");
  const searchInput = document.getElementById("search-input");
  if (!select || !searchInput) return;

  const categoria = select.value;
  const termino = searchInput.value.toLowerCase().trim();

  let filtrados = products;

  if (categoria !== "todos") {
    filtrados = filtrados.filter((p) => p.categoria === categoria);
  }

  if (termino) {
    filtrados = filtrados.filter((p) =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  renderCatalog(filtrados);
}

// --------- SLIDER ---------
function initSlider() {
  const slider = document.getElementById("main-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("slider-dots");
  if (!slides.length || !dotsContainer) return;

  let current = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "slider-dot" + (index === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".slider-dot");

  function goToSlide(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = index;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  setInterval(() => {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  }, 5000);
}

// --------- FORM COTIZACIÓN (index) ---------
function enviarCotizacion(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const detalle = document.getElementById("detalle").value.trim();

  if (!nombre || !whatsapp || !detalle) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const mensaje = encodeURIComponent(
    `Hola, soy ${nombre}. Mi número de WhatsApp es ${whatsapp}. Quiero cotizar los siguientes materiales/obra:\n\n${detalle}`
  );

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
  window.open(url, "_blank");
}

// --------- INIT GENERAL ---------
document.addEventListener("DOMContentLoaded", () => {
  // Año en el footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Slider en index
  initSlider();

  // Productos destacados en index
  renderFeaturedProducts();

  // Catálogo en página de catálogo
  renderCatalog();

  // Contador de carrito y items
  updateCartCount();
  renderCartItems();

  // Icono de carrito
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCart);
  }
});
