// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${productName} added to cart!`);
}

function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Quote request functionality
function requestQuote(productName) {
    const modal = document.getElementById('quote-modal');
    document.getElementById('quote-product').value = productName;
    modal.style.display = 'flex';
}

function closeQuoteModal() {
    document.getElementById('quote-modal').style.display = 'none';
}

function submitQuote(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const quoteData = Object.fromEntries(formData);
    
    // Store quote request
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes.push({ ...quoteData, id: Date.now(), date: new Date().toLocaleDateString() });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    showNotification('Quote request submitted successfully!');
    closeQuoteModal();
    event.target.reset();
}

// Product filtering functionality
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.category-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        let show = false;
        
        switch(category) {
            case 'all':
                show = true;
                break;
            case 'steel':
                show = title.includes('steel') || title.includes('metal') || title.includes('beam');
                break;
            case 'tools':
                show = title.includes('tool') || title.includes('hardware');
                break;
            case 'concrete':
                show = title.includes('cement') || title.includes('concrete');
                break;
            case 'hardware':
                show = title.includes('fastener') || title.includes('nail') || title.includes('hardware');
                break;
        }
        
        product.style.display = show ? 'block' : 'none';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    // Add search event listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('quote-modal');
        if (e.target === modal) {
            closeQuoteModal();
        }
    });
});