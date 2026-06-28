// ============================================================
//  CONFIGURACIÓN DEL ASISTENTE IA — 4Helix Ventures
// ============================================================
//  Pega aquí la URL de tu Cloudflare Worker (ver backend/README.md)
//  para activar el chat en el sitio publicado. Solo esta línea.
//
//  Ejemplo:
//    window.FH_ASSISTANT_ENDPOINT = 'https://4helix-asistente.tu-cuenta.workers.dev';
//
//  Déjalo vacío ('') mientras no tengas el Worker: el asistente
//  seguirá funcionando y mostrará un aviso amable.
// ============================================================
window.FH_ASSISTANT_ENDPOINT = 'https://chat-ai-worker.emilio-mulet.workers.dev/chat';

// ============================================================
//  FEED EN VIVO DE TOPICS (Portal UE · SEDIA) — sección Topics
//  Pega la URL del Worker /topics para activar el feed en vivo.
//  Déjalo vacío ('') para mostrar la selección curada (demo).
//  Ejemplo:
//    window.FH_TOPICS_ENDPOINT = 'https://chat-ai-worker.emilio-mulet.workers.dev/topics';
// ============================================================
window.FH_TOPICS_ENDPOINT = 'https://fh-topics.emilio-mulet.workers.dev';
