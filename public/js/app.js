// Toast notification
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = type === 'error' ? 'error show' : 'show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// API helper
async function api(url, method = 'GET', data = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include' };
  if (data) opts.body = JSON.stringify(data);
  const res = await fetch(url, opts);
  return res.json();
}

// Auth state
async function getMe() {
  return api('/api/auth/me');
}

// Update cart badge
async function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  try {
    const cart = await api('/api/cart');
    const count = cart.items ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
  } catch (e) {
    badge.style.display = 'none';
  }
}

// Nav setup
async function setupNav() {
  const me = await getMe();
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;
  if (me.loggedIn) {
    navLinks.innerHTML = `
      <a href="/products"><span>🛍️</span> <span>Shop</span></a>
      ${me.role === 'buyer' ? `<a href="/cart">🛒 Cart <span id="cart-badge" style="display:none">0</span></a>` : ''}
      ${me.role === 'buyer' ? `<a href="/orders"><span>📦</span> <span>Orders</span></a>` : ''}
      ${me.role === 'vendor' ? `<a href="/vendor"><span>🏪</span> <span>Dashboard</span></a>` : ''}
      <a href="#" onclick="logout()" class="btn-accent"><span>Logout</span> (${me.name})</a>
    `;
    updateCartBadge();
  } else {
    navLinks.innerHTML = `
      <a href="/products"><span>🛍️</span> <span>Shop</span></a>
      <a href="/login">Login</a>
      <a href="/register" class="btn-accent">Register</a>
    `;
  }
}

async function logout() {
  await api('/api/auth/logout', 'POST');
  window.location.href = '/login';
}

// Format price
function formatPrice(p) { return '₹' + Number(p).toLocaleString('en-IN'); }

// Format date
function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
