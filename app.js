// ============================================================
// CONFIG — Supabase project connection
// ============================================================

const SUPABASE_URL      = 'https://fiqomqwgbjvgsjfrwuoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcW9tcXdnYmp2Z3NqZnJ3dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTc5NTYsImV4cCI6MjEwMDEzMzk1Nn0.m4YDWY6wB6w4Ty_a0oDxpJrIT-k6C86A1HHm_oEsKvQ'; // Project Settings → API → anon public key

// Defensive: if the Supabase CDN script (jsdelivr) is slow, blocked, or the
// user is offline, `window.supabase` won't exist yet. Without this guard,
// the line below throws and silently kills the ENTIRE rest of app.js —
// no nav, no cart, no product rendering, nothing. Wrapping it means the
// site still works with the seed catalog even if Supabase is unreachable.
//
// IMPORTANT — variable name is `supabaseClient`, NOT `supabase`:
// The Supabase CDN bundle (<script src="...supabase-js@2">) declares its
// own top-level `var supabase = ...` to expose the library. A `var` at the
// top level of a classic script becomes a non-configurable global property.
// If this file also declared `let supabase = ...`, the browser throws
// "SyntaxError: Identifier 'supabase' has already been declared" the
// instant this script is parsed — a PARSE-time error that try/catch cannot
// catch, which aborts this entire file before a single line runs (nav,
// cart, product rendering — everything). That was the bug. Keeping our
// client under a different name (`supabaseClient`, same pattern already
// used correctly in admin.html) avoids the collision entirely.
let supabaseClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase SDK not loaded (CDN blocked/offline) — running on seed catalog only.');
  }
} catch (e) {
  console.warn('Supabase client failed to initialize — running on seed catalog only.', e);
}

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz7uwgzoIzKyLQp5Lo8mhfXQwgY6F_h8Ez_UFD5LKZM55oNiiLb4Bs3perRh4Gu5rdL/exec';

// ============================================================
// SECURITY — HTML escaping helper (prevents stored/reflected XSS)
// Use this on ANY value that came from a user, a review, an order
// form, or Google Sheets before inserting it via innerHTML.
// ============================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

// ============================================================
// PROMO CODES CONFIG — عدل هنا فقط بدل ما تدخل في الكود
// ============================================================
const PROMO_CODES = {
  'KHELIL5':  0.05,
  'KHELIL10': 0.10,
  'KHELIL20': 0.20,
};


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
// هاذي مصفوفة "seed" تتعرض فوري عند فتح الصفحة، وتتبدل تلقائياً
// بالمنتجات الحقيقية جايين من Supabase (شوف loadProductsFromSupabase)
// فور ما الأدمين يزيد/يحذف/يبدل شي حاجة، كل الزوار الجداد يشوفوها.
// ============================================================
let PRODS = [
  {
    id:'1', name:'HP OMEN', brand:'HP', cat:'Gaming PCs',
    price:68000, orig:120000,
    icon:'',
    imgs:['images/hpomen15-i7-8eme-16-gtx1070/6.jpg', 'images/hpomen15-i7-8eme-16-gtx1070/2.jpg', 'images/hpomen15-i7-8eme-16-gtx1070/3.jpg','images/hpomen15-i7-8eme-16-gtx1070/4.jpg','images/hpomen15-i7-8eme-16-gtx1070/5.jpg','images/hpomen15-i7-8eme-16-gtx1070/1.jpg'],    // ← صور متعددة (يدعم حتى 8)
    video:'images/hpomen15-i7-8eme-16-gtx1070/V1.mp4', // ← فيديو اختياري: YouTube URL أو رابط mp4 مباشر
    flag:'HOT', rating:4.9, reviews:128, stock:true,
    desc:'The HP OMEN 15.6 is a powerful 2018-era gaming laptop designed to deliver desktop-caliber performance on the go. Featuring a 6-core Intel processor, dedicated NVIDIA graphics, and a high-refresh-rate display with G-Sync, this machine easily handles modern AAA gaming and demanding multitasking. Its sleek design, customizable RGB lighting, and advanced cooling system make it a standout choice for gamers seeking both performance and style.',
    specs:{CPU:'Intel Core i7-8750H',RAM:'16GB DDR4',GPU:'NVIDIA GTX 1070 8GB',Storage:'512 GB NVMe + 1 TB HDD',Display:'15.6" FHD 144Hz G-Sync',Battery:'70Wh',Ports:'USB-C, HDMI, Mini DisplayPort, Ethernet'}
  },
  {
    id:'2', name:'HP EliteBook 850 G3', brand:'HP', cat:'Laptops',
    price:39000, orig:42000,
    icon:'💻',
    imgs:['images/HPEliteBook850G3/1.jpg', 'images/HPEliteBook850G3/2.jpg', 'images/HPEliteBook850G3/3.jpg','images/HPEliteBook850G3/4.jpg','images/HPEliteBook850G3/5.jpg'],         
    video:'images/HPEliteBook850G3/v1.mp4',
    flag:'CABA', rating:4.8, reviews:64, stock:true,
    desc:'The computer is an HP EliteBook 850 G3 running Windows 10 Home 64-bit (version 19045) in French. It is powered by an Intel Core i5-6200U processor operating at 2.30 GHz with 2 cores and 4 threads, providing reliable performance for everyday computing and office tasks. The system includes 8 GB of RAM, allowing smooth multitasking and efficient handling of common applications. Graphics are provided by the integrated Intel HD Graphics 520, which supports DirectX 12 and offers 128 MB of dedicated video memory with up to 3.8 GB of shared memory, making it suitable for multimedia, web browsing, and light graphical workloads. The laptop uses BIOS version N75 01.16 and supports the WDDM 2.1 driver model, ensuring compatibility with modern Windows graphics features. Overall, this configuration is a dependable business-class laptop designed for productivity, internet browsing, office applications, programming, video conferencing, and other everyday computing needs.',
    specs:{CPU:'Intel Core i5-6200U',RAM:'8GB DDR4',GPU:'INTEL UHD Graphics 520',Display:'15.6" FHD',Storage:'128GB NVMe SSD',Battery:'46Wh'}
  },
  {
    id:'3', name:'iPhone XR 64GB', brand:'Apple', cat:'Smartphones',
    price:38000, orig:42000,
    icon:'',
    img:'images/IPHONEXR64GB82%/1.jpeg',
    video:'images/IPHONEXR64GB82%/v1.mp4',
    flag:'CABA', rating:4.9, reviews:312, stock:true,
    desc:`L'iPhone XR 64 Go dispose d'un écran Liquid Retina de 6,1 pouces, d'une puce A12 Bionic et de 64 Go de stockage.Il est équipé d'un appareil photo arrière de 12 MP, d'une caméra avant de 7 MP avec Face ID.Il prend en charge la 4G, la recharge sans fil et est résistant à l'eau (IP67).`,
    specs:{Chip:'Puce Apple A12 Bionic',RAM:'3GB',Storage:'64GB',Display:'6,1 pouces Liquid Retina HD (LCD), résolution 1792 × 828 pixels',Camera:'12 MP (grand-angle) avec stabilisation optique+7 MP TrueDepth avec Face ID',Battery:'16 heures de lecture vidéo, recharge rapide et recharge sans fil Qi 2942 mAh',EtatdeBatterie:'82%'}
  },
  {
    id:'4', name:'Samsung Galaxy S24 Ultra', brand:'Samsung', cat:'Smartphones',
    price:142000, orig:162000,
    icon:'📱',
    img:'images/samsung-s24-ultra.jpg',
    flag:'NEW', rating:4.7, reviews:189, stock:true,
    desc:'Galaxy AI on the most powerful Galaxy ever. 200MP camera system with titanium frame and built-in S Pen.',
    specs:{Chip:'Snapdragon 8 Gen 3',RAM:'12GB',Storage:'256GB',Display:'6.8" Dynamic AMOLED 2X',Camera:'200MP+50MP+10MP+12MP',Battery:'5000mAh'}
  },
  {
    id:'5', name:'ThinkPad L13 Gen 2"', brand:'Lenovo', cat:'Laptops',
    price:65000, orig:75000,
    icon:'💻',
    imgs:['images/lenovothinkpadl13gen2/3.jpg','images/lenovothinkpadl13gen2/2.jpg','images/lenovothinkpadl13gen2/1.jpg'],
    flag:'CABA', rating:5.0, reviews:97, stock:true,
    desc:'The most powerful ThinkPad ever with M3 Max chip. Extraordinary performance for creatives and professionals.',
    specs:{Chip:'INTEL CORE I5-1135G7',GPU:'Intel Iris Xe Graphics',RAM:'8GB DDR 4',Storage:'256GB SSD',Display:'14.3" FHD',Battery:'46Wh',Ports:`2 ports USB 3.2 Gen 1 Type A (toujours alimentés)`}
  },
  {
    id:'6',name:'Dell Precision 3540',brand:'Dell',cat:'Laptops',
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
    id:'7', name:'HyperX Alloy Origins 65', brand:'HyperX', cat:'Keyboards',
    price:8900, orig:11000,
    icon:'⌨️',
    img:'images/hyperx-alloy-65.jpg',
    flag:'NEW', rating:4.5, reviews:156, stock:true,
    desc:'Compact 65% mechanical gaming keyboard with HyperX Red linear switches and per-key RGB backlight.',
    specs:{Layout:'65% Compact',Switches:'HyperX Red Linear',Backlight:'Per-key RGB',Cable:'Detachable USB-C',Build:'Aluminum top frame',Profile:'Low-profile'}
  },
  {
    id:'8', name:'Logitech G Pro X Superlight 2', brand:'Logitech', cat:'Mice',
    price:9800, orig:12000,
    icon:'🖱️',
    img:'images/logitech-gpro-superlight2.jpg',
    flag:'HOT', rating:4.9, reviews:234, stock:true,
    desc:'Under 60g with HERO 2 sensor delivering flawless tracking at any speed. Preferred by pro esports players worldwide.',
    specs:{Sensor:'HERO 2 25600 DPI',Weight:'< 60g',Buttons:'5',Battery:'95 hours',Connectivity:'LIGHTSPEED Wireless',Shape:'Symmetrical'}
  },
  {
    id:'9', name:'Sony WH-1000XM5', brand:'Sony', cat:'Headsets',
    price:24500, orig:30000,
    icon:'🎧',
    img:'images/sony-wh1000xm5.jpg',
    flag:'SALE', rating:4.8, reviews:445, stock:true,
    desc:'Industry-leading noise cancellation with 30-hour battery, multipoint connection, and premium sound quality.',
    specs:{Driver:'30mm',Frequency:'4Hz-40,000Hz',ANC:'Auto Optimizing',Battery:'30 hours',Charging:'USB-C fast charge',Weight:'250g'}
  },
  {
    id:'10',
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
    id:'11', name:'Razer BlackWidow V4 Pro', brand:'Razer', cat:'Keyboards',
    price:14500, orig:17000,
    icon:'⌨️',
    img:'images/razer-blackwidow-v4.jpg',
    flag:'', rating:4.6, reviews:67, stock:true,
    desc:'Full-size wireless gaming keyboard with Razer Yellow switches, Chroma RGB, and 200-hour battery life.',
    specs:{Layout:'Full Size',Switches:'Razer Yellow Linear',Wireless:'2.4GHz + Bluetooth',Battery:'200 hours',Backlight:'Chroma RGB',Build:'Aluminum alloy'}
  },
  {
    id:'14',name:'LENOVO YOGA BOOK 9I',brand:'LENOVO',cat:'Laptops',
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

// LIVE PRODUCTS — يقرا الكاتالوغ الحقيقي من Supabase ويبدل
// مصفوفة الـ seed. إذا الطلب فشل (أوفلاين، مشكل نتوورك...) الموقع
// يكمل خدمة بالـ seed اللي فوق بلا ما يهبط.
// ============================================================
async function loadProductsFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!Array.isArray(data) || !data.length) return;

    // نطبّع كل منتج: نتأكد الحقول الأساسية موجودة باش الـ UI ما يهبطش
    PRODS = data.map(p => ({
      id: p.id, // uuid string
      name: p.name || '',
      brand: p.brand || '',
      cat: p.category || '',
      price: Number(p.price) || 0,
      orig: p.original_price ? Number(p.original_price) : null,
      icon: p.icon || '',
      imgs: Array.isArray(p.images) && p.images.length ? p.images : (p.image_url ? [p.image_url] : []),
      img: Array.isArray(p.images) && p.images.length ? p.images[0] : (p.image_url || ''),
      video: p.video_url || '',
      flag: p.badge || '',
      rating: Number(p.rating) || 0,
      reviews: Number(p.review_count) || 0,
      stock: p.in_stock !== false,
      desc: p.description || '',
      specs: p.specs && typeof p.specs === 'object' ? p.specs : {},
    }));

    // نعيد رسم كل جزء فالصفحة يعتمد على PRODS
    renderCats();
    renderFlash();
    renderTrending();
    const shopPage = document.getElementById('page-shop');
    if (shopPage && shopPage.classList.contains('active')) filterProds();
  } catch (err) {
    // Offline or network failure — keep serving the seed catalog silently.
  }
}

// ============================================================
// FLASH DEAL — الكارد الكبير فأعلى الصفحة الرئيسية، متحكم فيه
// من admin.html (جدول settings، المفتاح 'flash_deal'، القيمة فيها
// مصفوفة deals[]). إذا زاد الأدمين أكثر من ديل، الكارد يتبدل
// أوتوماتيك بينهم. إذا ماكانش إعداد نشيط أو صرا خطأ فالنتوورك،
// الكارد يبقى بالقيم الافتراضية المكتوبة هاردكود فـ KhelilTech.html.
// ============================================================
let flashDeals       = [];   // مصفوفة الديلز المفعّلين، كل وحدة فيها { badge_text, stock_left, percent_sold, product }
let flashDealIdx     = 0;
let flashDealTimer   = null;
let flashDealActive  = false; // true = الكارد راه تحت تحكم الديلز، رواقف دوران الأيقونة الافتراضي

async function loadFlashDeal() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'flash_deal')
      .maybeSingle();
    if (error) throw error;
    if (!data || !data.value || data.value.active === false) return;

    const cfg = data.value;
    const rawDeals = Array.isArray(cfg.deals) ? cfg.deals : [];
    const ids = rawDeals.map(d => d.product_id).filter(Boolean);
    if (!ids.length) return;

    const { data: rows, error: prodErr } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', ids);
    if (prodErr) throw prodErr;

    const byId = {};
    (rows || []).forEach(r => { byId[r.id] = r; });

    flashDeals = rawDeals
      .filter(d => d.product_id && byId[d.product_id])
      .map(d => {
        const row = byId[d.product_id];
        return {
          badge_text: d.badge_text || '',
          stock_left: typeof d.stock_left === 'number' ? d.stock_left : null,
          percent_sold: typeof d.percent_sold === 'number' ? d.percent_sold : null,
          product: {
            id: row.id,
            name: row.name || '',
            price: Number(row.price) || 0,
            orig: row.original_price ? Number(row.original_price) : null,
            icon: row.icon || '',
            img: (Array.isArray(row.images) && row.images[0]) || row.image_url || '',
          },
        };
      });

    if (!flashDeals.length) return;

    flashDealActive = true;
    flashDealIdx = 0;
    renderFlashHero(flashDeals[0]);

    if (flashDealTimer) clearInterval(flashDealTimer);
    if (flashDeals.length > 1) {
      const ms = Math.max(2, Number(cfg.interval_seconds) || 5) * 1000;
      flashDealTimer = setInterval(rotateFlashDeal, ms);
    }
  } catch (err) {
    // settings/products query فشلت أو الجدول ماكانش موجود — الكارد الافتراضي يبقى ظاهر
  }
}

function rotateFlashDeal() {
  if (flashDeals.length < 2) return;
  flashDealIdx = (flashDealIdx + 1) % flashDeals.length;
  const rotator = document.getElementById('hc-rotator');
  if (!rotator) { renderFlashHero(flashDeals[flashDealIdx]); return; }
  rotator.style.opacity = '0';
  setTimeout(() => {
    renderFlashHero(flashDeals[flashDealIdx]);
    rotator.style.opacity = '1';
  }, 350);
}

function renderFlashHero(entry) {
  const badgeEl = document.getElementById('hc-badge');
  if (!badgeEl) return; // مانيش فالصفحة الرئيسية

  const { product: p, badge_text, stock_left, percent_sold } = entry;
  const nameEl  = document.getElementById('hc-name');
  const priceEl = document.getElementById('hc-price');
  const oldEl   = document.getElementById('hc-old');
  const barEl   = document.getElementById('hc-bar-fill');
  const leftEl  = document.getElementById('hc-stock-left');
  const soldEl  = document.getElementById('hc-percent-sold');
  const icoEl   = document.getElementById('hero-ico');

  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : null;
  badgeEl.textContent = badge_text || (disc ? `⚡ FLASH DEAL — ${disc}% OFF` : '⚡ FLASH DEAL');
  if (nameEl)  nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = `${p.price.toLocaleString('fr-DZ')} DA`;
  if (oldEl) {
    oldEl.style.display = p.orig ? '' : 'none';
    if (p.orig) oldEl.textContent = `${p.orig.toLocaleString('fr-DZ')} DA`;
  }
  flashDealProdId = p.id;

  // نبدلو/نحدّثو الأيقونة بصورة المنتج الحقيقية، أو نرجعو للـ emoji إذا ماكانش عندو صورة
  if (icoEl) {
    if (p.img) {
      if (icoEl.tagName === 'IMG') { icoEl.src = p.img; icoEl.alt = p.name; icoEl.style.display = ''; }
      else icoEl.outerHTML = `<img id="hero-ico" src="${p.img}" alt="${esc(p.name)}" style="width:100%;height:260px;object-fit:cover;object-position:center;border-radius:var(--r2);display:block;margin:0 auto 16px;" onerror="this.style.display='none';"/>`;
    } else if (icoEl.tagName === 'IMG') {
      icoEl.outerHTML = `<span class="hc-img" id="hero-ico">${p.icon || '🖥️'}</span>`;
    } else {
      icoEl.textContent = p.icon || icoEl.textContent;
    }
  }

  if (leftEl) leftEl.textContent = stock_left != null ? `🔥 Only ${stock_left} left!` : '';
  if (typeof percent_sold === 'number') {
    const pct = Math.max(0, Math.min(100, percent_sold));
    if (soldEl) soldEl.textContent = `${pct}% sold`;
    if (barEl)  barEl.style.width = `${pct}%`;
  } else if (soldEl) {
    soldEl.textContent = '';
  }
}

function viewFlashDeal() {
  if (flashDealProdId && PRODS.some(x => x.id === flashDealProdId)) openProd(flashDealProdId);
  else nav('shop');
}

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
  const imgSrc = (Array.isArray(p.imgs) && p.imgs.length ? p.imgs[0] : '') || p.img || '';
  const iconSize = size === 'card' ? '64px' : '120px';
  const fallbackHTML = `<span style="font-size:${iconSize};position:relative;z-index:1;">${p.icon}</span>`;
  if (imgSrc) {
    const styles = size === 'card'
      ? 'width:100%;height:100%;object-fit:cover;object-position:center;position:relative;z-index:1;'
      : 'max-width:100%;max-height:340px;object-fit:contain;display:block;margin:auto;';
    return `<img
      src="${imgSrc}"
      alt="${p.name}"
      style="${styles}"
      onerror="this.replaceWith(Object.assign(document.createElement('span'),{style:'font-size:${iconSize};position:relative;z-index:1;',textContent:'${p.icon}'}));"
    />`;
  }
  return fallbackHTML;
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
let flashDealProdId  = null;  // منتج الديل المعروض دابا فالكارد (باش زر VIEW يودي ليه)

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
  loadProductsFromSupabase(); // يبدل الـ seed بالكاتالوغ الحقيقي فالخلفية
  loadFlashDeal();            // يقرا إعدادات الـ Flash Deal من الأدمين
  setInterval(rotHeroIco, 3000);

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

  // إعادة عنوان الصفحة الافتراضي عند الخروج من صفحة المنتج
  if (page !== 'product') {
    document.title = 'KHELIL TECH — Premium Electronics Store Algeria';
  }

  // صفحة المنتج — page='product', cat=productId (string)
  if (page === 'product' && cat && !nav._openingProd) {
    const prodId = String(cat);
    const prod = PRODS.find(x => String(x.id) === prodId);
    if (prod) {
      nav._openingProd = true;
      openProd(prodId, pushToHistory);
      nav._openingProd = false;
      return;
    } else {
      nav('shop', '', pushToHistory);
      return;
    }
  }

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

  // حفظ الصفحة الحالية في تاريخ المتصفح
  if (pushToHistory) {
    const state = { page, cat };
    const url = '#' + page + (cat ? '/' + encodeURIComponent(cat) : '');
    history.pushState(state, '', url);
  }
}
nav._openingProd = false;

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
    <div class="prod-card" onclick="openProd('${p.id}')">
      <div class="prod-img">
        ${p.flag ? `<div class="prod-flag ${fc}">${p.flag}</div>` : ''}
        <div class="prod-wish ${inW ? 'on' : ''}" onclick="event.stopPropagation();toggleWish('${p.id}')">♥</div>
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
          <button class="prod-add" onclick="event.stopPropagation();addCart('${p.id}')">+ CART</button>
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
function openProd(id, pushToHistory = true) {
  const p = PRODS.find(x => x.id === id);
  if (!p) { nav('shop', '', false); return; }
  curProd = p;

  // تحديث عنوان الصفحة والـ meta description ديناميكياً
  document.title = `${p.name} — KHELIL TECH`;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
  metaDesc.content = `${p.name} — ${p.brand} | ${p.price.toLocaleString('fr-DZ')} DA | Khelil Tech Algeria`;

  // تسجيل المنتج في المشاهدات الأخيرة
  addRecentlyViewed(id);
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
    <nav class="breadcrumb" aria-label="breadcrumb">
      <span class="bc-item" onclick="nav('home')">Home</span>
      <span class="bc-sep">›</span>
      <span class="bc-item" onclick="nav('shop','${p.cat}')">${p.cat}</span>
      <span class="bc-sep">›</span>
      <span class="bc-item bc-current">${p.brand}</span>
    </nav>
    <div class="back-link" onclick="nav('shop','${p.cat}')">← Back to ${p.cat}</div>
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
          <button class="btn-wa" onclick="waProd('${p.id}')">📱 WhatsApp</button>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn-ghost" style="flex:1;padding:12px;" onclick="toggleWish('${p.id}')">♥ WISHLIST</button>
          <button class="btn-prime" style="flex:1;padding:12px;" onclick="buyNow('${p.id}')" ${!p.stock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>⚡ BUY NOW</button>
        </div>
      </div>
    </div>
    <div style="margin-top:60px;" id="reviews-anchor">
      ${buildReviewsSection(p.id)}
    </div>
    <div style="margin-top:60px;">
      <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:22px;">RELATED PRODUCTS</h2>
      <div class="prods-grid">${PRODS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(prodCard).join('')}</div>
    </div>
    <div style="margin-top:48px;" id="recently-viewed-section"></div>`;
  nav('product', String(p.id), pushToHistory);
  loadReviewsForProduct(p.id);
  renderRecentlyViewed(p.id);
}

function switchDetImg(src, thumbEl) {
  const mainImg = document.getElementById('det-main-img-el');
  if (mainImg && src) { mainImg.src = src; mainImg.style.display = 'block'; }
  document.querySelectorAll('.det-thumb').forEach(t => t.classList.remove('on'));
  if (thumbEl) thumbEl.classList.add('on');
}

// ============================================================
// RECENTLY VIEWED
// ============================================================
function addRecentlyViewed(id) {
  let rv = JSON.parse(localStorage.getItem('kt-rv') || '[]');
  rv = rv.filter(x => x !== id);  // نحذف إذا كان موجود
  rv.unshift(id);                  // نضيفه في البداية
  rv = rv.slice(0, 8);             // نحتفظ بـ 8 فقط
  localStorage.setItem('kt-rv', JSON.stringify(rv));
}

function renderRecentlyViewed(currentId) {
  const el = document.getElementById('recently-viewed-section');
  if (!el) return;
  const rv = JSON.parse(localStorage.getItem('kt-rv') || '[]');
  const items = rv
    .filter(id => id !== currentId)
    .map(id => PRODS.find(x => x.id === id))
    .filter(Boolean)
    .slice(0, 4);
  if (items.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:22px;">🕐 RECENTLY VIEWED</h2>
    <div class="prods-grid">${items.map(prodCard).join('')}</div>`;
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
          <button class="ci-qb" onclick="chgCartQty('${p.id}',-1)">−</button>
          <span class="ci-q">${item.qty}</span>
          <button class="ci-qb" onclick="chgCartQty('${p.id}',1)">+</button>
          <button class="ci-del" onclick="rmCart('${p.id}')">🗑</button>
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
  const rate = PROMO_CODES[code.toUpperCase().trim()];
  if (rate) {
    discAmt = Math.round(sub * rate);
    toast(`${Math.round(rate * 100)}% discount applied! 🎉`, 'ok');
  } else {
    toast('Invalid promo code ❌', 'err');
  }
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

  const cartItems = cart.map(item => {
    const p = PRODS.find(x => x.id === item.id);
    return p ? { product_id: p.id, name: p.name, qty: item.qty, price: p.price } : null;
  }).filter(Boolean);

  const productsList = cartItems.map(it => `${it.name} x${it.qty}`).join(' | ');
  const totalQty     = cart.reduce((s, item) => s + item.qty, 0);
  const deliveryType = selDlv === 'home' ? 'Livraison à domicile' : 'Retrait bureau';

  document.getElementById('loading-overlay').classList.remove('hidden');

  let data, error;
  try {
    if (!supabaseClient) throw new Error('Supabase unavailable');
    ({ data, error } = await supabaseClient
      .from('orders')
      .insert({
        first_name:    fname,
        last_name:     lname,
        phone,
        email:         email || null,
        wilaya,
        commune:       commune || null,
        address:       address || null,
        delivery_type: deliveryType,
        items:         cartItems,
        total_qty:     totalQty,
        subtotal:      sub,
        delivery_cost: dlvCost,
        discount:      discAmt,
        total,
        notes:         notes || null,
      })
      .select()
      .single());
  } catch (e) {
    error = e;
  }

  document.getElementById('loading-overlay').classList.add('hidden');

  if (error) {
    toast('Could not place order. Please try again or contact us on WhatsApp.', 'err');
    return;
  }

  const now = new Date(data.created_at);
  const orderData = {
    orderId:      data.order_number,
    date:         now.toLocaleDateString('fr-DZ'),
    time:         now.toLocaleTimeString('fr-DZ'),
    firstName:    fname,
    lastName:     lname,
    phone,
    email:        email || '—',
    wilaya,
    commune,
    address,
    deliveryType,
    products:     productsList,
    subtotal:     sub,
    deliveryCost: dlvCost,
    discount:     discAmt,
    total,
    notes:        notes || '—',
    status:       data.status,
  };

  orders.push(orderData);
  localStorage.setItem('kt-orders', JSON.stringify(orders));

  cart    = [];
  discAmt = 0;
  saveCart();
  updateUI();
  renderSuccess(orderData);
  nav('success');
  toast('✅ Order placed successfully!', 'ok');
}

function renderSuccess(order) {
  document.getElementById('suc-oid').textContent = order.orderId;
  document.getElementById('suc-dets').innerHTML = `
    <div class="od-item"><div class="od-lbl">Customer</div><div class="od-val">${escapeHTML(order.firstName)} ${escapeHTML(order.lastName)}</div></div>
    <div class="od-item"><div class="od-lbl">Phone</div><div class="od-val">${escapeHTML(order.phone)}</div></div>
    <div class="od-item"><div class="od-lbl">Wilaya</div><div class="od-val">${escapeHTML(order.wilaya)}</div></div>
    <div class="od-item"><div class="od-lbl">Delivery Type</div><div class="od-val">${escapeHTML(order.deliveryType)}</div></div>
    <div class="od-item"><div class="od-lbl">Total</div><div class="od-val" style="color:var(--lime)">${escapeHTML(order.total.toLocaleString('fr-DZ'))} DA</div></div>
    <div class="od-item"><div class="od-lbl">Date</div><div class="od-val">${escapeHTML(order.date)} ${escapeHTML(order.time)}</div></div>`;
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


// ============================================================
// SECURITY — escape untrusted user-submitted text (review name,
// title, comment) before inserting it into innerHTML, to prevent
// stored XSS via the public review form.
// ============================================================
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
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
  if (flashDealActive) return; // الكارد راه تحت تحكم الـ Flash Deal، ما نديروش الدوران الافتراضي
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
// REVIEWS SYSTEM — Supabase backend
// ============================================================

async function fetchReviews(productId) {
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data.map(r => ({
      id:        r.id,
      productId: r.product_id,
      name:      r.name,
      title:     r.title || '',
      comment:   r.comment,
      rating:    r.rating,
      date:      new Date(r.created_at).toLocaleDateString('fr-DZ', { year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: r.created_at,
    })) : [];
  } catch (e) {
    return [];
  }
}

async function postReview(reviewData) {
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert({
        product_id: reviewData.productId,
        name:       reviewData.name,
        title:      reviewData.title || null,
        comment:    reviewData.comment,
        rating:     reviewData.rating,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      success: true,
      review: {
        id:        data.id,
        productId: data.product_id,
        name:      data.name,
        title:     data.title || '',
        comment:   data.comment,
        rating:    data.rating,
        date:      new Date(data.created_at).toLocaleDateString('fr-DZ', { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: data.created_at,
      },
    };
  } catch (e) {
    return { success: false };
  }
}

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

function starsHTML(rating, size = 16) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const s     = `font-size:${size}px;`;
  return `<span style="${s}color:#F5C842">${'★'.repeat(full)}${'⯨'.repeat(half)}</span><span style="${s}color:var(--border)">${'★'.repeat(empty)}</span>`;
}

function buildLiveRatingHTML(productId, reviews) {
  const { avg, total } = calcLiveRating(productId, reviews);
  return `
    ${starsHTML(avg, 16)}
    <span class="live-avg">${avg.toFixed(1)}</span>
    <span class="live-count">(${total.toLocaleString('fr-DZ')} reviews)</span>`;
}

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
        ? `<button class="rev-load-more" onclick="loadMoreReviews('${productId}', ${SHOW_INIT})">
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

      <div class="write-review-wrap">
        <div class="write-review-title">✍️ WRITE A REVIEW</div>
        <div class="star-picker" id="star-picker-${productId}"
          onclick="pickStar(event,'${productId}')"
          onmouseover="hoverStar(event,'${productId}')"
          onmouseout="resetHover('${productId}')">
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
        <button class="rev-submit-btn" onclick="submitReview('${productId}')">POST REVIEW →</button>
      </div>

      <div id="rev-loading-${productId}" style="text-align:center;padding:20px;color:var(--text3);font-size:12px;font-family:'JetBrains Mono',monospace;display:none;">
        ⏳ Loading reviews...
      </div>

      <div class="reviews-list" id="rev-list-${productId}">
        ${reviewsHTML}
      </div>
    </div>`;
}

function revCardHTML(r) {
  const initial = esc((r.name || '?')[0].toUpperCase());
  const rating  = Number(r.rating) || 0;
  const dateStr = esc(r.date || '');
  return `
    <div class="rev-card" id="rev-card-${r.id}">
      <div class="rev-card-header">
        <div class="rev-card-left">
          <div class="rev-avatar">${initial}</div>
          <div>
            <div class="rev-card-name">${esc(r.name)}</div>
            <div class="rev-card-stars">
              <span style="color:#F5C842">${'★'.repeat(rating)}</span><span style="color:var(--border)">${'★'.repeat(5 - rating)}</span>
            </div>
          </div>
        </div>
        <div class="rev-card-date">${dateStr}</div>
      </div>
      ${r.title ? `<div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text)">${esc(r.title)}</div>` : ''}
      <div class="rev-card-comment">${esc(r.comment)}</div>
    </div>`;
}

const _revCache = {};

async function loadReviewsForProduct(productId) {
  const loadEl = document.getElementById('rev-loading-' + productId);
  const listEl = document.getElementById('rev-list-'    + productId);
  if (loadEl) loadEl.style.display = 'block';
  if (listEl) listEl.style.display = 'none';

  const reviews = await fetchReviews(productId);
  _revCache[productId] = reviews;

  if (loadEl) loadEl.style.display = 'none';
  if (listEl) listEl.style.display = 'flex';

  const anchor = document.getElementById('reviews-anchor');
  if (anchor) anchor.innerHTML = buildReviewsSection(productId, reviews);

  const liveRating = document.getElementById('det-live-rating');
  if (liveRating) liveRating.innerHTML = buildLiveRatingHTML(productId, reviews);
}

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

  nameEl.value = ''; cmtEl.value = '';
  if (titleEl) titleEl.value = '';
  getRevState(pid).selected = 0;
  highlightStars(pid, 0, false);
  const lbl = document.getElementById('rev-rating-lbl-' + pid);
  if (lbl) { lbl.textContent = 'Select a rating'; lbl.classList.remove('filled'); }
  if (btn) { btn.disabled = false; btn.textContent = 'POST REVIEW →'; }

  if (!result.success) {
    toast('Could not post your review. Please check your connection and try again.', 'err');
    return;
  }

  if (!_revCache[pid]) _revCache[pid] = [];
  _revCache[pid].push(result.review);

  const anchor = document.getElementById('reviews-anchor');
  if (anchor) anchor.innerHTML = buildReviewsSection(pid, _revCache[pid]);

  const liveRating = document.getElementById('det-live-rating');
  if (liveRating) liveRating.innerHTML = buildLiveRatingHTML(pid, _revCache[pid]);

  toast('Review posted! Thank you 🎉', 'ok');
}

function loadMoreReviews(pid, currentShown) {
  const reviews  = (_revCache[pid] || []).slice().reverse();
  const newCount = Math.min(currentShown + 4, reviews.length);
  const list     = document.getElementById('rev-list-' + pid);
  if (!list) return;
  list.querySelector('.rev-load-more')?.remove();
  list.insertAdjacentHTML('beforeend', reviews.slice(currentShown, newCount).map(revCardHTML).join(''));
  if (newCount < reviews.length) {
    list.insertAdjacentHTML('beforeend', `
      <button class="rev-load-more" onclick="loadMoreReviews('${pid}', ${newCount})">
        LOAD MORE REVIEWS (${reviews.length - newCount} more)
      </button>`);
  }
}