document.addEventListener('DOMContentLoaded', () => {
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Tab switching logic
  tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.style.color = 'var(--primary)';
    tabLoginBtn.style.borderBottom = '2px solid var(--primary)';
    tabRegisterBtn.style.color = 'var(--text-muted)';
    tabRegisterBtn.style.borderBottom = 'none';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  tabRegisterBtn.addEventListener('click', () => {
    tabRegisterBtn.style.color = 'var(--primary)';
    tabRegisterBtn.style.borderBottom = '2px solid var(--primary)';
    tabLoginBtn.style.color = 'var(--text-muted)';
    tabLoginBtn.style.borderBottom = 'none';
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  });

  // Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    const result = await API.login(email, password);
    if (result.success) {
      window.location.href = 'profile.html';
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  });

  // Handle Registration Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');

    const result = await API.register(name, email, password);
    if (result.success) {
      window.location.href = 'profile.html';
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  });
});