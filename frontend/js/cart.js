const Cart = {
  // Get cart items from localStorage
  getItems: () => {
    const cart = localStorage.getItem('voltcart_cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Save cart items to localStorage and update badge
  saveItems: (cartItems) => {
    localStorage.setItem('voltcart_cart', JSON.stringify(cartItems));
    Cart.updateBadge();
  },

  // Add product to cart
  addItem: (product, quantity = 1) => {
    const cart = Cart.getItems();
    const existingIndex = cart.findIndex(item => item._id === product._id);

    if (existingIndex > -1) {
      // If item already exists, increase quantity (up to available stock)
      const newQty = cart[existingIndex].quantity + quantity;
      cart[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
        stock: product.stock,
        quantity: quantity
      });
    }

    Cart.saveItems(cart);
  },

  // Remove item from cart
  removeItem: (productId) => {
    let cart = Cart.getItems();
    cart = cart.filter(item => item._id !== productId);
    Cart.saveItems(cart);
  },

  // Update item quantity
  updateQuantity: (productId, quantity) => {
    const cart = Cart.getItems();
    const item = cart.find(item => item._id === productId);
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock));
      Cart.saveItems(cart);
    }
  },

  // Get total item count for navbar badge
  getTotalCount: () => {
    const cart = Cart.getItems();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Calculate cart subtotal
  getSubtotal: () => {
    const cart = Cart.getItems();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Update cart badge in navigation bar across pages
  updateBadge: () => {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = Cart.getTotalCount();
    }
  }
};

// Initialize badge on every page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});