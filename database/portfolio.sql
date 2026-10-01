CREATE DATABASE IF NOT EXISTS portfolio_francisco
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_francisco;

CREATE TABLE IF NOT EXISTS portfolio_profile (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  profesion VARCHAR(160) NOT NULL,
  edad VARCHAR(80) NOT NULL,
  educacion VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  email_contacto VARCHAR(254) NOT NULL,
  CONSTRAINT chk_portfolio_profile_singleton CHECK (id = 1)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS portfolio_items (
  section_key ENUM('habilidades', 'logros', 'experiencia', 'proyectos') NOT NULL,
  item_id VARCHAR(80) NOT NULL,
  item_data JSON NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (section_key, item_id),
  KEY idx_portfolio_items_order (section_key, sort_order)
) ENGINE=InnoDB;

INSERT INTO portfolio_profile (id, nombre, profesion, edad, educacion, descripcion, email_contacto)
VALUES (
  1,
  'Villamayor Francisco',
  'Desarrollador Front-end',
  '18 años',
  'Estudiante de la Escuela Técnica N° 5',
  'Creación de interfaces limpias, modernas y funcionales.',
  'franciscoxx458@gmail.com'
)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  profesion = VALUES(profesion),
  edad = VALUES(edad),
  educacion = VALUES(educacion),
  descripcion = VALUES(descripcion),
  email_contacto = VALUES(email_contacto);

INSERT INTO portfolio_items (section_key, item_id, item_data, sort_order) VALUES
('habilidades', 'hab-html5', JSON_OBJECT('nombre', 'HTML5'), 0),
('habilidades', 'hab-css3', JSON_OBJECT('nombre', 'CSS3'), 1),
('habilidades', 'hab-javascript', JSON_OBJECT('nombre', 'JavaScript'), 2),
('habilidades', 'hab-typescript', JSON_OBJECT('nombre', 'TypeScript'), 3),
('habilidades', 'hab-react', JSON_OBJECT('nombre', 'React'), 4),
('habilidades', 'hab-bootstrap', JSON_OBJECT('nombre', 'Bootstrap'), 5),
('habilidades', 'hab-vite', JSON_OBJECT('nombre', 'Vite'), 6),
('habilidades', 'hab-nodejs', JSON_OBJECT('nombre', 'Node.js'), 7),
('habilidades', 'hab-express', JSON_OBJECT('nombre', 'Express'), 8),
('habilidades', 'hab-mysql', JSON_OBJECT('nombre', 'MySQL'), 9),
('habilidades', 'hab-word', JSON_OBJECT('nombre', 'Word'), 10),
('habilidades', 'hab-excel', JSON_OBJECT('nombre', 'Excel'), 11),
('habilidades', 'hab-powerpoint', JSON_OBJECT('nombre', 'PowerPoint'), 12),
('habilidades', 'hab-excel-avanzado', JSON_OBJECT('nombre', 'Excel avanzado'), 13),
('habilidades', 'hab-google-workspace', JSON_OBJECT('nombre', 'Google Workspace'), 14),
('logros', 'logro-pesquera', JSON_OBJECT(
  'titulo', 'Sitio web - Empresa Pesquera',
  'descripcion', 'Desarrollo y publicación de un sitio web profesional para una empresa pesquera de Mar del Plata, incluyendo diseño responsive y optimización.',
  'fecha', 'Publicado'
), 0),
('logros', 'logro-hosting', JSON_OBJECT(
  'titulo', 'Gestión de Dominio y Hosting',
  'descripcion', 'Administración y publicación de sitios web mediante la plataforma Hostinger: dominio, hosting, DNS y despliegues en producción.',
  'fecha', 'Hostinger'
), 1),
('experiencia', 'experiencia-malharro', JSON_OBJECT(
  'titulo', 'Pasantía - Desarrollo Web',
  'lugar', 'Escuela Malharro',
  'duracion', 'Pasantía escolar',
  'descripcion', 'Participación en el desarrollo y mantenimiento de la página web institucional de la escuela, aplicando buenas prácticas de Front-end y accesibilidad.'
), 0),
('proyectos', 'proyecto-pesquera', JSON_OBJECT(
  'icono', 'Sitio Productivo',
  'simbolo', '⚓',
  'titulo', 'Sitio Web - Empresa Pesquera',
  'descripcion', 'Plataforma web para empresa pesquera de Mar del Plata, con catálogo, servicios, historia y formulario de contacto. Diseño moderno y optimización SEO.',
  'tags', JSON_ARRAY('Bootstrap', 'Hostinger', 'Producción'),
  'enlace', ''
), 0),
('proyectos', 'proyecto-malharro', JSON_OBJECT(
  'icono', 'Sitio Institucional',
  'simbolo', '⌂',
  'titulo', 'Página Web - Escuela Malharro',
  'descripcion', 'Sitio institucional de la escuela, desarrollado durante mi pasantía. Incluye novedades, información académica, contacto y galería.',
  'tags', JSON_ARRAY('HTML5', 'CSS3', 'JS', 'Pasantía'),
  'enlace', ''
), 1)
ON DUPLICATE KEY UPDATE
  item_data = VALUES(item_data),
  sort_order = VALUES(sort_order);
