/* ============================================================
 * fh-chat.js — Shared AI Chat Engine for 4Helix Ventures
 * Injects CSS, wires up any .fh-chat-section found on the page.
 * ============================================================ */
(function(){
'use strict';

/* ── CSS ──────────────────────────────────────────────────── */
const CSS = `
.fh-chat-section{padding:60px 0;background:linear-gradient(180deg,rgba(8,13,28,1) 0%,rgba(13,20,40,1) 100%);position:relative;z-index:1}
.fh-chat-section .wrap{max-width:860px}
.fh-chat-header{margin-bottom:20px}
.fh-chat-title-row{display:flex;align-items:flex-start;gap:16px}
.fh-chat-logo-icon{width:44px;height:44px;background:rgba(52,214,198,.1);border:1px solid rgba(52,214,198,.25);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:4px}
.fh-chat-heading{font-family:var(--display);font-size:clamp(20px,2.8vw,28px);font-weight:600;letter-spacing:-.02em;color:var(--on-dark);margin-bottom:6px}
.fh-chat-sub{font-size:14px;color:var(--on-dark-mut);max-width:44em}
.fh-chat-badge{margin-left:auto;flex-shrink:0;background:rgba(52,214,198,.12);border:1px solid rgba(52,214,198,.3);color:var(--science);font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:999px;white-space:nowrap;display:flex;align-items:center;gap:6px}
.fh-chat-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--science);animation:fhChatPulse 1.8s ease-in-out infinite}
@keyframes fhChatPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
.fh-chat-box{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden}
.fh-chat-messages{min-height:160px;max-height:360px;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.fh-chat-messages::-webkit-scrollbar{width:8px}.fh-chat-messages::-webkit-scrollbar-track{background:rgba(6,19,34,.8);border-radius:4px}.fh-chat-messages::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#34D6C6 0%,#a8d8a8 40%,#d4d888 70%,#F0B429 100%);border-radius:4px;border:1px solid rgba(255,255,255,.15)}.fh-chat-messages::-webkit-scrollbar-thumb:hover{background:linear-gradient(to bottom,#3ee8d7 0%,#b8e8b8 40%,#e4e898 70%,#f5c43e 100%)}
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
.fh-chat-input-row{display:flex;align-items:flex-end;gap:10px;padding:14px 20px 14px;border-top:1px solid rgba(255,255,255,.07)}
.fh-chat-input{flex:1;background:transparent;border:none;outline:none;color:var(--on-dark);font-family:var(--body);font-size:14px;line-height:1.55;resize:none;min-height:22px;max-height:120px;padding:0;overflow-y:auto}
.fh-chat-input::placeholder{color:var(--on-dark-mut)}
.fh-chat-send{width:36px;height:36px;border-radius:50%;background:var(--science);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .18s;padding:0}
.fh-chat-send:hover{opacity:.85}.fh-chat-send:disabled{opacity:.4;cursor:default}
.fh-chat-disclaimer{padding:8px 24px 14px;font-size:11px;color:var(--on-dark-mut);opacity:.6}
.fh-chat-cross-link{margin-top:8px;padding:8px 12px;background:rgba(240,180,41,.08);border:1px solid rgba(240,180,41,.2);border-radius:8px;font-size:12px;color:rgba(240,180,41,.85)}
.fh-chat-cross-link a{color:rgba(240,180,41,.9);text-decoration:underline}
`;

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
};

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

  function addMsg(text, cls) {
    const d = document.createElement('div');
    d.className = 'fh-msg ' + cls;
    d.textContent = text;
    msgArea.appendChild(d);
    msgArea.scrollTop = msgArea.scrollHeight;
    return d;
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
    addMsg(reply, 'bot');
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
