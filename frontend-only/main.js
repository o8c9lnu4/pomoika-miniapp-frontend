const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
}

const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) ? window.APP_CONFIG.API_BASE : '';

async function fetchJSON(path){
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const r = await fetch(url);
  if(!r.ok) throw new Error('HTTP '+r.status);
  return r.json();
}

const catsEl = document.getElementById('cats');
const itemsEl = document.getElementById('items');
const searchEl = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');

let allItems = [];
let activeCat = null;
let cart = [];

function updateCartDisplay(){
  const count = cart.length;
  const total = cart.reduce((s,i)=> s + i.price, 0);
  
  cartCountEl.textContent = count;
  cartTotalEl.textContent = `${total.toFixed(0)} ₽`;
  checkoutBtn.disabled = count === 0;
}

function renderCats(cats){
  catsEl.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.textContent = 'Все';
  allBtn.className = activeCat===null ? 'active' : '';
  allBtn.onclick = ()=>{ activeCat=null; render(); };
  catsEl.appendChild(allBtn);
  for(const c of cats){
    const b = document.createElement('button');
    b.textContent = c;
    b.className = activeCat===c ? 'active' : '';
    b.onclick = ()=>{ activeCat=c; render(); };
    catsEl.appendChild(b);
  }
}

function render(){
  const q = searchEl.value.trim().toLowerCase();
  itemsEl.innerHTML = '';
  let items = allItems;
  if(activeCat){ items = items.filter(i=>i.category===activeCat); }
  if(q){ items = items.filter(i=> i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)); }
  for(const i of items){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">${i.title}</div>
      <div class="price">${i.price.toFixed(0)} ₽</div>
      <div class="desc">${i.description}</div>
      <button class="add">В корзину</button>
    `;
    card.querySelector('.add').addEventListener('click', ()=>{
      cart.push(i);
      updateCartDisplay();
      
      // Анимация добавления
      const button = card.querySelector('.add');
      button.textContent = '✓ Добавлено';
      button.style.background = '#00d4aa';
      setTimeout(() => {
        button.textContent = 'В корзину';
        button.style.background = '';
      }, 1000);
    });
    itemsEl.appendChild(card);
  }
}

function checkout(){
  if(cart.length === 0) return;
  
  const total = cart.reduce((s,i)=> s + i.price, 0);
  const order = {
    items: cart.map(i=>({ id: i.id, title: i.title, price: i.price, category: i.category })),
    total
  };
  
  if(tg){
    tg.sendData(JSON.stringify(order));
    tg.close();
  } else {
    console.log('Заказ:', order);
    alert('Заказ отправлен!');
    cart = [];
    updateCartDisplay();
  }
}

async function init(){
  const cats = await fetchJSON('/api/categories');
  allItems = await fetchJSON('/api/items');
  renderCats(cats);
  render();
  updateCartDisplay();
  
  checkoutBtn.addEventListener('click', checkout);
}

searchEl.addEventListener('input', render);

init().catch(e=>{
  console.error('Init error:', e);
  itemsEl.innerHTML = `
    <div style="text-align:center;padding:20px;color:var(--muted)">
      <div>Ошибка загрузки каталога</div>
      <div style="font-size:12px;margin-top:8px">Проверьте API_BASE в config.js</div>
    </div>
  `;
});


