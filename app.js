/* ── language ── */
let lang = 'ar';
const T = {
  ar: {
    title: 'الجدول الدوري للعناصر',
    sub: 'انقر على أي عنصر لعرض تفاصيله',
    atomicN: 'العدد الذري',
    massN: 'العدد الكتلي',
    group: 'المجموعة',
    period: 'الدورة',
    cfg: 'التوزيع الإلكتروني (أوفباو)',
    orbital: 'التوزيع في المدارات',
    aufbau: 'مبدأ أوفباو – صناديق المدارات',
    shells: 'توزيع الإلكترونات في المستويات',
    anomaly: '⚠ شذوذ في التوزيع الإلكتروني',
    cats: {
      alkali: 'فلزات قلوية', alkaline: 'فلزات قلوية ترابية',
      transition: 'عناصر انتقالية', boron_grp: 'مجموعة البورون',
      carbon_grp: 'مجموعة الكربون', pnictogen: 'مجموعة النيتروجين',
      chalcogen: 'مجموعة الأكسجين', halogen: 'هالوجينات',
      noble: 'غازات نبيلة', lanthanide: 'لانثانيدات',
      actinide: 'أكتينيدات', metalloid: 'أشباه فلزات',
      nonmetal: 'لافلزات'
    },
    lanthRow: 'لانثانيدات (57 – 71)',
    actRow: 'أكتينيدات (89 – 103)',
    lang: 'English'
  },
  en: {
    title: 'Periodic Table of Elements',
    sub: 'Click any element to view details',
    atomicN: 'Atomic Number',
    massN: 'Atomic Mass',
    group: 'Group',
    period: 'Period',
    cfg: 'Electron Configuration (Aufbau)',
    orbital: 'Orbital Diagram',
    aufbau: 'Aufbau – Orbital Boxes',
    shells: 'Electron Shell Distribution',
    anomaly: '⚠ Electron configuration anomaly',
    cats: {
      alkali: 'Alkali Metals', alkaline: 'Alkaline Earth Metals',
      transition: 'Transition Metals', boron_grp: 'Boron Group',
      carbon_grp: 'Carbon Group', pnictogen: 'Pnictogens',
      chalcogen: 'Chalcogens', halogen: 'Halogens',
      noble: 'Noble Gases', lanthanide: 'Lanthanides',
      actinide: 'Actinides', metalloid: 'Metalloids',
      nonmetal: 'Non-metals'
    },
    lanthRow: 'Lanthanides (57 – 71)',
    actRow: 'Actinides (89 – 103)',
    lang: 'العربية'
  }
};

/* ── anomalous elements (by atomic number) ── */
const ANOMALIES = new Set([24, 29, 41, 42, 44, 45, 46, 47, 57, 58, 64, 78, 79, 89, 90, 91, 92, 93, 94, 96]);

/* ── CSS variable per category ── */
const CAT_VAR = {
  alkali: '--alkali', alkaline: '--alkaline', transition: '--transition',
  boron_grp: '--boron', carbon_grp: '--carbon', pnictogen: '--pnictogen',
  chalcogen: '--chalcogen', halogen: '--halogen', noble: '--noble',
  lanthanide: '--lanthanide', actinide: '--actinide',
  metalloid: '--metalloid', nonmetal: '--nonmetal'
};
function catColor(cat) {
  return getComputedStyle(document.documentElement).getPropertyValue(CAT_VAR[cat] || '--unknown').trim();
}

/* ──────────────────────────────────────
   BUILD TABLE
────────────────────────────────────── */
function buildTable() {
  const grid = document.getElementById('pt-grid');
  grid.innerHTML = '';

  // Map elements by [period][group]
  const map = {};
  ELEMENTS.forEach(el => {
    if (el.cat === 'lanthanide' || el.cat === 'actinide') return;
    map[`${el.p}-${el.g}`] = el;
  });

  for (let row = 1; row <= 7; row++) {
    for (let col = 1; col <= 18; col++) {
      const el = map[`${row}-${col}`];

      /* La/Ac placeholder in col 3, rows 6-7 */
      if (!el && col === 3 && (row === 6 || row === 7)) {
        const ph = document.createElement('div');
        ph.className = 'el sep-cell';
        ph.style.gridColumn = col;
        ph.style.gridRow = row;
        ph.textContent = row === 6 ? '57-71' : '89-103';
        grid.appendChild(ph);
        continue;
      }

      if (!el) {
        const blank = document.createElement('div');
        blank.style.gridColumn = col;
        blank.style.gridRow = row;
        grid.appendChild(blank);
        continue;
      }

      grid.appendChild(makeCell(el, col, row));
    }
  }

  /* f-block rows */
  buildFBlock();
}

function makeCell(el, col, row) {
  const div = document.createElement('div');
  div.className = `el cat-${el.cat}`;
  if (col) div.style.gridColumn = col;
  if (row) div.style.gridRow = row;

  div.innerHTML = `
    <span class="num">${el.n}</span>
    <span class="sym">${el.sym}</span>
    <span class="name">${lang === 'ar' ? el.ar : el.en}</span>
  `;
  div.title = lang === 'ar' ? el.ar : el.en;
  div.addEventListener('click', () => openModal(el));
  return div;
}

function buildFBlock() {
  const wrap = document.getElementById('fblock');
  wrap.innerHTML = '';

  ['lanthanide', 'actinide'].forEach((cat, i) => {
    const row = document.createElement('div');
    row.className = 'fblock-row';
    const lbl = document.createElement('div');
    lbl.className = 'fblock-label';
    lbl.textContent = lang === 'ar'
      ? (i === 0 ? T.ar.lanthRow : T.ar.actRow)
      : (i === 0 ? T.en.lanthRow : T.en.actRow);

    ELEMENTS.filter(e => e.cat === cat).forEach(el => {
      row.appendChild(makeCell(el, null, null));
    });

    const wrapper = document.createElement('div');
    wrapper.appendChild(lbl);
    wrapper.appendChild(row);
    wrap.appendChild(wrapper);
  });
}

/* ──────────────────────────────────────
   LEGEND
────────────────────────────────────── */
function buildLegend() {
  const leg = document.getElementById('legend');
  leg.innerHTML = '';
  const cats = Object.keys(CAT_VAR);
  cats.forEach(cat => {
    const d = document.createElement('div');
    d.className = 'leg';
    d.innerHTML = `<span class="leg-dot" style="background:${catColor(cat)}"></span>
                   <span>${T[lang].cats[cat]}</span>`;
    leg.appendChild(d);
  });
}

/* ──────────────────────────────────────
   MODAL
────────────────────────────────────── */
function openModal(el) {
  const t = T[lang];
  document.getElementById('m-badge').style.background =
    `color-mix(in srgb, ${catColor(el.cat)} 50%, #111)`;
  document.getElementById('m-num').textContent = el.n;
  document.getElementById('m-sym').textContent = el.sym;
  document.getElementById('m-mass').textContent = el.mass;
  document.getElementById('m-name').textContent = lang === 'ar' ? el.ar : el.en;
  document.getElementById('m-cat').textContent = t.cats[el.cat] || el.cat;
  document.getElementById('m-an').textContent = el.n;
  document.getElementById('m-am').textContent = el.mass;
  document.getElementById('m-grp').textContent = el.g;
  document.getElementById('m-per').textContent = el.p;
  document.getElementById('m-cfg').textContent = el.cfg;
  document.getElementById('m-shells').textContent = el.shells.join(' | ');

  document.getElementById('lbl-cfg').textContent = t.cfg;
  document.getElementById('lbl-orbital').textContent = t.orbital;
  document.getElementById('lbl-aufbau').textContent = t.aufbau;
  document.getElementById('lbl-shells').textContent = t.shells;
  document.getElementById('lbl-an').textContent = t.atomicN;
  document.getElementById('lbl-am').textContent = t.massN;
  document.getElementById('lbl-grp').textContent = t.group;
  document.getElementById('lbl-per').textContent = t.period;

  const anomDiv = document.getElementById('m-anomaly');
  anomDiv.textContent = ANOMALIES.has(el.n) ? t.anomaly : '';

  drawOrbital(el);
  drawAufbau(el);

  document.getElementById('overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
}

/* ──────────────────────────────────────
   ORBITAL CANVAS (Bohr model)
────────────────────────────────────── */
function drawOrbital(el) {
  const canvas = document.getElementById('orb-canvas');
  const size = Math.min(window.innerWidth * .7, 320);
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2;
  const shells = el.shells;
  const maxR = cx - 14;
  const minR = 24;

  // nucleus
  const nRadius = Math.max(14, Math.min(22, 8 + shells.length * 2));
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, nRadius);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(.4, catColor(el.cat));
  grad.addColorStop(1, '#111');
  ctx.beginPath();
  ctx.arc(cx, cy, nRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // nucleus label
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(8, nRadius * .7)}px Cairo,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(lang === 'ar' ? 'نواة' : 'Nucleus', cx, cy);

  // shells
  const step = shells.length === 1 ? 0 : (maxR - minR) / (shells.length - 1);
  shells.forEach((count, i) => {
    const r = shells.length === 1 ? minR + 18 : minR + i * step;

    // orbit ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 1;
    ctx.stroke();

    // electrons
    for (let e = 0; e < count; e++) {
      const angle = (2 * Math.PI * e) / count - Math.PI / 2;
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.fillStyle = catColor(el.cat);
      ctx.fill();
      ctx.strokeStyle = '#fff5';
      ctx.lineWidth = .8;
      ctx.stroke();
    }

    // shell number label
    const lx = cx + r + 8;
    const ly = cy;
    ctx.fillStyle = '#ffffff66';
    ctx.font = '9px Cairo,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`n${i + 1}:${count}`, lx > size - 24 ? cx - r - 8 : lx, ly);
    ctx.textAlign = 'center';
  });
}

/* ──────────────────────────────────────
   AUFBAU BOXES
────────────────────────────────────── */
const AUFBAU_ORDER = [
  { n: 1, l: 's', cap: 2 }, { n: 2, l: 's', cap: 2 }, { n: 2, l: 'p', cap: 6 },
  { n: 3, l: 's', cap: 2 }, { n: 3, l: 'p', cap: 6 }, { n: 4, l: 's', cap: 2 },
  { n: 3, l: 'd', cap: 10 }, { n: 4, l: 'p', cap: 6 }, { n: 5, l: 's', cap: 2 },
  { n: 4, l: 'd', cap: 10 }, { n: 5, l: 'p', cap: 6 }, { n: 6, l: 's', cap: 2 },
  { n: 4, l: 'f', cap: 14 }, { n: 5, l: 'd', cap: 10 }, { n: 6, l: 'p', cap: 6 },
  { n: 7, l: 's', cap: 2 }, { n: 5, l: 'f', cap: 14 }, { n: 6, l: 'd', cap: 10 },
  { n: 7, l: 'p', cap: 6 }
];

function drawAufbau(el) {
  const cont = document.getElementById('aufbau-cont');
  cont.innerHTML = '';
  let remaining = el.n;

  for (const sub of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const fill = Math.min(remaining, sub.cap);
    remaining -= fill;
    const nBoxes = sub.cap / 2;

    const grp = document.createElement('div');
    grp.className = 'sub-group';
    grp.innerHTML = `<div class="sub-label">${sub.n}${sub.l}</div>`;

    const boxes = document.createElement('div');
    boxes.className = 'sub-boxes';

    for (let b = 0; b < nBoxes; b++) {
      const box = document.createElement('div');
      box.className = 'orb-box';
      const e1 = b + 1, e2 = nBoxes + b + 1;
      const hasUp = fill >= e1;
      // Hund's rule: fill up first
      const hasDown = fill >= e2;
      if (hasUp && hasDown) box.classList.add('full');
      else if (hasUp) box.classList.add('up');
      boxes.appendChild(box);
    }

    grp.appendChild(boxes);
    cont.appendChild(grp);
  }
}

/* ──────────────────────────────────────
   LANGUAGE SWITCH
────────────────────────────────────── */
function setLang(l) {
  lang = l;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-btn').textContent = T[lang].lang;
  document.getElementById('main-title').textContent = T[lang].title;
  document.getElementById('main-sub').textContent = T[lang].sub;
  buildTable();
  buildLegend();
}

/* ──────────────────────────────────────
   INIT
────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  setLang('ar');

  document.getElementById('lang-btn').addEventListener('click', () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  });

  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
});
