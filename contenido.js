// Contenido editable del hub "Actualidad" de 4Helix Ventures.
// Para añadir una entrada: copia un bloque del array ENTRIES y edítalo.
// category: 'fondos' | 'casos' | 'analisis' | 'notas'
// Las fechas/importes de las convocatorias son ORIENTATIVOS — confirma en la web oficial.

export const CATEGORIES = {
  fondos:   { es: 'Fondos UE',       en: 'EU Funding',     rgb: '136,176,238' },
  casos:    { es: 'Casos de éxito',  en: 'Success cases',  rgb: '95,211,200' },
  analisis: { es: 'Análisis',        en: 'Analysis',       rgb: '230,192,116' },
  notas:    { es: 'Actualidad',      en: 'News',           rgb: '232,165,157' }
};

export const ENTRIES = [
  {
    id: 'eic-accelerator',
    category: 'fondos',
    date: '2026-06-10',
    featured: true,
    fund: {
      programa: 'Horizon Europe · EIC',
      estado: 'abierta',
      deadline: '2026-10-01',
      importe: 'Hasta €2,5M subvención + hasta €15M en equity',
      trl: 'TRL 5–8',
      url: 'https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_en'
    },
    es: {
      title: 'EIC Accelerator',
      issuer: 'Consejo Europeo de Innovación',
      summary: 'El instrumento estrella de la UE para deep-tech: financiación mixta (subvención + inversión) para escalar tecnologías disruptivas con alto riesgo y alto potencial.',
      body: [
        'El EIC Accelerator financia a pymes y startups individuales que desarrollan innovaciones disruptivas con potencial de crear nuevos mercados o transformar los existentes. Es el programa más competitivo y mejor dotado del ecosistema europeo de innovación.',
        'Combina una subvención de hasta 2,5 M€ para actividades de innovación (TRL 5–8) con una inversión directa en capital de hasta 15 M€ a través del EIC Fund, lo que lo hace idóneo para cruzar el valle de la muerte tecnológico.',
        'El proceso es por fases: formulario corto, propuesta completa y entrevista final ante un jurado. La tasa de éxito es baja, por lo que la calidad del caso de inversión y del equipo es determinante.'
      ],
      fit: 'Preparamos la propuesta de inversión, estructuramos el equipo y el plan de escalado, y alineamos la subvención con la ronda privada para maximizar tanto la nota como la captación.'
    },
    en: {
      title: 'EIC Accelerator',
      issuer: 'European Innovation Council',
      summary: "The EU's flagship deep-tech instrument: blended finance (grant + investment) to scale disruptive, high-risk high-potential technologies.",
      body: [
        'The EIC Accelerator funds individual SMEs and startups developing disruptive innovations with the potential to create new markets or transform existing ones. It is the most competitive and best-funded programme in the European innovation ecosystem.',
        'It combines a grant of up to €2.5M for innovation activities (TRL 5–8) with a direct equity investment of up to €15M through the EIC Fund, making it ideal for crossing the technological valley of death.',
        'The process is staged: short application, full proposal and a final jury interview. The success rate is low, so the quality of the investment case and the team is decisive.'
      ],
      fit: 'We prepare the investment proposal, structure the team and scale-up plan, and align the grant with the private round to maximise both the score and the capital raised.'
    }
  },
  {
    id: 'eic-pathfinder',
    category: 'fondos',
    date: '2026-05-28',
    featured: false,
    fund: {
      programa: 'Horizon Europe · EIC',
      estado: 'proxima',
      deadline: '2026-09-15',
      importe: 'Subvención de ~3–4 M€ por proyecto',
      trl: 'TRL 1–4',
      url: 'https://eic.ec.europa.eu/eic-funding-opportunities/eic-pathfinder_en'
    },
    es: {
      title: 'EIC Pathfinder',
      issuer: 'Consejo Europeo de Innovación',
      summary: 'Para ciencia en etapa temprana: financia la investigación radical y de alto riesgo que sienta las bases de tecnologías que aún no existen.',
      body: [
        'El EIC Pathfinder apoya la exploración de ideas científicas audaces para tecnologías radicalmente nuevas. Está dirigido a consorcios de investigación y equipos interdisciplinares en las fases más tempranas (TRL 1–4).',
        'Financia la prueba de los principios fundamentales de una tecnología, antes de que exista un producto o un mercado. Es el punto de partida natural para la ciencia que más tarde puede convertirse en una spin-off.',
        'Hay dos modalidades: Pathfinder Open (sin tema predefinido) y Pathfinder Challenges (retos estratégicos definidos por la UE).'
      ],
      fit: 'Identificamos la ciencia con potencial de mercado dentro del proyecto y aseguramos desde el inicio la propiedad intelectual y la estrategia de transferencia.'
    },
    en: {
      title: 'EIC Pathfinder',
      issuer: 'European Innovation Council',
      summary: 'For early-stage science: funds radical, high-risk research that lays the groundwork for technologies that do not yet exist.',
      body: [
        'The EIC Pathfinder supports the exploration of bold scientific ideas for radically new technologies. It targets research consortia and interdisciplinary teams at the earliest stages (TRL 1–4).',
        'It funds proving the fundamental principles of a technology, before a product or market exists. It is the natural starting point for science that can later become a spin-off.',
        'There are two strands: Pathfinder Open (no predefined topic) and Pathfinder Challenges (strategic challenges defined by the EU).'
      ],
      fit: 'We identify the market-relevant science within the project and secure intellectual property and a transfer strategy from the outset.'
    }
  },
  {
    id: 'eic-transition',
    category: 'fondos',
    date: '2026-05-12',
    featured: false,
    fund: {
      programa: 'Horizon Europe · EIC',
      estado: 'abierta',
      deadline: '2026-09-24',
      importe: 'Subvención de hasta 2,5 M€',
      trl: 'TRL 3–6',
      url: 'https://eic.ec.europa.eu/eic-funding-opportunities/eic-transition_en'
    },
    es: {
      title: 'EIC Transition',
      issuer: 'Consejo Europeo de Innovación',
      summary: 'El puente entre la prueba de concepto y el mercado: madura una tecnología validada en laboratorio y valida su modelo de negocio.',
      body: [
        'El EIC Transition financia la maduración de tecnologías que ya han demostrado su viabilidad en laboratorio (típicamente resultados de proyectos Pathfinder o ERC) hacia una innovación lista para el mercado.',
        'Cubre tanto la validación tecnológica en un entorno relevante como el desarrollo del caso de negocio y la estrategia de mercado, justo en el tramo (TRL 3–6) donde más proyectos se detienen.',
        'Es el complemento ideal antes de dar el salto al EIC Accelerator o a una ronda de inversión privada.'
      ],
      fit: 'Estructuramos la validación técnica y construimos el caso de negocio en paralelo, dejando el proyecto listo para el capital privado o el EIC Accelerator.'
    },
    en: {
      title: 'EIC Transition',
      issuer: 'European Innovation Council',
      summary: 'The bridge between proof of concept and market: matures a lab-validated technology and validates its business model.',
      body: [
        'The EIC Transition funds the maturation of technologies that have already proven feasibility in the lab (typically results from Pathfinder or ERC projects) toward a market-ready innovation.',
        'It covers both technology validation in a relevant environment and the development of the business case and market strategy, precisely in the stretch (TRL 3–6) where most projects stall.',
        'It is the ideal complement before jumping to the EIC Accelerator or a private investment round.'
      ],
      fit: 'We structure the technical validation and build the business case in parallel, leaving the project ready for private capital or the EIC Accelerator.'
    }
  },
  {
    id: 'cdti-neotec',
    category: 'fondos',
    date: '2026-04-30',
    featured: false,
    fund: {
      programa: 'CDTI · España',
      estado: 'cerrada',
      deadline: '2026-04-15',
      importe: 'Subvención de hasta €325.000 (70–85% del presupuesto)',
      trl: 'TRL 4–7',
      url: 'https://www.cdti.es'
    },
    es: {
      title: 'CDTI Neotec',
      issuer: 'Centro para el Desarrollo Tecnológico Industrial',
      summary: 'Subvención española para empresas jóvenes de base tecnológica: financia la puesta en marcha de proyectos empresariales basados en tecnología propia.',
      body: [
        'El programa Neotec del CDTI apoya la creación y consolidación de empresas de base tecnológica de reciente creación (menos de tres años), cuyo modelo de negocio se sustente en el desarrollo de tecnología.',
        'Financia hasta el 70–85 % del presupuesto del proyecto, con una subvención máxima en torno a los 325.000 €, destinada a poner en marcha el plan de empresa.',
        'Es una de las vías de entrada más relevantes para spin-offs académicas en España, habitualmente compatible con instrumentos europeos posteriores.'
      ],
      fit: 'Acompañamos a la spin-off en la solicitud y conectamos Neotec con el itinerario europeo posterior para no dejar huecos de financiación.'
    },
    en: {
      title: 'CDTI Neotec',
      issuer: 'Centre for the Development of Industrial Technology',
      summary: 'Spanish grant for young technology-based companies: funds launching business projects built on proprietary technology.',
      body: [
        'The CDTI Neotec programme supports the creation and consolidation of recently founded technology-based companies (less than three years old) whose business model rests on technology development.',
        'It funds up to 70–85% of the project budget, with a maximum grant of around €325,000, aimed at launching the business plan.',
        'It is one of the most relevant entry routes for academic spin-offs in Spain, usually compatible with later European instruments.'
      ],
      fit: 'We support the spin-off through the application and connect Neotec with the later European pathway so there are no funding gaps.'
    }
  },
  {
    id: 'innovation-fund',
    category: 'fondos',
    date: '2026-04-08',
    featured: false,
    fund: {
      programa: 'EU Innovation Fund',
      estado: 'proxima',
      deadline: '2026-11-12',
      importe: 'Subvención a gran escala (proyectos > €7,5M)',
      trl: 'TRL 7–9',
      url: 'https://climate.ec.europa.eu/eu-action/eu-funding-climate-action/innovation-fund_en'
    },
    es: {
      title: 'EU Innovation Fund',
      issuer: 'Comisión Europea · Acción por el Clima',
      summary: 'Uno de los mayores fondos del mundo para tecnologías limpias: financia la demostración a escala comercial de soluciones bajas en carbono.',
      body: [
        'El Innovation Fund financia la demostración de tecnologías innovadoras bajas en carbono cerca del mercado, con un foco en descarbonización industrial, renovables, almacenamiento de energía y captura de CO₂.',
        'Está orientado a proyectos maduros (TRL 7–9) y de gran envergadura, con subvenciones que cubren una parte significativa de los costes de capital y operación adicionales.',
        'Es la vía natural para tecnologías limpias que ya han cruzado el valle y necesitan capital para su primer despliegue a escala industrial.'
      ],
      fit: 'Evaluamos el encaje del proyecto, estructuramos el consorcio y preparamos el caso técnico-financiero para una subvención de gran escala.'
    },
    en: {
      title: 'EU Innovation Fund',
      issuer: 'European Commission · Climate Action',
      summary: "One of the world's largest clean-tech funds: finances commercial-scale demonstration of low-carbon solutions.",
      body: [
        'The Innovation Fund finances the demonstration of innovative low-carbon technologies close to market, focusing on industrial decarbonisation, renewables, energy storage and CO₂ capture.',
        'It targets mature (TRL 7–9), large-scale projects, with grants covering a significant share of the additional capital and operating costs.',
        'It is the natural route for clean technologies that have already crossed the valley and need capital for their first industrial-scale deployment.'
      ],
      fit: 'We assess the project fit, structure the consortium and prepare the technical-financial case for a large-scale grant.'
    }
  },
  {
    id: 'investeu',
    category: 'fondos',
    date: '2026-06-18',
    featured: false,
    fund: {
      programa: 'InvestEU',
      estado: 'abierta',
      deadline: null,
      importe: 'Financiación vía socios (préstamos, garantías y capital) — no es subvención',
      trl: 'TRL 8–9 · escalado',
      url: 'https://investeu.europa.eu/investeu-programme/investeu-fund_en'
    },
    es: {
      title: 'InvestEU',
      issuer: 'Comisión Europea · BEI y socios ejecutores',
      summary: 'No es una subvención: es una garantía de la UE que moviliza inversión privada y pública a través de socios financieros para proyectos en fase de escalado.',
      body: [
        'InvestEU moviliza inversión adicional mediante una garantía del presupuesto de la UE que respalda a socios ejecutores (el Grupo BEI y bancos nacionales de promoción), reduciendo su riesgo para que financien proyectos que el mercado no cubriría solo.',
        'No reparte subvenciones directas: canaliza préstamos, garantías y capital a través de esos socios, organizados en cuatro ventanas —infraestructura sostenible; investigación, innovación y digitalización; pymes; e inversión social y capacidades.',
        'Es la vía natural para tecnologías ya maduras (TRL 8–9) que necesitan financiación de escalado y despliegue, complementando a las subvenciones del EIC en etapas anteriores.'
      ],
      fit: 'Identificamos la ventana y el socio ejecutor adecuados, y preparamos el caso de inversión para acceder a financiación de escalado a través de InvestEU.'
    },
    en: {
      title: 'InvestEU',
      issuer: 'European Commission · EIB and implementing partners',
      summary: 'Not a grant: an EU budget guarantee that mobilises private and public investment through financial partners for scale-up projects.',
      body: [
        'InvestEU mobilises additional investment via an EU budget guarantee that backs implementing partners (the EIB Group and national promotional banks), lowering their risk so they finance projects the market would not cover alone.',
        'It does not hand out direct grants: it channels loans, guarantees and equity through those partners, organised in four windows —sustainable infrastructure; research, innovation and digitisation; SMEs; and social investment and skills.',
        'It is the natural route for already-mature technologies (TRL 8–9) that need scale-up and deployment financing, complementing EIC grants at earlier stages.'
      ],
      fit: 'We identify the right window and implementing partner, and prepare the investment case to access scale-up financing through InvestEU.'
    }
  }
];
