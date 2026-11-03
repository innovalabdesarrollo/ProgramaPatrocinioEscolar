# Mapa de Cobertura e Impacto del Programa de Patrocinio Escolar — Especificación MVP

> Exportado desde **Traductor Dev** · 2/11/2026, 6:50:49 p.m.

## Resumen del proyecto

| Campo | Valor |
| --- | --- |
| Estado | draft |
| Presupuesto | $5 |
| Tipo de sistema | — |
| Plazo MVP | — |

### Objetivo

Diseñar e implementar un sistema integral, centralizado, seguro y de fácil uso que permita administrar, visualizar y dar seguimiento a las escuelas, asociaciones e instituciones vinculadas con las visitas educativas del museo y con el Programa de Patrocinio Escolar, concentrando en una sola plataforma la información general, ubicación geográfica, datos de contacto, solicitudes, reservaciones, listas de espera e historial de visitas pagadas y patrocinadas de cada institución.

El sistema deberá facilitar la identificación de las instituciones que ya han sido beneficiadas, la frecuencia con la que han participado, aquellas que se encuentran pendientes de atención y las que todavía no han tenido acceso a los programas del museo. Asimismo, permitirá representar geográficamente esta información mediante mapas interactivos para conocer la cobertura territorial, reconocer zonas con alta, baja o nula atención y promover una distribución más equitativa de los apoyos y oportunidades de participación.

Además, la herramienta permitirá registrar y dar seguimiento a patrocinadores, donantes, campañas, programas, metas de atención y compromisos de beneficiarios, relacionando los recursos y apoyos otorgados con las instituciones y visitas correspondientes. De esta forma, será posible medir el cumplimiento de las metas establecidas, analizar los resultados por periodo, zona geográfica, nivel educativo, tipo de institución y modalidad de visita, así como evaluar el impacto generado por los donativos.

El proyecto también busca mejorar la coordinación entre las áreas de Sistemas, Relaciones Institucionales, Visitas Escolares, Administración y Dirección, proporcionando a cada una acceso a las funciones e información que requiere de acuerdo con sus responsabilidades. Esto permitirá reducir la dispersión, duplicidad y desactualización de los datos, optimizar los procesos de registro y seguimiento, fortalecer la planeación de futuras visitas y estrategias de vinculación, y disponer de información confiable para la toma de decisiones.

Finalmente, el sistema deberá generar indicadores, tableros, mapas y reportes claros, actualizados y exportables que apoyen la evaluación de resultados, la elaboración de informes institucionales y la rendición de cuentas ante donantes y patrocinadores. Asimismo, ofrecerá un mecanismo para que las escuelas e instituciones interesadas puedan registrar o actualizar su información y enviar solicitudes de visita, sujetas a un proceso interno de revisión y validación.

En conjunto, el objetivo principal del proyecto es proporcionar al museo una herramienta tecnológica que fortalezca la gestión de sus programas educativos y de patrocinio escolar, mejore el aprovechamiento de los recursos disponibles, favorezca una atención más ordenada y equitativa, y permita comunicar de manera objetiva y transparente el alcance, la cobertura y el impacto social generado en la comunidad.

### Propuesta de solución

#Descripción de la solución

Se propone diseñar e implementar una plataforma digital centralizada para administrar, consultar, visualizar y dar seguimiento a las escuelas, asociaciones e instituciones relacionadas con las visitas educativas del museo y con el Programa de Patrocinio Escolar.

La solución concentrará en una sola base de datos la información general de cada institución, su ubicación geográfica, datos de contacto, solicitudes, reservaciones, lista de espera, historial de visitas y número de beneficiarios. También permitirá diferenciar las visitas pagadas de las patrocinadas y relacionar estas últimas con el donante, campaña o programa correspondiente.

El sistema sustituirá los registros dispersos y procesos manuales por una fuente de información única, organizada y actualizada. Esto ayudará a reducir duplicidades, mejorar la coordinación entre las áreas involucradas y disponer de datos confiables para la planeación, operación y evaluación de los programas educativos.

## Componentes principales

### Catálogo de instituciones

Se contará con un catálogo único de escuelas, asociaciones e instituciones. Cada registro podrá incluir nombre, tipo de institución, nivel educativo, turno, domicilio, ubicación geográfica, datos de contacto, estatus de atención y fecha de actualización.

El sistema deberá ayudar a identificar posibles registros duplicados y conservar el historial de cambios relevantes.

### Solicitudes y lista de espera

La plataforma permitirá registrar solicitudes de visita y dar seguimiento a su proceso de atención mediante estados como:

- Solicitud recibida.
- En revisión.
- Pendiente de contacto.
- En lista de espera.
- Visita programada.
- Visita confirmada.
- Visita realizada.
- Solicitud cancelada.

Esto permitirá conocer cuántas instituciones están pendientes, cuánto tiempo llevan esperando y cuáles requieren atención prioritaria.

### Reservaciones y visitas

El personal de Visitas Escolares podrá programar, reprogramar, confirmar o cancelar visitas. En cada reservación se registrará la institución, fecha, horario, actividad, modalidad de visita, cantidad estimada de asistentes y observaciones.

Después de la visita se capturará el número real de asistentes y el resultado se incorporará al historial de la institución. De esta manera será posible conocer su frecuencia de participación y los beneficios recibidos.

### Patrocinadores, campañas y metas

Relaciones Institucionales podrá registrar patrocinadores, donantes, campañas, periodos de vigencia y metas de atención. Las visitas patrocinadas se relacionarán con la campaña correspondiente para comparar los compromisos establecidos con los resultados alcanzados.

Este módulo permitirá conocer cuántas instituciones y personas han sido beneficiadas, cuánto falta para cumplir las metas y cómo se distribuyeron los apoyos.

### Mapa de cobertura

La ubicación de las instituciones se mostrará en un mapa interactivo. Mediante colores o símbolos se podrán distinguir las instituciones beneficiadas, las que realizaron visitas pagadas, las que están en lista de espera y aquellas que todavía no han sido atendidas.

El mapa podrá filtrarse por zona, nivel educativo, turno, tipo de institución, modalidad de visita, patrocinador, campaña y periodo. Esto facilitará la identificación de zonas con alta, baja o nula cobertura.

### Indicadores y reportes

El sistema mostrará indicadores como:

- Instituciones registradas y beneficiadas.
- Personas atendidas.
- Visitas pagadas y patrocinadas.
- Instituciones en lista de espera.
- Instituciones todavía no atendidas.
- Frecuencia de visitas.
- Cobertura por zona y nivel educativo.
- Resultados por campaña o patrocinador.
- Porcentaje de cumplimiento de metas.

También se podrán generar y exportar reportes por periodo, institución, zona, nivel educativo, tipo de visita, campaña, patrocinador y estatus de atención.

### Formulario para instituciones

Se habilitará un formulario para que las escuelas e instituciones puedan registrar o actualizar sus datos y enviar solicitudes de visita. La información recibida será revisada por el personal autorizado antes de incorporarse al catálogo oficial, con el fin de prevenir errores, duplicados o cambios no autorizados.

### Usuarios y seguridad

El acceso se organizará mediante perfiles para Sistemas, Relaciones Institucionales, Visitas Escolares, Administración y Dirección. Cada usuario tendrá únicamente los permisos necesarios para consultar, registrar, editar, validar, exportar o administrar información de acuerdo con sus responsabilidades.

Las operaciones relevantes quedarán registradas en una bitácora para proteger la integridad de la información y conocer quién realizó cada modificación.

## Plan para alcanzar el objetivo

### 1. Análisis de requerimientos

Se realizarán sesiones de trabajo con las áreas involucradas para documentar los procesos actuales, identificar problemas y revisar los archivos o registros existentes.

En esta etapa se definirán los datos obligatorios, estados de atención, reglas de operación, roles, permisos, indicadores, reportes y criterios de éxito del proyecto.

### 2. Depuración de información

Se recopilarán y organizarán las fuentes de información disponibles. Los registros serán homologados para corregir diferencias de formato, localizar duplicados, validar domicilios y preparar la ubicación geográfica de las instituciones.

Los datos que no puedan confirmarse serán marcados para revisión, evitando eliminar o completar información sin autorización.

### 3. Diseño y prototipo

Se elaborará un prototipo con las pantallas principales: catálogo de instituciones, solicitudes, lista de espera, reservaciones, historial de visitas, patrocinadores, campañas, mapa, indicadores y reportes.

Los futuros usuarios revisarán el prototipo para validar que los procesos, campos y formas de consulta respondan a sus necesidades.

### 4. Desarrollo de la primera versión

La primera versión incluirá las funciones prioritarias:

1. Catálogo centralizado de instituciones.
2. Solicitudes y lista de espera.
3. Reservaciones y visitas.
4. Historial por institución.
5. Visitas pagadas y patrocinadas.
6. Patrocinadores, campañas y metas.
7. Mapa básico de cobertura.
8. Indicadores y reportes principales.
9. Usuarios, roles y permisos.
10. Formulario externo de contacto.

Las funciones adicionales se incorporarán después de comprobar el funcionamiento de los procesos esenciales.

### 5. Migración y validación

Los registros depurados se cargarán en la plataforma. Cada área validará la información bajo su responsabilidad para comprobar que las instituciones, ubicaciones, visitas, beneficiarios, campañas y resultados sean correctos.

### 6. Pruebas

Se realizarán pruebas con usuarios de las diferentes áreas para evaluar la facilidad de uso, precisión de indicadores, funcionamiento de permisos, generación de reportes, visualización del mapa, rendimiento y protección de los datos.

Las incidencias encontradas se corregirán antes de poner el sistema en operación.

### 7. Capacitación e implementación

Los usuarios recibirán capacitación de acuerdo con su rol, acompañada de manuales breves para las actividades principales. La implementación podrá realizarse gradualmente, comenzando con un grupo reducido y ampliando el acceso después de validar la estabilidad de la plataforma.

### 8. Seguimiento y mejora continua

Después de la implementación se dará seguimiento al uso del sistema, se atenderán incidencias y se revisará periódicamente la calidad de la información.

También podrán incorporarse nuevos indicadores, reportes y funciones de acuerdo con las necesidades que se identifiquen durante la operación.

## Resultados esperados

Con esta solución, el museo contará con información centralizada y actualizada, un historial completo de instituciones y visitas, mayor control de las solicitudes y listas de espera, y una visualización clara de las zonas atendidas y pendientes.

La plataforma permitirá distribuir los apoyos de manera más equitativa, dar seguimiento a las metas comprometidas, mejorar la coordinación entre las áreas y generar reportes confiables para la toma de decisiones y la rendición de cuentas a patrocinadores y donantes.

## Hoja de Verdad

**Frontend:** React

**Backend:** PHP

**Base de datos:** MySQL

**Herramientas:** GitHub

## Actores del sistema (7)

### Administrador de plataforma

Gestiona usuarios, roles, permisos, catálogos, configuración general, calidad de datos y bitácora de operaciones.

### Gestor de visitas escolares

Registra y da seguimiento a solicitudes, listas de espera, reservaciones, reprogramaciones, confirmaciones y resultados de visitas.

### Gestor de relaciones institucionales

Administra instituciones vinculadas, patrocinadores, donantes, campañas, programas, metas y relaciones entre apoyos y visitas.

### Responsable de administración y seguimiento de apoyos

Consulta y valida información relacionada con apoyos, beneficiarios, metas, periodos y resultados necesarios para el control administrativo.

### Representante de institución solicitante

Registra o actualiza los datos de su escuela, asociación o institución y envía solicitudes de visita sujetas a revisión interna.

### Directivo o consultor de resultados

Consulta tableros, mapas, indicadores y reportes sobre cobertura, atención, patrocinio, metas e impacto.

### Responsable de sistemas y soporte técnico

Supervisa la operación técnica, integridad, disponibilidad, seguridad, respaldos y atención de incidencias de la plataforma.

## Historias de usuario (69)

### Administrar usuarios internos

- **Rol:** Administrador de plataforma
- **Prioridad:** Alta
- **Formato:** Como **Administrador de plataforma**, quiero **crear, consultar, editar, activar y desactivar cuentas de usuarios internos** para **pueda controlar quién tiene acceso al sistema y mantener actualizado el padrón de usuarios**.

**Criterios de aceptación:**

- Debe permitir registrar nombre, correo, área, rol y estado de la cuenta; impedir duplicar correos; permitir activar o desactivar usuarios sin eliminar su historial de operaciones; y mostrar la fecha del último acceso.

**Casos de uso vinculados:** Administrar cuentas de usuarios internos

### Configurar roles y permisos

- **Rol:** Administrador de plataforma
- **Prioridad:** Crítica
- **Formato:** Como **Administrador de plataforma**, quiero **asignar roles y permisos por módulo y tipo de operación** para **cada usuario pueda acceder únicamente a las funciones y datos que necesita para sus responsabilidades**.

**Criterios de aceptación:**

- Debe permitir configurar permisos de consulta, creación, edición, validación, exportación y administración; aplicar los permisos inmediatamente; impedir que un usuario sin autorización ejecute operaciones restringidas; y permitir revisar los permisos efectivos de cada usuario.

**Casos de uso vinculados:** Configurar roles y permisos

### Gestionar catálogos del sistema

- **Rol:** Administrador de plataforma
- **Prioridad:** Alta
- **Formato:** Como **Administrador de plataforma**, quiero **administrar los valores de los catálogos utilizados por instituciones, solicitudes, visitas, campañas y reportes** para **la información se capture de forma estandarizada y pueda mantenerse conforme evolucionen las reglas del museo**.

**Criterios de aceptación:**

- Debe permitir crear, editar, activar y desactivar valores de catálogo; evitar eliminar valores que ya estén asociados a registros históricos; conservar el orden de presentación; y registrar quién realizó cada cambio.

**Casos de uso vinculados:** Administrar catálogos del sistema

### Configurar parámetros generales

- **Rol:** Administrador de plataforma
- **Prioridad:** Media
- **Formato:** Como **Administrador de plataforma**, quiero **configurar parámetros generales de operación, como estados, tipos de visita, periodos y reglas de captura** para **el sistema funcione de acuerdo con las políticas vigentes del museo sin requerir cambios técnicos para cada ajuste**.

**Criterios de aceptación:**

- Debe permitir definir parámetros configurables con nombre, valor, descripción, vigencia y estado; validar los formatos permitidos; mostrar una advertencia antes de aplicar cambios que afecten la operación; y conservar la configuración anterior en el historial.

**Casos de uso vinculados:** Configurar parámetros generales de operación

### Revisar y resolver duplicados de instituciones

- **Rol:** Administrador de plataforma
- **Prioridad:** Alta
- **Formato:** Como **Administrador de plataforma**, quiero **identificar posibles registros duplicados de instituciones y gestionar su consolidación o descarte** para **el catálogo mantenga información confiable sin perder el historial de solicitudes, visitas y apoyos relacionados**.

**Criterios de aceptación:**

- Debe detectar coincidencias por nombre, domicilio, datos de contacto u otros identificadores; mostrar los registros comparados y sus relaciones; permitir marcar un caso como duplicado, descartarlo o enviarlo a revisión; y conservar la trazabilidad de la decisión.

**Casos de uso vinculados:** Resolver duplicados de instituciones

### Validar calidad de datos

- **Rol:** Administrador de plataforma
- **Prioridad:** Alta
- **Formato:** Como **Administrador de plataforma**, quiero **consultar alertas de datos incompletos, inconsistentes, inválidos o desactualizados** para **pueda corregir oportunamente la información que afecta mapas, indicadores, reportes y procesos operativos**.

**Criterios de aceptación:**

- Debe identificar campos obligatorios vacíos, formatos inválidos, ubicaciones incompletas, valores fuera de catálogo y registros sin actualización; permitir filtrar y asignar incidencias para su corrección; mostrar el estado de cada incidencia; y generar un resumen de calidad de datos.

**Casos de uso vinculados:** Validar calidad de datos

### Consultar la bitácora de operaciones

- **Rol:** Administrador de plataforma
- **Prioridad:** Crítica
- **Formato:** Como **Administrador de plataforma**, quiero **consultar la bitácora de accesos y operaciones relevantes realizadas en el sistema** para **pueda auditar cambios, investigar incidencias y demostrar la trazabilidad de la información**.

**Criterios de aceptación:**

- Debe registrar usuario, fecha y hora, operación, módulo, registro afectado, resultado y, cuando aplique, valores anteriores y nuevos; permitir filtrar y buscar eventos; restringir la modificación o eliminación de la bitácora; y permitir exportar los resultados autorizados.

**Casos de uso vinculados:** Consultar bitácora de operaciones

### Gestionar sesiones y accesos inseguros

- **Rol:** Administrador de plataforma
- **Prioridad:** Alta
- **Formato:** Como **Administrador de plataforma**, quiero **consultar y revocar sesiones activas o accesos sospechosos de los usuarios** para **pueda responder ante pérdida de credenciales o actividad no autorizada**.

**Criterios de aceptación:**

- Debe mostrar usuario, fecha de inicio, última actividad, dispositivo o navegador y ubicación disponible; permitir cerrar sesiones seleccionadas o todas las sesiones de una cuenta; registrar la revocación en la bitácora; y solicitar autenticación nuevamente en el siguiente acceso.

**Casos de uso vinculados:** Gestionar sesiones y accesos inseguros

### Administrar avisos y estados de disponibilidad

- **Rol:** Administrador de plataforma
- **Prioridad:** Media
- **Formato:** Como **Administrador de plataforma**, quiero **configurar avisos operativos y activar o desactivar temporalmente funciones del sistema** para **pueda comunicar mantenimientos o controlar la disponibilidad de módulos sin afectar la integridad de los datos**.

**Criterios de aceptación:**

- Debe permitir definir el mensaje, alcance, fecha de inicio y fecha de finalización del aviso; mostrarlo a los usuarios afectados; permitir habilitar o deshabilitar funciones de forma controlada; impedir operaciones incompatibles durante una suspensión; y registrar cada cambio.

**Casos de uso vinculados:** Administrar avisos y disponibilidad de funciones

### Consultar el estado operativo de la plataforma

- **Rol:** Administrador de plataforma
- **Prioridad:** Media
- **Formato:** Como **Administrador de plataforma**, quiero **visualizar un resumen del estado de usuarios, permisos, catálogos, calidad de datos y actividad reciente** para **pueda detectar problemas administrativos y priorizar acciones de mantenimiento**.

**Criterios de aceptación:**

- Debe mostrar usuarios activos e inactivos, incidencias de calidad pendientes, cambios recientes de configuración, eventos relevantes de bitácora y alertas de operación; permitir acceder al detalle de cada indicador; y actualizar la información con una marca de fecha y hora.

**Casos de uso vinculados:** Consultar estado operativo de la plataforma

### Registrar solicitudes de visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de visitas escolares**, quiero **registrar solicitudes de visita con la institución, datos de contacto, número estimado de asistentes, preferencias de fecha, actividad y modalidad** para **pueda iniciar y organizar oportunamente el proceso de atención**.

**Criterios de aceptación:**

- El sistema permite capturar los datos obligatorios, valida la información requerida, asigna un folio único y registra la fecha de recepción de la solicitud.

**Casos de uso vinculados:** Registrar solicitudes de visita

### Consultar y actualizar el estado de solicitudes

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de visitas escolares**, quiero **consultar y actualizar el estado de cada solicitud durante su proceso de atención** para **pueda conocer cuáles requieren seguimiento y mantener información operativa actualizada**.

**Criterios de aceptación:**

- La solicitud puede cambiar entre los estados configurados; cada cambio registra fecha, usuario y observaciones, y el historial queda disponible para consulta.

**Casos de uso vinculados:** Dar seguimiento a solicitudes

### Gestionar la lista de espera

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **incorporar solicitudes a la lista de espera y ordenarlas según criterios de prioridad y fecha de recepción** para **pueda atender los espacios disponibles de forma organizada y transparente**.

**Criterios de aceptación:**

- El sistema muestra las solicitudes en espera con su tiempo acumulado, prioridad, institución y número de asistentes; permite actualizar la prioridad y registrar el motivo.

**Casos de uso vinculados:** Gestionar lista de espera

### Consultar disponibilidad para programar visitas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de visitas escolares**, quiero **consultar los horarios, fechas y actividades disponibles antes de asignar una visita** para **pueda evitar conflictos de agenda y ofrecer alternativas viables a las instituciones**.

**Criterios de aceptación:**

- La agenda muestra la disponibilidad por fecha, horario y actividad, identifica los espacios ocupados y evita seleccionar horarios incompatibles.

**Casos de uso vinculados:** Consultar disponibilidad de visitas

### Programar reservaciones de visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de visitas escolares**, quiero **crear una reservación vinculada a una solicitud y a una institución** para **pueda formalizar la fecha, horario y condiciones operativas de la visita**.

**Criterios de aceptación:**

- La reservación registra institución, solicitud, fecha, horario, actividad, modalidad, asistentes estimados y observaciones; al guardarse, la solicitud cambia a visita programada.

**Casos de uso vinculados:** Programar reservaciones de visita

### Reprogramar visitas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **reprogramar una visita existente conservando la fecha, motivo y usuario del cambio** para **pueda resolver modificaciones operativas sin perder la trazabilidad de la reservación**.

**Criterios de aceptación:**

- El sistema permite seleccionar una nueva fecha y horario disponibles, exige registrar el motivo y conserva el historial de la programación anterior.

**Casos de uso vinculados:** Reprogramar visitas

### Confirmar o cancelar reservaciones

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **confirmar la asistencia de una institución o cancelar una reservación indicando el motivo** para **pueda mantener actualizada la agenda y liberar oportunamente los espacios no utilizados**.

**Criterios de aceptación:**

- La reservación puede pasar a confirmada o cancelada; la cancelación requiere motivo, registra fecha y usuario, y libera el horario para futuras asignaciones.

**Casos de uso vinculados:** Confirmar o cancelar reservaciones

### Registrar resultados de visitas realizadas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de visitas escolares**, quiero **capturar el resultado de cada visita realizada, incluyendo asistentes reales, actividad, observaciones e incidencias** para **pueda completar el historial de atención y reportar los beneficios otorgados**.

**Criterios de aceptación:**

- Solo las visitas confirmadas pueden cerrarse como realizadas; el sistema solicita asistentes reales y permite registrar observaciones e incidencias antes de completar el cierre.

**Casos de uso vinculados:** Registrar resultados de visitas

### Clasificar la modalidad de la visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **identificar si una visita es pagada o patrocinada y registrar la información disponible del apoyo relacionado** para **pueda distinguir correctamente las visitas para el seguimiento operativo y los reportes institucionales**.

**Criterios de aceptación:**

- La reservación permite seleccionar visita pagada o patrocinada; las visitas patrocinadas requieren asociar la campaña o programa disponible y la clasificación se conserva en el historial.

**Casos de uso vinculados:** Clasificar modalidad de visita

### Consultar el historial de una institución

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **consultar en una sola vista las solicitudes, reservaciones, cancelaciones y visitas realizadas de una institución** para **pueda conocer sus antecedentes antes de programar nuevas actividades y dar seguimiento adecuado**.

**Criterios de aceptación:**

- La vista de la institución muestra los registros ordenados por fecha, estado, modalidad y número de asistentes, incluyendo motivos de cancelación y observaciones relevantes.

**Casos de uso vinculados:** Consultar historial de institución

### Dar seguimiento a solicitudes pendientes

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Alta
- **Formato:** Como **Gestor de visitas escolares**, quiero **visualizar una bandeja de solicitudes pendientes con filtros y alertas de espera** para **pueda priorizar contactos y evitar que las solicitudes permanezcan sin atención**.

**Criterios de aceptación:**

- La bandeja permite filtrar por estado, fecha de recepción, zona, nivel educativo y prioridad, y resalta las solicitudes que superan el tiempo de atención definido.

**Casos de uso vinculados:** Dar seguimiento a solicitudes

### Registrar comunicaciones con la institución

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media
- **Formato:** Como **Gestor de visitas escolares**, quiero **documentar llamadas, correos y acuerdos relacionados con cada solicitud o reservación** para **pueda mantener la continuidad del seguimiento y evitar duplicar gestiones**.

**Criterios de aceptación:**

- Cada comunicación registra fecha, tipo, usuario, contacto, resultado y próximos pasos, y queda visible en el historial de la solicitud o reservación.

**Casos de uso vinculados:** Registrar comunicaciones con la institución

### Registrar patrocinadores y donantes

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **registrar y actualizar la información de patrocinadores y donantes** para **pueda mantener un catálogo confiable de las entidades que apoyan los programas del museo**.

**Criterios de aceptación:**

- Debe permitir capturar nombre o razón social, tipo de entidad, datos de contacto, responsable, estatus y observaciones. No debe permitir duplicados evidentes y debe conservar la fecha de actualización.

**Casos de uso vinculados:** Gestionar patrocinadores y donantes

### Gestionar campañas de patrocinio

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **crear, editar, activar y cerrar campañas de patrocinio** para **pueda organizar los apoyos por periodo, objetivo y patrocinador responsable**.

**Criterios de aceptación:**

- Cada campaña debe incluir nombre, descripción, periodo de vigencia, patrocinador o donante relacionado, presupuesto o recurso comprometido, objetivo de atención y estatus. El sistema debe impedir asociar visitas a campañas cerradas salvo con autorización.

**Casos de uso vinculados:** Configurar campañas y programas de apoyo

### Definir programas y modalidades de apoyo

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **configurar los programas educativos y las modalidades de apoyo disponibles** para **pueda clasificar correctamente las visitas y los beneficios otorgados a las instituciones**.

**Criterios de aceptación:**

- Debe permitir registrar nombre, descripción, población objetivo, criterios de elegibilidad, modalidad de apoyo y periodo de vigencia. Los programas activos deben estar disponibles para relacionarlos con campañas y visitas.

**Casos de uso vinculados:** Configurar campañas y programas de apoyo

### Registrar compromisos de patrocinio

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **documentar los compromisos acordados con cada patrocinador o donante** para **pueda dar seguimiento a los recursos, instituciones y personas beneficiarias comprometidas**.

**Criterios de aceptación:**

- Debe permitir registrar fecha del acuerdo, patrocinador, campaña, programa, meta de instituciones, meta de personas, recursos comprometidos, fecha límite y observaciones. Los compromisos deben conservar su historial de modificaciones.

**Casos de uso vinculados:** Registrar compromisos de patrocinio

### Relacionar apoyos con instituciones y visitas

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **vincular cada apoyo, campaña o donativo con las instituciones y visitas beneficiadas** para **pueda demostrar cómo se aplicaron los recursos y quiénes recibieron el beneficio**.

**Criterios de aceptación:**

- Debe permitir asociar uno o varios apoyos con instituciones, solicitudes y visitas patrocinadas. La relación debe mostrar el patrocinador, campaña, programa, fecha, número de asistentes y monto o tipo de apoyo aplicado.

**Casos de uso vinculados:** Relacionar apoyos con instituciones y visitas

### Validar instituciones beneficiarias de un apoyo

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **revisar y validar que las instituciones propuestas cumplan los criterios de una campaña o programa** para **pueda asegurar que los apoyos se asignen conforme a los acuerdos establecidos**.

**Criterios de aceptación:**

- Debe permitir consultar los criterios de elegibilidad, marcar una institución como aprobada, rechazada o pendiente, registrar el motivo y dejar evidencia de la persona y fecha de validación.

**Casos de uso vinculados:** Validar instituciones beneficiarias

### Dar seguimiento al cumplimiento de metas

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Crítica
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **consultar el avance de las metas de cada campaña, programa y patrocinador** para **pueda identificar oportunamente los compromisos cumplidos, pendientes o en riesgo**.

**Criterios de aceptación:**

- El sistema debe mostrar metas comprometidas, resultados acumulados, porcentaje de avance, saldo pendiente y fecha límite. Debe permitir filtrar por campaña, patrocinador, programa y periodo, y señalar metas vencidas o próximas a vencer.

**Casos de uso vinculados:** Dar seguimiento a metas de patrocinio

### Registrar entregas y aplicaciones de recursos

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **registrar la entrega o aplicación de recursos y beneficios asociados a las visitas** para **pueda mantener trazabilidad sobre el uso de los apoyos otorgados**.

**Criterios de aceptación:**

- Debe permitir registrar tipo de recurso o beneficio, fecha, cantidad o monto, campaña, patrocinador, institución y visita relacionada. Los registros deben quedar vinculados al compromiso correspondiente y no permitir montos aplicados superiores al saldo disponible sin autorización.

**Casos de uso vinculados:** Registrar aplicación de recursos y beneficios

### Consultar historial de relación institucional

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **consultar el historial de acuerdos, apoyos, campañas y visitas de cada patrocinador o donante** para **pueda preparar seguimientos y fortalecer la relación con las entidades colaboradoras**.

**Criterios de aceptación:**

- La ficha del patrocinador debe mostrar contactos, campañas, compromisos, recursos aportados, instituciones beneficiadas, visitas patrocinadas y resultados acumulados, ordenados cronológicamente.

**Casos de uso vinculados:** Consultar historial de relación institucional

### Generar reportes para patrocinadores y donantes

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Alta
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **generar reportes de resultados por patrocinador, campaña y programa** para **pueda compartir información objetiva sobre la cobertura y el impacto de los apoyos**.

**Criterios de aceptación:**

- Debe permitir seleccionar periodo, patrocinador, campaña, programa, zona e institución, mostrar instituciones y personas beneficiadas, visitas realizadas, recursos aplicados y cumplimiento de metas, y exportar el resultado en un formato utilizable.

**Casos de uso vinculados:** Generar reportes de patrocinio

### Gestionar alertas de seguimiento institucional

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media
- **Formato:** Como **Gestor de relaciones institucionales**, quiero **recibir alertas sobre compromisos próximos a vencer, campañas sin avance y datos pendientes de validación** para **pueda realizar acciones de seguimiento antes de que se afecte el cumplimiento de los acuerdos**.

**Criterios de aceptación:**

- El sistema debe generar alertas configurables para fechas límite próximas, metas con bajo avance, campañas inactivas con recursos pendientes y registros incompletos. Cada alerta debe indicar el asunto, responsable, fecha y estado de atención.

**Casos de uso vinculados:** Gestionar alertas de seguimiento institucional

### Consultar apoyos otorgados

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **consultar el detalle de los apoyos otorgados a cada institución y visita** para **pueda verificar su correcta asignación y elaborar el control administrativo**.

**Criterios de aceptación:**

- Permite consultar institución beneficiaria, visita relacionada, campaña o patrocinador, tipo de apoyo, periodo, cantidad de beneficiarios y estatus, con filtros por fecha, institución, zona y programa.

**Casos de uso vinculados:** Consultar apoyos otorgados

### Validar información de beneficiarios

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **validar los datos de las instituciones, visitas y personas beneficiarias asociados a un apoyo** para **pueda asegurar que los registros utilizados para el seguimiento administrativo sean confiables**.

**Criterios de aceptación:**

- La información puede marcarse como validada, pendiente de revisión u observada; las observaciones quedan registradas y se conserva la fecha y usuario de la validación.

**Casos de uso vinculados:** Validar información de beneficiarios

### Dar seguimiento al cumplimiento de metas

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **consultar el avance de las metas de atención y apoyo por campaña, patrocinador y periodo** para **pueda identificar oportunamente los compromisos cumplidos, pendientes o excedidos**.

**Criterios de aceptación:**

- Muestra meta establecida, resultado acumulado, porcentaje de avance, diferencia pendiente y estatus de cumplimiento, con filtros por campaña, patrocinador y periodo.

**Casos de uso vinculados:** Dar seguimiento al cumplimiento de metas

### Consultar resultados por periodo

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **comparar los apoyos, beneficiarios y visitas registrados en distintos periodos** para **pueda detectar variaciones y preparar revisiones administrativas periódicas**.

**Criterios de aceptación:**

- Permite seleccionar uno o más periodos y presenta totales de instituciones, visitas, beneficiarios, apoyos pagados y patrocinados, así como variaciones entre periodos.

**Casos de uso vinculados:** Comparar resultados por periodo

### Registrar observaciones administrativas

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **registrar observaciones sobre apoyos, beneficiarios, metas o resultados** para **pueda documentar aclaraciones, inconsistencias y acciones de seguimiento**.

**Criterios de aceptación:**

- Las observaciones se vinculan al registro correspondiente, incluyen fecha, usuario y estado de atención, y no eliminan la información histórica.

**Casos de uso vinculados:** Registrar observaciones administrativas

### Identificar inconsistencias en los registros

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **consultar alertas sobre datos incompletos, duplicados o inconsistentes en los apoyos y sus beneficiarios** para **pueda solicitar correcciones antes de utilizar la información en reportes administrativos**.

**Criterios de aceptación:**

- El sistema identifica, al menos, apoyos sin institución o visita relacionada, beneficiarios sin cantidad registrada, metas sin periodo y registros duplicados potenciales; cada alerta puede marcarse como pendiente, revisada o resuelta.

**Casos de uso vinculados:** Identificar inconsistencias en registros

### Consultar el historial administrativo de una institución

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **consultar el historial consolidado de apoyos, visitas, beneficiarios y validaciones de una institución** para **pueda revisar su trayectoria y confirmar que los beneficios recibidos coincidan con los registros del sistema**.

**Criterios de aceptación:**

- El historial presenta los registros ordenados por fecha, distingue visitas pagadas y patrocinadas, muestra campañas o patrocinadores relacionados e indica el estado de validación de cada registro.

**Casos de uso vinculados:** Consultar historial administrativo de una institución

### Generar reporte de seguimiento de apoyos

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Alta
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **generar y exportar reportes de apoyos, beneficiarios, metas y resultados** para **pueda realizar controles administrativos y compartir información validada con las áreas autorizadas**.

**Criterios de aceptación:**

- Permite seleccionar periodo, institución, zona, campaña, patrocinador y estado de validación; el reporte incluye totales y detalle, indica la fecha de generación y puede exportarse en un formato disponible para el sistema.

**Casos de uso vinculados:** Generar reporte de seguimiento de apoyos

### Consultar la trazabilidad de cambios

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media
- **Formato:** Como **Responsable de administración y seguimiento de apoyos**, quiero **consultar la bitácora de modificaciones realizadas sobre los registros administrativos** para **pueda verificar quién cambió la información y cuándo se realizaron los cambios**.

**Criterios de aceptación:**

- La bitácora muestra registro afectado, usuario, fecha y hora, operación realizada y valores relevantes anteriores y posteriores, respetando los permisos del rol.

**Casos de uso vinculados:** Consultar trazabilidad de cambios

### Registrar institución

- **Rol:** Representante de institución solicitante
- **Prioridad:** Alta
- **Formato:** Como **Representante de institución solicitante**, quiero **registrar los datos generales, de contacto, ubicación y características de mi escuela, asociación o institución** para **pueda solicitar servicios del museo con información completa y verificable**.

**Criterios de aceptación:**

- El formulario permite capturar nombre, tipo de institución, nivel educativo, turno, domicilio, ubicación, persona de contacto, teléfono y correo electrónico; valida los campos obligatorios; informa si existen posibles registros coincidentes; y confirma la recepción del registro para revisión interna.

**Casos de uso vinculados:** Registrar institución

### Actualizar datos institucionales

- **Rol:** Representante de institución solicitante
- **Prioridad:** Alta
- **Formato:** Como **Representante de institución solicitante**, quiero **actualizar los datos de mi institución y de la persona de contacto** para **la información utilizada por el museo se mantenga vigente**.

**Criterios de aceptación:**

- El representante puede acceder mediante un mecanismo seguro, consultar los datos registrados, modificar los campos permitidos y enviar los cambios para validación; el sistema muestra la fecha de actualización y el estado de revisión.

**Casos de uso vinculados:** Actualizar datos institucionales

### Enviar solicitud de visita

- **Rol:** Representante de institución solicitante
- **Prioridad:** Crítica
- **Formato:** Como **Representante de institución solicitante**, quiero **enviar una solicitud de visita educativa con la fecha preferida, cantidad estimada de asistentes, nivel educativo, modalidad y actividad de interés** para **el museo pueda evaluar y planificar la atención de mi institución**.

**Criterios de aceptación:**

- La solicitud incluye los datos de la institución, información de contacto, preferencias de visita, cantidad estimada de asistentes y observaciones; el sistema valida la información obligatoria, genera un folio único y muestra una confirmación de envío.

**Casos de uso vinculados:** Enviar solicitud de visita

### Consultar estado de solicitud

- **Rol:** Representante de institución solicitante
- **Prioridad:** Alta
- **Formato:** Como **Representante de institución solicitante**, quiero **consultar el estado y los detalles de mis solicitudes de visita** para **pueda conocer si fueron recibidas, están en revisión, en lista de espera, programadas, confirmadas o canceladas**.

**Criterios de aceptación:**

- El representante puede consultar sus solicitudes mediante un folio o acceso autenticado; cada solicitud muestra estado actual, fecha de envío, datos registrados y, cuando corresponda, observaciones o próximos pasos.

**Casos de uso vinculados:** Consultar estado de solicitud

### Complementar información solicitada

- **Rol:** Representante de institución solicitante
- **Prioridad:** Alta
- **Formato:** Como **Representante de institución solicitante**, quiero **responder solicitudes de aclaración o completar información faltante de una solicitud** para **el personal del museo pueda revisarla sin retrasos innecesarios**.

**Criterios de aceptación:**

- Cuando una solicitud requiera información adicional, el sistema notifica al representante, identifica los datos pendientes, permite corregir o complementar la información y registra la fecha de respuesta sin alterar el historial de la solicitud.

**Casos de uso vinculados:** Complementar información de solicitud

### Consultar confirmación y detalles de visita

- **Rol:** Representante de institución solicitante
- **Prioridad:** Alta
- **Formato:** Como **Representante de institución solicitante**, quiero **consultar los detalles de una visita confirmada o programada** para **pueda coordinar la asistencia de mi institución**.

**Criterios de aceptación:**

- El sistema muestra fecha, horario, actividad, modalidad, cantidad registrada de asistentes, indicaciones relevantes y datos de contacto del museo; la información solo se muestra cuando la solicitud alcanza un estado programado o confirmado.

**Casos de uso vinculados:** Consultar detalles de visita confirmada

### Solicitar modificación o cancelación de visita

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media
- **Formato:** Como **Representante de institución solicitante**, quiero **solicitar la reprogramación o cancelación de una visita** para **pueda informar oportunamente cambios que afecten la operación del museo**.

**Criterios de aceptación:**

- El representante puede seleccionar una visita programada, indicar el motivo y proponer una nueva fecha cuando corresponda; el sistema registra la solicitud, informa que queda sujeta a revisión y conserva el historial de cambios.

**Casos de uso vinculados:** Solicitar modificación o cancelación de visita

### Consultar historial de participación institucional

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media
- **Formato:** Como **Representante de institución solicitante**, quiero **consultar el historial de solicitudes y visitas de mi institución** para **pueda verificar las actividades realizadas, pendientes y los apoyos recibidos**.

**Criterios de aceptación:**

- El historial muestra solicitudes, estados, fechas, modalidades, número de asistentes registrado y si la visita fue pagada o patrocinada, sin exponer información de otras instituciones ni datos sensibles de terceros.

**Casos de uso vinculados:** Consultar historial de participación institucional

### Recibir notificaciones del proceso

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media
- **Formato:** Como **Representante de institución solicitante**, quiero **recibir notificaciones sobre cambios relevantes en mis registros y solicitudes** para **pueda actuar oportunamente ante revisiones, confirmaciones, cambios o requerimientos de información**.

**Criterios de aceptación:**

- El sistema envía notificaciones al correo registrado, o las muestra dentro de la plataforma, cuando se recibe una solicitud, cambia su estado, se requiere información adicional, se confirma o cancela una visita, y registra el momento de envío.

**Casos de uso vinculados:** Recibir notificaciones del proceso

### Consultar tablero ejecutivo de resultados

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **consultar un tablero consolidado con los principales indicadores de cobertura, atención, patrocinio e impacto** para **pueda evaluar rápidamente el desempeño general de los programas y tomar decisiones informadas**.

**Criterios de aceptación:**

- El tablero muestra instituciones registradas, instituciones beneficiadas, personas atendidas, visitas pagadas y patrocinadas, solicitudes pendientes, cumplimiento de metas y fecha de actualización de los datos. Los indicadores se presentan con valores absolutos y porcentajes cuando corresponda.

**Casos de uso vinculados:** Consultar tablero ejecutivo de resultados

### Filtrar indicadores por periodo y dimensiones

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **filtrar los indicadores por periodo, zona geográfica, nivel educativo, tipo de institución, modalidad de visita, patrocinador y campaña** para **pueda analizar los resultados de acuerdo con diferentes criterios de gestión**.

**Criterios de aceptación:**

- Los filtros pueden combinarse, muestran los criterios aplicados y actualizan los indicadores, gráficas y resultados relacionados. El sistema permite limpiar todos los filtros y regresar a la vista general.

**Casos de uso vinculados:** Consultar tablero ejecutivo de resultados

### Analizar la cobertura territorial en el mapa

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **visualizar en un mapa interactivo la distribución geográfica de las instituciones atendidas, pendientes y no atendidas** para **pueda identificar zonas con alta, baja o nula cobertura y orientar decisiones de intervención**.

**Criterios de aceptación:**

- El mapa diferencia visualmente los estados de atención y permite filtrar por periodo, zona, nivel educativo, tipo de institución, modalidad, patrocinador y campaña. Al seleccionar una institución se muestran sus datos resumidos y su historial de atención.

**Casos de uso vinculados:** Analizar cobertura territorial

### Comparar metas y resultados de patrocinio

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **consultar y comparar las metas comprometidas con los resultados alcanzados por campaña y patrocinador** para **pueda verificar el avance de los compromisos y detectar desviaciones oportunamente**.

**Criterios de aceptación:**

- La consulta muestra meta, resultado actual, porcentaje de cumplimiento, diferencia pendiente y periodo de vigencia. La información puede desglosarse por instituciones beneficiadas, personas atendidas y visitas realizadas.

**Casos de uso vinculados:** Comparar metas y resultados de patrocinio

### Consultar evolución histórica de indicadores

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media
- **Formato:** Como **Directivo o consultor de resultados**, quiero **visualizar la evolución de los principales indicadores por periodos** para **pueda identificar tendencias, variaciones y cambios en la cobertura e impacto de los programas**.

**Criterios de aceptación:**

- El sistema presenta series históricas de instituciones atendidas, personas beneficiadas, visitas pagadas y patrocinadas, solicitudes pendientes y cumplimiento de metas. Debe permitir seleccionar el intervalo temporal y comparar al menos dos periodos.

**Casos de uso vinculados:** Consultar tablero ejecutivo de resultados

### Identificar instituciones pendientes de atención

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **consultar un listado de instituciones en espera o sin visitas registradas** para **pueda reconocer brechas de atención y priorizar estrategias de cobertura**.

**Criterios de aceptación:**

- El listado incluye institución, ubicación, tipo, nivel educativo, fecha de solicitud o registro, tiempo de espera, estatus y última actividad. Puede ordenarse por antigüedad, zona y prioridad, y enlaza con el detalle de cada institución.

**Casos de uso vinculados:** Consultar instituciones pendientes de atención

### Consultar impacto por programa y modalidad

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media
- **Formato:** Como **Directivo o consultor de resultados**, quiero **comparar los resultados de los programas y modalidades de visita** para **pueda evaluar cuáles generan mayor cobertura y número de personas beneficiadas**.

**Criterios de aceptación:**

- El sistema permite comparar programas y modalidades mediante instituciones atendidas, visitas realizadas, personas beneficiadas, proporción de visitas patrocinadas y distribución territorial. Los resultados respetan los filtros de periodo y demás dimensiones seleccionadas.

**Casos de uso vinculados:** Consultar tablero ejecutivo de resultados

### Exportar reportes ejecutivos

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Alta
- **Formato:** Como **Directivo o consultor de resultados**, quiero **exportar tableros, indicadores, mapas y resultados filtrados en formatos utilizables** para **pueda preparar informes institucionales, presentaciones y reportes para la toma de decisiones**.

**Criterios de aceptación:**

- El sistema permite exportar los resultados visibles al menos en CSV y PDF, incluyendo periodo, filtros aplicados, fecha de generación y fuente de los datos. La exportación debe conservar los totales y porcentajes mostrados en pantalla.

**Casos de uso vinculados:** Exportar reportes ejecutivos

### Consultar la fecha y calidad de actualización de los datos

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media
- **Formato:** Como **Directivo o consultor de resultados**, quiero **conocer cuándo se actualizaron los datos y si existen registros pendientes de validación** para **pueda valorar la confiabilidad y vigencia de la información antes de utilizarla en análisis o informes**.

**Criterios de aceptación:**

- Los tableros y reportes muestran fecha de última actualización, periodo cubierto y, cuando aplique, cantidad de registros pendientes de validación o con información incompleta. El sistema distingue datos confirmados de datos sujetos a revisión.

**Casos de uso vinculados:** Consultar calidad y detalle de indicadores

### Consultar el detalle de los indicadores

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media
- **Formato:** Como **Directivo o consultor de resultados**, quiero **acceder al detalle de los registros que sustentan cada indicador** para **pueda verificar los resultados agregados y explicar su composición**.

**Criterios de aceptación:**

- Cada indicador permite abrir un listado detallado de las instituciones, visitas o campañas consideradas en su cálculo, respetando los filtros activos y los permisos de consulta del rol.

**Casos de uso vinculados:** Consultar calidad y detalle de indicadores

### Monitorear disponibilidad de la plataforma

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Crítica
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **visualizar el estado de disponibilidad y rendimiento de los servicios principales de la plataforma** para **pueda detectar oportunamente interrupciones o degradaciones del servicio**.

**Criterios de aceptación:**

- El sistema muestra el estado de los servicios, tiempos de respuesta, uso de recursos y fecha de la última actualización; se generan alertas cuando se superan los umbrales configurados; el historial de incidentes de disponibilidad puede consultarse.

**Casos de uso vinculados:** Monitorear disponibilidad de servicios

### Gestionar incidencias técnicas

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Alta
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **registrar, clasificar, asignar, dar seguimiento y cerrar incidencias técnicas reportadas por los usuarios** para **pueda restablecer la operación y documentar la solución aplicada**.

**Criterios de aceptación:**

- Cada incidencia contiene folio, fecha, usuario reportante, descripción, prioridad, estado, responsable, evidencias, acciones realizadas y fecha de cierre; se pueden filtrar incidencias abiertas, vencidas y cerradas; el usuario recibe actualización del estado cuando corresponda.

**Casos de uso vinculados:** Gestionar incidencias técnicas

### Administrar respaldos de la información

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Crítica
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **configurar y verificar respaldos automáticos de la base de datos y de los archivos relevantes** para **pueda proteger la información ante errores, pérdida de datos o fallas de infraestructura**.

**Criterios de aceptación:**

- Se define una periodicidad de respaldo, se registra el resultado de cada ejecución, se conserva la fecha del último respaldo exitoso y se generan alertas ante fallos; los respaldos se almacenan con controles de acceso y retención configurada.

**Casos de uso vinculados:** Administrar respaldos de información

### Restaurar información desde un respaldo

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Crítica
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **ejecutar y validar la restauración de la información desde un respaldo autorizado** para **pueda recuperar la operación después de una pérdida o corrupción de datos**.

**Criterios de aceptación:**

- La restauración requiere autorización y confirmación previa, se registra el respaldo utilizado, fecha, responsable y resultado; el sistema permite validar la integridad de los datos restaurados sin sobrescribir la información productiva de manera accidental.

**Casos de uso vinculados:** Restaurar información respaldada

### Supervisar la integridad de los datos

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Alta
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **ejecutar revisiones técnicas para identificar registros incompletos, inconsistentes, duplicados o relaciones inválidas** para **pueda prevenir errores que afecten los mapas, indicadores, reportes e historiales**.

**Criterios de aceptación:**

- Las revisiones generan un reporte con tipo de anomalía, registro afectado, fecha y severidad; los resultados pueden exportarse o marcarse como atendidos; ninguna corrección automática modifica datos sin autorización.

**Casos de uso vinculados:** Supervisar integridad de datos

### Auditar operaciones críticas del sistema

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Alta
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **consultar una bitácora de accesos y operaciones críticas realizadas en la plataforma** para **pueda investigar incidentes y verificar la trazabilidad de los cambios**.

**Criterios de aceptación:**

- La bitácora registra usuario, fecha y hora, operación, módulo, identificador del registro afectado, resultado y origen de la conexión cuando esté disponible; permite filtrar y exportar eventos; los registros de auditoría no pueden ser modificados por usuarios operativos.

**Casos de uso vinculados:** Auditar operaciones críticas

### Supervisar eventos de seguridad

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Crítica
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **recibir alertas sobre accesos fallidos, actividades inusuales y posibles intentos de acceso no autorizado** para **pueda responder rápidamente ante riesgos de seguridad**.

**Criterios de aceptación:**

- El sistema registra intentos fallidos, bloqueos, cambios de permisos y accesos inusuales; permite configurar umbrales de alerta; cada alerta incluye evento, usuario o cuenta involucrada, fecha, severidad y estado de atención.

**Casos de uso vinculados:** Supervisar eventos de seguridad

### Gestionar ventanas de mantenimiento

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media
- **Formato:** Como **Responsable de sistemas y soporte técnico**, quiero **programar y comunicar mantenimientos técnicos de la plataforma** para **pueda reducir el impacto en la operación de las áreas usuarias**.

**Criterios de aceptación:**

- Se pueden registrar fecha, duración estimada, servicios afectados, motivo y responsable; los usuarios autorizados visualizan avisos de mantenimiento; al concluir, se documenta el resultado y cualquier incidencia derivada.

**Casos de uso vinculados:** Gestionar ventanas de mantenimiento

## Casos de uso (63)

### Administrar cuentas de usuarios internos

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador gestionar el ciclo de vida de las cuentas de usuarios internos para controlar su acceso a la plataforma.

**Pasos:**

1. El administrador consulta el listado de usuarios internos.
2. El sistema muestra las cuentas y sus estados actuales.
3. El administrador crea una cuenta nueva o selecciona una existente para consultar o editar sus datos.
4. El administrador activa o desactiva la cuenta según corresponda.
5. El sistema valida la información y las reglas aplicables.
6. El sistema guarda los cambios y registra la operación en la bitácora.

### Configurar roles y permisos

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador definir los roles y permisos de acceso por módulo y tipo de operación.

**Pasos:**

1. El administrador consulta los roles y permisos configurados.
2. El administrador crea o selecciona un rol.
3. El administrador asigna módulos y tipos de operación permitidos al rol.
4. El sistema valida que la configuración sea consistente.
5. El administrador asigna el rol a uno o más usuarios internos.
6. El sistema guarda la configuración y registra los cambios realizados.

### Administrar catálogos del sistema

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador mantener actualizados los valores de referencia utilizados en los módulos de instituciones, solicitudes, visitas, campañas y reportes.

**Pasos:**

1. El administrador selecciona el catálogo que desea gestionar.
2. El sistema muestra sus valores, estados y datos de configuración.
3. El administrador crea, edita, activa o desactiva un valor del catálogo.
4. El sistema valida que no existan duplicidades ni dependencias incompatibles.
5. El sistema guarda los cambios y actualiza su disponibilidad en los módulos correspondientes.
6. El sistema registra la operación en la bitácora.

### Configurar parámetros generales de operación

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador definir los parámetros, estados, tipos de visita, periodos y reglas que controlan la operación general del sistema.

**Pasos:**

1. El administrador consulta los parámetros generales configurables.
2. El administrador selecciona un parámetro o regla de operación.
3. El administrador establece o modifica su valor, vigencia o condición de aplicación.
4. El sistema valida la compatibilidad de la configuración con los procesos existentes.
5. El sistema guarda la configuración y aplica los parámetros a las operaciones correspondientes.
6. El sistema registra el cambio y su fecha de entrada en vigor.

### Resolver duplicados de instituciones

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador identificar, analizar y resolver posibles registros duplicados de instituciones mediante su consolidación o descarte.

**Pasos:**

1. El administrador consulta las alertas o coincidencias de posibles duplicados.
2. El sistema muestra los registros relacionados y los criterios de coincidencia.
3. El administrador compara la información de las instituciones involucradas.
4. El administrador selecciona la acción de consolidar los registros o descartar la coincidencia.
5. El sistema solicita confirmación y valida las relaciones, solicitudes, visitas e historiales asociados.
6. El sistema ejecuta la resolución, conserva la trazabilidad y registra la operación.

### Validar calidad de datos

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador detectar y dar seguimiento a datos incompletos, inconsistentes, inválidos o desactualizados para mejorar la confiabilidad de la información.

**Pasos:**

1. El administrador solicita la consulta de calidad de datos o selecciona un tipo de validación.
2. El sistema ejecuta las reglas de validación configuradas.
3. El sistema muestra las alertas, registros afectados, causas y nivel de severidad.
4. El administrador filtra, consulta o marca las alertas para seguimiento.
5. El administrador registra una corrección, excepción o solicitud de atención cuando corresponda.
6. El sistema actualiza el estado de la alerta y conserva el historial de validaciones.

### Consultar bitácora de operaciones

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador consultar el historial de accesos y operaciones relevantes para fines de control, auditoría y trazabilidad.

**Pasos:**

1. El administrador solicita la bitácora de operaciones.
2. El sistema muestra los eventos registrados con usuario, fecha, operación, módulo y resultado.
3. El administrador filtra los eventos por periodo, usuario, tipo de operación o módulo.
4. El administrador consulta el detalle de un evento seleccionado.
5. El sistema presenta la información de trazabilidad disponible y, cuando aplique, los valores anteriores y nuevos.

### Gestionar sesiones y accesos inseguros

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador supervisar y revocar sesiones activas o accesos identificados como sospechosos para proteger la plataforma.

**Pasos:**

1. El administrador consulta las sesiones activas y las alertas de acceso sospechoso.
2. El sistema muestra usuario, dispositivo, ubicación disponible, fecha de inicio y nivel de riesgo.
3. El administrador selecciona una sesión o acceso para revisar su detalle.
4. El administrador confirma la revocación de la sesión o el bloqueo del acceso cuando corresponda.
5. El sistema invalida la sesión o aplica la medida de seguridad seleccionada.
6. El sistema notifica el resultado y registra la operación en la bitácora.

### Administrar avisos y disponibilidad de funciones

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador configurar avisos operativos y controlar temporalmente la disponibilidad de funciones del sistema.

**Pasos:**

1. El administrador consulta los avisos y funciones configurables.
2. El administrador crea o edita un aviso indicando mensaje, audiencia, vigencia y prioridad.
3. El administrador activa o desactiva temporalmente una función del sistema e indica la causa o mensaje asociado.
4. El sistema valida la configuración y verifica que el cambio no afecte controles críticos.
5. El sistema publica el aviso o aplica el estado de disponibilidad definido.
6. El sistema registra la configuración y sus fechas de vigencia.

### Consultar estado operativo de la plataforma

- **Rol:** Administrador de plataforma
- **Prioridad:** Media

Permitir al administrador visualizar un resumen consolidado del estado de la plataforma y sus principales componentes operativos.

**Pasos:**

1. El administrador accede al resumen del estado operativo.
2. El sistema recopila el estado de usuarios, permisos, catálogos, calidad de datos y actividad reciente.
3. El sistema presenta indicadores, alertas y tendencias relevantes.
4. El administrador consulta el detalle de un indicador o alerta.
5. El sistema muestra la información de respaldo y las acciones de atención disponibles.

### Registrar solicitudes de visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir registrar una solicitud de visita con la información de la institución, sus datos de contacto, asistentes estimados y preferencias de atención.

**Pasos:**

1. El gestor inicia el registro de una nueva solicitud.
2. El sistema solicita los datos de la institución, contacto, número estimado de asistentes y preferencias de fecha, horario o actividad.
3. El gestor captura y envía la información.
4. El sistema valida los datos obligatorios y verifica posibles duplicados.
5. El sistema crea la solicitud con un identificador, fecha de recepción y estado inicial.
6. El sistema confirma el registro de la solicitud.

### Dar seguimiento a solicitudes

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir consultar, priorizar y actualizar el estado de las solicitudes pendientes durante su proceso de atención.

**Pasos:**

1. El gestor accede a la bandeja de solicitudes.
2. El sistema muestra las solicitudes pendientes con su estado, fecha de recepción y tiempo de espera.
3. El gestor aplica filtros y consulta las alertas de solicitudes próximas a vencer o con atención retrasada.
4. El gestor selecciona una solicitud y actualiza su estado o registra el avance correspondiente.
5. El sistema valida el cambio y conserva el historial de estados, fechas y usuario responsable.
6. El sistema actualiza la bandeja y los indicadores de seguimiento.

### Gestionar lista de espera

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir incorporar solicitudes a la lista de espera y ordenarlas conforme a criterios de prioridad y fecha de recepción.

**Pasos:**

1. El gestor selecciona una solicitud que no puede ser atendida de inmediato.
2. El sistema muestra los datos de la solicitud y los criterios disponibles para su priorización.
3. El gestor incorpora la solicitud a la lista de espera y asigna o confirma su prioridad.
4. El sistema ordena las solicitudes según la prioridad y la fecha de recepción.
5. El sistema registra la incorporación, posición y cambios posteriores en la lista.
6. El gestor consulta la lista actualizada.

### Consultar disponibilidad de visitas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir consultar fechas, horarios, actividades y capacidad disponible para seleccionar una opción viable de programación.

**Pasos:**

1. El gestor selecciona una solicitud y solicita consultar disponibilidad.
2. El sistema muestra las fechas, horarios, actividades y capacidades disponibles según los criterios de la solicitud.
3. El gestor filtra o consulta las opciones disponibles.
4. El sistema indica las restricciones, cupos ocupados o incompatibilidades aplicables.
5. El gestor selecciona una opción disponible para continuar con la programación.

### Programar reservaciones de visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir crear una reservación vinculada con una solicitud y una institución, utilizando una fecha, horario y actividad disponibles.

**Pasos:**

1. El gestor selecciona una solicitud y una opción de disponibilidad.
2. El sistema muestra los datos de la institución, la solicitud y la actividad seleccionada.
3. El gestor confirma la fecha, horario, actividad y participantes estimados.
4. El sistema valida la capacidad y evita conflictos de programación.
5. El sistema crea la reservación vinculada a la solicitud y a la institución.
6. El sistema asigna el estado inicial de la reservación y muestra su identificador.

### Reprogramar visitas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir modificar la fecha, horario o actividad de una visita conservando la trazabilidad del cambio y su motivo.

**Pasos:**

1. El gestor consulta una reservación existente y selecciona la opción de reprogramación.
2. El sistema muestra los datos actuales de la visita y solicita el nuevo horario o actividad.
3. El gestor consulta la disponibilidad y selecciona una nueva opción.
4. El gestor registra el motivo de la reprogramación.
5. El sistema valida la nueva disponibilidad y actualiza la reservación.
6. El sistema conserva la fecha anterior, el motivo, el usuario y la fecha del cambio.

### Confirmar o cancelar reservaciones

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir confirmar la asistencia de una institución o cancelar una reservación registrando el motivo correspondiente.

**Pasos:**

1. El gestor consulta una reservación pendiente de confirmación.
2. El gestor selecciona confirmar asistencia o cancelar reservación.
3. Si cancela, el sistema solicita y valida el motivo de cancelación.
4. El sistema actualiza el estado de la reservación.
5. El sistema registra el usuario, la fecha y el detalle de la confirmación o cancelación.
6. El sistema libera o conserva la disponibilidad según el resultado y notifica la actualización.

### Registrar resultados de visitas

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir capturar los resultados reales de una visita, incluyendo asistentes, actividad, observaciones e incidencias.

**Pasos:**

1. El gestor selecciona una visita realizada.
2. El sistema muestra la reservación y los datos registrados previamente.
3. El gestor captura el número real de asistentes, la actividad realizada, observaciones e incidencias.
4. El sistema valida que la visita tenga una reservación y fecha de realización.
5. El sistema guarda el resultado y lo vincula con la institución y la reservación.
6. El sistema actualiza el historial de visitas de la institución.

### Clasificar modalidad de visita

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir identificar si una visita es pagada o patrocinada y registrar la información disponible del apoyo relacionado.

**Pasos:**

1. El gestor selecciona una reservación o visita.
2. El sistema muestra la información de la visita y las modalidades disponibles.
3. El gestor indica si la visita es pagada o patrocinada.
4. Si es patrocinada, el gestor captura o consulta la información disponible del apoyo relacionado.
5. El sistema valida y guarda la modalidad y los datos del apoyo.
6. El sistema actualiza la información asociada a la visita y a la institución.

### Consultar historial de institución

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir consultar en una sola vista la trayectoria de solicitudes, reservaciones, cancelaciones y visitas realizadas de una institución.

**Pasos:**

1. El gestor busca y selecciona una institución.
2. El sistema muestra la información general y el historial consolidado de la institución.
3. El gestor consulta solicitudes, estados, reservaciones, reprogramaciones, cancelaciones y visitas realizadas.
4. El gestor filtra el historial por periodo, estado o tipo de registro.
5. El sistema muestra el detalle de cada evento y su relación con la institución.

### Registrar comunicaciones con la institución

- **Rol:** Gestor de visitas escolares
- **Prioridad:** Media

Permitir documentar llamadas, correos y acuerdos relacionados con una solicitud o reservación para mantener la trazabilidad de la atención.

**Pasos:**

1. El gestor selecciona una solicitud o reservación.
2. El gestor inicia el registro de una comunicación.
3. El sistema solicita el tipo de comunicación, fecha, participantes, contenido y acuerdos.
4. El gestor captura la información y la envía.
5. El sistema valida y guarda la comunicación vinculada al registro seleccionado.
6. El sistema muestra la comunicación en la bitácora de la solicitud o reservación.

### Gestionar patrocinadores y donantes

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir registrar, actualizar y consultar la información de patrocinadores y donantes que participan en los programas del museo.

**Pasos:**

1. El gestor solicita consultar o registrar un patrocinador o donante.
2. El sistema muestra el formulario con los datos generales y de contacto.
3. El gestor captura o modifica la información correspondiente.
4. El sistema valida los datos obligatorios y posibles duplicados.
5. El sistema guarda la información y confirma la operación.
6. El sistema muestra el registro actualizado para su consulta.

### Configurar campañas y programas de apoyo

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir definir los programas educativos, modalidades de apoyo y campañas de patrocinio disponibles, incluyendo su ciclo de operación.

**Pasos:**

1. El gestor solicita crear o consultar un programa, modalidad o campaña.
2. El sistema muestra las opciones de configuración disponibles.
3. El gestor captura o modifica nombre, descripción, criterios, metas, vigencia y estado.
4. El sistema valida la consistencia de la configuración.
5. El gestor activa o cierra la campaña cuando corresponde.
6. El sistema guarda los cambios y actualiza la disponibilidad para los procesos relacionados.

### Registrar compromisos de patrocinio

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir documentar los compromisos acordados con patrocinadores y donantes, así como sus condiciones y fechas de cumplimiento.

**Pasos:**

1. El gestor selecciona un patrocinador o donante.
2. El sistema muestra sus campañas, programas y compromisos existentes.
3. El gestor registra el nuevo compromiso con alcance, recursos, beneficiarios, fechas y condiciones acordadas.
4. El sistema valida la información requerida.
5. El sistema guarda el compromiso y lo vincula con el patrocinador o donante.
6. El sistema habilita el seguimiento de su cumplimiento.

### Validar instituciones beneficiarias

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir revisar y validar que las instituciones propuestas cumplan los criterios establecidos para una campaña o programa de apoyo.

**Pasos:**

1. El gestor selecciona una campaña o programa con instituciones propuestas.
2. El sistema muestra la información y los criterios aplicables a cada institución.
3. El gestor revisa la elegibilidad y documentación disponible.
4. El gestor aprueba, rechaza o solicita información adicional para cada institución.
5. El sistema registra el resultado y la justificación de la validación.
6. El sistema actualiza la lista de instituciones beneficiarias autorizadas.

### Relacionar apoyos con instituciones y visitas

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir vincular apoyos, campañas y donativos con las instituciones y visitas educativas beneficiadas para mantener la trazabilidad del patrocinio.

**Pasos:**

1. El gestor selecciona un apoyo, campaña o donativo.
2. El sistema muestra las instituciones y visitas disponibles para vinculación.
3. El gestor selecciona las instituciones y visitas beneficiadas.
4. El sistema valida que la relación sea compatible con el programa, campaña y criterios de apoyo.
5. El gestor confirma la vinculación.
6. El sistema guarda las relaciones y actualiza la trazabilidad del beneficio.

### Registrar aplicación de recursos y beneficios

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir registrar la entrega o aplicación de recursos y beneficios asociados a las visitas patrocinadas.

**Pasos:**

1. El gestor selecciona el compromiso, apoyo o visita correspondiente.
2. El sistema muestra los recursos y beneficios previstos.
3. El gestor registra la entrega o aplicación, fecha, monto o cantidad, responsable y evidencia disponible.
4. El sistema valida que la aplicación corresponda al apoyo autorizado.
5. El sistema guarda el registro y actualiza el avance del compromiso.
6. El sistema deja disponible la información para consultas y reportes.

### Consultar historial de relación institucional

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir consultar de forma consolidada los acuerdos, apoyos, campañas y visitas relacionados con cada patrocinador o donante.

**Pasos:**

1. El gestor selecciona un patrocinador o donante.
2. El sistema recupera sus acuerdos, compromisos, campañas, apoyos, entregas y visitas relacionadas.
3. El gestor aplica filtros por periodo, programa, campaña o estado.
4. El sistema presenta el historial ordenado y el detalle de cada relación.
5. El gestor consulta los registros requeridos.

### Dar seguimiento a metas de patrocinio

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir consultar el avance y cumplimiento de las metas definidas para campañas, programas y patrocinadores.

**Pasos:**

1. El gestor selecciona una campaña, programa o patrocinador.
2. El sistema calcula el avance con base en instituciones, visitas, recursos y beneficios registrados.
3. El sistema compara los resultados con las metas establecidas.
4. El gestor consulta indicadores, desviaciones y pendientes.
5. El sistema permite desglosar los resultados por periodo, zona, nivel educativo, tipo de institución o modalidad de visita.

### Generar reportes de patrocinio

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir generar reportes de resultados por patrocinador, campaña y programa para informar el alcance y los beneficios obtenidos.

**Pasos:**

1. El gestor selecciona el tipo de reporte y los criterios de consulta.
2. El sistema recupera la información de apoyos, instituciones, visitas, recursos y metas.
3. El sistema consolida los resultados conforme a los filtros seleccionados.
4. El gestor revisa la vista previa del reporte.
5. El gestor solicita la generación o exportación del reporte.
6. El sistema genera el archivo en un formato disponible y registra la operación.

### Gestionar alertas de seguimiento institucional

- **Rol:** Gestor de relaciones institucionales
- **Prioridad:** Media

Permitir recibir y atender alertas relacionadas con compromisos próximos a vencer, campañas sin avance y datos pendientes de validación.

**Pasos:**

1. El sistema identifica compromisos próximos a vencer, campañas sin avance y registros pendientes de validación.
2. El sistema genera las alertas según las reglas configuradas.
3. El gestor consulta la bandeja de alertas y filtra por tipo, prioridad o estado.
4. El gestor revisa el detalle de cada alerta y registra la acción de seguimiento.
5. El sistema actualiza el estado de la alerta y conserva su historial de atención.

### Consultar apoyos otorgados

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir consultar el detalle de los apoyos otorgados a cada institución y visita.

**Pasos:**

1. El responsable selecciona una institución, visita, campaña, patrocinador o periodo de consulta.
2. El sistema busca los apoyos relacionados con los criterios indicados.
3. El sistema muestra el detalle de cada apoyo, incluyendo institución, visita, beneficiarios, patrocinador, campaña, monto o recurso otorgado, fecha y estado.
4. El responsable revisa la información de los apoyos otorgados.

### Validar información de beneficiarios

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir validar la integridad y vigencia de los datos de instituciones, visitas y personas beneficiarias asociados a un apoyo.

**Pasos:**

1. El responsable selecciona un apoyo o un conjunto de registros pendientes de validación.
2. El sistema muestra los datos de la institución, visita y personas beneficiarias relacionados.
3. El responsable revisa la información y determina si es correcta, requiere corrección o no es válida.
4. El responsable registra el resultado de la validación y, cuando corresponde, los motivos o comentarios.
5. El sistema actualiza el estado de validación y conserva la fecha y el responsable de la operación.

### Dar seguimiento al cumplimiento de metas

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir consultar y monitorear el avance de las metas de atención y apoyo por campaña, patrocinador y periodo.

**Pasos:**

1. El responsable selecciona una campaña, patrocinador, periodo o combinación de filtros.
2. El sistema recupera las metas configuradas y los resultados acumulados correspondientes.
3. El sistema calcula el avance porcentual y la diferencia entre lo planeado y lo alcanzado.
4. El sistema presenta indicadores de cumplimiento, pendientes y posibles desviaciones.
5. El responsable revisa el estado del cumplimiento de las metas.

### Comparar resultados por periodo

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir comparar apoyos, beneficiarios y visitas registrados entre distintos periodos.

**Pasos:**

1. El responsable selecciona dos o más periodos de comparación.
2. El sistema consulta los apoyos, beneficiarios y visitas registrados en cada periodo.
3. El sistema calcula las variaciones absolutas y porcentuales entre los periodos.
4. El sistema presenta los resultados en tablas o indicadores comparativos.
5. El responsable analiza las diferencias y tendencias identificadas.

### Registrar observaciones administrativas

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir documentar observaciones relacionadas con apoyos, beneficiarios, metas o resultados.

**Pasos:**

1. El responsable selecciona el registro administrativo al que desea asociar una observación.
2. El sistema muestra la información del registro seleccionado.
3. El responsable captura el texto de la observación y, cuando aplica, su categoría o prioridad.
4. El responsable confirma el registro de la observación.
5. El sistema guarda la observación con fecha, usuario y vínculo al registro correspondiente.

### Identificar inconsistencias en registros

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir consultar alertas sobre datos incompletos, duplicados o inconsistentes en los apoyos y sus beneficiarios.

**Pasos:**

1. El responsable solicita la revisión de inconsistencias o accede al listado de alertas administrativas.
2. El sistema analiza los registros de apoyos, instituciones, visitas y beneficiarios conforme a las reglas de validación.
3. El sistema identifica y clasifica datos incompletos, duplicados o inconsistentes.
4. El sistema muestra cada alerta con el registro afectado y la causa detectada.
5. El responsable consulta la alerta y da seguimiento a su corrección.

### Consultar historial administrativo de una institución

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir consultar de forma consolidada el historial de apoyos, visitas, beneficiarios y validaciones de una institución.

**Pasos:**

1. El responsable busca y selecciona una institución.
2. El sistema recupera los apoyos, visitas, beneficiarios y validaciones asociados a la institución.
3. El sistema organiza la información cronológicamente y por tipo de actividad.
4. El responsable consulta el historial consolidado y aplica filtros cuando sea necesario.
5. El sistema muestra el detalle de cada evento administrativo relacionado.

### Generar reporte de seguimiento de apoyos

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir generar y exportar reportes de apoyos, beneficiarios, metas y resultados para seguimiento administrativo.

**Pasos:**

1. El responsable selecciona el tipo de reporte y define filtros como periodo, campaña, patrocinador, institución o zona.
2. El sistema consulta y consolida la información correspondiente.
3. El sistema genera el reporte con apoyos, beneficiarios, metas, avances y resultados.
4. El responsable revisa la vista previa del reporte.
5. El responsable solicita la exportación en un formato disponible.
6. El sistema genera el archivo y permite descargarlo.

### Consultar trazabilidad de cambios

- **Rol:** Responsable de administración y seguimiento de apoyos
- **Prioridad:** Media

Permitir consultar la bitácora de modificaciones realizadas sobre los registros administrativos.

**Pasos:**

1. El responsable selecciona un registro, usuario, tipo de operación o rango de fechas para consultar la bitácora.
2. El sistema recupera los eventos de creación, modificación o eliminación relacionados.
3. El sistema muestra el usuario, fecha, operación, registro afectado y detalle de los cambios.
4. El responsable filtra o revisa los eventos de trazabilidad.
5. El sistema permite consultar los valores anteriores y posteriores cuando estén disponibles.

### Registrar institución

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante registre una escuela, asociación o institución con sus datos generales, de contacto, ubicación y características institucionales.

**Pasos:**

1. El representante selecciona la opción para registrar una institución.
2. El sistema muestra el formulario de datos generales, contacto, ubicación y características institucionales.
3. El representante captura la información requerida y la envía.
4. El sistema valida los datos y señala los campos faltantes o incorrectos, si existen.
5. El sistema registra la institución y confirma el alta de la información.

### Actualizar datos institucionales

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante mantenga actualizados los datos de su institución y de la persona de contacto.

**Pasos:**

1. El representante consulta el perfil de su institución.
2. El sistema muestra los datos institucionales y de contacto registrados.
3. El representante modifica la información necesaria y envía los cambios.
4. El sistema valida y guarda la información actualizada.
5. El sistema confirma la actualización de los datos institucionales.

### Enviar solicitud de visita

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante envíe una solicitud de visita educativa con la fecha preferida, cantidad estimada de asistentes, nivel educativo y modalidad de visita.

**Pasos:**

1. El representante selecciona la opción para crear una solicitud de visita.
2. El sistema muestra el formulario de solicitud y la información institucional disponible.
3. El representante captura la fecha preferida, cantidad estimada de asistentes, nivel educativo, modalidad y demás datos requeridos.
4. El representante envía la solicitud.
5. El sistema valida la información, registra la solicitud y asigna un identificador y estado inicial.
6. El sistema muestra la confirmación del envío.

### Consultar estado de solicitud

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante consulte el estado actual y los detalles de sus solicitudes de visita.

**Pasos:**

1. El representante accede al listado de sus solicitudes.
2. El sistema muestra las solicitudes asociadas con la institución y su estado actual.
3. El representante selecciona una solicitud.
4. El sistema muestra sus detalles, fechas, datos registrados, observaciones y acciones pendientes, cuando corresponda.

### Complementar información de solicitud

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante responda solicitudes de aclaración y complete información faltante para que una solicitud pueda continuar su revisión.

**Pasos:**

1. El representante consulta una solicitud que requiere información adicional.
2. El sistema muestra la aclaración solicitada, los campos pendientes y el plazo aplicable, si existe.
3. El representante captura la información o adjunta los datos requeridos.
4. El representante envía la respuesta.
5. El sistema valida y registra la información complementaria.
6. El sistema actualiza la solicitud y confirma su reenvío para revisión.

### Consultar detalles de visita confirmada

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante consulte la información operativa de una visita confirmada o programada.

**Pasos:**

1. El representante accede a sus visitas confirmadas o programadas.
2. El sistema muestra el listado de visitas disponibles.
3. El representante selecciona una visita.
4. El sistema muestra la fecha, horario, modalidad, cantidad registrada, sede, instrucciones y demás detalles confirmados.

### Solicitar modificación o cancelación de visita

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante envíe una solicitud para reprogramar o cancelar una visita confirmada o programada.

**Pasos:**

1. El representante consulta los detalles de una visita confirmada o programada.
2. El representante selecciona solicitar modificación o cancelación.
3. El sistema muestra el formulario correspondiente y las condiciones aplicables.
4. El representante indica el tipo de solicitud, proporciona la justificación y propone una nueva fecha cuando corresponda.
5. El representante envía la solicitud.
6. El sistema registra la petición, actualiza su estado y confirma que será revisada por el museo.

### Consultar historial de participación institucional

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Permitir que el representante consulte el historial de solicitudes y visitas de su institución.

**Pasos:**

1. El representante accede al historial institucional.
2. El sistema muestra las solicitudes y visitas registradas de la institución.
3. El representante filtra o selecciona un registro por periodo, estado o tipo de actividad.
4. El sistema muestra los detalles y resultados disponibles del registro seleccionado.

### Recibir notificaciones del proceso

- **Rol:** Representante de institución solicitante
- **Prioridad:** Media

Informar al representante sobre cambios relevantes en sus datos institucionales, solicitudes y visitas.

**Pasos:**

1. El sistema detecta un evento relevante, como cambio de estado, solicitud de información, confirmación, modificación o cancelación.
2. El sistema genera una notificación asociada con la institución o solicitud correspondiente.
3. El sistema entrega la notificación mediante los canales configurados para el representante.
4. El representante consulta la notificación.
5. El sistema muestra el mensaje, el evento relacionado y las acciones pendientes, si existen.

### Consultar tablero ejecutivo de resultados

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo consultar una visión consolidada de los principales indicadores de cobertura, atención, patrocinio e impacto, con capacidad de análisis por periodos y dimensiones relevantes.

**Pasos:**

1. El actor accede al tablero ejecutivo.
2. El sistema muestra los principales indicadores consolidados de cobertura, atención, patrocinio e impacto.
3. El actor selecciona un periodo y, opcionalmente, una zona geográfica, nivel educativo, tipo de institución o modalidad de visita.
4. El sistema actualiza los indicadores y visualizaciones conforme a los filtros seleccionados.
5. El actor consulta la evolución histórica de los indicadores y compara los resultados de programas y modalidades de visita.
6. El sistema presenta las tendencias y comparativos correspondientes.

### Analizar cobertura territorial

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo analizar geográficamente la cobertura del museo e identificar instituciones atendidas, pendientes y no atendidas.

**Pasos:**

1. El actor accede al mapa de cobertura territorial.
2. El sistema muestra la ubicación geográfica de las instituciones y las clasifica según su estado de atención.
3. El actor aplica filtros por periodo, zona geográfica, nivel educativo, tipo de institución o modalidad de visita.
4. El sistema actualiza el mapa y resalta las zonas con alta, baja o nula atención.
5. El actor selecciona una institución o zona en el mapa.
6. El sistema muestra el resumen de atención y los datos relacionados con la institución o zona seleccionada.

### Consultar instituciones pendientes de atención

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo identificar instituciones que se encuentran en espera o que no cuentan con visitas registradas para apoyar la priorización de atención.

**Pasos:**

1. El actor solicita el listado de instituciones pendientes de atención.
2. El sistema consulta las instituciones en espera o sin visitas registradas.
3. El sistema muestra el listado con el estado de atención, ubicación, tipo de institución y datos relevantes.
4. El actor filtra u ordena el listado por periodo, zona geográfica, nivel educativo o tipo de institución.
5. El sistema actualiza los resultados conforme a los criterios seleccionados.
6. El actor consulta el detalle de una institución para conocer su situación de atención.

### Comparar metas y resultados de patrocinio

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo comparar las metas comprometidas con los resultados alcanzados por campaña y patrocinador para evaluar el cumplimiento de los compromisos de patrocinio.

**Pasos:**

1. El actor accede al módulo de resultados de patrocinio.
2. El sistema muestra las campañas y patrocinadores disponibles.
3. El actor selecciona una o más campañas, patrocinadores y periodos de comparación.
4. El sistema presenta las metas comprometidas, los resultados alcanzados y las variaciones correspondientes.
5. El actor consulta el detalle de los indicadores y apoyos asociados.
6. El sistema muestra los registros que sustentan los resultados comparados.

### Exportar reportes ejecutivos

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo exportar tableros, indicadores, mapas y resultados filtrados para elaborar informes institucionales y apoyar la rendición de cuentas.

**Pasos:**

1. El actor configura los filtros y la vista que desea reportar.
2. El actor selecciona el tipo de información y el formato de exportación.
3. El sistema genera el reporte con los indicadores, visualizaciones y filtros aplicados.
4. El sistema incorpora el periodo consultado y la fecha de generación.
5. El actor descarga el archivo exportado.

### Consultar calidad y detalle de indicadores

- **Rol:** Directivo o consultor de resultados
- **Prioridad:** Media

Permitir al directivo verificar la fecha de actualización, el estado de validación y los registros que sustentan cada indicador consultado.

**Pasos:**

1. El actor selecciona un indicador del tablero o de un reporte.
2. El sistema muestra la fecha de la última actualización y el estado de calidad de los datos.
3. El sistema informa si existen registros pendientes de validación.
4. El actor solicita el detalle del indicador.
5. El sistema muestra los registros que sustentan el cálculo, junto con su estado de validación.
6. El actor revisa la información de respaldo del indicador.

### Monitorear disponibilidad de servicios

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Visualizar el estado de disponibilidad, rendimiento y operación de los servicios principales de la plataforma para detectar oportunamente degradaciones o interrupciones.

**Pasos:**

1. El responsable de sistemas accede al módulo de monitoreo.
2. El sistema consulta el estado de los servicios principales.
3. El sistema muestra indicadores de disponibilidad, rendimiento y estado operativo.
4. El sistema identifica y destaca servicios con degradación o interrupción.
5. El responsable de sistemas revisa los detalles y determina las acciones de soporte necesarias.

### Gestionar incidencias técnicas

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Registrar, clasificar, asignar, dar seguimiento y cerrar incidencias técnicas reportadas por los usuarios de la plataforma.

**Pasos:**

1. El responsable de sistemas registra una nueva incidencia o consulta una incidencia reportada.
2. El sistema solicita y almacena la descripción, origen, prioridad y categoría de la incidencia.
3. El responsable de sistemas asigna la incidencia al técnico correspondiente.
4. El sistema actualiza el estado y conserva el historial de seguimiento.
5. El responsable de sistemas registra las acciones realizadas y la solución aplicada.
6. El responsable de sistemas valida la resolución y cierra la incidencia.
7. El sistema notifica el cambio de estado a los usuarios involucrados.

### Administrar respaldos de información

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Configurar, ejecutar y verificar respaldos automáticos de la base de datos y de los archivos relevantes de la plataforma.

**Pasos:**

1. El responsable de sistemas accede a la configuración de respaldos.
2. El sistema muestra las políticas, frecuencias, destinos y últimos respaldos configurados.
3. El responsable de sistemas define o modifica la programación y los componentes a respaldar.
4. El sistema valida la configuración y activa la ejecución automática.
5. El sistema ejecuta los respaldos conforme a la programación establecida.
6. El sistema verifica la integridad y disponibilidad de cada respaldo.
7. El sistema registra el resultado y alerta sobre respaldos fallidos o incompletos.

### Restaurar información respaldada

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Ejecutar y validar la restauración de información desde un respaldo autorizado, preservando la continuidad y consistencia de la plataforma.

**Pasos:**

1. El responsable de sistemas solicita una restauración e indica el respaldo autorizado y el alcance de la información.
2. El sistema valida los permisos del responsable y la disponibilidad del respaldo seleccionado.
3. El sistema solicita la confirmación de la restauración y advierte sus posibles efectos.
4. El responsable de sistemas confirma la operación.
5. El sistema ejecuta la restauración en el entorno correspondiente.
6. El sistema verifica la integridad y consistencia de la información restaurada.
7. El sistema registra el resultado de la operación y reporta errores o diferencias detectadas.

### Supervisar integridad de datos

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Ejecutar revisiones técnicas para detectar registros incompletos, inconsistentes, duplicados o relaciones inválidas en la información de la plataforma.

**Pasos:**

1. El responsable de sistemas inicia una revisión de integridad o consulta una revisión programada.
2. El sistema analiza los registros, campos obligatorios, duplicidades y relaciones entre entidades.
3. El sistema identifica y clasifica las anomalías encontradas.
4. El sistema genera un resultado con el detalle, ubicación y severidad de cada anomalía.
5. El responsable de sistemas revisa los hallazgos y registra las acciones correctivas o los envía al área responsable.
6. El sistema conserva el historial de revisiones y su resultado.

### Auditar operaciones críticas

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Consultar la bitácora de accesos y operaciones críticas realizadas en la plataforma para facilitar la trazabilidad y el control técnico.

**Pasos:**

1. El responsable de sistemas accede a la bitácora de auditoría.
2. El sistema solicita los criterios de búsqueda, como usuario, fecha, módulo, operación o resultado.
3. El sistema recupera y muestra los eventos que cumplen los criterios.
4. El responsable de sistemas consulta el detalle de cada evento, incluyendo usuario, fecha, operación y resultado.
5. El sistema permite filtrar, ordenar y exportar la información autorizada.
6. El sistema registra la consulta de auditoría cuando corresponda a una operación sensible.

### Supervisar eventos de seguridad

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Recibir, revisar y atender alertas relacionadas con accesos fallidos, actividades inusuales y posibles intentos de acceso no autorizado.

**Pasos:**

1. El sistema detecta un evento de seguridad conforme a las reglas configuradas.
2. El sistema genera y envía una alerta al responsable de sistemas.
3. El responsable de sistemas consulta el detalle, contexto y nivel de riesgo del evento.
4. El responsable de sistemas clasifica el evento y registra las acciones de atención.
5. El sistema permite marcar la alerta como atendida, descartada o escalada.
6. El sistema conserva la evidencia y el historial de seguimiento del evento.

### Gestionar ventanas de mantenimiento

- **Rol:** Responsable de sistemas y soporte técnico
- **Prioridad:** Media

Programar, controlar y comunicar ventanas de mantenimiento técnico para reducir el impacto en la operación de la plataforma.

**Pasos:**

1. El responsable de sistemas registra una ventana de mantenimiento con fecha, duración, servicios afectados y descripción.
2. El sistema valida que la ventana no se contraponga con otras actividades críticas.
3. El responsable de sistemas confirma la programación del mantenimiento.
4. El sistema comunica el mantenimiento a los usuarios y áreas involucradas.
5. El sistema muestra el mantenimiento como programado y posteriormente como en ejecución.
6. El responsable de sistemas registra la finalización, retrasos o incidencias ocurridas.
7. El sistema actualiza el estado y conserva el historial de la ventana de mantenimiento.

## Modelo de datos (53 objetos)

### Ubicación geográfica

Entidad que representa la referencia territorial de una institución para análisis y visualización de cobertura.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único de la ubicación geográfica. |
| institutionId | uuid | — | Sí | Identificador de la institución asociada. |
| address | text | — | Sí | Domicilio de la institución. |
| city | text | — | Sí | Ciudad o municipio. |
| state | text | — | Sí | Entidad federativa o estado. |
| postalCode | text | — | — | Código postal. |
| latitude | decimal | — | Sí | Latitud para la visualización cartográfica. |
| longitude | decimal | — | Sí | Longitud para la visualización cartográfica. |

### Lista de espera

Registro de instituciones que esperan disponibilidad para participar en una visita educativa.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del registro de espera. |
| institutionId | uuid | — | Sí | Identificador de la institución solicitante. |
| requestDate | date | — | Sí | Fecha en que se incorporó la institución a la lista de espera. |
| priority | number | — | — | Nivel de prioridad asignado a la solicitud. |
| status | text | — | Sí | Estado actual del registro de espera. |
| notes | textarea | — | — | Observaciones y detalles del seguimiento. |

### Comunicación institucional

Registro de interacciones y comunicaciones realizadas con una institución durante su seguimiento.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único de la comunicación. |
| institutionId | uuid | — | Sí | Identificador de la institución relacionada. |
| communicationDate | datetime | — | Sí | Fecha y hora de la comunicación. |
| channel | text | — | Sí | Medio utilizado para la comunicación. |
| subject | text | — | Sí | Asunto principal de la comunicación. |
| summary | textarea | — | Sí | Resumen de los temas tratados y acuerdos. |
| followUpDate | date | — | — | Fecha prevista para el seguimiento. |

### Patrocinador

Entidad que representa a una organización o persona que proporciona recursos para los programas del museo.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del patrocinador. |
| tipo | text | — | Sí | Tipo de patrocinador, como persona u organización. |
| nombre | text | — | Sí | Nombre o razón social del patrocinador. |
| personaContacto | text | — | — | Nombre de la persona responsable del contacto. |
| email | email | — | — | Correo electrónico de contacto. |
| telefono | phone | — | — | Teléfono de contacto. |
| estaActivo | boolean | — | Sí | Indica si el patrocinador mantiene una relación activa. |

### Donante

Entidad que identifica a la persona u organización que realiza una aportación destinada a los programas de apoyo.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del donante. |
| tipo | text | — | Sí | Tipo de donante, como persona u organización. |
| nombre | text | — | Sí | Nombre o razón social del donante. |
| personaContacto | text | — | — | Nombre de la persona responsable del contacto. |
| email | email | — | — | Correo electrónico de contacto. |
| telefono | phone | — | — | Teléfono de contacto. |
| estaActivo | boolean | — | Sí | Indica si el donante mantiene una relación activa. |

### Campaña de patrocinio

Iniciativa organizada para captar, asignar y dar seguimiento a recursos de patrocinio.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único de la campaña de patrocinio. |
| nombre | text | — | Sí | Nombre de la campaña. |
| descripcion | textarea | — | — | Descripción, objetivos y alcance de la campaña. |
| fechaInicio | date | — | Sí | Fecha de inicio de la campaña. |
| fechaFin | date | — | — | Fecha de finalización de la campaña. |
| metaFinanciera | decimal | — | — | Monto financiero objetivo de la campaña. |
| estado | text | — | Sí | Estado actual de la campaña, como planificada, activa, pausada o cerrada. |

### Programa de apoyo

Esquema institucional que define una modalidad de apoyo y sus objetivos de atención.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del programa de apoyo. |
| nombre | text | — | Sí | Nombre del programa o modalidad de apoyo. |
| descripcion | textarea | — | — | Descripción general del programa, sus alcances y condiciones. |
| modalidadVisita | text | — | Sí | Modalidad de visita educativa asociada al programa. |
| objetivoAtencion | textarea | — | Sí | Objetivo de atención y población beneficiaria del programa. |
| metaAtencion | number | — | — | Cantidad objetivo de beneficiarios o instituciones a atender. |
| fechaInicio | date | — | Sí | Fecha de inicio de vigencia del programa. |
| fechaFin | date | — | — | Fecha de término de vigencia del programa. |

### Compromiso de patrocinio

Acuerdo que formaliza los recursos, beneficios o acciones comprometidos por un patrocinador.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del compromiso de patrocinio. |
| programaApoyoId | uuid | — | Sí | Programa de apoyo al que corresponde el compromiso. |
| patrocinadorNombre | text | — | Sí | Nombre del patrocinador o donante que establece el compromiso. |
| descripcion | textarea | — | Sí | Detalle de los recursos, beneficios o acciones comprometidos. |
| montoComprometido | decimal | — | — | Valor monetario total comprometido por el patrocinador. |
| fechaCompromiso | date | — | Sí | Fecha en que se formalizó el compromiso. |
| fechaCumplimiento | date | — | — | Fecha prevista o efectiva de cumplimiento del compromiso. |
| estado | text | — | Sí | Estado actual del compromiso, como pendiente, parcial, cumplido o cancelado. |

### Apoyo otorgado

Registro del beneficio o recurso asignado a una institución beneficiaria dentro de un programa.

| Campo | Tipo | PK | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| id | uuid | Sí | Sí | Identificador único del apoyo otorgado. |
| programaApoyoId | uuid | — | Sí | Programa de apoyo del que proviene el beneficio. |
| compromisoPatrocinioId | uuid | — | — | Compromiso de patrocinio que respalda el apoyo otorgado. |
| institucionId | uuid | — | Sí | Institución beneficiaria que recibe el apoyo. |
| visitaId | uuid | — | — | Visita educativa relacionada con la aplicación del apoyo. |
| tipoBeneficio | text | — | Sí | Tipo de recurso o beneficio otorgado. |
| montoOtorgado | decimal | — | — | Valor monetario del apoyo otorgado. |
| fechaOtorgamiento | date | — | Sí | Fecha en que se asignó o entregó el apoyo. |

### Aplicación de recurso

Registro de la entrega o utilización efectiva de recursos destinados a una institución o visita.

### Meta de patrocinio

Objetivo cuantificable de atención, cobertura o aplicación de recursos para un periodo determinado.

### Indicador de resultado

Medida calculada para evaluar cobertura, atención, participación, recursos e impacto del programa.

### Notificación de proceso

Aviso generado para informar cambios, pendientes o eventos relevantes del ciclo de una solicitud o visita.

### Observación administrativa

Registro de una nota de control, aclaración o hallazgo relacionado con la información institucional o los apoyos.

### Incidencia técnica

Registro de una falla, interrupción o problema operativo de la plataforma que requiere atención.

### Respaldo de información

Registro de una copia de seguridad utilizada para proteger y recuperar la información del sistema.

### Evento de seguridad

Registro de una actividad o situación relacionada con accesos inseguros, sesiones o controles de seguridad.

### Ventana de mantenimiento

Periodo planificado para realizar tareas técnicas que pueden afectar la disponibilidad de la plataforma.

### Ubicación geográfica

Entidad que representa la referencia territorial de una institución para análisis y visualización de cobertura.

### Lista de espera

Registro de instituciones que esperan disponibilidad para participar en una visita educativa.

### Comunicación institucional

Registro de interacciones y comunicaciones realizadas con una institución durante su seguimiento.

### Patrocinador

Entidad que representa a una organización o persona que proporciona recursos para los programas del museo.

### Donante

Entidad que identifica a la persona u organización que realiza una aportación destinada a los programas de apoyo.

### Campaña de patrocinio

Iniciativa organizada para captar, asignar y dar seguimiento a recursos de patrocinio.

### Programa de apoyo

Esquema institucional que define una modalidad de apoyo y sus objetivos de atención.

### Compromiso de patrocinio

Acuerdo que formaliza los recursos, beneficios o acciones comprometidos por un patrocinador.

### Apoyo otorgado

Registro del beneficio o recurso asignado a una institución beneficiaria dentro de un programa.

### Aplicación de recurso

Registro de la entrega o utilización efectiva de recursos destinados a una institución o visita.

### Meta de patrocinio

Objetivo cuantificable de atención, cobertura o aplicación de recursos para un periodo determinado.

### Indicador de resultado

Medida calculada para evaluar cobertura, atención, participación, recursos e impacto del programa.

### Notificación de proceso

Aviso generado para informar cambios, pendientes o eventos relevantes del ciclo de una solicitud o visita.

### Observación administrativa

Registro de una nota de control, aclaración o hallazgo relacionado con la información institucional o los apoyos.

### Incidencia técnica

Registro de una falla, interrupción o problema operativo de la plataforma que requiere atención.

### Respaldo de información

Registro de una copia de seguridad utilizada para proteger y recuperar la información del sistema.

### Evento de seguridad

Registro de una actividad o situación relacionada con accesos inseguros, sesiones o controles de seguridad.

### Ventana de mantenimiento

Periodo planificado para realizar tareas técnicas que pueden afectar la disponibilidad de la plataforma.

### Ubicación geográfica

Entidad que representa la referencia territorial de una institución para análisis y visualización de cobertura.

### Lista de espera

Registro de instituciones que esperan disponibilidad para participar en una visita educativa.

### Comunicación institucional

Registro de interacciones y comunicaciones realizadas con una institución durante su seguimiento.

### Patrocinador

Entidad que representa a una organización o persona que proporciona recursos para los programas del museo.

### Donante

Entidad que identifica a la persona u organización que realiza una aportación destinada a los programas de apoyo.

### Campaña de patrocinio

Iniciativa organizada para captar, asignar y dar seguimiento a recursos de patrocinio.

### Programa de apoyo

Esquema institucional que define una modalidad de apoyo y sus objetivos de atención.

### Compromiso de patrocinio

Acuerdo que formaliza los recursos, beneficios o acciones comprometidos por un patrocinador.

### Apoyo otorgado

Registro del beneficio o recurso asignado a una institución beneficiaria dentro de un programa.

### Aplicación de recurso

Registro de la entrega o utilización efectiva de recursos destinados a una institución o visita.

### Meta de patrocinio

Objetivo cuantificable de atención, cobertura o aplicación de recursos para un periodo determinado.

### Indicador de resultado

Medida calculada para evaluar cobertura, atención, participación, recursos e impacto del programa.

### Notificación de proceso

Aviso generado para informar cambios, pendientes o eventos relevantes del ciclo de una solicitud o visita.

### Observación administrativa

Registro de una nota de control, aclaración o hallazgo relacionado con la información institucional o los apoyos.

### Incidencia técnica

Registro de una falla, interrupción o problema operativo de la plataforma que requiere atención.

### Respaldo de información

Registro de una copia de seguridad utilizada para proteger y recuperar la información del sistema.

### Evento de seguridad

Registro de una actividad o situación relacionada con accesos inseguros, sesiones o controles de seguridad.

## Épicas (7)

### Administrador de plataforma

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Administrador de plataforma.

### Gestor de visitas escolares

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Gestor de visitas escolares.

### Gestor de relaciones institucionales

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Gestor de relaciones institucionales.

### Responsable de administración y seguimiento de apoyos

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Responsable de administración y seguimiento de apoyos.

### Representante de institución solicitante

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Representante de institución solicitante.

### Directivo o consultor de resultados

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Directivo o consultor de resultados.

### Responsable de sistemas y soporte técnico

- **Estado:** Abierta
- **Prioridad:** Media

Implementar capacidades para el rol Responsable de sistemas y soporte técnico.

---

_Fin de la especificación._