document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in before allowing checkout
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in to complete your checkout.');
    window.location.href = 'login.html';
    return;
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const placeOrderBtn = document.getElementById('place-order-btn');
      const errorDiv = document.getElementById('checkout-error');

      const address = document.getElementById('shipping-address').value;
      const city = document.getElementById('shipping-city').value;
      const postalCode = document.getElementById('shipping-postal').value;
      const country = document.getElementById('shipping-country').value;
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

      const cartItems = Cart.getItems();
      if (cartItems.length === 0) {
        alert('Your cart is empty.');
        window.location.href = 'shop.html';
        return;
      }

      // Format order items for backend API
      const formattedItems = cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      const orderPayload = {
        orderItems: formattedItems,
        shippingAddress: {
          address,
          city,
          postalCode,
          country
        },
        paymentMethod
      };

      placeOrderBtn.textContent = 'Processing Secure Order...';
      placeOrderBtn.disabled = true;

      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Order submission failed');
        }

        // Clear cart on successful order
        localStorage.removeItem('voltcart_cart');
        alert('Order placed successfully!');
        window.location.href = 'profile.html';
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        placeOrderBtn.textContent = 'Place Order Securely';
        placeOrderBtn.disabled = false;
      }
    });
  }
});