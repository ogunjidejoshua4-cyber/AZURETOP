document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in to view your profile.');
    window.location.href = 'login.html';
    return;
  }

  // 1. Fetch User Profile
  try {
    const userRes = await fetch('https://voltcart-backend-s41o.onrender.com/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();

    if (userRes.ok) {
      document.getElementById('profile-info').innerHTML = `
        <p style="margin-bottom: 0.5rem; font-size: 1rem; color: var(--text-main);"><strong>Name:</strong> ${userData.name}</p>
        <p style="font-size: 1rem; color: var(--text-main);"><strong>Email:</strong> ${userData.email}</p>
      `;
    } else {
      throw new Error(userData.message);
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
    document.getElementById('profile-info').innerHTML = `<p style="color: var(--danger);">Failed to load profile details.</p>`;
  }

  // 2. Fetch Customer Order History
  const ordersContainer = document.getElementById('orders-container');
  try {
    const ordersRes = await fetch('https://voltcart-backend-s41o.onrender.com/api/orders/myorders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await ordersRes.json();

    if (!ordersRes.ok) throw new Error('Failed to fetch orders');

    if (orders.length === 0) {
      ordersContainer.innerHTML = `<p style="color: var(--text-muted);">You haven't placed any orders yet. Visit the shop to get started!</p>`;
      return;
    }

    ordersContainer.innerHTML = orders.map(order => `
      <div style="border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; background: var(--bg-main);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; font-size: 0.875rem; color: var(--text-main);">Order ID: ${order._id}</span>
          <span style="background: var(--primary-light); color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem;">${order.orderStatus}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Placed on: ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p style="font-weight: 700; color: var(--primary); font-size: 1.125rem; margin-bottom: 1rem;">Total: $${order.totalPrice.toFixed(2)}</p>
        <div style="border-top: 1px solid var(--border); padding-top: 0.75rem;">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Purchased Items:</h4>
          <ul style="padding-left: 1rem; font-size: 0.875rem; color: var(--text-muted);">
            ${order.orderItems.map(i => `<li>${i.name} (Qty: ${i.quantity}) — $${(i.price * i.quantity).toFixed(2)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  } catch (error) {
    ordersContainer.innerHTML = `<p style="color: var(--danger);">Failed to load order history.</p>`;
  }

  // 3. Logout Button Event Listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      API.logout();
    });
  }
});