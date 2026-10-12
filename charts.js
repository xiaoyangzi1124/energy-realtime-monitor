/* 智慧能源平台 Demo — 零依赖轻量图表（SVG/HTML 字符串渲染，观感对齐 ECharts 默认风格）
   含悬浮提示 / 高亮交互 */

const CH_COLORS = ['#3E9BE0', '#FF8A3D', '#2BA245', '#FFC53D', '#9270CA', '#36CFC9'];

function chFmt(v, max) {
  if (max <= 1) return v.toFixed(2);
  return String(Math.round(v));
}

/* ---------- 悬浮提示 ---------- */
function chTip(el) {
  el.classList.add('ch-wrap');
  let tip = el.querySelector(':scope > .ch-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'ch-tip';
    el.appendChild(tip);
  }
  return tip;
}
function chTipShow(tip, html, x, y, box) {
  tip.innerHTML = html;
  tip.style.display = 'block';
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let left = x + 14;
  if (left + tw > box.width) left = x - tw - 14;
  tip.style.left = Math.max(0, left) + 'px';
  tip.style.top = Math.max(0, Math.min(y - th / 2, box.height - th)) + 'px';
}
function chTipHide(tip) { tip.style.display = 'none'; }

/* ---------- 折线图：cfg = { unit, x:[], yMax?, series:[{name,color,data,axis?}] , unit2?, y2Max?} ---------- */
function chLine(el, cfg) {
  const has2 = cfg.series.some((s) => s.axis === 2);
  const W = cfg.fit ? (el.clientWidth || 660) : 660;
  const H = cfg.fit ? (el.clientHeight || 236) : 236;
  const pl = 46, pr = has2 ? 40 : 14, pt = 34, pb = 26;
  const iw = W - pl - pr, ih = H - pt - pb;
  const vals = cfg.series.flatMap((s) => s.data);
  const max = cfg.yMax || Math.max(10, Math.ceil(Math.max(...vals) / 20) * 20);
  const vals2 = cfg.series.filter((s) => s.axis === 2).flatMap((s) => s.data);
  const max2 = cfg.y2Max || (vals2.length ? Math.max(5, Math.ceil(Math.max(...vals2) / 10) * 10) : 0);
  const ticks = 5;
  const n = cfg.x.length;
  const X = (i) => pl + (iw * i) / (n - 1);
  const Y = (v) => pt + ih - (ih * v) / max;
  const Y2 = (v) => pt + ih - (ih * v) / max2;

  let g = `<text x="6" y="14" font-size="10" fill="#999">${cfg.unit || ''}</text>`;
  if (has2) g += `<text x="${W - 6}" y="14" text-anchor="end" font-size="10" fill="#999">${cfg.unit2 || ''}</text>`;
  for (let t = 0; t <= ticks; t++) {
    const v = (max / ticks) * t;
    const y = Y(v);
    g += t === 0
      ? `<line x1="${pl}" y1="${y}" x2="${W - pr}" y2="${y}" stroke="#D9D9D9"/>`
      : `<line x1="${pl}" y1="${y}" x2="${W - pr}" y2="${y}" stroke="#E5E6EB" stroke-dasharray="4 4"/>`;
    g += `<text x="${pl - 8}" y="${y + 3}" text-anchor="end" font-size="10" fill="#999">${chFmt(v, max)}</text>`;
    if (has2) g += `<text x="${W - pr + 8}" y="${y + 3}" font-size="10" fill="#999">${chFmt((max2 / ticks) * t, max2)}</text>`;
  }
  cfg.x.forEach((lb, i) => {
    if (i % 2 === 0) g += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle" font-size="10" fill="#999">${lb}</text>`;
  });

  const items = cfg.series.map((s) => ({ s, w: 24 + s.name.length * 11 }));
  const total = items.reduce((a, b) => a + b.w, 0) + (items.length - 1) * 18;
  let lx = (W - total) / 2;
  items.forEach(({ s, w }, si) => {
    g += `<g class="ch-lg" data-s="${si}" style="cursor:pointer">` +
         `<line x1="${lx}" y1="14" x2="${lx + 18}" y2="14" stroke="${s.color}" stroke-width="2"/>` +
         `<circle cx="${lx + 9}" cy="14" r="3" fill="${s.color}"/>` +
         `<text x="${lx + 24}" y="17" font-size="11" fill="#666">${s.name}</text>` +
         `</g>`;
    lx += w + 18;
  });

  g += `<line class="ch-guide" x1="0" y1="${pt}" x2="0" y2="${pt + ih}" stroke="#B9C4CC" visibility="hidden"/>`;
  cfg.series.forEach((s, si) => {
    const Ys = s.axis === 2 ? Y2 : Y;
    const pts = s.data.map((v, i) => `${X(i)},${Ys(v)}`).join(' ');
    g += `<polyline class="ch-line" data-s="${si}" points="${pts}" fill="none" stroke="${s.color}" stroke-width="1.6"/>`;
    s.data.forEach((v, i) => {
      g += `<circle class="ch-dot" data-s="${si}" data-i="${i}" cx="${X(i)}" cy="${Ys(v)}" r="2.2" fill="${s.color}"/>`;
    });
  });

  const tip = chTip(el);
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">${g}</svg>`;
  el.appendChild(tip);

  const svg = el.querySelector('svg');
  const hidden = new Set();
  function applyLegend() {
    svg.querySelectorAll('.ch-line,.ch-dot').forEach((d) => {
      d.setAttribute('visibility', hidden.has(+d.dataset.s) ? 'hidden' : 'visible');
    });
    svg.querySelectorAll('.ch-lg').forEach((lgm) => {
      lgm.style.opacity = hidden.has(+lgm.dataset.s) ? 0.35 : 1;
    });
  }
  svg.addEventListener('click', (e) => {
    const lgm = e.target.closest('.ch-lg');
    if (!lgm) return;
    const si = +lgm.dataset.s;
    if (hidden.has(si)) hidden.delete(si); else hidden.add(si);
    applyLegend();
  });
  svg.addEventListener('mousemove', (e) => {
    const r = svg.getBoundingClientRect();
    const scale = r.width / W;
    const mx = (e.clientX - r.left) / scale;
    if (mx < pl - 6 || mx > W - pr + 6) return hide();
    const i = Math.max(0, Math.min(n - 1, Math.round(((mx - pl) / iw) * (n - 1))));
    const guide = svg.querySelector('.ch-guide');
    guide.setAttribute('x1', X(i)); guide.setAttribute('x2', X(i));
    guide.setAttribute('visibility', 'visible');
    svg.querySelectorAll('.ch-dot').forEach((d) => {
      d.setAttribute('r', +d.dataset.i === i ? 4 : 2.2);
    });
    const rows = cfg.series.map((s, si) => hidden.has(si) ? '' : `<div><i style="background:${s.color}"></i>${s.name}&nbsp;&nbsp;${s.data[i]}</div>`).join('');
    chTipShow(tip, `<div class="t">${cfg.x[i]}</div>${rows}`, e.clientX - r.left, e.clientY - r.top, { width: r.width, height: r.height });
  });
  function hide() {
    svg.querySelector('.ch-guide').setAttribute('visibility', 'hidden');
    svg.querySelectorAll('.ch-dot').forEach((d) => d.setAttribute('r', 2.2));
    chTipHide(tip);
  }
  svg.addEventListener('mouseleave', hide);
}

/* ---------- 环形图：cfg = { slices:[{name,value,color}] } ---------- */
function chDonut(el, cfg) {
  const S = 170, r = 56, sw = 30, C = 2 * Math.PI * r;
  const total = cfg.slices.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  let g = '';
  cfg.slices.forEach((sl, i) => {
    const dash = (sl.value / total) * C;
    if (dash > 0.01) {
      g += `<circle class="ch-arc" data-i="${i}" cx="${S / 2}" cy="${S / 2}" r="${r}" fill="none" stroke="${sl.color}" stroke-width="${sw}"
              stroke-dasharray="${dash} ${C - dash}" stroke-dashoffset="${-acc}"
              transform="rotate(-90 ${S / 2} ${S / 2})" style="transition:stroke-width .15s"/>`;
    }
    acc += dash;
  });
  const legend = cfg.slices
    .map((sl) => `<span class="lg"><i style="background:${sl.color}"></i>${sl.name} ${sl.value}</span>`)
    .join('');
  const tip = chTip(el);
  el.innerHTML =
    `<svg viewBox="0 0 ${S} ${S}" style="width:150px;height:150px;display:block;margin:6px auto 0">${g}</svg>` +
    `<div class="lg-row">${legend}</div>`;
  el.appendChild(tip);

  const svg = el.querySelector('svg');
  svg.addEventListener('mousemove', (e) => {
    const arc = e.target.closest('.ch-arc');
    svg.querySelectorAll('.ch-arc').forEach((a) => a.setAttribute('stroke-width', sw));
    if (!arc) return chTipHide(tip);
    arc.setAttribute('stroke-width', sw + 5);
    const sl = cfg.slices[+arc.dataset.i];
    const pct = ((sl.value / total) * 100).toFixed(1);
    const r2 = svg.getBoundingClientRect();
    chTipShow(tip, `<div><i style="background:${sl.color}"></i>${sl.name}&nbsp;&nbsp;${sl.value} (${pct}%)</div>`,
      e.clientX - r2.left, e.clientY - r2.top, { width: el.offsetWidth, height: el.offsetHeight });
  });
  svg.addEventListener('mouseleave', () => {
    svg.querySelectorAll('.ch-arc').forEach((a) => a.setAttribute('stroke-width', sw));
    chTipHide(tip);
  });
}

/* ---------- 横向条形图：cfg = { unit, max?, items:[[name,value]] } ---------- */
function chHBar(el, cfg) {
  const max = cfg.max || Math.max(...cfg.items.map((i) => i[1])) * 1.2 || 1;
  const rows = cfg.items
    .map(
      ([name, v], i) => `
      <div class="hb-row" data-i="${i}">
        <span class="hb-lb" title="${name}">${name}</span>
        <span class="hb-track"><i style="width:${Math.max(1, (v / max) * 100)}%"></i></span>
      </div>`
    )
    .join('');
  const tip = chTip(el);
  el.innerHTML = `
    <div class="hb-unit">${cfg.unit || ''}</div>
    ${rows}
    <div class="hb-axis"><span>0</span><span>${chFmt(max / 2, max)}</span><span>${chFmt(max, max)}</span></div>`;
  el.appendChild(tip);

  el.addEventListener('mousemove', (e) => {
    const row = e.target.closest('.hb-row');
    el.querySelectorAll('.hb-row').forEach((r) => r.classList.toggle('hot', r === row));
    if (!row) return chTipHide(tip);
    const [name, v] = cfg.items[+row.dataset.i];
    chTipShow(tip, `<div><i style="background:#3E9BE0"></i>${name}&nbsp;&nbsp;${v} ${cfg.unit || ''}</div>`,
      e.clientX - el.getBoundingClientRect().left, e.clientY - el.getBoundingClientRect().top,
      { width: el.offsetWidth, height: el.offsetHeight });
  });
  el.addEventListener('mouseleave', () => {
    el.querySelectorAll('.hb-row').forEach((r) => r.classList.remove('hot'));
    chTipHide(tip);
  });
}
