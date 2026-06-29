// ============================================================
// CONFIG — Google Sheets URL hardcoded
// ============================================================
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwpaURjFDjMbv7N4hDfXvrFCuSKtFz3C9-e_3HHdbCVuZ2xddlC3vI6I6QIbfA5yo5g/exec';

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
    id:1, name:'HP OMEN', brand:'HP', cat:'Gaming PCs',
    price:68000, orig:120000,
    icon:'',
    imgs:['images/hpomen15-i7-8eme-16-gtx1070/6.jpg', 'images/hpomen15-i7-8eme-16-gtx1070/2.jpg', 'images/hpomen15-i7-8eme-16-gtx1070/3.jpg','images/hpomen15-i7-8eme-16-gtx1070/4.jpg','images/hpomen15-i7-8eme-16-gtx1070/5.jpg','images/hpomen15-i7-8eme-16-gtx1070/1.jpg'],    // ← صور متعددة (يدعم حتى 8)
    video:'images/hpomen15-i7-8eme-16-gtx1070/V1.mp4', // ← فيديو اختياري: YouTube URL أو رابط mp4 مباشر
    flag:'HOT', rating:4.9, reviews:128, stock:true,
    desc:'The HP OMEN 15.6 is a powerful 2018-era gaming laptop designed to deliver desktop-caliber performance on the go. Featuring a 6-core Intel processor, dedicated NVIDIA graphics, and a high-refresh-rate display with G-Sync, this machine easily handles modern AAA gaming and demanding multitasking. Its sleek design, customizable RGB lighting, and advanced cooling system make it a standout choice for gamers seeking both performance and style.',
    specs:{CPU:'Intel Core i7-8750H',RAM:'16GB DDR4',GPU:'NVIDIA GTX 1070 8GB',Storage:'512 GB NVMe + 1 TB HDD',Display:'15.6" FHD 144Hz G-Sync',Battery:'70Wh',Ports:'USB-C, HDMI, Mini DisplayPort, Ethernet'}
  },
  {
    id:2, name:'HP EliteBook 850 G3', brand:'HP', cat:'Laptops',
    price:39000, orig:42000,
    icon:'💻',
    imgs:['images/HPEliteBook850G3/1.jpg', 'images/HPEliteBook850G3/2.jpg', 'images/HPEliteBook850G3/3.jpg','images/HPEliteBook850G3/4.jpg','images/HPEliteBook850G3/5.jpg'],         
    video:'images/HPEliteBook850G3/v1.mp4',
    flag:'CABA', rating:4.8, reviews:64, stock:true,
    desc:'The computer is an HP EliteBook 850 G3 running Windows 10 Home 64-bit (version 19045) in French. It is powered by an Intel Core i5-6200U processor operating at 2.30 GHz with 2 cores and 4 threads, providing reliable performance for everyday computing and office tasks. The system includes 8 GB of RAM, allowing smooth multitasking and efficient handling of common applications. Graphics are provided by the integrated Intel HD Graphics 520, which supports DirectX 12 and offers 128 MB of dedicated video memory with up to 3.8 GB of shared memory, making it suitable for multimedia, web browsing, and light graphical workloads. The laptop uses BIOS version N75 01.16 and supports the WDDM 2.1 driver model, ensuring compatibility with modern Windows graphics features. Overall, this configuration is a dependable business-class laptop designed for productivity, internet browsing, office applications, programming, video conferencing, and other everyday computing needs.',
    specs:{CPU:'Intel Core i5-6200U',RAM:'8GB DDR4',GPU:'INTEL UHD Graphics 520',Display:'15.6" FHD',Storage:'128GB NVMe SSD',Battery:'46Wh'}
  },
  {
    id:3, name:'iPhone XR 64GB', brand:'Apple', cat:'Smartphones',
    price:38000, orig:42000,
    icon:'',
    img:'images/IPHONEXR64GB82%/1.jpeg',
    video:'images/IPHONEXR64GB82%/v1.mp4',
    flag:'CABA', rating:4.9, reviews:312, stock:true,
    desc:`L'iPhone XR 64 Go dispose d'un écran Liquid Retina de 6,1 pouces, d'une puce A12 Bionic et de 64 Go de stockage.Il est équipé d'un appareil photo arrière de 12 MP, d'une caméra avant de 7 MP avec Face ID.Il prend en charge la 4G, la recharge sans fil et est résistant à l'eau (IP67).`,
    specs:{Chip:'Puce Apple A12 Bionic',RAM:'3GB',Storage:'64GB',Display:'6,1 pouces Liquid Retina HD (LCD), résolution 1792 × 828 pixels',Camera:'12 MP (grand-angle) avec stabilisation optique+7 MP TrueDepth avec Face ID',Battery:'16 heures de lecture vidéo, recharge rapide et recharge sans fil Qi 2942 mAh',EtatdeBatterie:'82%'}
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
    id:5, name:'ThinkPad L13 Gen 2"', brand:'Lenovo', cat:'Laptops',
    price:65000, orig:75000,
    icon:'💻',
    imgs:['images/lenovothinkpadl13gen2/3.jpg','images/lenovothinkpadl13gen2/2.jpg','images/lenovothinkpadl13gen2/1.jpg'],
    flag:'CABA', rating:5.0, reviews:97, stock:true,
    desc:'The most powerful ThinkPad ever with M3 Max chip. Extraordinary performance for creatives and professionals.',
    specs:{Chip:'INTEL CORE I5-1135G7',GPU:'Intel Iris Xe Graphics',RAM:'8GB DDR 4',Storage:'256GB SSD',Display:'14.3" FHD',Battery:'46Wh',Ports:`2 ports USB 3.2 Gen 1 Type A (toujours alimentés)`}
  },
  {
    id:6,name:'Dell Precision 3540',brand:'Dell',cat:'Laptops',
    price:65000,orig:75000,
    icon:'💻',
    imgs:[
      'images/dellprecision3540/1.jpg',
      'images/dellprecision3540/2.jpg',
      'images/dellprecision3540/3.JPG',
      'images/dellprecision3540/4.JPG',
      'images/dellprecision3540/5.JPG',
    ],
    flag:'CABA',rating:5.0,reviews:97,stock:true,
    desc:'Dell Precision 3540 is a professional mobile workstation designed for engineering, design, programming, and business users. Powered by an Intel Core i7-8565U processor with dedicated AMD Radeon Pro WX 2100 graphics, it delivers excellent performance for CAD applications, photo editing, multitasking, and everyday productivity while maintaining solid battery life and premium build quality.',
    specs:{
      CPU:'Intel Core i7-8565U',
      GPU:'AMD Radeon Pro WX 2100 2GB + Intel UHD Graphics 620',
      RAM:'16GB DDR4',
      Storage:'256GB NVMe SSD',
      Display:'15.6" FHD',
      Battery:'68Wh',
      Ports:'USB-C, 3x USB 3.1, HDMI, RJ-45, SD Card Reader'
    }
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
    id:10,
    name:'Nacon Revolution Unlimited Pro Controller',
    brand:'Nacon',
    cat:'Accessories',
    price:18000,
    orig:22000,
    icon:'🎮',
    imgs:[
      'images/naconrevolutionunlimited/1.jpg',
      'images/naconrevolutionunlimited/2.JPG',
      'images/naconrevolutionunlimited/3.JPG',
      'images/naconrevolutionunlimited/4.JPG',
      'images/naconrevolutionunlimited/5.JPG',
    ],
    video:'images/naconrevolutionunlimited/v2.mp4',
    flag:'HOT',
    rating:4.8,
    reviews:85,
    stock:true,
    desc:'The Nacon Revolution Unlimited Pro Controller is a premium professional gaming controller designed for PlayStation 4 and PC. It features customizable profiles, programmable shortcut buttons, interchangeable thumbsticks, adjustable weights, wired and wireless connectivity, and a premium carrying case for competitive gamers.',
    specs:{
      Compatibility:'PS4 / PC',
      Connectivity:'Bluetooth & USB-C',
      Battery:'Rechargeable',
      Profiles:'4 Custom Profiles',
      Buttons:'Programmable Shortcut Buttons',
      Features:'Interchangeable Weights, Replaceable Thumbsticks, Hard Carrying Case'
    }
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
    id:14,name:'LENOVO YOGA BOOK 9I',brand:'LENOVO',cat:'Laptops',
    price:280000,orig:300000,
    icon:'', // ← رابط صورة خارجي
    imgs:['images/yogabook9i/1.jpg','images/yogabook9i/2.jpg','images/yogabook9i/8.jpg','images/yogabook9i/4.jpg' , 'images/yogabook9i/5.jpg','images/yogabook9i/6.jpg','images/yogabook9i/7.jpg','images/yogabook9i/8.jpg' ],
    video:'images/yogabook9i/v1.mp4',
    flag:'NEW', rating:4.5, reviews:123, stock:true,
    desc:'The world’s first full dual-screen OLED, multi-mode laptopTwo stunning 13.3″ PureSight OLED displays for versatile usePowered by 13th Gen Intel® Core™ processors and the Intel® Evo™ platformDetachable Bluetooth™ keyboard, stylus pen, & folio stand includedCarbon-neutral construction & eco-friendly packagingLimitless possibilities & incredible entertainment with Dolby Atmos® & Bowers & Wilkins speakers',
    specs:{CPU:'Intel® Core™ i7 13th Gen',RAM:'16GB LPDDR5',GPU:'Intel® Iris® Xe Graphics',Storage:'1TB PCIe SSD',Display:'2x 13.3" PureSight OLED 4K',Battery:'15 hours',Weight:'1.5kg'}
  },
];

// ============================================================
// HELPER — يحول YouTube URL لـ embed
// ============================================================
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function buildVideoEmbed(url) {
  if (!url) return '';
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `<iframe
      src="https://www.youtube.com/embed/${ytId}"
      title="Product Video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="width:100%;height:100%;border-radius:var(--r2);"
    ></iframe>`;
  }
  // رابط mp4 مباشر
  return `<video controls style="width:100%;height:100%;border-radius:var(--r2);object-fit:contain;background:#000;">
    <source src="${url}">
  </video>`;
}

// ============================================================
// HELPER — يعرض الصورة أو الـ emoji كـ fallback
// ============================================================
function prodMedia(p, size = 'card') {
  // Support both p.img (string) and p.imgs (array) — use first image available
  const imgSrc = (Array.isArray(p.imgs) && p.imgs.length ? p.imgs[0] : '') || p.img || '';
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
  initTheme();
  renderCats();
  renderFlash();
  renderTrending();
  fillWilayas();
  updateUI();
  startCd();
  initNavScroll();
  initShop();
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
  g.innerHTML = CATS.map(c => {
    const realCount = PRODS.filter(p => p.cat === c.name).length;
    return `
    <div class="cat-card" onclick="nav('shop','${c.name}')">
      <span class="cat-icon">${c.icon}</span>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${realCount}</div>
    </div>`;
  }).join('');
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
// PRODUCT DETAIL — gallery بالصورة الحقيقية + فيديو
// ============================================================
function openProd(id) {
  const p = PRODS.find(x => x.id === id);
  if (!p) return;
  curProd = p;
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;

  // بناء الـ gallery: support both p.img (string) and p.imgs (array) — حتى 8 صور
  const galleryImgs = Array.isArray(p.imgs) && p.imgs.length
    ? p.imgs.slice(0, 8)
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

  // Thumbs — حتى 8 صور مع scroll أفقي
  const thumbs = galleryImgs.map((src, i) => `
    <div class="det-thumb ${i === 0 ? 'on' : ''}" onclick="switchDetImg('${src}',this)">
      ${src
        ? `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none'">`
        : `<span style="font-size:22px">${p.icon}</span>`
      }
    </div>`).join('');

  // قسم الفيديو — يظهر فقط إذا كان p.video موجود
  const videoSection = p.video ? `
    <div class="det-video-section">
      <div class="det-video-label">🎬 PRODUCT VIDEO</div>
      <div class="det-video-wrap">${buildVideoEmbed(p.video)}</div>
    </div>` : '';

  document.getElementById('det-content').innerHTML = `
    <div class="back-link" onclick="nav('shop')">← Back</div>
    <div class="det-grid">
      <div class="det-gallery">
        <div class="det-main-img">${mainMedia}</div>
        <div class="det-thumbs">${thumbs}</div>
        ${videoSection}
      </div>
      <div>
        <div class="det-brand">${p.brand}</div>
        <h1 class="det-h1">${p.name}</h1>
        <div class="det-rating" id="det-live-rating">
          ${buildLiveRatingHTML(p.id, [])}
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
    <div style="margin-top:60px;" id="reviews-anchor">
      ${buildReviewsSection(p.id)}
    </div>
    <div style="margin-top:60px;">
      <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:22px;">RELATED PRODUCTS</h2>
      <div class="prods-grid">${PRODS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(prodCard).join('')}</div>
    </div>`;
  nav('product');
  // تحميل reviews من Google Sheets بعد فتح الصفحة
  loadReviewsForProduct(p.id);
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
// THEME TOGGLE — Light / Dark Mode
// ============================================================
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('kt-theme', isLight ? 'light' : 'dark');
  updateThemeBtn(isLight);
}

function updateThemeBtn(isLight) {
  const btn = document.getElementById('theme-btn');
  const mobBtn = document.getElementById('theme-mob-btn');
  if (btn) btn.textContent = isLight ? '☀️' : '🌙';
  if (mobBtn) mobBtn.textContent = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function initTheme() {
  const saved = localStorage.getItem('kt-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLight = saved === 'light' || (!saved && !prefersDark);
  if (isLight) document.body.classList.add('light-mode');
  updateThemeBtn(isLight);
}


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
// REVIEWS SYSTEM — Google Sheets backend
// ============================================================

// URL نفسو تاع الطلبات — Apps Script يفرق بين action=reviews و action=order
const REVIEWS_SHEETS_URL = SHEETS_URL;

// ---- FETCH reviews من Google Sheets ----
async function fetchReviews(productId) {
  try {
    const url = REVIEWS_SHEETS_URL + '?action=getReviews&productId=' + productId + '&t=' + Date.now();
    const res  = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('fetchReviews error:', e);
    return [];
  }
}

// ---- POST review لـ Google Sheets ----
async function postReview(reviewData) {
  try {
    await fetch(REVIEWS_SHEETS_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify({ action: 'addReview', ...reviewData }),
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// ---- حساب المتوسط الحقيقي من قائمة reviews ----
function calcLiveRating(productId, reviews) {
  const p = PRODS.find(x => x.id === productId);
  if (!p) return { avg: 0, total: 0, dist: null };

  if (!reviews || reviews.length === 0) {
    return { avg: p.rating, total: p.reviews, dist: null };
  }

  const seedWeight = p.reviews;
  const seedSum    = p.rating * seedWeight;
  const userSum    = reviews.reduce((s, r) => s + Number(r.rating), 0);
  const userCount  = reviews.length;
  const totalCount = seedWeight + userCount;
  const avg        = (seedSum + userSum) / totalCount;

  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Number(r.rating) === star).length
  }));

  return { avg: Math.round(avg * 10) / 10, total: totalCount, dist };
}

// ---- HTML النجوم ----
function starsHTML(rating, size = 16) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const s     = `font-size:${size}px;`;
  return `<span style="${s}color:#F5C842">${'★'.repeat(full)}${'⯨'.repeat(half)}</span><span style="${s}color:var(--border)">${'★'.repeat(empty)}</span>`;
}

// ---- HTML التقييم المباشر في هيدر المنتج (يُحدَّث بعد تحميل reviews) ----
function buildLiveRatingHTML(productId, reviews) {
  const { avg, total } = calcLiveRating(productId, reviews);
  return `
    ${starsHTML(avg, 16)}
    <span class="live-avg">${avg.toFixed(1)}</span>
    <span class="live-count">(${total.toLocaleString('fr-DZ')} reviews)</span>`;
}

// ---- بناء قسم Reviews ----
function buildReviewsSection(productId, reviews = []) {
  const { avg, total, dist } = calcLiveRating(productId, reviews);

  const distHTML = dist
    ? dist.map(d => {
        const pct = reviews.length > 0 ? Math.round(d.count / reviews.length * 100) : 0;
        return `
          <div class="rev-bar-row">
            <span class="rev-bar-label">${d.star}★</span>
            <div class="rev-bar-track">
              <div class="rev-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="rev-bar-count">${d.count}</span>
          </div>`;
      }).join('')
    : `<div style="font-size:12px;color:var(--text3)">Be the first to leave a review!</div>`;

  const SHOW_INIT = 4;
  const reviewsHTML = reviews.length === 0
    ? `<div class="reviews-empty">
        <div class="rev-empty-ico">💬</div>
        <p>No reviews yet — be the first to share your experience!</p>
      </div>`
    : reviews.slice().reverse().slice(0, SHOW_INIT).map(revCardHTML).join('') +
      (reviews.length > SHOW_INIT
        ? `<button class="rev-load-more" onclick="loadMoreReviews(${productId}, ${SHOW_INIT})">
            LOAD MORE REVIEWS (${reviews.length - SHOW_INIT} more)
           </button>`
        : '');

  return `
    <div class="reviews-section" id="reviews-section-${productId}">
      <h2 class="reviews-section-title">
        CUSTOMER REVIEWS
        <span class="rev-total-badge" id="rev-total-badge-${productId}">${total} reviews</span>
      </h2>

      <div class="reviews-summary">
        <div class="rev-avg-block">
          <div class="rev-avg-num" id="rev-avg-num-${productId}">${avg.toFixed(1)}</div>
          <div class="rev-avg-stars">${starsHTML(avg, 18)}</div>
          <div class="rev-avg-count">out of 5</div>
        </div>
        <div class="rev-bars" id="rev-bars-${productId}">
          ${distHTML}
        </div>
      </div>

      <!-- Write Review -->
      <div class="write-review-wrap">
        <div class="write-review-title">✍️ WRITE A REVIEW</div>
        <div class="star-picker" id="star-picker-${productId}"
          onclick="pickStar(event,${productId})"
          onmouseover="hoverStar(event,${productId})"
          onmouseout="resetHover(${productId})">
          <span class="sp-star" data-v="1">★</span>
          <span class="sp-star" data-v="2">★</span>
          <span class="sp-star" data-v="3">★</span>
          <span class="sp-star" data-v="4">★</span>
          <span class="sp-star" data-v="5">★</span>
        </div>
        <div class="rev-rating-label" id="rev-rating-lbl-${productId}">Select a rating</div>
        <div class="rev-form-row">
          <input class="rev-name-in" id="rev-name-${productId}" placeholder="Your name *" maxlength="50"/>
          <input class="rev-name-in" id="rev-title-${productId}" placeholder="Review title (optional)" maxlength="80"/>
        </div>
        <textarea class="rev-comment-in" id="rev-comment-${productId}"
          placeholder="Share your experience with this product... *" maxlength="600"></textarea>
        <button class="rev-submit-btn" onclick="submitReview(${productId})">POST REVIEW →</button>
      </div>

      <!-- Loading indicator -->
      <div id="rev-loading-${productId}" style="text-align:center;padding:20px;color:var(--text3);font-size:12px;font-family:'JetBrains Mono',monospace;display:none;">
        ⏳ Loading reviews...
      </div>

      <!-- Reviews List -->
      <div class="reviews-list" id="rev-list-${productId}">
        ${reviewsHTML}
      </div>
    </div>`;
}

// ---- HTML كارت review واحد ----
function revCardHTML(r) {
  const initial = (r.name || '?')[0].toUpperCase();
  const rating  = Number(r.rating) || 0;
  const dateStr = r.date || '';
  return `
    <div class="rev-card" id="rev-card-${r.id}">
      <div class="rev-card-header">
        <div class="rev-card-left">
          <div class="rev-avatar">${initial}</div>
          <div>
            <div class="rev-card-name">${r.name}</div>
            <div class="rev-card-stars">
              <span style="color:#F5C842">${'★'.repeat(rating)}</span><span style="color:var(--border)">${'★'.repeat(5 - rating)}</span>
            </div>
          </div>
        </div>
        <div class="rev-card-date">${dateStr}</div>
      </div>
      ${r.title ? `<div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text)">${r.title}</div>` : ''}
      <div class="rev-card-comment">${r.comment}</div>
    </div>`;
}

// ---- Cache للـ reviews (لتجنب طلبات متكررة) ----
const _revCache = {};

// ---- فتح صفحة منتج: تحميل reviews من Sheets ----
async function loadReviewsForProduct(productId) {
  const loadEl = document.getElementById('rev-loading-' + productId);
  const listEl = document.getElementById('rev-list-'    + productId);
  if (loadEl) loadEl.style.display = 'block';
  if (listEl) listEl.style.display = 'none';

  const reviews = await fetchReviews(productId);
  _revCache[productId] = reviews;

  if (loadEl) loadEl.style.display = 'none';
  if (listEl) listEl.style.display = 'flex';

  // إعادة رسم قسم reviews بالكامل مع البيانات الحقيقية
  const anchor = document.getElementById('reviews-anchor');
  if (anchor) anchor.innerHTML = buildReviewsSection(productId, reviews);

  // تحديث التقييم في هيدر المنتج
  const liveRating = document.getElementById('det-live-rating');
  if (liveRating) liveRating.innerHTML = buildLiveRatingHTML(productId, reviews);
}

// ---- STAR PICKER ----
const _revState = {};
function getRevState(pid) {
  if (!_revState[pid]) _revState[pid] = { selected: 0 };
  return _revState[pid];
}

function hoverStar(e, pid) {
  const star = e.target.closest('.sp-star');
  if (!star) return;
  highlightStars(pid, parseInt(star.dataset.v), true);
}

function resetHover(pid) {
  highlightStars(pid, getRevState(pid).selected, false);
}

function pickStar(e, pid) {
  const star = e.target.closest('.sp-star');
  if (!star) return;
  const v = parseInt(star.dataset.v);
  getRevState(pid).selected = v;
  highlightStars(pid, v, false);
  const labels = ['','Poor 😞','Fair 😐','Good 😊','Very Good 😄','Excellent ⭐'];
  const lbl = document.getElementById('rev-rating-lbl-' + pid);
  if (lbl) { lbl.textContent = labels[v]; lbl.classList.add('filled'); }
}

function highlightStars(pid, upTo, isHover) {
  const picker = document.getElementById('star-picker-' + pid);
  if (!picker) return;
  picker.querySelectorAll('.sp-star').forEach(s => {
    const v = parseInt(s.dataset.v);
    s.classList.toggle('active', v <= upTo && !isHover);
    s.classList.toggle('hover',  v <= upTo &&  isHover);
  });
}

// ---- SUBMIT REVIEW ----
async function submitReview(pid) {
  const st      = getRevState(pid);
  const nameEl  = document.getElementById('rev-name-'    + pid);
  const cmtEl   = document.getElementById('rev-comment-' + pid);
  const titleEl = document.getElementById('rev-title-'   + pid);
  const btn     = document.querySelector('.rev-submit-btn');

  let ok = true;
  if (!st.selected) { toast('Please select a star rating ⭐', 'err'); ok = false; }
  if (!nameEl?.value.trim()) {
    nameEl?.classList.add('err');
    nameEl?.addEventListener('input', () => nameEl.classList.remove('err'), { once: true });
    ok = false;
  }
  if (!cmtEl?.value.trim()) {
    cmtEl?.classList.add('err');
    cmtEl?.addEventListener('input', () => cmtEl.classList.remove('err'), { once: true });
    if (ok && st.selected) toast('Please write a comment ✍️', 'err');
    ok = false;
  }
  if (!ok) { if (!st.selected || !nameEl?.value.trim()) toast('Please fill all required fields ⚠️', 'err'); return; }

  // Disable button while sending
  if (btn) { btn.disabled = true; btn.textContent = 'Posting...'; }

  const now    = new Date();
  const review = {
    id:        'rev-' + Date.now(),
    productId: pid,
    productName: (PRODS.find(x => x.id === pid) || {}).name || '',
    name:      nameEl.value.trim(),
    title:     titleEl?.value.trim() || '',
    comment:   cmtEl.value.trim(),
    rating:    st.selected,
    date:      now.toLocaleDateString('fr-DZ', { year:'numeric', month:'short', day:'numeric' }),
    timestamp: now.toISOString(),
  };

  const result = await postReview(review);

  // Reset form
  nameEl.value = ''; cmtEl.value = '';
  if (titleEl) titleEl.value = '';
  getRevState(pid).selected = 0;
  highlightStars(pid, 0, false);
  const lbl = document.getElementById('rev-rating-lbl-' + pid);
  if (lbl) { lbl.textContent = 'Select a rating'; lbl.classList.remove('filled'); }
  if (btn) { btn.disabled = false; btn.textContent = 'POST REVIEW →'; }

  // أضيف التعليق مؤقتاً للـ cache وأعيد الرسم (بدون انتظار Sheets)
  if (!_revCache[pid]) _revCache[pid] = [];
  _revCache[pid].push(review);

  const anchor = document.getElementById('reviews-anchor');
  if (anchor) anchor.innerHTML = buildReviewsSection(pid, _revCache[pid]);

  const liveRating = document.getElementById('det-live-rating');
  if (liveRating) liveRating.innerHTML = buildLiveRatingHTML(pid, _revCache[pid]);

  toast(result.success ? 'Review posted! Thank you 🎉' : 'Posted locally — will sync when online', 'ok');
}

// ---- LOAD MORE ----
function loadMoreReviews(pid, currentShown) {
  const reviews  = (_revCache[pid] || []).slice().reverse();
  const newCount = Math.min(currentShown + 4, reviews.length);
  const list     = document.getElementById('rev-list-' + pid);
  if (!list) return;
  list.querySelector('.rev-load-more')?.remove();
  list.insertAdjacentHTML('beforeend', reviews.slice(currentShown, newCount).map(revCardHTML).join(''));
  if (newCount < reviews.length) {
    list.insertAdjacentHTML('beforeend', `
      <button class="rev-load-more" onclick="loadMoreReviews(${pid}, ${newCount})">
        LOAD MORE REVIEWS (${reviews.length - newCount} more)
      </button>`);
  }
}
