/* ============================================================
 * fh-chat.js — Shared AI Chat Engine for 4Helix Ventures
 * Injects CSS, wires up any .fh-chat-section found on the page.
 * ============================================================ */
(function(){
'use strict';

/* ── CSS ──────────────────────────────────────────────────── */
const CSS = `
.fh-chat-section{padding:60px 0;background:linear-gradient(180deg,rgba(8,13,28,1) 0%,rgba(13,20,40,1) 100%);position:relative;z-index:1}
.fh-chat-section .wrap{max-width:1160px;display:flex;flex-direction:row;gap:24px;align-items:flex-start}
.fh-chat-col{flex:1;min-width:0}
.fh-nav-panel{width:300px;flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:80px;max-height:calc(100vh - 120px);overflow:hidden}
.fh-nav-panel-inner{flex:1;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column;gap:10px;padding-right:14px}
.fh-nav-panel-inner::-webkit-scrollbar{display:none}
.fh-nav-panel-title{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);padding:4px 4px 10px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:2px}
.fh-nav-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;display:flex;align-items:flex-start;gap:11px;text-decoration:none;color:inherit;transition:background .2s,border-color .2s,transform .15s;cursor:pointer}
.fh-nav-card:hover{background:rgba(255,255,255,.07);transform:translateX(3px)}
.fh-nav-card-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.fh-nav-card-body{flex:1;min-width:0}
.fh-nav-card-name{font-size:12px;font-weight:600;color:var(--on-dark);margin-bottom:2px;line-height:1.35}
.fh-nav-card-tag{font-size:11px;color:var(--on-dark-mut);line-height:1.4}
.fh-nav-card-arrow{width:16px;height:16px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.2);font-size:12px;flex-shrink:0;margin-top:4px;transition:color .2s,transform .2s}
.fh-nav-card:hover .fh-nav-card-arrow{color:rgba(255,255,255,.65);transform:translateX(3px)}
.fh-nav-card[data-accent="teal"]{border-color:rgba(52,214,198,.18)}.fh-nav-card[data-accent="teal"]:hover{border-color:rgba(52,214,198,.45);background:rgba(52,214,198,.06)}
.fh-nav-card[data-accent="gold"]{border-color:rgba(240,180,41,.18)}.fh-nav-card[data-accent="gold"]:hover{border-color:rgba(240,180,41,.45);background:rgba(240,180,41,.06)}
.fh-nav-card[data-accent="lavender"]{border-color:rgba(142,155,255,.18)}.fh-nav-card[data-accent="lavender"]:hover{border-color:rgba(142,155,255,.45);background:rgba(142,155,255,.06)}
.fh-nav-card[data-accent="salmon"]{border-color:rgba(244,126,111,.18)}.fh-nav-card[data-accent="salmon"]:hover{border-color:rgba(244,126,111,.45);background:rgba(244,126,111,.06)}
.fh-nav-card-icon[data-accent="teal"]{background:rgba(52,214,198,.12)}.fh-nav-card-icon[data-accent="gold"]{background:rgba(240,180,41,.12)}.fh-nav-card-icon[data-accent="lavender"]{background:rgba(142,155,255,.12)}.fh-nav-card-icon[data-accent="salmon"]{background:rgba(244,126,111,.12)}
.fh-nav-badge{display:inline-block;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:2px 6px;border-radius:4px;margin-bottom:5px;font-weight:700}
.fh-nav-badge[data-accent="teal"]{background:rgba(52,214,198,.15);color:#34D6C6}.fh-nav-badge[data-accent="gold"]{background:rgba(240,180,41,.15);color:#F0B429}.fh-nav-badge[data-accent="lavender"]{background:rgba(142,155,255,.15);color:#8E9BFF}.fh-nav-badge[data-accent="salmon"]{background:rgba(244,126,111,.15);color:#F47E6F}
@media(max-width:900px){.fh-chat-section .wrap{flex-direction:column}.fh-nav-panel{width:100%;position:static;max-height:none}}
.fh-chat-header{margin-bottom:20px}
.fh-chat-title-row{display:flex;align-items:flex-start;gap:16px}
.fh-chat-logo-icon{width:44px;height:44px;background:rgba(52,214,198,.1);border:1px solid rgba(52,214,198,.25);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:4px}
.fh-chat-heading{font-family:var(--display);font-size:clamp(20px,2.8vw,28px);font-weight:600;letter-spacing:-.02em;color:var(--on-dark);margin-bottom:6px}
.fh-chat-sub{font-size:14px;color:var(--on-dark-mut);max-width:44em}
.fh-chat-badge{margin-left:auto;flex-shrink:0;background:rgba(52,214,198,.12);border:1px solid rgba(52,214,198,.3);color:var(--science);font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:999px;white-space:nowrap;display:flex;align-items:center;gap:6px}
.fh-chat-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--science);animation:fhChatPulse 1.8s ease-in-out infinite}
@keyframes fhChatPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
.fh-chat-box{background:rgba(8,13,28,.95);border-radius:16px;overflow:hidden;position:relative;border:1px solid transparent;background-clip:padding-box;box-shadow:0 0 0 1px rgba(52,214,198,.3),0 0 0 1px rgba(240,180,41,.15),0 4px 32px rgba(52,214,198,.08),0 4px 32px rgba(240,180,41,.06)}
.fh-chat-messages{min-height:160px;max-height:360px;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.fh-chat-messages::-webkit-scrollbar{display:none}.fh-chat-messages{-ms-overflow-style:none;scrollbar-width:none}
.fh-sb-track{position:absolute;right:6px;top:12px;bottom:12px;width:6px;border-radius:3px;background:linear-gradient(to bottom,#34D6C6 0%,#a8d8a8 40%,#d4d888 70%,#F0B429 100%);opacity:.25;pointer-events:none;z-index:10}
.fh-sb-thumb{position:absolute;right:6px;width:6px;border-radius:3px;background:#fff;opacity:.85;cursor:grab;z-index:11;min-height:28px;transition:opacity .15s,width .15s,right .15s;box-shadow:0 0 6px rgba(52,214,198,.6)}
.fh-sb-thumb:hover,.fh-sb-thumb.dragging{opacity:1;width:8px;right:5px;box-shadow:0 0 10px rgba(52,214,198,.9)}
.fh-sb-dot{position:absolute;right:4px;width:10px;height:10px;border-radius:50%;z-index:12;pointer-events:none;border:1.5px solid rgba(255,255,255,.4)}
.fh-sb-dot-top{top:8px;background:#34D6C6;box-shadow:0 0 5px rgba(52,214,198,.8)}
.fh-sb-dot-bot{bottom:8px;background:#F0B429;box-shadow:0 0 5px rgba(240,180,41,.8)}
.fh-msg{max-width:78%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.6;word-break:break-word}
.fh-msg.bot{align-self:flex-start;background:rgba(52,214,198,.1);border:1px solid rgba(52,214,198,.18);color:var(--on-dark)}
.fh-msg.user{align-self:flex-end;background:rgba(52,214,198,.22);border:1px solid rgba(52,214,198,.35);color:var(--on-dark)}
.fh-msg.typing{align-self:flex-start;background:rgba(52,214,198,.07);border:1px solid rgba(52,214,198,.12);padding:12px 18px}
.fh-typing-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--science);animation:fhTypingBounce .9s ease-in-out infinite;margin:0 2px}
.fh-typing-dot:nth-child(2){animation-delay:.18s}.fh-typing-dot:nth-child(3){animation-delay:.36s}
@keyframes fhTypingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.fh-chat-chips{padding:12px 24px 0;display:flex;flex-wrap:wrap;gap:8px}
.fh-chip{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);color:var(--on-dark-mut);font-size:13px;padding:6px 13px;border-radius:999px;cursor:pointer;transition:background .18s,border-color .18s,color .18s;white-space:nowrap}
.fh-chip:hover{background:rgba(52,214,198,.12);border-color:rgba(52,214,198,.4);color:var(--science)}
.fh-chat-input-row{display:flex;align-items:flex-end;gap:10px;padding:10px 16px;margin:0 16px 14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(52,214,198,.25);box-shadow:0 0 0 1px rgba(240,180,41,.1) inset,0 2px 16px rgba(52,214,198,.06);transition:border-color .25s,box-shadow .25s}
.fh-chat-input-row:focus-within{border-color:rgba(52,214,198,.55);box-shadow:0 0 0 1px rgba(240,180,41,.15) inset,0 2px 20px rgba(52,214,198,.14),0 0 12px rgba(52,214,198,.08)}
.fh-chat-input{flex:1;background:transparent;border:none;outline:none;color:var(--on-dark);font-family:var(--body);font-size:14px;line-height:1.55;resize:none;min-height:22px;max-height:120px;padding:4px 0;overflow-y:auto}
.fh-chat-input::placeholder{color:rgba(255,255,255,.35);font-style:italic}
.fh-chat-send{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#34D6C6 0%,#F0B429 100%);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .18s,transform .12s;padding:0}
.fh-chat-send:hover{opacity:.9;transform:scale(1.07)}.fh-chat-send:disabled{opacity:.35;cursor:default;transform:none}
.fh-chat-disclaimer{padding:8px 24px 14px;font-size:11px;color:var(--on-dark-mut);opacity:.6}
.fh-chat-cross-link{margin-top:8px;padding:8px 12px;background:rgba(240,180,41,.08);border:1px solid rgba(240,180,41,.2);border-radius:8px;font-size:12px;color:rgba(240,180,41,.85)}
.fh-chat-cross-link a{color:rgba(240,180,41,.9);text-decoration:underline}

.fh-sb-nav-track{position:absolute;right:4px;top:10px;bottom:10px;width:6px;border-radius:3px;background:linear-gradient(to bottom,#34D6C6 0%,#a8d8a8 40%,#d4d888 70%,#F0B429 100%);opacity:.25;pointer-events:none;z-index:10}
.fh-sb-nav-thumb{position:absolute;right:4px;width:6px;border-radius:3px;background:#fff;opacity:.85;cursor:grab;z-index:11;min-height:28px;transition:opacity .15s,width .15s,right .15s;box-shadow:0 0 6px rgba(52,214,198,.6)}
.fh-sb-nav-thumb:hover,.fh-sb-nav-thumb.dragging{opacity:1;width:8px;right:3px;box-shadow:0 0 10px rgba(52,214,198,.9)}
.fh-sb-nav-dot{position:absolute;right:2px;width:10px;height:10px;border-radius:50%;z-index:12;pointer-events:none;border:1.5px solid rgba(255,255,255,.3)}`;

/* ── Inject CSS once ─────────────────────────────────────── */
if (!document.getElementById('fh-chat-css')) {
  const st = document.createElement('style');
  st.id = 'fh-chat-css';
  st.textContent = CSS;
  document.head.appendChild(st);
}

/* ── Site map for cross-linking ──────────────────────────── */
const SITE_MAP = {
  modelo:   { url: 'Modelo.dc.html',    label_es: 'Modelo cuadruple helice',  label_en: 'Quadruple Helix Model',   keys: ['helice','cuadruple','modelo','ciencia industria'] },
  metodo:   { url: 'Metodo.dc.html',    label_es: 'Metodo TRL 1 a 9',            label_en: 'Method TRL 1 to 9',          keys: ['trl','etapa','metodo','laboratorio al mercado','escalado','descubrimiento','validacion'] },
  capital:  { url: 'Capital.dc.html',   label_es: 'Helice Capital y fondos',    label_en: 'Capital Helix and funds',   keys: ['capital','inversor','fondo','de-risking','inversion'] },
  ciencia:  { url: 'Ciencia.dc.html',   label_es: 'Helice Ciencia para investigadores', label_en: 'Science Helix for researchers', keys: ['investigador','spin-off','licencia','ip','patente','universidad'] },
  industria:{ url: 'Industria.dc.html', label_es: 'Helice Industria',           label_en: 'Industry Helix',          keys: ['empresa','industria','colabor','co-desarrollo','integracion','corporat'] },
  eje:      { url: 'Eje.dc.html',       label_es: '4Helix como Eje orquestador', label_en: '4Helix as the Axis',     keys: ['eje','orquest','traductor','alineacion'] },
  actualidad:{ url: 'Actualidad.dc.html', label_es: 'Convocatorias abiertas',  label_en: 'Open Calls',              keys: ['convocatoria','abierta','cdti','neotec','investeu','pathfinder','transition'] },
  topics:   { url: 'Topics.dc.html',    label_es: 'Topics Horizon Europe',      label_en: 'Topics Horizon Europe',   keys: ['topic','horizon','cluster','programa europ'] },
  casos:    { url: 'Casos.dc.html',     label_es: 'Casos de exito europeos',    label_en: 'European success cases',  keys: ['caso','exito','biontech','spin-off europ','referente','ecosistema'] },
  gateway:  { url: 'Gateway.html',      label_es: 'Gateway corporativo',         label_en: 'Corporate Gateway',       keys: ['gateway','reto corporat','corporaci','puerta directa'] },
  home:     { url: '4Helix Ventures.dc.html', label_es: 'Inicio 4Helix Ventures', label_en: 'Home 4Helix Ventures', keys: ['inicio','home','presentacion','quienes somos'] }
}

/* ── Section Metadata for Nav Panel ───────────────────────────────── */
const SECTION_META = {
  modelo:    { icon: '⬡', accent: 'teal',     tag_es: '4 helices: Ciencia, Capital, Industria, Gobierno', tag_en: '4 helices: Science, Capital, Industry, Gov' },
  metodo:    { icon: '⬆', accent: 'teal',     tag_es: 'Escala TRL 1→9 — del laboratorio al mercado',     tag_en: 'TRL scale 1→9 — from lab to market' },
  capital:   { icon: '◈', accent: 'gold',     tag_es: 'De-risking, inversores y fondos deeptech',         tag_en: 'De-risking, investors and deep-tech funds' },
  ciencia:   { icon: '✦', accent: 'teal',     tag_es: 'Spin-offs, licencias, patentes, transferencia IP', tag_en: 'Spin-offs, licenses, patents, IP transfer' },
  industria: { icon: '◉', accent: 'lavender', tag_es: 'Co-desarrollo e integracion corporativa',          tag_en: 'Co-development and corporate integration' },
  eje:       { icon: '✕', accent: 'salmon',   tag_es: '4Helix como orquestador del ecosistema',           tag_en: '4Helix as ecosystem orchestrator' },
  actualidad:{ icon: '◎', accent: 'gold',     tag_es: 'CDTI, Neotec, InvestEU, Pathfinder...',           tag_en: 'CDTI, Neotec, InvestEU, Pathfinder...' },
  topics:    { icon: '▣', accent: 'lavender', tag_es: 'Topics abiertos de Horizon Europe',               tag_en: 'Open Horizon Europe topics by cluster' },
  casos:     { icon: '★', accent: 'gold',     tag_es: 'Referentes europeos: ciencia al mercado',         tag_en: 'European references: science to market' },
  gateway:   { icon: '→', accent: 'salmon',   tag_es: 'Acceso corporativo — retos y colaboracion',       tag_en: 'Corporate access — challenges & collaboration' },
  home:      { icon: '◈', accent: 'teal',     tag_es: 'Inicio 4Helix Ventures',                         tag_en: 'Home 4Helix Ventures' }
};

/* ── Build Nav Panel DOM (once per initChat) ────────────────────── */
function buildNavPanel(section) {
  const wrap = section.querySelector('.wrap');
  if (!wrap || wrap.dataset.navBuilt) return;
  wrap.dataset.navBuilt = '1';
  const col = document.createElement('div');
  col.className = 'fh-chat-col';
  while (wrap.firstChild) col.appendChild(wrap.firstChild);
  wrap.appendChild(col);
  const panel = document.createElement('div');
  panel.className = 'fh-nav-panel';
  const titleEl = document.createElement('div');
  titleEl.className = 'fh-nav-panel-title';
  titleEl.textContent = '\u2014 Explorar la web';
  panel.appendChild(titleEl);
  const inner = document.createElement('div');
  inner.className = 'fh-nav-panel-inner';
  const lang = document.documentElement.lang || 'es';
  const isEN = lang.toLowerCase().startsWith('en');
  const defaults = ['metodo','modelo','capital','ciencia','industria','actualidad'];
  defaults.forEach(key => inner.appendChild(makeNavCard(key, isEN)));
  panel.appendChild(inner);
  wrap.appendChild(panel);
  buildNavScrollbar(panel, inner);
}

/* ── Create a nav card element ──────────────────────────────────── */
function makeNavCard(key, isEN) {
  const sm = SITE_MAP[key]; if (!sm) return document.createTextNode('');
  const meta = SECTION_META[key] || { icon: '→', accent: 'teal', tag_es: '', tag_en: '' };
  const card = document.createElement('a');
  card.className = 'fh-nav-card';
  card.href = sm.url;
  card.setAttribute('data-accent', meta.accent);
  const iconEl = document.createElement('div');
  iconEl.className = 'fh-nav-card-icon';
  iconEl.setAttribute('data-accent', meta.accent);
  iconEl.textContent = meta.icon;
  const body = document.createElement('div');
  body.className = 'fh-nav-card-body';
  const badge = document.createElement('span');
  badge.className = 'fh-nav-badge';
  badge.setAttribute('data-accent', meta.accent);
  badge.textContent = meta.accent.toUpperCase();
  const name = document.createElement('div');
  name.className = 'fh-nav-card-name';
  name.textContent = isEN ? sm.label_en : sm.label_es;
  const tag = document.createElement('div');
  tag.className = 'fh-nav-card-tag';
  tag.textContent = isEN ? meta.tag_en : meta.tag_es;
  body.appendChild(badge); body.appendChild(name); body.appendChild(tag);
  const arrow = document.createElement('div');
  arrow.className = 'fh-nav-card-arrow';
  arrow.textContent = '\u203a';
  card.appendChild(iconEl); card.appendChild(body); card.appendChild(arrow);
  return card;
}

/* ── Update Nav Panel after bot reply ───────────────────────────── */
function updateNavPanel(reply, section) {
  const panel = section.querySelector('.fh-nav-panel');
  if (!panel) return;
  const lang = document.documentElement.lang || 'es';
  const isEN = lang.toLowerCase().startsWith('en');
  const lower = reply.toLowerCase();
  const scores = {};
  Object.keys(SITE_MAP).forEach(key => {
    if (key === 'home') return;
    let score = 0;
    SITE_MAP[key].keys.forEach(kw => { if (lower.includes(kw)) score++; });
    scores[key] = score;
  });
  let ranked = Object.keys(scores).filter(k => scores[k] > 0)
    .sort((a,b) => scores[b]-scores[a]).slice(0,5);
  if (ranked.length === 0) ranked = ['metodo','modelo','capital','ciencia','actualidad'];
  const titleEl = panel.querySelector('.fh-nav-panel-title');
  if (titleEl) titleEl.textContent = '\u2014 Secciones relacionadas';
  let inner = panel.querySelector('.fh-nav-panel-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'fh-nav-panel-inner';
    panel.appendChild(inner);
  }
  inner.innerHTML = '';
  let delay = 0;
  ranked.forEach(key => {
    const card = makeNavCard(key, isEN);
    card.style.cssText = 'opacity:0;transform:translateX(14px)';
    inner.appendChild(card);
    const d = delay;
    setTimeout(() => {
      card.style.cssText = 'transition:opacity .3s ease '+d+'ms, transform .3s ease '+d+'ms;opacity:1;transform:translateX(0)';
    }, 50);
    delay += 60;
  });
  buildNavScrollbar(panel, inner);
}

/* ── Custom Scrollbar for Nav Panel ─────────────────────────────── */
function buildNavScrollbar(panel, inner) {
  panel.querySelectorAll('.fh-sb-nav-track,.fh-sb-nav-thumb,.fh-sb-nav-dot').forEach(el => el.remove());
  const track = document.createElement('div');
  track.className = 'fh-sb-nav-track';
  const thumb = document.createElement('div');
  thumb.className = 'fh-sb-nav-thumb';
  const dotTop = document.createElement('div');
  dotTop.className = 'fh-sb-nav-dot';
  dotTop.style.cssText = 'top:5px;background:#34D6C6;box-shadow:0 0 6px rgba(52,214,198,.7)';
  const dotBot = document.createElement('div');
  dotBot.className = 'fh-sb-nav-dot';
  dotBot.style.cssText = 'bottom:5px;background:#F0B429;box-shadow:0 0 6px rgba(240,180,41,.7)';
  panel.appendChild(track);
  panel.appendChild(thumb);
  panel.appendChild(dotTop);
  panel.appendChild(dotBot);
  function updateThumb() {
    const scrollH = inner.scrollHeight;
    const clientH = inner.clientHeight;
    const trackH = track.offsetHeight;
    if (scrollH <= clientH + 2) { thumb.style.display = 'none'; track.style.opacity = '.12'; return; }
    thumb.style.display = '';
    track.style.opacity = '.25';
    const ratio = clientH / scrollH;
    const thumbH = Math.max(28, trackH * ratio);
    const scrollRatio = inner.scrollTop / (scrollH - clientH);
    const thumbTop = track.offsetTop + scrollRatio * (trackH - thumbH);
    thumb.style.height = thumbH + 'px';
    thumb.style.top = thumbTop + 'px';
  }
  inner.addEventListener('scroll', updateThumb);
  new ResizeObserver(updateThumb).observe(inner);
  new MutationObserver(updateThumb).observe(inner, { childList: true, subtree: true });
  setTimeout(updateThumb, 80);
  let dragging = false, startY = 0, startST = 0;
  thumb.addEventListener('mousedown', e => {
    dragging = true; startY = e.clientY; startST = inner.scrollTop;
    thumb.classList.add('dragging'); e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const trackH = track.offsetHeight;
    const ratio = (inner.scrollHeight - inner.clientHeight) / (trackH - thumb.offsetHeight);
    inner.scrollTop = startST + (e.clientY - startY) * ratio;
  });
  document.addEventListener('mouseup', () => { dragging = false; thumb.classList.remove('dragging'); });
  track.addEventListener('click', e => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    inner.scrollTop = ((e.clientY - rect.top) / rect.height) * (inner.scrollHeight - inner.clientHeight);
  });
}
;

function detectCrossLinks(text, currentPage) {
  const t = (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const links = [];
  const lang = (document.documentElement.lang || 'es').toLowerCase();
  for (const [key, info] of Object.entries(SITE_MAP)) {
    if (info.url === currentPage) continue;
    if (info.keys.some(k => t.includes(k))) {
      links.push('<a href="' + info.url + '">' + (lang === 'en' ? info.label_en : info.label_es) + '</a>');
    }
  }
  return links;
}

/* ── Init chat for a given section element ───────────────── */
function initChat(section) {
  if (section.dataset.fhChatInit) return;
  section.dataset.fhChatInit = '1';

  const pageFile = location.pathname.split('/').pop() || '4Helix Ventures.dc.html';
  const msgArea  = section.querySelector('.fh-chat-messages');
  const input    = section.querySelector('.fh-chat-input');
  const sendBtn  = section.querySelector('.fh-chat-send');
  const chips    = section.querySelectorAll('.fh-chip');
  if (!msgArea || !input || !sendBtn) return;

  let history = [];
  const systemPrompt = section.dataset.systemPrompt || 'Eres el asistente experto de 4Helix Ventures en innovacion abierta. Responde de forma concisa, util y orientada a la accion.';

  function getLang(){ return (document.documentElement.lang || 'es').toLowerCase(); }

  function syncLang(){
    section.querySelectorAll('[data-es]').forEach(el => {
      const v = el.dataset[getLang()];
      if (v) el.textContent = v;
    });
    chips.forEach(chip => {
      const q = getLang() === 'en' ? chip.dataset.qEn : chip.dataset.qEs;
      if (q) chip.textContent = q.length > 38 ? q.substring(0,36) + '...' : q;
    });
  }
  document.querySelectorAll('[data-lang],[data-set-lang]').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(syncLang, 80));
  });
  syncLang();
  buildNavPanel(section);

  /* ── Custom Scrollbar ─────────────────────────────────── */
  (function buildScrollbar() {
    const box = section.querySelector('.fh-chat-box');
    if (!box) return;
    // Build DOM
    const track = document.createElement('div'); track.className = 'fh-sb-track';
    const thumb = document.createElement('div'); thumb.className = 'fh-sb-thumb';
    const dotTop = document.createElement('div'); dotTop.className = 'fh-sb-dot fh-sb-dot-top';
    const dotBot = document.createElement('div'); dotBot.className = 'fh-sb-dot fh-sb-dot-bot';
    box.appendChild(track); box.appendChild(thumb); box.appendChild(dotTop); box.appendChild(dotBot);

    function updateThumb() {
      const scrollH = msgArea.scrollHeight - msgArea.clientHeight;
      if (scrollH <= 0) { thumb.style.display = 'none'; return; }
      thumb.style.display = 'block';
      const trackH = track.offsetHeight;
      const ratio = msgArea.clientHeight / msgArea.scrollHeight;
      const thumbH = Math.max(28, trackH * ratio);
      const scrollRatio = msgArea.scrollTop / scrollH;
      const maxTop = trackH - thumbH;
      const topPx = scrollRatio * maxTop;
      thumb.style.height = thumbH + 'px';
      thumb.style.top = (track.offsetTop + topPx) + 'px';
    }

    msgArea.addEventListener('scroll', updateThumb);
    const ro = new ResizeObserver(updateThumb);
    ro.observe(msgArea);
    const mo = new MutationObserver(updateThumb);
    mo.observe(msgArea, { childList: true, subtree: true });

    // Drag to scroll
    let dragStartY = 0, dragStartScroll = 0;
    thumb.addEventListener('mousedown', function(e) {
      e.preventDefault();
      dragStartY = e.clientY;
      dragStartScroll = msgArea.scrollTop;
      thumb.classList.add('dragging');
      function onMove(ev) {
        const dy = ev.clientY - dragStartY;
        const trackH = track.offsetHeight;
        const thumbH = thumb.offsetHeight;
        const maxThumbTop = trackH - thumbH;
        const scrollH = msgArea.scrollHeight - msgArea.clientHeight;
        msgArea.scrollTop = dragStartScroll + (dy / maxThumbTop) * scrollH;
      }
      function onUp() {
        thumb.classList.remove('dragging');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    // Click on track to jump
    track.addEventListener('click', function(e) {
      const rect = track.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height;
      msgArea.scrollTop = ratio * (msgArea.scrollHeight - msgArea.clientHeight);
    });

    updateThumb();
  })();


  function addMsg(text, cls) {
    const d = document.createElement('div');
    d.className = 'fh-msg ' + cls;
    d.textContent = text;
    msgArea.appendChild(d);
    msgArea.scrollTop = msgArea.scrollHeight;
    return d;
  }

/* ── Typewriter effect for bot replies ─────────────────────────── */
function typewriterMsg(text, msgs) {
  const d = document.createElement('div');
  d.className = 'fh-msg bot';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  const words = text.split(' ');
  let idx = 0;
  const SPEED = 28; // ms per word
  function tick() {
    if (idx >= words.length) return;
    d.textContent += (idx === 0 ? '' : ' ') + words[idx];
    idx++;
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(tick, SPEED);
  }
  tick();
}

  async function sendMsg(text) {
    if (!text.trim()) return;
    input.value = '';
    input.style.height = '';
    sendBtn.disabled = true;
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = document.createElement('div');
    typing.className = 'fh-msg typing';
    typing.innerHTML = '<span class="fh-typing-dot"></span><span class="fh-typing-dot"></span><span class="fh-typing-dot"></span>';
    msgArea.appendChild(typing);
    msgArea.scrollTop = msgArea.scrollHeight;

    const endpoint = window.FH_ASSISTANT_ENDPOINT || '';
    let reply = '';
    if (!endpoint) {
      reply = getLang() === 'en'
        ? 'The assistant is not yet connected.'
        : 'El asistente no esta conectado aun.';
    } else {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lang: getLang(),
            message: text,
            history: history.slice(-10),
            systemPrompt: systemPrompt
          })
        });
        const data = await res.json();
        reply = data.reply || data.message || data.text || JSON.stringify(data);
      } catch (e) {
        reply = getLang() === 'en' ? 'Connection error. Please try again.' : 'Error de conexion. Intentalo de nuevo.';
      }
    }

    typing.remove();
    typewriterMsg(reply, msgArea)
    updateNavPanel(reply, section);;
    history.push({ role: 'assistant', content: reply });

    const crossLinks = detectCrossLinks(reply + ' ' + text, pageFile);
    if (crossLinks.length) {
      const div = document.createElement('div');
      div.className = 'fh-chat-cross-link';
      const intro = getLang() === 'en' ? 'Related sections: ' : 'Secciones relacionadas: ';
      div.innerHTML = intro + crossLinks.join(' / ');
      msgArea.appendChild(div);
      msgArea.scrollTop = msgArea.scrollHeight;
    }

    sendBtn.disabled = false;
  }

  sendBtn.addEventListener('click', () => sendMsg(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(input.value); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const lang = getLang();
      const q = lang === 'en' ? (chip.dataset.qEn || chip.textContent) : (chip.dataset.qEs || chip.textContent);
      sendMsg(q);
    });
  });
}

function autoInit() {
  document.querySelectorAll('.fh-chat-section').forEach(initChat);
}

/* Use MutationObserver so dc.html deferred renders are caught */
const _obs = new MutationObserver(() => {
  document.querySelectorAll('.fh-chat-section:not([data-fh-chat-init])').forEach(initChat);
});
_obs.observe(document.body, { childList: true, subtree: true });

/* Also run on DOMContentLoaded and immediately */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

})();
