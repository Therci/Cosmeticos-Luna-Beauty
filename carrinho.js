// carrinho.js

document.addEventListener('DOMContentLoaded', () => {
  const carrinhoItens = document.getElementById('carrinho-itens');
  const totalGeral = document.getElementById('total-geral');
  const btnFinalizar = document.querySelector('button');

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  function renderizarCarrinho() {
    carrinhoItens.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
      carrinhoItens.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
      totalGeral.textContent = 'R$ 0,00';
      btnFinalizar.disabled = true;
      btnFinalizar.classList.add('opacity-50', 'cursor-not-allowed');
      return;
    } else {
      btnFinalizar.disabled = false;
      btnFinalizar.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    carrinho.forEach((item, index) => {
      total += item.preco * item.quantidade;

      const itemHTML = `
        <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div class="flex items-center gap-4">
            <img src="${item.imagem}" alt="${item.nome}" class="w-20 h-20 object-cover rounded">
            <div>
              <h3 class="text-lg font-semibold text-pink-700">${item.nome}</h3>
              <p class="text-gray-600">${formatarPreco(item.preco)}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <input type="number" min="1" value="${item.quantidade}" data-index="${index}" class="quantidade-input border rounded w-16 p-1 text-center" />
            <button data-index="${index}" class="remover-item text-red-500 hover:text-red-700">Remover</button>
          </div>
        </div>
      `;

      carrinhoItens.insertAdjacentHTML('beforeend', itemHTML);
    });

    totalGeral.textContent = formatarPreco(total);

    // Event listeners para remover itens
    document.querySelectorAll('.remover-item').forEach(botao => {
      botao.addEventListener('click', () => {
        const indice = botao.dataset.index;
        carrinho.splice(indice, 1);
        salvarCarrinho();
        renderizarCarrinho();
      });
    });

    // Event listeners para mudar quantidade
    document.querySelectorAll('.quantidade-input').forEach(input => {
      input.addEventListener('change', () => {
        const indice = input.dataset.index;
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) {
          val = 1;
          input.value = val;
        }
        carrinho[indice].quantidade = val;
        salvarCarrinho();
        renderizarCarrinho();
      });
    });
  }

  btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    alert('Obrigado pela compra! Em breve entraremos em contato.');
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
  });

  renderizarCarrinho();
});
