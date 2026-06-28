/**
 * Corporate Innovation Gateway — Backend de ejemplo (Cloudflare Worker)
 * ---------------------------------------------------------------------
 * Esta pequeña función es el "puente" seguro entre tu web estática (gateway.html)
 * y el proveedor de IA (Anthropic). Guarda tu API key EN SECRETO en el servidor,
 * de modo que NUNCA aparece en el código público de tu web.
 *
 * El asistente del Gateway envía aquí (POST) un JSON con:
 *   { lang, profile:{sector,region,trl,type}, project:"texto", opportunities:[...] }
 * y este Worker responde con:
 *   { reply: "texto de recomendaciones generado por la IA" }
 *
 * ─────────────────────────────────────────────────────────────────────
 * CÓMO DESPLEGARLO (gratis, ~5 minutos):
 * 1. Crea una cuenta en https://dash.cloudflare.com  ->  Workers & Pages.
 * 2. "Create Worker", pega este archivo completo y despliega (Deploy).
 * 3. En Settings -> Variables and Secrets, añade un SECRET llamado
 *    ANTHROPIC_API_KEY con tu clave (la obtienes en https://console.anthropic.com).
 * 4. Copia la URL del Worker (algo como https://gateway-ia.TUNOMBRE.workers.dev).
 * 5. En tu web Gateway, pulsa "⚙ Conectar IA real (backend)", pega esa URL y guarda.
 *    A partir de ahí el asistente usará IA real en vez del motor local.
 *
 * SEGURIDAD: cambia ALLOWED_ORIGIN por el dominio real de tu web cuando publiques
 * (p. ej. "https://4helixventures.com"), para que solo tu web pueda usar el backend.
 */

const ALLOWED_ORIGIN = "*"; // CAMBIAR por tu dominio en producción
const MODEL = "claude-haiku-4-5-20251001"; // económico; puedes subir a sonnet/opus

function cors() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }
    if (request.method !== "POST") {
      return new Response("Use POST", { status: 405, headers: cors() });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "JSON inválido" }, 400);
    }

    const lang = body.lang === "en" ? "en" : "es";
    const project = (body.project || "").slice(0, 2000);
    const profile = body.profile || {};
    const ops = Array.isArray(body.opportunities) ? body.opportunities.slice(0, 120) : [];

    // Construimos un catálogo compacto para el modelo
    const catalog = ops
      .map(
        (o, i) =>
          `${i + 1}. ${o.name} — ${o.program} | ${o.region} | ${o.sector} | ${o.type} | ${o.url}\n   ${o.about}`
      )
      .join("\n");

    const system =
      lang === "es"
        ? `Eres el asistente de "Corporate Innovation Gateway" de 4Helix Ventures. Tu trabajo es ayudar a investigadores, startups y empresas a encontrar, dentro del CATÁLOGO de programas de open innovation que se te da, los que mejor encajan con su proyecto. Reglas: (1) Recomienda SOLO programas que aparezcan en el catálogo; nunca inventes programas ni URLs. (2) Elige entre 3 y 6 que mejor encajen por sector, región, fase de madurez (TRL) y tipo. (3) Para cada uno, explica en 1-2 frases por qué encaja y añade su URL tal cual. (4) Sé concreto, honesto y útil; si nada encaja bien, dilo y sugiere ampliar criterios. (5) Responde en español, en texto claro, sin markdown complejo.`
        : `You are the "Corporate Innovation Gateway" assistant by 4Helix Ventures. Your job is to help researchers, startups and companies find, within the given CATALOG of open-innovation programmes, the ones that best fit their project. Rules: (1) Recommend ONLY programmes present in the catalog; never invent programmes or URLs. (2) Pick the 3-6 best matches by sector, region, maturity stage (TRL) and type. (3) For each, explain in 1-2 sentences why it fits and include its URL as-is. (4) Be specific, honest and useful; if nothing fits well, say so and suggest widening the criteria. (5) Answer in English, in clear prose, without heavy markdown.`;

    const userMsg =
      (lang === "es"
        ? `PERFIL DEL USUARIO:\n- Sector: ${profile.sector}\n- Región objetivo: ${profile.region}\n- Fase TRL: ${profile.trl}\n- Tipo buscado: ${profile.type}\n\nDESCRIPCIÓN DEL PROYECTO:\n${project || "(sin descripción)"}\n\n`
        : `USER PROFILE:\n- Sector: ${profile.sector}\n- Target region: ${profile.region}\n- TRL stage: ${profile.trl}\n- Desired type: ${profile.type}\n\nPROJECT DESCRIPTION:\n${project || "(no description)"}\n\n`) +
      (lang === "es" ? `CATÁLOGO DE PROGRAMAS:\n` : `PROGRAMME CATALOG:\n`) +
      catalog;

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system,
          messages: [{ role: "user", content: userMsg }],
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        return json({ error: "Proveedor IA: " + r.status, detail: t.slice(0, 300) }, 502);
      }
      const data = await r.json();
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return json({ reply });
    } catch (e) {
      return json({ error: "Error de red", detail: String(e).slice(0, 200) }, 502);
    }

    function json(obj, status = 200) {
      return new Response(JSON.stringify(obj), {
        status,
        headers: { "content-type": "application/json", ...cors() },
      });
    }
  },
};
