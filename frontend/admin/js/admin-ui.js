// Admin shared layout/auth
(function () {
  function toast(msg, type = 'info') {
    let wrap = document.getElementById('toast-container');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toast-container'; document.body.appendChild(wrap); }
    const el = document.createElement('div');
    el.className = `toast ${type}`; el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = 0; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
  }
  function formatPrice(v) { return `${(window.APP_CONFIG?.CURRENCY || '$')}${Number(v || 0).toFixed(2)}`; }
  function fmtDate(d) { return new Date(d).toLocaleString(); }

  function ensureAdmin() {
    const u = API.getUser();
    if (!API.getToken() || !u || u.role !== 'admin') {
      toast('Admin access required', 'error');
      setTimeout(() => location.href = '/admin/login.html', 500);
      return false;
    }
    return true;
  }

  function renderSidebar(active) {
    const user = API.getUser() || {};
    const items = [
      { key: 'dashboard', href: '/admin/index.html', icon: '📊', label: 'Dashboard' },
      { key: 'products',  href: '/admin/pages/products.html', icon: '🧸', label: 'Products' },
      { key: 'categories',href: '/admin/pages/categories.html', icon: '📁', label: 'Categories' },
      { key: 'orders',    href: '/admin/pages/orders.html',  icon: '📦', label: 'Orders' },
      { key: 'customers', href: '/admin/pages/customers.html', icon: '👥', label: 'Customers' },
      { key: 'coupons',   href: '/admin/pages/coupons.html', icon: '🎟️', label: 'Coupons' },
      { key: 'reports',   href: '/admin/pages/reports.html', icon: '📈', label: 'Reports' },
    ];
    const host = document.getElementById('sidebar-root');
    if (!host) return;
    host.innerHTML = `
      <aside class="sidebar">
        <div class="brand">★ Admin Panel</div>
        <nav>
          ${items.map(i => `<a href="${i.href}" class="${i.key === active ? 'active' : ''}"><span>${i.icon}</span> ${i.label}</a>`).join('')}
        </nav>
        <div class="user">
          <div>Signed in as</div>
          <b style="color:#fff">${user.name || user.email}</b>
          <div style="display:flex;gap:6px;margin-top:6px">
            <a class="btn btn-ghost btn-sm" href="/index.html">View site</a>
            <button class="btn btn-danger btn-sm" id="logoutBtn">Sign out</button>
          </div>
        </div>
      </aside>
    `;
    document.getElementById('logoutBtn').onclick = () => { API.auth.logout(); location.href = '/admin/login.html'; };
  }

  function modal(open = true) {
    document.getElementById('modal')?.classList.toggle('open', open);
  }

  window.ADMIN = { toast, formatPrice, fmtDate, ensureAdmin, renderSidebar, modal };
})();
