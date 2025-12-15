export const casosMedios = [
  {
      titulo: "El Último Segundo del Reloj",
      historia: "En la remota Mansión Blackwood, una tormenta eléctrica azotaba los ventanales cuando el legendario reloj de bolsillo 'Tempus Fugit', incrustado con zafiros y valorado en medio millón de dólares, se desvaneció del despacho privado de Arthur Pendleton. Eran las 23:00 cuando Arthur bajó a cenar, cerrando la puerta con llave. A las 23:45, al regresar, la caja fuerte estaba abierta y vacía. No había signos de fuerza en la cerradura de la caja, lo que implicaba que el ladrón conocía la combinación o era un experto inigualable. La ventana estaba cerrada por dentro. Solo tres personas estaban en la casa: Arthur (el dueño con deudas), Elena (la ama de llaves despedida ese mismo día pero que pasaba su última noche allí) y Damián (el sobrino heredero impaciente). La electricidad fluctuó varias veces, dejando la casa en penumbra en momentos clave. ¿Quién aprovechó la oscuridad para robar el tiempo?",
      ambientacion: "Mansión victoriana aislada en un acantilado, noche de tormenta eléctrica, luz de velas parpadeante.",
      dificultad: "media",
      jugadores: 2,
      sospechosos: [
        {
          id: "sospechoso_1",
          nombre: "Arthur Pendleton",
          descripcion: "Dueño de la mansión. Jugador empedernido con deudas peligrosas.",
          motivacion: "Fingir el robo para cobrar el seguro y pagar a sus prestamistas.",
          alibi: "Dice que estuvo en el comedor bebiendo brandy solo desde las 23:00 hasta las 23:45."
        },
        {
          id: "sospechoso_2",
          nombre: "Elena Vanko",
          descripcion: "Ama de llaves fiel durante 30 años, despedida injustamente esa mañana.",
          motivacion: "Venganza contra Arthur y asegurar su jubilación con el valor del reloj.",
          alibi: "Empacando sus maletas en su habitación del ático. Nadie la vio."
        },
        {
          id: "sospechoso_3",
          nombre: "Damián Blackwood",
          descripcion: "Sobrino de Arthur, único heredero. Joven ambicioso y vividor.",
          motivacion: "Evitar que Arthur venda el reloj (su herencia) para pagar deudas.",
          alibi: "Jugando al solitario en la biblioteca, contiguo al despacho."
        }
      ],
      pistas: [
        {
          id: "pista_1",
          titulo: "Barro en la alfombra",
          descripcion: "Hay pisadas de barro seco que van desde la puerta del jardín trasero hasta... la entrada del sótano, no al despacho.",
          relevancia: "media",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_2",
          titulo: "Caja fuerte intacta",
          descripcion: "La caja fuerte no tiene rasguños. Se abrió con la combinación correcta. Solo Arthur y Damián la sabían.",
          relevancia: "alta",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_3",
          titulo: "Recibo de empeño",
          descripcion: "Un recibo arrugado de una casa de empeños de la ciudad, fechado ayer, por un 'reloj de oro antiguo', encontrado en la papelera del baño de Arthur.",
          relevancia: "alta",
          descubierta: false,
          tipo: "documento"
        }
      ],
      ayudas: [
        {
          id: "ayuda_1",
          nombre: "Análisis Telefónico",
          descripcion: "Verificar llamadas de Arthur",
          resultado: "Arthur llamó a su aseguradora dos veces hoy para confirmar la póliza contra robos."
        },
        {
          id: "ayuda_2",
          nombre: "Interrogatorio a Elena",
          descripcion: "¿Vio algo desde el ático?",
          resultado: "Vio a Arthur salir de la casa con un paquete pequeño ayer por la tarde y regresar sin él."
        },
        {
          id: "ayuda_3",
          nombre: "Registro de Damián",
          descripcion: "Registrar la habitación del sobrino",
          resultado: "Se encuentra una réplica barata del reloj 'Tempus Fugit' escondida bajo su colchón."
        }
      ],
      giroFinal: "Arthur vendió el reloj real ayer y planeó el 'robo' hoy para cobrar el seguro. Damián compró una réplica para cambiarla, pero llegó tarde.",
      culpableId: "sospechoso_1"
  },
  {
    titulo: "El Silencio del Astillero",
    historia: "El astillero San Marcos llevaba meses paralizado tras una disputa sindical que había dividido a trabajadores, directivos y autoridades locales. La madrugada del lunes, el cuerpo sin vida de Víctor Ledesma, capataz del turno nocturno, fue encontrado flotando entre los muelles. A simple vista parecía un accidente laboral, pero la autopsia reveló que Víctor había muerto antes de caer al agua.\n\nEl astillero es un entorno hostil: ruido constante, estructuras oxidadas, maquinaria pesada y una cultura de silencios impuestos. La noche del incidente, solo cuatro personas estaban oficialmente en el lugar, pero los registros de acceso presentan inconsistencias.\n\nVíctor era una figura controvertida. Para algunos, un supervisor justo; para otros, un traidor que colaboraba con la gerencia entregando nombres de sindicalistas. En las semanas previas, había recibido amenazas anónimas y había cambiado su rutina diaria.\n\nLa complejidad del caso radica en que casi todas las pruebas pueden interpretarse de múltiples formas. El astillero guarda secretos, y muchos testigos prefieren mentir antes que exponerse. Resolver el crimen exige reconstruir no solo los hechos, sino el entramado social y político que rodeaba a la víctima.",
    ambientacion: "Astillero industrial, madrugada fría, niebla espesa.",
    dificultad: "media",
    jugadores: 3,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Ramiro Cruz",
        descripcion: "Delegado sindical enfrentado con la víctima.",
        motivacion: "Venganza por despidos",
        alibi: "Reunión sindical fuera del astillero"
      },
      {
        id: "sospechoso_2",
        nombre: "Laura Méndez",
        descripcion: "Ingeniera de seguridad industrial.",
        motivacion: "Evitar que salieran a la luz fallas graves",
        alibi: "Revisando planos en la oficina técnica"
      },
      {
        id: "sospechoso_3",
        nombre: "Esteban Molina",
        descripcion: "Operario nocturno, amigo cercano de Víctor.",
        motivacion: "Miedo a ser delatado",
        alibi: "Mantenimiento de grúas"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Golpe craneal",
        descripcion: "La herida no coincide con una caída accidental.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Registro alterado",
        descripcion: "Una entrada fue modificada manualmente.",
        relevancia: "media",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_3",
        titulo: "Mensaje borrado",
        descripcion: "Un audio eliminado del teléfono de Víctor.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis forense",
        descripcion: "Determinar hora exacta de la muerte",
        resultado: "Murió una hora antes de caer al agua."
      },
      {
        id: "ayuda_2",
        nombre: "Recuperación digital",
        descripcion: "Restaurar el audio borrado",
        resultado: "Víctor planeaba denunciar a alguien esa misma noche."
      },
      {
        id: "ayuda_3",
        nombre: "Revisión de accesos",
        descripcion: "Cruzar tarjetas y cámaras",
        resultado: "Laura estuvo cerca del muelle fuera de horario."
      }
    ],
    giroFinal: "Laura asesinó a Víctor para evitar que denunciara fallas de seguridad que ella había encubierto.",
    culpableId: "sospechoso_2"
  },
  {
    titulo: "Los Que Firmaron el Acta",
    historia: "En el pequeño municipio de Las Vertientes, la muerte del concejal Ernesto Bianchi fue declarada suicidio. Fue encontrado en su despacho con una nota firmada y el arma reglamentaria a su lado.\n\nSin embargo, Ernesto estaba impulsando una ordenanza que afectaba directamente a varias empresas locales y a miembros de su propio partido. En los días previos había solicitado custodia, la cual le fue negada.\n\nEl despacho no presentaba signos de forcejeo, pero el contenido de la nota resulta ambiguo. No expresa culpa, sino cansancio. A medida que se revisan actas, votaciones y acuerdos previos, queda claro que Ernesto estaba atrapado en una red de presiones legales y personales.\n\nResolver el caso no implica solo determinar si alguien lo mató, sino si el sistema lo empujó deliberadamente hacia una única salida.",
    ambientacion: "Edificio municipal, noche tranquila.",
    dificultad: "media",
    jugadores: 3,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Intendente Correa",
        descripcion: "Superior político.",
        motivacion: "Evitar conflictos",
        alibi: "Acto público"
      },
      {
        id: "sospechoso_2",
        nombre: "Marta Bianchi",
        descripcion: "Esposa de la víctima.",
        motivacion: "Conflictos familiares",
        alibi: "En su casa"
      },
      {
        id: "sospechoso_3",
        nombre: "Lucas Ferrer",
        descripcion: "Empresario afectado.",
        motivacion: "Presión económica",
        alibi: "Viaje de negocios"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Nota ambigua",
        descripcion: "No expresa intención suicida clara.",
        relevancia: "media",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_2",
        titulo: "Llamadas ignoradas",
        descripcion: "Ernesto llamó a tres personas esa noche.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_3",
        titulo: "Acta modificada",
        descripcion: "Un acta fue alterada días antes.",
        relevancia: "alta",
        descubierta: false,
        tipo: "documento"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Peritaje psicológico",
        descripcion: "Evaluar nota",
        resultado: "No coincide con perfiles suicidas clásicos."
      },
      {
        id: "ayuda_2",
        nombre: "Análisis político",
        descripcion: "Revisar presiones",
        resultado: "Ernesto estaba aislado deliberadamente."
      },
      {
        id: "ayuda_3",
        nombre: "Revisión de llamadas",
        descripcion: "Contactar destinatarios",
        resultado: "Nadie respondió."
      }
    ],
    giroFinal: "No hay prueba concluyente de asesinato directo. El caso deja la incómoda verdad de un suicidio inducido por presión sistemática.",
    culpableId: ""
  },
  {
    titulo: "El Precio del Silencio",
    historia: "El periodista Tomás Requena fue encontrado muerto en su departamento. La escena sugería un robo que salió mal, pero nada de valor fue sustraído.\n\nRequena investigaba un entramado de contratos públicos adjudicados a empresas fantasmas. Había hablado con varias fuentes, algunas de las cuales se retractaron horas antes de su muerte.\n\nUno de los nombres más mencionados en la prensa fue el de un subsecretario menor, rápidamente detenido. Sin embargo, la investigación profunda revela que su arresto fue conveniente.\n\nEl caso está diseñado para llevar al jugador a una conclusión errónea si no cuestiona la narrativa oficial.",
    ambientacion: "Departamento urbano, madrugada.",
    dificultad: "media",
    jugadores: 3,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Luis Ferreyra",
        descripcion: "Subsecretario.",
        motivacion: "Encubrimiento",
        alibi: "Oficina"
      },
      {
        id: "sospechoso_2",
        nombre: "Marina Soler",
        descripcion: "Editora del medio.",
        motivacion: "Presiones políticas",
        alibi: "Redacción"
      },
      {
        id: "sospechoso_3",
        nombre: "Pablo Requena",
        descripcion: "Hermano de la víctima.",
        motivacion: "Conflictos personales",
        alibi: "Viaje"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Puerta forzada",
        descripcion: "Forzamiento superficial.",
        relevancia: "media",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Artículo inconcluso",
        descripcion: "Borrador sin publicar.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_3",
        titulo: "Fuente retirada",
        descripcion: "Alguien se retractó.",
        relevancia: "alta",
        descubierta: false,
        tipo: "testimonio"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis mediático",
        descripcion: "Revisar cobertura",
        resultado: "La narrativa fue dirigida."
      },
      {
        id: "ayuda_2",
        nombre: "Seguimiento de llamadas",
        descripcion: "Cruzar contactos",
        resultado: "Marina habló con Requena horas antes."
      },
      {
        id: "ayuda_3",
        nombre: "Análisis político",
        descripcion: "Ver beneficiarios",
        resultado: "El arresto desvió la atención."
      }
    ],
    giroFinal: "Marina entregó a Tomás para proteger al medio y sus fuentes más poderosas.",
    culpableId: "sospechoso_2"
  },
  {
    titulo: "La Mesa 12",
    historia: "En el restaurante La Aurora, una comensal murió tras ingerir un plato contaminado. Nadie más resultó afectado.\n\nCinco personas interactuaron con la Mesa 12 esa noche. Todas tuvieron acceso. Todas cometieron errores. Solo una cruzó una línea.\n\nEl caso no tiene un culpable fijo: el sistema selecciona quién cometió el acto final según el orden en que se descubran las pistas.",
    ambientacion: "Restaurante elegante, hora pico.",
    dificultad: "media",
    jugadores: 3,
    modo: "variable",
    sospechosos: [
      { id: "s1", nombre: "Chef principal", rasgo: "Control obsesivo" },
      { id: "s2", nombre: "Sous-chef", rasgo: "Resentimiento" },
      { id: "s3", nombre: "Mozo", rasgo: "Agotamiento" },
      { id: "s4", nombre: "Gerente", rasgo: "Presión económica" },
      { id: "s5", nombre: "Cliente habitual", rasgo: "Conocimiento interno" }
    ],
    pistas: [
      { id: "p1", titulo: "Ingrediente alterado", peso: "variable" },
      { id: "p2", titulo: "Cambio de turno", peso: "variable" },
      { id: "p3", titulo: "Cuenta modificada", peso: "variable" }
    ],
    ayudas: [
      { id: "a1", nombre: "Simulación de servicio", resultado: "Todos tuvieron acceso." },
      { id: "a2", nombre: "Análisis de estrés", resultado: "El error no fue impulsivo." }
    ],
    giroFinal: "El culpable es quien tuvo oportunidad *y* motivo *después* de la última pista descubierta."
  }
];
