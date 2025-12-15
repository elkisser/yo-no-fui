import type { Handler, HandlerResponse } from '@netlify/functions';
import OpenAI from 'openai';

// Verificar si tenemos la API key
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;
if (hasOpenAIKey) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI configurado correctamente');
} else {
  console.warn('OPENAI_API_KEY no encontrada. Usando modo de prueba.');
}

// Casos de ejemplo predefinidos para cuando no hay API key
const casosDeEjemplo = [
  {
    titulo: "El Misterio del Diamante Nocturno",
    historia: "Durante la gala benéfica anual del Museo de Arte Moderno, el famoso Diamante Nocturno desapareció de su vitrina blindada. No hubo signos de fuerza, ni alarmas sonaron. Los únicos con acceso eran seis personas: el curador, el dueño, dos guardias de seguridad, y dos invitados VIP. Cada uno tiene motivos, cada uno tiene secretos. Tu trabajo es descubrir quién mintió y quién robó el diamante.",
    ambientacion: "Museo de arte moderno, noche lluviosa. Las luces tenues crean sombras alargadas. El sonido de la lluvia contra los ventanales es constante.",
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Dr. Alexander Vance",
        descripcion: "Curador del museo. Conocía cada detalle de seguridad. Tiene problemas financieros.",
        motivacion: "Deudas de juego que necesita pagar urgentemente.",
        alibi: "Afirma haber estado revisando documentos en su oficina."
      },
      {
        id: "sospechoso_2",
        nombre: "Victoria Sterling",
        descripcion: "Dueña del diamante. Lo había puesto en subasta contra su voluntad.",
        motivacion: "Quería recuperar el diamante familiar antes de la venta.",
        alibi: "Dice haber estado en el baño durante el incidente."
      },
      {
        id: "sospechoso_3",
        nombre: "Marco Rossi",
        descripcion: "Guardia de seguridad. Ex convicto por robo. Fue el último en hacer la ronda.",
        motivacion: "Regreso a su vida criminal.",
        alibi: "Asegura haber estado en su puesto de vigilancia."
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Llave maestra duplicada",
        descripcion: "Encontrada cerca de la vitrina. Solo el personal autorizado tenía acceso.",
        relevancia: "alta",
        confiable: true,
        sospechososVinculados: ["sospechoso_1", "sospechoso_3"]
      },
      {
        id: "pista_2",
        titulo: "Mancha de lápiz labial",
        descripcion: "En el vidrio de la vitrina. Color distintivo que coincide con una marca cara.",
        relevancia: "media",
        confiable: true,
        sospechososVinculados: ["sospechoso_2"]
      }
    ],
    ayudas: [
      {
        id: "ayuda_1",
        nombre: "Análisis Forense",
        descripcion: "Examina la llave maestra en detalle"
      },
      {
        id: "ayuda_2",
        nombre: "Verificación de Alibi",
        descripcion: "Confirma las declaraciones de los sospechosos"
      }
    ],
    culpableId: "sospechoso_1"
  },
  {
    titulo: "El Secreto del Reloj Parlante",
    historia: "En la biblioteca privada del coleccionista Reginald Thorne, un reloj parlante del siglo XIX que supuestamente revelaba secretos familiares fue destruido. Thorne fue encontrado inconsciente junto a los restos del reloj. Tres personas tenían acceso a la biblioteca: su heredero resentido, su asistente personal, y un historiador especializado en artefactos misteriosos. Cada uno tenía razones para querer silenciar al reloj para siempre.",
    ambientacion: "Biblioteca victoriana llena de antigüedades. El olor a libros viejos y cera para muebles llena el aire. Relojes de todo tipo marcan el tiempo en sincronía extraña.",
    sospechosos: [
      {
        id: "sospechoso_1",
        nombre: "Edward Thorne",
        descripcion: "Heredero y sobrino del coleccionista. Estaba en desacuerdo con su tío sobre la venta de la colección.",
        motivacion: "Evitar que el reloj revelara secretos que podrían desheredarlo.",
        alibi: "Afirma haber estado en su club social."
      },
      {
        id: "sospechoso_2",
        nombre: "Eleanor Gray",
        descripcion: "Asistente personal. Conocía todos los secretos de Thorne y su agenda.",
        motivacion: "Proteger secretos propios que el reloj podría revelar.",
        alibi: "Dice haber estado haciendo diligencias en la ciudad."
      }
    ],
    pistas: [
      {
        id: "pista_1",
        titulo: "Fragmento de tela azul",
        descripcion: "Atrapado en el mecanismo destruido del reloj. Coincide con un tipo de tela específico.",
        relevancia: "alta",
        confiable: true,
        sospechososVinculados: ["sospechoso_1"]
      }
    ],
    culpableId: "sospechoso_1"
  }
];

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  console.log('Función invocada. ¿Tiene OpenAI?', hasOpenAIKey);
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    let casoGenerado;
    
    // Si tenemos OpenAI, usarlo
    if (openai && hasOpenAIKey) {
      console.log('Usando OpenAI para generar caso...');
      
      const body = JSON.parse(event.body || '{}');
      const { tema = '', complejidad = 'media' } = body;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un escritor de misterios. Genera un caso criminal en español en formato JSON.`
          },
          {
            role: "user",
            content: `Crea un misterio sobre ${tema || 'un crimen intrigante'} con dificultad ${complejidad}.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1500,
      });

      casoGenerado = JSON.parse(completion.choices[0].message.content || '{}');
      console.log('Caso generado con OpenAI');
    } else {
      // Usar caso de ejemplo
      console.log('Usando caso de ejemplo (sin API key)');
      const randomIndex = Math.floor(Math.random() * casosDeEjemplo.length);
      casoGenerado = casosDeEjemplo[randomIndex];
    }

    // Validar y completar el caso
    if (!casoGenerado.titulo) {
      casoGenerado.titulo = "Misterio sin nombre";
    }

    if (!Array.isArray(casoGenerado.sospechosos) || casoGenerado.sospechosos.length === 0) {
      casoGenerado.sospechosos = [
        {
          id: "sospechoso_1",
          nombre: "Sospechoso Desconocido",
          descripcion: "Información pendiente",
          motivacion: "Desconocida",
          alibi: "Por verificar"
        }
      ];
    }

    // Asegurar IDs únicos
    casoGenerado.sospechosos = casoGenerado.sospechosos.map((s: any, i: number) => ({
      ...s,
      id: s.id || `sospechoso_${i + 1}`
    }));

    casoGenerado.pistas = (casoGenerado.pistas || []).map((p: any, i: number) => ({
      ...p,
      id: p.id || `pista_${i + 1}`,
      relevancia: p.relevancia || 'media',
      confiable: typeof p.confiable === 'boolean' ? p.confiable : true,
      sospechososVinculados: p.sospechososVinculados || []
    }));

    casoGenerado.ayudas = casoGenerado.ayudas || [
      {
        id: "ayuda_1",
        nombre: "Análisis de Evidencia",
        descripcion: "Examina una pista en detalle"
      },
      {
        id: "ayuda_2",
        nombre: "Verificación de Coartada", 
        descripcion: "Confirma el alibi de un sospechoso"
      }
    ];

    // Si no hay culpable, elegir uno al azar
    if (!casoGenerado.culpableId && casoGenerado.sospechosos.length > 0) {
      const randomSospechoso = casoGenerado.sospechosos[
        Math.floor(Math.random() * casoGenerado.sospechosos.length)
      ];
      casoGenerado.culpableId = randomSospechoso.id;
    }

    const casoCompleto = {
      ...casoGenerado,
      id: `caso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resuelto: false,
      creadoEn: new Date().toISOString(),
      usandoOpenAI: hasOpenAIKey,
      usandoEjemplo: !hasOpenAIKey
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(casoCompleto),
    };

  } catch (error) {
    console.error('Error en función:', error);
    
    // Caso de fallback en caso de error
    const casoFallback = {
      id: `caso_fallback_${Date.now()}`,
      titulo: "Caso de Ejemplo - El Reloj Desaparecido",
      historia: "Un reloj antiguo valioso ha desaparecido de la mansión durante una tormenta. Todos los sospechosos tienen motivos y coartadas que deben ser verificadas. Tu trabajo es analizar las pistas y descubrir al culpable.",
      ambientacion: "Mansión victoriana, noche de tormenta eléctrica.",
      sospechosos: [
        {
          id: "sospechoso_1",
          nombre: "Arthur Pendleton",
          descripcion: "Dueño de la mansión. Tiene grandes deudas.",
          motivacion: "Necesita dinero urgentemente para pagar préstamos.",
          alibi: "Afirma haber estado dormido en su habitación."
        },
        {
          id: "sospechoso_2",
          nombre: "Clara Winslow",
          descripcion: "Invitada de la familia. Coleccionista de relojes antiguos.",
          motivacion: "Deseo obsesivo por añadir el reloj a su colección.",
          alibi: "Dice haber estado en la biblioteca leyendo."
        }
      ],
      pistas: [
        {
          id: "pista_1",
          titulo: "Huella en el polvo",
          descripcion: "Encontrada cerca del estuche vacío del reloj.",
          relevancia: "alta",
          confiable: true,
          sospechososVinculados: ["sospechoso_1"]
        },
        {
          id: "pista_2",
          titulo: "Testimonio del mayordomo",
          descripcion: "Escuchó ruidos cerca de la vitrina a medianoche.",
          relevancia: "media",
          confiable: false,
          sospechososVinculados: []
        }
      ],
      ayudas: [
        {
          id: "ayuda_1",
          nombre: "Análisis de Huellas",
          descripcion: "Identifica a quién pertenece la huella"
        }
      ],
      culpableId: "sospechoso_1",
      resuelto: false,
      creadoEn: new Date().toISOString(),
      esFallback: true
    };

    return {
      statusCode: 200, // Devolver 200 con caso fallback en lugar de error
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(casoFallback),
    };
  }
};