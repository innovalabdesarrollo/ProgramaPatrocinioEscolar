# Checklist de integración — Mapa de Cobertura / Patrocinio Escolar

Marca con `[x]` conforme se termine cada ítem.  
Stack fijado: **SvelteKit + Node/Express + MongoDB Atlas + Tailwind** · sin Google · sin correo.

---

## 1. Infraestructura y base

- [x] Monorepo pnpm (`apps/web` + `apps/api`)
- [x] Conexión MongoDB Atlas (DB `mapa_cobertura_patrocinio_escolar` en la URI)
- [x] `.env` / `.env.example` con `MONGODB_URI`, `PORT`, `WEB_PORT`, `PUBLIC_API_URL`
- [x] Puertos exclusivos de esta app (API **3061**, Web **5210**) sin matar otros procesos
- [x] Seed de usuarios y datos demo
- [x] Node ≥ 24.22.1 y deps parcheadas (oct–nov 2026)

---

## 2. MVP — Primera versión (spec §4)

### 2.1 Catálogo de instituciones

- [x] Alta / listado / edición básica
- [x] Campos: nombre, tipo, nivel, turno, domicilio, zona, contacto, estatus, geo
- [x] Filtros (búsqueda, estatus, nivel, tipo, zona)
- [x] Validación interna de registros pendientes (`pendiente_revision` → catálogo oficial)
- [x] Detección simple de posibles duplicados (nombre/domicilio/contacto)
- [x] Conservar historial de cambios relevantes del registro

### 2.2 Solicitudes y lista de espera

- [x] Registrar solicitud de visita
- [x] Estados: recibida → revisión → pendiente contacto → lista espera → programada → confirmada → realizada / cancelada
- [x] Lista de espera con prioridad
- [x] Ordenar / priorizar por tiempo de espera y reglas de negocio
- [x] Flujo “complementar información solicitada” desde el lado institución

### 2.3 Reservaciones y visitas

- [x] Programar visita (fecha, horario, actividad, modalidad, asistentes)
- [x] Confirmar / cancelar
- [x] Registrar resultado (asistentes reales)
- [x] Clasificar modalidad pagada vs patrocinada
- [x] Reprogramar con nueva fecha manteniendo trazabilidad
- [x] Consulta de disponibilidad / cupos por día (calendario simple)

### 2.4 Historial por institución

- [x] Visitas, solicitudes y apoyos en ficha de institución
- [x] Registro de comunicaciones institucionales
- [x] Observaciones administrativas en la ficha
- [x] Línea de tiempo unificada (todo el historial en un solo feed)

### 2.5 Visitas pagadas y patrocinadas

- [x] Campo modalidad en visita
- [x] Vincular visita patrocinada a campaña y patrocinador
- [x] Relacionar apoyo otorgado automáticamente al cerrar visita patrocinada

### 2.6 Patrocinadores, campañas y metas

- [x] Patrocinadores / donantes (CRUD básico)
- [x] Campañas (metas financieras y de atención)
- [x] Programas de apoyo
- [x] Compromisos de patrocinio
- [x] Apoyos otorgados (+ marcar validado)
- [x] Tablero de % cumplimiento por campaña más visual
- [x] Alertas de seguimiento institucional (sin correo: solo en UI)

### 2.7 Mapa básico de cobertura

- [x] Mapa interactivo con instituciones geolocalizadas
- [x] Colores por estatus de atención
- [x] Filtros por estatus y nivel educativo
- [x] Filtros adicionales: zona, turno, tipo, patrocinador, campaña, periodo
- [x] Click en zona / resumen agregado de cobertura territorial

### 2.8 Indicadores y reportes principales

- [x] Tablero: instituciones, beneficiadas, espera, no atendidas, visitas, personas, solicitudes
- [x] Desglose por zona y nivel
- [x] Resultados / metas por campaña
- [x] Export CSV (instituciones y visitas)
- [x] Filtros de periodo aplicados a todos los bloques del tablero
- [x] Export por más dimensiones (estatus, campaña, patrocinador)
- [x] Detalle drill-down de cada indicador (registros que lo sustentan)

### 2.9 Usuarios, roles y permisos

- [x] Login local email/contraseña (sin Google)
- [x] Roles del spec (admin, visitas, relaciones, admin_apoyos, institución, directivo, sistemas)
- [x] Crear / activar / desactivar usuarios
- [x] Guardas básicas por rol en API
- [x] Matriz de permisos por módulo editable en UI
- [x] Pantalla de bitácora consultable en la web (API ya existe)

### 2.10 Formulario externo

- [x] Formulario público de registro de institución
- [x] Envío opcional de solicitud de visita
- [x] Consulta de estado por email / folio
- [x] Actualización de datos de institución existente (sujeta a revisión)
- [x] Solicitud de modificación / cancelación de visita desde el externo

---

## 3. Mejoras post-MVP (del spec, aún en alcance de producto)

Priorizar solo después de cerrar la §2.

- [ ] Catálogos configurables (tipos, niveles, turnos, estados) administrables
- [ ] Parámetros generales de operación
- [ ] Calidad de datos / marcar registros incompletos
- [ ] Validación de beneficiarios de un apoyo
- [ ] Aplicación / entrega de recursos
- [ ] Reportes orientados a patrocinadores/donantes (plantilla)
- [ ] Evolución histórica de indicadores (series por mes)
- [ ] Comparativo metas vs resultados multi-campaña
- [ ] UI móvil afinada (prioridad móvil ya parcial; pulir flujos largos)

---

## 4. Fuera de scope (no integrar en este MVP / este monorepo)

> No marcar como “pendiente de hacer”: quedan explícitamente fuera salvo que el dueño del producto lo pida.

### Restricciones de Innovalab / prompt

- Auth con **Google** (u otros OAuth)
- **Envío de correo** / SMS / push reales
- Features fuera del MVP del spec sin acuerdo previo
- Mezclar otras bases Mongo / otros proyectos Innovalab
- Cambiar el stack fijado (React/PHP/MySQL de la “Hoja de Verdad” del spec **no aplica**)

### Operación / sistemas (épica “Responsable de sistemas”)

- Monitoreo de disponibilidad de servicios / SRE
- Gestión de incidencias técnicas
- Respaldos automáticos y restauración desde la app
- Ventanas de mantenimiento
- Supervisión de eventos de seguridad / sesiones inseguras avanzadas
- Auditoría forense completa

### Alcance institucional pesado (fase posterior)

- Migración masiva y depuración de padrones históricos
- Capacitación / manuales de usuario
- App móvil nativa
- Integraciones externas (ERP, CRM, contabilidad, pasarelas de pago)
- Firmas digitales / expedientes legales de patrocinio

---

## 5. Cómo usar esta checklist

1. Trabajar un bloque de la **§2** a la vez.
2. Marcar `[x]` solo cuando esté usable en web + API + Atlas.
3. Lo de **§3** entra solo con OK explícito.
4. Lo de **§4** no se implementa “de paso”.

**Estado actual:** §1 y §2 (MVP) completas.  
**Siguiente foco sugerido:** §3 post-MVP solo con OK explícito (catálogos, parámetros, calidad de datos, reportes a patrocinadores, series históricas, UI móvil).
