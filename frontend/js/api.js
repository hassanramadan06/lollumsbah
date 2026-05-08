// Tiny typed-ish API client
(function () {
  const BASE = () => window.APP_CONFIG.API_BASE;

  function getToken() { return localStorage.getItem('token'); }
  function setToken(t) { t ? localStorage.setItem('token', t) : localStorage.removeItem('token'); }

  function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (_) { return null; }
  }
  function setUser(u) { u ? localStorage.setItem('user', JSON.stringify(u)) : localStorage.removeItem('user'); }

  async function request(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      opts.body = JSON.stringify(opts.body);
    }
    if (opts.body instanceof FormData) delete headers['Content-Type'];

    const res = await fetch(BASE() + path, { ...opts, headers });
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();
    if (!res.ok) {
      const msg = (data && data.message) ? data.message : `Request failed (${res.status})`;
      const err = new Error(msg);
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  const API = {
    getToken, setToken, getUser, setUser,

    auth: {
      login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
      register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
      me: () => request('/auth/me'),
      updateProfile: (body) => request('/auth/me', { method: 'PUT', body }),
      changePassword: (body) => request('/auth/password', { method: 'PUT', body }),
      logout: () => { setToken(null); setUser(null); },
    },

    products: {
      list: (params = {}) => {
        const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== '' && v != null)).toString();
        return request(`/products?${qs}`);
      },
      get: (slugOrId) => request(`/products/${slugOrId}`),
      create: (body) => request('/products', { method: 'POST', body }),
      update: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
      remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    },

    categories: {
      list: () => request('/categories'),
      create: (body) => request('/categories', { method: 'POST', body }),
      update: (id, body) => request(`/categories/${id}`, { method: 'PUT', body }),
      remove: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
    },

    cart: {
      list: () => request('/cart'),
      add: (body) => request('/cart', { method: 'POST', body }),
      update: (id, body) => request(`/cart/${id}`, { method: 'PUT', body }),
      remove: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
      clear: () => request('/cart', { method: 'DELETE' }),
    },

    wishlist: {
      list: () => request('/wishlist'),
      add: (productId) => request('/wishlist', { method: 'POST', body: { productId } }),
      remove: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
    },

    orders: {
      validateCoupon: (code, subtotal) => request('/orders/validate-coupon', { method: 'POST', body: { code, subtotal } }),
      checkout: (body) => request('/orders/checkout', { method: 'POST', body }),
      mine: () => request('/orders/mine'),
      get: (id) => request(`/orders/${id}`),
    },

    reviews: {
      listForProduct: (productId) => request(`/reviews/product/${productId}`),
      add: (productId, body) => request(`/reviews/product/${productId}`, { method: 'POST', body }),
      remove: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
    },

    coupons: {
      list: () => request('/coupons'),
      create: (body) => request('/coupons', { method: 'POST', body }),
      update: (id, body) => request(`/coupons/${id}`, { method: 'PUT', body }),
      remove: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),
    },

    admin: {
      users: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/admin/users?${qs}`);
      },
      toggleUser: (id) => request(`/admin/users/${id}/toggle`, { method: 'PUT' }),
      reports: () => request('/admin/reports'),
      orders: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/admin/orders?${qs}`);
      },
      updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: { status } }),
    },

    uploads: {
      single: (file) => { const fd = new FormData(); fd.append('image', file); return request('/uploads/single', { method: 'POST', body: fd }); },
      multi: (files) => {
        const fd = new FormData();
        for (const f of files) fd.append('images', f);
        return request('/uploads/multi', { method: 'POST', body: fd });
      },
    },
  };

  window.API = API;
})();
