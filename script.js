// script.js traduzido e com localStorage

document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cart-btn');
  const cartCount = document.getElementById('cart-count');
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  const modal = document.getElementById('product-modal');
  const modalContent = modal.querySelector('div');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalPrice = document.getElementById('modal-price');
  const modalAddToCart = document.getElementById('modal-add-to-cart');
  const closeModalBtn = document.querySelector('.close-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  // Carrinho simples em memória
  const cart = [];

  // Função para atualizar contador com animação 'pulse'
  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = count;

    // Animação ao atualizar
    cartCount.classList.remove('animate-pulse');
    void cartCount.offsetWidth; // trigger reflow
    cartCount.classList.add('animate-pulse');

    localStorage.setItem('carrinho', JSON.stringify(cart));
  }

  // Abrir modal com animação suave
  function openModal(product) {
    currentProduct = product;
    modalTitle.textContent = product.nome;
    modalImage.src = product.imagem;
    modalPrice.textContent = `R$ ${product.preco.toFixed(2).replace('.', ',')}`;

    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('opacity-100');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');

    // Desabilitar botão adicionar para evitar múltiplos cliques
    modalAddToCart.disabled = false;
  }

  // Fechar modal com animação suave
  function closeModal() {
    modal.classList.add('opacity-0');
    modal.classList.remove('opacity-100');
    modalContent.classList.add('scale-95');
    modalContent.classList.remove('scale-100');

    // Timeout para remover pointer events após animação sumir
    setTimeout(() => {
      modal.classList.add('pointer-events-none');
    }, 300);
  }

  // --- Modal do Carrinho ---
  const cartModal = document.getElementById('cart-modal');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartModalClearBtn = document.getElementById('cart-modal-clear');
  const cartOpenBtn = document.getElementById('cart-btn');

  function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  function abrirModalCarrinho() {
    atualizarConteudoCarrinho();
    cartModal.classList.remove('opacity-0', 'pointer-events-none');
    cartModal.classList.add('opacity-100');
  }

  function fecharModalCarrinho() {
    cartModal.classList.add('opacity-0');
    cartModal.classList.remove('opacity-100');
    setTimeout(() => {
      cartModal.classList.add('pointer-events-none');
    }, 300);
  }

  function atualizarConteudoCarrinho() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
      cartTotalSpan.textContent = 'R$ 0,00';
      return;
    }

    cart.forEach((item, index) => {
      total += item.preco * item.quantidade;

      const itemHTML = `
        <div class="flex items-center gap-4 border-b border-gray-200 pb-3">
          <img src="${item.imagem}" alt="${item.nome}" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <h3 class="font-semibold text-pink-700">${item.nome}</h3>
            <p class="text-gray-600">Quantidade: ${item.quantidade}</p>
            <p class="font-semibold">${formatarPreco(item.preco * item.quantidade)}</p>
          </div>
          <button data-index="${index}" class="text-red-500 hover:text-red-700 remover-item-modal focus:outline-none">×</button>
        </div>
      `;

      cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    cartTotalSpan.textContent = formatarPreco(total);

    // Evento para remover itens no modal
    cartItemsContainer.querySelectorAll('.remover-item-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.index;
        cart.splice(idx, 1);
        localStorage.setItem('carrinho', JSON.stringify(cart));
        atualizarConteudoCarrinho();
        updateCartCount();
      });
    });
  }

  addToCartBtns.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const nome = button.dataset.name;
      const preco = parseFloat(button.dataset.price);
      const imagem = card.querySelector('img').src;
      openModal({ nome, preco, imagem });
    });
  });

  modalAddToCart.addEventListener('click', () => {
    modalAddToCart.disabled = true;

    const existingProduct = cart.find(item => item.nome === currentProduct.nome);
    if (existingProduct) {
      existingProduct.quantidade++;
    } else {
      currentProduct.quantidade = 1;
      cart.push(currentProduct);
    }
    updateCartCount();
    closeModal();
    showToast('Produto adicionado ao carrinho!');
  });

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      productCards.forEach(card => {
        const match = card.dataset.category === category || category === 'all';
        card.style.display = match ? 'block' : 'none';
      });
    });
  });

  // Função toast de notificação
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed bottom-6 right-6 bg-pink-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in-out z-50';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
    }, 2000);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Abrir e fechar modal do carrinho
  cartOpenBtn.addEventListener('click', abrirModalCarrinho);
  cartCloseBtn.addEventListener('click', fecharModalCarrinho);
  cartModal.addEventListener('click', e => {
    if (e.target === cartModal) fecharModalCarrinho();
  });

  // Botão limpar carrinho
  cartModalClearBtn.addEventListener('click', () => {
    if (confirm('Deseja realmente limpar o carrinho?')) {
      cart.length = 0;
      localStorage.setItem('carrinho', JSON.stringify(cart));
      atualizarConteudoCarrinho();
      updateCartCount();
    }
  });

  // FAQ animação abrir/fechar
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(btn => {
    btn.addEventListener('click', function() {
      const content = this.parentElement.querySelector('.faq-content');
      const arrow = this.querySelector('.faq-arrow');
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('animate-fade-in');
        arrow.textContent = '-';
      } else {
        content.classList.add('hidden');
        content.classList.remove('animate-fade-in');
        arrow.textContent = '+';
      }
    });
  });

  // Menu underline animado para página ativa
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuLinks.forEach(l => l.classList.remove('border-pink-600'));
      this.classList.add('border-pink-600');
    });
  });

  updateCartCount();
});

// --- Carrossel de produtos ---
document.addEventListener('DOMContentLoaded', () => {
  // Carrossel
  const carousel = document.getElementById('carousel');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselProducts = carouselTrack ? carouselTrack.querySelectorAll('.carousel-product') : [];
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const productsPerPage = 3;
  let carouselIndex = 0;
  let autoSlideInterval;

  function updateCarousel() {
    if (!carouselTrack || !carousel || carouselProducts.length === 0) return;
    const carouselWidth = carousel.offsetWidth;
    const productWidth = carouselWidth / productsPerPage;
    carouselProducts.forEach(prod => {
      prod.style.width = productWidth + 'px';
      prod.style.maxWidth = productWidth + 'px';
    });
    carouselTrack.style.width = (carouselProducts.length * productWidth) + 'px';
    carouselTrack.style.transform = `translateX(-${carouselIndex * carouselWidth}px)`;
  }

  function goToPage(idx) {
    const totalPages = Math.ceil(carouselProducts.length / productsPerPage);
    carouselIndex = ((idx % totalPages) + totalPages) % totalPages;
    updateCarousel();
  }

  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      goToPage(carouselIndex + 1);
    }, 5000); // 5 segundos
  }

  if (prevBtn && nextBtn && carouselProducts.length > 0) {
    prevBtn.addEventListener('click', () => {
      goToPage(carouselIndex - 1);
      startAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
      goToPage(carouselIndex + 1);
      startAutoSlide();
    });
    window.addEventListener('resize', updateCarousel);
    goToPage(0);
    startAutoSlide();
  } else if (carouselProducts.length > 0) {
    // Mesmo sem botões, inicia o autoslide
    goToPage(0);
    startAutoSlide();
  }
});
