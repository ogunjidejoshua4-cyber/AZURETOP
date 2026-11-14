let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'shop.html';
    return;
  }

  const container = document.getElementById('product-detail-container');
  currentProduct = await API.getProductById(productId);

  if (!currentProduct) {
    container.innerHTML = `<p style="color: var(--danger);">Product not found or unavailable.</p>`;
    return;
  }

  const imageUrl = currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images[0].url : 'https://via.placeholder.com/500';

  container.innerHTML = `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow);">
      <img src="${imageUrl}" alt="${currentProduct.name}" style="width: 100%; height: 450px; object-fit: cover;">
    </div>
    <div>
      <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem;">${currentProduct.name}</h1>
      <p style="color: var(--primary); font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem;">$${currentProduct.price.toFixed(2)}</p>
      <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem;">${currentProduct.description}</p>
      
      <div style="margin-bottom: 2rem;">
        <p style="font-weight: 600; margin-bottom: 0.5rem;">Availability: <span style="color: ${currentProduct.stock > 0 ? 'var(--success)' : 'var(--danger)'};">${currentProduct.stock > 0 ? `In Stock (${currentProduct.stock} available)` : 'Out of Stock'}</span></p>
      </div>

      ${currentProduct.stock > 0 ? `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
            <button id="qty-minus" style="padding: 0.75rem 1rem; background: var(--bg-main); font-weight: 700; cursor: pointer; border: none;">-</button>
            <span id="qty-value" style="padding: 0.75rem 1.25rem; font-weight: 700;">1</span>
            <button id="qty-plus" style="padding: 0.75rem 1rem; background: var(--bg-main); font-weight: 700; cursor: pointer; border: none;">+</button>
          </div>
          <button id="add-to-cart-btn" class="btn-primary" style="flex: 1; padding: 0.875rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Add to Cart</button>
        </div>
      ` : ''}
    </div>
  `;

  if (currentProduct.stock > 0) {
    setupQuantityAndCartListeners();
  }
});

function setupQuantityAndCartListeners() {
  let qty = 1;
  const qtyValue = document.getElementById('qty-value');
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  minusBtn.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      qtyValue.textContent = qty;
    }
  });

  plusBtn.addEventListener('click', () => {
    if (qty < currentProduct.stock) {
      qty++;
      qtyValue.textContent = qty;
    }
  });

  addToCartBtn.addEventListener('click', () => {
    Cart.addItem(currentProduct, qty);
    alert(`Added ${qty} ${currentProduct.name}(s) to your cart!`);
  });
}