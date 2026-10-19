/**
 * constant-history (CHIST) - Curated Metrological Corpus of Fundamental Physical Constants
 * Contains historical measurements, CODATA adjustments, and CGPM definition milestones.
 */

const CONSTANTS_CORPUS = {
  constants: [
    {
      id: "G",
      symbol: "G",
      latex: "G",
      name: "Constante de Gravitación Newtoniana",
      category: "Gravitación",
      si_unit: "m³ · kg⁻¹ · s⁻²",
      current_status: "Medición experimental (Incertidumbre abierta)",
      description: "Constante empírica fundamental que determina la intensidad de la interacción gravitatoria entre masas según la Ley de Gravitación Universal y la Relatividad General de Einstein."
    },
    {
      id: "c",
      symbol: "c",
      latex: "c",
      name: "Velocidad de la Luz en el Vacío",
      category: "Electromagnetismo / Relatividad",
      si_unit: "m · s⁻¹",
      current_status: "Exacta por definición (17ª CGPM 1983)",
      description: "Velocidad asintótica universal de propagación de las ondas electromagnéticas y límite causal del espacio-tiempo en la Relatividad Especial."
    },
    {
      id: "h",
      symbol: "h",
      latex: "h",
      name: "Constante de Planck",
      category: "Mecánica Cuántica",
      si_unit: "J · s",
      current_status: "Exacta por definición (26ª CGPM 2018 / SI 2019)",
      description: "Cuanto elemental de acción que vincula la energía de un fotón con su frecuencia cuántica (E = h·ν). Base de la redefinición del kilogramo mediante la Balanza de Kibble."
    },
    {
      id: "e",
      symbol: "e",
      latex: "e",
      name: "Carga Eléctrica Elemental",
      category: "Electromagnetismo",
      si_unit: "C",
      current_status: "Exacta por definición (26ª CGPM 2018 / SI 2019)",
      description: "Magnitud escalar de la carga eléctrica portada por un protón o electrón libre. Define exactamente el Ampere (A) en el Sistema Internacional."
    },
    {
      id: "k",
      symbol: "k_B",
      latex: "k_B",
      name: "Constante de Boltzmann",
      category: "Termodinámica Estadística",
      si_unit: "J · K⁻¹",
      current_status: "Exacta por definición (26ª CGPM 2018 / SI 2019)",
      description: "Factor de escala fundamental que relaciona la energía térmica microscópica de las partículas con la temperatura termodinámica macroscópica (E = k_B·T)."
    },
    {
      id: "Na",
      symbol: "N_A",
      latex: "N_A",
      name: "Constante de Avogadro",
      category: "Fisicoquímica",
      si_unit: "mol⁻¹",
      current_status: "Exacta por definición (26ª CGPM 2018 / SI 2019)",
      description: "Número exacto de entidades elementales contenidas en un mol de sustancia. Materializado metrológicamente mediante esferas de silicio monocristalino (Proyecto Avogadro)."
    },
    {
      id: "alpha",
      symbol: "α",
      latex: "\\alpha",
      name: "Constante de Estructura Fina",
      category: "Electrodinámica Cuántica (QED)",
      si_unit: "adimensional",
      current_status: "Medición experimental recomendada (CODATA 2018)",
      description: "Constante de acoplamiento fundamental que cuantifica la intensidad de la fuerza electromagnética entre partículas cargadas elementales (α ≈ 1/137.035999)."
    }
  ],

  events: [
    // -------------------------------------------------------------
    // CONSTANTE G (Gravitación)
    // -------------------------------------------------------------
    {
      id: "G_1798",
      constant_id: "G",
      year: 1798,
      type: "measurement",
      value: 6.74e-11,
      uncertainty: 0.04e-11,
      relative_uncertainty: 5.9e-3,
      authority: "Henry Cavendish (Royal Society)",
      method: "Balanza de torsión de hilo de torsión con esferas de plomo",
      notes: "Primer experimento cuantitativo de laboratorio que 'pesó la Tierra' y determinó la constante gravitatoria."
    },
    {
      id: "G_1895",
      constant_id: "G",
      year: 1895,
      type: "measurement",
      value: 6.657e-11,
      uncertainty: 0.013e-11,
      relative_uncertainty: 2.0e-3,
      authority: "C.V. Boys",
      method: "Balanza de torsión miniaturizada con fibras de cuarzo fundido",
      notes: "Mejora sustancial en la suspensión elástica de torsión eliminando histéresis metálica."
    },
    {
      id: "G_1928",
      constant_id: "G",
      year: 1928,
      type: "measurement",
      value: 6.664e-11,
      uncertainty: 0.002e-11,
      relative_uncertainty: 3.0e-4,
      authority: "Paul Heyl (NBS / NIST)",
      method: "Péndulo de torsión cilíndrico en vacío",
      notes: "Medición de referencia del National Bureau of Standards utilizada durante décadas."
    },
    {
      id: "G_1986",
      constant_id: "G",
      year: 1986,
      type: "recommended",
      value: 6.67259e-11,
      uncertainty: 0.00085e-11,
      relative_uncertainty: 1.28e-4,
      authority: "CODATA 1986",
      method: "Ajuste de mínimos cuadrados de constantes fundamentales",
      notes: "Primer ajuste computarizado global coordinado por Cohen & Taylor."
    },
    {
      id: "G_1998",
      constant_id: "G",
      year: 1998,
      type: "recommended",
      value: 6.673e-11,
      uncertainty: 0.01e-11,
      relative_uncertainty: 1.5e-3,
      authority: "CODATA 1998",
      method: "Expansión cautelar de incertidumbre",
      notes: "¡Caso histórico excepcional!: La incertidumbre se multiplicó por más de 10 debido a experimentos internacionales con discrepancias sistemáticas mutuas irreconciliables."
    },
    {
      id: "G_2006",
      constant_id: "G",
      year: 2006,
      type: "recommended",
      value: 6.67428e-11,
      uncertainty: 0.00067e-11,
      relative_uncertainty: 1.0e-4,
      authority: "CODATA 2006",
      method: "Ajuste Bayesiano multi-laboratorio (BIPM, NIST, UWash)",
      notes: "Nuevas determinaciones con péndulos de torsión de alta precisión y balance angular."
    },
    {
      id: "G_2014",
      constant_id: "G",
      year: 2014,
      type: "recommended",
      value: 6.67408e-11,
      uncertainty: 0.00031e-11,
      relative_uncertainty: 4.7e-5,
      authority: "CODATA 2014",
      method: "Interferometría atómica de átomos fríos y balanzas de torsión de precisión",
      notes: "Primera incorporación de técnicas cuánticas de interferometría atómica para medir G."
    },
    {
      id: "G_2018",
      constant_id: "G",
      year: 2018,
      type: "recommended",
      value: 6.67430e-11,
      uncertainty: 0.00015e-11,
      relative_uncertainty: 2.2e-5,
      authority: "CODATA 2018",
      method: "Consenso armónico ponderado internacional",
      notes: "Valor oficial vigente. G sigue siendo la constante fundamental con mayor incertidumbre relativa de la física."
    },

    // -------------------------------------------------------------
    // CONSTANTE c (Velocidad de la luz)
    // -------------------------------------------------------------
    {
      id: "c_1676",
      constant_id: "c",
      year: 1676,
      type: "measurement",
      value: 220000000,
      uncertainty: 20000000,
      relative_uncertainty: 9.1e-2,
      authority: "Ole Rømer (Observatorio de París)",
      method: "Eclipses del satélite Io de Júpiter en función de la distancia orbital terrestre",
      notes: "Primera demostración experimental de que la velocidad de la luz es finita."
    },
    {
      id: "c_1728",
      constant_id: "c",
      year: 1728,
      type: "measurement",
      value: 301000000,
      uncertainty: 3000000,
      relative_uncertainty: 1.0e-2,
      authority: "James Bradley (Royal Society)",
      method: "Aberración estelar de la luz por el movimiento orbital de la Tierra",
      notes: "Confirmación cinemática independiente sin dependencia de órbitas planetarias externas."
    },
    {
      id: "c_1849",
      constant_id: "c",
      year: 1849,
      type: "measurement",
      value: 315000000,
      uncertainty: 5000000,
      relative_uncertainty: 1.6e-2,
      authority: "Hippolyte Fizeau",
      method: "Rueda dentada giratoria de 720 dientes entre Suresnes y Montmartre (8.6 km)",
      notes: "Primera medición terrestre directa de la luz sin observaciones astronómicas."
    },
    {
      id: "c_1862",
      constant_id: "c",
      year: 1862,
      type: "measurement",
      value: 298000000,
      uncertainty: 500000,
      relative_uncertainty: 1.7e-3,
      authority: "Léon Foucault",
      method: "Espejo rotatorio cóncavo de alta velocidad",
      notes: "Demostró experimentalmente que la luz viaja más lento en el agua que en el aire."
    },
    {
      id: "c_1926",
      constant_id: "c",
      year: 1926,
      type: "measurement",
      value: 299796000,
      uncertainty: 4000,
      relative_uncertainty: 1.3e-5,
      authority: "Albert A. Michelson",
      method: "Prisma octogonal giratorio entre Monte Wilson y Monte San Antonio (35.4 km)",
      notes: "Línea geodésica de base medida con cinta de invar con precisión milimétrica."
    },
    {
      id: "c_1950",
      constant_id: "c",
      year: 1950,
      type: "measurement",
      value: 299792500,
      uncertainty: 3000,
      relative_uncertainty: 1.0e-5,
      authority: "Louis Essen (NPL, Reino Unido)",
      method: "Resonador de cavidad de microondas",
      notes: "Uso de tecnología de radar de la Segunda Guerra Mundial aplicada a la metrología."
    },
    {
      id: "c_1973",
      constant_id: "c",
      year: 1973,
      type: "recommended",
      value: 299792458,
      uncertainty: 1.2,
      relative_uncertainty: 4.0e-9,
      authority: "CODATA 1973 / Evenson et al. (NBS)",
      method: "Interferometría láser de He-Ne estabilizada con metano",
      notes: "La precisión de medición superó la propia reproducibilidad del patrón de platino del metro."
    },
    {
      id: "c_1983",
      constant_id: "c",
      year: 1983,
      type: "definition",
      value: 299792458,
      uncertainty: 0,
      relative_uncertainty: 0,
      authority: "17ª Conferencia General de Pesas y Medidas (CGPM)",
      method: "Redefinición axiomática del Metro",
      notes: "El metro se redefine como la longitud recorrida por la luz en el vacío en 1/299792458 de segundo. c queda fijada exactamente con incertidumbre cero."
    },

    // -------------------------------------------------------------
    // CONSTANTE h (Planck)
    // -------------------------------------------------------------
    {
      id: "h_1900",
      constant_id: "h",
      year: 1900,
      type: "measurement",
      value: 6.55e-34,
      uncertainty: 0.10e-34,
      relative_uncertainty: 1.5e-2,
      authority: "Max Planck",
      method: "Ajuste teórico del espectro de radiación de cuerpo negro (Ley de Planck)",
      notes: "Nacimiento de la física cuántica: introducción del postulado de cuantización de energía."
    },
    {
      id: "h_1929",
      constant_id: "h",
      year: 1929,
      type: "recommended",
      value: 6.547e-34,
      uncertainty: 0.008e-34,
      relative_uncertainty: 1.2e-3,
      authority: "Raymond T. Birge",
      method: "Primer análisis sistemático de consistencia de constantes fundamentales",
      notes: "Hito pionero de la metrología moderna antes de la creación formal de CODATA."
    },
    {
      id: "h_1986",
      constant_id: "h",
      year: 1986,
      type: "recommended",
      value: 6.6260755e-34,
      uncertainty: 0.0000040e-34,
      relative_uncertainty: 6.0e-7,
      authority: "CODATA 1986",
      method: "Afectado por mediciones de la relación giromagnética del protón y efecto Josephson",
      notes: "Ajuste computarizado global clásico."
    },
    {
      id: "h_2014",
      constant_id: "h",
      year: 2014,
      type: "recommended",
      value: 6.626070040e-34,
      uncertainty: 0.000000081e-34,
      relative_uncertainty: 1.2e-8,
      authority: "CODATA 2014",
      method: "Balanza de Kibble (watt balance) y esferas de silicio enriquecido (Avogadro)",
      notes: "Campaña internacional coordinada por el BIPM para habilitar el Nuevo SI."
    },
    {
      id: "h_2018",
      constant_id: "h",
      year: 2018,
      type: "definition",
      value: 6.62607015e-34,
      uncertainty: 0,
      relative_uncertainty: 0,
      authority: "26ª CGPM (Resolución 1) / En vigor 20 de Mayo 2019",
      method: "Fijación axiomática del Kilogramo",
      notes: "El kilogramo se desacopla para siempre del artefacto metálico IPK (Le Grand Kilo) y se define asignando a la constante de Planck el valor exacto 6.62607015×10⁻³⁴ J·s."
    },

    // -------------------------------------------------------------
    // CONSTANTE e (Carga elemental)
    // -------------------------------------------------------------
    {
      id: "e_1909",
      constant_id: "e",
      year: 1909,
      type: "measurement",
      value: 1.592e-19,
      uncertainty: 0.005e-19,
      relative_uncertainty: 3.1e-3,
      authority: "Robert A. Millikan (Universidad de Chicago)",
      method: "Experimento de la gota de aceite cargada en campo electrostático",
      notes: "Demostró la naturaleza discreta y granular de la carga eléctrica."
    },
    {
      id: "e_1986",
      constant_id: "e",
      year: 1986,
      type: "recommended",
      value: 1.60217733e-19,
      uncertainty: 0.00000049e-19,
      relative_uncertainty: 3.0e-7,
      authority: "CODATA 1986",
      method: "Efecto Hall Cuántico (von Klitzing) y Efecto Josephson",
      notes: "Uso de patrones cuánticos de resistencia y voltaje."
    },
    {
      id: "e_2014",
      constant_id: "e",
      year: 2014,
      type: "recommended",
      value: 1.6021766208e-19,
      uncertainty: 0.0000000098e-19,
      relative_uncertainty: 6.1e-9,
      authority: "CODATA 2014",
      method: "Medición combinada cuántica multi-institucional",
      notes: "Preparación del valor de consenso para la redefinición del Ampere."
    },
    {
      id: "e_2018",
      constant_id: "e",
      year: 2018,
      type: "definition",
      value: 1.602176634e-19,
      uncertainty: 0,
      relative_uncertainty: 0,
      authority: "26ª CGPM (Resolución 1) / En vigor 20 de Mayo 2019",
      method: "Fijación axiomática del Ampere",
      notes: "El Ampere se define fijando el valor numérico exacto de la carga elemental e = 1.602176634×10⁻¹⁹ C."
    },

    // -------------------------------------------------------------
    // CONSTANTE k_B (Boltzmann)
    // -------------------------------------------------------------
    {
      id: "k_1900",
      constant_id: "k",
      year: 1900,
      type: "measurement",
      value: 1.346e-23,
      uncertainty: 0.05e-23,
      relative_uncertainty: 3.7e-2,
      authority: "Max Planck",
      method: "Deducción termodinámica a partir de la radiación de cavidad",
      notes: "Planck bautizó la constante en honor a Ludwig Boltzmann."
    },
    {
      id: "k_1986",
      constant_id: "k",
      year: 1986,
      type: "recommended",
      value: 1.380658e-23,
      uncertainty: 0.000012e-23,
      relative_uncertainty: 8.5e-6,
      authority: "CODATA 1986",
      method: "Termometría de gas a volumen constante",
      notes: "Determinación termodinámica clásica."
    },
    {
      id: "k_2014",
      constant_id: "k",
      year: 2014,
      type: "recommended",
      value: 1.38064852e-23,
      uncertainty: 0.00000079e-23,
      relative_uncertainty: 5.7e-7,
      authority: "CODATA 2014",
      method: "Termometría acústica de resonador cuasi-esférico en helio y argón (LNE-CNAM, NPL, NIST)",
      notes: "Reducción histórica de incertidumbre por velocidad del sonido en gases nobles."
    },
    {
      id: "k_2018",
      constant_id: "k",
      year: 2018,
      type: "definition",
      value: 1.380649e-23,
      uncertainty: 0,
      relative_uncertainty: 0,
      authority: "26ª CGPM (Resolución 1) / En vigor 20 de Mayo 2019",
      method: "Fijación axiomática del Kelvin",
      notes: "El Kelvin se define fijando exactamente la constante de Boltzmann k_B = 1.380649×10⁻²³ J/K, eliminando la dependencia del punto triple del agua."
    },

    // -------------------------------------------------------------
    // CONSTANTE N_A (Avogadro)
    // -------------------------------------------------------------
    {
      id: "Na_1909",
      constant_id: "Na",
      year: 1909,
      type: "measurement",
      value: 6.7e23,
      uncertainty: 0.4e23,
      relative_uncertainty: 6.0e-2,
      authority: "Jean Perrin (Premio Nobel 1926)",
      method: "Equilibrio de sedimentación de emulsiones coloidales (movimiento browniano)",
      notes: "Validación definitiva de la hipótesis atómica de Einstein y Boltzmann."
    },
    {
      id: "Na_1986",
      constant_id: "Na",
      year: 1986,
      type: "recommended",
      value: 6.0221367e23,
      uncertainty: 0.0000036e23,
      relative_uncertainty: 5.9e-7,
      authority: "CODATA 1986",
      method: "Densidad de rayos X en cristales de silicio (XRCD)",
      notes: "Interferometría combinada de rayos X y óptica."
    },
    {
      id: "Na_2014",
      constant_id: "Na",
      year: 2014,
      type: "recommended",
      value: 6.022140857e23,
      uncertainty: 0.000000074e23,
      relative_uncertainty: 1.2e-8,
      authority: "CODATA 2014 / International Avogadro Coordination (IAC)",
      method: "Esferas de silicio monocristalino casi perfecto enriquecido en Si-28 (99.9995%)",
      notes: "Conteo atómico directo volumétrico por difracción interferométrica de rayos X."
    },
    {
      id: "Na_2018",
      constant_id: "Na",
      year: 2018,
      type: "definition",
      value: 6.02214076e23,
      uncertainty: 0,
      relative_uncertainty: 0,
      authority: "26ª CGPM (Resolución 1) / En vigor 20 de Mayo 2019",
      method: "Fijación axiomática del Mol",
      notes: "El mol se define conteniendo exactamente 6.02214076×10²³ entidades elementales no ligadas."
    },

    // -------------------------------------------------------------
    // CONSTANTE alpha (Estructura fina)
    // -------------------------------------------------------------
    {
      id: "alpha_1916",
      constant_id: "alpha",
      year: 1916,
      type: "measurement",
      value: 7.28e-3,
      uncertainty: 0.05e-3,
      relative_uncertainty: 6.8e-3,
      authority: "Arnold Sommerfeld",
      method: "Desdoblamiento relativista de líneas espectrales del átomo de hidrógeno",
      notes: "Introducción de la constante adimensional en el modelo atómico de Bohr-Sommerfeld."
    },
    {
      id: "alpha_1986",
      constant_id: "alpha",
      year: 1986,
      type: "recommended",
      value: 7.29735308e-3,
      uncertainty: 0.00000033e-3,
      relative_uncertainty: 4.5e-8,
      authority: "CODATA 1986",
      method: "Momento magnético anómalo del electrón (g-2)",
      notes: "Prueba más rigurosa de la Electrodinámica Cuántica (QED)."
    },
    {
      id: "alpha_2014",
      constant_id: "alpha",
      year: 2014,
      type: "recommended",
      value: 7.2973525664e-3,
      uncertainty: 0.0000000017e-3,
      relative_uncertainty: 2.3e-10,
      authority: "CODATA 2014",
      method: "Recoil de átomos de rubidio en trampas ópticas (LKB París) y g-2 del electrón (Harvard)",
      notes: "Concordancia asombrosa entre física atómica y electrodinámica cuántica."
    },
    {
      id: "alpha_2018",
      constant_id: "alpha",
      year: 2018,
      type: "recommended",
      value: 7.2973525693e-3,
      uncertainty: 0.0000000011e-3,
      relative_uncertainty: 1.5e-10,
      authority: "CODATA 2018 (Berkeley Parker et al.)",
      method: "Interferometría de retroceso con átomos fríos de cesio-133",
      notes: "Valor vigente oficial: alpha permanece como una constante medida con incertidumbre residual en el Nuevo SI."
    }
  ]
};

if (typeof window !== "undefined") {
  window.CONSTANTS_CORPUS = CONSTANTS_CORPUS;
}
