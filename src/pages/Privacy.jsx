import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";

const LAST_UPDATED = "23 de junio de 2025";

const sections = [
  {
    title: "1. Responsable del tratamiento",
    body: `${BRAND.name} (“nosotros”) opera la plataforma de arriendos verificados en Bogotá disponible en ${BRAND.url}. Para consultas sobre privacidad puedes escribir a ${BRAND.email}.`,
  },
  {
    title: "2. Datos que recopilamos",
    body: `Podemos tratar: (a) datos de cuenta (nombre, correo, teléfono, usuario); (b) preferencias de búsqueda y resultados del Match inteligente; (c) inmuebles guardados en favoritos; (d) solicitudes de visita, mensajes y formularios de publicación; (e) datos técnicos (dirección IP, navegador, páginas visitadas) para seguridad y mejora del servicio.`,
  },
  {
    title: "3. Finalidad y base legal",
    body: "Usamos tus datos para prestarte el servicio, coordinar visitas, gestionar publicaciones, responder consultas, mejorar la plataforma y cumplir obligaciones legales. La base legal incluye la ejecución del contrato, tu consentimiento cuando corresponda e interés legítimo en seguridad y analítica básica.",
  },
  {
    title: "4. Cookies y almacenamiento local",
    body: "Utilizamos almacenamiento local del navegador para mantener tu sesión, preferencias de búsqueda y configuración de la aplicación. No usamos cookies de publicidad de terceros. Puedes borrar datos locales desde la configuración del navegador.",
  },
  {
    title: "5. Encargados y terceros",
    body: "Compartimos datos solo cuando es necesario con proveedores de infraestructura (alojamiento, base de datos, autenticación), mapas (Google Maps / OpenStreetMap), imágenes de referencia y canales de comunicación como correo o WhatsApp cuando tú inicias el contacto. Exigimos medidas de seguridad adecuadas a estos proveedores.",
  },
  {
    title: "6. Conservación",
    body: "Conservamos los datos mientras mantengas una cuenta activa o sea necesario para el servicio solicitado, y después durante los plazos legales aplicables en Colombia.",
  },
  {
    title: "7. Tus derechos",
    body: `Puedes solicitar acceso, rectificación, actualización o eliminación de tus datos, así como oponerte a ciertos tratamientos, escribiendo a ${BRAND.email}. También puedes presentar reclamación ante la autoridad de protección de datos de tu país si consideras que no hemos atendido tu solicitud.`,
  },
  {
    title: "8. Seguridad",
    body: "Aplicamos medidas técnicas y organizativas razonables (cifrado en tránsito, controles de acceso, revisión de proveedores) para proteger tu información. Ningún sistema es 100 % infalible; te recomendamos usar contraseñas seguras y no compartir tus credenciales.",
  },
  {
    title: "9. Menores de edad",
    body: "El servicio está dirigido a mayores de 18 años. No recopilamos deliberadamente datos de menores.",
  },
  {
    title: "10. Cambios",
    body: "Podemos actualizar esta política. Publicaremos la versión vigente en esta página con la fecha de última actualización.",
  },
];

export default function Privacy() {
  return (
    <div className="bg-background min-h-full">
      <div className="site-container section-pad max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-3">Legal</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Política de privacidad
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            En {BRAND.name} respetamos tu privacidad. Esta política explica qué datos personales tratamos cuando usas
            nuestro sitio y servicios de arriendos verificados en Bogotá.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-bold text-foreground mb-2">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          <Link to="/" className="font-semibold text-brand-violet hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
