// Script para insertar 40 relojes de ejemplo
const db = require('./db');

const watches = [
  // ==================== ULTRA LUJO (50.000€+) ====================
  {
    name: "Patek Philippe Nautilus 5711/1A",
    description: "El Nautilus 5711 es una de las piezas más codiciadas del mundo relojero. Diseñado por el legendario Gérald Genta en 1976, presenta una caja de acero inoxidable de 40mm con el icónico bisel octogonal con esquinas redondeadas. Su esfera azul degradada con textura horizontal es inconfundible. Equipado con el calibre automático 26-330 S C con fecha y segundero central, ofrece una reserva de marcha de 45 horas. Resistente al agua hasta 120 metros.",
    image_url: null,
    brand: "Patek Philippe",
    color: "Azul",
    price: 85000
  },
  {
    name: "Audemars Piguet Royal Oak 15500ST",
    description: "El Royal Oak revolucionó la industria relojera en 1972 cuando Gérald Genta creó el primer reloj deportivo de lujo en acero. Esta referencia 15500ST presenta una caja de 41mm con el característico bisel octogonal fijado con 8 tornillos hexagonales visibles. La esfera Grande Tapisserie azul es un trabajo artesanal extraordinario. Movimiento automático Calibre 4302 con 70 horas de reserva de marcha. Cristal de zafiro y fondo transparente.",
    image_url: null,
    brand: "Audemars Piguet",
    color: "Azul",
    price: 42000
  },
  {
    name: "Vacheron Constantin Overseas",
    description: "El Overseas representa la elegancia deportiva de la manufactura más antigua del mundo en funcionamiento continuo desde 1755. Caja de acero de 41mm con la emblemática cruz de Malta grabada en el bisel. Sistema de correas intercambiables sin herramientas. Movimiento automático Calibre 5100 con masa oscilante de oro de 22 quilates. Resistencia al agua de 150 metros y resistencia magnética de 25.000 A/m.",
    image_url: null,
    brand: "Vacheron Constantin",
    color: "Gris",
    price: 28500
  },
  {
    name: "A. Lange & Söhne Lange 1",
    description: "El Lange 1 es el emblema de la alta relojería alemana de Glashütte. Su asimétrica disposición de esfera con fecha grande outsize date es inmediatamente reconocible. Caja de oro rosa de 38.5mm con acabado perfecto. Movimiento manual L121.1 con 72 horas de reserva, visible a través del fondo de zafiro mostrando el acabado Glashütte con tres cuartos de platina grabada a mano.",
    image_url: null,
    brand: "A. Lange & Söhne",
    color: "Plateado",
    price: 52000
  },

  // ==================== LUJO (10.000€ - 50.000€) ====================
  {
    name: "Rolex Submariner Date 126610LN",
    description: "El Submariner es el reloj de buceo más icónico jamás creado, introducido en 1953. Esta referencia 126610LN presenta caja Oyster de 41mm en acero Oystersteel con bisel giratorio unidireccional Cerachrom negro. Movimiento automático Calibre 3235 con espiral Chronergy y 70 horas de reserva. Resistente al agua hasta 300 metros. Brazalete Oyster con cierre Oysterlock y sistema de extensión Glidelock.",
    image_url: null,
    brand: "Rolex",
    color: "Negro",
    price: 10500
  },
  {
    name: "Rolex Daytona 116500LN",
    description: "El Cosmograph Daytona es el cronógrafo más deseado del mundo, creado en 1963 para pilotos de carreras. Caja de 40mm en acero Oystersteel con bisel Cerachrom negro con escala taquimétrica. Movimiento cronógrafo automático Calibre 4130 enteramente desarrollado por Rolex con 72 horas de reserva. Pulsadores atornillados y resistencia al agua de 100 metros.",
    image_url: null,
    brand: "Rolex",
    color: "Blanco",
    price: 32000
  },
  {
    name: "Omega Speedmaster Moonwatch Professional",
    description: "El Speedmaster Professional es el único reloj certificado por la NASA para misiones espaciales tripuladas y el primero usado en la Luna en 1969. Caja de acero de 42mm con cristal Hesalite como el original. Nuevo movimiento manual Co-Axial Master Chronometer Calibre 3861 con certificación METAS. Cronógrafo con escala taquimétrica. 50 horas de reserva de marcha.",
    image_url: null,
    brand: "Omega",
    color: "Negro",
    price: 7350
  },
  {
    name: "Omega Seamaster 300M Diver",
    description: "El Seamaster 300M combina herencia náutica con tecnología de vanguardia. Caja de 42mm en acero con bisel cerámico unidireccional. Esfera negra con ondas grabadas por láser y índices de Super-LumiNova. Movimiento Co-Axial Master Chronometer Calibre 8800 resistente a campos magnéticos de 15.000 gauss. Válvula de helio y resistencia a 300 metros.",
    image_url: null,
    brand: "Omega",
    color: "Negro",
    price: 5700
  },
  {
    name: "Cartier Santos de Cartier Medium",
    description: "El Santos fue el primer reloj de pulsera moderno, creado en 1904 por Louis Cartier para su amigo aviador Alberto Santos-Dumont. Esta versión presenta caja de acero de 35.1mm con el icónico diseño de tornillos visibles. Sistema QuickSwitch para cambio de correa sin herramientas y SmartLink para ajuste del brazalete. Movimiento automático 1847 MC con 42 horas de reserva.",
    image_url: null,
    brand: "Cartier",
    color: "Plateado",
    price: 7550
  },
  {
    name: "Jaeger-LeCoultre Reverso Classic",
    description: "El Reverso fue creado en 1931 para jugadores de polo que necesitaban proteger el cristal durante los partidos. Su caja rectangular Art Déco puede girarse 180 grados revelando un fondo sólido o una segunda esfera. Dimensiones de 40.1 x 24.4mm en acero. Movimiento manual Calibre 822/2 con 42 horas de reserva. Una obra maestra del diseño relojero.",
    image_url: null,
    brand: "Jaeger-LeCoultre",
    color: "Blanco",
    price: 9200
  },
  {
    name: "IWC Portugieser Chronograph",
    description: "El Portugieser nació en 1939 cuando dos importadores portugueses pidieron a IWC un reloj de pulsera con la precisión de un cronómetro de marina. Caja de acero de 41mm con diseño limpio y elegante. Movimiento cronógrafo automático Calibre 69355 con 46 horas de reserva. Subesferas a las 6 y 12 horas con segundero pequeño y totalizador de 30 minutos.",
    image_url: null,
    brand: "IWC",
    color: "Azul",
    price: 8950
  },
  {
    name: "Panerai Luminor Marina 44mm",
    description: "El Luminor Marina hereda el legado de los relojes militares italianos creados para la Marina Militare. Caja de 44mm en acero AISI 316L con el distintivo protector de corona con palanca. Esfera sándwich con Super-LumiNova para máxima legibilidad submarina. Movimiento automático P.9010 con 3 días de reserva de marcha. Resistente al agua hasta 300 metros.",
    image_url: null,
    brand: "Panerai",
    color: "Negro",
    price: 9100
  },
  {
    name: "Blancpain Fifty Fathoms",
    description: "El Fifty Fathoms de 1953 es el primer reloj de buceo moderno, creado para los buzos de combate franceses. Caja de 45mm en acero satinado con bisel unidireccional de zafiro. Movimiento automático Calibre 1315 con 5 días de reserva de marcha y tres barriletes. Resistencia al agua de 300 metros. Un icono que definió el género de los dive watches.",
    image_url: null,
    brand: "Blancpain",
    color: "Negro",
    price: 15200
  },

  // ==================== GAMA ALTA (3.000€ - 10.000€) ====================
  {
    name: "Tudor Black Bay 58",
    description: "El Black Bay 58 rinde homenaje al primer reloj de buceo de Tudor de 1958. Caja de 39mm perfectamente proporcionada en acero con bisel unidireccional de aluminio anodizado. Movimiento manufactura MT5402 con certificación COSC y 70 horas de reserva. Resistente al agua hasta 200 metros. El tamaño vintage perfecto para muñecas de cualquier tamaño.",
    image_url: null,
    brand: "Tudor",
    color: "Negro",
    price: 4100
  },
  {
    name: "Tudor Pelagos 39",
    description: "El Pelagos 39 es un reloj de buceo profesional en titanio grado 2, extremadamente ligero y resistente. Caja de 39mm con bisel cerámico unidireccional. Movimiento manufactura MT5400 con 70 horas de reserva y certificación COSC. Sistema de extensión automático en el brazalete de titanio. Resistente al agua hasta 200 metros con válvula de helio.",
    image_url: null,
    brand: "Tudor",
    color: "Azul",
    price: 4650
  },
  {
    name: "TAG Heuer Carrera Chronograph",
    description: "El Carrera fue creado en 1963 por Jack Heuer, inspirado en la peligrosa carrera Panamericana. Caja de 44mm en acero con diseño deportivo y elegante. Movimiento cronógrafo automático Heuer 02 de manufactura con 80 horas de reserva, visible a través del fondo de zafiro. Subesferas a las 3, 6 y 9 horas. Resistente al agua hasta 100 metros.",
    image_url: null,
    brand: "TAG Heuer",
    color: "Negro",
    price: 5950
  },
  {
    name: "Breitling Navitimer B01 Chronograph 43",
    description: "El Navitimer es el reloj de los pilotos desde 1952, con su icónica regla de cálculo circular para navegación aérea. Caja de 43mm en acero con bisel bidireccional dentado. Movimiento cronógrafo manufactura B01 con 70 horas de reserva y certificación COSC. Esfera negra con tres subesferas contrastantes. Resistente al agua hasta 30 metros.",
    image_url: null,
    brand: "Breitling",
    color: "Negro",
    price: 9350
  },
  {
    name: "Zenith Chronomaster Sport",
    description: "El Chronomaster alberga el legendario El Primero, el primer movimiento cronógrafo automático de alta frecuencia (36.000 vph) presentado en 1969. Caja de 41mm en acero con bisel cerámico. El segundero del cronógrafo da una vuelta completa en 10 segundos, permitiendo medir 1/10 de segundo. Movimiento El Primero 3600 con 60 horas de reserva.",
    image_url: null,
    brand: "Zenith",
    color: "Blanco",
    price: 9700
  },
  {
    name: "Grand Seiko SBGA413 Spring Drive",
    description: "El SBGA413 presenta la revolucionaria tecnología Spring Drive exclusiva de Seiko, que combina la energía de un muelle real con regulación electrónica para una precisión de ±1 segundo al día. Caja de titanio de 40mm con acabado Zaratsu pulido a espejo. Esfera rosa inspirada en los cerezos en flor de primavera. 72 horas de reserva de marcha.",
    image_url: null,
    brand: "Grand Seiko",
    color: "Rosa",
    price: 6800
  },
  {
    name: "Grand Seiko SBGW231",
    description: "El SBGW231 representa la esencia del diseño Grand Seiko con su esfera blanca inmaculada y caja de acero de 37.3mm. Movimiento manual Calibre 9S64 con 72 horas de reserva y precisión de +5/-3 segundos al día. Acabado Zaratsu en la caja y agujas dauphine pulidas a mano. Cristal de zafiro con revestimiento antirreflejos.",
    image_url: null,
    brand: "Grand Seiko",
    color: "Blanco",
    price: 5400
  },
  {
    name: "Longines Spirit Zulu Time",
    description: "El Spirit Zulu Time es un GMT aviador con bisel cerámico bidireccional de 24 horas. Caja de acero de 42mm con asas curvadas para mayor comodidad. Movimiento automático L844.4 basado en el ETA A31.L02 con 72 horas de reserva y certificación COSC. Permite seguir tres zonas horarias simultáneamente. Resistente al agua hasta 100 metros.",
    image_url: null,
    brand: "Longines",
    color: "Azul",
    price: 3350
  },
  {
    name: "Oris Aquis Date 41.5mm",
    description: "El Aquis es el buque insignia de buceo de Oris, la última manufactura suiza independiente. Caja de 41.5mm en acero con bisel cerámico unidireccional. Movimiento automático Calibre 733 basado en Sellita SW200-1 con 38 horas de reserva. Corona de seguridad atornillada y resistencia al agua de 300 metros. Cristal de zafiro abombado.",
    image_url: null,
    brand: "Oris",
    color: "Verde",
    price: 2350
  },

  // ==================== GAMA MEDIA (500€ - 3.000€) ====================
  {
    name: "Tissot PRX Powermatic 80",
    description: "El PRX revive el diseño integrado de los años 70 a un precio accesible. Caja de 40mm en acero con brazalete integrado de eslabones planos. Movimiento automático Powermatic 80 con impresionantes 80 horas de reserva de marcha. Esfera azul sunray con índices aplicados. Cristal de zafiro y resistencia al agua de 100 metros. La mejor relación calidad-precio del mercado.",
    image_url: null,
    brand: "Tissot",
    color: "Azul",
    price: 695
  },
  {
    name: "Tissot Gentleman Powermatic 80 Silicium",
    description: "El Gentleman combina elegancia clásica con tecnología moderna. Caja de 40mm en acero con acabado pulido y satinado. Movimiento Powermatic 80 con espiral de silicio antimagnético y 80 horas de reserva. Esfera negra con textura de damero sutil. Correa de cuero o brazalete de acero. Resistente al agua hasta 100 metros.",
    image_url: null,
    brand: "Tissot",
    color: "Negro",
    price: 795
  },
  {
    name: "Hamilton Khaki Field Mechanical",
    description: "El Khaki Field Mechanical es heredero directo de los relojes militares que Hamilton suministró al ejército estadounidense durante la Segunda Guerra Mundial. Caja de 38mm en acero con acabado satinado. Movimiento manual H-50 con extraordinarias 80 horas de reserva. Esfera negra mate con numeración militar completa. Resistente al agua hasta 50 metros.",
    image_url: null,
    brand: "Hamilton",
    color: "Negro",
    price: 545
  },
  {
    name: "Hamilton Khaki Aviation Pilot Day Date",
    description: "El Khaki Aviation rinde homenaje a la herencia de Hamilton como proveedor de relojes para la aviación militar y comercial americana. Caja de 42mm en acero con corona sobredimensionada para uso con guantes. Movimiento automático H-40 con 80 horas de reserva. Día y fecha a las 3 horas. Esfera negra con numeración árabe de alta legibilidad.",
    image_url: null,
    brand: "Hamilton",
    color: "Negro",
    price: 995
  },
  {
    name: "Seiko Presage Sharp Edged SPB167",
    description: "El Sharp Edged presenta el arte tradicional japonés del origami en su esfera con patrón Asanoha (hojas de cáñamo). Caja de 39.3mm en acero con bordes afilados inspirados en la arquitectura japonesa. Movimiento automático 6R35 con 70 horas de reserva. Cristal de zafiro con revestimiento antirreflejos. Resistente al agua hasta 100 metros.",
    image_url: null,
    brand: "Seiko",
    color: "Blanco",
    price: 950
  },
  {
    name: "Seiko Prospex SPB143 62MAS Reissue",
    description: "El SPB143 es una reinterpretación moderna del legendario 62MAS de 1965, el primer reloj de buceo de Seiko. Caja de 40.5mm en acero con diseño cushion vintage. Movimiento automático 6R35 con 70 horas de reserva. Bisel giratorio unidireccional y resistencia al agua de 200 metros. Cristal de zafiro curvado como el original.",
    image_url: null,
    brand: "Seiko",
    color: "Azul",
    price: 1350
  },
  {
    name: "Certina DS Action Diver Powermatic 80",
    description: "El DS Action Diver ofrece especificaciones profesionales a precio accesible. Caja de 43mm en acero con el sistema DS (Double Security) de Certina para máxima resistencia. Bisel cerámico unidireccional y resistencia al agua de 300 metros con certificación ISO 6425. Movimiento Powermatic 80 con 80 horas de reserva. Válvula de helio automática.",
    image_url: null,
    brand: "Certina",
    color: "Negro",
    price: 895
  },
  {
    name: "Mido Ocean Star 200",
    description: "El Ocean Star 200 es un diver suizo con acabados de gama superior. Caja de 42.5mm en acero con bisel cerámico unidireccional. Movimiento automático Calibre 80 con 80 horas de reserva. Esfera azul degradada con índices luminiscentes. Cristal de zafiro y resistencia al agua de 200 metros. Brazalete de acero con cierre de seguridad.",
    image_url: null,
    brand: "Mido",
    color: "Azul",
    price: 1150
  },
  {
    name: "Frederique Constant Classics Index Automatic",
    description: "Frederique Constant democratiza la alta relojería suiza con este elegante dress watch. Caja de 40mm en acero pulido con bisel fino. Movimiento automático FC-303 de manufactura con 42 horas de reserva. Esfera plateada guilloché con índices romanos aplicados. Agujas tipo hoja en acero azulado. Cristal de zafiro convexo.",
    image_url: null,
    brand: "Frederique Constant",
    color: "Plateado",
    price: 1295
  },
  {
    name: "Junghans Max Bill Automatic",
    description: "Diseñado por el legendario arquitecto y artista Bauhaus Max Bill en 1961, este reloj es un icono del diseño minimalista alemán. Caja de 38mm en acero con cristal Sicralan abombado. Movimiento automático J800.1 con 38 horas de reserva. Esfera blanca inmaculada con tipografía original de Max Bill. Correa de cuero negro con hebilla de acero.",
    image_url: null,
    brand: "Junghans",
    color: "Blanco",
    price: 1195
  },
  {
    name: "Alpina Startimer Pilot Automatic",
    description: "Alpina tiene una larga historia en relojes de aviación desde los años 1930. El Startimer presenta caja de 44mm en acero con corona sobredimensionada. Movimiento automático AL-525 con 38 horas de reserva. Esfera negra mate con triángulo a las 12 y numeración árabe luminiscente. Bisel interno giratorio para cálculos de navegación.",
    image_url: null,
    brand: "Alpina",
    color: "Negro",
    price: 1350
  },

  // ==================== GAMA ENTRADA (100€ - 500€) ====================
  {
    name: "Seiko 5 Sports SRPD55",
    description: "El Seiko 5 es el reloj automático más vendido de la historia, con más de 50 años de producción continua. Esta referencia SRPD55 presenta caja de 42.5mm en acero con bisel giratorio. Movimiento automático 4R36 con hacking y hand-winding, 41 horas de reserva. Esfera azul sunray con día y fecha. Resistente al agua hasta 100 metros.",
    image_url: null,
    brand: "Seiko",
    color: "Azul",
    price: 299
  },
  {
    name: "Orient Bambino Version 2",
    description: "El Bambino es el dress watch automático más elegante en su rango de precio. Caja de 40.5mm en acero con asas curvadas. Movimiento automático Orient Calibre F6724 de manufactura con 40 horas de reserva. Esfera crema con índices dorados y agujas dauphine azuladas. Cristal mineral abombado estilo vintage. Correa de cuero genuino.",
    image_url: null,
    brand: "Orient",
    color: "Crema",
    price: 185
  },
  {
    name: "Orient Kamasu",
    description: "El Kamasu es un diver automático con especificaciones impresionantes para su precio. Caja de 41.8mm en acero con bisel unidireccional de 120 clics. Movimiento automático F6922 con hacking y 40 horas de reserva. Cristal de zafiro, corona atornillada y resistencia al agua de 200 metros. Esfera sunray con índices luminiscentes.",
    image_url: null,
    brand: "Orient",
    color: "Verde",
    price: 295
  },
  {
    name: "Citizen Promaster Diver BN0151",
    description: "El Promaster Diver con tecnología Eco-Drive nunca necesita batería, alimentándose de cualquier fuente de luz. Caja de 44mm en acero con bisel unidireccional. Movimiento Eco-Drive E168 con reserva de marcha de 6 meses en oscuridad total. Resistente al agua hasta 200 metros con certificación ISO 6425. Cristal mineral endurecido.",
    image_url: null,
    brand: "Citizen",
    color: "Negro",
    price: 350
  },
  {
    name: "Casio G-Shock GA-2100-1A1",
    description: "El GA-2100, apodado CasiOak por su parecido con el Royal Oak, es el G-Shock más fino y elegante. Caja de resina de carbono de 45.4mm con estructura octogonal. Movimiento de cuarzo con hora mundial, cronógrafo, temporizador y alarmas. Resistencia a golpes, resistencia al agua de 200 metros y luz LED. Batería de 3 años de duración.",
    image_url: null,
    brand: "Casio",
    color: "Negro",
    price: 99
  },
  {
    name: "Casio G-Shock GW-M5610",
    description: "El GW-M5610 es la evolución del G-Shock original de 1983, ahora con tecnología solar y sincronización atómica por radio. Caja de resina de 46.7mm con el icónico diseño cuadrado. Recibe señales de 6 transmisores atómicos mundiales para precisión absoluta. Resistencia a golpes de 10 metros de caída y resistencia al agua de 200 metros.",
    image_url: null,
    brand: "Casio",
    color: "Negro",
    price: 155
  },
  {
    name: "Timex Marlin Automatic",
    description: "El Marlin Automatic revive el clásico americano de los años 1960 con un movimiento automático moderno. Caja de 40mm en acero inoxidable con acabado pulido. Movimiento automático Miyota 8215 con 40 horas de reserva. Esfera plateada con índices aplicados y logo Timex vintage. Cristal acrílico abombado como el original. Correa de cuero.",
    image_url: null,
    brand: "Timex",
    color: "Plateado",
    price: 249
  },
  {
    name: "Swatch Sistem51 Irony",
    description: "El Sistem51 revolucionó la industria al ser el primer reloj automático suizo ensamblado completamente por robots, con solo 51 componentes. La versión Irony presenta caja de acero de 42mm. Movimiento automático SISTEM51 con 90 horas de reserva, el más largo en su categoría. Hermético y sin posibilidad de apertura. Resistente al agua hasta 30 metros.",
    image_url: null,
    brand: "Swatch",
    color: "Plateado",
    price: 210
  },
  {
    name: "Fossil Neutra Chronograph",
    description: "El Neutra Chronograph combina estética vintage con funcionalidad moderna. Caja de 44mm en acero con acabado cepillado y pulido. Movimiento de cuarzo cronógrafo con fecha. Esfera con textura de lino y subesferas contrastantes. Cristal mineral y resistencia al agua de 50 metros. Correa de cuero genuino con hebilla de acero.",
    image_url: null,
    brand: "Fossil",
    color: "Marrón",
    price: 159
  },
  {
    name: "Bulova Lunar Pilot Chronograph",
    description: "El Lunar Pilot es una reedición del cronógrafo usado por el astronauta Dave Scott en la Luna durante el Apollo 15 cuando su Omega falló. Caja de 45mm en acero con pulsadores de cronógrafo sobredimensionados. Movimiento de cuarzo de alta frecuencia (262 kHz) para precisión de cronógrafo de 1/10 de segundo. Correa de nylon estilo NASA.",
    image_url: null,
    brand: "Bulova",
    color: "Negro",
    price: 450
  }
];

// Insertar productos
console.log('🕐 Insertando 40 relojes...\n');

let inserted = 0;
watches.forEach((watch, index) => {
  const sql = `
    INSERT INTO products (name, description, image_url, brand, color, price, active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;
  
  db.run(sql, [watch.name, watch.description, watch.image_url, watch.brand, watch.color, watch.price], function(err) {
    if (err) {
      console.error(`❌ Error insertando ${watch.name}:`, err.message);
    } else {
      console.log(`✅ ${index + 1}. ${watch.name} - ${watch.price}€`);
    }
    
    inserted++;
    if (inserted === watches.length) {
      console.log('\n🎉 ¡40 relojes insertados correctamente!');
      process.exit(0);
    }
  });
});
