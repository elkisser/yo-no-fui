export const casosFaciles = [
  {
      titulo: "La Última Función",
      historia: "El prestigioso Teatro Real se preparaba para su noche más importante: el estreno de 'La Traviata' con la famosa soprano Isabella Rossini. Sin embargo, el drama cruzó la cuarta pared cuando, minutos antes de salir a escena para el segundo acto, Isabella descubrió que su inestimable collar de perlas, una herencia familiar del siglo XIX, había desaparecido de su camerino. La habitación había estado cerrada con llave y bajo la vigilancia del personal de seguridad en el pasillo. Nadie ajeno al elenco o al equipo técnico podía haber entrado. La tensión se disparó entre bambalinas, amenazando con cancelar la función. El collar no solo tenía valor monetario, sino que era el amuleto de la suerte de la cantante. Entre el caos de vestuario y maquillaje, tres personas tuvieron la oportunidad perfecta de deslizarse en el camerino: el tenor principal que envidia su fama, la vestuarista que conoce todos los secretos, y el director de escena presionado por las deudas.",
      ambientacion: "Camerinos de un teatro de ópera antiguo, lleno de espejos, luces cálidas y olor a laca y flores viejas.",
      dificultad: "fácil",
      jugadores: 2,
      sospechosos: [
        {
          id: "sospechoso_1",
          nombre: "Marco Di Stefano (Tenor)",
          descripcion: "Un tenor talentoso pero arrogante. Se le ha escuchado discutir a gritos con Isabella porque ella recibe toda la atención de la prensa.",
          motivacion: "Sabotear la actuación de Isabella para brillar él.",
          alibi: "Dice que estuvo calentando la voz en el escenario, pero nadie lo vio allí todo el tiempo."
        },
        {
          id: "sospechoso_2",
          nombre: "Ana García (Vestuarista)",
          descripcion: "La jefa de vestuario, silenciosa y observadora. Tiene llaves maestras de todos los camerinos para emergencias de vestuario.",
          motivacion: "Necesidad económica urgente; se rumorea que tiene deudas de juego.",
          alibi: "Afirma que estaba arreglando un dobladillo en el pasillo, justo fuera de la vista de seguridad."
        },
        {
          id: "sospechoso_3",
          nombre: "Carlo Vitti (Director)",
          descripcion: "Director de la obra, conocido por sus gastos extravagantes.",
          motivacion: "Cobrar el seguro de la producción si algo sale mal o vender la joya.",
          alibi: "En la cabina de luces discutiendo con el técnico."
        }
      ],
      pistas: [
        {
          id: "pista_1",
          titulo: "Ventana del camerino",
          descripcion: "La pequeña ventana del camerino estaba entreabierta. Da a un callejón, pero está en un tercer piso sin escaleras de incendio. Parece imposible entrar por ahí, pero quizás alguien quiso simular un robo externo.",
          relevancia: "media",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_2",
          titulo: "Hilo de seda rojo",
          descripcion: "Un pequeño hilo de seda roja encontrado enganchado en el joyero de Isabella. El vestuario de la ópera es variado, pero Ana llevaba una bufanda roja esa noche.",
          relevancia: "alta",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_3",
          titulo: "Testimonio del guardia",
          descripcion: "El guardia de seguridad del pasillo menciona que se distrajo un momento cuando 'alguien' tiró un perchero al final del pasillo, justo antes del robo.",
          relevancia: "media",
          descubierta: false,
          tipo: "testimonio"
        }
      ],
      ayudas: [
        {
          id: "ayuda_1",
          nombre: "Interrogar al Guardia",
          descripcion: "¿Vio a alguien específico cerca del camerino?",
          resultado: "Recuerda haber visto a Ana salir apresuradamente de la zona del camerino justo después del ruido del perchero, ocultando algo bajo su abrigo."
        },
        {
          id: "ayuda_2",
          nombre: "Revisar Pertenencias",
          descripcion: "Buscar en el área de trabajo de vestuario",
          resultado: "En el bolsillo de un abrigo colgado en el taller de Ana, se encuentran dos perlas sueltas que coinciden con el collar."
        },
        {
          id: "ayuda_3",
          nombre: "Análisis de Huellas",
          descripcion: "Huellas en el joyero",
          resultado: "El joyero tiene huellas de Isabella y, sorprendentemente, huellas recientes de Ana, quien no debería haberlo tocado."
        }
      ],
      giroFinal: "Ana aprovechó su acceso y creó una distracción para robar el collar, planeando vender las perlas individualmente para pagar sus deudas.",
      culpableId: "sospechoso_2"
  },
  {
    titulo: "Sombras en la Biblioteca Municipal",
    historia: "La Biblioteca Municipal de San Alderete llevaba más de cien años en funcionamiento y era considerada un santuario del conocimiento local. En la noche del jueves, tras una intensa tormenta que dejó sin electricidad a gran parte del barrio, el bibliotecario principal, Tomás Aguilar, descubrió que uno de los libros más valiosos del archivo histórico había desaparecido: el manuscrito original de 'Crónicas del Río Negro', una obra única escrita a mano en 1893.\n\nEl hecho llamó la atención no solo por el valor económico del manuscrito, sino por su importancia simbólica. El libro estaba guardado en una vitrina cerrada con llave, dentro de una sala de acceso restringido. No había signos de forzamiento, ni en la vitrina ni en las puertas. Las cámaras de seguridad dejaron de funcionar exactamente durante 23 minutos debido al corte eléctrico.\n\nDurante ese lapso, solo tres personas estaban oficialmente dentro del edificio: Clara Benítez, asistente administrativa; Julián Ríos, estudiante de historia que realizaba una investigación; y el propio Tomás. Cada uno tiene razones para estar allí, pero también algo que ocultar.\n\nA medida que avanza la investigación, se descubre que el manuscrito no solo contenía valor histórico, sino también anotaciones al margen que revelaban un antiguo fraude inmobiliario que involucraba a familias influyentes de la ciudad. El robo, entonces, podría no ser un simple acto de codicia, sino un intento deliberado de borrar una verdad incómoda.\n\nEl desafío no está en encontrar pistas evidentes, sino en conectar detalles aparentemente triviales: horarios, llaves duplicadas, rutinas y pequeñas mentiras. Resolver el caso implica comprender las motivaciones humanas más que buscar pruebas físicas contundentes.",
    ambientacion: "Biblioteca histórica, noche lluviosa, luces de emergencia encendidas.",
    dificultad: "fácil",
    jugadores: 2,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Tomás Aguilar",
        descripcion: "Bibliotecario jefe, meticuloso y reservado.",
        motivacion: "Proteger la reputación de la biblioteca y la suya propia",
        alibi: "Estaba en su oficina revisando inventarios"
      },
      {
        id: "sospechoso_2",
        nombre: "Clara Benítez",
        descripcion: "Asistente administrativa con acceso a llaves maestras.",
        motivacion: "Presión familiar relacionada con el fraude histórico",
        alibi: "Archivando documentos en el subsuelo"
      },
      {
        id: "sospechoso_3",
        nombre: "Julián Ríos",
        descripcion: "Estudiante obsesionado con la historia local.",
        motivacion: "Publicar un descubrimiento exclusivo",
        alibi: "Leyendo en la sala general a la luz de emergencia"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Registro de llaves",
        descripcion: "Una llave de la vitrina fue solicitada días antes sin constancia escrita.",
        relevancia: "media",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_2",
        titulo: "Notas marginales",
        descripcion: "Fotografías del manuscrito tomadas previamente desde un celular.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_3",
        titulo: "Corte eléctrico preciso",
        descripcion: "El apagón afectó solo a la biblioteca y duró exactamente 23 minutos.",
        relevancia: "alta",
        descubierta: false,
        tipo: "testimonio"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis de registros",
        descripcion: "Revisar accesos previos a la sala histórica",
        resultado: "Clara accedió fuera de horario tres veces esa semana."
      },
      {
        id: "ayuda_2",
        nombre: "Entrevista cruzada",
        descripcion: "Contrastar coartadas",
        resultado: "Julián mintió sobre haber estado solo."
      },
      {
        id: "ayuda_3",
        nombre: "Peritaje eléctrico",
        descripcion: "Investigar el corte de luz",
        resultado: "El apagón fue provocado manualmente desde el tablero interno."
      }
    ],
    giroFinal: "Clara sustrajo el manuscrito para eliminar pruebas del fraude que involucraba a su familia.",
    culpableId: "sospechoso_2"
  }
];
