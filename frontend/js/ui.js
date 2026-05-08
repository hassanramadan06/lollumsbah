// Shared UI helpers: toast, header/footer injection, formatters
(function () {
  function formatPrice(v) {
    const n = Number(v || 0);
    return `${window.APP_CONFIG.CURRENCY}${n.toFixed(2)}`;
  }

  function toast(msg, type = 'info', ms = 3000) {
    let wrap = document.getElementById('toast-container');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-container';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
  }

  async function getCartCount() {
    try {
      if (API.getToken()) {
        const items = await API.cart.list();
        return items.reduce((s, i) => s + (i.quantity || 0), 0);
      }
      const local = JSON.parse(localStorage.getItem('guestCart') || '[]');
      return local.reduce((s, i) => s + (i.quantity || 0), 0);
    } catch (_) { return 0; }
  }

  async function getWishlistCount() {
    try {
      if (!API.getToken()) return 0;
      const items = await API.wishlist.list();
      return items.length;
    } catch (_) { return 0; }
  }

  async function renderHeader() {
    const host = document.getElementById('header-root');
    if (!host) return;
    const user = API.getUser();
    const isAdmin = user && user.role === 'admin';
    host.innerHTML = `
      <header class="site-header">
        <nav class="nav">
          <a class="logo" href="/index.html">
            <span class="logo-mark">★</span> ${window.APP_CONFIG.SITE_NAME}
          </a>
          <ul class="nav-links" id="navLinks">
            <li><a href="/index.html" data-nav="home">Home</a></li>
            <li><a href="/pages/products.html" data-nav="shop">Shop</a></li>
            <li><a href="/pages/products.html?ageGroup=1-3" data-nav="age-1">1–3</a></li>
            <li><a href="/pages/products.html?ageGroup=4-6" data-nav="age-2">4–6</a></li>
            <li><a href="/pages/products.html?ageGroup=7-10" data-nav="age-3">7–10</a></li>
            <li><a href="/pages/about.html" data-nav="about">About</a></li>
            <li><a href="/pages/contact.html" data-nav="contact">Contact</a></li>
            ${isAdmin ? '<li><a href="/admin/index.html" style="color:var(--primary)"><b>Admin</b></a></li>' : ''}
          </ul>
          <div class="nav-actions">
            <a class="icon-btn" href="/pages/wishlist.html" title="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span class="badge" id="wishBadge">0</span>
            </a>
            <a class="icon-btn" href="/pages/cart.html" title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span class="badge" id="cartBadge">0</span>
            </a>
            ${user
              ? `<a class="icon-btn" href="/pages/account.html" title="${user.name}">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </a>`
              : `<a class="btn btn-primary btn-sm" href="/pages/login.html">Sign in</a>`
            }
            <button class="icon-btn menu-toggle" id="menuToggle" title="Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </nav>
      </header>
    `;
    const links = document.getElementById('navLinks');
    document.getElementById('menuToggle')?.addEventListener('click', () => links?.classList.toggle('open'));

    // highlight active link
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href').endsWith(path)) a.classList.add('active');
    });

    // badges
    getCartCount().then(n => { const b = document.getElementById('cartBadge'); if (b) b.textContent = n; });
    getWishlistCount().then(n => { const b = document.getElementById('wishBadge'); if (b) b.textContent = n; });
  }

  function renderFooter() {
    const host = document.getElementById('footer-root');
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="logo"><span class="logo-mark">★</span> ${window.APP_CONFIG.SITE_NAME}</div>
              <p>Premium kids fashion for ages 1–10. Comfortable, stylish, and made to play.</p>
            </div>
            <div>
              <h4>Shop</h4>
              <a href="/pages/products.html?ageGroup=1-3">Ages 1–3</a>
              <a href="/pages/products.html?ageGroup=4-6">Ages 4–6</a>
              <a href="/pages/products.html?ageGroup=7-10">Ages 7–10</a>
              <a href="/pages/products.html?bestSeller=true">Best Sellers</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/pages/about.html">About</a>
              <a href="/pages/contact.html">Contact</a>
            </div>
            <div>
              <h4>Account</h4>
              <a href="/pages/login.html">Sign in</a>
              <a href="/pages/register.html">Register</a>
              <a href="/pages/wishlist.html">Wishlist</a>
            </div>
          </div>
          <div class="footer-bottom">© ${new Date().getFullYear()} ${window.APP_CONFIG.SITE_NAME}. All rights reserved.</div>
        </div>
      </footer>
    `;
  }

  function bootstrap() {
    renderHeader();
    renderFooter();
  }

  function requireAuth(redirect = '/pages/login.html') {
    if (!API.getToken()) {
      toast('Please sign in to continue', 'error');
      setTimeout(() => location.href = redirect + '?next=' + encodeURIComponent(location.pathname + location.search), 400);
      return false;
    }
    return true;
  }

  function logout() {
    API.auth.logout();
    toast('Signed out', 'success');
    setTimeout(() => location.href = '/index.html', 400);
  }

  window.UI = { toast, formatPrice, renderHeader, renderFooter, bootstrap, requireAuth, logout };

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
