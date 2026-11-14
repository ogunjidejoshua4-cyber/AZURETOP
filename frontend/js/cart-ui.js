document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  const items = Cart.getItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Your cart is empty</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Explore our products and add items to your cart.</p>
        <a href="shop.html" class="btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  const subtotal = Cart.getSubtotal();

  container.innerHTML = `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow);">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">Cart Items (${Cart.getTotalCount()})</h2>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${items.map(item => `
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
              <div>
                <h4 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 1rem;">${item.name}</h4>
                <p style="color: var(--primary); font-weight: 700;">$${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
                <button onclick="updateQty('${item._id}', ${item.quantity - 1})" style="padding: 0.5rem 0.75rem; background: var(--bg-main); cursor: pointer; font-weight: 600;">-</button>
                <span style="padding: 0.5rem 1rem; font-weight: 600; font-size: 0.875rem;">${item.quantity}</span>
                <button onclick="updateQty('${item._id}', ${item.quantity + 1})" style="padding: 0.5rem 0.75rem; background: var(--bg-main); cursor: pointer; font-weight: 600;">+</button>
              </div>
              <button onclick="removeItem('${item._id}')" style="color: var(--danger); cursor: pointer; font-size: 1.125rem;" title="Remove Item"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; height: fit-content; box-shadow: var(--shadow);">
      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">Order Summary</h2>
      <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.875rem;">
        <span>Subtotal</span>
        <span style="font-weight: 600; color: var(--text-main);">$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.875rem;">
        <span>Shipping</span>
        <span style="font-weight: 600; color: var(--success);">Free</span>
      </div>
      <hr style="border: none; border-top: 1px solid var(--border); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 1.125rem; font-weight: 700;">
        <span>Total</span>
        <span style="color: var(--primary);">$${subtotal.toFixed(2)}</span>
      </div>
      <a href="checkout.html" class="btn-primary" style="display: block; text-align: center;">Proceed to Checkout</a>
    </div>
  `;
}

window.updateQty = (id, newQty) => {
  Cart.updateQuantity(id, newQty);
  renderCart();
};

window.removeItem = (id) => {
  Cart.removeItem(id);
  renderCart();
};