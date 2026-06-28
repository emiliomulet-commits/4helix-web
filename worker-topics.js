// ============================================================================
// worker-topics.js — Feed en vivo de "Topics 2026-2027" · 4Helix Ventures
// FUENTE: Apify · actor "studio-amba/eu-funding-tenders-scraper"
//   (consulta el índice SEDIA del EU Funding & Tenders Portal desde su
//    servidor, donde el query SÍ se construye bien, y devuelve JSON limpio).
//   La llamada a Apify es un POST JSON normal → sin el problema de multipart
//   que rompía la consulta directa a SEDIA desde Cloudflare Workers.
//
// Devuelve: { topics: [...], total: N, debug: {...} }, con CORS abierto.
// Cada topic en español (lo que consume la web):
//   codigo, titulo, programa, cluster, anio, estado,
//   apertura, cierre, presupuesto {es,en}, trl, resumen, palabrasClave, enlace
//
// ─── QUÉ NECESITAS HACER (10 min) ──────────────────────────────────────────
//  1) Crea una cuenta gratis en https://apify.com y copia tu API token
//     (Settings → Integrations → API token).
//  2) En el Worker `fh-topics` de Cloudflare:
//     Settings → Variables and Secrets → Add → tipo "Secret"
//       Nombre:  APIFY_TOKEN     Valor: <tu token de Apify>
//  3) Pega este archivo COMPLETO en el Worker (Ctrl+A → pegar → Deploy).
//  4) Abre https://fh-topics.emilio-mulet.workers.dev y pega aquí el JSON
//     (sobre todo el bloque "debug": me dice los nombres reales de los campos
//      del actor para clavar el mapeo en un solo intento).
// ============================================================================

const APIFY_ACTOR = 'studio-amba~eu-funding-tenders-scraper'; // '/' → '~' en la URL
const APIFY_URL = (token) =>
  'https://api.apify.com/v2/acts/' + APIFY_ACTOR + '/run-sync-get-dataset-items?token=' + token;

// Entrada para el actor. Ajusta las claves a su esquema documentado si hace falta
// (lo confirmamos con el primer "debug.sampleKeys").
const ACTOR_INPUT = {
  status: ['Open', 'Forthcoming'],
  opportunityType: ['Grant'],
  maxItems: 200
};

// ── helpers ────────────────────────────────────────────────────────────────
function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== '') return obj[k];
  }
  return null;
}
function asArr(v) { return Array.isArray(v) ? v : (v == null ? [] : [v]); }
function stripHtml(s) { return String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
function d10(s) { return s ? String(s).slice(0, 10) : null; }

function programFromId(id) {
  const s = (id || '').toUpperCase();
  if (s.startsWith('HORIZON')) return 'he';
  if (s.startsWith('EIC')) return 'eic';
  if (s.startsWith('DIGITAL')) return 'digital';
  if (s.startsWith('LIFE')) return 'life';
  if (s.startsWith('EDF')) return 'edf';
  if (s.startsWith('ERASMUS')) return 'erasmus';
  if (s.startsWith('CEF')) return 'cef';
  if (s.startsWith('INNOVFUND') || s.startsWith('INNOVATION')) return 'innovfund';
  return 'otros';
}
function clusterFromId(id) { const m = (id || '').toUpperCase().match(/CL(\d)/); return m ? 'cl' + m[1] : null; }
function yearFromId(id) { const m = (id || '').match(/20(2[5-9]|3\d)/); return m ? parseInt(m[0], 10) : null; }

const STATUS_MAP = {
  'open': 'Abierta', 'forthcoming': 'Próxima', 'closed': 'Cerrada',
  '31094501': 'Próxima', '31094502': 'Abierta', '31094503': 'Cerrada'
};

function normalizeTopic(it) {
  const codigo = pick(it, ['identifier', 'topicCode', 'code', 'reference', 'callIdentifier']) || '';
  if (!codigo) return null;
  const estadoRaw = String(pick(it, ['status', 'statusLabel', 'callStatus']) || '').toLowerCase();
  const presupRaw = pick(it, ['budget', 'budgetOverview', 'totalBudget', 'budgetAmount']);
  const presupuesto = (presupRaw && typeof presupRaw === 'object' && presupRaw.es)
    ? presupRaw
    : { es: presupRaw ? String(presupRaw) : '—', en: presupRaw ? String(presupRaw) : '—' };
  let kws = pick(it, ['keywords', 'tags', 'destination']);
  kws = asArr(kws).map((k) => (typeof k === 'object' ? (k.label || k.name || '') : k)).filter(Boolean);

  return {
    codigo: codigo,
    titulo: stripHtml(pick(it, ['title', 'topicTitle', 'name']) || codigo),
    programa: programFromId(codigo),
    cluster: clusterFromId(codigo),
    anio: yearFromId(codigo),
    estado: STATUS_MAP[estadoRaw] || (estadoRaw ? (estadoRaw[0].toUpperCase() + estadoRaw.slice(1)) : null),
    apertura: d10(pick(it, ['plannedOpeningDate', 'openingDate', 'startDate', 'publicationDate'])),
    cierre: d10(pick(it, ['deadlineDate', 'deadline', 'submissionDeadline', 'closingDate'])),
    presupuesto: presupuesto,
    trl: pick(it, ['trl', 'trlRange']) || null,
    resumen: stripHtml(pick(it, ['description', 'summary', 'descriptionByte', 'objective']) || '').slice(0, 320),
    palabrasClave: kws,
    enlace: pick(it, ['url', 'link', 'topicUrl', 'detailUrl']) ||
      ('https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/' + codigo.toLowerCase())
  };
}

async function fetchTopics(env) {
  const token = (env && env.APIFY_TOKEN) || '';
  if (!token) throw new Error('Falta APIFY_TOKEN (añádelo como Secret en el Worker).');

  const resp = await fetch(APIFY_URL(token), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ACTOR_INPUT)
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error('Apify ' + resp.status + ': ' + body.slice(0, 300));
  }
  const items = await resp.json(); // run-sync-get-dataset-items devuelve el array directamente
  const arr = Array.isArray(items) ? items : (items.items || items.results || []);

  const debug = {
    rawTotal: arr.length,
    sampleKeys: arr[0] ? Object.keys(arr[0]).slice(0, 30) : [],
    rawSample: arr.slice(0, 1)
  };

  const KNOWN = /^(HORIZON|EIC|DIGITAL|LIFE|CEF|EDF|ERASMUS|INNOVFUND|EU4H|JUST|CERV|SMP|I3)/i;
  const seen = new Set();
  const topics = [];
  for (const it of arr) {
    const t = normalizeTopic(it);
    if (!t || !t.codigo || seen.has(t.codigo)) continue;
    if (!KNOWN.test(t.codigo)) continue;
    seen.add(t.codigo);
    topics.push(t);
  }
  topics.sort((a, b) => {
    if (!a.cierre) return 1;
    if (!b.cierre) return -1;
    return new Date(a.cierre) - new Date(b.cierre);
  });
  topics._debug = debug;
  return topics;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    try {
      const topics = await fetchTopics(env);
      const debug = topics._debug; try { delete topics._debug; } catch (e) {}
      return new Response(JSON.stringify({ topics: topics, total: topics.length, debug: debug }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    } catch (err) {
      return new Response(JSON.stringify({ topics: [], total: 0, error: String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS }
      });
    }
  }
};

// ----------------------------------------------------------------------------
// AJUSTE FINO (un solo paso): cuando /topics devuelva el primer "debug":
//   - "sampleKeys" lista los nombres REALES de los campos del actor.
//   - Si algún campo no encaja (p. ej. el código se llama "topicIdentifier"),
//     añádelo a la lista pick(...) correspondiente en normalizeTopic().
//   - "ACTOR_INPUT" puede necesitar otras claves según el esquema del actor
//     (mira su página en apify.com/store → pestaña "Input").
// ----------------------------------------------------------------------------
