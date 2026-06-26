// fh-assistant.js — Agente flotante de 4Helix Ventures.
// Se auto-inserta en la página: botón flotante (abajo-derecha) que abre un chat.
// Demo: usa window.claude.complete (disponible en la vista previa). En el sitio
// desplegado, conecta una función serverless (ver setEndpoint más abajo).
(function () {
  'use strict';
  if (window.__fhAssistantLoaded) return;
  window.__fhAssistantLoaded = true;

  var T = {
    es: {
      label: 'Asistente', title: 'Asistente 4Helix', sub: 'Fondos UE · modelo · orientación',
      greeting: 'Hola 👋 Soy el asistente de 4Helix. Puedo orientarte sobre fondos europeos, el modelo de cuádruple hélice y cómo llevar tu ciencia al mercado. ¿En qué te ayudo?',
      placeholder: 'Escribe tu pregunta…', send: 'Enviar', thinking: 'Pensando…',
      suggestions: ['¿Qué fondo encaja con mi TRL?', '¿Spin-off o licencia?', '¿Qué es el EIC Accelerator?'],
      offline: 'El asistente funciona en la vista previa. En el sitio publicado se activará al conectar el backend (función serverless con la API del portal UE).',
      error: 'Ha habido un problema al responder. Inténtalo de nuevo en un momento.',
      disclaimer: 'Información orientativa — confirma siempre en el portal oficial de la UE.'
    },
    en: {
      label: 'Assistant', title: '4Helix Assistant', sub: 'EU funding · model · guidance',
      greeting: "Hi 👋 I'm the 4Helix assistant. I can guide you on European funding, the quadruple-helix model and how to take your science to market. How can I help?",
      placeholder: 'Type your question…', send: 'Send', thinking: 'Thinking…',
      suggestions: ['Which fund fits my TRL?', 'Spin-off or license?', 'What is the EIC Accelerator?'],
      offline: 'The assistant runs in the preview. On the published site it will activate once the backend is connected (serverless function with the EU portal API).',
      error: 'There was a problem answering. Please try again in a moment.',
      disclaimer: 'Indicative information — always confirm on the official EU portal.'
    }
  };

  function lang() {
    try { return (localStorage.getItem('fh_lang') === 'en') ? 'en' : 'es'; } catch (e) { return 'es'; }
  }

  var KNOWLEDGE = null; // built from contenido.js
  function loadKnowledge() {
    return import('./contenido.js').then(function (m) {
      var l = lang();
      KNOWLEDGE = m.ENTRIES.filter(function (e) { return e.category === 'fondos' && e.fund; }).map(function (e) {
        var c = e[l] || e.es;
        return '- ' + c.title + ' (' + e.fund.programa + '). Estado: ' + e.fund.estado +
          '. Cierre: ' + (e.fund.deadline || 'continua') + '. Financiación: ' + e.fund.importe +
          '. ' + e.fund.trl + '. ' + c.summary + ' Encaje 4Helix: ' + c.fit;
      }).join('\n');
      return KNOWLEDGE;
    }).catch(function () { KNOWLEDGE = ''; return ''; });
  }

  function systemPreamble(l) {
    var base = (l === 'en')
      ? "You are the assistant of 4Helix Ventures, a deep-tech venture builder that turns science into companies, helping researchers, companies and funds cross the technological valley of death. Answer in English, concise and practical (max ~120 words). Help with European and national funding and with the quadruple-helix model (science, industry, capital and 4Helix as the axis). Base funding answers on the calls listed below; never invent deadlines or amounts — if unsure, say so and recommend checking the official EU Funding & Tenders Portal (https://ec.europa.eu/info/funding-tenders/opportunities/portal). For anything beyond your scope, suggest contacting hola@4helixventures.com."
      : "Eres el asistente de 4Helix Ventures, un venture builder de deep-tech que convierte ciencia en empresas, ayudando a investigadores, empresas y fondos a cruzar el valle de la muerte tecnológico. Responde en español, breve y práctico (máx. ~120 palabras). Ayuda con financiación europea y nacional y con el modelo de cuádruple hélice (ciencia, industria, capital y 4Helix como eje). Fundamenta las respuestas de fondos en las convocatorias listadas abajo; nunca inventes fechas ni importes — si no estás seguro, dilo y recomienda consultar el portal oficial Funding & Tenders de la UE (https://ec.europa.eu/info/funding-tenders/opportunities/portal). Para lo que se salga de tu alcance, sugiere escribir a hola@4helixventures.com.";
    var kb = KNOWLEDGE ? ('\n\n' + (l === 'en' ? 'Open/known calls:' : 'Convocatorias conocidas:') + '\n' + KNOWLEDGE) : '';
    return base + kb;
  }

  function buildPrompt(history, l) {
    var convo = history.map(function (m) {
      return (m.role === 'user' ? (l === 'en' ? 'User: ' : 'Usuario: ') : (l === 'en' ? 'Assistant: ' : 'Asistente: ')) + m.text;
    }).join('\n');
    return systemPreamble(l) + '\n\n' + (l === 'en' ? 'Conversation so far:' : 'Conversación hasta ahora:') + '\n' + convo +
      '\n\n' + (l === 'en' ? 'Write the assistant\'s next reply only.' : 'Escribe solo la siguiente respuesta del asistente.');
  }

  // Override point for production. Either:
  //   window.FH_ASSISTANT_ENDPOINT = 'https://tu-worker.workers.dev'  (en fh-config.js, en cualquier sitio)
  //   o  window.fhAssistant.setEndpoint('https://tu-worker.workers.dev')
  var ENDPOINT = null;
  function currentEndpoint() {
    // Se lee EN VIVO cada vez, así el orden de carga de fh-config.js nunca importa.
    return ENDPOINT || (typeof window !== 'undefined' && window.FH_ASSISTANT_ENDPOINT) || null;
  }

  function ask(history, l) {
    var ep = currentEndpoint();
    if (ep) {
      var lastUser = '';
      for (var i = history.length - 1; i >= 0; i--) { if (history[i].role === 'user') { lastUser = history[i].text; break; } }
      var priorHistory = history.map(function (m) { return { role: m.role, content: m.text }; });
      return fetch(ep, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // Superconjunto: compatible con el Worker genérico ({message, history})
        // y con backend/worker.js de 4Helix ({lang, messages, context}).
        body: JSON.stringify({
          lang: l,
          messages: history,
          context: KNOWLEDGE || '',
          message: lastUser,
          history: priorHistory
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad-status');
        return r.json();
      }).then(function (d) { return d.reply || d.text || d.message || ''; });
    }
    if (window.claude && typeof window.claude.complete === 'function') {
      return window.claude.complete(buildPrompt(history, l));
    }
    return Promise.reject(new Error('no-backend'));
  }

  var EL = {};
  var state = { open: false, busy: false, history: [] };

  function el(tag, css, txt) { var n = document.createElement(tag); if (css) n.style.cssText = css; if (txt != null) n.textContent = txt; return n; }

  function logoSvg(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 40 40" style="display:block;overflow:visible">' +
      '<path d="M8 6 C8 18, 32 22, 32 34" fill="none" stroke="#34D6C6" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M32 6 C32 18, 8 22, 8 34" fill="none" stroke="#F0B429" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M8 6 C20 12, 20 28, 8 34" fill="none" stroke="#8E9BFF" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>' +
      '<path d="M32 6 C20 12, 20 28, 32 34" fill="none" stroke="#F47E6F" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>' +
      '<circle cx="20" cy="20" r="2.6" fill="#eef2f6"/></svg>';
  }

  function bubble(role, text) {
    var l = lang();
    var wrap = el('div', 'display:flex;margin:10px 0;' + (role === 'user' ? 'justify-content:flex-end' : 'justify-content:flex-start'));
    var b = el('div', 'max-width:84%;padding:11px 14px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;' +
      (role === 'user'
        ? 'background:linear-gradient(135deg,#cfe0ff,#88b0ee);color:#0d1422;border-bottom-right-radius:4px;'
        : 'background:rgba(255,255,255,0.06);color:#dfe4ea;border:1px solid rgba(255,255,255,0.08);border-bottom-left-radius:4px;'), text);
    wrap.appendChild(b);
    return wrap;
  }

  function render() {
    var l = lang(), t = T[l];
    EL.msgs.innerHTML = '';
    state.history.forEach(function (m) { EL.msgs.appendChild(bubble(m.role, m.text)); });
    if (state.busy) {
      var thinking = el('div', 'display:flex;margin:10px 0;justify-content:flex-start');
      thinking.appendChild(el('div', 'padding:11px 14px;border-radius:14px;font-size:13px;color:#9aa7b6;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08)', t.thinking));
      EL.msgs.appendChild(thinking);
    }
    // suggestions only before first user message
    EL.sugg.innerHTML = '';
    var hasUser = state.history.some(function (m) { return m.role === 'user'; });
    EL.sugg.style.display = hasUser ? 'none' : 'flex';
    if (!hasUser) {
      t.suggestions.forEach(function (s) {
        var chip = el('button', 'background:rgba(136,176,238,0.12);border:1px solid rgba(136,176,238,0.3);color:#cfe0ff;font:500 12.5px Hanken Grotesk,system-ui,sans-serif;padding:7px 12px;border-radius:999px;cursor:pointer;text-align:left', s);
        chip.onclick = function () { submit(s); };
        EL.sugg.appendChild(chip);
      });
    }
    EL.msgs.scrollTop = EL.msgs.scrollHeight;
  }

  function submit(text) {
    text = (text || EL.input.value || '').trim();
    if (!text || state.busy) return;
    var l = lang(), t = T[l];
    state.history.push({ role: 'user', text: text });
    EL.input.value = '';
    state.busy = true; render();
    ask(state.history.slice(-8), l).then(function (reply) {
      state.busy = false;
      state.history.push({ role: 'assistant', text: (reply || '').trim() || t.error });
      render();
    }).catch(function (e) {
      state.busy = false;
      var msg = (e && e.message === 'no-backend') ? t.offline : t.error;
      state.history.push({ role: 'assistant', text: msg });
      render();
    });
  }

  function toggle(open) {
    state.open = (open == null) ? !state.open : open;
    EL.panel.style.transform = state.open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)';
    EL.panel.style.opacity = state.open ? '1' : '0';
    EL.panel.style.pointerEvents = state.open ? 'auto' : 'none';
    EL.btn.style.transform = state.open ? 'scale(0.9)' : 'scale(1)';
    if (state.open) {
      if (!state.history.length) state.history.push({ role: 'assistant', text: T[lang()].greeting });
      render();
      setTimeout(function () { EL.input.focus(); }, 60);
    }
  }

  function build() {
    var l = lang(), t = T[l];
    var root = el('div', 'position:fixed;right:22px;bottom:22px;z-index:2147483000;font-family:Hanken Grotesk,system-ui,sans-serif');

    // panel
    var panel = el('div', 'position:absolute;right:0;bottom:74px;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;background:#0b1320;border:1px solid rgba(220,225,232,0.12);border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,0.5);overflow:hidden;opacity:0;transform:translateY(16px) scale(0.96);pointer-events:none;transition:opacity .25s ease,transform .25s ease');
    EL.panel = panel;

    var header = el('div', 'display:flex;align-items:center;gap:11px;padding:15px 16px;border-bottom:1px solid rgba(220,225,232,0.08);background:rgba(255,255,255,0.02)');
    var mark = el('div', 'width:30px;height:30px;flex:none'); mark.innerHTML = logoSvg(30);
    var htxt = el('div', 'flex:1;min-width:0');
    htxt.appendChild(el('div', "font:600 14.5px 'Space Grotesk',system-ui,sans-serif;color:#eef2f6", t.title));
    htxt.appendChild(el('div', 'font:400 11px IBM Plex Mono,monospace;letter-spacing:0.04em;color:#8aa0b8;margin-top:2px', t.sub));
    var close = el('button', 'background:transparent;border:none;color:#8aa0b8;font-size:22px;line-height:1;cursor:pointer;padding:4px', '×');
    close.onclick = function () { toggle(false); };
    header.appendChild(mark); header.appendChild(htxt); header.appendChild(close);

    var msgs = el('div', 'flex:1;overflow-y:auto;padding:14px 16px'); EL.msgs = msgs;

    var sugg = el('div', 'display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 10px'); EL.sugg = sugg;

    var inputRow = el('div', 'display:flex;gap:8px;align-items:flex-end;padding:12px 14px;border-top:1px solid rgba(220,225,232,0.08);background:rgba(255,255,255,0.02)');
    var input = el('textarea', 'flex:1;resize:none;height:42px;max-height:120px;padding:11px 12px;border-radius:12px;border:1px solid rgba(220,225,232,0.14);background:rgba(13,18,28,0.7);color:#e8eaed;font:400 14px Hanken Grotesk,system-ui,sans-serif;outline:none'); EL.input = input;
    input.placeholder = t.placeholder;
    input.addEventListener('input', function () { input.style.height = '42px'; input.style.height = Math.min(120, input.scrollHeight) + 'px'; });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
    var sendBtn = el('button', 'flex:none;width:42px;height:42px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,#cfe0ff,#88b0ee);color:#0d1422;font-size:17px');
    sendBtn.innerHTML = '↑'; sendBtn.title = t.send; sendBtn.onclick = function () { submit(); };
    inputRow.appendChild(input); inputRow.appendChild(sendBtn);

    var disc = el('div', 'font:400 10px IBM Plex Mono,monospace;color:#5d748c;text-align:center;padding:0 16px 10px;background:rgba(255,255,255,0.02)', t.disclaimer);

    panel.appendChild(header); panel.appendChild(msgs); panel.appendChild(sugg); panel.appendChild(inputRow); panel.appendChild(disc);

    // launcher button
    var btn = el('button', 'display:flex;align-items:center;gap:9px;height:52px;padding:0 18px 0 14px;border-radius:999px;border:1px solid rgba(136,176,238,0.4);cursor:pointer;background:rgba(11,19,32,0.92);backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,0.4),0 0 22px rgba(136,176,238,0.25);transition:transform .2s ease'); EL.btn = btn;
    var bmark = el('span', 'width:26px;height:26px;flex:none'); bmark.innerHTML = logoSvg(26);
    btn.appendChild(bmark);
    btn.appendChild(el('span', "font:600 14px 'Space Grotesk',system-ui,sans-serif;color:#e9ecf6", t.label));
    btn.onclick = function () { toggle(); };
    btn.onmouseenter = function () { if (!state.open) btn.style.transform = 'scale(1.04)'; };
    btn.onmouseleave = function () { if (!state.open) btn.style.transform = 'scale(1)'; };

    root.appendChild(panel); root.appendChild(btn);
    document.body.appendChild(root);
    EL.root = root;
  }

  window.fhAssistant = {
    open: function () { toggle(true); },
    close: function () { toggle(false); },
    setEndpoint: function (url) { ENDPOINT = url; }
  };

  function init() { loadKnowledge(); build(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
