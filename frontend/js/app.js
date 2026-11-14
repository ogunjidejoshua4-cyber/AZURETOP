document.addEventListener('DOMContentLoaded', async () => {
  // Update user account link based on login state
  const user = API.getCurrentUser();
  const userLink = document.getElementById('user-account-link');
  if (user && userLink) {
    userLink.href = './pages/profile.html';
  }

  // Fetch featured products from backend API
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;

  const data = await API.getProducts();
  const products = data.products || [];

  if (products.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted);">No products found in database yet. Add some via the Admin Studio!</p>`;
    return;
  }

  // Render products
  grid.innerHTML = products.map(product => `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: var(--transition); box-shadow: var(--shadow);">
      <div style="height: 220px; background: #e2e8f0; overflow: hidden;">
        <img src="${product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div style="padding: 1.5rem;">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${product.name}</h3>
        <p style="color: var(--primary); font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
        <a href="./pages/product.html?id=${product._id}" style="display: block; text-align: center; background: var(--bg-main); color: var(--text-main); padding: 0.75rem; border-radius: 8px; font-weight: 600; transition: var(--transition);">View Details</a>
      </div>
    </div>
  `).join('');
});