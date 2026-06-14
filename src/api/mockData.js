import { PROPERTY_GALLERIES, GALLERY_SETS } from "../lib/colombiaImages";



const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();



const gallery = (id, type) => PROPERTY_GALLERIES[id] || GALLERY_SETS[type] || GALLERY_SETS.default;



export const SEED_PROPERTIES = [

  {

    id: "prop-1",

    title: "Apartamento en Quinta Camacho",

    description: "Apartamento en Chapinero, cerca del Parque 93. Cocina integral, balcón con vista a los cerros, 2 habitaciones, parqueadero. Espacios luminosos con acabados modernos y excelente ubicación.",

    property_type: "apartamento",

    listing_type: "arriendo",

    building_age: "usado",

    city: "Bogotá",

    monthly_rent: 2800000,

    deposit: 2800000,

    admin_fee: 320000,

    neighborhood: "Quinta Camacho",

    locality: "Chapinero",

    address: "Calle 70 # 9-45",

    bedrooms: 2,

    bathrooms: 2,

    area_sqm: 78,

    floor: 8,

    parking: true,

    parking_spots: 1,

    furnished: "semi_amoblado",

    pets_allowed: false,

    amenities: ["Gimnasio", "Ascensor", "Seguridad 24h", "WiFi"],

    images: gallery("prop-1", "apartamento"),

    available_from: "2026-07-01",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "María González",

    contact_phone: "+573001234567",

    contact_email: "maria@email.com",

    estrato: 5,

    created_date: daysAgo(2),

  },

  {

    id: "prop-2",

    title: "Apartamento en Santa Bárbara",

    description: "Amplio apartamento en Usaquén, zona residencial. 3 habitaciones, terraza, vista a los cerros orientales. Conjunto con amenidades premium.",

    property_type: "apartamento",

    listing_type: "arriendo",

    building_age: "reformado",

    city: "Bogotá",

    monthly_rent: 5500000,

    deposit: 5500000,

    admin_fee: 450000,

    neighborhood: "Santa Bárbara",

    locality: "Usaquén",

    address: "Carrera 7 # 116-50",

    bedrooms: 3,

    bathrooms: 3,

    area_sqm: 145,

    floor: 15,

    parking: true,

    parking_spots: 2,

    furnished: "amoblado",

    pets_allowed: true,

    amenities: ["Terraza", "Gimnasio", "Seguridad 24h", "Piscina", "Ascensor"],

    images: gallery("prop-2", "apartamento"),

    available_from: "2026-06-15",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Carlos Ruiz",

    contact_phone: "+573109876543",

    contact_email: "carlos@email.com",

    estrato: 6,

    created_date: daysAgo(5),

  },

  {

    id: "prop-3",

    title: "Casa en La Alhambra, Suba",

    description: "Casa en barrio residencial de Suba. Jardín, garaje doble, cerca a colegios y centro comercial. Ideal para familias.",

    property_type: "casa",

    listing_type: "arriendo",

    building_age: "usado",

    city: "Bogotá",

    monthly_rent: 3200000,

    deposit: 3200000,

    admin_fee: 0,

    neighborhood: "La Alhambra",

    locality: "Suba",

    address: "Calle 145 # 58-20",

    bedrooms: 4,

    bathrooms: 3,

    area_sqm: 180,

    floor: 1,

    parking: true,

    parking_spots: 2,

    furnished: "sin_amoblar",

    pets_allowed: true,

    amenities: ["Zona verde", "Depósito", "Portería"],

    images: gallery("prop-3", "casa"),

    available_from: "2026-08-01",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Ana Torres",

    contact_phone: "+573151112233",

    contact_email: "ana@email.com",

    estrato: 4,

    created_date: daysAgo(12),

  },

  {

    id: "prop-4",

    title: "Estudio en La Candelaria",

    description: "Estudio céntrico, ideal para estudiantes o profesionales. Cerca a TransMilenio y universidades. Totalmente amoblado.",

    property_type: "estudio",

    listing_type: "arriendo",

    building_age: "reformado",

    city: "Bogotá",

    monthly_rent: 1200000,

    deposit: 1200000,

    admin_fee: 150000,

    neighborhood: "La Candelaria",

    locality: "La Candelaria",

    address: "Carrera 3 # 12-30",

    bedrooms: 1,

    bathrooms: 1,

    area_sqm: 35,

    floor: 3,

    parking: false,

    parking_spots: 0,

    furnished: "amoblado",

    pets_allowed: false,

    amenities: ["Ascensor", "Citófono", "WiFi"],

    images: gallery("prop-4", "estudio"),

    available_from: "2026-06-20",

    min_contract_months: 6,

    status: "disponible",

    contact_name: "Luis Méndez",

    contact_phone: "+573144455566",

    contact_email: "luis@email.com",

    estrato: 3,

    created_date: daysAgo(1),

  },

  {

    id: "prop-5",

    title: "Apartamento en Carvajal, Kennedy",

    description: "Apartamento en conjunto cerrado. Piscina, cancha, salón comunal. Zona familiar con excelentes vías de acceso.",

    property_type: "apartamento",

    listing_type: "arriendo",

    building_age: "nuevo",

    city: "Bogotá",

    monthly_rent: 1900000,

    deposit: 1900000,

    admin_fee: 280000,

    neighborhood: "Carvajal",

    locality: "Kennedy",

    address: "Calle 38 Sur # 78-15",

    bedrooms: 3,

    bathrooms: 2,

    area_sqm: 92,

    floor: 5,

    parking: true,

    parking_spots: 1,

    furnished: "sin_amoblar",

    pets_allowed: true,

    amenities: ["Piscina", "Salón comunal", "Seguridad 24h", "Ascensor"],

    images: gallery("prop-5", "apartamento"),

    available_from: "2026-07-15",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Patricia Vega",

    contact_phone: "+573177788899",

    contact_email: "patricia@email.com",

    estrato: 3,

    created_date: daysAgo(8),

  },

  {

    id: "prop-10",

    title: "Apartamento en El Prado, Barranquilla",

    description: "Apartamento en El Prado, zona residencial de Barranquilla. Amplio, luminoso, 3 habitaciones con buena ventilación.",

    property_type: "apartamento",

    listing_type: "arriendo",

    building_age: "usado",

    city: "Barranquilla",

    monthly_rent: 2400000,

    deposit: 2400000,

    admin_fee: 280000,

    neighborhood: "El Prado",

    locality: "El Prado",

    address: "Calle 85 # 50-30",

    bedrooms: 3,

    bathrooms: 2,

    area_sqm: 110,

    floor: 3,

    parking: true,

    parking_spots: 1,

    furnished: "sin_amoblar",

    pets_allowed: true,

    amenities: ["Zona verde", "Portería", "Ascensor"],

    images: gallery("prop-10", "apartamento"),

    available_from: "2026-07-01",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Ricardo Mora",

    contact_phone: "+573188800011",

    contact_email: "ricardo@email.com",

    estrato: 4,

    created_date: daysAgo(4),

  },

  {

    id: "prop-11",

    title: "Apartamento en Riomar, Barranquilla",

    description: "Apartamento cerca al malecón en Riomar. Brisa marina, 2 habitaciones, zona tranquila y bien conectada.",

    property_type: "apartamento",

    listing_type: "arriendo",

    building_age: "reformado",

    city: "Barranquilla",

    monthly_rent: 2100000,

    deposit: 2100000,

    admin_fee: 260000,

    neighborhood: "Riomar",

    locality: "Riomar",

    address: "Calle 84 # 54-20",

    bedrooms: 2,

    bathrooms: 2,

    area_sqm: 82,

    floor: 6,

    parking: true,

    parking_spots: 1,

    furnished: "semi_amoblado",

    pets_allowed: false,

    amenities: ["Ascensor", "Seguridad 24h", "Zona verde"],

    images: gallery("prop-11", "apartamento"),

    available_from: "2026-07-15",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Valentina Ortiz",

    contact_phone: "+573155566677",

    contact_email: "valentina@email.com",

    estrato: 4,

    created_date: daysAgo(3),

  },

  {

    id: "prop-12",

    title: "Casa en Villa Country, Barranquilla",

    description: "Casa en conjunto cerrado en Villa Country. Patio, 3 habitaciones, ideal para familias. Ambiente residencial premium.",

    property_type: "casa",

    listing_type: "arriendo",

    building_age: "nuevo",

    city: "Barranquilla",

    monthly_rent: 3800000,

    deposit: 3800000,

    admin_fee: 0,

    neighborhood: "Villa Country",

    locality: "Villa Country",

    address: "Calle 98 # 72-10",

    bedrooms: 3,

    bathrooms: 3,

    area_sqm: 145,

    floor: 1,

    parking: true,

    parking_spots: 2,

    furnished: "sin_amoblar",

    pets_allowed: true,

    amenities: ["Piscina", "Zona BBQ", "Seguridad 24h"],

    images: gallery("prop-12", "casa"),

    available_from: "2026-08-01",

    min_contract_months: 12,

    status: "disponible",

    contact_name: "Héctor Peña",

    contact_phone: "+573144455566",

    contact_email: "hector@email.com",

    estrato: 5,

    created_date: daysAgo(15),

  },

  {

    id: "prop-13",

    title: "Habitación en Teusaquillo",

    description: "Habitación en apartamento compartido. Zona universitaria, cerca al Campín. Incluye servicios básicos.",

    property_type: "habitacion",

    listing_type: "arriendo",

    building_age: "usado",

    city: "Bogotá",

    monthly_rent: 850000,

    deposit: 850000,

    admin_fee: 0,

    neighborhood: "Teusaquillo",

    locality: "Teusaquillo",

    address: "Carrera 13 # 38-22",

    bedrooms: 1,

    bathrooms: 1,

    area_sqm: 18,

    floor: 2,

    parking: false,

    parking_spots: 0,

    furnished: "amoblado",

    pets_allowed: false,

    amenities: ["WiFi", "Lavandería"],

    images: gallery("prop-13", "habitacion"),

    available_from: "2026-06-01",

    min_contract_months: 3,

    status: "disponible",

    contact_name: "Sandra López",

    contact_phone: "+573122233344",

    contact_email: "sandra@email.com",

    estrato: 4,

    created_date: daysAgo(6),

  },

  {
    id: "prop-14",
    title: "Apartamento en Chicó Norte",
    description: "Apartamento luminoso en Chicó, cerca a la Zona T. Cocina abierta, balcón y excelente conectividad.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "reformado",
    city: "Bogotá",
    monthly_rent: 4200000,
    deposit: 4200000,
    admin_fee: 380000,
    neighborhood: "Chicó Norte",
    locality: "Chapinero",
    address: "Carrera 11 # 79-20",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 88,
    floor: 11,
    parking: true,
    parking_spots: 1,
    furnished: "semi_amoblado",
    pets_allowed: false,
    amenities: ["Ascensor", "Gimnasio", "Seguridad 24h", "WiFi"],
    images: gallery("prop-14", "apartamento"),
    available_from: "2026-07-10",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Laura Pineda",
    contact_phone: "+573001112233",
    contact_email: "laura@email.com",
    estrato: 6,
    created_date: daysAgo(7),
  },
  {
    id: "prop-15",
    title: "Apartamento en Rosales",
    description: "Apartamento en Rosales con vista a zona verde. Amplio, tranquilo y bien iluminado.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "usado",
    city: "Bogotá",
    monthly_rent: 4800000,
    deposit: 4800000,
    admin_fee: 420000,
    neighborhood: "Rosales",
    locality: "Chapinero",
    address: "Calle 72 # 4-35",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    floor: 9,
    parking: true,
    parking_spots: 2,
    furnished: "sin_amoblar",
    pets_allowed: true,
    amenities: ["Ascensor", "Terraza", "Seguridad 24h", "Piscina"],
    images: gallery("prop-15", "apartamento"),
    available_from: "2026-08-01",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Andrés Mejía",
    contact_phone: "+573002223344",
    contact_email: "andres@email.com",
    estrato: 6,
    created_date: daysAgo(9),
  },
  {
    id: "prop-16",
    title: "Apartamento en Cedritos",
    description: "Apartamento en Cedritos, cerca a estación de TransMilenio. Ideal para profesionales.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "nuevo",
    city: "Bogotá",
    monthly_rent: 2600000,
    deposit: 2600000,
    admin_fee: 300000,
    neighborhood: "Cedritos",
    locality: "Usaquén",
    address: "Calle 147 # 14-60",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 74,
    floor: 7,
    parking: true,
    parking_spots: 1,
    furnished: "sin_amoblar",
    pets_allowed: false,
    amenities: ["Ascensor", "Citófono", "Seguridad 24h"],
    images: gallery("prop-16", "apartamento"),
    available_from: "2026-07-20",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Diana Rojas",
    contact_phone: "+573003334455",
    contact_email: "diana@email.com",
    estrato: 4,
    created_date: daysAgo(4),
  },
  {
    id: "prop-17",
    title: "Apartamento en Modelia",
    description: "Apartamento en Modelia con buenas vías de acceso al aeropuerto. Conjunto con zonas comunes.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "usado",
    city: "Bogotá",
    monthly_rent: 2200000,
    deposit: 2200000,
    admin_fee: 290000,
    neighborhood: "Modelia",
    locality: "Fontibón",
    address: "Calle 24A # 68B-40",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 85,
    floor: 4,
    parking: true,
    parking_spots: 1,
    furnished: "semi_amoblado",
    pets_allowed: true,
    amenities: ["Ascensor", "Salón comunal", "Seguridad 24h", "Zona verde"],
    images: gallery("prop-17", "apartamento"),
    available_from: "2026-07-05",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Felipe Castro",
    contact_phone: "+573004445566",
    contact_email: "felipe@email.com",
    estrato: 3,
    created_date: daysAgo(11),
  },
  {
    id: "prop-18",
    title: "Apartamento en El Salitre",
    description: "Apartamento cerca al Salitre Mágico y Corferias. Zona con amplia oferta comercial.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "reformado",
    city: "Bogotá",
    monthly_rent: 2100000,
    deposit: 2100000,
    admin_fee: 270000,
    neighborhood: "El Salitre",
    locality: "Engativá",
    address: "Carrera 68B # 24A-15",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 68,
    floor: 6,
    parking: false,
    parking_spots: 0,
    furnished: "amoblado",
    pets_allowed: false,
    amenities: ["Ascensor", "Citófono", "WiFi"],
    images: gallery("prop-18", "apartamento"),
    available_from: "2026-06-25",
    min_contract_months: 6,
    status: "disponible",
    contact_name: "Camila Suárez",
    contact_phone: "+573005556677",
    contact_email: "camila@email.com",
    estrato: 3,
    created_date: daysAgo(3),
  },
  {
    id: "prop-19",
    title: "Apartamento en Country Club",
    description: "Apartamento en Country Club, zona residencial de alta demanda. Vista despejada y buena ventilación.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "usado",
    city: "Bogotá",
    monthly_rent: 3500000,
    deposit: 3500000,
    admin_fee: 340000,
    neighborhood: "Country Club",
    locality: "Chapinero",
    address: "Carrera 15 # 84-10",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 105,
    floor: 12,
    parking: true,
    parking_spots: 1,
    furnished: "sin_amoblar",
    pets_allowed: true,
    amenities: ["Ascensor", "Gimnasio", "Seguridad 24h", "Zona verde"],
    images: gallery("prop-19", "apartamento"),
    available_from: "2026-08-15",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Jorge Herrera",
    contact_phone: "+573006667788",
    contact_email: "jorge@email.com",
    estrato: 5,
    created_date: daysAgo(10),
  },
  {
    id: "prop-20",
    title: "Apartamento en Park Way",
    description: "Apartamento en Park Way, barrio tradicional con amplias zonas verdes y ambiente familiar.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "usado",
    city: "Bogotá",
    monthly_rent: 3100000,
    deposit: 3100000,
    admin_fee: 310000,
    neighborhood: "Park Way",
    locality: "Teusaquillo",
    address: "Carrera 24 # 39B-50",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 90,
    floor: 3,
    parking: true,
    parking_spots: 1,
    furnished: "semi_amoblado",
    pets_allowed: false,
    amenities: ["Ascensor", "Portería", "Zona verde"],
    images: gallery("prop-20", "apartamento"),
    available_from: "2026-07-12",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Paola Nieto",
    contact_phone: "+573007778899",
    contact_email: "paola@email.com",
    estrato: 5,
    created_date: daysAgo(14),
  },
  {
    id: "prop-21",
    title: "Apartamento en Niza",
    description: "Apartamento en Niza, cerca a la calle 127 y centros comerciales. Excelente para familias.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "nuevo",
    city: "Bogotá",
    monthly_rent: 2700000,
    deposit: 2700000,
    admin_fee: 295000,
    neighborhood: "Niza",
    locality: "Suba",
    address: "Calle 127 # 19-45",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 96,
    floor: 8,
    parking: true,
    parking_spots: 2,
    furnished: "sin_amoblar",
    pets_allowed: true,
    amenities: ["Ascensor", "Piscina", "Seguridad 24h", "Salón comunal"],
    images: gallery("prop-21", "apartamento"),
    available_from: "2026-07-25",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Mauricio Gil",
    contact_phone: "+573008889900",
    contact_email: "mauricio@email.com",
    estrato: 4,
    created_date: daysAgo(6),
  },
  {
    id: "prop-22",
    title: "Apartamento en Buenavista, Barranquilla",
    description: "Apartamento en Buenavista con buena ventilación cruzada. Zona residencial consolidada.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "reformado",
    city: "Barranquilla",
    monthly_rent: 2300000,
    deposit: 2300000,
    admin_fee: 250000,
    neighborhood: "Buenavista",
    locality: "Riomar",
    address: "Calle 80 # 46-30",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 86,
    floor: 5,
    parking: true,
    parking_spots: 1,
    furnished: "semi_amoblado",
    pets_allowed: false,
    amenities: ["Ascensor", "Seguridad 24h", "Zona verde"],
    images: gallery("prop-22", "apartamento"),
    available_from: "2026-07-08",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Natalia Arrieta",
    contact_phone: "+573009990011",
    contact_email: "natalia@email.com",
    estrato: 4,
    created_date: daysAgo(5),
  },
  {
    id: "prop-23",
    title: "Apartamento en Alto Prado, Barranquilla",
    description: "Apartamento en Alto Prado, uno de los sectores más exclusivos de Barranquilla. Acabados de lujo.",
    property_type: "apartamento",
    listing_type: "arriendo",
    building_age: "nuevo",
    city: "Barranquilla",
    monthly_rent: 3200000,
    deposit: 3200000,
    admin_fee: 300000,
    neighborhood: "Alto Prado",
    locality: "Norte Centro Histórico",
    address: "Calle 79 # 50-12",
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 115,
    floor: 10,
    parking: true,
    parking_spots: 2,
    furnished: "amoblado",
    pets_allowed: true,
    amenities: ["Ascensor", "Gimnasio", "Piscina", "Seguridad 24h"],
    images: gallery("prop-23", "apartamento"),
    available_from: "2026-08-01",
    min_contract_months: 12,
    status: "disponible",
    contact_name: "Roberto Cotes",
    contact_phone: "+573010101212",
    contact_email: "roberto@email.com",
    estrato: 5,
    created_date: daysAgo(2),
  },

];

