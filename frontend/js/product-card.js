// Product card template used across pages
window.renderProductCard = function (p) {
  const tags = [];
  if (p.isBestSeller) tags.push('<span class="tag best">Best Seller</span>');
  if (p.isNew) tags.push('<span class="tag new">New</span>');
  if (p.discountPrice) tags.push('<span class="tag sale">Sale</span>');

  const img = p.mainImage || (p.images && p.images[0]?.url) || 'https://picsum.photos/seed/placeholder/600/700';
  const price = Number(p.discountPrice || p.price);
  const old = p.discountPrice ? `<span class="old">${UI.formatPrice(p.price)}</span>` : '';
  const star = '★'.repeat(Math.round(p.rating || 0)).padEnd(5, '☆');
  const cat = (p.category && p.category.name) || '';

  return `
    <div class="product-card fade-up" data-id="${p.id}">
      <a href="/pages/product.html?slug=${encodeURIComponent(p.slug)}" class="thumb">
        <img src="${img}" alt="${p.name}" loading="lazy"/>
      </a>
      <div class="tags">${tags.join('')}</div>
      <button class="wish" data-wish="${p.id}" title="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="body">
        <div class="cat">${cat}</div>
        <a href="/pages/product.html?slug=${encodeURIComponent(p.slug)}" class="name">${p.name}</a>
        <div class="rating">${star} <small style="color:var(--muted)">(${p.reviewsCount || 0})</small></div>
        <div class="price">
          <span class="now">${UI.formatPrice(price)}</span> ${old}
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-primary btn-block btn-sm" data-add="${p.id}">Add to cart</button>
      </div>
    </div>
  `;
};

// Delegate clicks for add-to-cart / wishlist
document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    const productId = Number(addBtn.dataset.add);
    try {
      if (API.getToken()) {
        await API.cart.add({ productId, quantity: 1 });
      } else {
        const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const existing = cart.find(i => i.productId === productId && !i.size && !i.color);
        if (existing) existing.quantity += 1;
        else cart.push({ productId, quantity: 1 });
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }
      UI.toast('Added to cart', 'success');
      UI.renderHeader();
    } catch (err) {
      UI.toast(err.message || 'Failed to add', 'error');
    }
  }

  const wish = e.target.closest('[data-wish]');
  if (wish) {
    const productId = Number(wish.dataset.wish);
    if (!API.getToken()) return UI.toast('Sign in to use wishlist', 'error');
    try {
      if (wish.classList.contains('active')) {
        await API.wishlist.remove(productId);
        wish.classList.remove('active');
        UI.toast('Removed from wishlist');
      } else {
        await API.wishlist.add(productId);
        wish.classList.add('active');
        UI.toast('Added to wishlist', 'success');
      }
      UI.renderHeader();
    } catch (err) { UI.toast(err.message, 'error'); }
  }
});
