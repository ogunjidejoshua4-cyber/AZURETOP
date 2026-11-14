const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get stored admin token
const getAdminToken = () => localStorage.getItem('adminToken');

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  setupEventListeners();
});

// Check if admin is logged in
const checkAdminAuth = () => {
  const token = getAdminToken();
  const userStr = localStorage.getItem('adminUser');
  
  const loginModal = document.getElementById('admin-login-modal');
  const dashboard = document.getElementById('admin-dashboard');

  if (token && userStr) {
    const user = JSON.parse(userStr);
    if (user.role === 'admin') {
      loginModal.style.display = 'none';
      dashboard.style.display = 'flex';
      loadDashboardStats();
      return;
    }
  }

  loginModal.style.display = 'flex';
  dashboard.style.display = 'none';
};

// Setup Event Listeners for login and navigation
const setupEventListeners = () => {
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;
      const errorDiv = document.getElementById('login-error');

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        if (data.role !== 'admin') {
          throw new Error('Access denied. Not an administrator account.');
        }

        // Save admin session
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data));

        errorDiv.style.display = 'none';
        checkAdminAuth();
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.reload();
    });
  }

  // Sidebar Tab Navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const tab = link.getAttribute('data-tab');
      renderTabContent(tab);
    });
  });
};

// Load dynamic dashboard statistics
const loadDashboardStats = async () => {
  try {
    const token = getAdminToken();

    // Fetch products
    const prodRes = await fetch(`${API_BASE_URL}/products`);
    const prodData = await prodRes.json();
    const products = prodData.products || [];

    // Fetch orders
    const orderRes = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orders = orderRes.ok ? await orderRes.json() : [];

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Update DOM
    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
};

// Render different tabs in Admin Studio (Updated with Product Management)
const renderTabContent = async (tab) => {
  const contentArea = document.getElementById('tab-content');
  
  if (tab === 'dashboard') {
    contentArea.innerHTML = `
      <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem;">Dashboard Overview</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Products</h3>
          <div class="value" id="stat-products">0</div>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="value" id="stat-orders">0</div>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <div class="value" id="stat-revenue">$0.00</div>
        </div>
      </div>
    `;
    loadDashboardStats();
  } else if (tab === 'products') {
    contentArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700;">Product Management</h1>
        <button class="btn" id="open-add-product-modal"><i class="fa-solid fa-plus"></i> Add New Product</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-products-table-body">
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading products...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Add Product Modal -->
      <div id="product-modal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); align-items: center; justify-content: center; z-index: 3000;">
        <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius); width: 100%; max-width: 550px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700;">Add New Product</h2>
            <button id="close-product-modal" style="font-size: 1.25rem; cursor: pointer; color: var(--text-muted);"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="add-product-form">
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" id="prod-name" required placeholder="e.g. Wireless Ergonomic Mouse">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="prod-desc" rows="3" required placeholder="Describe the product features..."></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Price ($)</label>
                <input type="number" id="prod-price" step="0.01" min="0" required placeholder="49.99">
              </div>
              <div class="form-group">
                <label>Stock Quantity</label>
                <input type="number" id="prod-stock" min="0" required placeholder="100">
              </div>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select id="prod-category" required>
                <option value="">Loading categories...</option>
              </select>
            </div>
            <div class="form-group">
              <label>Product Image</label>
              <input type="file" id="prod-image-file" accept="image/*" required>
            </div>
            <div id="product-form-error" style="color: var(--danger); font-size: 0.875rem; margin-bottom: 1rem; display: none;"></div>
            <div style="display: flex; justify-content: flex-end; gap: 1rem;">
              <button type="button" class="btn" id="cancel-product-modal" style="background: var(--border); color: var(--text-main);">Cancel</button>
              <button type="submit" class="btn" id="save-product-btn">Save Product</button>
            </div>
          </form>
        </div>
      </div>
    `;
    loadAdminProducts();
    setupProductModalListeners();
  } else if (tab === 'orders') {
    contentArea.innerHTML = `
      <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem;">Order Management</h1>
      <p style="color: var(--text-muted);">Incoming customer orders will be listed here.</p>
    `;
  }
};

// Load products into Admin table
const loadAdminProducts = async () => {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No products found in database.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/50'}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;"></td>
        <td style="font-weight: 600;">${p.name}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>${p.category ? p.category.name : 'Unassigned'}</td>
        <td>
          <button onclick="deleteProduct('${p._id}')" style="color: var(--danger); cursor: pointer;" title="Delete Product"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load products.</td></tr>`;
  }
};

// Setup Product Modal and Form submission
const setupProductModalListeners = async () => {
  const modal = document.getElementById('product-modal');
  const openBtn = document.getElementById('open-add-product-modal');
  const closeBtn = document.getElementById('close-product-modal');
  const cancelBtn = document.getElementById('cancel-product-modal');
  const form = document.getElementById('add-product-form');

  // Fetch categories for dropdown
  try {
    const catRes = await fetch(`${API_BASE_URL}/categories`);
    const categories = await catRes.json();
    const categorySelect = document.getElementById('prod-category');
    
    if (categories.length === 0) {
      categorySelect.innerHTML = `<option value="">No categories available. Create one first!</option>`;
    } else {
      categorySelect.innerHTML = `<option value="">Select a category</option>` + categories.map(c => `
        <option value="${c._id}">${c.name}</option>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load categories', err);
  }

  openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-product-btn');
    const errorDiv = document.getElementById('product-form-error');
    saveBtn.textContent = 'Uploading & Saving...';
    saveBtn.disabled = true;

    try {
      const name = document.getElementById('prod-name').value;
      const description = document.getElementById('prod-desc').value;
      const price = Number(document.getElementById('prod-price').value);
      const stock = Number(document.getElementById('prod-stock').value);
      const category = document.getElementById('prod-category').value;
      const imageFile = document.getElementById('prod-image-file').files[0];

      if (!imageFile) throw new Error('Please select a product image.');

      // Step 1: Upload image to Cloudinary via backend
      const formData = new FormData();
      formData.append('image', imageFile);

      const token = getAdminToken();
      const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed');

      // Step 2: Create product in MongoDB with Cloudinary image URL
      const productPayload = {
        name,
        description,
        price,
        stock,
        category,
        images: [{ url: uploadData.url, public_id: uploadData.public_id }]
      };

      const productRes = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productPayload),
      });

      const productData = await productRes.json();
      if (!productRes.ok) throw new Error(productData.message || 'Product creation failed');

      // Success! Close modal and refresh products
      modal.style.display = 'none';
      form.reset();
      loadAdminProducts();
      loadDashboardStats();
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    } finally {
      saveBtn.textContent = 'Save Product';
      saveBtn.disabled = false;
    }
  });
};

// Global delete product function
window.deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const token = getAdminToken();
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete product');
    }

    loadAdminProducts();
    loadDashboardStats();
  } catch (error) {
    alert(error.message);
  }
};