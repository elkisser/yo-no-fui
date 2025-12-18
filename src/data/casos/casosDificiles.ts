export const casosDificiles = [
  {
      titulo: "Muerte en el Invernadero",
      historia: "El prestigioso botánico Sir Henry Green fue hallado muerto en su invernadero privado, un domo de cristal que alberga la flora más letal del planeta. La causa oficial: paro cardíaco por envenenamiento. Junto a su cuerpo, la maceta de la 'Orquídea Fantasma' (Dendrophylax lindenii), una planta que vale millones y que él aseguró por el doble, estaba rota y vacía a su lado. La puerta del invernadero estaba cerrada por dentro con un cerrojo digital. Solo se podía salir con la huella dactilar de Sir Henry... o con la de su asesino, si este logró forzar el sistema. Sir Henry había invitado a tres personas a ver la flor esa tarde: su esposa Lady Green, cansada de ser ignorada; su jardinero Bob, a quien había despedido esa mañana; y la Dra. Flora, una rival académica acusada de plagio por Henry. Todos aseguran que Henry estaba vivo cuando se fueron a las 17:00. El cuerpo fue hallado a las 18:00 por el mayordomo. Pero hay un detalle: el sistema de riego automático, programado para las 17:30, estaba apagado manualmente.",
      ambientacion: "Invernadero victoriano húmedo y caluroso, lleno de plantas exóticas y venenosas. El aire huele a tierra mojada y almendras amargas.",
      dificultad: "difícil",
      jugadores: 3,
      sospechosos: [
        {
          id: "sospechoso_1",
          nombre: "Lady Green",
          descripcion: "Aristócrata fría. Heredera de la fortuna si Henry muere antes del divorcio.",
          motivacion: "Dinero y libertad. Henry planeaba cambiar su testamento mañana.",
          alibi: "Tomando el té en la terraza principal con vistas al invernadero desde las 17:05."
        },
        {
          id: "sospechoso_2",
          nombre: "Jardinero Bob",
          descripcion: "Jardinero leal convertido en enemigo tras ser despedido sin indemnización.",
          motivacion: "Venganza y robar la Orquídea para venderla en el mercado negro.",
          alibi: "Dice que se fue a las 16:50 y que estaba en el pub del pueblo a las 17:15."
        },
         {
          id: "sospechoso_3",
          nombre: "Dra. Flora",
          descripcion: "Botánica brillante pero desacreditada. Necesita la Orquídea para probar su teoría.",
          motivacion: "Recuperar su reputación científica robando el espécimen único.",
          alibi: "Estaba en la biblioteca de la mansión revisando notas hasta las 18:00."
        }
      ],
      pistas: [
        {
          id: "pista_1",
          titulo: "Guante de látex roto",
          descripcion: "Un fragmento de guante quirúrgico azul encontrado bajo una mesa de cultivo. Nadie en la casa usa ese tipo de guantes, excepto quizás alguien que trajo equipo propio.",
          relevancia: "alta",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_2",
          titulo: "Tierra seca",
          descripcion: "La tierra alrededor del cuerpo está seca, a pesar de que el riego debía activarse a las 17:30. Alguien lo desactivó para no mojar la escena del crimen.",
          relevancia: "alta",
          descubierta: false,
          tipo: "física"
        },
        {
          id: "pista_3",
          titulo: "Huella digital en el panel",
          descripcion: "El lector biométrico de salida tiene una mancha de grasa, como si hubieran usado una copia de huella hecha con silicona o gelatina.",
          relevancia: "alta",
          descubierta: false,
          tipo: "física"
        }
      ],
      ayudas: [
        {
          id: "ayuda_1",
          nombre: "Análisis del Guante",
          descripcion: "Buscar residuos químicos",
          resultado: "El guante tiene trazas de un veneno sintético indetectable, no de plantas. El asesino trajo el veneno, no usó las plantas de Henry."
        },
        {
          id: "ayuda_2",
          nombre: "Revisar Historial de Flora",
          descripcion: "Antecedentes académicos",
          resultado: "La Dra. Flora publicó un paper sobre neurotoxinas sintéticas hace dos años. Tiene acceso a ese tipo de venenos."
        },
        {
          id: "ayuda_3",
          nombre: "Cámaras del Pub",
          descripcion: "Verificar coartada de Bob",
          resultado: "Bob efectivamente llegó al pub a las 17:20, lo que hace casi imposible que él cometiera el crimen y llegara a tiempo."
        }
      ],
      giroFinal: "La Dra. Flora asesinó a Henry con una neurotoxina propia para robar la planta y reivindicar su carrera, usando una copia de huella para salir.",
      culpableId: "sospechoso_3"
  },
  {
    titulo: "Los Niños del Turno Noche",
    historia: "En un taller textil clandestino, un incendio dejó heridos a varios menores que trabajaban durante la noche. El encargado del turno, Miguel Ávila, murió al intentar evacuar el lugar.\n\nLa investigación revela que Miguel había denunciado previamente las condiciones del taller, sin éxito. La noche del incendio, alguien bloqueó una de las salidas.\n\nEl caso no busca castigar al más débil, sino identificar quién tomó una decisión irreversible creyendo hacer lo correcto.",
    ambientacion: "Taller textil ilegal, noche.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Dueño del taller",
        descripcion: "Empresario informal.",
        motivacion: "Evitar clausura",
        alibi: "No estaba"
      },
      {
        id: "sospechoso_2",
        nombre: "Encargada administrativa",
        descripcion: "Controlaba accesos.",
        motivacion: "Miedo a represalias",
        alibi: "Oficina"
      },
      {
        id: "sospechoso_3",
        nombre: "Miguel Ávila",
        descripcion: "Encargado fallecido.",
        motivacion: "Salvar a los niños",
        alibi: "Víctima"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Salida bloqueada",
        descripcion: "Bloqueo intencional.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Denuncias previas",
        descripcion: "Ignoradas.",
        relevancia: "media",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_3",
        titulo: "Orden verbal",
        descripcion: "Alguien dio una orden.",
        relevancia: "alta",
        descubierta: false,
        tipo: "testimonio"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Reconstrucción del incendio",
        descripcion: "Simular evacuación",
        resultado: "Miguel no causó el bloqueo."
      },
      {
        id: "ayuda_2",
        nombre: "Entrevista protegida",
        descripcion: "Hablar con empleados",
        resultado: "La encargada recibió amenazas."
      },
      {
        id: "ayuda_3",
        nombre: "Análisis legal",
        descripcion: "Responsabilidades",
        resultado: "El sistema permitió el crimen."
      }
    ],
    giroFinal: "La encargada bloqueó la salida siguiendo órdenes indirectas del dueño. Miguel murió intentando corregirlo.",
    culpableId: "sospechoso_2"
  },
  {
    titulo: "La Habitación Sin Espejos",
    historia: "El sanatorio privado Santa Brígida se especializa en tratamientos psiquiátricos de alto perfil. Políticos, empresarios y figuras públicas han pasado por sus habitaciones aisladas del mundo exterior. Una de ellas, la número 417, tiene una particularidad: no posee espejos ni superficies reflectantes.\n\nAllí fue encontrado muerto el doctor Emiliano Krauss, psiquiatra jefe del área de internación voluntaria. Su muerte fue atribuida inicialmente a un paro cardíaco, pero la autopsia reveló una sobredosis administrada de forma progresiva.\n\nKrauss llevaba un registro personal —no oficial— de sus pacientes. Anotaba contradicciones, mentiras recurrentes y patrones de manipulación. Ese cuaderno desapareció la misma noche de su muerte.\n\nLos pacientes de la sala 4 no están allí por violencia, sino por su capacidad de manipular a otros sin culpa. Resolver el caso implica detectar quién miente mejor, no quién parece más nervioso.\n\nLa dificultad no radica en encontrar inconsistencias obvias, sino en notar qué historias encajan demasiado bien.",
    ambientacion: "Sanatorio psiquiátrico privado, noche silenciosa.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Dr. Julián Peretti",
        descripcion: "Psiquiatra adjunto.",
        motivacion: "Evitar que se expusieran malas prácticas",
        alibi: "Consulta virtual"
      },
      {
        id: "sospechoso_2",
        nombre: "Verónica Lamas",
        descripcion: "Paciente internada, extremadamente carismática.",
        motivacion: "Ser dada de alta",
        alibi: "En su habitación"
      },
      {
        id: "sospechoso_3",
        nombre: "Héctor Valls",
        descripcion: "Paciente, empresario.",
        motivacion: "Evitar filtraciones",
        alibi: "Sedado"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Dosis escalonadas",
        descripcion: "El medicamento fue administrado en pequeñas cantidades.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Cuaderno faltante",
        descripcion: "Notas personales desaparecidas.",
        relevancia: "alta",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_3",
        titulo: "Relatos coherentes",
        descripcion: "Una coartada demasiado perfecta.",
        relevancia: "media",
        descubierta: false,
        tipo: "testimonio"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Perfil psicológico",
        descripcion: "Analizar patrones de mentira",
        resultado: "Verónica miente sin estrés fisiológico."
      },
      {
        id: "ayuda_2",
        nombre: "Análisis de medicación",
        descripcion: "Revisar acceso",
        resultado: "Solo el personal tenía llaves."
      },
      {
        id: "ayuda_3",
        nombre: "Reconstrucción de rutinas",
        descripcion: "Cruzar horarios",
        resultado: "Verónica fue vista fuera de su habitación."
      }
    ],
    giroFinal: "Verónica manipuló al personal para administrar las dosis. El cuaderno contenía pruebas de su diagnóstico real.",
    culpableId: "sospechoso_2"
  },
  {
    titulo: "El Error de los Tres Minutos",
    historia: "Durante una simulación de emergencia en la central eléctrica de Puerto Norte, se produjo un apagón real que dejó sin energía a toda la región por casi seis horas. No hubo víctimas, pero el impacto económico fue enorme.\n\nLa investigación inicial apuntó a un fallo humano, pero los registros muestran una discrepancia exacta de tres minutos entre sistemas redundantes. Alguien intervino, pero no para sabotear, sino para demostrar algo.\n\nEl caso no trata de encontrar a un criminal violento, sino de entender quién manipuló el sistema y por qué. Las motivaciones son éticas, políticas y personales.\n\nResolverlo requiere entender sistemas complejos, intenciones ocultas y dilemas morales.",
    ambientacion: "Central eléctrica, simulacro nocturno.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Ingeniera Ramos",
        descripcion: "Responsable del simulacro.",
        motivacion: "Probar vulnerabilidades",
        alibi: "En la sala de control"
      },
      {
        id: "sospechoso_2",
        nombre: "Tomás Varela",
        descripcion: "Auditor externo.",
        motivacion: "Exponer negligencia",
        alibi: "Observador"
      },
      {
        id: "sospechoso_3",
        nombre: "Sofía Klein",
        descripcion: "Programadora del sistema.",
        motivacion: "Advertir fallas críticas",
        alibi: "En remoto"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Desfase exacto",
        descripcion: "Tres minutos no aleatorios.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_2",
        titulo: "Script oculto",
        descripcion: "Código no documentado.",
        relevancia: "media",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_3",
        titulo: "Informe ignorado",
        descripcion: "Advertencias previas descartadas.",
        relevancia: "alta",
        descubierta: false,
        tipo: "documento"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Auditoría técnica",
        descripcion: "Revisar logs",
        resultado: "El script fue ejecutado manualmente."
      },
      {
        id: "ayuda_2",
        nombre: "Entrevista ética",
        descripcion: "Presionar motivos",
        resultado: "Alguien quería evitar una catástrofe mayor."
      },
      {
        id: "ayuda_3",
        nombre: "Simulación inversa",
        descripcion: "Repetir escenario",
        resultado: "El sistema colapsaría sin esa intervención."
      }
    ],
    giroFinal: "Sofía provocó el apagón controlado para forzar una revisión que evitó una futura tragedia.",
    culpableId: "sospechoso_3"
  },
  {
    titulo: "La Ciudad Debajo del Agua",
    historia: "Cuando el embalse de San Roque bajó a mínimos históricos por la sequía, comenzaron a emerger los restos de una antigua ciudad inundada en los años 70. Calles, cimientos, una escuela y lo que parecía ser un hospital rural quedaron parcialmente expuestos. El hallazgo atrajo curiosos, arqueólogos y periodistas.\n\nDurante una exploración autorizada, el cuerpo de Mauro Ibarra, historiador independiente y activista, fue encontrado dentro de lo que había sido una sala administrativa. Oficialmente murió por un derrumbe, pero las lesiones no coinciden con un accidente.\n\nMauro investigaba la relocalización forzada de los habitantes del pueblo original. Según sus publicaciones, varias muertes nunca fueron registradas y hubo desapariciones vinculadas a intereses políticos y económicos. Días antes de morir había anunciado que publicaría documentos inéditos.\n\nLa investigación se vuelve especialmente compleja porque casi todos los involucrados tienen motivos legítimos para querer silenciarlo, pero también razones para proteger la verdad. El crimen no busca solo matar a una persona, sino mantener enterrada una historia.\n\nResolver el caso exige distinguir entre culpa directa y responsabilidad moral. No todos los mentirosos son asesinos, y no todos los asesinos actuaron solos.",
    ambientacion: "Pueblo inundado emergiendo, estructuras en ruinas, clima seco.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Raúl Méndez",
        descripcion: "Ex funcionario provincial.",
        motivacion: "Evitar juicios históricos",
        alibi: "Entrevista televisiva"
      },
      {
        id: "sospechoso_2",
        nombre: "Lucía Ibarra",
        descripcion: "Hermana de la víctima.",
        motivacion: "Conflictos familiares",
        alibi: "En el campamento base"
      },
      {
        id: "sospechoso_3",
        nombre: "Héctor Salinas",
        descripcion: "Guía local.",
        motivacion: "Proteger secretos del pueblo",
        alibi: "Guiando turistas"
      },
      {
        id: "sospechoso_4",
        nombre: "Natalia Ponce",
        descripcion: "Periodista investigativa.",
        motivacion: "Exclusiva periodística",
        alibi: "Editando material"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Golpe previo",
        descripcion: "Mauro tenía una fractura antes del derrumbe.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Documentos faltantes",
        descripcion: "Su mochila estaba vacía.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_3",
        titulo: "Audios editados",
        descripcion: "Una entrevista fue recortada.",
        relevancia: "media",
        descubierta: false,
        tipo: "digital"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis forense",
        descripcion: "Examinar lesiones",
        resultado: "El golpe fue con un objeto contundente."
      },
      {
        id: "ayuda_2",
        nombre: "Restauración de audio",
        descripcion: "Escuchar el material completo",
        resultado: "Natalia ocultó nombres deliberadamente."
      },
      {
        id: "ayuda_3",
        nombre: "Reconstrucción de hechos",
        descripcion: "Simular el recorrido",
        resultado: "Héctor fue el último en estar con Mauro."
      }
    ],
    giroFinal: "Héctor empujó a Mauro durante una discusión, pero Natalia encubrió el crimen para proteger su investigación y publicar la verdad gradualmente.",
    culpableId: "sospechoso_3"
  },
  {
    titulo: "Las Cartas que Nunca Ardieron",
    historia: "El incendio en el antiguo correo central de Valmora fue catalogado oficialmente como un accidente eléctrico. Sin embargo, cuando los bomberos removieron los escombros, encontraron algo inquietante: una sala completamente intacta en el subsuelo, protegida del fuego, donde se almacenaban cartas nunca entregadas desde hacía más de treinta años.\n\nEntre ellas, una correspondencia reciente llamó la atención de la policía: cartas dirigidas a políticos, jueces y empresarios locales, escritas por distintas personas, pero con una caligrafía inquietantemente similar. Todas denunciaban delitos graves, corrupción, encubrimientos y muertes encajonadas. Ninguna había sido enviada.\n\nLa noche del incendio, el jefe del archivo histórico, Rubén Salas, fue encontrado muerto en su oficina. Oficialmente, por inhalación de humo. La autopsia reveló otra cosa: había sido asesinado antes de que el fuego comenzara.\n\nRubén llevaba años clasificando correspondencia olvidada. En los últimos meses había solicitado acceso restringido a archivos sellados y había mantenido reuniones privadas con personas que negaron conocerlo. La clave del caso no está en el fuego, sino en entender por qué alguien quiso destruir el edificio pero preservar esa sala.\n\nLas cartas no eran denuncias comunes: eran copias. Alguien había recopilado información comprometedora durante décadas, esperando el momento adecuado para usarla. Rubén no era el autor, pero sí el guardián. Resolver el caso implica reconstruir una red de silencios, favores y traiciones que atraviesa generaciones.\n\nEl desafío no es descubrir quién mató a Rubén, sino por qué eligieron ese momento exacto para hacerlo, y qué temían que él revelara.",
    ambientacion: "Correo central incendiado, archivos subterráneos, madrugada.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Rubén Salas",
        descripcion: "Jefe del archivo, meticuloso y solitario.",
        motivacion: "Amenazar con revelar información",
        alibi: "Víctima"
      },
      {
        id: "sospechoso_2",
        nombre: "Claudia Morante",
        descripcion: "Funcionaria judicial mencionada en varias cartas.",
        motivacion: "Evitar que se filtren denuncias",
        alibi: "Cena oficial"
      },
      {
        id: "sospechoso_3",
        nombre: "Leandro Vivas",
        descripcion: "Empresario local con causas archivadas.",
        motivacion: "Silenciar al archivista",
        alibi: "Viaje de negocios"
      },
      {
        id: "sospechoso_4",
        nombre: "Marcos Rinaldi",
        descripcion: "Bombero voluntario, hijo de una denunciante fallecida.",
        motivacion: "Venganza",
        alibi: "Primer respondiente al incendio"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Sala intacta",
        descripcion: "El fuego fue contenido deliberadamente lejos del subsuelo.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_2",
        titulo: "Caligrafía idéntica",
        descripcion: "Cartas firmadas por distintas personas con la misma letra.",
        relevancia: "media",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_3",
        titulo: "Informe forense",
        descripcion: "Rubén murió antes del incendio.",
        relevancia: "alta",
        descubierta: false,
        tipo: "física"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis caligráfico",
        descripcion: "Comparar la letra",
        resultado: "La caligrafía pertenece a Rubén."
      },
      {
        id: "ayuda_2",
        nombre: "Seguimiento financiero",
        descripcion: "Revisar cuentas",
        resultado: "Rubén recibía pagos pequeños de múltiples fuentes."
      },
      {
        id: "ayuda_3",
        nombre: "Reconstrucción del incendio",
        descripcion: "Simular el fuego",
        resultado: "El incendio fue iniciado para destruir oficinas, no archivos."
      }
    ],
    giroFinal: "Rubén no era un héroe ni un villano: chantajeaba a los implicados con las cartas. Marcos lo asesinó al descubrir que su madre había sido usada como pieza de presión.",
    culpableId: "sospechoso_4"
  },
  {
    titulo: "El Testamento de Ceniza",
    historia: "Cuando el prestigioso abogado Héctor Salvatierra murió en el incendio de su estudio, la ciudad lo consideró una tragedia. Sin embargo, los investigadores pronto descubrieron que el fuego fue provocado y que Héctor estaba muerto antes de que comenzaran las llamas.\n\nSalvatierra manejaba los testamentos y fideicomisos más delicados de la región. En los meses previos había modificado documentos clave, generado conflictos familiares y acumulado enemigos poderosos. Su muerte desató una guerra silenciosa por herencias millonarias.\n\nEl estudio no solo albergaba expedientes legales, sino grabaciones, acuerdos informales y documentos comprometedores. El incendio destruyó casi todo, pero algunas pruebas sobrevivieron parcialmente. Cada sospechoso parece tener un motivo legítimo y una coartada cuidadosamente construida.\n\nResolver este caso exige atención extrema al detalle, memoria, y la capacidad de detectar contradicciones mínimas. La verdad no está en una sola pista, sino en la combinación precisa de varias medias verdades.",
    ambientacion: "Estudio jurídico incendiado, madrugada.",
    dificultad: "difícil",
    jugadores: 4,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Marina Salvatierra",
        descripcion: "Hija del abogado, recientemente desheredada.",
        motivacion: "Recuperar la herencia",
        alibi: "Cena con amigos"
      },
      {
        id: "sospechoso_2",
        nombre: "Jorge Lema",
        descripcion: "Socio legal desplazado.",
        motivacion: "Control del estudio",
        alibi: "Trabajando desde casa"
      },
      {
        id: "sospechoso_3",
        nombre: "Rosa Ibarra",
        descripcion: "Secretaria histórica.",
        motivacion: "Evitar que saliera a la luz un fraude",
        alibi: "Archivando documentos"
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Documento chamuscado",
        descripcion: "Un testamento parcialmente quemado con fecha reciente.",
        relevancia: "alta",
        descubierta: false,
        tipo: "documento"
      },
      {
        id: "pista_2",
        titulo: "Acelerante",
        descripcion: "Restos de acelerante en el piso.",
        relevancia: "media",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_3",
        titulo: "Grabación dañada",
        descripcion: "Audio incompleto encontrado en un disco duro.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Reconstrucción forense",
        descripcion: "Analizar el incendio",
        resultado: "El fuego fue posterior a la muerte."
      },
      {
        id: "ayuda_2",
        nombre: "Restauración de audio",
        descripcion: "Limpiar la grabación",
        resultado: "Rosa discute con Héctor sobre documentos falsificados."
      },
      {
        id: "ayuda_3",
        nombre: "Peritaje legal",
        descripcion: "Revisar testamentos",
        resultado: "Rosa figuraba como beneficiaria secreta."
      }
    ],
    giroFinal: "Rosa asesinó a Héctor para evitar que revelara el fraude que ella había cometido durante años.",
    culpableId: "sospechoso_3"
  },
  {
    titulo: "El Silencio del Servidor",
    historia: "La empresa de seguridad privada Orbis custodió durante años los sistemas de acceso de media ciudad: edificios públicos, clínicas, laboratorios y bancos. Su orgullo era un servidor viejo, encerrado en una sala sin ventanas, donde se almacenaban logs de entrada y salida que, en teoría, nadie podía alterar sin dejar rastro.\n\nLa noche del miércoles, a las 02:14, una alarma silenciosa se disparó en la central. No hubo robo, no hubo intrusión visible. Pero a las 07:30, cuando la auditora interna Valeria Núñez llegó a la oficina, encontró a Bruno Ledesma —administrador de sistemas— muerto en la sala de servidores. La puerta estaba cerrada por dentro con el sistema biométrico activado, y el aire acondicionado estaba demasiado frío, como si alguien hubiese forzado el termostato al mínimo.\n\nLa autopsia preliminar habló de un infarto, pero había un detalle incómodo: la pantalla del servidor mostraba una consola abierta con un comando a medio escribir. Y, en el registro de eventos, faltaban exactamente 11 minutos de logs: de 02:06 a 02:17.\n\n\"No se borran once minutos por accidente\", dijo Valeria, mirando el reloj de pared que no hacía ruido. En el edificio, esa noche, solo tres personas tenían acceso a la sala: Bruno, por supuesto; Iara Funes, jefa de operaciones que conocía el sistema por encima; y Esteban Roldán, técnico tercerizado que había estado reemplazando lectores en la planta baja.\n\nEl problema del caso no es solo quién mató a Bruno, sino por qué alguien necesitaba que esos once minutos desaparecieran. Y por qué Bruno murió con una consola abierta, como si hubiera intentado detener algo que ya estaba ocurriendo.\n\nLa investigación se vuelve particularmente difícil cuando se descubre que los logs faltantes no coinciden con ninguna caída de energía, y que el sistema registró accesos \"perfectos\" justo después: entradas limpias, sin errores, sin reintentos. Demasiado limpios.",
    ambientacion: "Oficina de seguridad privada, madrugada, sala de servidores con zumbido constante y frío antinatural.",
    dificultad: "difícil",
    jugadores: 3,
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Iara Funes",
        descripcion: "Jefa de operaciones, controla turnos y reportes, presión constante por contratos.",
        motivacion: "Evitar que se descubra una alteración de accesos que compromete un cliente clave.",
        alibi: "Dice que estaba en su casa, conectada al panel remoto por mantenimiento." 
      },
      {
        id: "sospechoso_2",
        nombre: "Esteban Roldán",
        descripcion: "Técnico tercerizado, acceso temporal, conoce hardware y reemplazos de lectores.",
        motivacion: "Cobrar por instalar una puerta trasera y culpar a Bruno si algo salía mal.",
        alibi: "Asegura que a las 02:10 estaba en planta baja guardando herramientas, visto por nadie." 
      },
      {
        id: "sospechoso_3",
        nombre: "Valeria Núñez",
        descripcion: "Auditora interna, meticulosa, investigaba irregularidades recientes.",
        motivacion: "Silenciar a Bruno si él descubrió que su auditoría estaba comprometida desde adentro.",
        alibi: "Afirma que esa noche no estuvo en el edificio; recién llegó a las 07:30." 
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Once minutos ausentes",
        descripcion: "El log central tiene un hueco exacto de 02:06 a 02:17, sin registro de reinicio ni corte.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      },
      {
        id: "pista_2",
        titulo: "Termostato forzado",
        descripcion: "El termostato de la sala marca 15°C y tiene un override manual activado desde el panel físico.",
        relevancia: "media",
        descubierta: false,
        tipo: "física"
      },
      {
        id: "pista_3",
        titulo: "Comando incompleto",
        descripcion: "En la consola quedó escrito: 'rsync --delete /var/log/...' como si Bruno hubiese intentado copiar o restaurar logs.",
        relevancia: "alta",
        descubierta: false,
        tipo: "digital"
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Forense de accesos",
        descripcion: "Comparar logs locales vs central",
        resultado: "En un lector de planta baja hay registros locales que no llegaron al servidor central durante esos 11 minutos." 
      },
      {
        id: "ayuda_2",
        nombre: "Análisis del override",
        descripcion: "Revisar quién pudo tocar el panel",
        resultado: "El override requiere una llave de gabinete; Esteban pidió esa llave por \"protocolo\" esa misma tarde." 
      },
      {
        id: "ayuda_3",
        nombre: "Recuperación de sesión",
        descripcion: "Inspeccionar historial de terminal",
        resultado: "Bruno inició sesión a las 02:05 y ejecutó un script llamado 'integridad_logs.sh'. A los 02:06 la sesión muestra comandos ejecutados desde otra cuenta con privilegios." 
      }
    ],
    giroFinal: "Esteban instaló una puerta trasera en un lector y usó la llave del gabinete para forzar el clima y provocar una situación de estrés en Bruno mientras borraba el tramo de logs. Bruno intentó restaurarlos, pero Esteban ejecutó los comandos desde otra cuenta y lo dejó encerrado. La sala cerrada por dentro fue un montaje: el sistema aceptó un acceso 'limpio' gracias a la alteración de lecturas.",
    culpableId: "sospechoso_2"
  }
];
