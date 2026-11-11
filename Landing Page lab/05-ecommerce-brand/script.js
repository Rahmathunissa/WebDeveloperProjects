
const products = [
    { id: 1, name: "Ceramic Sculpt Vase", category: "home", price: 89, image: "images/vase.jpeg", description: "A sculptural accent for your home.", badge: "BESTSELLER" },
    { id: 2, name: "Minimalist Tote Bag", category: "fashion", price: 65, image: "images/tote.jpeg", description: "An everyday carry essential." },
    { id: 3, name: "LUMA Desk Lamp", category: "home", price: 149, image: "images/lamp.jpeg", description: "Soft light for slower evenings.", badge: "NEW" },
    { id: 4, name: "Classic Sunglasses", category: "accessories", price: 119, image: "images/sunglasses.jpeg", description: "A timeless finishing touch." },
    { id: 5, name: "Everyday Linen Shirt", category: "fashion", price: 175, image: "images/shirt.jpeg", description: "Relaxed comfort, refined style.", badge: "POPULAR" },
    { id: 6, name: "Essential Watch", category: "accessories", price: 220, image: "images/watch.jpeg", description: "Simple design for every day." },
    { id: 7, name: "Stoneware Coffee Set", category: "home", price: 95, image: "images/coffee.jpeg", description: "Make your morning ritual special." },
    { id: 8, name: "Soft Cotton Scarf", category: "fashion", price: 79, image: "images/scarf.jpeg", description: "A versatile wardrobe staple." },
    { id: 9, name: "Leather Card Holder", category: "accessories", price: 55, image: "images/cardholder.jpeg", description: "Carry only what matters." }
];

let selectedCategory = "all";
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const productTotal = document.getElementById("productTotal");
const cartCount = document.getElementById("cartCount");

function displayProducts() {
    let filteredProducts = [...products];

    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(
            product => product.category === selectedCategory
        );
    }

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    if (sortSelect.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    productTotal.textContent = `${filteredProducts.length} products`;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p>No products found. Try another search.</p>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-visual">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
                >
                <span class="product-symbol" style="display:none">
                    ${product.name.charAt(0)}
                </span>
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.description}</p>

                <div class="product-bottom">
                    <span class="product-price">AED ${product.price}</span>
                    <button class="add-button" data-id="${product.id}">
                        + Add to bag
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        button.classList.add("active");
        selectedCategory = button.dataset.category;
        displayProducts();
    });
});

searchInput.addEventListener("input", displayProducts);
sortSelect.addEventListener("change", displayProducts);

function updateCartCount() {
    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity, 0
    );
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartSubtotal = document.getElementById("cartSubtotal");

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your bag is currently empty.</p>`;
        cartSubtotal.textContent = "AED 0";
        updateCartCount();
        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div>
                    <h3>${product.name}</h3>
                    <p>AED ${product.price} each</p>
                    <div class="cart-item-actions">
                        <button data-action="decrease" data-id="${product.id}">−</button>
                        <span>${item.quantity}</span>
                        <button data-action="increase" data-id="${product.id}">+</button>
                        <button class="remove-item" data-action="remove" data-id="${product.id}">Remove</button>
                    </div>
                </div>
                <strong>AED ${itemTotal}</strong>
            </div>
        `;
    }).join("");

    cartSubtotal.textContent = `AED ${total}`;
    updateCartCount();
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    renderCart();
    button.textContent = "Added ✓";

    setTimeout(() => {
        button.textContent = "+ Add to bag";
    }, 1000);
});

// Shopping cart controls
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    renderCart();
}

function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("cartItems").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") item.quantity++;
    if (action === "decrease") item.quantity--;
    if (action === "remove" || item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
});

// CHECKOUT FUNCTIONALITY

const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + product.price * item.quantity;
    }, 0);
}

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    checkoutTotal.textContent = `AED ${getCartTotal()}`;

    closeCart();
    checkoutOverlay.classList.add("active");
});

// Close checkout
function closeCheckout() {
    checkoutOverlay.classList.remove("active");
}

document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
    if (event.target === checkoutOverlay) {
        closeCheckout();
    }
});

// Submit demo order
checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const orderTotal = getCartTotal();
    const orderNumber = Date.now().toString().slice(-6);

    checkoutForm.innerHTML = `
    <div class="order-success">
        <div class="success-icon">✓</div>
        <p class="eyebrow">ORDER CONFIRMED</p>
        <h2>Thank you, ${customerName}!</h2>
        <p>Your LUMA demo order has been placed successfully.</p>
        <div class="success-order-details">
            <span>Order number</span>
            <strong>LUMA-${orderNumber}</strong>
            <span>Order total</span>
            <strong>AED ${orderTotal}</strong>
        </div>
        <button type="button" class="checkout-submit" id="finishOrder">
            Continue shopping
        </button>
    </div>
`;

document.getElementById("finishOrder").addEventListener("click", () => {
    cart = [];
    renderCart();
    closeCheckout();
    location.reload();
});

    cart = [];
    renderCart();
    checkoutForm.reset();
    closeCheckout();
});
// Initial render
displayProducts();
renderCart();


// PRODUCT QUICK VIEW

const quickViewOverlay = document.getElementById("quickViewOverlay");
const quickViewContent = document.getElementById("quickViewContent");
const closeQuickView = document.getElementById("closeQuickView");

// Open product details when clicking a product card
productGrid.addEventListener("click", event => {
    // Ignore clicks on the Add to Bag button
    if (event.target.closest(".add-button")) return;

    const card = event.target.closest(".product-card");
    if (!card) return;

    const productName = card.querySelector(".product-name").textContent;
    const product = products.find(item => item.name === productName);

    if (!product) return;

    quickViewContent.innerHTML = `
        <div class="quick-view-visual">
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
            >
            <span class="product-symbol" style="display:none">
                ${product.name.charAt(0)}
            </span>
        </div>

        <div class="quick-view-details">
            <span class="product-category">${product.category}</span>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="quick-view-price">AED ${product.price}</div>

            <button class="quick-view-add" data-id="${product.id}">
                Add to shopping bag
            </button>
        </div>
    `;

    quickViewOverlay.classList.add("active");
});

// Add product from Quick View
quickViewContent.addEventListener("click", event => {
    const button = event.target.closest(".quick-view-add");
    if (!button) return;

    const id = Number(button.dataset.id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    renderCart();
    quickViewOverlay.classList.remove("active");
    openCart();
});

// Close popup
closeQuickView.addEventListener("click", () => {
    quickViewOverlay.classList.remove("active");
});

quickViewOverlay.addEventListener("click", event => {
    if (event.target === quickViewOverlay) {
        quickViewOverlay.classList.remove("active");
    }
});

// Close popup with Escape key
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        quickViewOverlay.classList.remove("active");
        closeCart();
        closeCheckout();
    }
});
