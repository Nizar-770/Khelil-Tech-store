// ============================================================
// CONFIG — Google Sheets URL hardcoded
// ============================================================
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxEF2bFjJz0HANkbM7H_IyeRQ87Tcgbp1uEKd_1U81dpb-vJnyHtr_eFRVmX_6qg-KC/exec';

function getWaNumber() {
  return (localStorage.getItem('kt-wa') || '213558455695').replace(/\D/g,'');
}

// ============================================================
// DATA
// ============================================================
const WILAYAS = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet','El M\'Ghair','El Meniaa'];

const CATS = [
  {name:'Gaming PCs',icon:'🖥️',count:142},
  {name:'Laptops',icon:'💻',count:89},
  {name:'Smartphones',icon:'📱',count:210},
  {name:'Monitors',icon:'🖵',count:56},
  {name:'Keyboards',icon:'⌨️',count:78},
  {name:'Mice',icon:'🖱️',count:65},
  {name:'Headsets',icon:'🎧',count:45},
  {name:'Components',icon:'🔧',count:320},
  {name:'Accessories',icon:'🎮',count:190},
];

// ============================================================
// PRODUCTS — img: 'images/nom.jpg' اختياري، إذا ماكانش يرجع للـ icon
// ============================================================
const PRODS = [
  {
    id:1, name:'RTX 4090 Gaming Beast Pro', brand:'Custom Build', cat:'Gaming PCs',
    price:299000, orig:380000,
    icon:'🖥️',
    img:'images/rtx4090-beast.jpg',       // ← صورة اختيارية
    flag:'HOT', rating:4.9, reviews:128, stock:true,
    desc:'Ultimate gaming powerhouse with Intel Core i9-14900K, 64GB DDR5 RAM, 2TB NVMe SSD, and NVIDIA RTX 4090 24GB. Ready for 4K gaming at maximum settings on every title.',
    specs:{CPU:'Intel Core i9-14900K',RAM:'64GB DDR5 6000MHz',GPU:'NVIDIA RTX 4090 24GB',Storage:'2TB Samsung 990 Pro NVMe',PSU:'1000W 80+ Gold',Case:'Lian Li PC-O11D'}
  },
  {
    id:2, name:'ASUS ROG Zephyrus G16', brand:'ASUS', cat:'Laptops',
    price:195000, orig:225000,
    icon:'💻',
    img:'images/asus-rog-zephyrus.jpg',
    flag:'NEW', rating:4.8, reviews:64, stock:true,
    desc:'The ultimate gaming laptop with RTX 4080, Core i9, 240Hz WQHD display, and 90Wh battery for all-day gaming sessions.',
    specs:{CPU:'Intel Core i9-13980HX',RAM:'32GB DDR5',GPU:'RTX 4080 16GB',Display:'16" QHD+ 240Hz',Storage:'1TB NVMe SSD',Battery:'90Wh'}
  },
  {
    id:3, name:'iPhone 15 Pro Max 512GB', brand:'Apple', cat:'Smartphones',
    price:178000, orig:198000,
    icon:'📱',
    img:'images/iphone15-pro-max.jpg',
    flag:'SALE', rating:4.9, reviews:312, stock:true,
    desc:'The most powerful iPhone ever with A17 Pro chip, titanium design, and 48MP camera system with 5x optical zoom.',
    specs:{Chip:'Apple A17 Pro',RAM:'8GB',Storage:'512GB',Display:'6.7" Super Retina XDR',Camera:'48MP + 12MP + 12MP',Battery:'4422mAh'}
  },
  {
    id:4, name:'Samsung Galaxy S24 Ultra', brand:'Samsung', cat:'Smartphones',
    price:142000, orig:162000,
    icon:'📱',
    img:'images/samsung-s24-ultra.jpg',
    flag:'NEW', rating:4.7, reviews:189, stock:true,
    desc:'Galaxy AI on the most powerful Galaxy ever. 200MP camera system with titanium frame and built-in S Pen.',
    specs:{Chip:'Snapdragon 8 Gen 3',RAM:'12GB',Storage:'256GB',Display:'6.8" Dynamic AMOLED 2X',Camera:'200MP+50MP+10MP+12MP',Battery:'5000mAh'}
  },
  {
    id:5, name:'MacBook Pro M3 Max 16"', brand:'Apple', cat:'Laptops',
    price:265000, orig:290000,
    icon:'💻',
    img:'images/macbook-pro-m3-max.jpg',
    flag:'HOT', rating:5.0, reviews:97, stock:true,
    desc:'The most powerful MacBook Pro ever with M3 Max chip. Extraordinary performance for creatives and professionals.',
    specs:{Chip:'Apple M3 Max',RAM:'48GB Unified',Storage:'1TB SSD',Display:'16.2" Liquid Retina XDR',Battery:'100Wh',Ports:'3x Thunderbolt 4, HDMI, SD'}
  },
  {
    id:6, name:'LG UltraGear 27" 4K 144Hz', brand:'LG', cat:'Monitors',
    price:52000, orig:64000,
    icon:'🖵',
    img:'images/lg-ultragear-27.jpg',
    flag:'SALE', rating:4.6, reviews:78, stock:true,
    desc:'IPS 4K gaming monitor with 144Hz refresh rate, G-Sync compatible, and 1ms GtG response time for ultra-smooth gaming.',
    specs:{Size:'27 inch',Resolution:'3840x2160 (4K)',Panel:'Nano IPS',Refresh:'144Hz',Response:'1ms GtG',Connectors:'2x HDMI 2.1, DisplayPort 1.4'}
  },
  {
    id:7, name:'HyperX Alloy Origins 65', brand:'HyperX', cat:'Keyboards',
    price:8900, orig:11000,
    icon:'⌨️',
    img:'images/hyperx-alloy-65.jpg',
    flag:'NEW', rating:4.5, reviews:156, stock:true,
    desc:'Compact 65% mechanical gaming keyboard with HyperX Red linear switches and per-key RGB backlight.',
    specs:{Layout:'65% Compact',Switches:'HyperX Red Linear',Backlight:'Per-key RGB',Cable:'Detachable USB-C',Build:'Aluminum top frame',Profile:'Low-profile'}
  },
  {
    id:8, name:'Logitech G Pro X Superlight 2', brand:'Logitech', cat:'Mice',
    price:9800, orig:12000,
    icon:'🖱️',
    img:'images/logitech-gpro-superlight2.jpg',
    flag:'HOT', rating:4.9, reviews:234, stock:true,
    desc:'Under 60g with HERO 2 sensor delivering flawless tracking at any speed. Preferred by pro esports players worldwide.',
    specs:{Sensor:'HERO 2 25600 DPI',Weight:'< 60g',Buttons:'5',Battery:'95 hours',Connectivity:'LIGHTSPEED Wireless',Shape:'Symmetrical'}
  },
  {
    id:9, name:'Sony WH-1000XM5', brand:'Sony', cat:'Headsets',
    price:24500, orig:30000,
    icon:'🎧',
    img:'images/sony-wh1000xm5.jpg',
    flag:'SALE', rating:4.8, reviews:445, stock:true,
    desc:'Industry-leading noise cancellation with 30-hour battery, multipoint connection, and premium sound quality.',
    specs:{Driver:'30mm',Frequency:'4Hz-40,000Hz',ANC:'Auto Optimizing',Battery:'30 hours',Charging:'USB-C fast charge',Weight:'250g'}
  },
  {
    id:10, name:'RTX 4070 Ti Gaming OC', brand:'ASUS', cat:'Components',
    price:68000, orig:78000,
    icon:'🔧',
    img:'images/rtx4070ti-asus.jpg',
    flag:'NEW', rating:4.7, reviews:89, stock:true,
    desc:'ASUS TUF Gaming RTX 4070 Ti OC Edition with military-grade capacitors for extreme stability during long sessions.',
    specs:{VRAM:'12GB GDDR6X',Base:'2310 MHz',Boost:'2760 MHz',Power:'285W TDP',Connectors:'3x DP 1.4a, HDMI 2.1',Cooling:'Triple Fan'}
  },
  {
    id:11, name:'Razer BlackWidow V4 Pro', brand:'Razer', cat:'Keyboards',
    price:14500, orig:17000,
    icon:'⌨️',
    img:'images/razer-blackwidow-v4.jpg',
    flag:'', rating:4.6, reviews:67, stock:true,
    desc:'Full-size wireless gaming keyboard with Razer Yellow switches, Chroma RGB, and 200-hour battery life.',
    specs:{Layout:'Full Size',Switches:'Razer Yellow Linear',Wireless:'2.4GHz + Bluetooth',Battery:'200 hours',Backlight:'Chroma RGB',Build:'Aluminum alloy'}
  },
  {
    id:12, name:'Xiaomi 14 Pro 256GB', brand:'Xiaomi', cat:'Smartphones',
    price:88000, orig:98000,
    icon:'📱',
    img:'images/xiaomi-14-pro.jpg',
    flag:'NEW', rating:4.5, reviews:123, stock:false,
    desc:'Leica co-engineered cameras with Snapdragon 8 Gen 3 and 120W HyperCharge technology.',
    specs:{Chip:'Snapdragon 8 Gen 3',RAM:'12GB',Storage:'256GB',Display:'6.73" LTPO AMOLED 120Hz',Camera:'Leica 50MP + 50MP + 50MP',Charging:'120W HyperCharge'}
  },
  {
    id:13, name:'wiiiiw', brand:'Xiaomi', cat:'Smartphones',
    price:88000, orig:98000,
    icon:'📱',
    img:'',                               // ← فارغ = يرجع للـ emoji تلقائياً
    flag:'HOT', rating:4.5, reviews:123, stock:false,
    desc:'Leica co-engineered cameras with Snapdragon 8 Gen 3 and 120W HyperCharge technology.',
    specs:{Chip:'Snapdragon 8 Gen 3',RAM:'12GB',Storage:'256GB',Display:'6.73" LTPO AMOLED 120Hz',Camera:'Leica 50MP + 50MP + 50MP',Charging:'120W HyperCharge'}
  },
  {
    id:14,name:'LENOVO YOGA BOOK 9I',brand:'LENOVO',cat:'Laptops',
    price:280000,orig:300000,
    icon:'', // ← رابط صورة خارجي
    imgs:['images/download.jpg','images/l2.jpg','images/L3.jpg','images/L4.jpg'],
    flag:'HOT', rating:4.5, reviews:123, stock:true,
    desc:'The world’s first full dual-screen OLED, multi-mode laptopTwo stunning 13.3″ PureSight OLED displays for versatile usePowered by 13th Gen Intel® Core™ processors and the Intel® Evo™ platformDetachable Bluetooth™ keyboard, stylus pen, & folio stand includedCarbon-neutral construction & eco-friendly packagingLimitless possibilities & incredible entertainment with Dolby Atmos® & Bowers & Wilkins speakers',
    specs:{CPU:'13th Gen Intel® Core™ i7',RAM:'16GB LPDDR5',GPU:'Intel® Iris® Xe Graphics',Storage:'1TB PCIe SSD',Display:'2x 13.3" PureSight OLED 4K',Battery:'15 hours',Weight:'1.5kg'}
  },
];

// ============================================================
// HELPER — يعرض الصورة أو الـ emoji كـ fallback
// ============================================================
function prodMedia(p, size = 'card') {
  // Support both p.img (string) and p.imgs (array) — use first image available
  const imgSrc = p.img || (Array.isArray(p.imgs) && p.imgs.length ? p.imgs[0] : '');
  if (imgSrc) {
    const styles = size === 'card'
      ? 'width:100%;height:100%;object-fit:contain;position:relative;z-index:1;'
      : 'max-width:100%;max-height:340px;object-fit:contain;display:block;margin:auto;';
    return `<img
      src="${imgSrc}"
      alt="${p.name}"
      style="${styles}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
    /><span style="display:none;font-size:${size==='card'?'64px':'120px'};position:relative;z-index:1;">${p.icon}</span>`;
  }
  return `<span style="font-size:${size==='card'?'64px':'120px'};position:relative;z-index:1;">${p.icon}</span>`;
}

// ============================================================
// STATE
// ============================================================
let cart     = JSON.parse(localStorage.getItem('kt-cart')  || '[]');
let wishlist = JSON.parse(localStorage.getItem('kt-wish')  || '[]');
let orders   = JSON.parse(localStorage.getItem('kt-orders')|| '[]');
let selDlv   = 'home';
let dlvCost  = 700;
let discAmt  = 0;
let activeCat = 'All';
let curProd   = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderCats();
  renderFlash();
  renderTrending();
  fillWilayas();
  updateUI();
  startCd();
  initNavScroll();
  initShop();
  renderAdm();
  setInterval(rotHeroIco, 3000);
  const waEl = document.getElementById('wa-number');
  if (waEl && localStorage.getItem('kt-wa')) waEl.value = localStorage.getItem('kt-wa');

  // تحميل الصفحة الصحيحة من الـ URL عند الفتح
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const parts = hash.split('/');
    const page = parts[0];
    const cat = parts[1] ? decodeURIComponent(parts[1]) : '';
    nav(page, cat, false);
  } else {
    // حفظ الصفحة الرئيسية كنقطة بداية
    history.replaceState({ page: 'home', cat: '' }, '', '#home');
  }
});

// ============================================================
// NAVIGATION
// ============================================================
function nav(page, cat = '', pushToHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (!pg) return;
  pg.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (page === 'shop') {
    activeCat = cat || 'All';
    document.getElementById('shop-title').textContent = cat ? cat.toUpperCase() : 'ALL PRODUCTS';
    filterProds();
    syncFilterBtns();
  }
  if (page === 'checkout') renderCheckout();
  if (page === 'wishlist') renderWishPage();
  if (page === 'admin')    renderAdm();

  // حفظ الصفحة الحالية في تاريخ المتصفح
  if (pushToHistory) {
    const state = { page, cat };
    const url = '#' + page + (cat ? '/' + encodeURIComponent(cat) : '');
    history.pushState(state, '', url);
  }
}

// الرجوع للصفحة السابقة بزر Back
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.page) {
    nav(event.state.page, event.state.cat || '', false);
  } else {
    // إذا ما كان فيه state نرجعو للصفحة الرئيسية
    nav('home', '', false);
  }
});

// ============================================================
// CATEGORIES
// ============================================================
function renderCats() {
  const g = document.getElementById('cats-grid');
  if (!g) return;
  g.innerHTML = CATS.map(c => `
    <div class="cat-card" onclick="nav('shop','${c.name}')">
      <span class="cat-icon">${c.icon}</span>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count}</div>
    </div>`).join('');
}

// ============================================================
// PRODUCT CARD — يعرض الصورة إذا كانت موجودة
// ============================================================
function prodCard(p) {
  const inW = wishlist.includes(p.id);
  const fc  = p.flag === 'SALE' ? 'f-sale' : p.flag === 'NEW' ? 'f-new' : 'f-hot';
  return `
    <div class="prod-card" onclick="openProd(${p.id})">
      <div class="prod-img">
        ${p.flag ? `<div class="prod-flag ${fc}">${p.flag}</div>` : ''}
        <div class="prod-wish ${inW ? 'on' : ''}" onclick="event.stopPropagation();toggleWish(${p.id})">♥</div>
        ${prodMedia(p, 'card')}
      </div>
      <div class="prod-body">
        <div class="prod-brand">${p.brand}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-stars">
          <span class="stars-g">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '☆' : ''}</span>
          <span class="rev-c">(${p.reviews})</span>
        </div>
        <div class="prod-foot">
          <div>
            <div class="prod-price">${p.price.toLocaleString('fr-DZ')} DA</div>
            ${p.orig ? `<div class="prod-orig">${p.orig.toLocaleString('fr-DZ')} DA</div>` : ''}
          </div>
          <button class="prod-add" onclick="event.stopPropagation();addCart(${p.id})">+ CART</button>
        </div>
      </div>
    </div>`;
}

function renderFlash() {
  const el = document.getElementById('flash-prods');
  if (!el) return;
  el.innerHTML = PRODS.filter(p => p.flag === 'SALE' || p.flag === 'HOT').slice(0, 4).map(prodCard).join('');
}

function renderTrending() {
  const el = document.getElementById('trending-prods');
  if (!el) return;
  el.innerHTML = [...PRODS].sort((a, b) => b.rating - a.rating).slice(0, 8).map(prodCard).join('');
}

// ============================================================
// SHOP PAGE
// ============================================================
function initShop() {
  const bar = document.getElementById('filters-bar');
  if (!bar) return;
  const cats = ['All', ...CATS.map(c => c.name)];
  bar.innerHTML = cats.map(c => `<button class="filter-pill ${c === 'All' ? 'on' : ''}" onclick="setCat('${c}')">${c}</button>`).join('') +
    `<select class="sort-sel" onchange="filterProds()"><option>Sort: Featured</option><option>Price: Low→High</option><option>Price: High→Low</option><option>Rating</option></select>`;
  filterProds();
}

function setCat(cat) {
  activeCat = cat;
  syncFilterBtns();
  filterProds();
}

function syncFilterBtns() {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('on', b.textContent === activeCat));
}

function filterProds() {
  const q  = (document.getElementById('shop-srch') || {}).value || '';
  const ql = q.toLowerCase();
  let list  = PRODS;
  if (activeCat && activeCat !== 'All') list = list.filter(p => p.cat === activeCat);
  if (ql) list = list.filter(p => p.name.toLowerCase().includes(ql) || p.brand.toLowerCase().includes(ql) || p.cat.toLowerCase().includes(ql));
  const sel = document.querySelector('.sort-sel');
  if (sel) {
    if      (sel.value.includes('Low→High'))  list = [...list].sort((a, b) => a.price - b.price);
    else if (sel.value.includes('High→Low'))  list = [...list].sort((a, b) => b.price - a.price);
    else if (sel.value.includes('Rating'))    list = [...list].sort((a, b) => b.rating - a.rating);
  }
  const grid = document.getElementById('shop-grid');
  const lbl  = document.getElementById('prod-count');
  if (grid) grid.innerHTML = list.length ? list.map(prodCard).join('') : '<div style="text-align:center;padding:60px;color:var(--text3);grid-column:1/-1;">No products found</div>';
  if (lbl)  lbl.textContent = `${list.length} products`;
}

function goSearch() {
  nav('shop');
  setTimeout(() => { const s = document.getElementById('shop-srch'); if (s) s.focus(); }, 200);
}

// ============================================================
// PRODUCT DETAIL — gallery بالصورة الحقيقية
// ============================================================
function openProd(id) {
  const p = PRODS.find(x => x.id === id);
  if (!p) return;
  curProd = p;
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;

  // بناء الـ gallery: support both p.img (string) and p.imgs (array)
  const galleryImgs = Array.isArray(p.imgs) && p.imgs.length
    ? p.imgs
    : p.img ? [p.img] : [];

  const firstImg = galleryImgs[0] || '';

  const mainMedia = firstImg
    ? `<img
        src="${firstImg}"
        alt="${p.name}"
        id="det-main-img-el"
        style="max-width:100%;max-height:340px;object-fit:contain;display:block;margin:auto;"
        onerror="this.style.display='none';document.getElementById('det-main-icon').style.display='block';"
      /><span id="det-main-icon" style="display:none;font-size:120px;">${p.icon}</span>`
    : `<span style="font-size:120px;">${p.icon}</span>`;

  // Build thumbs from actual gallery images, pad to 4 if needed
  const thumbImgs = [...galleryImgs];
  while (thumbImgs.length < 4) thumbImgs.push(firstImg || '');
  const thumbs = thumbImgs.slice(0, 4).map((src, i) => `
    <div class="det-thumb ${i === 0 ? 'on' : ''}" onclick="switchDetImg('${src}',this)">
      ${src
        ? `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;" onerror="this.outerHTML='<span>${p.icon}</span>'">`
        : p.icon
      }
    </div>`).join('');

  document.getElementById('det-content').innerHTML = `
    <div class="back-link" onclick="nav('shop')">← Back</div>
    <div class="det-grid">
      <div class="det-gallery">
        <div class="det-main-img">${mainMedia}</div>
        <div class="det-thumbs">${thumbs}</div>
      </div>
      <div>
        <div class="det-brand">${p.brand}</div>
        <h1 class="det-h1">${p.name}</h1>
        <div class="det-rating">
          <span style="color:#F5C842;font-size:16px">${'★'.repeat(Math.floor(p.rating))}</span>
          <span style="color:var(--text2);font-size:13px;margin-left:6px;">${p.rating} · ${p.reviews} reviews</span>
        </div>
        <div class="${p.stock ? 'stk-badge in-stk' : 'stk-badge out-stk'}">${p.stock ? '✅ In Stock' : '❌ Out of Stock'}</div>
        <div class="det-price-row">
          <span class="det-price">${p.price.toLocaleString('fr-DZ')} DA</span>
          ${p.orig ? `<span class="det-orig">${p.orig.toLocaleString('fr-DZ')} DA</span><span class="det-disc">-${disc}%</span>` : ''}
        </div>
        <p class="det-desc">${p.desc}</p>
        <div class="det-specs">
          ${Object.entries(p.specs).map(([k, v]) => `<div class="spec-r"><span class="spec-k">${k}</span><span class="spec-v">${v}</span></div>`).join('')}
        </div>
        <div class="qty-row">
          <span class="qty-lbl">Qty:</span>
          <div class="qty-ctrl">
            <button class="qty-b" onclick="chgQty(-1)">−</button>
            <input class="qty-n" type="number" value="1" min="1" id="det-qty" readonly/>
            <button class="qty-b" onclick="chgQty(1)">+</button>
          </div>
        </div>
        <div class="det-btns">
          <button class="btn-prime" onclick="addFromDet()" ${!p.stock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>🛒 ADD TO CART</button>
          <button class="btn-wa" onclick="waProd(${p.id})">📱 WhatsApp</button>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn-ghost" style="flex:1;padding:12px;" onclick="toggleWish(${p.id})">♥ WISHLIST</button>
          <button class="btn-prime" style="flex:1;padding:12px;" onclick="buyNow(${p.id})" ${!p.stock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>⚡ BUY NOW</button>
        </div>
      </div>
    </div>
    <div style="margin-top:60px;">
      <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:22px;">RELATED PRODUCTS</h2>
      <div class="prods-grid">${PRODS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(prodCard).join('')}</div>
    </div>`;
  nav('product');
}

function switchDetImg(src, thumbEl) {
  const mainImg = document.getElementById('det-main-img-el');
  if (mainImg && src) { mainImg.src = src; mainImg.style.display = 'block'; }
  document.querySelectorAll('.det-thumb').forEach(t => t.classList.remove('on'));
  if (thumbEl) thumbEl.classList.add('on');
}

function chgQty(d) {
  const el = document.getElementById('det-qty');
  if (!el) return;
  el.value = Math.max(1, parseInt(el.value) + d);
}

function addFromDet() {
  if (!curProd) return;
  const qty = parseInt(document.getElementById('det-qty').value) || 1;
  for (let i = 0; i < qty; i++) addCart(curProd.id);
}

function buyNow(id) { addCart(id); nav('checkout'); }

// ============================================================
// CART
// ============================================================
function addCart(id) {
  const p = PRODS.find(x => x.id === id);
  if (!p || !p.stock) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateUI();
  toast(`${p.name.slice(0, 28)}... added to cart 🛒`, 'ok');
}

function rmCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateUI();
}

function chgCartQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + d);
  saveCart();
  updateUI();
}

function saveCart() { localStorage.setItem('kt-cart', JSON.stringify(cart)); }

function cartTotal() {
  return cart.reduce((s, item) => {
    const p = PRODS.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
}

function updateUI() {
  const cnt = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-badge').textContent = cnt;
  const wb = document.getElementById('wish-badge');
  if (wishlist.length > 0) { wb.style.display = 'flex'; wb.textContent = wishlist.length; }
  else wb.style.display = 'none';
  renderCartPanel();
}

function renderCartPanel() {
  const list = document.getElementById('cart-list');
  const ft   = document.getElementById('cart-ft');
  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = `<div class="empty-cart"><span class="ec-icon">🛒</span><p>Your cart is empty</p><button class="btn-prime" style="margin-top:16px;padding:12px 24px;font-size:12px;" onclick="closeCart();nav('shop')">SHOP NOW</button></div>`;
    ft.innerHTML = '';
    return;
  }
  list.innerHTML = cart.map(item => {
    const p = PRODS.find(x => x.id === item.id);
    if (!p) return '';
    // الصورة في السلة كذلك
    const thumb = p.img
      ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;" onerror="this.outerHTML='<span style=font-size:28px>${p.icon}</span>'">`
      : `<span style="font-size:28px;">${p.icon}</span>`;
    return `<div class="cart-item">
      <div class="ci-img">${thumb}</div>
      <div class="ci-info">
        <div class="ci-name">${p.name}</div>
        <div class="ci-price">${(p.price * item.qty).toLocaleString('fr-DZ')} DA</div>
        <div class="ci-row">
          <button class="ci-qb" onclick="chgCartQty(${p.id},-1)">−</button>
          <span class="ci-q">${item.qty}</span>
          <button class="ci-qb" onclick="chgCartQty(${p.id},1)">+</button>
          <button class="ci-del" onclick="rmCart(${p.id})">🗑</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const total = cartTotal();
  ft.innerHTML = `
    <div class="cart-line"><span>Subtotal</span><span>${total.toLocaleString('fr-DZ')} DA</span></div>
    <div class="cart-line"><span>Delivery</span><span>From 400 DA</span></div>
    <div class="cart-total-row"><span>Est. Total</span><span class="amt">${total.toLocaleString('fr-DZ')} DA</span></div>
    <button class="btn-prime" style="width:100%;padding:14px;" onclick="closeCart();nav('checkout')">CHECKOUT →</button>
    <button class="btn-ghost" style="width:100%;padding:12px;margin-top:8px;" onclick="closeCart()">CONTINUE SHOPPING</button>`;
}

function openCart()  { document.getElementById('cart-panel').classList.add('open');    document.getElementById('cart-ov').classList.add('on'); }
function closeCart() { document.getElementById('cart-panel').classList.remove('open'); document.getElementById('cart-ov').classList.remove('on'); }

// ============================================================
// WISHLIST
// ============================================================
function toggleWish(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  localStorage.setItem('kt-wish', JSON.stringify(wishlist));
  updateUI();
  toast(wishlist.includes(id) ? 'Added to wishlist ❤️' : 'Removed from wishlist', 'info');
}

function renderWishPage() {
  const grid  = document.getElementById('wish-grid');
  const empty = document.getElementById('wish-empty');
  const lbl   = document.getElementById('wish-count-lbl');
  const items = PRODS.filter(p => wishlist.includes(p.id));
  if (lbl) lbl.textContent = `(${items.length})`;
  if (items.length === 0) { grid.innerHTML = ''; empty.style.display = 'block'; }
  else { empty.style.display = 'none'; grid.innerHTML = items.map(prodCard).join(''); }
}

// ============================================================
// CHECKOUT
// ============================================================
function fillWilayas() {
  const sel = document.getElementById('f-wilaya');
  if (!sel) return;
  WILAYAS.forEach(w => { const o = document.createElement('option'); o.value = w; o.textContent = w; sel.appendChild(o); });
}

function selDel(type) {
  selDlv  = type;
  dlvCost = type === 'home' ? 700 : 450;
  document.querySelectorAll('.del-opt').forEach(el => el.classList.remove('sel'));
  document.getElementById('opt-' + type).classList.add('sel');
  calcTotals();
}

function renderCheckout() {
  const cont = document.getElementById('co-items-list');
  if (!cont) return;
  cont.innerHTML = cart.map(item => {
    const p = PRODS.find(x => x.id === item.id);
    if (!p) return '';
    return `<div class="sum-item">
      <span class="sum-item-n">${p.icon} ${p.name.slice(0, 30)} ×${item.qty}</span>
      <span class="sum-item-p">${(p.price * item.qty).toLocaleString('fr-DZ')} DA</span>
    </div>`;
  }).join('');
  calcTotals();
}

function calcTotals() {
  const sub   = cartTotal();
  const total = sub + dlvCost - discAmt;
  const fmt   = n => n.toLocaleString('fr-DZ') + ' DA';
  const el    = id => document.getElementById(id);
  if (el('s-sub'))      el('s-sub').textContent      = fmt(sub);
  if (el('s-del'))      el('s-del').textContent      = fmt(dlvCost);
  if (el('s-disc'))     el('s-disc').textContent     = '-' + fmt(discAmt);
  if (el('s-disc-row')) el('s-disc-row').style.display = discAmt > 0 ? 'flex' : 'none';
  if (el('s-total'))    el('s-total').textContent    = fmt(total);
}

function applyPromo() {
  const code = (document.getElementById('promo-code') || {}).value || '';
  const sub  = cartTotal();
  if      (code.toUpperCase() === 'KHELIL10') { discAmt = Math.round(sub * 0.10); toast('10% discount applied! 🎉', 'ok'); }
  else if (code.toUpperCase() === 'KHELIL20') { discAmt = Math.round(sub * 0.20); toast('20% discount applied! 🎉', 'ok'); }
  else if (code.toUpperCase() === 'KHELIL5')  { discAmt = Math.round(sub * 0.05); toast('5% discount applied! 🎉',  'ok'); }
  else { toast('Invalid promo code ❌', 'err'); }
  calcTotals();
}

// ============================================================
// VALIDATION
// ============================================================
function validate() {
  const fields = [
    {id:'f-fname',   lbl:'First Name'},
    {id:'f-lname',   lbl:'Last Name'},
    {id:'f-phone',   lbl:'Phone Number'},
    {id:'f-wilaya',  lbl:'Wilaya'},
    {id:'f-commune', lbl:'Commune'},
    {id:'f-address', lbl:'Address'},
  ];
  let ok = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    if (!el.value.trim()) {
      el.classList.add('err');
      el.addEventListener('input', () => el.classList.remove('err'), { once: true });
      ok = false;
    }
  });
  if (!ok) { toast('Please fill all required fields ⚠️', 'err'); return false; }
  const phone = document.getElementById('f-phone').value.trim();
  if (!/^(0|\+213)[5-7]\d{8}$/.test(phone.replace(/\s/g, ''))) {
    toast('Please enter a valid Algerian phone number', 'err');
    document.getElementById('f-phone').classList.add('err');
    return false;
  }
  if (cart.length === 0) { toast('Your cart is empty', 'err'); return false; }
  return true;
}

// ============================================================
// ORDER PLACEMENT
// ============================================================
async function placeOrder() {
  if (!validate()) return;

  const now     = new Date();
  const lastNum = parseInt(localStorage.getItem('kt-last-order-num') || '0') + 1;
  localStorage.setItem('kt-last-order-num', String(lastNum));
  const orderId = 'KT-' + String(lastNum).padStart(5, '0');

  const fname   = document.getElementById('f-fname').value.trim();
  const lname   = document.getElementById('f-lname').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const wilaya  = document.getElementById('f-wilaya').value;
  const commune = document.getElementById('f-commune').value.trim();
  const address = document.getElementById('f-address').value.trim();
  const notes   = document.getElementById('f-notes').value.trim();
  const sub     = cartTotal();
  const total   = sub + dlvCost - discAmt;

  const productsList = cart.map(item => {
    const p = PRODS.find(x => x.id === item.id);
    return p ? `${p.name} x${item.qty}` : '';
  }).filter(Boolean).join(' | ');

  const totalQty = cart.reduce((s, item) => s + item.qty, 0);

  const orderData = {
    // — keys internes (CSV export, localStorage, etc.)
    orderId,
    date:         now.toLocaleDateString('fr-DZ'),
    time:         now.toLocaleTimeString('fr-DZ'),
    firstName:    fname,
    lastName:     lname,
    phone,
    email:        email || '—',
    wilaya,
    commune,
    address,
    deliveryType: selDlv === 'home' ? 'Livraison à domicile' : 'Retrait bureau',
    products:     productsList,
    subtotal:     sub,
    deliveryCost: dlvCost,
    discount:     discAmt,
    total,
    notes:        notes || '—',
    status:       'En attente',
    timestamp:    now.toISOString(),

    // — keys exactes attendues par le Apps Script
    orderNum:   orderId,
    prenom:     fname,
    nom:        lname,
    adresse:    address || '—',
    delivery:   selDlv === 'home' ? 'Livraison à domicile' : 'Retrait bureau',
    itemsText:  productsList,
    totalQty:   totalQty,
  };

  orders.push(orderData);
  localStorage.setItem('kt-orders', JSON.stringify(orders));

  document.getElementById('loading-overlay').classList.remove('hidden');
  const result = await sendToSheets(orderData);
  document.getElementById('loading-overlay').classList.add('hidden');

  cart    = [];
  discAmt = 0;
  saveCart();
  updateUI();
  renderSuccess(orderData);
  nav('success');

  if (result.success) toast('✅ Order synced to Google Sheets!', 'ok');
  else                toast('Order saved locally. Check your Sheets connection.', 'info');
}

// ============================================================
// SEND TO GOOGLE SHEETS
// ============================================================
async function sendToSheets(order) {
  try {
    // text/plain = simple request = pas de preflight CORS = Apps Script reçoit toujours
    await fetch(SHEETS_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(order),
    });
    return { success: true };
  } catch (err) {
    console.error('Google Sheets sync error:', err);
    return { success: false, reason: err.message };
  }
}

function renderSuccess(order) {
  document.getElementById('suc-oid').textContent = order.orderId;
  document.getElementById('suc-dets').innerHTML = `
    <div class="od-item"><div class="od-lbl">Customer</div><div class="od-val">${order.firstName} ${order.lastName}</div></div>
    <div class="od-item"><div class="od-lbl">Phone</div><div class="od-val">${order.phone}</div></div>
    <div class="od-item"><div class="od-lbl">Wilaya</div><div class="od-val">${order.wilaya}</div></div>
    <div class="od-item"><div class="od-lbl">Delivery Type</div><div class="od-val">${order.deliveryType}</div></div>
    <div class="od-item"><div class="od-lbl">Total</div><div class="od-val" style="color:var(--lime)">${order.total.toLocaleString('fr-DZ')} DA</div></div>
    <div class="od-item"><div class="od-lbl">Date</div><div class="od-val">${order.date} ${order.time}</div></div>`;
}

// ============================================================
// WHATSAPP
// ============================================================
function waOrder() {
  const last = orders[orders.length - 1];
  if (!last) return;
  const wa  = getWaNumber();
  const msg = encodeURIComponent(
    `🛒 *KHELIL TECH — New Order*\n` +
    `📋 *ID:* ${last.orderId}\n` +
    `👤 *Name:* ${last.firstName} ${last.lastName}\n` +
    `📞 *Phone:* ${last.phone}\n` +
    `📍 *Wilaya:* ${last.wilaya}, ${last.commune}\n` +
    `🏠 *Address:* ${last.address}\n` +
    `🚚 *Delivery:* ${last.deliveryType}\n` +
    `🛍️ *Products:* ${last.products}\n` +
    `💰 *Total:* ${last.total.toLocaleString('fr-DZ')} DA\n` +
    `📅 *Date:* ${last.date}`
  );
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
}

function waProd(id) {
  const p   = PRODS.find(x => x.id === id);
  if (!p) return;
  const wa  = getWaNumber();
  const msg = encodeURIComponent(`Hi! I am interested in:\n*${p.name}*\nPrice: ${p.price.toLocaleString('fr-DZ')} DA\nPlease send more info.`);
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
}

// ============================================================
// ADMIN
// ============================================================
function showAdm(section, el) {
  document.querySelectorAll('[id^="adm-"]').forEach(e => e.style.display = 'none');
  document.getElementById('adm-' + section).style.display = 'block';
  document.querySelectorAll('.adm-nav-item').forEach(e => e.classList.remove('on'));
  if (el) el.classList.add('on');
}

function renderAdm() {
  renderSalesChart();
  renderOrdersTable();
  renderProdsTable();
  renderRecentMini();
  renderAnalyticsChart();
  renderWilayaChart();
  const allOrders = [...orders, ...mockOrders()];
  const totalRev  = allOrders.reduce((s, o) => s + (o.total || 0), 0);
  const rEl = document.getElementById('adm-rev');
  const oEl = document.getElementById('adm-ord');
  if (rEl) rEl.textContent = totalRev > 999999 ? (totalRev / 1000000).toFixed(1) + 'M' : totalRev > 999 ? (totalRev / 1000).toFixed(0) + 'K' : totalRev.toString();
  if (oEl) oEl.textContent = allOrders.length;
  const waEl = document.getElementById('wa-number');
  if (waEl && localStorage.getItem('kt-wa')) waEl.value = localStorage.getItem('kt-wa');
}

function renderSalesChart() {
  const el = document.getElementById('sales-chart');
  if (!el) return;
  const data = [
    {l:'Gaming PCs', v:42, n:'420K DA'},
    {l:'Laptops',    v:28, n:'280K DA'},
    {l:'Phones',     v:18, n:'180K DA'},
    {l:'Monitors',   v:8,  n:'80K DA'},
    {l:'Accessories',v:4,  n:'40K DA'},
  ];
  el.innerHTML = data.map(d => `
    <div class="chart-row">
      <span class="chart-label">${d.l}</span>
      <div class="chart-track"><div class="chart-fill" style="width:${d.v}%"></div></div>
      <span class="chart-val">${d.n}</span>
    </div>`).join('');
}

function renderAnalyticsChart() {
  const el = document.getElementById('analytics-chart');
  if (!el) return;
  el.innerHTML = PRODS.slice(0, 6).map(p => `
    <div class="chart-row">
      <span class="chart-label" style="font-size:10px;">${p.icon} ${p.name.slice(0, 12)}</span>
      <div class="chart-track"><div class="chart-fill" style="width:${Math.round(p.reviews / 445 * 100)}%"></div></div>
      <span class="chart-val">${p.reviews}</span>
    </div>`).join('');
}

function renderWilayaChart() {
  const el = document.getElementById('wilaya-chart');
  if (!el) return;
  const data = [{l:'Alger',v:85},{l:'Oran',v:62},{l:'Constantine',v:48},{l:'Sétif',v:39},{l:'Annaba',v:31}];
  el.innerHTML = data.map(d => `
    <div class="chart-row">
      <span class="chart-label">${d.l}</span>
      <div class="chart-track"><div class="chart-fill" style="width:${d.v}%"></div></div>
      <span class="chart-val">${d.v} orders</span>
    </div>`).join('');
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;
  const all = [...orders, ...mockOrders()].slice(-30).reverse();
  tbody.innerHTML = all.map(o => `
    <tr>
      <td style="color:var(--cyan);font-family:'JetBrains Mono',monospace;font-size:10px;white-space:nowrap">${o.orderId || '—'}</td>
      <td style="white-space:nowrap">${(o.firstName || '') + ' ' + (o.lastName || o.name || '—')}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:11px">${o.phone || '—'}</td>
      <td>${o.wilaya || '—'}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">${o.products || '—'}</td>
      <td style="color:var(--lime);font-family:'JetBrains Mono',monospace;white-space:nowrap">${(o.total || 0).toLocaleString('fr-DZ')} DA</td>
      <td style="font-size:11px">${o.deliveryType || o.delivery || '—'}</td>
      <td><span class="st-badge st-${(o.status || 'pending').toLowerCase()}">${o.status || 'Pending'}</span></td>
      <td style="font-size:11px;white-space:nowrap">${o.date || '—'}</td>
    </tr>`).join('');
}

function renderRecentMini() {
  const el  = document.getElementById('recent-mini');
  if (!el) return;
  const all = [...orders, ...mockOrders()].slice(-5).reverse();
  el.innerHTML = all.map(o => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);font-size:12px;">
      <div>
        <div style="color:var(--text)">${(o.firstName || '') + ' ' + (o.lastName || o.name || '—')}</div>
        <div style="color:var(--text3);font-size:10px;margin-top:2px;">${o.wilaya || '—'} · ${o.date || '—'}</div>
      </div>
      <div style="text-align:right">
        <div style="color:var(--lime);font-family:'JetBrains Mono',monospace;font-size:12px;">${(o.total || 0).toLocaleString('fr-DZ')} DA</div>
        <span class="st-badge st-${(o.status || 'pending').toLowerCase()}" style="margin-top:3px;display:inline-block">${o.status || 'Pending'}</span>
      </div>
    </div>`).join('');
}

function renderProdsTable() {
  const tbody = document.getElementById('prods-tbody');
  if (!tbody) return;
  tbody.innerHTML = PRODS.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          ${p.img
            ? `<img src="${p.img}" alt="" style="width:32px;height:32px;object-fit:contain;border-radius:4px;" onerror="this.outerHTML='<span>${p.icon}</span>'">`
            : `<span>${p.icon}</span>`
          }
          <span style="font-size:12px">${p.name}</span>
        </div>
      </td>
      <td>${p.cat}</td>
      <td style="font-family:'JetBrains Mono',monospace;color:var(--lime);font-size:11px">${p.price.toLocaleString('fr-DZ')} DA</td>
      <td>${p.stock ? '<span style="color:var(--lime)">✅ In Stock</span>' : '<span style="color:var(--red)">❌ Out</span>'}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:11px">${p.reviews}</td>
      <td><span class="st-badge st-delivered">Active</span></td>
    </tr>`).join('');
}

function mockOrders() {
  return [
    {orderId:'KT-250527-00001',firstName:'Ahmed',lastName:'Benali',phone:'0555123456',wilaya:'Alger',commune:'Bab Ezzouar',address:'Rue des Freres...',deliveryType:'Home Delivery',products:'RTX 4090 Gaming Beast Pro x1',subtotal:299000,deliveryCost:700,discount:0,total:299700,notes:'—',status:'Delivered',date:'25/05/2025',time:'10:24:00'},
    {orderId:'KT-250527-00002',firstName:'Sara',lastName:'Madani',phone:'0661234567',wilaya:'Oran',commune:'Es Senia',address:'Cite USTO...',deliveryType:'Desk Pickup',products:'MacBook Pro M3 Max 16" x1',subtotal:265000,deliveryCost:450,discount:0,total:265450,notes:'—',status:'Processing',date:'25/05/2025',time:'14:10:00'},
    {orderId:'KT-250527-00003',firstName:'Karim',lastName:'Djaziri',phone:'0770987654',wilaya:'Constantine',commune:'El Khroub',address:'Bd du 1er Novembre...',deliveryType:'Home Delivery',products:'iPhone 15 Pro Max 512GB x1',subtotal:178000,deliveryCost:800,discount:0,total:178800,notes:'Urgent',status:'Pending',date:'26/05/2025',time:'09:05:00'},
    {orderId:'KT-250527-00004',firstName:'Amira',lastName:'Bouazza',phone:'0559876543',wilaya:'Sétif',commune:'Sétif',address:'Rue Hamdani...',deliveryType:'Desk Pickup',products:'Samsung Galaxy S24 Ultra x1 | Sony WH-1000XM5 x1',subtotal:166500,deliveryCost:450,discount:16650,total:150300,notes:'—',status:'Delivered',date:'24/05/2025',time:'16:40:00'},
    {orderId:'KT-250527-00005',firstName:'Youcef',lastName:'Hamdi',phone:'0662345678',wilaya:'Annaba',commune:'El Bouni',address:'Cite 1000 Logts...',deliveryType:'Home Delivery',products:'RTX 4070 Ti Gaming OC x1',subtotal:68000,deliveryCost:900,discount:0,total:68900,notes:'—',status:'Shipped',date:'26/05/2025',time:'11:20:00'},
  ];
}

function exportCSV() {
  const all     = [...orders, ...mockOrders()];
  const headers = ['Order ID','Date','Time','First Name','Last Name','Phone','Email','Wilaya','Commune','Address','Delivery Type','Products','Subtotal','Delivery','Discount','Total','Notes','Status'];
  const rows    = all.map(o => [
    o.orderId, o.date, o.time,
    o.firstName || (o.name || '').split(' ')[0],
    o.lastName  || (o.name || '').split(' ')[1] || '',
    o.phone, o.email || '', o.wilaya, o.commune || '', o.address || '',
    o.deliveryType || o.delivery || '', o.products,
    o.subtotal || 0, o.deliveryCost || 0, o.discount || 0, o.total || 0,
    o.notes || '', o.status || 'Pending'
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `khelil-tech-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast('CSV exported ✅', 'ok');
}

// ============================================================
// SETTINGS
// ============================================================
function saveWA() {
  const wa = (document.getElementById('wa-number').value || '').replace(/\s/g, '').replace('+', '');
  if (wa) { localStorage.setItem('kt-wa', wa); toast('WhatsApp number saved ✅', 'ok'); }
  else toast('Please enter a valid number', 'err');
}

async function testSheets() {
  const res = document.getElementById('sheets-test-result');
  if (res) res.textContent = 'Testing...';
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify({ test: true, source: 'KHELIL TECH', timestamp: new Date().toISOString() })
    });
    if (res) { res.textContent = '✅ Connection OK'; res.style.color = 'var(--lime)'; }
  } catch (e) {
    if (res) { res.textContent = '❌ Failed: ' + e.message; res.style.color = 'var(--red)'; }
  }
}

// ============================================================
// UI HELPERS
// ============================================================
function toast(msg, type = 'info') {
  const box   = document.getElementById('toast-box');
  const icons = { ok: '✅', err: '❌', info: 'ℹ️' };
  const el    = document.createElement('div');
  el.className = `toast t-${type}`;
  el.innerHTML = `<span class="toast-ico">${icons[type]}</span><span>${msg}</span>`;
  box.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translateX(120%)'; el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 320);
  }, 3000);
}

function startCd() {
  let secs = 8 * 3600 + 24 * 60;
  setInterval(() => {
    secs--; if (secs < 0) secs = 24 * 3600;
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    const pad = n => String(n).padStart(2, '0');
    ['cd-h','cd-m','cd-s'].forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = pad([h, m, s][i]); });
  }, 1000);
}

function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });
}

function subscribe() {
  const v = document.getElementById('nl-email').value;
  if (!v || !v.includes('@')) { toast('Enter a valid email', 'err'); return; }
  toast('Subscribed! Welcome to KHELIL TECH 🎉', 'ok');
  document.getElementById('nl-email').value = '';
}

const heroIcos = ['🖥️','💻','📱','🎧','⌨️','🖱️','🔧'];
let heroIdx = 0;
function rotHeroIco() {
  heroIdx = (heroIdx + 1) % heroIcos.length;
  const el = document.getElementById('hero-ico');
  if (!el) return;
  el.style.transform = 'scale(0)';
  el.style.transition = 'transform 0.15s';
  setTimeout(() => { el.textContent = heroIcos[heroIdx]; el.style.transform = 'scale(1)'; }, 150);
}

function toggleMob() { document.getElementById('mob-menu').classList.toggle('open'); }
function closeMob()  { document.getElementById('mob-menu').classList.remove('open'); }
// ============================================================
// FIT HERO TITLE — يصغر الفونت ليفي كل سطر في الشاشة
// ============================================================
function fitHeroTitle() {
  const h1 = document.querySelector('.hero-h1');
  if (!h1) return;
  const container = h1.parentElement;
  const containerWidth = container.clientWidth;
  if (containerWidth === 0) return;

  // ابدأ من حجم كبير ونزل حتى يفي
  let size = 80;
  h1.style.fontSize = size + 'px';

  while (size > 16 && h1.scrollWidth > containerWidth) {
    size -= 0.5;
    h1.style.fontSize = size + 'px';
  }
}

window.addEventListener('load', fitHeroTitle);
window.addEventListener('resize', fitHeroTitle);
