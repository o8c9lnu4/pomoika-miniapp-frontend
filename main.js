const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.MainButton.setText('Оформить заказ');
  tg.MainButton.hide();
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

let allItems = [];
let activeCat = null;
let cart = [];

function updateMainButton(){
  if(!tg) return;
  const total = cart.reduce((s,i)=> s + i.price, 0);
  const count = cart.length;
  if(count === 0){ tg.MainButton.hide(); return; }
  tg.MainButton.setText(`Заказ (${count}) • ${total.toFixed(2)} ₽`);
  tg.MainButton.show();
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
      <div class="price">${i.price.toFixed(2)} ₽</div>
      <div class="desc">${i.description}</div>
      <button class="add">В корзину</button>
    `;
    card.querySelector('.add').addEventListener('click', ()=>{
      cart.push(i);
      updateMainButton();
    });
    itemsEl.appendChild(card);
  }
}

async function init(){
  const cats = await fetchJSON('/api/categories');
  allItems = await fetchJSON('/api/items');
  renderCats(cats);
  render();
  if(tg){
    tg.MainButton.onClick(()=>{
      const total = cart.reduce((s,i)=> s + i.price, 0);
      const order = {
        items: cart.map(i=>({ id: i.id, title: i.title, price: i.price, category: i.category })),
        total
      };
      tg.sendData(JSON.stringify(order));
    });
  }
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


