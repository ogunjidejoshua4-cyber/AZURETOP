document.addEventListener('DOMContentLoaded', async () => {
  await loadCategoriesDropdown();
  await fetchAndRenderProducts();

  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchAndRenderProducts();
    }, 400);
  });

  categoryFilter.addEventListener('change', () => {
    fetchAndRenderProducts();
  });
});

async function loadCategoriesDropdown() {
  const select = document.getElementById('category-filter');
  if (!select) return;

  const categories = await API.getCategories();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat._id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

async function fetchAndRenderProducts() {
  const grid = document.getElementById('shop-products-grid');
  const search = document.getElementById('search-input').value.trim();
  const category = document.getElementById('category-filter').value;

  let query = '?';
  if (search) query += `keyword=${encodeURIComponent(search)}&`;
  if (category) query += `category=${category}&`;

  grid.innerHTML = `<p style="color: var(--text-muted);">Loading products...</p>`;

  const data = await API.getProducts(query);
  const products = data.products || [];

  if (products.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1;">No products found matching your criteria.</p>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: var(--transition); box-shadow: var(--shadow);">
      <div style="height: 220px; background: #e2e8f0; overflow: hidden;">
        <img src="${product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div style="padding: 1.5rem;">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${product.name}</h3>
        <p style="color: var(--primary); font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
        <a href="product.html?id=${product._id}" style="display: block; text-align: center; background: var(--bg-main); color: var(--text-main); padding: 0.75rem; border-radius: 8px; font-weight: 600; transition: var(--transition);">View Details</a>
      </div>
    </div>
  `).join('');
}